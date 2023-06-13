import { body } from "express-validator";

export const registerValidator = [
    body('email', 'Укажите email').isEmail(),
    body('password', 'У пароля минимум 5 символов').isLength({ min: 5 }),
    body('fullName', 'У имени минимум 3 символа').isLength({ min: 3 }),
    body('avatar').optional().isURL(),
];

export const loginValidator = [
    body('email', 'Укажите email').isEmail(),
    body('password', 'У пароля минимум 5 символов').isLength({ min: 5 }),
];

export const postCreateValidator = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
];


