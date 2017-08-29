    // Functions to easily set uniforms
    function setIntUniform(gl, program, uniform, val) {
        var uniformAttr = gl.getUniformLocation(program, uniform);
        gl.uniform1i(uniformAttr, val);
    }

    function setFloatUniform(gl, program, uniform, val) {
        var uniformAttr = gl.getUniformLocation(program, uniform);
        gl.uniform1f(uniformAttr, val);
    }

    function setVec2Uniform(gl, program, uniform, val) {
        var uniformAttr = gl.getUniformLocation(program, uniform);
        gl.uniform2f(uniformAttr, val[0], val[1]);
    }

    function setVec3Uniform(gl, program, uniform, val) {
        var uniformAttr = gl.getUniformLocation(program, uniform);
        gl.uniform3f(uniformAttr, val[0], val[1], val[2]);
    }

    function setVec4Uniform(gl, program, uniform, val) {
        var uniformAttr = gl.getUniformLocation(program, uniform);
        gl.uniform4f(uniformAttr, val[0], val[1], val[2], val[3]);
    }

    function setMat3Uniform(gl, program, uniform, val) {
        var uniformAttr = gl.getUniformLocation(program, uniform);
        gl.uniformMatrix3fv(uniformAttr, false, val);
    }

    function setMat4Uniform(gl, program, uniform, val) {
        var uniformAttr = gl.getUniformLocation(program, uniform);
        gl.uniformMatrix4fv(uniformAttr, false, val);
    }

    // Functions to create vertex and index buffers
    function setFloat32Buffer(gl, vals) {
        var vertexArray = new Float32Array(vals);
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vertexBuffer;
    }

    function setFloat32BufferD(gl, vals) {
        var vertexArray = new Float32Array(vals);
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vertexBuffer;
    }

    function setUInt16Buffer(gl, vals) {
        var indexArray = new Uint16Array(vals);
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return indexBuffer;
    }

    /* Creates a gl texture using [image]
     */
    function createTexture(gl, image) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    function resize(canvas) {
      var displayWidth  = canvas.clientWidth;
      var displayHeight = canvas.clientHeight;
      if (canvas.width  != displayWidth ||
          canvas.height != displayHeight) {

        canvas.width  = displayWidth;
        canvas.height = displayHeight;
      }
    }

    function createFloatTexture(gl, width, height) {
        var text = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, text);
        gl.texImage2D(
            // Always gl.TEXTURE_2D for a 2D texture.
            gl.TEXTURE_2D,
            // Mipmap level.  Always 0.
            0,
            // Internal format of each pixel.  Here we want an RGBA texture.
            gl.RGBA,
            // Width of the texture.
            width,
            // Height of the texture.
            height,
            // Width of the border of the texture.  Always 0.
            0,
            // The pixel format of the data that is going to be uploaded to the GPU.
            // We have no data here, so use something that matches the internal format.
            gl.RGBA,
            // The type of each component of the pixel that is going to be uploaded.
            // Here we want a floating point texture.
            gl.FLOAT,
            // The data that is going to be uploaded.
            // We don't have any data, so we give null.
            // WebGL will just allocate the texture and leave it blank.
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return text;
    }
