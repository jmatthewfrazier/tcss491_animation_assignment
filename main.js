function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    this.x = 0;
    this.y = 0;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./Images/farm.jpg"), this.x, this.y);
}

/////////////////////////////// NEST ///////////////////////////////

function Nesty(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./Images/nest.png"), 0, 0, 600, 395, 1, 1, true, false);
    this.x = x;
    this.y = y;
    Entity.call(this, game, this.x, this.y);
}

Nesty.prototype = new Entity();
Nesty.prototype.constructor = Nesty;

Nesty.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Nesty.prototype.draw = function (ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .18);
    Entity.prototype.draw.call(this);
}

/////////////////////////////// EGG ///////////////////////////////

function Eggy(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./Images/egg.png"), 0, 0, 27, 34, 1, 1, true, false);
    this.x = x;
    this.y = y;
    Entity.call(this, game, this.x, this.y);
}

Eggy.prototype = new Entity();
Eggy.prototype.constructor = Eggy;

Eggy.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Eggy.prototype.draw = function (ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/////////////////////////////// BOX ///////////////////////////////

function Boxy(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./Images/crate.png"), 0, 0, 1280, 980, 1, 1, true, false);
    this.x = x;
    this.y = y;
    Entity.call(this, game, this.x, this.y);
}

Boxy.prototype = new Entity();
Boxy.prototype.constructor = Boxy;

Boxy.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Boxy.prototype.draw = function (ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .1);
    Entity.prototype.draw.call(this);
}

/////////////////////////////// FOX ///////////////////////////////

function Foxy(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./Images/fox.png"), 0, 0, 153, 139, 0.08, 12, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./Images/fox_jump.png"), 0, 0, 153, 139, 0.08, 28, false, false);
    this.pauseAnimation = new Animation(ASSET_MANAGER.getAsset("./Images/fox_pause.png"), 0, 0, 153, 139, 0.08, 56, true, false);
    this.walkAnimation = new Animation(ASSET_MANAGER.getAsset("./Images/fox_walk.png"), 0, 0, 153, 139, 0.08, 24, true, false);
    this.eatAnimation = new Animation(ASSET_MANAGER.getAsset("./Images/fox_eat.png"), 0, 0, 153, 139, 0.1, 20, false, false);
    this.bustedAnimation = new Animation(ASSET_MANAGER.getAsset("./Images/fox_busted.png"), 0, 0, 153, 139, 0.1, 2, true, false);
    this.runAnimation = new Animation(ASSET_MANAGER.getAsset("./Images/fox_run.png"), 0, 0, 153, 139, 0.08, 12, true, true);
    this.walking = true;
    this.jumping = false;
    this.running = false;
    this.pause = false;
    this.eat = false;
    this.busted = false;
    this.runAway = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 1280, 400);
}

Foxy.prototype = new Entity();
Foxy.prototype.constructor = Foxy;

Foxy.prototype.update = function () {
	console.log(Math.floor(this.game.timer.gameTime));

	if (Math.floor(this.game.timer.gameTime) === 9) {
		this.walking = false;
		this.pause = true;
	}
	if (Math.floor(this.game.timer.gameTime) === 13) {
		this.pause = false;
		this.running = true;
	}
	if (Math.floor(this.game.timer.gameTime) === 16) {
		this.running = false;
		this.jumping = true;
	}
	if (Math.floor(this.game.timer.gameTime) === 20) {
		this.pause = false;
		this.eat = true;
	}
	if (Math.floor(this.game.timer.gameTime) === 23) {
		this.busted = false;
		this.runAway = true;
	}

    if (this.walking) this.x -= 0.7;
    if (this.running) this.x -= 2;
    if (this.x < -153) this.x = 1280;
    if (this.eat) {
    	if (this.eatAnimation.isDone()) {
            this.eatAnimation.elapsedTime = 0;
            this.eat = false;
            this.busted = true;
        }
    }
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 90;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        this.x -= 1.8;

        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    if (this.runAway) {
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;

        this.x += 2.2;

        var height = (-4 * (jumpDistance * jumpDistance - jumpDistance));
        if (this.y < this.ground) this.y += height;
    }
    Entity.prototype.update.call(this);
}

Foxy.prototype.draw = function (ctx) {
    if (this.walking) {
        this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.jumping) {
        if (this.jumpAnimation.elapsedTime < this.jumpAnimation.totalTime * 18 / 28) {
            this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x - 17, this.y - 34);
        } else {
        	this.jumping = false;
        	this.pause = true;
        }
    } else if (this.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.eat) {
    	this.eatAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.busted) {
    	this.bustedAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.runAway) {
    	this.runAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
        this.pauseAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

/////////////////////////////// CHICKEN ///////////////////////////////

function Chicky(game, pause) {
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./Images/chicken.png"), 0, 0, 148, 110, 0.08, 42, true, false);
    this.radius = 100;
    this.ground = 400;
    this.jumping = false;
    this.xFactor = Math.random() + 1;
    this.yFactor = Math.random() * 3;
    this.start = 21 + Math.floor((Math.random() * pause));
    Entity.call(this, game, -148, 400);
}

Chicky.prototype = new Entity();
Chicky.prototype.constructor = Chicky;

Chicky.prototype.update = function () {
	if (Math.floor(this.game.timer.gameTime) === this.start) {
		this.jumping = true;
	}

    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 100;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        this.x += this.xFactor;

        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance)) * this.yFactor;
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

Chicky.prototype.draw = function (ctx) {
	if (this.jumping) this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y + 34);
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./Images/farm.jpg");
ASSET_MANAGER.queueDownload("./Images/fox.png");
ASSET_MANAGER.queueDownload("./Images/fox_jump.png");
ASSET_MANAGER.queueDownload("./Images/fox_pause.png");
ASSET_MANAGER.queueDownload("./Images/fox_walk.png");
ASSET_MANAGER.queueDownload("./Images/fox_eat.png");
ASSET_MANAGER.queueDownload("./Images/fox_busted.png");
ASSET_MANAGER.queueDownload("./Images/fox_run.png");
ASSET_MANAGER.queueDownload("./Images/crate.png");
ASSET_MANAGER.queueDownload("./Images/egg.png");
ASSET_MANAGER.queueDownload("./Images/nest.png");
ASSET_MANAGER.queueDownload("./Images/chicken.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var fox = new Foxy(gameEngine);
    var box1 = new Boxy(gameEngine, 280, 430);
    var box2 = new Boxy(gameEngine, 280 + 100, 430);
    var nest = new Nesty(gameEngine, 280, 410);
    var egg = new Eggy(gameEngine, 320, 405);
    var chicken1 = new Chicky(gameEngine, 0);
    var chicken2 = new Chicky(gameEngine, 2);
    var chicken3 = new Chicky(gameEngine, 3);
    var chicken4 = new Chicky(gameEngine, 4);
    var chicken5 = new Chicky(gameEngine, 5);
    var chicken6 = new Chicky(gameEngine, 6);
    var chicken7 = new Chicky(gameEngine, 7);
    var chicken8 = new Chicky(gameEngine, 8);
    var chicken9 = new Chicky(gameEngine, 9);
    var chicken10 = new Chicky(gameEngine, 10);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(box1);
    gameEngine.addEntity(box2);
    gameEngine.addEntity(nest);
    gameEngine.addEntity(egg);
    gameEngine.addEntity(fox);
    gameEngine.addEntity(chicken1);
    gameEngine.addEntity(chicken2);
    gameEngine.addEntity(chicken3);
    gameEngine.addEntity(chicken4);
    gameEngine.addEntity(chicken5);
    gameEngine.addEntity(chicken6);
    gameEngine.addEntity(chicken7);
    gameEngine.addEntity(chicken8);
    gameEngine.addEntity(chicken9);
    gameEngine.addEntity(chicken10);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
