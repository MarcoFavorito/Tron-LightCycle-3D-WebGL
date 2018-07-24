var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
    var m2 = new Matrix4(m);
    g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
    return g_matrixStack.pop();
}

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function initTextures(gl, n, texture_src, isBitmap) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    // Get the storage location of u_Sampler
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }
    var image = new Image();  // Create the image object
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    if (!isBitmap) {
        // Register the event handler to be called on loading an image
        image.onload = function () {
            loadTexture(gl, n, texture, u_Sampler, image);
        };
        // Tell the browser to load an image
        image.src = texture_src;
    }
    else{
        loadTextureMipmap(gl, n, texture, u_Sampler, texture_src)
    }
    return true;
}


function loadTexture(gl, texture, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

}

function loadTextureMipmap(gl, n, texture, u_Sampler, image){
    gl.bindTexture( gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    //LINEAR_MIPMAP_LINEAR


    //The best:
    //http://what-when-how.com/opengl-programming-guide/filtering-texture-mapping-opengl-programming/
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);
    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR);
    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_NEAREST);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR);

    gl.uniform1i(u_Sampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n); // Draw the rectangle
}


function initArrayBuffer(gl, attribute, data, num) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return buffer;
}


/* orignally by Peter Kelley https://github.com/pgkelley4 */
"use strict";

var subtractPoints = function (point1, point2) {
    return {
        x : point1.x - point2.x,
        z : point1.z - point2.z
    };
};

var crossProduct = function (point1, point2) {
    return point1.x * point2.z - point1.z * point2.x;
};

var doLineSegmentsIntersect = function (p, p2, q, q2) {

    var r = subtractPoints(p2, p);
    var s = subtractPoints(q2, q);

    var denominator = crossProduct(r, s);

    if (denominator == 0) { // lines are paralell
        return {
            check: false
        };
    };

    var uNumerator = crossProduct(subtractPoints(q, p), r);

    var u = uNumerator / denominator;
    var t = crossProduct(subtractPoints(q, p), s) / denominator;

    return {
        check: ((t > 0) && (t < 1) && (u > 0) && (u < 1)),
        x: (p.x + t * r.x),
        z: (p.z + t * r.z)
    };
};


var scalarProduct = function(v1, v2){
    var res=  v1[0]*v2[0] +
            v1[1]*v2[1];
    if (v1.length==3)
        res +=v1[2]*v2[2];
    return res;
};

var createLabel = function(name) {
    var text = document.createElement('div');
    text.setAttribute('class', 'playerLabel');
    text.setAttribute('id', name);
    text.innerHTML = name;
    document.getElementById('player-labels').appendChild(text);
    return text;
};

function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;

    var width  = canvas.clientWidth  * multiplier | 0;
    var height = canvas.clientHeight * multiplier | 0;
    // console.log("mult:" +  width + " " + height);
    if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;

        return true;
    }
    return false;
}