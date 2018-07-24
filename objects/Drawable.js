"use strict";


var modelMatrix = new Matrix4();
var SMatrix = new Matrix4();
var mvpMatrix = new Matrix4();
var normalMatrix = new Matrix4(); // Transformation matrix for normals


var ModelVariables = function(x,y,z, alpha, beta, gamma){
    this.x = x;
    this.y = y;
    this.z = z;
    this.alpha = alpha;
    this.beta = beta;
    this.gamma = gamma;

};

ModelVariables.prototype.plus = function (other, elapsed) {
    // var k = 50;
    // this.x += (other.x*elapsed)/k;
    // this.y += (other.y*elapsed)/k;
    // this.z += (other.z*elapsed)/k;
    // this.alpha += (other.alpha*elapsed)/k;
    // this.beta += (other.beta*elapsed)/k;
    // this.gamma += (other.gamma*elapsed)/k;

    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    this.alpha += other.alpha;
    this.beta += other.beta;
    this.gamma += other.gamma;
};

ModelVariables.prototype.clone = function () {
    var other = new ModelVariables(
      this.x,
      this.y,
      this.z,
      this.alpha,
      this.beta,
      this.gamma
    );

    return other;
};

ModelVariables.prototype.getPos = function () {
    return [this.x, this.y, this.z];
};
ModelVariables.prototype.getVector4Pos = function () {
    return new Vector4([this.x, this.y, this.z, 1.0]);
};

/**
 @constructor
 @abstract
 */
var Drawable = function(obj_name, texture_name, model_variables, delta_model_variables) {
    this.obj_name = obj_name;
    this.texture_obj = ALL_TEXTURES[texture_name];
    this.model_variables = model_variables;
    this.delta_model_variables = delta_model_variables;

    this.animation_enabled = false;

};


Drawable.prototype.animate = function(elapsed){
    if (this.animation_enabled) {
        // this.model_variables.plus(this.delta_model_variables, 1);
        this.model_variables.plus(this.delta_model_variables, elapsed);
    }

    this.computeModelMatrix();
};




Drawable.prototype.computeModelMatrix = function() {


    // // Calculate the model, view and projection matrices
    modelMatrix.setIdentity();
    modelMatrix.translate(this.model_variables.x, this.model_variables.y, this.model_variables.z);
    modelMatrix.rotate(this.model_variables.alpha, 1, 0, 0);
    modelMatrix.rotate(this.model_variables.beta, 0, 1, 0);
    modelMatrix.rotate(this.model_variables.gamma, 0, 0, 1);

    return modelMatrix;
};




Drawable.prototype.draw = function (draw_manager) {
    /*
    @param draw_manager: DrawManager instance
    */

    draw_manager.gl.uniform1i(draw_manager.u_Sampler, this.texture_obj.id);

    // mvpMatrix.set(draw_manager.projViewMatrix).multiply(modelMatrix);

    // Calculate the matrix to transform the normal based on the model matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    // Pass the model matrix to u_ModelMatrix
    draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_mvpMatrix
    // draw_manager.gl.uniformMatrix4fv(draw_manager.u_MvpMatrix, false, mvpMatrix.elements);

    // Pass the transformation matrix for normals to u_NormalMatrix
    draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);


    // SMatrix.setScale(2,1,2);
    // draw_manager.gl.uniformMatrix4fv(draw_manager.u_SMatrix, false, SMatrix.elements);


    // draw_manager.gl.drawArrays(draw_manager.gl.TRIANGLE_FAN, 0, n);
    var st = draw_manager.objects[this.obj_name].iStart;
    var en = draw_manager.objects[this.obj_name].iLen;

    // draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_BYTE, st);
    // draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_SHORT, st*2);
    draw_manager.gl.drawElements(draw_manager.gl.TRIANGLES, en, draw_manager.gl.UNSIGNED_INT, st*4);

};




