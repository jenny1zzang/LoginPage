const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://jenny1zzang:0627herinkim@boilerplate.mqii1xe.mongodb.net/')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000)