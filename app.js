//modules
const express = require('express')
var app = express()
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
var fs = require('fs');
const xlsx = require('xlsx');
const { json } = require('body-parser')


//settings 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./static'))
app.use('/fonts', express.static(__dirname + '/fonts'));

//google maps fun














//Excel sheet fun
//has two arguments. filepath is for what file is being scanned, and sendTo is where JSON data is being sent to
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

//port and ip
var port = 1010
var ip = '127.0.0.1'

//home 
app.get('/', function (req,res) {
    res.render('home.ejs')
})


//parents and caregivers
app.get('/parents', function (req,res) {
    res.render('parents.ejs')
})


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


//media center
app.get('/mediaCenter', function (req,res) {
    res.render('mediaCenter.ejs')
})


//athletics
app.get('/athletics', function(req,res){
    res.render('athleticsHome.ejs')
})

app.get('/districts', function(req, res){
    res.render('districtmap.ejs')
})



convertExcelFileToJsonUsingXlsx()

//listen server
app.listen(port, function () {
    console.log("Listening on port " + port)
    convertExcelFileToJsonUsingXlsx('newData.xlsx', 'data.json')
    convertExcelFileToJsonUsingXlsx('testData.xlsx', 'testData.json')
})


