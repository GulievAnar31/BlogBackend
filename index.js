import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { registerValidator, loginValidator, postCreateValidator } from './validations/validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.ve9jejm.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch(err => console.log('db error'));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.authMe)

app.get('/posts', checkAuth, PostController.getAll);
app.post('/post', checkAuth, postCreateValidator, PostController.create);

app.get('/post/:id', PostController.getOne);
app.delete('/post/:id', checkAuth, PostController.removeOne);
app.patch('/post/:id', checkAuth, postCreateValidator, PostController.update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


app.listen(4444, (err) => {
    if (err) return console.log(err);

    console.log('ok');
});
