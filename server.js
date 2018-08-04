const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.get('/images/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/images',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });

});

app.get('/weights/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/weights',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });

});



app.listen(port, () => console.log(`Listening on port ${port}`));

