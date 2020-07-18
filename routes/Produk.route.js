const express = require('express');
const router = express.Router()

router.post('/create', (req, res, next) => {
    res.send(req.body)
})

module.exports = router;