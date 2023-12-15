const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { User } = require("./models/user")
const config = require('./config/key')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', function (req, res) {
    res.send('Hello World hi')
})

app.post('/register', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(200).json({
            success: true
        })
    }).catch((err) => {
        return res.json({ success: false, err })
    })
})

app.listen(3000)