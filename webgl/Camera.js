var camera_height = 5;
var side_camera_height = 20;
var camera_side_offset = 50;
var easing = 0.08;

var CAMERA_MODES = {
    "CHASE":0,
    "LEFT":1,
    "RIGHT":2,
    "BACK":3
};

var Camera = function(cycle){
    this.cycle = cycle;
    // this.eye_variables = new Vector4(-40-(5*this.cycle.speed), camera_height, 15+(18*this.cycle.speed),0);
    this.eye_variables = this.cycle.model_variables.clone();
    this.eye_variables.y += camera_height;
    this.eye_variables.z +=10;

    //are the same! center points ever on the cycle
    this.center_variables = this.cycle.model_variables;

    //0.1 because the player needs to see the wall behind his cycle.
    this.relativeCameraOffset = new Vector4(    [0.1, camera_height, -10.0,1.0]);
    this.leftCameraOffset = new Vector4(        [-camera_side_offset, side_camera_height, 0.0,1.0]);
    this.rightCameraOffset = new Vector4(       [+camera_side_offset, side_camera_height, 0.0,1.0]);
    this.backCameraOffset = new Vector4(        [0.2, 15, 75,1.0]);


    this.currentOffset = this.relativeCameraOffset;

    this.camera_mode = "CHASE";

    this.x_offset = 0.0;
    this.y_offset = 0.0;
    this.z_offset = 0.0;

};


Camera.prototype.getLookAt = function () {
    switch (this.camera_mode){
        case "CHASE":
            this.currentOffset = this.relativeCameraOffset;
            this.cycle.target_head_angle = 0;
            break;
        case "LEFT":
            this.currentOffset = this.leftCameraOffset;
            this.cycle.target_head_angle= 90;
            break;
        case "RIGHT":
            this.currentOffset = this.rightCameraOffset;
            this.cycle.target_head_angle = -90;
            break;
        case "BACK":
            this.currentOffset = this.backCameraOffset;
            this.cycle.target_head_angle = 180;
            break
    }

    viewMatrix.setLookAt(this.eye_variables.x,this.eye_variables.y,this.eye_variables.z,
        this.center_variables.x + this.x_offset,
        this.center_variables.y + this.y_offset,
        this.center_variables.z + this.z_offset,
        0,1,0);
    return viewMatrix;
};

Camera.prototype.animate = function () {
    var cycleModelMatrix = this.cycle.computeModelMatrix();

    // var relativeCameraOffset = new Vector4(-40-(5*this.cycle.speed), camera_height, 15+(18*this.cycle.speed),0);

    var cameraOffset = cycleModelMatrix.multiplyVector4(this.currentOffset);
    if (Math.abs(cameraOffset.elements[0]) > Math.abs(GRID_WIDTH/2)){
        var temp_delta = Math.sign(cameraOffset.elements[0])*GRID_WIDTH/2 - cameraOffset.elements[0];
        cameraOffset.elements[0] += temp_delta;
        this.x_offset = temp_delta/2;
        this.y_offset  = -side_camera_height/3;
    }
    else if (Math.abs(cameraOffset.elements[2]) > Math.abs(GRID_WIDTH/2)) {
        var temp_delta = Math.sign(cameraOffset.elements[2])*GRID_WIDTH/2 - cameraOffset.elements[2];
        cameraOffset.elements[2] += temp_delta;
        this.z_offset = temp_delta/2;
        this.y_offset  = -side_camera_height/3;
    }
    else{
        this.x_offset = 0.0;
        this.y_offset = 0.0;
        this.z_offset = 0.0;
    }


    var dx =cameraOffset.elements[0] - this.eye_variables.x;
    dx = isNaN(dx)?0:dx;
    var dy =cameraOffset.elements[1] - this.eye_variables.y;
    dy = isNaN(dy)?0:dy;
    var dz =cameraOffset.elements[2] - this.eye_variables.z;
    dz = isNaN(dz)?0:dz;


    this.eye_variables.x += dx * easing;
    this.eye_variables.y += dy * easing;
    this.eye_variables.z += dz * easing;


};
