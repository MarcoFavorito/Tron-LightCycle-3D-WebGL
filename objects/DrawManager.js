var DrawManager = function(gl){

    this.gl = gl;

    this.vertices = [];
    this.colors = [];
    this.normals = [];
    this.indices = [];
    this.texcoords = [];

    this.objects = [];

    // this.viewMatrix = new Matrix4();
    // this.projMatrix = new Matrix4();
    this.projViewMatrix = new Matrix4();

    // viewMatrix.setLookAt(0, 50, 0, 0, 0, 0, 0, 0, 1);
    // this.viewMatrix.setLookAt(0, 5, 10, 0, 0, -5, 0, 1, 0.1);
    // this.projMatrix.setPerspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);


    this.a_Position =   this.gl.getAttribLocation(this.gl.program, 'a_Position');
    this.a_Normal =     this.gl.getAttribLocation(this.gl.program, 'a_Normal');
    this.a_Color=       this.gl.getAttribLocation(this.gl.program, 'a_Color');
    this.a_TexCoord =   this.gl.getAttribLocation(this.gl.program, 'a_TexCoord');


    this.idx2tex = {
        0:this.gl.TEXTURE0,
        1:this.gl.TEXTURE1,
        2:this.gl.TEXTURE2,
        3:this.gl.TEXTURE3,
        4:this.gl.TEXTURE4,
        5:this.gl.TEXTURE5,
        6:this.gl.TEXTURE6,
        7:this.gl.TEXTURE7,
        7:this.gl.TEXTURE7,
    };


};


DrawManager.prototype.addObject = function(name, vertices, colors, normals, texcoords, indices){
    var vLen = this.vertices.length;
    var cLen = this.colors.length;
    var nLen = this.normals.length;
    var tLen = this.texcoords.length;
    var iLen = this.indices.length;

    this.vertices  = this.vertices   .concat(vertices);
    this.colors    = this.colors     .concat(colors);
    this.normals   = this.normals    .concat(normals);
    this.texcoords = this.texcoords  .concat(texcoords);

    var shifted_indices = [];
    var shift = vLen/3;
    for (var i=0; i<indices.length;i++){
        shifted_indices.push(indices[i] + shift);
    }

    this.indices = this.indices.concat(shifted_indices);


    var new_object = {};
    new_object.vStart = vLen;
    new_object.cStart = cLen;
    new_object.nStart = nLen;
    new_object.tStart = tLen;
    new_object.iStart = iLen;

    new_object.vLen = vertices.length;
    new_object.cLen = colors.length;
    new_object.nLen = normals.length;
    new_object.tLen = texcoords.length;
    new_object.iLen = indices.length;

    // new_object.model_variables = new ModelVariables(0,0,0,0,0,0);
    // new_object.delta_model_variables = new ModelVariables(0,0,0,0,0,0);


    this.objects[name]=new_object;
};

DrawManager.prototype.bindBuffers = function(){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Position);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.vertexAttribPointer(this.a_Normal, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Normal);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.vertexAttribPointer(this.a_Color, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Color);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.vertexAttribPointer(this.a_TexCoord, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_TexCoord);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

};


DrawManager.prototype._initBuffers = function () {

    this.vertices  = new Float32Array(this.vertices );
    this.colors    = new Float32Array(this.colors   );
    this.normals   = new Float32Array(this.normals  );
    this.texcoords = new Float32Array(this.texcoords);
    // this.indices = new Uint8Array(this.indices);
    // this.indices = new Uint16Array(this.indices);
    this.indices = new Uint32Array(this.indices);


    this.vertexBuffer = initArrayBuffer(this.gl, 'a_Position', this.vertices, 3);
    this.colorBuffer = initArrayBuffer(this.gl, 'a_Color', this.colors, 4);
    this.normalBuffer = initArrayBuffer(this.gl, 'a_Normal', this.normals, 3);
    this.texcoordBuffer = initArrayBuffer(this.gl, 'a_TexCoord', this.texcoords, 2);

    // Unbind the buffer object
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    // Write the indices to the buffer object
    this.indexBuffer = this.gl.createBuffer();
    if (!this.indexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

    this.n = this.indices.length;

};


DrawManager.prototype._initTextures = function(){

    for (var tex_name in ALL_TEXTURES){
        this._initTextureFromTexName(tex_name);
    }

    this.textures = ALL_TEXTURES;

};

DrawManager.prototype._initTextureFromTexName = function(tex_name){
    //only bitmap
    var texture = this.gl.createTexture();   // Create a texture object
    var curTexObj = ALL_TEXTURES[tex_name];

    if (!curTexObj.isMipmap)
        return;

    var curTexSize = curTexObj.texSize;
    var curTex = curTexObj.tex;
    var curTexId = curTexObj.id;

    this.gl.activeTexture(this.idx2tex[curTexId]);
    this.gl.bindTexture( this.gl.TEXTURE_2D, texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, curTexSize, curTexSize, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, curTex);
    // this.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);


    this.gl.generateMipmap( this.gl.TEXTURE_2D );

    // The best:
    // http://what-when-how.com/opengl-programming-guide/filtering-texture-mapping-opengl-programming/
    this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR);
    //
    // this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_NEAREST);
    // this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST_MIPMAP_LINEAR);
    // this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST_MIPMAP_NEAREST);
    this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR);
};

DrawManager.prototype._getUniforms = function(){

    this.u_Sampler = this.gl.getUniformLocation(this.gl.program, 'u_Sampler');
    this.u_NormalMatrix = this.gl.getUniformLocation(this.gl.program, 'u_NormalMatrix');
    this.u_ModelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ModelMatrix');
    this.u_projViewMatrix = this.gl.getUniformLocation(this.gl.program, 'u_projViewMatrix');
    // this.u_MvpMatrix = this.gl.getUniformLocation(this.gl.program, 'u_MvpMatrix');
    // this.u_SMatrix = this.gl.getUniformLocation(this.gl.program, 'u_SMatrix');
    this.u_LightColor = this.gl.getUniformLocation(this.gl.program, 'u_LightColor');
    this.u_LightDirection = this.gl.getUniformLocation(this.gl.program, 'u_LightDirection');
    this.u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    // this.u_LightSpecular = gl.getUniformLocation(gl.program, 'u_LightSpecular');
    this.u_AmbientLight = this.gl.getUniformLocation(this.gl.program, 'u_AmbientLight');

    if (
        !this.u_ModelMatrix ||
        !this.u_NormalMatrix ||
        !this.u_projViewMatrix ||
        !this.u_LightPosition ||
        !this.u_LightColor ||
        !this.u_AmbientLight ||
        // !this.u_LightSpecular ||
        !this.u_LightDirection) {
        console.log('Failed to get the storage location');
        return;
    }

};


DrawManager.prototype._setUpDefaultUniforms = function () {
    // Set the light color (white)
    this.gl.uniform3f(this.u_LightColor, 1,1,1);
    // Set the light direction (in the world coordinate)
    this.gl.uniform3f(this.u_LightDirection, 1,1,1);
// Set the ambient light
    this.gl.uniform3f(this.u_AmbientLight, 1,1,1);
    this.gl.uniform3f(this.u_LightPosition, 0, 50, 0);
};


DrawManager.prototype.initialize = function(){
    this._initBuffers();
    this._initTextures();
    this._getUniforms();
    this._setUpDefaultUniforms();

};


DrawManager.prototype.setPOV = function(viewMatrix, projMatrix){
    // this.viewMatrix.set(viewMatrix);
    // this.projMatrix.set(projMatrix);

    this.projViewMatrix.set(projMatrix).multiply(viewMatrix);
    this.gl.uniformMatrix4fv(this.u_projViewMatrix, false, this.projViewMatrix.elements);
};


DrawManager.prototype.cleanUpBuffers = function () {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.deleteBuffer(this.vertexBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.deleteBuffer(this.colorBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.deleteBuffer(this.normalBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.deleteBuffer(this.texcoordBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.indexBuffer);
    this.gl.deleteBuffer(this.indexBuffer);
};