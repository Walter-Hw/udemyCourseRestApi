const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser:true,
  useUnifiedTopology: true ,
  useFindAndModify: false
});

const articleSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
  .get((req, res) => {
    Article.find((err, results) => {
      if(!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err) => {
      if(!err) {
        res.send(`Added new article successfully!`);
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if(!err) {
        res.send('Successfully deleted all the articles!');
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, () => {
  console.log('Listening port 3000 now...');
});