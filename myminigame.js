var target;
var position;
var rotation;
var player2;
var players = [];
var socket;
//function chat() {
if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
    socket = io.connect('http://localhost:85', {
        'transports': ['xhr-polling']
    });
} else {
    socket = io.connect('http://localhost:85');
}
//}
$(document).ready(function() {
    //  chat();
});
/*
Рздел объявления данных
 */
var interactive = true;
var stage = new PIXI.Stage(0x66FF99, interactive);
var renderer = PIXI.autoDetectRenderer(800, 800);
var image_ground = new PIXI.Texture.fromImage('ground.jpg');
var ground = new PIXI.TilingSprite(image_ground, 800, 800);
var assetsToLoader = ["2gta3.json", "fighter.json", "zombie_spawn.json", "zombie_walk.json", "zombie_attack.json"];
loader = new PIXI.AssetLoader(assetsToLoader);
loader.onComplete = onAssetsLoaded
loader.load();
stage.addChild(ground);
//Добаление игры на страницу
$(document).ready(function() {
    $('.game').append(renderer.view);
    $('.game').click(function(e) {
        player.target.x = e.clientX;
        player.target.y = e.clientY;
        player.active = 1;
        socket.emit('target', player.target);
    });
});
//////////////////////Текстуры/////////////////////////////////////////////{ 
//Класс крипов
function Mob() {
    this.spawn = [];
    this.spawn_time = 60;
    this.walk = [];
    this.attack = [];
    this.animationSpeed = 0.4;
    this.active = 1;
    this.time = 1;
    this.anchor = {
        x: 0.5,
        y: 0.5
    };
    this.position = {
        x: 100,
        y: 100
    };
    this.movie = 0;
    this.set_param = function() {
            this.movie.anchor = this.anchor;
            this.movie.animationSpeed = this.animationSpeed;
            this.movie.position = this.position;
        }
        //Поиск игрока крипом
    this.target = {
        x: 0,
        y: 0
    }; //Цель
    this.vector_to_target = {
        x: 0,
        y: 0
    };
    this.FindPlayer = function() {
        this.vector_to_target.x = this.target.x - this.movie.position.x;
        this.vector_to_target.y = this.target.y - this.movie.position.y;
        this.movie.rotation = Math.atan2(this.vector_to_target.y, this.vector_to_target.x);
    }; //Найти игрока
    this.Move = function() {
        modul_target = Math.sqrt(this.vector_to_target.x * this.vector_to_target.x + this.vector_to_target.y * this.vector_to_target.y);
        this.movie.position.x += this.vector_to_target.x / modul_target;
        this.movie.position.y += this.vector_to_target.y / modul_target;
    }; //Двигаться за играком
}

function Zombie() {
        this.active = 0;
        this.activated = function() {
            if (this.active == 1) { //Фаза появления
                this.time += 1;
            }
            if (this.time > this.spawn_time) {
                this.time = 0;
                this.active = 2;
            }
            if (this.active == 2) { //Фаза ходьбы
                this.movie.textures = this.walk;
                this.movie.play();
                this.Move();
            }
            if (this.active == 3) { //Фаза атаки
                this.movie.textures = this.attack;
                this.movie.play();
            }
        };
    }
    //Наследование
var mob = new Mob();
Zombie.prototype = mob;
var zombie = new Zombie();
////////////////////////Текстуры////////////////////////////////////}
function Player() {
    this.id = 0;
    this.walk = [];
    this.movie = null;
    this.animationSpeed = 0.1;
    this.active = 0;
    this.time = 1;
    this.speed = 3;
    this.modul_target = 1; //Расстояние
    this.position = {
        x: 400,
        y: 400
    };
    this.anchor = {
        x: 0.5,
        y: 0.5
    };
    this.set_param = function() {
        this.movie.anchor = this.anchor;
        this.movie.animationSpeed = this.animationSpeed;
        this.movie.position = this.position;
    };
    this.target = {
        x: 0,
        y: 0
    }; //Цель
    this.vector_to_target = {
        x: 0,
        y: 0
    };
    this.Findtarget = function() {
        this.vector_to_target.x = this.target.x - this.movie.position.x;
        this.vector_to_target.y = this.target.y - this.movie.position.y;
        this.movie.rotation = Math.atan2(this.vector_to_target.y, this.vector_to_target.x);
    }; //Найти игрока
    this.Move = function() {
        this.modul_target = Math.sqrt(this.vector_to_target.x * this.vector_to_target.x + this.vector_to_target.y * this.vector_to_target.y);
        this.movie.position.x += this.speed * this.vector_to_target.x / this.modul_target;
        this.movie.position.y += this.speed * this.vector_to_target.y / this.modul_target;
    }; //Двигаться к точке
    this.activated = function() {
        if (this.active == 1) {
            this.Findtarget();
            this.movie.play();
            this.Move();
            //  socket.emit('position', this.movie.position);
            //  socket.emit('rotation', this.movie.rotation);

            if (this.modul_target < 5) {
                this.active = 0;
                this.movie.gotoAndStop(0);
            }
        }
    }
    this.activatedAvatar = function() {
        if (this.active == 1) {
            this.Findtarget();
            this.movie.play();
            this.Move();
            if (this.modul_target < 20) {
                this.active = 0;
                target = null;
                this.movie.gotoAndStop(0);
            }
        }
    }
}
var player = new Player();
//var players.push();
socket.on('message', function(msg) {
    console.log(msg);
    switch (msg.event) {
        case 'newPlayer':
            user = new Player();
            user.id = msg.id;
            user.movie = new PIXI.MovieClip(player.walk);
            user.set_param();
            user.movie.position.x = Math.floor((Math.random() * 800) + 1);
            user.movie.position.y = Math.floor((Math.random() * 800) + 1);
            stage.addChild(user.movie);
            players.push(user);
            break;
        case 'target':
            target = msg;
            break;
        case 'move':
            position = msg;
            break;
        case 'rotation':
            rotation = msg;
            break;
        case 'users':
            for (var i = 0; i < msg.players.length; i++) {
                if (msg.id != msg.players[i].id) {
                    user = new Player();
                    user.id = msg.players[i].id;
                    user.movie = new PIXI.MovieClip(player.walk);
                    user.set_param();
                    user.movie.position.x = Math.floor((Math.random() * 800) + 1);
                    user.movie.position.y = Math.floor((Math.random() * 800) + 1);
                    stage.addChild(user.movie);
                    players.push(user);
                }
            };
            break;
        case 'disconnect':
            console.log(players);
            for (var i = 0; i < players.length; i++) {
                if (players[i].id == msg.id) {
                    stage.removeChild(players[i].movie);
                    players.splice(i, 1);
                }
            };
            console.log(players);
            break;
        default:
            console.log();
            break;
    }
});

function onAssetsLoaded() {
    //Загрузка зомби
    for (var i = 0; i < 25; i++) {
        zombie.spawn.push(PIXI.Texture.fromFrame("zombie" + i + ".png"));
        zombie.attack.push(PIXI.Texture.fromFrame("zombie_attack" + i + ".png"));
        if (i < 22) zombie.walk.push(PIXI.Texture.fromFrame("zombie_walk" + i + ".png"));
    };
    //Создание анимации
    zombie.movie = new PIXI.MovieClip(zombie.spawn);
    zombie.set_param();
    // zombie.movie.play();
    //console.log(zombie);
    //Загрузка игрока
    for (var i = 0; i < 7; i++) {
        player.walk.push(PIXI.Texture.fromFrame("player" + i + ".png"));
    };
    //frames.push(PIXI.Texture.fromFrame("player6.png"));
    player.movie = new PIXI.MovieClip(player.walk);
    player.set_param();
    //player.movie.play();
    stage.addChild(player.movie);
    stage.addChild(zombie.movie);
    // start animating
    requestAnimFrame(animate);
}

function animate() {
    requestAnimFrame(animate);
    // zombie.activated();
    // //Взять игрока на прицел
    // zombie.target = movie.position;
    // zombie.FindPlayer();
    /*  if (position) {
          for (var i = 0; i < players.length; i++) {
              if (players[i].id == position.id) {
                  players[i].movie.position = position.position;
              }
          };
          position = null;
      }*/
    if (rotation) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == rotation.id) {
                players[i].movie.rotation = rotation.rotation;
            }
        };
        rotation = null;
    }

    if (target) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == target.id) { //находим аватар игрока
                players[i].target = target.target;
                players[i].active = 1;
                players[i].activatedAvatar();

            }
        };
        //rotation = null;
    }

    player.activated();
    // render the stage
    renderer.render(stage);
}