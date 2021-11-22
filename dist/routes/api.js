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
const express_1 = require("express");
const nanoid_1 = require("nanoid");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const utils_1 = require("../utils");
const apiRouter = (0, express_1.Router)();
apiRouter.post("/short", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { origUrl } = req.body;
    const base = process.env.BASE;
    const urlId = (0, nanoid_1.nanoid)(8);
    if ((0, utils_1.validateUrl)(origUrl)) {
        try {
            let url = yield prismaClient_1.default.url.findUnique({
                where: {
                    origUrl,
                },
            });
            if (url) {
                res.json(url);
            }
            else {
                const shortUrl = `${base}/${urlId}`;
                let url = yield prismaClient_1.default.url.create({
                    data: {
                        origUrl,
                        shortUrl,
                        urlId,
                        clicks: 0,
                        qrCode: `https://chart.googleapis.com/chart?chs=150x150&cht=qr&choe=UTF-8&chl=${origUrl}`,
                    },
                });
                res.json(url);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json("Server Error");
        }
    }
    else {
        res.status(400).json("Invalid Original Url");
    }
}));
apiRouter.put("/custom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { origUrl, urlId } = req.body;
    const base = process.env.BASE;
    const shortUrl = base + "/" + urlId;
    if ((0, utils_1.validateUrl)(origUrl)) {
        try {
            let url = yield prismaClient_1.default.url.findUnique({
                where: {
                    origUrl,
                },
            });
            if (url) {
                if (url.shortUrl === base + urlId) {
                    res.json(url);
                }
                else {
                    url = yield prismaClient_1.default.url.update({
                        where: { origUrl },
                        data: {
                            origUrl,
                            urlId,
                            shortUrl,
                            clicks: 0,
                            qrCode: `https://chart.googleapis.com/chart?chs=150x150&cht=qr&choe=UTF-8&chl=${origUrl}`,
                        },
                    });
                    res.json(url);
                }
            }
            else {
                let url = yield prismaClient_1.default.url.create({
                    data: {
                        origUrl,
                        urlId,
                        shortUrl,
                        clicks: 0,
                        qrCode: `https://chart.googleapis.com/chart?chs=150x150&cht=qr&choe=UTF-8&chl=${origUrl}`,
                    },
                });
                res.json(url);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json("Server Error");
        }
    }
    else {
        res.status(400).json("Invalid Original Url");
    }
}));
exports.default = apiRouter;
//# sourceMappingURL=api.js.map