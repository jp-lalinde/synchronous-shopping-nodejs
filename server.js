var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

  
const db = require('./app/config/db.config.js');
 
require('./app/routes/user.route.js')(app);
require('./app/routes/problem.route.js')(app);
 
// Create a Server
const PORT = process.env.PORT || 8080;
var server = app.listen(PORT, function () { 
  console.log(`Server listening on port ${PORT}...`);
})
