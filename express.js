const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  // res.sendFile('./index.html',{root: __dirname})
  res.render('index')
})

app.get('/abaut', (req, res) => {
  // res.send('./abaut.html',{root: __dirname})
  res.render('abaut')
})

app.get('/contact', (req, res) => {
  // res.send('./conatct.html',{root: __dirname})
  const data= [{nama : 'Rohot', noTelpon: '082299008023'}]
  
  res.render('contact', {data:data})

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


