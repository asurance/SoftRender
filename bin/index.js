"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function LoadJsMap() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'jsmap.json');
        xhr.addEventListener('load', xhrLoaded);
        xhr.send(null);
        function xhrLoaded() {
            xhr.removeEventListener('load', xhrLoaded);
            const jsmap = JSON.parse(xhr.response);
            resolve(jsmap);
        }
    });
}
function LoadJscript(path) {
    return new Promise((resove, reject) => {
        const node = document.createElement('script');
        node.src = path;
        node.addEventListener('load', nodeLoaded);
        document.body.appendChild(node);
        function nodeLoaded() {
            node.removeEventListener('load', nodeLoaded);
            if (node.parentNode == null) {
                document.write('存在节点没能正常加入界面');
            }
            else {
                node.parentNode.removeChild(node);
            }
            resove();
        }
    });
}
function LoadScript() {
    return __awaiter(this, void 0, void 0, function* () {
        const jsmap = yield LoadJsMap();
        yield Promise.all(jsmap.map((val, i, arr) => {
            if (/index.js/.test(val)) {
                return Promise.resolve();
            }
            return LoadJscript(val);
        }));
        const node = document.getElementById('entry');
        if (node == null) {
            document.write('不存在 entry 节点');
        }
        else {
            if (node.parentNode == null) {
                document.write('entry 节点 位置异常');
            }
            else {
                node.parentNode.removeChild(node);
                main();
            }
        }
    });
}
LoadScript();
//# sourceMappingURL=index.js.map