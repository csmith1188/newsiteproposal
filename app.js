const express = require('express')
var app = express()
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./static'))
var port = 1010

app.get('/parents', function (req,res) {
    res.render('parents.ejs')
})
    
app.listen(port, function () {
    console.log("Listening on port " + port)
})