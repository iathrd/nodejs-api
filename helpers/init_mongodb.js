const mongoose = require('mongoose');

const mongoOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose
    .connect(process.env.MONGODB_URI, mongoOption)
    .then(() => {
        console.log("Database Conected!")
    })
    .catch((err) => console.log(err.message))


mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db !')
});

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log(' Mongoose conection is discodected')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0)
})