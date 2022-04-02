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
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const indexRouter = (0, express_1.Router)();
indexRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = yield bcryptjs_1.default.hashSync(password, salt);
        yield prismaClient_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
    }
    catch (err) {
        console.log(err);
    }
}));
// indexRouter.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email
//       }
//     })
//     if (user) {
// bcrypt.compareSync("B4c0//", hash);
//       if (await argon2.verify(await argon2.hash(password), user.password)) {
//       }
//     }
//   }
// })
indexRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield prismaClient_1.default.url.findUnique({
            where: {
                urlId: req.params.id,
            },
        });
        if (url) {
            yield prismaClient_1.default.url.update({
                where: { urlId: req.params.id },
                data: {
                    clicks: {
                        increment: 1,
                    },
                },
            });
            return res.redirect(url.origUrl);
        }
        else {
            res.status(404).json("Not found");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Server Error");
    }
}));
indexRouter.get("/", (req, res) => {
    res.send("Hello World");
});
exports.default = indexRouter;
//# sourceMappingURL=index.js.map