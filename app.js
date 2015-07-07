var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

var articleProvider = new ArticleProvider('localhost', 27017);

app.get('/', function(req, res) {
  articleProvider.findAll(function(error, docs) {
    res.render('index', { title: 'Blog', articles: docs });
  });
});

app.get('/blog/new', function(req, res) {
  res.render('blog_new.jade', { title: 'New Post'} );
});

app.post('/blog/new', function(req, res) {
  articleProvider.save({
    title: req.body['title'],
    body: req.body['body']
  }, function(error, docs) {
    res.redirect('/')
  });
});

app.get('/blog/:id', function(req, res) {
  articleProvider.findById(req.params.id, function(error, article) {
    res.render('blog_show.jade', { title: article.title, article: article });
  });
});

app.post('/blog/addComment', function(req, res) {
  articleProvider.addCommentToArticle(req.body['_id'], {
    person: req.body['person'],
    comment: req.body['comment'],
    created_at: new Date()
  }, function(error, docs) {
    res.redirect('/blog/' + req.body['_id'])
  });
});

app.listen(3000);
console.log('Listening on port 3000...');