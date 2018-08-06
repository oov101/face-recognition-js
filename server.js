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

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Listening on port ${port}`));

