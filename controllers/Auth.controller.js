const User = require('../models/User.model');
const createError = require('http-errors');
const {
    authSchema
} = require('../helpers/validation_schema');
const {
    signAccesToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')

module.exports = {
    login: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({
                email: result.email
            });
            if (!user) throw createError.NotFound("User not registered")

            const isMatch = user.isInvalidPassword(result.password);
            if (!isMatch) throw createError.Unauthorized("Username/Password not valid")

            const accessToken = await signAccesToken(user.id);
            const refreshToken = await signRefreshToken(user.id)
            res.send({
                accessToken,
                refreshToken
            })
        } catch (error) {
            if (error.isJoi === true) return next(createError.BadRequest("Invalid Email/Password"))
            next(error)
        }
    },
    register: async (req, res, next) => {
        try {
            //validation
            const result = await authSchema.validateAsync(req.body)

            //check email if already exist
            const checkEmail = await User.findOne({
                email: result.email
            })
            if (checkEmail) throw createError.Conflict(`${result.email} is already been registered`)

            //Create User
            const user = new User(result)
            const saveUser = await user.save()

            const accessToken = await signAccesToken(saveUser.id)
            const refreshToken = await signRefreshToken(saveUser.id)
            res.send({
                accessToken,
                refreshToken
            })
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error);
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const {
                refreshToken
            } = req.body;
            if (!refreshToken) return createError.BadRequest()
            const {
                userId
            } = await verifyRefreshToken(refreshToken)

            const accessToken = await signAccesToken(userId)
            const refToken = await signRefreshToken(userId)
            res.send({
                refToken,
                accessToken
            })
        } catch (error) {
            next(error)
        }
    },
    logout: async (req, res, next) => {
        try {
            const {
                refreshToken
            } = req.body;
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
            client.DEL(userId, (err, val) => {
                if (err) {
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(val)
                res.sendStatus(204)
            })
        } catch (error) {
            next(error)
        }
    }
}