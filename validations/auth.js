import { body } from "express-validator";

export const registerValidator = [
    body('email', 'Укажите email').isEmail(),
    body('password', 'У пароля минимум 5 символов').isLength({min: 5}),
    body('fullName', 'У имени минимум 3 символа').isLength({min: 3}),
    body('avatar').optional().isURL(),
];
