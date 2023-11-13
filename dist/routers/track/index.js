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
exports.default = (db) => {
    const router = express_1.default.Router();
    router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, artist } = req.body;
        const query = `
        INSERT into doubledrop_tracks (artist, title) VALUES ($1, $2) RETURNING id, artist, title, matching_tracks;
    `;
        try {
            const result = yield db.query(query, [artist, title]);
            return res.status(201).json(result.rows[0]);
        }
        catch (error) {
            throw error;
        }
    }));
    router.get('/:trackId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { trackId } = req.params;
        const query = `
      SELECT id, artist, title, matching_tracks FROM doubledrop_tracks WHERE id = $1
    `;
        try {
            const result = yield db.query(query, [trackId]);
            res.status(200).json(result.rows[0]);
        }
        catch (error) {
            throw error;
        }
    }));
    router.delete('/:trackId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { trackId } = req.params;
        const query = `
        DELETE FROM doubledrop_tracks WHERE id = $1;
    `;
        const deleteMatchesQuery = `
        UPDATE doubledrop_tracks
        SET matching_tracks = array_remove(matching_tracks, $1)
    `;
        try {
            yield db.query(query, [trackId]);
            yield db.query(deleteMatchesQuery, [trackId]);
            res.status(200).send();
        }
        catch (error) {
            throw error;
        }
    }));
    return router;
};
//# sourceMappingURL=index.js.map