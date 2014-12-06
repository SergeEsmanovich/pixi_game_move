var interactive = true;
var stage = new PIXI.Stage(0x66FF99, interactive);
var renderer = PIXI.autoDetectRenderer(800, 800);
var image_ground = new PIXI.Texture.fromImage('ground.jpg');
var ground = new PIXI.TilingSprite(image_ground, 800, 800);
var assetsToLoader = ["2gta3.json"];
loader = new PIXI.AssetLoader(assetsToLoader);
loader.onComplete = onAssetsLoaded
loader.load();
stage.addChild(ground);

var move = {

    napravlenie: 0,
    shag: 0,
    time: 0.1,
    active: 0
};
var point = {
    x: 0,
    y: 0,
    active: 0,
    time: 0.1,
    vector: {
        x: 0,
        y: 0,
        k: 0
    },
    Way: {
        x: 0,
        y: 0
    },
    Speed: 0,
    Normalize: function() {
        this.Speed = Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y); //вычислили длину вектора
        this.Way.x *= 1 / this.Speed; //нормализуем вектор
        this.Way.y *= 1 / this.Speed;
    }
}

function norm(vector) {
    var Way = {
        x: 1,
        y: 1,
        Speed: 1
    };
    Way.Speed = Math.sqrt(vector.x * vector.x + vector.y * vector.y); //вычислили длину вектора
    Way.x *= 1 / Way.Speed; //нормализуем вектор
    Way.y *= 1 / Way.Speed;
    return Way;
};

$(document).ready(function() {
    $('.game').append(renderer.view);

    $('.game').click(function(e) {

        point.x = e.clientX;
        point.y = e.clientY;
        point.active = 1;
    });

    //Клавиша нажата
    $(document).keydown(function(event) {

        //Вверх
        if (event.which == 38) {
            move.napravlenie = 1; //вверх
            //Замедлление начала движения
            move.shag = (Math.sqrt(move.time) < 3) ? Math.sqrt(move.time) : 3;
            move.active = 1;
            move.time += 0.1;

            //console.log(move.shag);
        }
        //Вниз  
        if (event.which == 40) {
            move.napravlenie = 2; //вниз
            move.shag = (Math.sqrt(move.time) < 3) ? Math.sqrt(move.time) : 3;
            move.active = 1;
            move.time += 0.1;
        }
        //Влево
        if (event.which == 37) {
            move.napravlenie = 4; //влево
            move.shag = (Math.sqrt(move.time) < 3) ? Math.sqrt(move.time) : 3;
            move.active = 1;
            move.time += 0.1;
        }
        //Вправо
        if (event.which == 39) {
            move.napravlenie = 3; //вправо
            move.shag = (Math.sqrt(move.time) < 3) ? Math.sqrt(move.time) : 3;
            move.active = 1;
            move.time += 0.1;
        }

    });
    //Клавиша поднята
    $(document).keyup(function(event) {
        move.active = 2;
        move.time = move.time / 10;
        move.shag = 1;

    })

});

function onAssetsLoaded() {
    var texture = PIXI.Texture.fromImage("player.png");
    var frames = [];
    for (var i = 0; i < 7; i++) {
        var val = i;
        frames.push(PIXI.Texture.fromFrame("player" + val + ".png"));
    };
    //frames.push(PIXI.Texture.fromFrame("player6.png"));
    movie = new PIXI.MovieClip(frames);
    movie.position.x = 300;
    movie.position.y = 300;
    movie.anchor.x = movie.anchor.y = 0.5;
    movie.animationSpeed = 0.01;

    stage.addChild(movie);
    // start animating
    requestAnimFrame(animate);
}


function animate() {
    requestAnimFrame(animate);


    if (point.active == 1) {
        movie.animationSpeed = 0.09;
        // movie.stop();
        movie.play();
        point.vector.x = point.x - movie.position.x;
        point.vector.y = point.y - movie.position.y;
        point.vector.k = (point.y - movie.position.y) / (point.x - movie.position.x);
        movie.rotation = Math.atan2(point.vector.y, point.vector.x);
        //point.active = 0;
        movie.position.x += point.vector.x / 100;
        movie.position.y += point.vector.y / 100;
        ground.tilePosition.x -= point.vector.x / 100;
        ground.tilePosition.y -= point.vector.y / 100;

        if ((movie.position.x + 5 > point.x) && (movie.position.x - 5 < point.x))
            if ((movie.position.y + 5 > point.y) && (movie.position.y - 5 < point.y)) {
                movie.gotoAndStop(0);
                point.active = 0;

            }
    }



    if (move.active == 1) { //Начало движения
        point.active = 0;
        movie.play();

        if (move.napravlenie == 1) { //вверх
            movie.rotation = 3 * Math.PI / 2;
            movie.position.y -= move.shag;
            if (movie.position.y < 0)
                movie.position.y = 800;
            if (movie.animationSpeed < 0.04)
                movie.animationSpeed = Math.sqrt(move.time / 100);
            ground.tilePosition.y += move.shag;
            // console.log(move.shag);

        }
        if (move.napravlenie == 2) { //вниз
            movie.rotation = Math.PI / 2;
            movie.position.y += move.shag;
            if (movie.position.y > 800)
                movie.position.y = 0;
            if (movie.animationSpeed < 0.04)
                movie.animationSpeed = Math.sqrt(move.time / 100);
            ground.tilePosition.y -= move.shag;

        }
        if (move.napravlenie == 3) { //вправо
            movie.rotation = 2 * Math.PI;
            movie.position.x += move.shag;
            if (movie.position.x > 800)
                movie.position.x = 0;
            if (movie.animationSpeed < 0.04)
                movie.animationSpeed = Math.sqrt(move.time / 100);
            ground.tilePosition.x -= move.shag;
        }
        if (move.napravlenie == 4) { //влево
            movie.rotation = Math.PI;
            movie.position.x -= move.shag;
            if (movie.position.x < 0)
                movie.position.x = 800;
            if (movie.animationSpeed < 0.04)
                movie.animationSpeed = Math.sqrt(move.time / 100);
            ground.tilePosition.x += move.shag;
        }
    }
    if (move.active == 2) {
        movie.animationSpeed = 0.01;
        movie.gotoAndStop(0);
        move.active = 0;
    }
    // render the stage
    renderer.render(stage);
}