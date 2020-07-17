const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const bodyParser = require('body-parser')
require('dotenv').config();
require('./helpers/init_mongodb')

const authRoute = require('./routes/Auth.route')

const app = express();
app.use(morgan('dev'))

//BodyParser
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(bodyParser.json())

//Route
app.use('/auth', authRoute);

//Error handler http request
app.use(async (req, res, next) => {
    next(createError.NotFound())
});

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

//SERVER 
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})