
/**
 @constructor
 */

// Avoiding Math.sin and Math.cos
var angle2deltas = {
      0: {dx:  0.0, dz:  1.0},
     90: {dx: 1.0, dz:  0.0},
    180: {dx:  0.0, dz: -1.0},
    270: {dx:  -1.0, dz:  0.0}
};
var min_speed = 1.5;
var max_speed = 5.0;
var wall_factor = 1.005;
var g_matrixStack = [];
var delta_head_angle = 10;
var look_perspective = 10;

var LightCycle = function(obj_name, texture_name, model_variables, delta_model_variables, lw_manager, speed, camera, cycle_id, cycle_name) {
    Drawable.apply(this, arguments);

    this.lw_manager = lw_manager;
    this.speed = speed;
    this.camera = camera;
    this.cycle_id = cycle_id;
    this.cycle_name = cycle_name;

    this.limit_head  = new Vector4([  0.0,  0.0, -0.5,  1.0]);
    this.limit_left  = new Vector4([  0.25,  0.0,  1.25,  1.0]); //z=-1.5
    this.limit_right = new Vector4([ -0.25,  0.0,  1.25,  1.0]);
    this.limit_back  = new Vector4([  0.0,  0.0,  0.0,  1.0]);
    this.half_height = 1.5;

    this.tex_name = texture_name;

    var new_dz = angle2deltas[this.model_variables.beta].dz;
    var new_dx = angle2deltas[this.model_variables.beta].dx;

    this.delta_model_variables.z = new_dz*this.speed;
    this.delta_model_variables.x = new_dx*this.speed;

    this.wheel_angle=0.0;
    this.head_angle=0.0;
    this.target_head_angle=0.0;


    var wallModelVariables = this.model_variables.clone();
    wallModelVariables.x += this.half_height*-Math.sign(new_dx);
    wallModelVariables.z += this.half_height*-Math.sign(new_dz);


    this.currentWall = new LightWall(
        "wall",
        texture_name,
        wallModelVariables,
        this.delta_model_variables,
        {x:wallModelVariables.x, y:wallModelVariables.z},
        null
    );

    this.near_a_wall = false;
    this.collision_is_near = false;

    // this.nameLabel = createLabel(this.cycle_name);

};

LightCycle.prototype = Object.create(Drawable.prototype);
LightCycle.prototype.constructor = LightCycle;


LightCycle.prototype.turn = function(isLeft){
    if (!this.animation_enabled){
        return;
    }
    this._pushCurrentWall();

    var mv = this.model_variables;
    var switcher = isLeft?1:-1;


    mv.beta += switcher*90.0;
    if (mv.beta<0) mv.beta = 360 + mv.beta;
    mv.beta = mv.beta%360;

    //Go back the model of half height -> turn is not "in place" (no rotation on the center) but on the "vertex" of the turn (i.e. the back)
    mv.x += this.half_height*-Math.sign(this.delta_model_variables.x);
    mv.z += this.half_height*-Math.sign(this.delta_model_variables.z);

    var new_dz = angle2deltas[this.model_variables.beta].dz;
    var new_dx = angle2deltas[this.model_variables.beta].dx;

    this.delta_model_variables.x = new_dx*this.speed;
    this.delta_model_variables.z = new_dz*this.speed;


    if (this.camera){
        this.camera.camera_mode = "CHASE";
        this.camera.relativeCameraOffset[0]+= new_dx;
        this.camera.relativeCameraOffset[3]+= new_dz;
    }

    this.model_variables.x += this.half_height*Math.sign(new_dx);
    this.model_variables.z += this.half_height*Math.sign(new_dz);

    var wallModelVariables = this.model_variables.clone();
    wallModelVariables.x += this.half_height*-Math.sign(new_dx);
    wallModelVariables.z += this.half_height*-Math.sign(new_dz);

    this.currentWall = new LightWall(
        "wall",
        this.tex_name,
        wallModelVariables,
        this.delta_model_variables,
        {x:wallModelVariables.x, y:wallModelVariables.z}
    );



};

LightCycle.prototype._pushCurrentWall = function (isLast) {
    var m=this.currentWall.model_variables;
    var s=this.currentWall.start;

    var mx = isLast? m.x - this.delta_model_variables.x: m.x;
    var mz = isLast? m.z - this.delta_model_variables.z: m.z;
    this.lw_manager.pushWall(
        [mx, WALL_HEIGHT, mz],
        [s.x, WALL_HEIGHT, s.y],
        [s.x, 0.0, s.y],
        [mx, 0.0, mz],
        this.texture_obj.color,
        this.cycle_name
    );
};

LightCycle.prototype.draw = function(draw_manager){
    // Drawable.prototype.draw.call(this, draw_manager);

    draw_manager.gl.uniform1i(draw_manager.u_Sampler, this.texture_obj.id);


    modelMatrix.translate(0.0, 0.5, 0.0);

    //Body
    pushMatrix(modelMatrix);
        modelMatrix.scale(0.75, 1.0, 1.5);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);
        var st = draw_manager.objects["cube"].iStart;
        var en = draw_manager.objects["cube"].iLen;
        draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_INT, st*4);
    modelMatrix = popMatrix();

    // "Wall generator"
    pushMatrix(modelMatrix);
        modelMatrix.translate(0.0, 0.0, -0.75);
        modelMatrix.scale(0.125, 2.5, 0.5);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);
        var st = draw_manager.objects["cube"].iStart;
        var en = draw_manager.objects["cube"].iLen;
        draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_INT, st*4);
    modelMatrix = popMatrix();

    this.wheel_angle+=2;
    //Left wheel
    pushMatrix(modelMatrix);
        modelMatrix.translate(0.5,0.0,-0.25);
        modelMatrix.scale(0.5, 1.0, 1.0);
        modelMatrix.rotate(180, 0, 1, 0);
        modelMatrix.rotate(-this.wheel_angle, 1, 0, 0);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);
        var st = draw_manager.objects["wheel"].iStart;
        var en = draw_manager.objects["wheel"].iLen;
        draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_INT, st*4);
    modelMatrix = popMatrix();

    //Right wheel
    pushMatrix(modelMatrix);
        modelMatrix.translate(-0.5,0.0,-0.25);
        modelMatrix.scale(0.5, 1.0, 1.0);
        modelMatrix.rotate(this.wheel_angle, 1, 0, 0);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);
        var st = draw_manager.objects["wheel"].iStart;
        var en = draw_manager.objects["wheel"].iLen;
        draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_INT, st*4);
    modelMatrix = popMatrix();


    // head
    pushMatrix(modelMatrix);
        modelMatrix.translate(0.0, 0.6, +0.5);
        // modelMatrix.rotate(this.head_angle, 0, 1, 0);
        var offset_head_angle = this.target_head_angle - this.head_angle;
        this.head_angle += Math.abs(offset_head_angle)>delta_head_angle?Math.sign(offset_head_angle)*delta_head_angle:offset_head_angle;

        modelMatrix.rotate(this.head_angle, 0, 1, 0);
        modelMatrix.scale(0.5, 0.5, 0.5);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);
        draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);
        var st = draw_manager.objects["cube"].iStart;
        var en = draw_manager.objects["cube"].iLen;
        draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_INT, st*4);

        //Monocular
        pushMatrix(modelMatrix);
            modelMatrix.translate(0.0, 0.25, 0.5);
            modelMatrix.scale(0.25, 0.25, 1.0);
            normalMatrix.setInverseOf(modelMatrix);
            normalMatrix.transpose();
            draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);
            draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);
            var st = draw_manager.objects["cube"].iStart;
            var en = draw_manager.objects["cube"].iLen;
            draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_INT, st*4);

        modelMatrix = popMatrix();
    modelMatrix = popMatrix();



    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx.fillStyle = 'white';
    // ctx.font = '12px serif';
    // ctx.fillText('Hello world', this.model_variables.x, this.model_variables.z);
    if(this.animation_enabled){
        this.currentWall.animation_enabled=true;
        this.currentWall.animate(1);
        this.currentWall._draw(draw_manager);
    }

    // this.updateLabel();


};
LightCycle.prototype.updateLabel = function () {
    var point = new Vector4([this.model_variables.x, this.model_variables.y + 2, this.model_variables.z, 1]);  // this is the front top right corner

    // compute a clipspace position
    // using the matrix we computed for the F
    // var clipspace = modelMatrix.multiplyVector4(point);
    var clipspace = viewMatrix.multiplyVector4(point);
    clipspace = projMatrix.multiplyVector4(clipspace);

    // divide X and Y by W just like the GPU does.
    clipspace.elements[0] /= clipspace.elements[3];
    clipspace.elements[1] /= clipspace.elements[3];

    // convert from clipspace to pixels
    var pixelX = (clipspace.elements[0] *  0.5 + 0.5) * canvas.width;
    var pixelY = (clipspace.elements[1] * -0.5 + 0.5) * canvas.height;

    // position the div
    this.nameLabel.style.left = Math.floor(pixelX) + "px";
    this.nameLabel.style.top  = Math.floor(pixelY) + "px";

};

LightCycle.prototype.animate = function (elapsed) {
    this.delta_model_variables.x = this.delta_model_variables.x==0.0?0.0:this.speed*Math.sign(this.delta_model_variables.x);
    this.delta_model_variables.z = this.delta_model_variables.z==0.0?0.0:this.speed*Math.sign(this.delta_model_variables.z);
    Drawable.prototype.animate.call(this, elapsed);

};


LightCycle.prototype.checkWall = function () {
    this.near_a_wall = false;
    this.collision_is_near = false;

    modelMatrix = this.computeModelMatrix();
    var model_head = modelMatrix.multiplyVector4(this.limit_head);

    // var model_back = this.currentWall.model_variables.getVector4Pos();
    var model_back = this.currentWall.getVector4Start();
    model_back.elements[0]+=this.delta_model_variables.x*0.5;
    model_back.elements[2]+=this.delta_model_variables.z*0.5;

    var model_left = modelMatrix.multiplyVector4(this.limit_left);
    var model_right = modelMatrix.multiplyVector4(this.limit_right);

    var temp_left  = new Vector4(this.limit_left.elements);
    var temp_right = new Vector4(this.limit_right.elements);
    temp_left.elements[0]*=25;
    temp_right.elements[0]*=25;
    var wall_limit_left = modelMatrix.multiplyVector4(temp_left);
    var wall_limit_right = modelMatrix.multiplyVector4(temp_right);

    //rectify zeros
    if (Math.abs(model_head.elements[0])<0.001) model_head.elements[0]=0;
    if (Math.abs(model_head.elements[2])<0.001) model_head.elements[2]=0;

    // check "lookahead wall" for AI choice
    var forward_head = new Vector4(model_head.elements);
    var forward_left = new Vector4(model_left.elements);
    var forward_right = new Vector4(model_right.elements);

    //one of them must be zero, so when translating ahead only one axis is involved.
    var dx_sign = Math.sign(this.delta_model_variables.x);
    var dz_sign = Math.sign(this.delta_model_variables.z);
    forward_head.elements[0] += dx_sign * look_perspective;
    forward_head.elements[2] += dz_sign * look_perspective;
    forward_left.elements[0] += dx_sign * look_perspective;
    forward_left.elements[2] += dz_sign * look_perspective;
    forward_right.elements[0] += dx_sign * look_perspective;
    forward_right.elements[2] += dz_sign * look_perspective;

    var active_wall;
    var start_vertex, end_vertex;

    if (this.lw_manager.checkWalls(model_back, model_head))
        return true;
    if (this.lw_manager.checkWalls(model_left, model_right))
        return true;
    //for AI
    if (this.lw_manager.checkWalls(model_head, forward_head) || this.lw_manager.checkWalls(forward_left, forward_right))
        this.collision_is_near = true;

    if (!this.near_a_wall){
        if(this.lw_manager.checkWalls(wall_limit_left, wall_limit_right)){
            this.near_a_wall = true;
            this.speed *= wall_factor;
            this.speed = this.speed>max_speed?max_speed:this.speed;
        }
    }

    //Check grid walls
    for (var gw in GRID_WALLS){
        var curGridWall = GRID_WALLS[gw];
        if(this.lw_manager._checkSingleWall(model_back, model_head, curGridWall[0], curGridWall[1]))
            return true;
        if(this.lw_manager._checkSingleWall(model_left, model_right, curGridWall[0], curGridWall[1]))
            return true;
        //for AI
        if (!this.collision_is_near && this.lw_manager._checkSingleWall(model_head, forward_head,curGridWall[0], curGridWall[1]))
            this.collision_is_near = true;
    }

    // Check all the "current walls" of the other cycles
    for (var cycle_id in all_cycles){

        active_wall = all_cycles[cycle_id].currentWall;
        //We have to pass to checkSingleWall vectors of three elements.
        //Hence, from active_wall.start (which is a dictionary {x:value, y:value}) we need a vector
        start_vertex = [active_wall.start.x, 0.0, active_wall.start.y];
        //For the end of the wall, we pick the coordinates from the model variables of the wall.
        end_vertex = [active_wall.model_variables.x, 0.0, active_wall.model_variables.z];

        if (cycle_id != this.cycle_name) {
            if (this.lw_manager._checkSingleWall(model_back, model_head, end_vertex, start_vertex)) return true;
            if (this.lw_manager._checkSingleWall(model_left, model_right, end_vertex, start_vertex)) return true;
            //for AI
            if (!this.collision_is_near &&
                (this.lw_manager._checkSingleWall(model_head, forward_head, end_vertex, start_vertex) || this.lw_manager._checkSingleWall(forward_left, forward_right, end_vertex, start_vertex))
            ) this.collision_is_near = true;
        }

        //the same of above for check acceleration condition
        if (!this.near_a_wall){
            if(this.lw_manager._checkSingleWall(wall_limit_left, wall_limit_right, end_vertex, start_vertex)){
                this.near_a_wall = true;
                this.speed *= wall_factor;
                this.speed = this.speed>max_speed?max_speed:this.speed;
            }
        }

    }


    if (!this.near_a_wall)
        this.speed = this.speed<=min_speed?min_speed:this.speed/wall_factor;


    return false;



};

LightCycle.prototype.makeAIChoice = function () {
    if (this.collision_is_near)
        this.turn(true);

};