function gridmain(gl, vshader, fshader){

    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return;
    }
    gl.useProgram(program);
    gl.program = program;

    var xx = GRID_WIDTH/2;
    var yy = GRID_WIDTH/2;

    var x = GRID_WIDTH;
    var y = GRID_WIDTH;

    var n = 4; // The number of vertices

    // We put the height 'yy' on the z-axis, so the grid is drawn horizontally, as a "ground"
    // var verticesTexCoords = new Float32Array([
    //     -xx, 0.0,   yy,     0.0, y,
    //     -xx, 0.0,   -yy,    0.0, 0.0,
    //     xx, 0.0,  -yy,      x, 0.0,
    //     xx, 0.0,   yy,      x, y
    // ]);

    var vertices = new Float32Array([
        -xx, 0.0,   yy,     
        -xx, 0.0,   -yy,    
        xx, 0.0,  -yy,      
        xx, 0.0,   yy,      
    ]);
    

    // Colors
    var colors = new Float32Array([
        1,1,1,0,   1,1,1,0,   1,1,1,0,  1,1,1,0,     // v0-v1-v2-v3 front
        // 1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        // 1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        // 1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        // 1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        // 1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);

    // Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        // 1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        // 0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        // -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        // 0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        // 0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        // 4, 5, 6,   4, 6, 7,    // right
        // 8, 9,10,   8,10,11,    // up
        // 12,13,14,  12,14,15,    // left
        // 16,17,18,  16,18,19,    // down
        // 20,21,22,  20,22,23     // back
    ]);


    var texcoords = new Float32Array([
        0.0, y,
        0.0, 0.0,
        x, 0.0,
        x, y
    ]);

    // Write the vertex property to buffers (coordinates, colors and normals)
    var b1 = initArrayBuffer(gl, 'a_Position', vertices, 3);
    var b2 = initArrayBuffer(gl, 'a_Color', colors, 4);
    var b3 = initArrayBuffer(gl, 'a_Normal', normals, 3);
    var b4 = initArrayBuffer(gl, 'a_TexCoord', texcoords, 2);
    //
    //
    // this.buffers.push(b1);
    // this.buffers.push(b2);
    // this.buffers.push(b3);
    // this.buffers.push(b4);
    //
    //
    //
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    var n = indices.length;





    //
    // var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    // //Get the storage location of a_Position, assign and enable buffer
    // this.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // this.a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    //
    // if (this.a_TexCoord < 0) {
    //     console.log('Failed to get the storage location of a_TexCoord');
    //     return -1;
    // }
    // if (this.a_Position < 0) {
    //     console.log('Failed to get the storage location of a_Position');
    //     return -1;
    // }
    //
    //
    // // Create the buffer object
    // var vertexTexCoordBuffer = gl.createBuffer();
    // if (!vertexTexCoordBuffer) {
    //     console.log('Failed to create the buffer object');
    //     return -1;
    // }
    //
    // // Bind the buffer object to target
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    //
    //
    //
    // gl.vertexAttribPointer(this.a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
    // gl.vertexAttribPointer(this.a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
    //
    // gl.enableVertexAttribArray(this.a_Position);  // Enable the assignment of the buffer object
    // gl.enableVertexAttribArray(this.a_TexCoord);  // Enable the assignment of the buffer object
    //



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






    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewMatrix = new Matrix4(); // Model matrix
    var projMatrix = new Matrix4();   // Model view projection matrix
    var modelMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();   // Model view projection matrix

    viewMatrix.setLookAt(0, 50, 0, 0, 0, 0, 0, 0, 1);
    viewMatrix.setLookAt(0, 5, 5, 0, 0, -5, 0, 1, 0.1);

    projMatrix.setPerspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);


    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_SMatrix = gl.getUniformLocation(gl.program, 'u_SMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) {
        console.log('Failed to get the storage location');
        return;
    }

    // Set the light color (white)
    gl.uniform3f(u_LightColor, 0.0,0,0);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosition, 0.0,30.0,0.0);
    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 1.0,1.0,1.0);


    var normalMatrix = new Matrix4(); // Transformation matrix for normals


    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    // Calculate the matrix to transform the normal based on the model matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_mvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Pass the transformation matrix for normals to u_NormalMatrix
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);


    var SMatrix = new Matrix4();
    SMatrix.setScale(1,1,1);
    // SMatrix.setScale(2,1,2);
    gl.uniformMatrix4fv(u_SMatrix, false, SMatrix.elements);


    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);


}


















function lightcyclemain(gl, vshader, fshader){

    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return;
    }
    gl.useProgram(program);
    gl.program = program;


    var vertices = new Float32Array([
        2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
        2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
        2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
        -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
        -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
        2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
    ]);

    // Colors
    var colors = new Float32Array([
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);

    // Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    // Write the vertex property to buffers (coordinates, colors and normals)
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    var n = indices.length;




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



    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewMatrix = new Matrix4(); // Model matrix
    var projMatrix = new Matrix4();   // Model view projection matrix
    var modelMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();   // Model view projection matrix

    viewMatrix.setLookAt(0, 50, 0, 0, 0, 0, 0, 0, 1);
    viewMatrix.setLookAt(0, 5, 5, 0, 0, -5, 0, 1, 0.1);

    projMatrix.setPerspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);



    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_SMatrix = gl.getUniformLocation(gl.program, 'u_SMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) {
        console.log('Failed to get the storage location');
        return;
    }

    // Set the light color (white)
    gl.uniform3f(u_LightColor, 0.0,0,0);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosition, 0.0,30.0,0.0);
    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 1.0,1.0,1.0);


    var normalMatrix = new Matrix4(); // Transformation matrix for normals


    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    // Calculate the matrix to transform the normal based on the model matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_mvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Pass the transformation matrix for normals to u_NormalMatrix
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);


    var SMatrix = new Matrix4();
    SMatrix.setScale(1,1,1);
    // SMatrix.setScale(2,1,2);
    gl.uniformMatrix4fv(u_SMatrix, false, SMatrix.elements);


    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);




}