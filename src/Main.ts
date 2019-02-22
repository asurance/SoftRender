import { MainView } from './MainView'

function main() {
    const canvas = document.createElement('canvas');
    document.getElementById('document');
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
        document.write('您的浏览器不支持canvas 2d 渲染,建议更换浏览器');
    }
    else {
        canvas.width = 128;
        canvas.height = 128;
        ctx.imageSmoothingEnabled = false;
        document.body.appendChild(canvas);
        new MainView(ctx);
    }
}
main();
