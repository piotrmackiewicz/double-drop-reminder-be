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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = yield req.app.locals.uid;
    const query = `
    SELECT id, match_id FROM doubledrop_users_ratings
    WHERE uid = $1
  `;
    try {
        const result = yield db_1.default.query(query, [uid]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        throw error;
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = yield req.app.locals.uid;
    const { matchId, rate } = req.body;
    const client = yield db_1.default.connect();
    const userRatingsQuery = `
    INSERT INTO doubledrop_users_ratings (id, uid, match_id, rating)
    VALUES ($1, $2, $3, $4)
  `;
    const matchesQuery = `
    UPDATE doubledrop_matches
    SET ${rate ? 'thumbs_up = thumbs_up + 1' : 'thumbs_down = thumbs_down + 1'}
    WHERE id = $1;
  `;
    try {
        yield client.query('BEGIN');
        yield client.query(userRatingsQuery, [(0, uuid_1.v4)(), uid, matchId, rate]);
        yield client.query(matchesQuery, [matchId]);
        yield client.query('COMMIT');
        res.status(201).send();
    }
    catch (e) {
        yield client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map