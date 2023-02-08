//modules
const express = require('express')
var app = express()
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')


//settings 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./static'))

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
    
app.get('/it', function (req,res) {
    res.render('IT_shop.ejs')
})

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
})