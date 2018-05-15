require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const randomstring = require('randomstring');
const bodyParser = require('body-parser');

const app = express();

const urls = [
  {
    slug: randomstring.generate(8),
    longUrl: 'https://www.naver.com'
  }
]

app.use(morgan('dev'));
app.use('/static', express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  const host = req.get('host');
  res.render('index.ejs', {urls, host});
})

app.get('/new', (req, res) => {
  if (req.query.secret !== process.env.SECRET) {
    res.status(401);
    res.send('401 Unauthorized');
  } else {
    res.render('new.ejs', {secret: process.env.SECRET});
  }
})

app.post('/new', (req, res) => {
  if (req.body.secret !== process.env.SECRET) {
    res.status(401);
    res.send('401 Unauthorized');
  } else {
    const longUrl = req.body.longUrl;
    const slug = randomstring.generate(8);
    urls.push({slug, longUrl});
    res.redirect('/');
  }
})

app.get('/:slug', (req, res) => {
  const urlItem = urls.find(item => item.slug === req.params.slug)
  if (urlItem) {
    res.redirect(301, urlItem.longUrl);
  } else {
    res.status(404);
    res.send('404 Not Found');
  }
})

app.listen(3000, () => {
  console.log('listening 3000...');
});