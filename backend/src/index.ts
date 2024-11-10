import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from './db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { checkAuth } from './middlewares/checkAuth';
import cors from 'cors';

dotenv.config();

const app = express();
const corsOptions = {
    origin: 'https://chatbot-cfpo.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.options('/api/*', cors(corsOptions));
const PORT = process.env.PORT;
const hashSalt = parseInt(process.env.hashSalt || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'Secret';
const OPENCAGE_API = process.env.OPENCAGE_API;

app.use(express.json());
app.use(cookieParser());

app.post('/api/v1/signup', async (req: any, res: any) => {
    const { email, password, name } = req.body;

    const findUser = await User.findOne({ email });

    if (findUser) {
        console.log("User Exists");
        return res.status(400).json({ error: 'User Exists' });
    }
    const salt = await bcrypt.genSalt(hashSalt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        verified: false
    });

    user.save()
        .then(() => {
            console.log('User saved successfully');
        })
        .catch((error) => {
            console.error('Error saving user:', error);
        });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie('token', token, {httpOnly: true, secure: true});
    res.status(200).json({ message:"signup done" });
});

app.post('/api/v1/signin', async (req: any, res: any) => {
    const { email, password, name } = req.body;

    try {
        // Search for the user by either email or name
        const findUser = await User.findOne({ $or: [{ email }, { name }] });

        if (!findUser) {
            console.log("User does not exist");
            return res.status(400).json({ error: 'User does not exist' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, findUser.password);

        if (!isMatch) {
            console.log("Wrong password");
            return res.status(400).json({ error: 'Wrong password' });
        }

        const token = jwt.sign({ id: findUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);

        res.status(200).json({ message:"signin done" });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/v1/logout', (req: Request, res: Response) => {
    // Clear the cookie by setting it to an expired date
    res.cookie('token', '');

    // Respond with a confirmation message
    res.status(200).json({ message: 'Successfully logged out' });
});

app.post('/api/v1/getplaces', async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;  // Category ID default set to '13032' for ATMs
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${OPENCAGE_API}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.results);
        if (data.status.code === 200 && data.results.length > 0) {
            const place = data.results[0].formatted;
            const lat = data.results[0].geometry.lat;
            const lon = data.results[0].geometry.lng;

            console.log('Nearby Place:', place);
            res.status(200).json({ place: place, longitude: lon, latitude: lat });
        } else {
            console.error('No nearby places found.');
            res.status(400).json({ message: "error" });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(400).json({ message: "error" });
    }
});

app.post('/protected', checkAuth, async (req: Request, res: Response) => {
    res.send('Hello, MERN with TypeScript!');
})

app.get('/test', async (req: Request, res: Response) => {
    res.send('Hello, MERN with TypeScript!');
});

app.listen(PORT);

