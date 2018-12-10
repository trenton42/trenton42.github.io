
class Side {

    constructor(cid, pid) {
        this.canvas = document.getElementById(cid);
        this.parent = document.getElementById(pid);
        this.ctx = this.canvas.getContext("2d");
        this.interval = null;
        this.blocks = [];
        this.tickLength = 200;
        this.spawnCount = 50;
        this.pSize = 5;
    }

    fixup() {
        this.canvas.setAttribute("height", this.parent.scrollHeight);
        this.canvas.setAttribute("width", this.parent.clientWidth);
        this.width = this.parent.clientWidth;
        this.height = this.parent.scrollHeight;
    }

    spawn() {
        for(var i = 0; i < this.spawnCount; i++) {
            var p = new Pix(this);
            this.blocks.push(p);
        }
    }

    start() {
        this.interval = setInterval(() => {
            this.tick();
        }, this.tickLength);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    tick() {
        for(var i of this.blocks) {
            i.tick();
        }
    }
}

class Pix {
    constructor(parent) {
        this.sz = parent.pSize;
        this.ctx = parent.ctx;
        this.width = parent.width;
        this.height = parent.height;
        this.x = randInt(0, this.width - this.sz, this.sz);
        this.y = randInt(0, this.height - this.sz, this.sz);
        this.minColor = randInt(0, 60);
        this.maxColor = randInt(65, 128);
        this.color = randInt(this.minColor, this.maxColor);
        this.dir = [1, -1][randInt(0, 1)];
        this.alpha = 0;
    }

    draw() {
        var oldFill = this.ctx.fillStyle;
        this.ctx.fillStyle = `rgba(${this.color}, ${this.color}, ${this.color}, ${this.alpha / 100})`
        this.ctx.fillRect(this.x, this.y, this.sz, this.sz);
        this.ctx.fillStyle = oldFill;
    }

    tick() {
        this.draw();
        if(this.alpha < 100) this.alpha++;
        this.color += (5 * this.dir);
        if(this.dir == 1 && this.color >= this.maxColor) {
            this.color = this.maxColor;
            this.dir = -1;
        }else if(this.dir == -1 && this.color <= this.minColor) {
            this.color = this.minColor;
            this.dir = 1;
        }
    }
}

var s;

window.addEventListener('load', () => {
    s = new Side("sidecan", "sidebar");
    s.fixup();
    s.spawn();
    s.start();
});

function randInt(min, max, step) {
    if(!step) step = 1;
    min = Math.ceil(min);
    max = Math.floor(max);
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    var off = num % step;
    if(off < step / 2) {
        num = num - off;
    }else{
        num = num + step - off;
    }
    return num;
}