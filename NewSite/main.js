const express = require('express')
const app = express()
const fs = require('fs')
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
const port = 8080
const ip = '127.0.0.1'



app.get('/', function(req,res){
    res.render('index.ejs')
})



app.listen(port, ip, function(){
    console.log('Server Running...')
})