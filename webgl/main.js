"use strict";

var gameoverLabel;
var winLabel;
var speed;
var pauseLabel;
var player_labels;

var speedNode;
var countdownNode;
var countdownIsFinished = false;
var isGamePaused = false;
var gameOverAnimationEnd = false;
var gameOverFlag = false;
var isEscaped = false;

var canvas;
var gl;
var drawables = [];
var dm;

var cycle;
var grid;
var grid_walls;
var all_cycles = [];
var enemies_cycles = [];
var deleted_cycles = [];
var explosions = [];
var no_deleted_cycles = 0;

var cycle_speed = 1.5;

var viewMatrix = new Matrix4(); // Model matrix
var projMatrix = new Matrix4(); // Model view projection matrix

// Last time that this function was called
var g_last = new Date().getTime();
var now = new Date().getTime();
var elapsed = now - g_last;

var lw_manager;


var camera_x = GRID_WIDTH/2;
var camera_y = GRID_WIDTH/2;
var camera_z = 10;

var final_camera_x;
var final_camera_y;
var final_camera_z;
var alpha = 1;
var delta_alpha = 0.01;

var req_anim_frame_num;

function init_main(){

    // var textCanvas = document.getElementById("text");
    // ctx = textCanvas.getContext("2d");

    // player_labels = document.getElementById('player-labels');

    gameoverLabel = document.getElementById("gameover");
    pauseLabel = document.getElementById("pause");
    winLabel = document.getElementById("win");

    var countdown = document.getElementById("countdown");
    countdownNode = document.createTextNode("");
    countdown.appendChild(countdownNode);

    speed = document.getElementById("speed");
    speedNode = document.createTextNode("");
    speed.appendChild(speedNode);

    canvas = document.getElementById("webgl");
    gl = getWebGLContext(canvas);
    if (!gl){console.log("Failed to get the rendering context for WebGL");return;}

    var LIGHTCYCLE_VSHADER_SOURCE = FileManager.getInstance().get(SHADER_FILEPATH_PREFIX + "lightcycle-vertex-shader.glsl");
    var LIGHTCYCLE_FSHADER_SOURCE = FileManager.getInstance().get(SHADER_FILEPATH_PREFIX + "lightcycle-fragment-shader.glsl");

    initShaders(gl, LIGHTCYCLE_VSHADER_SOURCE, LIGHTCYCLE_FSHADER_SOURCE);

    var ext = gl.getExtension('OES_element_index_uint');
    gl.clearColor(0,0,0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.enable(gl.CULL_FACE);

    init_draw_manager();

}

function init_draw_manager(){
    if (!dm)
        dm = new DrawManager(gl);
    if (!populate(dm)){
        setTimeout(init_draw_manager, 100);
        return
    }
    dm.initialize();
    dm.bindBuffers();
    main();
}


var isLoaded = false;
var requested = false;
var image;
function main(){
    if (!requested){
        image = new Image();  // Create the image object
        if (!image) {console.log('Failed to create the image object');}

        // Register the event handler to be called on loading an image
        var texture = gl.createTexture();   // Create a texture object

        image.onload = function(){ loadTexture(gl, texture, image); isLoaded=true};
        // Tell the browser to load an image
        image.src = 'images/simple256.png';

        requested = true;
    }

    if (!isLoaded){
        setTimeout(main, 100);
        return;
    }
    ALL_TEXTURES["grid_wall_tex"] = {id:1, isMipmap: false, texSize:0, tex:image};

    document.getElementById("speed").style.visibility = "visible";
    gameoverLabel.style.visibility = "hidden";
    winLabel.style.visibility = "hidden";

    // player_labels.innerHTML = "";
    drawables = [];
    all_cycles = [];
    enemies_cycles = [];
    deleted_cycles = [];
    explosions = [];
    alpha = 1; delta_alpha = 0.010;
    countdownIsFinished = false;
    gameOverFlag = false;
    isGamePaused = false;
    gameOverAnimationEnd = false;
    no_deleted_cycles = 0;

    lw_manager = new LightWallManager(gl);


    grid = new Drawable("grid", "tile_tex", new ModelVariables(0,0,0,0,0,0), new ModelVariables(0,0,0,0,0,0));
    grid_walls = new Drawable("grid_wall", "grid_wall_tex", new ModelVariables(0,0,0,0,0,0), new ModelVariables(0,0,0,0,0,0));
    //
    // grid = new Drawable("grid", "white_pix", new ModelVariables(0,0,0,0,0,0), new ModelVariables(0,0,0,0,0,0));
    // grid_walls = new Drawable("grid_wall", "white_pix", new ModelVariables(0,0,0,0,0,0), new ModelVariables(0,0,0,0,0,0));

    var shift_from_walls = 20;

    cycle = new LightCycle("cycle", "red_pix", new ModelVariables(0,0,GRID_WIDTH/2 - shift_from_walls,0,180,0), new ModelVariables(0,0,0,0,0,0), lw_manager, cycle_speed, null, all_cycles.length, "me");
    cycle.camera = new Camera(cycle);
    all_cycles[cycle.cycle_name] = cycle;

    var cycle2 = new LightCycle("cycle", "blue_pix", new ModelVariables(0,0,-GRID_WIDTH/2 +  shift_from_walls,0,0,0), new ModelVariables(0,0,0,0,0,0), lw_manager, cycle_speed, null, all_cycles.length, "Windows");
    all_cycles[cycle2.cycle_name] = cycle2;
    enemies_cycles[cycle2.cycle_name] = cycle2;

    if (NO_ENEMIES>Object.keys(enemies_cycles).length) {
        var cycle3 = new LightCycle("cycle", "green_pix", new ModelVariables(GRID_WIDTH / 2 - shift_from_walls, 0, 0, 0, 270, 0), new ModelVariables(0, 0, 0, 0, 0, 0), lw_manager, cycle_speed, null, all_cycles.length, "Linux");
        all_cycles[cycle3.cycle_name] = cycle3;
        enemies_cycles[cycle3.cycle_name] = cycle3;
    }

    if (NO_ENEMIES>Object.keys(enemies_cycles).length) {
        var cycle4 = new LightCycle("cycle", "yellow_pix", new ModelVariables(-GRID_WIDTH / 2 + shift_from_walls, 0, 0, 0, 90, 0), new ModelVariables(0, 0, 0, 0, 0, 0), lw_manager, cycle_speed, null, all_cycles.length, "macOS");
        all_cycles[cycle4.cycle_name] = cycle4;
        enemies_cycles[cycle4.cycle_name] = cycle4;
    }

    drawables.push(grid);
    drawables.push(grid_walls);
    drawables.push(cycle);
    for (var c in enemies_cycles)
        drawables.push(enemies_cycles[c])


    KeyboardManager({
        65:function () {if (!gameOverFlag && countdownIsFinished) cycle.turn(true)},
        68:function () {if (!gameOverFlag && countdownIsFinished) cycle.turn(false)},
        37:function () {if (!gameOverFlag && countdownIsFinished) cycle.camera.camera_mode = "LEFT"},
        38:function () {if (!gameOverFlag && countdownIsFinished) cycle.camera.camera_mode = "CHASE"},
        39:function () {if (!gameOverFlag && countdownIsFinished) cycle.camera.camera_mode = "RIGHT"},
        40:function () {if (!gameOverFlag && countdownIsFinished) cycle.camera.camera_mode = "BACK"},
        80:function () {
            if (!gameOverFlag && countdownIsFinished){
                isGamePaused = !isGamePaused;
                pauseLabel.style.visibility=isGamePaused?"visible":"hidden";
                speed.style.visibility = isGamePaused?"hidden":"visible";
            }
        },
        27:function() {isEscaped = true}
    });

    final_camera_x = cycle.model_variables.x;
    final_camera_y = 5;
    final_camera_z = cycle.model_variables.z + 10;
    camera_x = GRID_WIDTH/2;
    camera_y = GRID_WIDTH/2;
    camera_z = 10;

    var updateCountdown = function(text){
        countdownNode.nodeValue = text;
        if (text=="") {return;}
        if (text=="GO!"){countdownIsFinished = true;}
        var next = text=="3"?"2":text=="2"?"1":text=="1"?"GO!":text=="GO!"?"":text;
        setTimeout(updateCountdown, 1000, next);
    };
    requestAnimationFrame(startAnimation);
    updateCountdown("3");


}

function startAnimation(){

    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix.setLookAt(
        camera_x*alpha + (1-alpha)*final_camera_x,
        camera_y*alpha + (1-alpha)*final_camera_y,
        camera_z*alpha + (1-alpha)*final_camera_z,
        cycle.model_variables.x, cycle.model_variables.y+3, cycle.model_variables.z, 0, 1, 0);

    // viewMatrix.setLookAt(0,200,0,0,0,0,0,0,1);
    projMatrix.setPerspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 3000);
    dm.setPOV(viewMatrix, projMatrix);

    dm.bindBuffers();
    for(var d in drawables){
        var drawable = drawables[d];
        drawable.animate(elapsed);
        drawable.draw(dm);
    }

    alpha-=delta_alpha;
    if (alpha<0.05 && delta_alpha > 0.001) delta_alpha-=0.003;
    if (delta_alpha<0) delta_alpha=0.001;
    if (alpha<0.0) alpha=0;

    if (!countdownIsFinished)
        requestAnimationFrame(startAnimation);
        // setTimeout(function() {
        //     window.requestAnimationFrame(startAnimation);
        // }, 1000 / 50);
    else {
        grid.animation_enabled = true;
        for (var c in all_cycles){
            all_cycles[c].animation_enabled=true;
            all_cycles[c].currentWall.animation_enabled=true;
        }
        requestAnimationFrame(drawScene)
    }


}

function drawScene(){

    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (countdownIsFinished && !isGamePaused && !gameOverAnimationEnd) {
        cycle.camera.animate();

        viewMatrix = cycle.camera.getLookAt();
        // viewMatrix.setLookAt(0,200,0,0,0,0,0,0,1);
        // viewMatrix.setLookAt(100,100,-100,0,0,0,0,1,0);
        // viewMatrix.setLookAt(5,5,5,0,0,0,0,1,0);
        projMatrix.setPerspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 3000);
        dm.setPOV(viewMatrix, projMatrix);
 
        now = new Date().getTime();
        elapsed = now - g_last;
        g_last = now;


        dm.bindBuffers();

        grid.animate(elapsed);
        grid.draw(dm);
        grid_walls.animate(elapsed);
        grid_walls.draw(dm);

        for (var c in all_cycles) {
            var cur_cycle = all_cycles[c];
            cur_cycle.animate(elapsed);
            cur_cycle.draw(dm);
            if (c in enemies_cycles) {

                if (cur_cycle && cur_cycle.checkWall()) {
                    deleteCycle(cur_cycle);
                    no_deleted_cycles+=1;
                }
                //after "checkWall", so, if it is the case, the flag is set
                cur_cycle.makeAIChoice();

            }
            else {
                if (!gameOverFlag && cur_cycle.checkWall()) {
                    deleteCycle(cur_cycle);
                    gameOverFlag = true;
                    cycle.camera.camera_mode = "CHASE";
                    gameoverLabel.style.visibility = "visible";
                    setTimeout(gameOverAnimation, 4000);


                }
            }


        }
        for (var dc in deleted_cycles) {
            setTimeout(
                function (cycle_name) {
                    lw_manager.removeVerticesByCycleName(cycle_name);
                    delete deleted_cycles[cycle_name];
                },
                1000,
                dc
            );
            delete deleted_cycles[dc];

        }

        for (var ex in explosions) {
            explosions[ex].animate();
            explosions[ex].draw(dm);
            if (explosions[ex].height > 9000) {
                explosions[ex].cleanUpBuffers();
                delete explosions[ex];
            }
        }

        lw_manager.draw(dm);

        speedNode.nodeValue = parseFloat(cycle.speed).toFixed(2);

    }

    // setTimeout(drawScene, 1);
    if (isEscaped){
        var sm = ScreenManager.getInstance();
        sm.setCurrentScreen("startmenu");
        return;
    }

    if (!gameOverFlag && no_deleted_cycles==NO_ENEMIES){
        winLabel.style.visibility = "visible";
        cleanUpKM();
        lw_manager.cleanUpBuffers();
        for (var ex in explosions){
            explosions[ex].cleanUpBuffers();
            delete explosions[ex];
        }
        cancelAnimationFrame(req_anim_frame_num);
        setTimeout(main,2000);
        return;
    }

    if (!gameOverAnimationEnd){
        req_anim_frame_num = requestAnimationFrame(drawScene)
    }

    // setTimeout(function() {
    //     window.requestAnimationFrame(drawScene);
    // }, 1);

}


function gameOverAnimation(){
    gameOverAnimationEnd = true;
    cleanUpKM();
    lw_manager.cleanUpBuffers();
    for (var ex in explosions){
        explosions[ex].cleanUpBuffers();
        delete explosions[ex];
    }

    setTimeout(main,500);
}

function deleteCycle(cur_cycle){
    cur_cycle.speed = 0;
    cur_cycle._pushCurrentWall(true);
    // player_labels.removeChild(cur_cycle.nameLabel);
    delete all_cycles[cur_cycle.cycle_name];
    deleted_cycles[cur_cycle.cycle_name] = cur_cycle;

    explosions[cur_cycle.cycle_name] = new Explosion(gl, [cur_cycle.model_variables.x - cur_cycle.delta_model_variables.x, cur_cycle.model_variables.y, cur_cycle.model_variables.z - cur_cycle.delta_model_variables.z], ALL_TEXTURES[cur_cycle.tex_name].color);
    explosions[cur_cycle.cycle_name].initData();
    dm.bindBuffers();


}