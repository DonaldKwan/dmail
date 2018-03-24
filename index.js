var express = require('express');
var path = require('path');

// Create a new Express application
var app = express();

// Use the 'build' directory as the public static folder
app.use(express.static(path.join(__dirname, 'build')));

// Set port & listen for incoming HTTP requests
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
