import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatar: req.body.avatar ?? '',
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
            'secret123',
            {
                expiresIn: '30d'
            })

        const { passwordHash, userData } = user._doc;

        return res.json({ ...userData, token })
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return req.status(404).json({
                message: "Пользователь не найден"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return req.status(404).json({
                message: "Неверный логин или пароль"
            })
        }

        const token = jwt.sign(
            {
                _id: user.id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться.'
        })
    }
}

export const authMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        console.log(user);
        res.json(user)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}