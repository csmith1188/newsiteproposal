const express = require('express')
var app = express()
const path = require('path')
const ejs = require('ejs')


//app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('./static'))

var port = 1010

app.get('/', function (req,res) {   
    res.render('index.ejs')
    })

app.listen(port, function () {   
    console.log("Listening on port " + port)
})