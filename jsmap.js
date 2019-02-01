"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
let jsmap = [];
const fileArr = fs.readdirSync(process.argv[2]);
fileArr.forEach((val, i, arr) => {
    if ((/.js$/).test(val)) {
        jsmap.push(`./bin/${val}`);
    }
});
fs.writeFileSync('jsmap.json', JSON.stringify(jsmap));