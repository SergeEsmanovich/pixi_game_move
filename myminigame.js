var interactive = true;
var stage = new PIXI.Stage(0x66FF99, interactive);
var renderer = PIXI.autoDetectRenderer(800, 800);
var image_ground = new PIXI.Texture.fromImage('ground.jpg');
var ground = new PIXI.TilingSprite(image_ground, 800, 800);
var assetsToLoader = ["2gta3.json", "fighter.json", "zombie_spawn.json", "zombie_walk.json","zombie_attack.json"];
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
    Speed: 0

}

torel_point = point;

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

        if (event.which == 70) {
            turel.active = 1;
        }
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

var zombie_walk = [];
var zombie_attack = [];
function onAssetsLoaded() {
    var zombie_spawn = [];
    for (var i = 0; i < 25; i++) {
        zombie_spawn.push(PIXI.Texture.fromFrame("zombie" + i + ".png"));
        zombie_attack.push(PIXI.Texture.fromFrame("zombie_attack" + i + ".png"));
    };


    for (var i = 0; i < 22; i++) {
        zombie_walk.push(PIXI.Texture.fromFrame("zombie_walk" + i + ".png"));
    };

    zombi = new PIXI.MovieClip(zombie_spawn);
    zombi.position.x = 200;
    zombi.position.y = 200;
    zombi.anchor.x = zombi.anchor.y = 0.5;
    zombi.animationSpeed = 0.4;
   
    zombi.interactive = true;
    zombi.active = 1;
    zombi.time = 0;
    zombi.click = function() {
        zombi.textures = zombie_walk;
        console.log(zombi);
        zombi.stop();
        zombi.play();
    }



    zombi.play();

    var frames2 = [];

    for (var i = 0; i < 30; i++) {
        var val = i < 10 ? "0" + i : i;
        frames2.push(PIXI.Texture.fromFrame("rollSequence00" + val + ".png"));
    };

    var frames = [];
    for (var i = 0; i < 7; i++) {
        var val = i;
        frames.push(PIXI.Texture.fromFrame("player" + val + ".png"));
    };
    //frames.push(PIXI.Texture.fromFrame("player6.png"));
    movie = new PIXI.MovieClip(frames);
    turel = new PIXI.MovieClip(frames);



    turel.position.x = 100;
    turel.position.y = 100;
    turel.anchor.x = turel.anchor.y = 0.5;
    stage.addChild(turel);


    movie.position.x = 400;
    movie.position.y = 400;
    movie.anchor.x = movie.anchor.y = 0.5;
    movie.animationSpeed = 0.01;
    stage.addChild(movie);
    stage.addChild(zombi);
    turel.interactive = true;
    turel.click = function() {


    }


    // start animating
    requestAnimFrame(animate);
}


function animate() {
    requestAnimFrame(animate);
    if (turel.active == 1) {
        turel.animationSpeed = 0.09;

        turel.play();

        turel.active = 0;
    }

    if (zombi.active == 1) {
        zombi.time += 1;
    }

    if (zombi.time > 60) {
        zombi.active = 0;
        zombi.textures = zombie_walk;
        //  console.log(zombi);
        zombi.gotoAndStop(24);
        zombi.play();
        zombi.time = 0;

        zombi.active = 2;

    }


    if (zombi.active == 2) {
         zombi.textures = zombie_walk;
        // zombi.gotoAndStop(25);
         zombi.play();
        //Зомби бежит за игроком
        vector_to_player = {
            x: movie.position.x - zombi.position.x,
            y: movie.position.y - zombi.position.y
        }
        modul_player = Math.sqrt(vector_to_player.x * vector_to_player.x + vector_to_player.y * vector_to_player.y);

        zombi.position.x += vector_to_player.x / modul_player;
        zombi.position.y += vector_to_player.y / modul_player;
        //Зомби смотрит на игрока
        zombi.rotation = Math.atan2(vector_to_player.y, vector_to_player.x);
  
  if ((zombi.position.x + 50 > movie.position.x) && (zombi.position.x - 50 < movie.position.x))
            if ((zombi.position.y + 50 > movie.position.y) && (zombi.position.y - 50 < movie.position.y)) {
                zombi.gotoAndStop(0);
                zombi.active = 3;
               zombi.textures  =  zombie_attack;
               zombi.gotoAndStop(22);
               zombi.play();
            }
        
    }


    if (point.active == 1) {

 zombi.active = 2;  

        //console.log(movie);
        movie.animationSpeed = 0.09;
        // movie.stop();
        movie.play();
        point.vector.x = point.x - movie.position.x;
        point.vector.y = point.y - movie.position.y;
        point.vector.k = (point.y - movie.position.y) / (point.x - movie.position.x);
        movie.rotation = Math.atan2(point.vector.y, point.vector.x);
        //point.active = 0;
        //


        modul = Math.sqrt(point.vector.x * point.vector.x + point.vector.y * point.vector.y);


        movie.position.x += 3 * point.vector.x / modul;
        movie.position.y += 3 * point.vector.y / modul;



        // ground.tilePosition.x -= point.vector.x / modul;
        // ground.tilePosition.y -= point.vector.y / modul;
        // turel.position.x -= point.vector.x / modul;
        //  turel.position.y -= point.vector.y / modul;



        torel_point.vector.x = movie.position.x - turel.position.x;
        torel_point.vector.y = movie.position.y - turel.position.y;

        turel.rotation = Math.atan2(torel_point.vector.y, torel_point.vector.x);


        if ((movie.position.x + 5 > point.x) && (movie.position.x - 5 < point.x))
            if ((movie.position.y + 5 > point.y) && (movie.position.y - 5 < point.y)) {
                movie.gotoAndStop(0);
                point.active = 0;
                point.Speed = 0;
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