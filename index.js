const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { customAlphabet } = require('nanoid');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80


const db = monk(process.env.MONGO_URI)
db.then(() => {
    console.log('Connected correctly to server')
})

const urls = db.get('urls');
// urls.createIndex({ slug: 1 }, { unique: true })
urls.createIndex({ "createdAt": 1 }, { "expireAfterSeconds": 172800 }, { slug: 2 }, { unique: true })


app.use(helmet());       // for safety
app.use(morgan('tiny')); //logger
app.use(cors());         // cors policy enable for all
app.use(express.json());    //app only accepts json data
app.use(express.static('public')); // Main page setup

const notFoundPath = path.join(__dirname, 'public/notFound.html');

const schema = yup.object({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required()
})


app.get('/', (req, res) => {
    res.json({
        message: "Create your Meeting links!"
    })
})

app.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;

    try {
        const url = await urls.findOne({ slug });

        if (url) {
            return res.redirect(url.url);
        }
        return res.status(404).sendFile(notFoundPath);
    } catch (error) {
        return res.status(404).sendFile(notFoundPath);
    }
});

app.post('/:url', async (req, res, next) => {

    if (!req.body.url) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    }

    let { slug, url } = req.body;

    try {
        await schema.validate({
            slug,
            url,

        })

        if (!slug) {
            let nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)
            slug = nanoid(); // possibilities for duplication//
        }

        slug = slug.toLowerCase();

        const newUrl = {
            slug,
            url,
            createdAt: new Date()
        }

        const created = await urls.insert(newUrl)
        res.status(200).json({ created });


    } catch (error) {
        if (error.message.startsWith('E11000')) {
            error.message = 'Slug in Use 💩';
        }
        next(error);
    }
})

app.use((error, req, res, next) => {

    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🍔' : error.stack,
    })
})

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})