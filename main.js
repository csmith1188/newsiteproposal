const express = require('express');
app = express()

const port = 8080
const ip = '127.0.0.1'


app.get('/', function(req,res){
  res.render('index.ejs')
})

app.get('/mediacenter', function(req,res){
  res.render('mediacenter/mediacenter.ejs')
})

app.get('/attendance', function(req,res){
  res.render('attendance/attendance.ejs')
})

app.listen(port, ip, function(){
  console.log("Site Is Functional");
})
