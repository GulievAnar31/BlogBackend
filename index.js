import express from 'express';
import mongoose from 'mongoose';
import { registerValidator, loginValidator, postCreateValidator } from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.ve9jejm.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch(err => console.log('db error'));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidator, UserController.login)
app.post('/auth/register', registerValidator, UserController.register)
app.get('/auth/me', checkAuth, UserController.authMe)

app.get('/posts', checkAuth, PostController.getAll);
app.post('/post', checkAuth, postCreateValidator, PostController.create);

app.get('/post/:id', PostController.getOne);
app.delete('/post/:id', checkAuth, PostController.removeOne);
app.patch('/post/:id', checkAuth, PostController.update);


app.listen(4444, (err) => {
    if (err) return console.log(err);

    console.log('ok');
});
