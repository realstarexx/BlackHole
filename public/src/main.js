        class BlackHole {
            constructor() {
                this.canvas = document.getElementById('glcanvas');
                this.gl = this.canvas.getContext('webgl');
                this.interaction = 0;
                this.mouseX = 0;
                this.mouseY = 0;
                this.isInteracting = false;
                this.audioContext = null;
                this.oscillator = null;
                this.gainNode = null;
                this.startTime = performance.now();
                this.instances = [];
                this.lastTime = performance.now();
                this.frameCount = 0;
                this.fps = 0;
                this.frameTimes = [];
                this.init();
            }
            
            init() {
                this.setupCanvas();
                this.setupShaders();
                this.setupEventListeners();
                this.render();
            }
            
            setupCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                
                window.addEventListener('resize', () => {
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                });
            }
            
            setupShaders() {
                const fragShaderSource = document.getElementById('fragShader').textContent;
                this.program = this.createProgram(this.gl, fragShaderSource);
                this.positionAttribute = this.gl.getAttribLocation(this.program, 'position');
                
                this.buffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
                this.gl.bufferData(
                    this.gl.ARRAY_BUFFER,
                    new Float32Array([
                        -1, -1, 
                        1, -1, 
                        -1, 1,  
                        -1, 1,  
                        1, -1,  
                        1, 1
                    ]),
                    this.gl.STATIC_DRAW
                );
                
                this.resolutionUniform = this.gl.getUniformLocation(this.program, 'u_resolution');
                this.timeUniform = this.gl.getUniformLocation(this.program, 'u_time');
                this.mouseUniform = this.gl.getUniformLocation(this.program, 'u_mouse');
                this.interactionUniform = this.gl.getUniformLocation(this.program, 'u_interaction');
            }
            
            setupEventListeners() {
                this.canvas.addEventListener('mousedown', (e) => this.startInteraction(e));
                this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
                this.canvas.addEventListener('mouseup', () => this.endInteraction());
                this.canvas.addEventListener('mouseleave', () => this.endInteraction());
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.startInteraction(e.touches[0]);
                });
                this.canvas.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    this.handleMove(e.touches[0]);
                });
                this.canvas.addEventListener('touchend', () => this.endInteraction());
                
                document.addEventListener('click', () => this.initAudioContext(), { once: true });
                document.addEventListener('touchstart', () => this.initAudioContext(), { once: true });
            }
            
            createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
                    return null;
                }
                
                return shader;
            }
            
            createProgram(gl, fragShaderSource) {
                const vertShaderSource = `
                    attribute vec4 position;
                    void main() {
                        gl_Position = position;
                    }
                `;
                
                const vs = this.createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
                const fs = this.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
                
                const program = gl.createProgram();
                gl.attachShader(program, vs);
                gl.attachShader(program, fs);
                gl.linkProgram(program);
                
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.error('Program linking error:', gl.getProgramInfoLog(program));
                    return null;
                }
                
                return program;
            }
            
            initAudioContext() {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.gainNode = this.audioContext.createGain();
                this.gainNode.gain.value = 0;
                this.gainNode.connect(this.audioContext.destination);
            }
            
            playBeep(fps) {
                if (!this.audioContext) return;
                
                if (this.oscillator) {
                    this.oscillator.stop();
                }
                
                this.oscillator = this.audioContext.createOscillator();
                this.oscillator.type = 'sine';
                
                const minFPS = 30;
                const maxFPS = 240;
                const clampedFPS = Math.max(minFPS, Math.min(fps, maxFPS));
                const freq = 300 + (clampedFPS / maxFPS) * 1200;
                
                this.oscillator.frequency.value = freq;
                
                const volume = 0.1 + (1 - (clampedFPS / maxFPS)) * 0.4;
                this.gainNode.gain.value = volume;
                
                this.oscillator.connect(this.gainNode);
                this.oscillator.start();
                this.oscillator.stop(this.audioContext.currentTime + 0.05);
            }
            
            startInteraction(e) {
                this.isInteracting = true;
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }
            
            handleMove(e) {
                if (this.isInteracting) {
                    this.mouseX = e.clientX;
                    this.mouseY = e.clientY;
                    this.interaction = 1.0;
                }
            }
            
            endInteraction() {
                this.isInteracting = false;
            }
            
            updateInstances(currentTimeSec) {
                const MIN_INSTANCES = 41824; // disclaimer: never update this before proper calculation
                const instanceCount = MIN_INSTANCES * Math.pow(2, currentTimeSec * 0.2);
                
                this.instances = [];
                
                for (let i = 0; i < instanceCount; i++) {
                    let offset = currentTimeSec - (i * 0.05);
                    this.instances.push(offset);
                }
            }
            
            updateFPS(now) {
                this.frameCount++;
                
                if (now - this.lastTime >= 1000) {
                    this.fps = this.frameCount;
                    this.frameCount = 0;
                    this.lastTime = now;
                    
                    if (this.fps > 0) {
                        this.playBeep(this.fps);
                    }
                }
                
                this.frameTimes.push(performance.now());
                if (this.frameTimes.length > 60) {
                    this.frameTimes.shift();
                }
            }
            
            updateInteraction(deltaTime) {
                if (!this.isInteracting) {
                    this.interaction = Math.max(0, this.interaction - deltaTime * 0.5);
                }
            }
            render() {
                const now = performance.now();
                const deltaTime = (now - this.lastTime) / 1000;
                const elapsed = (now - this.startTime) / 1000;
                
                this.updateFPS(now);
                this.updateInteraction(deltaTime);
                this.updateInstances(elapsed);
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                this.gl.useProgram(this.program);
                this.gl.enableVertexAttribArray(this.positionAttribute);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
                this.gl.vertexAttribPointer(this.positionAttribute, 2, this.gl.FLOAT, false, 0, 0);
                this.gl.uniform2f(this.resolutionUniform, this.canvas.width, this.canvas.height);
                this.gl.uniform2f(this.mouseUniform, this.mouseX / this.canvas.width, 1.0 - this.mouseY / this.canvas.height);
                this.gl.uniform1f(this.interactionUniform, this.interaction);
                
                for (let t of this.instances) {
                    this.gl.uniform1f(this.timeUniform, t);
                    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
                }
                
                requestAnimationFrame(() => this.render());
            }
        }
        window.addEventListener('load', () => {
            new BlackHole();
        });
