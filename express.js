const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {body, check } = require('express-validator')
const morgan = require('morgan')
const fs = require('fs')
const { name } = require('ejs')
var router = express.Router()
const validate = require('validator')
var bodyParser = require('body-parser')
const app = express()
const port = 3000

// app.use(express.json())
//untuk menyatakan fungsi engine ejs
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


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
  const data = getcontact()
  
  res.render('contact', {data, title: 'Halaman Contact', msg : req.query.succes})

})

const updateContact = (contactBaru) => {
  const contacts = getcontact();
  console.log(contactBaru)

  const filteredContacts = contacts.filter((contact) => contactBaru.name !== contact.name);
  console.log(filteredContacts);
  const cekname = filteredContacts.find((date) => contactBaru.name == date.name)
  if(cekname){
    return res.status(401).send({error:true, msg:'data does not exist'})
  }
  filteredContacts.push(contactBaru);
  saveContact(filteredContacts);
};
const folder = './data'
const filepath = "./data/database.json";

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
}
if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, '[]')
}

const saveContact = (data) => {
        const hasil = JSON.stringify(data)
        console.log(hasil)
        fs.writeFileSync('data/database.json', hasil)
    }

const getcontact= () => {
        const jsonData = fs.readFileSync('data/database.json')
        return JSON.parse(jsonData)    
    }
        

const cekContact = (name) => {
        const contacts = getcontact();
        return contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
    };

const findContact = (name) => {
        const contacts = getcontact();
        // console.log(nama)
        const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
        return contact;
    };



// app.get('/contact/tambah', (req, res) => {
//   res.render('create', { title: 'Halaman Tambah Contact'})
// })

app.get('/contact/detail/:name', function(req, res) {
  const data = findContact(req.params.name)
  console.log(data)
  res.render('ditail', {data, title: 'Halaman detail Contact'})
})

app.get('/contact/tambah', function(req, res) {
  res.render('create', { title: 'Halaman Tambah Contact', msg: req.query.err})
})

app.post('/contact/tambah', function(req, res) {
      const data = getcontact()
      const data1 = JSON.stringify(req.body)
      console.log(data1)
      const contact = JSON.parse(data1)
      console.log(contact);
      const sama = data.find((name) => name.name == contact.name)
        console.log(sama, 'cek')
      if(sama){
        res.render('create', {err : 1, title : 'Halaman Tambah Contact', msg:'Contact already exist'})
        return false
      }
      if(!validate.isMobilePhone(contact.mobile, 'id-ID')) {
        res.render('create', {err : 1, title : 'Halaman Tambah Contact', msg:'Fortmat Number Contact is wrong'})
        return false
      }

      data.push(contact)
      saveContact(data);
      
      // res.send('./conatct.html',{root: __dirname})
      res.render('contact', {data, succes : 1, title : 'Halaman Contact', msg:'Contact added successfully '})
    })


    app.get('/contact/delete/:name', function(req, res) {
        const nama = req.params.name
        const data = getcontact()

        const cek = data.filter(user => user.name.toLowerCase() !== nama.toLowerCase())
        if(data.length === cek.length) {
          res.render('contact', {data, succes : 1, title : 'Halaman Contact', msg:'Contact failed to delete '})
        } 
        saveContact(cek)
        res.render('contact', {data, succes : 1, title : 'Halaman Contact', msg:'Contact  to delete '})
      })

app.get('/contact/edit/:name', function(req, res) {
    // res.send('./conatct.html',{root: __dirname})
    const name = req.params.name
    const hasil = findContact(name);
    let data =[]
    data.push(hasil)
    console.log(data);
    res.render('update', { title: 'Halaman Ubah Contact', data})
      })

app.post('/contact/edit/:oldname', (req, res) => {
    console.log(req.body)
    const u = req.body
    const cek = cekContact(u.name)
    console.log(u.name)
    if(req.params.name = u.neme){
      updateContact(u)
      res.redirect('/contact/?succes=2')
    }
    updateContact(u)
    res.redirect('/contact')
    
//     res.render('contact', { title: 'Halaman Ubah Contact'})
    })

app.use('/', (req, res) => {
  res.status(404)
  res.send('Page not Fount: 404')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


module.exports = router