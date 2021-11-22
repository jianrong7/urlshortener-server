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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const api_1 = __importDefault(require("./routes/api"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        yield prismaClient_1.default.$connect();
        app.use("/api", api_1.default);
        app.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        app.get("/", (req, res) => {
            res.send("Hello World");
        });
        const PORT = process.env.PORT || 3333;
        app.listen(PORT, () => {
            console.log(`SERVER RUNNING ON PORT ${PORT}`);
        });
    });
}
main()
    .catch((e) => {
    throw e;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.default.$disconnect();
}));
//# sourceMappingURL=index.js.map