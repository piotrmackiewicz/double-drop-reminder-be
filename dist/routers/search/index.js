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
const db_1 = __importDefault(require("../../db"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { field } = req.query;
    const { search } = req.body;
    let queryFields = "artist || ' ' || title";
    if (field === 'artist') {
        queryFields = 'artist';
    }
    else if (field === 'title') {
        queryFields = 'title';
    }
    let query = ` 
            SELECT id, title, artist 
            FROM doubledrop_tracks
            WHERE to_tsvector('simple', ${queryFields}) @@ to_tsquery('simple', $1);`;
    try {
        const results = yield db_1.default.query(query, ["'" + search + "':*"]);
        res.status(200).json(results.rows);
    }
    catch (error) {
        throw error;
    }
}));
router.get('/get-spotify-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield axios_1.default.post('https://accounts.spotify.com/api/token', {
        grant_type: 'client_credentials',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    res.status(200).json({ accessToken: result.data.access_token });
}));
exports.default = router;
//# sourceMappingURL=index.js.map