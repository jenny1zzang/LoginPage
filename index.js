const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { User } = require("./models/user")
const config = require('./config/key')
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(cookieParser())

mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', function (req, res) {
    res.send('Hello World hi')
})

app.post('/register', async (req, res) => {
    const user = new User(req.body);

    //1번째 방법
    /*
    try {
        await user.save()
        res.status(200).json({ success: true })
    } catch (err) {
        res.json({ success: false, err })
    }
    */

    // 2번째 방법
    user.save()
        .then(() => { res.status(200).json({ success: true }) })
        .catch((err) => { res.json({ success: false, err }) })
})

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) return res.json({ loginSuccess: false, message: "제공된 이메일에 해당하는 유저가 없습니다" })

            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" })
            })

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
        .catch(err => {
            res.status(400).send(err)
        })
})

app.listen(3000)