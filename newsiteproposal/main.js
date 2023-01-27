const express = require('express')

var app = express()
const path = require('path')


var port = 1000


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}));
app.use(express.static('./static'))




app.get('/', function (req,res) {
       res.render('home.ejs')})

app.get('/MediaCenter', function(req,res){
    res.render('MediaCenter/mediaCenter.ejs')
})

app.get('/test', function(req,res){
    res.render('index.ejs')
})

app.listen(port, function () {
    console.log("Listening on port " + port)
})