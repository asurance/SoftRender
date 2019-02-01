"use strict";
class MainView {
    constructor(ctx) {
        this.ctx = ctx;
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        console.log(this.renderID);
    }
}
//# sourceMappingURL=MainView.js.map