
import { resizeAspectRatio, setupText, updateText, Axes } from '../util/util.js';
import { Shader, readShaderFile } from '../util/shader.js';

let isInitialized = false;
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;
let axesVAO;
let cubeVAO;
let finalSunTransform;
let finalEarthTransform;
let finalMoonTransform;
let rotationAngle = 0;
let isAnimating = false;
let lastTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) {
        console.log("Already initialized");
        return;
    }

    main().then(success => {
        if (!success) {
            console.log('프로그램을 종료합니다.');
            return;
        }
        isInitialized = true;
        requestAnimationFrame(animate);
    }).catch(error => {
        console.error('프로그램 실행 중 오류 발생:', error);
    });
});

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;
    resizeAspectRatio(gl, canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.3, 0.4, 1.0);
    
    return true;
}

function setupAxesBuffers(shader) {
    axesVAO = gl.createVertexArray();
    gl.bindVertexArray(axesVAO);

    const axesVertices = new Float32Array([
        -0.8, 0.0, 0.8, 0.0,  // x축
        0.0, -0.8, 0.0, 0.8   // y축
    ]);

    const axesColors = new Float32Array([
        1.0, 0.3, 0.0, 1.0, 1.0, 0.3, 0.0, 1.0,  // x축 색상
        0.0, 1.0, 0.5, 1.0, 0.0, 1.0, 0.5, 1.0   // y축 색상
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axesVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axesColors, gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
}

function setupCubeBuffers(shader) {
    const cubeVertices = new Float32Array([
        -0.5,  0.5,  // 좌상단
        -0.5, -0.5,  // 좌하단
         0.5, -0.5,  // 우하단
         0.5,  0.5   // 우상단
    ]);

    const indices = new Uint16Array([
        0, 1, 2,    // 첫 번째 삼각형
        0, 2, 3     // 두 번째 삼각형
    ]);

    const cubeColors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,  // 빨간색
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0
    ]);

    cubeVAO = gl.createVertexArray();
    gl.bindVertexArray(cubeVAO);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
}
//====================================================================================
function getSunTransformMatrices() {
    const T = mat4.create();
    const R = mat4.create();
    const S = mat4.create();
    
    mat4.translate(T, T, [0, 0, 0]);
    mat4.rotate(R, R, rotationAngle/4, [0, 0, 1]);
    mat4.scale(S, S, [0.2, 0.2, 1]);
    
    return [S, R, T];
}

function getEarthTransformMatrices() {
    const T = mat4.create();
    const R1 = mat4.create();
    const R2 = mat4.create();
    const S = mat4.create();
    
    mat4.translate(T, T, [0.7, 0, 0]);
    mat4.rotate(R1, R1, rotationAngle, [0, 0, 1]);
    mat4.rotate(R2, R2, rotationAngle/6, [0, 0, 1]);
    mat4.scale(S, S, [0.1, 0.1, 1]);
    
    return [S, R1, T, R2];
}

function getMoonTransformMatrices() {
    const T1 = mat4.create();
    const T2 = mat4.create();
    const R1 = mat4.create();
    const R2 = mat4.create();
    const S = mat4.create();
    
    mat4.translate(T1, T1, [0.2, 0, 0]);
    mat4.translate(T2, T2, [0.7 * Math.cos(rotationAngle/6), 0.7 * Math.sin(rotationAngle/6), 0]);
    mat4.rotate(R1, R1, rotationAngle, [0, 0, 1]);
    mat4.rotate(R2, R2, rotationAngle*2, [0, 0, 1]);
    mat4.scale(S, S, [0.05, 0.05, 1]);
    
    return [S, R1, T1, R2, T2];
}
//=====================================================================================
function applySunTransform() {
    finalSunTransform = mat4.create();
    const sunTransformOrder = getSunTransformMatrices();
    /*
      array.forEach(...) : array 각 element에 대해 반복
    */
    if (sunTransformOrder != []) {
        sunTransformOrder.forEach(matrix => {
            mat4.multiply(finalSunTransform, matrix, finalSunTransform);
        });
    }
}

function applyEarthTransform() {
    finalEarthTransform = mat4.create();
    const earthTransformOrder = getEarthTransformMatrices();
    /*
      array.forEach(...) : array 각 element에 대해 반복
    */
    if (earthTransformOrder != []) {
        earthTransformOrder.forEach(matrix => {
            mat4.multiply(finalEarthTransform, matrix, finalEarthTransform);
        });
    }
}

function applyMoonTransform() {
    finalMoonTransform = mat4.create();
    const moonTransformOrder = getMoonTransformMatrices();
    /*
      array.forEach(...) : array 각 element에 대해 반복
    */
    if (moonTransformOrder != []) {
        moonTransformOrder.forEach(matrix => {
            mat4.multiply(finalMoonTransform, matrix, finalMoonTransform);
        });
    }
}
//=====================================================================================
function updateCubeColor(color) {
    gl.bindVertexArray(cubeVAO);
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
}

//=====================================================================================
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    shader.use();

    // 축 그리기
    shader.setMat4("u_transform", mat4.create());
    gl.bindVertexArray(axesVAO);
    gl.drawArrays(gl.LINES, 0, 4);

    // 태양 그리기
    updateCubeColor([
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0
    ]);
    shader.setMat4("u_transform", finalSunTransform); // u_transform <= modelMatrix 
    gl.bindVertexArray(cubeVAO);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // 지구 그리기
    updateCubeColor([
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0
    ]);

    shader.setMat4("u_transform", finalEarthTransform);
    gl.bindVertexArray(cubeVAO);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // 달 그리기
    updateCubeColor([
        1.0, 1.0, 0.0, 1.0,  // Cyan for Earth
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    ]);
    shader.setVec4("v_color", [1.0, 1.0, 0.0, 1.0]);
    shader.setMat4("u_transform", finalMoonTransform);
    gl.bindVertexArray(cubeVAO);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    isAnimating = true;
    if (isAnimating) {
        rotationAngle += Math.PI * deltaTime;
        applySunTransform();
        applyEarthTransform();
        applyMoonTransform();
    }
    render();
    requestAnimationFrame(animate);
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    return new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

async function main() {
    try {
        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
        }

        finalSunTransform = mat4.create();
        finalEarthTransform = mat4.create();
        finalMoonTransform = mat4.create();

        shader = await initShader();
        setupAxesBuffers(shader);
        setupCubeBuffers(shader);
        shader.use();
        return true;
    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}
