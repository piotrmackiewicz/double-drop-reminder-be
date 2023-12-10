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
const app_1 = require("firebase/app");
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const search_1 = __importDefault(require("./routers/search"));
const matches_1 = __importDefault(require("./routers/matches"));
const userRating_1 = __importDefault(require("./routers/userRating"));
const support_1 = __importDefault(require("./routers/support"));
const cors_1 = __importDefault(require("cors"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require('dotenv').config();
const port = process.env.PORT || 8080;
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};
firebase_admin_1.default.initializeApp(firebaseConfig);
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
const app = (0, express_1.default)();
if (app.get('env') === 'development') {
    app.use((0, cors_1.default)());
}
else {
    app.use((0, cors_1.default)({
        origin: 'https://ddreminder.vercel.app',
    }));
}
const checkUser = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(idToken);
    return decodedToken.uid;
});
const authMiddleware = (req, res, next) => {
    try {
        const idToken = req.headers.authorization;
        if (!idToken) {
            res.status(401).send();
        }
        const uid = checkUser(idToken);
        req.app.locals.uid = uid;
        next();
    }
    catch (err) {
        res.status(401).json(err);
    }
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/auth', [(0, authRouter_1.default)(firebaseApp)]);
app.use('/search', [authMiddleware, search_1.default]);
app.use('/user-rating', [authMiddleware, userRating_1.default]);
app.use('/matches', [authMiddleware, matches_1.default]);
app.use('/support', [authMiddleware, support_1.default]);
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map