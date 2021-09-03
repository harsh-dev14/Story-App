const express = require('express')
const router =express.Router()

// @desc Login page
// router GET /
router.get('/',(req,res)=>{
    res.render('login',{
        layout:'login'
    })
})

// @desc Dashboard page
// router GET /dashboard
router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})

module.exports = router