const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const createError = require('http-errors');
const { authSchema } = require('../helpers/validation_schema');
const { signAccesToken, signRefreshToken } = require('../helpers/jwt_helper')

router.post('/register', async (req, res, next) => {
    try {
        //validation
        const result = await authSchema.validateAsync(req.body)

        //check email if already exist
        const checkEmail = await User.findOne({ email: result.email })
        if (checkEmail) throw createError.Conflict(`${result.email} is already been registered`)

        //Create User
        const user = new User(result)
        const saveUser = await user.save()

        const accessToken = await signAccesToken(saveUser.id)
        const refreshToken = await signRefreshToken(saveUser.id)
        res.send({ accessToken, refreshToken })
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email });
        if (!user) throw createError.NotFound("User not registered")

        const isMatch = user.isInvalidPassword(result.password);
        if (!isMatch) throw createError.Unauthorized("Username/Password not valid")

        const accessToken = await signAccesToken(user.id);
        const refreshToken = await signRefreshToken(user.id)
        res.send({ accessToken, refreshToken })
    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest("Invalid Email/Password"))
        next(error)
    }
});

router.post('/refresh-token', async (req, res, next) => {
    res.send("refresh token route")
})

router.delete('/logout', async (req, res, next) => {
    res.send("logout route")
})


module.exports = router;