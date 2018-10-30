const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const poll = require('./routes/poll');

const app = express();

require('./config/db');

app.use(express.static(path.join(__dirname, 'public')));
//Body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Enable Cors
app.use(cors());
//routing
app.use('/poll', poll);

const port = 5000;

//Start Server
app.listen(port, () => { 
    console.log(`Server started on port ${port}`);
} );


