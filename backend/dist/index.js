"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const checkAuth_1 = require("./middlewares/checkAuth");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'https://chatbot-cfpo.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.options('/api/*', (0, cors_1.default)(corsOptions));
const PORT = process.env.PORT;
const hashSalt = parseInt(process.env.hashSalt || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'Secret';
const OPENCAGE_API = process.env.OPENCAGE_API;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const findUser = yield db_1.User.findOne({ email });
    if (findUser) {
        console.log("User Exists");
        return res.status(400).json({ error: 'User Exists' });
    }
    const salt = yield bcrypt_1.default.genSalt(hashSalt);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const user = new db_1.User({
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
    const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "signup done" });
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        // Search for the user by either email or name
        const findUser = yield db_1.User.findOne({ $or: [{ email }, { name }] });
        if (!findUser) {
            console.log("User does not exist");
            return res.status(400).json({ error: 'User does not exist' });
        }
        // Compare the provided password with the hashed password in the database
        const isMatch = yield bcrypt_1.default.compare(password, findUser.password);
        if (!isMatch) {
            console.log("Wrong password");
            return res.status(400).json({ error: 'Wrong password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: findUser._id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(200).json({ message: "signin done" });
    }
    catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.post('/api/v1/logout', (req, res) => {
    // Clear the cookie by setting it to an expired date
    res.cookie('token', '');
    // Respond with a confirmation message
    res.status(200).json({ message: 'Successfully logged out' });
});
app.post('/api/v1/getplaces', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude } = req.body; // Category ID default set to '13032' for ATMs
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${OPENCAGE_API}`;
    try {
        const response = yield fetch(url);
        const data = yield response.json();
        console.log(data.results);
        if (data.status.code === 200 && data.results.length > 0) {
            const place = data.results[0].formatted;
            const lat = data.results[0].geometry.lat;
            const lon = data.results[0].geometry.lng;
            console.log('Nearby Place:', place);
            res.status(200).json({ place: place, longitude: lon, latitude: lat });
        }
        else {
            console.error('No nearby places found.');
            res.status(400).json({ message: "error" });
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(400).json({ message: "error" });
    }
}));
app.post('/protected', checkAuth_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello, MERN with TypeScript!');
}));
app.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello, MERN with TypeScript!');
}));
app.listen(PORT);
