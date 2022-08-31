const express = require('express');
app = express()
app.set('view engine', 'ejs')
app.use(express.static("public"))

const port = 8080
const ip = '127.0.0.1'


app.get('/', function(req,res){
  res.render('index.ejs')
})
app.get('/parents', function(req,res){
  res.render('parents.ejs')
})
app.get('/senior_info', function(req,res){
  res.render('seniorinfo.ejs')
})
app.get('/attendance', function(req,res){
  res.render('attendance.ejs')
})
app.get('/media_center', function(req,res){
  res.render('mediacenter.ejs')
})

app.get('/athlete', function(req,res){
  res.render('athlete.ejs')
})

app.get('/jobs', function(req,res){
  res.render('jobs.ejs')
})

app.get('/operating_comitee', function(req,res){
  res.render('opcom.ejs')
})

app.get('/staff', function(req,res){
  res.render('staff.ejs')
})

app.listen(port, ip, function(){
  console.log("Site Is Functional");
})
