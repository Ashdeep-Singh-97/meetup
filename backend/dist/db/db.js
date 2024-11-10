"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// MongoDB URI from environment variables
const mongoURI = process.env.DB_URL || "";
// Connect to MongoDB
mongoose_1.default.connect(mongoURI)
    .then(() => {
    console.log('Connected to the MeetUp database');
})
    .catch((error) => {
    console.error('Error connecting to the MeetUp database:', error);
});
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: false }
}, {
    timestamps: true,
});
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
