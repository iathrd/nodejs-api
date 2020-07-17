const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const createError = require('http-errors');
const { authSchema } = require('../helpers/validation_schema');

router.post('/register', async (req, res, next) => {
    try {
        //validation
        const result = await authSchema.validateAsync(req.body)
        console.log(result)

        //check email if already exist
        const checkEmail = await User.findOne({ email: result.email })
        if (checkEmail) throw createError.Conflict(`${result.email} is already been registered`)

        //Create User
        const user = new User(result)
        const saveUser = await user.save()
        res.send(saveUser)
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    res.send("login route")
});

router.post('/refresh-token', async (req, res, next) => {
    res.send("refresh token route")
})

router.delete('/logout', async (req, res, next) => {
    res.send("logout route")
})


module.exports = router;