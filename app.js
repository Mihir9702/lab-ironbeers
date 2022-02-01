const express = require('express');
const res = require('express/lib/response');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(path.join(__dirname, 'views/partials'));
// Register the location for handlebars partials here:

// ...

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(response => res.render('beers', { beers: response })) 
    .catch(err => console.log(err))
});

app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(beers => res.render('random-beer', { beer:
    { name: beers[0].name,
      id: beers[0].id,
      tagline: beers[0].tagline,
      image_url: beers[0].image_url,
      description: beers[0].description,
      brewerTips: beers[0].brewers_tips,
      foodPairing: beers[0].food_pairing }
    })) 
    .catch(err => console.log(err))
});

app.get('/beers/beer-:anything', (req, res) => {
  punkAPI
    .getBeers()
    .then(idResponse => res.render('beerid', {
       id: req.params.anything,
       name: idResponse[req.params.anything-1].name,
       description: idResponse[req.params.anything-1].description,
       firstBrew: idResponse[req.params.anything-1].first_brewed,
       volume: idResponse[req.params.anything-1].volume.value
       }))
    .catch(err => console.log(err))
})

app.get('*', (req, res) => {
  res.status(404).send('404 Page not found');
})

app.listen(3000, () => console.log('🏃‍ on port 3000'));
