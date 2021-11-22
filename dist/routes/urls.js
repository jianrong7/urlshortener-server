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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const nanoid_1 = require("nanoid");
const utils_1 = require("../utils");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/short', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { origUrl } = req.body;
    const base = process.env.BASE;
    const urlId = (0, nanoid_1.nanoid)();
    if ((0, utils_1.validateUrl)(origUrl)) {
        try {
            let url = yield prisma.url.findOne({ origUrl });
            if (url) {
                res.json(url);
            }
            else {
                const shortUrl = `${base}/${urlId}`;
                let url = {
                    origUrl,
                    shortUrl,
                    urlId,
                };
                yield prisma.url.create({
                    data: url
                });
                res.json(url);
            }
            try { }
            catch (err) {
                console.log(err);
                res.status(500).json('Server Error');
            }
        }
        finally {
        }
    }
    else {
        res.status(400).json('Invalid Original Url');
    }
}));
exports.default = router;
//# sourceMappingURL=urls.js.map