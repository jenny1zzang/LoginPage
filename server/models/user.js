const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,     //공백을 제거
        unique: 1 //이메일은 하나. 유니크 했으면 좋겠음.
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,      //오브젝트를 사용하지 않고 이렇게 하나로 줘도 된다.
    token: {
        type: String    //유효성 검사를 위해
    },
    tokenExp: {
        type: Number        //유효기간.
    }
})

userSchema.pre('save', function (next) {
    var user = this

    if (!user.isModified('password')) next()

    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

//비동기 방식
/*
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
*/

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainpassword와 암호화된 비밀번호가 같은지 확인하기 -> plainpassword를 암호화 해서 암호화한 password와 같은지 확인하기.
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}


userSchema.methods.generateToken = function (cb) {
    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save()
        .then(user => { cb(null, user) })
        .catch(err => { cb(err) })

    // user.save(function(err, user){
    //     if(err) return cb(err)
    //     cb(null, user)
    // })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this
    //token decoding
    jwt.verify(token, 'secretToken', function (err, decoded) {
        user.findOne({ "_id": decoded, "token": token })
            .then(user => {cb(null, user)})
            .catch(err => cb(err))
    })
}

const User = mongoose.model('User', userSchema)    //스키마를 모델로 감싸준다

module.exports = { User }     //다른 파일에서도 쓸 수 있도록 export