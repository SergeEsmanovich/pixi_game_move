    // create an array of assets to load
    var assetsToLoader = ["2gta3.json"];

    // create a new loader
    loader = new PIXI.AssetLoader(assetsToLoader);

    // use callback
    loader.onComplete = onAssetsLoaded

    //begin load
    loader.load();


    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);
    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(800, 800);
    // add the renderer view element to the DOM

    requestAnimFrame(animate);
    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("player.png");
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);
    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
    // move the sprite to the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 500;
    //  stage.addChild(bunny);
    // event.type должен быть keypress
    var move = {

        napravlenie: 0,
        shag: 1,
        time: 0.1,
        active: 0
    };
    $(document).ready(function() {
        $('.game').append(renderer.view);
        //Клавиша нажата
        $(document).keydown(function(event) {

            //Вверх
            if (event.which == 38) {
                move.napravlenie = 1; //вверх
                //Замедлление начала движения
                move.shag = ((move.shag * move.time) < 4) ? move.shag * move.time : 3;
                move.active = 1;
                move.time += move.time;
            }
            //Вниз  
            if (event.which == 40) {
                move.napravlenie = 2; //вниз
                move.shag = ((move.shag * move.time) < 4) ? move.shag * move.time : 3;
                move.active = 1;
                move.time += move.time;
            }
            //Влево
            if (event.which == 37) {
                move.napravlenie = 4; //влево
                move.shag = ((move.shag * move.time) < 4) ? move.shag * move.time : 3;
                move.active = 1;
                move.time += move.time;
            }
            //Вправо
            if (event.which == 39) {
                move.napravlenie = 3; //вправо
                move.shag = ((move.shag * move.time) < 4) ? move.shag * move.time : 3;
                move.active = 1;
                move.time += move.time;
            }

        });
        //Клавиша поднята
        $(document).keyup(function(event) {
            move.active = 2;
            move.time = 0.1;
            move.shag = 1;

        })

    });

    function onAssetsLoaded() {
        // create a texture from an image path
        // add a bunch of aliens
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



        if (move.active == 1) { //Начало движения
            movie.play();

            if (move.napravlenie == 1) { //вверх
                movie.rotation = 3 * Math.PI / 2;
                movie.position.y -= move.shag;
                if (movie.animationSpeed < 0.05)
                    movie.animationSpeed += 0.001;
                // console.log(move.shag);

            }
            if (move.napravlenie == 2) { //вниз
                movie.rotation = Math.PI / 2;
                movie.position.y += move.shag;
                if (movie.animationSpeed < 0.05)
                    movie.animationSpeed += 0.001;

            }
            if (move.napravlenie == 3) { //вправо
                movie.rotation = 2 * Math.PI;
                movie.position.x += move.shag;
                if (movie.animationSpeed < 0.05)
                    movie.animationSpeed += 0.001;

            }
            if (move.napravlenie == 4) { //влево
                movie.rotation = Math.PI;
                movie.position.x -= move.shag;
                if (movie.animationSpeed < 0.05)
                    movie.animationSpeed += 0.001;
            }
        }
        if (move.active == 2) {
            movie.animationSpeed = 0.01;
            movie.gotoAndStop(0);
        }



        // render the stage
        renderer.render(stage);


    }