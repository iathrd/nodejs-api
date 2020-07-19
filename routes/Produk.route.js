const express = require('express');
const router = express.Router()
const Produk = require('../models/Produk.model')
const {
    produkSchema
} = require('../helpers/validation_schema')
const createError = require('http-errors')

router.post('/create', async (req, res, next) => {
    try {
        const user = {
            userId: await req.payload.aud
        }
        console.log(user)
        const {
            name,
            description,
            price
        } = await produkSchema.validateAsync(req.body);
        const produk = new Produk({
            name,
            description,
            price,
            userId: req.payload.aud
        })

        const saveProduk = await produk.save()

        res.send(saveProduk)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const result = await Produk.find({
            userId: req.payload.aud
        });

        if (!result.length) throw createError.NotFound("Anda tidak mempunyai produk")

        res.send(result)
    } catch (error) {
        next(error)
    }
})

router.post('/list/:id', async (req, res, next) => {
    try {
        const updateProduk = await Produk.findOneAndUpdate(
            { _id: req.params.id }, req.body, { new: true })

        res.send(updateProduk)
    } catch (error) {
        if (error) throw createError.BadRequest()
        next(error)
    }
})

router.get('/delete/:id', async (req, res, next) => {
    try {
        const deleteProduk = await Produk.findByIdAndRemove(req.params.id)
        if (deleteProduk) return res.send("Delete Success")
    } catch (error) {
        if (error) throw createError.NotFound("Data Tidak ada")
        next(error)
    }
})

module.exports = router;