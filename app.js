// ____           _____ _____ _____      __  __  ____  _____  _    _ _      ______  _____ 
//|  _ \   /\    / ____|_   _/ ____|    |  \/  |/ __ \|  __ \| |  | | |    |  ____|/ ____|
//| |_) | /  \  | (___   | || |         | \  / | |  | | |  | | |  | | |    | |__  | (___  
//|  _ < / /\ \  \___ \  | || |         | |\/| | |  | | |  | | |  | | |    |  __|  \___ \ 
//| |_) / ____ \ ____) |_| || |____     | |  | | |__| | |__| | |__| | |____| |____ ____) |
//|____/_/    \_\_____/|_____\_____|    |_|  |_|\____/|_____/ \____/|______|______|_____/ 
//Imports the basic modules required for the server to run

const express = require('express')
var app = express()
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
var fs = require('fs');

//  _____ ______ _______ _______ _____ _   _  _____  _____ 
///  ____|  ____|__   __|__   __|_   _| \ | |/ ____|/ ____|
//| (___ | |__     | |     | |    | | |  \| | |  __| (___  
// \___ \|  __|    | |     | |    | | | . ` | | |_ |\___ \ 
// ____) | |____   | |     | |   _| |_| |\  | |__| |____) |
//|_____/|______|  |_|     |_|  |_____|_| \_|\_____|_____/ 
//Sets up the listen server

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./static'))
app.use('/fonts', express.static(__dirname + '/fonts'));
var port = 1010
var ip = '127.0.0.1' //I don't know why this is here or if we need it. 
//listen server
app.listen(port, function () {
  console.log("enter your browser and enter localhost:" + port + " in the URL bar")
})

// __  __          _____       _____        _____ ______ 
//|  \/  |   /\   |  __ \     |  __ \ /\   / ____|  ____|
//| \  / |  /  \  | |__) |    | |__) /  \ | |  __| |__   
//| |\/| | / /\ \ |  ___/     |  ___/ /\ \| | |_ |  __|  
//| |  | |/ ____ \| |         | |  / ____ \ |__| | |____ 
//|_|  |_/_/    \_\_|         |_| /_/    \_\_____|______|
//All the code that is required for OpenStreetMap to work on /districts

const osmtogeojson = require('osmtogeojson');
const https = require('https');

function fetchGeoJson(relationId) {
  const query = `[out:json];relation(${relationId});out geom;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const geojson = osmtogeojson(JSON.parse(data));
          resolve(geojson);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

app.get('/', async (req, res) => {
  try {
    const [geojson1, geojson2, geojson3, geojson4, geojson5, geojson6, geojson7] = await Promise.all([ //Add any new osm relation here
      //Add any new osm relation here
      fetchGeoJson(417442), //York County
      fetchGeoJson(15798307), //York City School District
      fetchGeoJson(15798797), //York Suburban School District
      fetchGeoJson(15805026), //West York Area School District
      fetchGeoJson(15806951), //Central york School District
      fetchGeoJson(15807383), //Dallastown Area School District
      fetchGeoJson(15831564), //Spring Grove Area School District
    ]);

    res.render('districtmap', { geojson1, geojson2, geojson3, geojson4, geojson5, geojson6, geojson7});//Add any new osm relation here
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});



