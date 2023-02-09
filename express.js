const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile('./index.html',{root: __dirname})
})

app.get('/abaut', (req, res) => {
  res.send('./abaut.html',{root: __dirname})
})

app.get('/contact', (req, res) => {
  res.send('./conatct.html',{root: __dirname})
})


app.get('/product/:Idproduct/kategori/:name', (req, res) => {
  const id = req.params.Idproduct
  const name = req.params.name
  
  res.send(`Id product  ${id}, \n Nama Kategori : ${name}`)
})

app.use('/', (req, res) => {
  res.status(404)
  res.send('Page not Fount: 404')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


