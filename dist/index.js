"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const search_1 = __importDefault(require("./routers/search"));
const matchingTracks_1 = __importDefault(require("./routers/matchingTracks"));
const track_1 = __importDefault(require("./routers/track"));
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://double-drop-reminder-fe.vercel.app',
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/search', (0, search_1.default)(db_1.default));
app.use('/matching-tracks', (0, matchingTracks_1.default)(db_1.default));
app.use('/track', (0, track_1.default)(db_1.default));
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map