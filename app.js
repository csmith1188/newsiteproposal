//modules
const express = require('express')
var app = express()
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
var fs = require('fs');
const xlsx = require('xlsx');

//settings 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./static'))

function convertExcelFileToJsonUsingXlsx() {

    // Read the file using pathname
    const file = xlsx.readFileSync('test.xlsx');
  
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;
  
    // Variable to store our data
    let parsedData = [];
  
    // Loop through sheets
    for (let i = 0; i < totalSheets; i++) {
  
        // Convert to json using xlsx
        const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
  
        // Skip header row which is the colum names
        tempData.shift();
  
        // Add the sheet's json to our data array
        parsedData.push(...tempData);
    }
  
   // call a function to save the data in a json file
  
   generateJSONFile(parsedData);
  }

  function generateJSONFile(data) {
    try {
    fs.writeFileSync('data.json', JSON.stringify(data))
    } catch (err) {
    console.error(err)
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
//electronics shop page
app.get('/Hardware', function (req,res) {
    res.render('electronic_it_support_shop.ejs')
})

app.get('/Programming', function (req,res) {
    res.render('computer_programming.ejs')
})

app.get('/Networking', function (req,res) {
    res.render('networking_cyber_security.ejs')
})

app.get('/Software', function (req,res) {
    res.render('information_systems_managment.ejs')
})

//career programs page
app.get('/career', function (req,res) {
    res.render('career_programs.ejs')
})


//media center
app.get('/mediaCenter', function (req,res) {
    res.render('mediaCenter.ejs')
})


//athletics
app.get('/athletics', function(req,res){
    res.render('athleticsHome.ejs')
})



//listen server
app.listen(port, function () {
    console.log("Listening on port " + port)
    convertExcelFileToJsonUsingXlsx()
})



