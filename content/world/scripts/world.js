var stage = new createjs.Stage("world");

var data = {
    images: ["images/sprites.png"],
    frames: {width: 32, height: 32},
    animations: {dirt: 0, grass: 1}
}

var chardata = {
    images: ["images/ranger_m.png"],
    frames: {width: 32, height: 36},
    animations: {
        mu: {
            frames: [0, 1, 2],
            speed: 0.45
        },
        mr: {
            frames: [3, 4, 5],
            speed: 0.45
        },
        md: {
            frames: [6, 7, 8],
            speed: 0.45
        },
        ml: {
            frames: [9, 10, 11],
            speed: 0.45
        },
        u: 1,
        r: 4,
        d: 7,
        l: 10
    }
}

var sheet = new createjs.SpriteSheet(data);
var charSheet = new createjs.SpriteSheet(chardata);

class Map extends createjs.Container {
    constructor(width, height, sheet) {
        super();
        this.width = width;
        this.height = height;
        this.sheet = sheet;
    }

    build() {
        var tw = Math.ceil(this.width / 32);
        var th = Math.ceil(this.height / 32);
        for (var x = 0; x < tw; x++) {
            for (var y = 0; y < tw; y++) {
                var s = new createjs.Sprite(this.sheet);
                s.x = x * 32;
                s.y = y * 32;
                s.gotoAndStop("dirt");
                this.addChild(s);
            }
        }
    }

    grow() {
        var good = this.children.filter(function(item) {
            return item.currentAnimation == "dirt";
        });

        var cnt = getRandomIntInclusive(1, 5);

        for(var n = 0; n < cnt; n++) {
            if(good.length <= 0) break;
            var index = getRandomIntInclusive(0, good.length - 1);
            var tile = good.splice(index, 1);
            tile = tile[0];
            tile.gotoAndStop("grass");
        }

        return cnt;
    }
}

class Person extends createjs.Sprite {
    constructor(sheet) {
        super(sheet);
        this.isMoving = false;
        this.facing = "d";
        document.onkeydown = (e) => {this.keyPressed(e)};
        document.onkeyup = (e) => {this.keyStopped(e)};
        this.on("tick", (e) => {this.ontick(e)});
        this.dirs = {
            87: "u",
            65: "l",
            68: "r",
            83: "d"
        }
        this.dps = 55 / 1000;
        this.lastTick = null;
    }

    keyPressed(event) {
        if(this.dirs[event.keyCode] == undefined) return;
        var dir = this.dirs[event.keyCode];
        if(!this.isMoving || this.facing != dir) {
            this.isMoving = true;
            this.facing = dir;
            this.gotoAndPlay("m" + dir);
        }
    }

    ontick(e) {
        if(!this.isMoving) {
            if(this.lastTick) this.lastTick = null;
            return;
        }
        if(!this.lastTick) {
            this.lastTick = e.timeStamp;
            return;
        }
        var time = e.timeStamp - this.lastTick;
        this.lastTick = e.timeStamp;
        var d = time * this.dps;
        if(this.facing == 'u') {
            this.y -= d;
        }else if(this.facing == 'd') {
            this.y += d;
        }else if(this.facing == 'l') {
            this.x -= d;
        }else{
            this.x += d;
        }
        // Plant grass
        // var bounds = this.getBounds();
        // var tile = c.getObjectUnderPoint(this.x + (bounds.width / 2), this.y + bounds.height, 0);
        // if(tile.currentAnimation == "dirt") tile.gotoAndStop("grass");
    }

    keyStopped(event) {
        if(this.dirs[event.keyCode] == undefined) return;
        var dir = this.dirs[event.keyCode];
        this.isMoving = false;
        this.facing = dir;
        this.gotoAndStop(dir);
    }
}

function fixSize() {
    var obj = document.getElementById("world");
    var width = obj.clientWidth;
    obj.setAttribute("width", width);
    obj.setAttribute("height", width);
    return [width, width];
}

var sizes = fixSize();

var c = new Map(sizes[0], sizes[1], sheet);

c.build();


stage.addChild(c);

character = new Person(charSheet);
character.x = sizes[0] / 2;
character.y = sizes[1] / 2;


stage.addChild(character);

createjs.Ticker.addEventListener("tick", handleTick);

function handleTick() {
    stage.update();
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}