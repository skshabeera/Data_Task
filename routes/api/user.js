const express = require('express');
const router = express.Router();
const {check,validationResult}=require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require ('bcryptjs')
// const jwt = require("jsonwebtoken")
// const config= require("config")


const User = require ("../../models/User");



router.post("/",
[
    check("name","name is required").not().isEmpty(),
    check("phoneNumber","phone number is required").isLength(10),
    check("userName","username is required").not().isEmpty(),
    check("password","password is required").isLength({ min:6 }),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
              throw new Error('Password Confirmation does not match password');
         }
         return true;
    }),
    check('emailAddress').notEmpty().withMessage('Email Address required').normalizeEmail().isEmail().withMessage('must be a valid email'),



],
async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array ()  })
    }
    const { name, email, password} = req.body;
    try{
        let user = await User.findOne({ email })
        if(user){
            return  res.status(400).json( { errors: [{ msg : "User already exists"}]});
        }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password,
            userName,
            phoneNumber,
            confirmPassword

            
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save()

        // const payload={
        //     user:{
        //     id:user.id
        //     }
        // }
        // jwt.sign(payload,config.get('jwtSecret'),{
        //     expiresIn:360000
        // },(err,token) =>{
        //     if(err) throw err;
        //     res.json({ token })
        // })
    }catch(err){
        console.error(err.message)
        

        res.status(500).send('server error')

    }
});

   

module.exports = router;