var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

var articleProvider = new ArticleProvider();

app.get('/', function(req, res) {
  articleProvider.findAll(function(error, docs) {
    res.render('index', { title: 'Blog', articles: docs });
  });
});

app.listen(3000);
console.log('Listening on port 3000...');