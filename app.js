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
const { json } = require('body-parser');

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
  console.log("Listening on port " + port)


  convertExcelFileToJsonUsingXlsx('excel_Sheets/shops.xlsx', 'data.json') //this could likely be done in a function or something that allows pages to get updated and lets the server run continuously 
  //convertExcelFileToJsonUsingXlsx('testData.xlsx', 'testData.json')
})

// __  __          _____       _____        _____ ______ 
//|  \/  |   /\   |  __ \     |  __ \ /\   / ____|  ____|
//| \  / |  /  \  | |__) |    | |__) /  \ | |  __| |__   
//| |\/| | / /\ \ |  ___/     |  ___/ /\ \| | |_ |  __|  
//| |  | |/ ____ \| |         | |  / ____ \ |__| | |____ 
//|_|  |_/_/    \_\_|         |_| /_/    \_\_____|______|
//All the code that is required for OpenStreetMap to work on /districts

// Import required libraries
const osmtogeojson = require('osmtogeojson');
const https = require('https');

/**
 * Fetches the GeoJSON data for a given OSM relation ID.
 * @param {number} relationId - The OSM relation ID.
 * @returns {Promise<Object>} - A promise that resolves to the GeoJSON data.
 */
function fetchGeoJson(relationId) {
  // Create the Overpass query to retrieve the GeoJSON data for the relation ID
  const query = `[out:json];relation(${relationId});out geom;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  return new Promise((resolve, reject) => {
    // Make an HTTPS request to the Overpass API
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          // Convert the received data to GeoJSON using osmtogeojson library
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

// Define a route to handle '/districts' requests
app.get('/districts', async (req, res) => {
  try {
    // Fetch the GeoJSON data for multiple OSM relation IDs in parallel using Promise.all
    const [geojson1, geojson2, geojson3, geojson4, geojson5, geojson6, geojson7] = await Promise.all([
      fetchGeoJson(417442), // York County
      fetchGeoJson(15798307), // York City School District
      fetchGeoJson(15798797), // York Suburban School District
      fetchGeoJson(15805026), // West York Area School District
      fetchGeoJson(15806951), // Central York School District
      fetchGeoJson(15807383), // Dallastown Area School District
      fetchGeoJson(15831564), // Spring Grove Area School District
    ]);

    // Render the 'districtmap' view with the fetched GeoJSON data
    res.render('districtmap', { geojson1, geojson2, geojson3, geojson4, geojson5, geojson6, geojson7 });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});




// ________   _______ ______ _      
//|  ____\ \ / / ____|  ____| |     
//| |__   \ V / |    | |__  | |     
//|  __|   > <| |    |  __| | |     
//| |____ / . \ |____| |____| |____ 
//|______/_/ \_\_____|______|______|
//All the code that relates to using Excel. This is typically used for anything that needs to be changed by an admin. 

//has two arguments. filepath is for what file is being scanned, and sendTo is where JSON data is being sent to
// Import the xlsx library
const xlsx = require('xlsx');

/**
 * Convert an Excel file to JSON using the xlsx library.
 * @param {string} filepath - The path of the Excel file.
 * @param {string} sendTo - The destination to save the JSON file.
 */
function convertExcelFileToJsonUsingXlsx(filepath, sendTo) {
  // Read the Excel file from the given filepath
  const file = xlsx.readFileSync(filepath);
  
  // Retrieve the sheet names from the file
  const sheetNames = file.SheetNames;
  const totalSheets = sheetNames.length;
  
  // Variable to store the parsed data
  let parsedData = [];
  
  // Loop through each sheet
  for (let i = 0; i < totalSheets; i++) {
    // Convert the sheet to JSON using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
    
    // Add the sheet's JSON to the parsedData array
    parsedData.push(...tempData);
  }
  
  // Generate a JSON file from the parsed data and save it to the specified destination
  generateJSONFile(parsedData, sendTo);
  // Process the parsed data to render shop templates
  shopTemps(parsedData);
}

/**
 * Generate a JSON file from the given data and save it to the specified destination.
 * @param {Array} data - The data to be converted to JSON.
 * @param {string} sendTo - The destination to save the JSON file.
 */
function generateJSONFile(data, sendTo) {
  try {
    // Write the data as JSON to the specified destination
    fs.writeFileSync(sendTo, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}

/**
 * Process the parsed data to render shop templates.
 */
function shopTemps() {

    const rawData = fs.readFileSync('data.json', 'utf8');
    let words = JSON.parse(rawData)
    for (let i = 0; i < words.length; i++) {
        let pageData = words[i]
        
        app.get(`${pageData["Endpoint"]}`, function (req,res) {
            res.render('template.ejs', {
                pageTitle: pageData["Page Header"],
                pageInfo: pageData["Page Text"],
                pageVideo: pageData["Page Video"]
            })
        })
    }

  // Read the JSON file containing the parsed data
  const rawData = fs.readFileSync('data.json', 'utf8');
  let words = JSON.parse(rawData);


  // Iterate over each item in the parsed data
  for (let i = 0; i < words.length; i++) {
    let pageData = words[i];
        
    // Set up an endpoint for each page data item
    app.get(`${pageData["Endpoint"]}`, function (req, res) {
      // Render the shop template with the page data
      res.render('shopTemplate.ejs', {
        pageTitle: pageData["Page Header"],
        pageInfo: pageData["Page Text"],
        pageVideo: pageData["Page Video"]
      });
    });
  }
}


//career programs page
app.get('/career', function (req,res) {
  var words = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  var headerList = []
  var endpointList = []
  var tagList = []

  for (let i = 0; i < words.length; i++) {
      headerList.push(words[i]["Page Header"]);
      endpointList.push(words[i]["Endpoint"])
      tagList.push(words[i]["Header Tag"])
  }
  res.render('career_programs.ejs', {
      headers: headerList,
      endpoints: endpointList,
      tags: tagList
  })
})




// ____           _____ _____ _____      _____        _____ ______  _____ 
//|  _ \   /\    / ____|_   _/ ____|    |  __ \ /\   / ____|  ____|/ ____|
//| |_) | /  \  | (___   | || |         | |__) /  \ | |  __| |__  | (___  
//|  _ < / /\ \  \___ \  | || |         |  ___/ /\ \| | |_ |  __|  \___ \ 
//| |_) / ____ \ ____) |_| || |____     | |  / ____ \ |__| | |____ ____) |
//|____/_/    \_\_____/|_____\_____|    |_| /_/    \_\_____|______|_____/ 
//any page that does not have very much code. These are likely pages that are not yet finished. 
//any Misc. Page should probably also go here. 

//home 
app.get('/', function (req,res) {
    res.render('home.ejs')
})

//newhome 
app.get('/newhome', function (req,res) {
    res.render('newhome.ejs')
})


//parents and caregivers
app.get('/parents', function (req,res) {
    res.render('parents.ejs')
})

//media center

//This page is not needed. 
app.get('/mediaCenter', function (req,res) {
    res.render('mediaCenter.ejs')
})


//athletics
app.get('/sports', function(req,res){
    res.render('sports.ejs')
})

//calander
app.get('/calander', function(req,res){
  res.render('calander.ejs')
})

//this is a template page for testing purposes it may scar you when you go to the template page though
app.get('/template', function(req,res){
  res.render('template.ejs')
})

//convertExcelFileToJsonUsingXlsx()

