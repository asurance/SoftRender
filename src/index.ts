function LoadJsMap() {
    return new Promise<string[]>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'jsmap.json');
        xhr.addEventListener('load', xhrLoaded);
        xhr.send(null);
        function xhrLoaded() {
            xhr.removeEventListener('load', xhrLoaded);
            const jsmap: string[] = JSON.parse(xhr.response);
            resolve(jsmap);
        }
    })
}
function LoadJscript(path: string) {
    return new Promise<void>((resove, reject) => {
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
    })
}
async function LoadScript() {
    const jsmap = await LoadJsMap();
    await Promise.all(jsmap.map((val, i, arr) => {
        if (/index.js/.test(val)) {
            return Promise.resolve();
        }
        return LoadJscript(val);
    }))
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
}
LoadScript();