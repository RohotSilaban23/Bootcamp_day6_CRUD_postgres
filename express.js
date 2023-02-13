const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {body, check, validationResult } = require('express-validator')
const morgan = require('morgan')
const fs = require('fs')
const { name } = require('ejs')
var router = express.Router()
const validate = require('validator')
var bodyParser = require('body-parser')
const app = express()
const pool = require('./db')
const db = require('./query')
const port = 3000


// app.use(express.json())
//untuk menyatakan fungsi engine ejs
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.json())

// untuk menggnukan ejs-layout
app.use(expressLayouts)
app.set ('layout', './layout/full-width')

app.use(express.urlencoded({extended:true}))


app.use(express.static('public'))

app.use(morgan('dev'))

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

app.get("/adasync", async(req ,res)=> {
  try{
    const name = 'rohot2'
    const mobile = '082299008023'
    const email = 'rohot@gmail.com'
    const newCont = await pool.query(`INSERT INTO contacts(
      name, email, mobile)
      VALUES ('${name}', '${email}', '${mobile}') RETURNING *`)
    res.json(newCont)
  } catch (err) {
    console.error(err.message)
  }
})


app.get('/', (req, res) => {
  // res.sendFile('./index.html',{root: __dirname})
  res.render('index',  {title: 'Halaman index'})
})

app.get('/abaut', (req, res) => {
  // res.send('./abaut.html',{root: __dirname})
  res.render('abaut',  {title: 'Halaman About'})

})

app.get('/contact', async(req, res) => {
  // res.send('./conatct.html',{root: __dirname})
  const data = await pool.query(`SELECT name , mobile FROM contacts`)
  console.log(data)
  
  res.render('contact', {data : data.rows, title: 'Halaman Contact', msg : req.query.succes})

})





// app.get('/contact/tambah', (req, res) => {
//   res.render('create', { title: 'Halaman Tambah Contact'})
// })

app.get('/contact/detail/:name', async(req, res) =>{
   const data = await pool.query(`SELECT name , mobile, email FROM contacts WHERE name ='${req.params.name}'`)
  console.log(data)
  res.render('ditail', {data: data.rows, title: 'Halaman detail Contact'})
})

app.get('/contact/tambah', function(req, res) {
  res.render('create', { title: 'Halaman Tambah Contact', name : "", email : "", mobile: ""})
})

app.post('/contact/tambah',[
  body('name').custom(async(value) =>{
    const data = await db.findOne(value);
    console.log(data)
    if(data){
      throw new Error('Contact name axists')
    }
    return true
  }),
  check('email', 'Email not valid').isEmail(),
  check('mobile', 'Mobile not Valid').isMobilePhone('id-ID')
], (req, res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log((errors));
    res.render('create', { 
    title: 'Halaman Tambah Contact',
    name : req.body.name,
    email : req.body.email,
    mobile : req.body.mobile, 
    errors: errors.array()})
  } else {
    const data1 = req.body
    console.log(data1);
    const userData = JSON.stringify(data1)
    datass = JSON.parse(userData)
    const hasil = db.addContact(datass)
    res.redirect('/contact')
  }

})
    app.get('/contact/delete/:name', async(req, res) =>{
      try {
        const name = req.params.name
        await pool.query(`DELETE FROM contacts WHERE name='${name}'`)
        res.redirect('/contact/?succces=delete')
      } catch (error) {
        console.error(err.message)
      }
        
      })

app.get('/contact/edit/:name', async(req, res)=> {
    // res.send('./conatct.html',{root: __dirname})
    console.log('aa',req.params.name);
    try {
      const db = (await pool.query(`SELECT * FROM contacts WHERE name ='${req.params.name}'`)).rows
      res.render('update', { title: 'Halaman Ubah Contact', data: db, msg : req.query.err})
    } catch (error) {
      console.error(err.message)
    }
  
      })

app.post('/contact/edit/:oldname',[
  body('name').custom(async(value, { req }) => {
    const data = await db.findOne(value);
    const duplikat = data
    if (value !== req.params.oldname && data) {
        throw new Error('Contact Name Already axist!');
    }
    return true;
    }),
  check('email', 'Email not valid').isEmail(),
  check('mobile', 'Mobile not Valid').isMobilePhone('id-ID')
], async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log('b',errors);
    res.render('update', { 
    title: 'Halaman Ubah Contact',
    oldname : req.params.oldname,
    data : [{name : req.body.name ,email : req.body.email, mobile : req.body.mobile }],
    errors: errors.array()})
  } else {
      await db.UpdateContact(req.params.oldname, req.body.name, req.body.email, req.body.mobile );
      
    res.redirect('/contact')
    }
  })

app.use('/', (req, res) => {
  res.status(404)
  res.send('Page not Fount: 404')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


module.exports = router