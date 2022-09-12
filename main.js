const express = require('express');
app = express()
//sets ejs as view engine
app.set('view engine', 'ejs')
app.use(express.static("public"))

//port
const port = 8080
//ip
const ip = '127.0.0.1'

//endpoints
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

app.get('/schoology', function(req,res){
  res.render('schoology.ejs')
})

app.get('/purchase_uniforms', function(req,res){
  res.render('purchaseuniforms.ejs')
})

app.get('/skyward', function(req,res){
  res.render('skyward.ejs')
})

app.get('/pictures', function(req,res){
  res.render('prestiegePortraits.ejs')
})

app.get('/enlglish', function(req,res){
  res.render('specialReleaseEnglish.ejs')
})

app.get('/spanish', function(req,res){
  res.render('specialReleaseSpanish.ejs')
})

app.get('/destiny_books', function(req,res){
  res.render('destinyDiscoverBooks.ejs')
})

app.get('/database_useage', function(req,res){
  res.render('databaseUsage.ejs')
})

app.get('/destiny_web', function(req,res){
  res.render('destinyDiscoverWebsites.ejs')
})

app.get('/nocti_testing', function(req,res){
  res.render('noctiTesting.ejs')
})

app.get('/techtips', function(req,res){
  res.render('studentTechTipVideos.ejs')
})

app.get('/primary_sources', function(req,res){
  res.render('recommendedPrimarySources.ejs')
})

app.get('/quickguide', function(req,res){
  res.render('quickTechGuide.ejs')
})

app.get('/family_access', function(req,res){
  res.render('qmlativeFamilyAccess.ejs')
})

app.get('/database', function(req,res){
  res.render('database.ejs')
})

app.get('/catalouge', function(req,res){
  res.render('ycstCatalogue.ejs')
})

app.get('/powerlibrary', function(req,res){
  res.render('powerLibary.ejs')
})


//starts listen server
app.listen(port, ip, function(){
  console.log("Site Is Functional");
})
