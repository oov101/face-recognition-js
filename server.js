const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 6000;

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Listening on port ${port}`));

