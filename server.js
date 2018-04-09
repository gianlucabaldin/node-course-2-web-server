const express = require ('express');
const hbs = require ('hbs');  //  "handlebars" template library as view engine
const fs = require('fs');

const port = process.env.PORT || 3000; // "process.env" stores all system variavbles with key-value pairs, and PORT is the new environment port set from Heroku
                                       //the "|| 3000" means of it's not found use a default of 3000
var app = express();

hbs.registerPartials(__dirname + '/views/partials');  // let hbs to use the partials, which are piece of hbs pages

app.set('view engine', 'hbs');  // store key-value, used to configure the behavior of the server (set() and get() works like localstorage.set() and get() methods)

// app.use() registers a MIDDLEWARE, next means what to do next --> if the logic won't finish, next won't be called and its handler (like app.get('/', (req, res) => {..
// so, the page will never be displayed) won't ever be fired --> if next() is never called the page will continue to load infinitly
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);  // logs into the server (node console)
  fs.appendFile('server.log', log + '\n', (err) => {   // create a new file server.log and print the log in a new line, 3rd parameter is to manage in case of error
    if(err) {
      console.log('unable to append to server.log');
    }
  })
  next();	// let the application to continue with its flow
});

// additional MIDDLEWARE management which renders a template without calling next() so the application stops here
// note that we had already defined another MIDDLEWARE handler above, no problem, it has run (in fact it had written into both log and file) and it let the application
// goes till here, which now stops it
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// use middleware - express.static() takes the root of the folder you want to surve up
app.use(express.static(__dirname + '/public'));  // "__dirname" takes "node-web-server + '/public' "

// create an Helper template, which is a global template can be used from all the hbs pages
hbs.registerHelper('getCurrentYear', () =>{   // first argument is the helper template, the second a callback function which will be printed inside 'getCurrentYear' helper
  return new Date().getFullYear();
})

// create an Helper template, which is a global template can be used from all the hbs pages, with a parameter used by the helper itself
hbs.registerHelper('screamIt', (text) =>{   // first argument is the helper template, the second a callback function which will be printed inside 'getCurrentYear' helper
  return text.toUpperCase();
})

// handler for http get request
// first param is the route of the app, and the "/" is the main root of the app, which will be "localhost:3000"
// the second the funtion to run (with 2 paramenters)
app.get('/', (req, res) => {

  // sends 'text/html' data response (default) to the requester (the browser)
  // response.send('<h1>hello express</h1>');

  // send 'application/json' data response to the requester (the browser), automatically parsed from the browser
  // response.send({
  //   name: 'gian',
  //   likes: ['dh','en']
  // });
  res.render('home.hbs', { // second object is a key-value object to be passed to the file which will be used to inject the values into it using {{varName}}
    pageTitle: 'Home page',
    //currentYear: new Date().getFullYear(), // no needed after 'getCurrentYear' helper declaration beacause it's like global and it's inherited inside home.hbs too
    welcomeMessage: 'Welcome to home.hbs'
  });
});

// create another root wich will be "localhost:3000/about" with "text/html" content-type response
app.get('/about', (req, res) => {
  // renders about.hbs file (which contains html code) MUST be placed into "/views" as default by the package itself
  res.render('about.hbs', { // second object is a key-value object to be passed to the file which will be used to inject the values into it using {{varName}}
    pageTitle: 'About page'//,
    //currentYear: new Date().getFullYear(), // no needed after 'getCurrentYear' helper declaration beacause it's like global and it's inherited inside about.hbs too
  });
});

// create another root wich will be "localhost:3000/bad" with "text/html" content-type response
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'unable to fullfill the request'
  });
});

// create another root wich will be "localhost:3000/portfolio" with "portfolio.hbs" as response
app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    welcomeMessage: 'Welcome to portfolio page',
    pageTitle: 'Projects'
  });
});


app.listen(port, () => {  // app start listening, bind the app to a port (3000) of the machine
  console.log(`server up on port ${port}`);
}); // - second argument is a callback function says when the server is actually up and listening
