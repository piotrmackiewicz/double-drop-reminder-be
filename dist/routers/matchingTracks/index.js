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
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { originTrackId, matchingTrackId } = req.body;
    const query = `
      INSERT INTO doubledrop_matches (track_1, track_2)
      VALUES ($1, $2)
    `;
    try {
        yield db_1.default.query(query, [originTrackId, matchingTrackId]);
        res.status(204).send();
    }
    catch (error) {
        throw error;
    }
}));
router.get('/:trackId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackId } = req.params;
    try {
        const query = `
        SELECT tracks.id, tracks.artist, tracks.title, matches.id as match_id, matches.thumbs_up, matches.thumbs_down
        FROM doubledrop_matches as matches
        LEFT JOIN doubledrop_tracks as tracks ON (tracks.id = matches.track_1 OR tracks.id = matches.track_2) AND tracks.id != $1
        WHERE matches.track_1 = $1 OR matches.track_2 = $1
      `;
        const matchingTracks = yield db_1.default.query(query, [trackId]);
        res.status(200).json(matchingTracks.rows);
    }
    catch (error) {
        throw error;
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map