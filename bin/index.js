"use strict";
const canvas = document.createElement('canvas');
document.getElementById('document');
const ctx = canvas.getContext('2d');
let curID;
if (ctx == null) {
    document.write('您的浏览器不支持canvas 2d 渲染,建议更换浏览器');
}
else {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    window.addEventListener('resize', (ev) => {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        if (curID == undefined) {
            curID = requestAnimationFrame(() => {
                curID = undefined;
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
            });
        }
    });
    document.body.appendChild(canvas);
}
//# sourceMappingURL=index.js.map