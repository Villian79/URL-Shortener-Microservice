//Model template for DB 
//require mongoose
var mongoose = require('mongoose');

var urlSchema = new mongoose.Schema({
    originalUrl: String,
    shorterUrl: String
}, {timestamp: true});

module.exports = mongoose.model('shortUrl', urlSchema);

