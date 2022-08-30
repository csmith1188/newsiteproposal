const express = require('express');
app = express()
app.set('view engine', 'ejs')
app.use(express.static("public"))

const port = 8080
const ip = '127.0.0.1'


app.get('/', function(req,res){
  res.render('index.ejs')
})

app.get('/mediacenter', function(req,res){
  res.render('mediacenter/mediacenter.ejs')
})

app.get('/parents', function(req,res){
  res.render('parents/parents.ejs')
})

app.get('/senior_info', function(req,res){
  res.render('seniorinfo/seniorinfo.ejs')
})

app.get('/staff', function(req,res){
  res.render('staff/staff.ejs')
})

app.get('/attendance', function(req,res){
  res.render('attendance/attendance.ejs')
})


app.get('/', function(req,res){
  res.render('/main.ejs')
})






app.listen(port, ip, function(){
  console.log("Site Is Functional");
})
