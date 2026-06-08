const User = require("../model/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSignup = async (req, res) => {

    const {name, email, password, phone} = req.body

    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'This Email is already registered'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, email, phone , 
            password: hashedPassword
        });

        res.status(201).json({message: 'User registered successfully'})
        
    } catch (error) {
         res.status(500).json({message:'Server error' , error: error.message})
    }

}

const userLogin = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).json({message: 'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: 'Invalid email or password' })
    }

    const token = jwt.sign(
        {id: user._id, name: user.name, email: user.email, phone: user.phone},
        process.env.JWT_SECRET,
        {expiresIn: '2d'}
    );

    res.status(200).json({token, user:{
        name: user.name, email: user.email, phone: user.phone
    }, message: 'Login successful'})
}

module.exports = {userSignup, userLogin}