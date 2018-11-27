const router = require('express').Router()
const passport = require('passport')
const rp = require('request-promise')
const Client = require('../models/clients')
const Inventario = require('../models/Inventario')
const bidones = require('../models/bidones')
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/registrar', (req, res, next) => {
  res.render('registrar')
})

router.post('/registrar', passport.authenticate('local-signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/registrar',
  failureFlash: true
}))

router.get('/ingresar', (req, res, next) => {
  res.render('signin')
})

router.post('/ingresar', passport.authenticate('local-signin', {
  successRedirect: '/dashboard',
  failureRedirect: '/dashboard',
  failureFlash: true
}))

router.get('/dashboard', isAuthenticated, (req, res, next) => {
  res.render('dashboard')
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}
router.route('/clients/create')
  .get(isAuthenticated, function (req, res) {
    let client = { nota: 'nota' }
    res.render('create', { client })
  })

  .post(isAuthenticated, function (req, res) {
    Client.find({ _id: req.body.rut })
      .then(cliente => {
        if (cliente.length === 0) {
          console.log('no existe')
          let client = new Client()
          client.name = req.body.nombre
          client._id = req.body.rut
          client.lastname = req.body.apellido
          client.address = req.body.direccion
          client.save()
            .then(() => {
              client.alert = 'Cliente creado'
              res.render('create', { client })
            })
            .catch(() => {
              res.render('dashboard')
            })
        } else if (cliente.length === 1) {
          console.log('existe')
        }
      })
  })

router.route('/clients')

  .get(function (req, res) {
    rp({
      uri: 'http://localhost:3000/api/clients',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(client => {
        let clients = JSON.parse(client)
        res.render('clients', { clients })
      })
  })

router.route('/clients/:client_id')

  .get( function (req, res) {
    let rut = req.params.client_id
    return rp({
      uri: 'http://localhost:3000/api/clients/' + rut,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(client => {
        let clients = JSON.parse(client)
        return rp({
          uri: 'http://localhost:3000/api/bidones/' + rut,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(bidon => {
            console.log(JSON.parse(bidon).cantidad)
            clients.cantidad = JSON.parse(bidon).cantidad
            console.log(clients)
            res.render('client', { clients })
          })
      })
  })

  .post(isAuthenticated, function (req, res) {
    console.log(req.body)
    console.log(req.params)
    let rut = req.params.client_id
    return rp({
      uri: 'http://localhost:3000/api/clients/' + rut,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        name: req.body.nombre,
        lastname: req.body.apellido,
        address: req.body.direccion
      }

    })
      .then(client => {
        return rp({
          uri: 'http://localhost:3000/api/clients/' + rut,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(client => {
            let clients = JSON.parse(client)
            clients.alert = 'Datos actualizados'
            res.render('client', { clients })
          })
      })
  })

router.route('/inventario')
  .post(function (req, res) {
    console.log(req.body)
    let inventario = new Inventario()
    inventario._id = req.body.id
    inventario.BidonesIn = req.body.in
    inventario.BidonesOut = req.body.out
    inventario.BidonesTotal = inventario.BidonesIn + inventario.BidonesOut
    inventario.save()
      .then(() => {
        res.json({ message: 'inventario' })
      })
  })

  .get(function (req, res) {
    Inventario.find()
      .then(inventario => {
        let invent = inventario[0]
        console.log(invent)
        res.render('inventario', { invent })
      })
  })
// crear clientes

module.exports = router
