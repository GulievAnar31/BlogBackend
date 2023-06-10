import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось вернуть статьи'
        })
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                userId: req.userId,
                tags: req.body.tags
            }
        );

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}

export const removeOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndRemove({ _id: postId }).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true } // To return the updated document
        ).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(doc);
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};


export const create = async (req, res) => {
    try {
        console.log(req.body);
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}