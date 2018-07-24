"use strict";






var texSize = 64;
var image1 = new Uint8Array(4 * texSize * texSize);

var margin = 1;
for (var i = 0; i < texSize; i++) {
    var c;
    for (var j = 0; j < texSize; j++) {
        var patchx = i < margin || i > texSize - margin;
        var patchy = j < margin || j > texSize - margin;

        if (patchx || patchy) c = 255;
        else c = 0;
        //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
        image1[4 * i * texSize + 4 * j] = c;
        image1[4 * i * texSize + 4 * j + 1] = c;
        image1[4 * i * texSize + 4 * j + 2] = c;
        image1[4 * i * texSize + 4 * j + 3] = 255;
    }
}


var initGridBuffer = function(gl){

};


var drawGrid = function (gl) {


    // var VSHADER_SOURCE = FileManager.getInstance().get(SHADER_FILEPATH_PREFIX + "grid-vertex-shader.glsl");
    // var FSHADER_SOURCE = FileManager.getInstance().get(SHADER_FILEPATH_PREFIX + "grid-fragment-shader.glsl");
    //
    // // Initialize shaders
    // if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    //     console.log('Failed to intialize shaders.');
    //     return;
    // }


    var xx = GRID_WIDTH/2;
    var yy = GRID_WIDTH/2;

    var x = GRID_WIDTH;
    var y = GRID_WIDTH;

    var verticesTexCoords = new Float32Array([
        -xx, yy,   0.0, 1.0, 0.0, y,
        -xx, -yy,   0.0, 1.0, 0.0, 0.0,
        xx, -yy,  0.0, 1.0, x, 0.0,
        xx, yy,   0.0, 1.0, x, y
    ]);

    var n = 4; // The number of vertices


    // Create the buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //Get the storage location of a_Position, assign and enable buffer
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return -1;
    }
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE * 6, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 6, FSIZE * 4);

    gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object
    gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    var texture = gl.createTexture();   // Create a texture object


    //it is called in loadTextures
    // gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles


    gl.bindTexture( gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );

    // The best:
    // http://what-when-how.com/opengl-programming-guide/filtering-texture-mapping-opengl-programming/
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);

    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);
    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR);
    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_NEAREST);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR);

    gl.uniform1i(u_Sampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n); // Draw the rectangle

};
