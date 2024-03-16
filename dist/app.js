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
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("./database/connect");
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const auth_1 = __importDefault(require("./routers/auth"));
const user_1 = __importDefault(require("./routers/user"));
const hostRequest_1 = __importDefault(require("./routers/hostRequest"));
const listing_1 = __importDefault(require("./routers/listing"));
const reservation_1 = __importDefault(require("./routers/reservation"));
const admin_1 = __importDefault(require("./routers/admin"));
const cashout_1 = __importDefault(require("./routers/cashout"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cloudinary_1 = require("cloudinary");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
app.use((0, express_fileupload_1.default)());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use(express_1.default.json());
// app.use(express.static(path.resolve(__dirname, './client/build')));
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/user', user_1.default);
app.use('/api/v1/hostRequest', hostRequest_1.default);
app.use('/api/v1/listing', listing_1.default);
app.use('/api/v1/reservation', reservation_1.default);
app.use('/api/v1/admin', admin_1.default);
app.use('/api/v1/cashout', cashout_1.default);
// app.get('*', (req: Request, res: Response) => {
//     return res.status(StatusCodes.OK).sendFile(path.resolve(__dirname, './client/build/index.html'));
// });
app.use(not_found_1.default);
app.use(error_handler_1.default);
const port = Number(process.env.PORT) || 4000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
