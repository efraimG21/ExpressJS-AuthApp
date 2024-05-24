import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from "../lib/prisma.js";


export const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send({message: 'Username or email or password are not valid'});
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);

        prisma.user.create({
            username: username,
            password: hashPassword,
            email: email,
        })

        return res.status(200).send({message: 'Successfully registered'})
    } catch (error) {
        return res.status(400).send({message: 'Failed to register'});
    }
}


export const login = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send({message: 'Username or email or password are not valid'});
    }

    try {
        const user = await prisma.user.find({
            where: {username: username, email: email},
        })

        if (!user) {
            return res.status(401).send({message: 'Invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const expiredTime = 1000 * 60;
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY, {expiresIn: expiredTime});

        res.cookie('token', token, {httpOnly: true, secure: false, maxAge: age})
            .status(200).json({message: 'Login successfully.'});
    } catch(error) {
      return res.status(400).send({message: 'Failed to login'});
    }
}