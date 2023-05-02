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

const osmtogeojson = require('osmtogeojson');
const https = require('https');
//York County Relations
const relationId1 = 417442;
const query1 = `[out:json];relation(${relationId1});out geom;`;
const url1 = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query1)}`;

//York City School District Relations
const relationId2 = 15798307;
const query2 = `[out:json];relation(${relationId2});out geom;`;
const url2 = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query2)}`;

app.get('/districts', async (req, res) => {
  try {
    // Fetch data for the first region
    https.get(url1, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const geojson1 = osmtogeojson(JSON.parse(data));

        // Fetch data for the second region
        https.get(url2, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            const geojson2 = osmtogeojson(JSON.parse(data));
            res.render('districtmap', { geojson1, geojson2 });
          });
        }).on('error', (error) => {
          console.error(error);
          res.status(500).send('An error occurred');
        });
      });
    }).on('error', (error) => {
      console.error(error);
      res.status(500).send('An error occurred');
    });
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
const xlsx = require('xlsx');

function convertExcelFileToJsonUsingXlsx(filepath, sendTo) {

    // Read the file using pathname
    const file = xlsx.readFileSync(filepath);
  
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;
  
    // Variable to store our data
    let parsedData = [];
  
    // Loop through sheets
    for (let i = 0; i < totalSheets; i++) {
  
        // Convert to json using xlsx
        const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);

    
  
        // Add the sheet's json to our data array
        parsedData.push(...tempData);
    }
  
   // call a function to save the data in a json file
  

   generateJSONFile(parsedData, sendTo);
   shopTemps(parsedData)

  }

  function generateJSONFile(data, sendTo) {
    try {
    fs.writeFileSync(sendTo, JSON.stringify(data))
    }

     
    
  
  catch (err) {
    console.error(err)
    }
  }


function shopTemps() {
    const rawData = fs.readFileSync('data.json', 'utf8');
    let words = JSON.parse(rawData)
    for (let i = 0; i < words.length; i++) {
        let pageData = words[i]
        
        app.get(`${pageData["Endpoint"]}`, function (req,res) {
            res.render('shopTemplate.ejs', {
                pageTitle: pageData["Page Header"],
                pageInfo: pageData["Page Text"],
                pageVideo: pageData["Page Video"]
            })
        })
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
app.get('/athletics', function(req,res){
    res.render('athleticsHome.ejs')
})

//convertExcelFileToJsonUsingXlsx()

