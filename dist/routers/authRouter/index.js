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
const auth_1 = require("firebase/auth");
exports.default = (app) => {
    const router = express_1.default.Router();
    const auth = (0, auth_1.getAuth)(app);
    router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const result = yield (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
            const user = result.user;
            yield (0, auth_1.sendEmailVerification)(result.user);
            res.status(201).send();
        }
        catch (err) {
            throw err;
        }
    }));
    return router;
};
//# sourceMappingURL=index.js.map