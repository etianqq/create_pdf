/**
 * Created by Bird on 2016/1/3.
 */
//use express
var express = require('express'),
    cors = require('cors'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser');

var shell = require('shelljs');
var fs = require('fs');
var pdf = require('html-pdf');
var createFile = require('create-file');

//serve static index.html as default
app.use(express.static(__dirname + '/app/'));
app.use(bodyParser.json());
app.use(cors());
//bind and listen for connections on the given host and port
app.listen(9001, function () {
    console.log('Server listening on', 9001)
});

/*--------------------- REST API ---------------------*/
app.options('/createPdf', cors());
app.post('/createPdf', function (req, res) {
    var date = +new Date();
    var filepath = 'dis/pdf_' + date + '.html';
    var filename = 'pdf_' + date;
    createFile(filepath, req.body.content, function (err) {
        createPdf(filepath, filename, req, res);
    });
});

function createPdf(filepath, filename, req, res) {
    var response = res;
    var request = req;
    var html = fs.readFileSync(filepath, 'utf8');
    var options = {format: 'Letter'};

    pdf.create(html, options).toFile('./app/pdf/' + filename + '.pdf', function (err, res) {
        if (err) {
            return console.log(err);
        }
        var obj = "/pdf/" + filename + ".pdf";
        //if dataType is "jsonp" and callback name is "callback"
        if (request.query.callback) {
            response.jsonp(obj);
        }
        else {
            response.json(obj);
        }
    });
}
