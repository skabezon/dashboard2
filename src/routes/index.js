const router = require('express').Router()
const passport = require('passport')
const rp = require('request-promise')

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
router.route('/clients')

  .get(isAuthenticated, function (req, res) {
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

  .get(isAuthenticated, function (req, res) {
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
        res.render('client', { clients })
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

module.exports = router
