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
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.get('/top', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = 20;
    try {
        const query = `
      SELECT id, track_1, track_2, thumbs_up, thumbs_down, ROUND((thumbs_up/(thumbs_up+thumbs_down))*100, 0) as percentage
      FROM doubledrop_matches
      ORDER BY percentage DESC
      LIMIT $1;
    `;
        const topMatches = yield db_1.default.query(query, [amount]);
        res.status(200).json(topMatches.rows);
    }
    catch (error) {
        throw error;
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { originTrackId, matchingTrackId } = req.body;
    const query = `
    INSERT INTO doubledrop_matches (id, track_1, track_2)
    VALUES ($1, $2, $3)
  `;
    try {
        yield db_1.default.query(query, [(0, uuid_1.v4)(), originTrackId, matchingTrackId]);
        res.status(204).send();
    }
    catch (error) {
        throw error;
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.query.ids;
    if (!ids) {
        res.status(404).send();
    }
    const query = `
    SELECT id, track_1, track_2, thumbs_up, thumbs_down
    FROM doubledrop_matches
    WHERE id = ANY($1::varchar[])
  `;
    try {
        const result = yield db_1.default.query(query, [ids]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        throw error;
    }
}));
router.get('/:trackId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackId } = req.params;
    try {
        const query = `
      SELECT id, track_1, track_2, thumbs_up, thumbs_down
      FROM doubledrop_matches
      WHERE track_1 = $1 OR track_2 = $1
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