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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = yield req.app.locals.uid;
    const query = `
    SELECT thumb_up_matches_ids, thumb_down_matches_ids
    FROM doubledrop_users_ratings
    WHERE uid = $1;
  `;
    try {
        const result = yield db_1.default.query(query, [uid]);
        res.status(200).json(result.rows[0]);
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
    UPDATE doubledrop_users_ratings
    SET ${rate === 0
        ? 'thumb_down_matches_ids = ARRAY_APPEND(thumb_down_matches_ids, $1)'
        : 'thumb_up_matches_ids = ARRAY_APPEND(thumb_up_matches_ids, $1)'}
    WHERE uid = $2;
  `;
    const matchesQuery = `
    UPDATE doubledrop_matches
    SET ${rate === 0 ? 'thumbs_down = thumbs_down + 1' : 'thumbs_up = thumbs_up + 1'}
    WHERE id = $1;
  `;
    try {
        yield client.query('BEGIN');
        yield client.query(userRatingsQuery, [matchId, uid]);
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