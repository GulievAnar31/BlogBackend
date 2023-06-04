import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { registerValidator } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.ve9jejm.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch(err => console.log('db error'));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatar: req.body.avatar ?? '',
            passwordHash
        });

        const user = await doc.save();

        res.json({ success: true, })
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
})

app.listen(4444, (err) => {
    if (err) return console.log(err);

    console.log('ok');
});
