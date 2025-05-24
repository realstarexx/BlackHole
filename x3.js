const canvas = document.getElementById("glcanvas");  
const gl = canvas.getContext("webgl");  
const infoElement = document.getElementById("info");

// Interaction variables
let interaction = 0;
let mouseX = 0;
let mouseY = 0;
let isInteracting = false;

function setupCanvas() {
  canvas.width = window.innerWidth;  
  canvas.height = window.innerHeight;
  
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  // Touch/mouse interaction
  canvas.addEventListener('mousedown', startInteraction);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', endInteraction);
  canvas.addEventListener('mouseleave', endInteraction);
  
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startInteraction(e.touches[0]);
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleMove(e.touches[0]);
  });
  canvas.addEventListener('touchend', endInteraction);
}

function startInteraction(e) {
  isInteracting = true;
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function handleMove(e) {
  if (isInteracting) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    interaction = 1.0;
  }
}

function endInteraction() {
  isInteracting = false;
}

setupCanvas();

const fragShaderSource = document.getElementById("fragShader").textContent;  

function createShader(gl, type, source) {  
  const shader = gl.createShader(type);  
  gl.shaderSource(shader, source);  
  gl.compileShader(shader);  
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
    console.error('Shader compilation failure:', gl.getShaderInfoLog(shader));  
    throw new Error(gl.getShaderInfoLog(shader));  
  }  
  
  return shader;  
}  

function createProgram(gl, fragShaderSource) {  
  const vertShaderSource = `  
    attribute vec4 position;  
    void main() {  
      gl_Position = position;  
    }  
  `;  
  
  const vs = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);  
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);  
  const program = gl.createProgram();  
  
  gl.attachShader(program, vs);  
  gl.attachShader(program, fs);  
  gl.linkProgram(program);  
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {  
    console.error('Program linking failure:', gl.getProgramInfoLog(program));  
    throw new Error(gl.getProgramInfoLog(program));  
  }  
  
  return program;  
}  

const program = createProgram(gl, fragShaderSource);  
const positionAttribute = gl.getAttribLocation(program, "position");  
const buffer = gl.createBuffer();  

function setupBuffers() {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);  
  gl.bufferData(  
    gl.ARRAY_BUFFER,  
    new Float32Array([  
      -1, -1, 
       1, -1, 
      -1, 1,  
      -1, 1,  
       1, -1,  
       1, 1  
    ]),  
    gl.STATIC_DRAW
  );
}

setupBuffers();

const resolutionUniform = gl.getUniformLocation(program, "u_resolution");  
const timeUniform = gl.getUniformLocation(program, "u_time");  
const mouseUniform = gl.getUniformLocation(program, "u_mouse");
const interactionUniform = gl.getUniformLocation(program, "u_interaction");

let start = performance.now();  
let instances = [];  
let lastTime = performance.now();  
let frameCount = 0;  
let fps = 0;
let frameTimes = [];
const frameTimeHistoryLength = 60;

// Set minimum instances and remove upper limit (effectively infinite)
const MIN_INSTANCES = 41824;

function updateInstances(currentTimeSec) {  
  const baseCount = Math.pow(2, Math.floor(currentTimeSec));
  let instanceCount = Math.max(MIN_INSTANCES, baseCount);
  
  // Increase instances during interaction
  if (isInteracting) {
    instanceCount = instanceCount * 1.5;
  }
  
  instances = [];  
  
  for (let i = 0; i < instanceCount; i++) {  
    let offset = currentTimeSec - (i * 0.05);
    instances.push(offset);  
  }  
}  

function updateFPS(now) {
  frameCount++;  
  
  if (now - lastTime >= 1000) {  
    fps = frameCount;  
    frameCount = 0;  
    lastTime = now;  
  }
  
  frameTimes.push(performance.now());
  if (frameTimes.length > frameTimeHistoryLength) {
    frameTimes.shift();
  }
}

function updateInteraction(deltaTime) {
  if (!isInteracting) {
    interaction = Math.max(0, interaction - deltaTime * 0.5);
  }
}

function render() {  
  const now = performance.now();  
  const deltaTime = (now - lastTime) / 1000;
  const elapsed = (now - start) / 1000;  
  
  updateFPS(now);
  updateInteraction(deltaTime);
  updateInstances(elapsed);  
  
  gl.viewport(0, 0, canvas.width, canvas.height);  
  gl.clear(gl.COLOR_BUFFER_BIT);  
  gl.useProgram(program);  
  gl.enableVertexAttribArray(positionAttribute);  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);  
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);  
  gl.uniform2f(resolutionUniform, canvas.width, canvas.height);  
  gl.uniform2f(mouseUniform, mouseX / canvas.width, 1.0 - mouseY / canvas.height);
  gl.uniform1f(interactionUniform, interaction);
  
  for (let t of instances) {  
    gl.uniform1f(timeUniform, t);  
    gl.drawArrays(gl.TRIANGLES, 0, 6);  
  }  
  
  updateInfoDisplay(elapsed);
  
  requestAnimationFrame(render);  
}  

function updateInfoDisplay(elapsed) {
  let avgFrameTime = 0;
  if (frameTimes.length > 1) {
    const totalTime = frameTimes[frameTimes.length - 1] - frameTimes[0];
    avgFrameTime = totalTime / (frameTimes.length - 1);
  }
  
  infoElement.innerHTML = `  
  ${fps}${instances.length}${avgFrameTime.toFixed(2)}${elapsed.toFixed(2)}${canvas.width}${canvas.height}
  `;
}   

render();
