const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const fs = require('fs')
const app = express()
const port = 3000

//untuk menyatakan fungsi engine ejs
app.set('view engine', 'ejs')

// untuk menggnukan ejs-layout
app.use(expressLayouts)
app.set ('layout', './layout/full-width')


app.use(express.static('public'))

app.use(morgan('dev'))

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

app.get('/', (req, res) => {
  // res.sendFile('./index.html',{root: __dirname})
  res.render('index',  {title: 'Halaman index'})
})

app.get('/abaut', (req, res) => {
  // res.send('./abaut.html',{root: __dirname})
  res.render('abaut',  {title: 'Halaman About'})

})

app.get('/contact', (req, res) => {
  // res.send('./conatct.html',{root: __dirname})
  const data = fs.readFileSync('public/contacts.json');
  const contact = JSON.parse(data);
  console.log(contact)
  
  res.render('contact', {contact, title: 'Halaman Contact'})


})


app.get('/product/:Idproduct/kategori/:name', (req, res) => {
  const id = req.params.Idproduct
  const name = req.params.name
  
  res.send(`Id product  ${id}, <br> Nama Kategori : ${name}`)
})

app.use('/', (req, res) => {
  res.status(404)
  res.send('Page not Fount: 404')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


