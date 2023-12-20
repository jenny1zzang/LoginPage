const { User } = require("../models/user")

let auth = (req, res, next) => {
    let token = req.cookies.x_auth
    //findByToken =  function(token, cb) 
    User.findByToken(token, (err, user) => {
        // try {
        //     if (!user) return res.json({ isAuth: false, error: true})

        //     req.token = token
        //     req.user = user
        //     next()
        // } catch(err) {
        //     res.status(401).senc()
        // }
        if (err) throw err
        if (!user) return res.json({ isAuth: false, error: true })

        req.token = token
        req.user = user
        next()
    })
}

module.exports = { auth }