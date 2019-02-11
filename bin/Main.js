"use strict";
function main() {
    const canvas = document.createElement('canvas');
    document.getElementById('document');
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
        document.write('您的浏览器不支持canvas 2d 渲染,建议更换浏览器');
    }
    else {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        window.addEventListener('resize', (ev) => {
            canvas.width = document.documentElement.clientWidth;
            canvas.height = document.documentElement.clientHeight;
        });
        document.body.appendChild(canvas);
        new MainView(ctx);
    }
}
//# sourceMappingURL=Main.js.map