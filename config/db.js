const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://Alex:alexis90@ds245523.mlab.com:45523/polling')
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));