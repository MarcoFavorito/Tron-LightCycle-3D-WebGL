/**
 @constructor
 */
var LightWall = function(obj_name, texture_name, model_variables, delta_model_variables, startCoord) {
    Drawable.apply(this, [obj_name, texture_name, model_variables, delta_model_variables]);

    // this.end = {x:startCoord.x, y:startCoord.y};

    // var sh_x = this.delta_model_variables.x;
    // var sh_z = this.delta_model_variables.z;
    // this.x_shift = sh_x>0?-1.5:sh_x<0?1.5:0;
    // this.z_shift = sh_z>0?-1.5:sh_z<0?1.5:0;

    // this.start = {x:startCoord.x + this.x_shift, y:startCoord.y + this.z_shift};
    this.start = {x:startCoord.x, y:startCoord.y};


};

LightWall.prototype = Object.create(Drawable.prototype);
LightWall.prototype.constructor = LightWall;


LightWall.prototype.draw = function () {
    throw Error("Aha! You shouldn't do it!")
};

LightWall.prototype._draw = function(draw_manager){
    var sx = this.start.x;
    var sy = this.start.y;

    // var ex = this.model_variables.x + this.x_shift;
    // var ey = this.model_variables.z + this.z_shift;

    var ex = this.model_variables.x;
    var ey = this.model_variables.z;

    var d = distance(sx, sy, ex, ey);

    var dx = Math.sign(ex-sx);
    var dy = Math.sign(ey-sy);

    var r = dy!=0?90:0;

    modelMatrix.setIdentity();
    //remember: in inverse order!
    // modelMatrix.translate(1.5*-dx,0,1.5*-dy);
    modelMatrix.translate(sx + dx*d/2, 1.0, sy + dy*d/2);
    modelMatrix.rotate(r,0,1,0);
    modelMatrix.scale(d/2,1,1);



    Drawable.prototype.draw.call(this, draw_manager);

};

LightWall.prototype.getVector4Start = function () {
    return new Vector4([this.start.x, 0.0, this.start.y, 1.0]);
};
