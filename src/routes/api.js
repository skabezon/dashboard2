
const router = require('express').Router()
const Client = require('../models/clients')
const Bidones = require('../models/bidones')
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' })
})

// on routes that end in /bears
// ----------------------------------------------------
router.route('/clients')

// create a bear (accessed at POST http://localhost:3000/clients)
  .post(function (req, res) {
    let client = new Client()
    client.name = req.body.name

    client.save(function (err) {
      if (err) { res.send(err) }

      res.json({ message: 'Client created!' })
    })
  })

// get all the bears (accessed at GET http://localhost:3000/api/clients)
  .get(function (req, res) {
    Client.find(function (err, clients) {
      if (err) { res.send(err) }

      res.json(clients)
    })
  })

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/clients/:client_id')

// get the bear with that id
  .get(function (req, res) {
    Client.findById(req.params.client_id, function (err, client) {
      if (err) { res.send(err) }
      res.json(client)
    })
  })

// update the bear with this id
  .put(function (req, res) {
    console.log(req.body)
    Client.findById(req.params.client_id, function (err, client) {
      if (err) { res.send(err) }
      client.name = req.body.name
      client.lastname = req.body.lastname
      client.address = req.body.address

      client.save(function (err) {
        if (err) { res.send(err) }
        console.log(client)
        res.json({ message: 'Client updated!' })
      })
    })
  })

// delete the bear with this id
  .delete(function (req, res) {
    Client.remove({
      _id: req.params.client_id
    }, function (err, client) {
      if (err) { res.send(err) }

      res.json({ message: 'Successfully deleted' })
    })
  })

  .post(function (req, res) {
    res.json({ message: 'listeilor' })
  })

router.route('/bidones/:client_id')
  .get(function (req, res) {
    Bidones.findById(req.params.client_id, function (err, bidon) {
      if (err) { res.send(err) }
      res.json(bidon)
    })
  })

  .post(function (req, res) {
    let bidon = new Bidones()
    bidon._id = req.params.client_id
    bidon.cantidad = req.body.cantidad

    bidon.save(function (err) {
      if (err) { res.send(err) }

      res.json({ message: 'Bidones creados' })
    })
  })
module.exports = router
