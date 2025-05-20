# Black Hole

A performance benchmarking tool that stress-tests devices by rendering multiple animated 3D spheres with volumetric lighting effects using WebGL.

**Note:**
This benchmark is **extremely intensive** and designed to push your device to its **absolute limits**. The default instance of `1` has been forcefully expanded to `1073741824` `(2³⁰)`, resulting in extremely high computational load.
As a result, your device may experience excessive **heating, crashes, freezes**, or **lag**, especially on low-end or older hardware.

This benchmark is intended **only for flagship smartphones or high-performance PCs.**
Running it on unsuitable hardware may cause **unexpected behavior or system instability**.
**Please do not blame the creator** for any issues or side effects caused during or after the test.


## Understanding Benchmark Scores

The benchmark displays results in this compact format:
```js
{FPS}{Instances}{FrameRate}{Elapsed}{Resolution}
```

Example Output: `60816.673.2119201080`

### Score Components Explained:

1. **FPS (Frames Per Second)**
   - Measures rendering smoothness
   - Higher values indicate better performance
   - 60 FPS is the target for smooth animation

2. **Instances**  
   - Number of active 3D objects being rendered
   - Doubles every second (1, 2, 4, 8, 16...)
   - Tests how many objects your device can handle
   - Custom Instances Support
   ```js
    // DEFAULT_MIN_INSTANCES = 1
    const MIN_INSTANCES = 1073741824;  // Set minimum instances to 1073741824 (Dangerous for Low-End Devices)
    
    // DEFAULT_MAX_INSTANCES = 1073741824
    const MAX_INSTANCES = 633825300114114700748351602688;


4. **FrameTime (ms)**  
   - Average time to render one frame in milliseconds
   - Lower values are better (16.67ms = 60 FPS)
   - Values above 33ms indicate performance issues

5. **Elapsed (seconds)**
   - Time since benchmark started
   - Shows how long your device maintains performance

6. **Resolution**  
   - Current rendering resolution in pixels
   - Higher resolutions require more GPU power

## How the Benchmark Works

This test evaluates several aspects of device performance:

- **GPU Capabilities**: Through complex fragment shader calculations
- **Thermal Performance**: By sustaining heavy load over time
- **Memory Bandwidth**: With exponentially increasing object counts
- **JavaScript Execution**: Via real-time WebGL rendering

The benchmark uses:
- Ray-marched spheres with volumetric glow effects
- 64-step ray marching per pixel
- Exponential instance growth to increase load
- Precise frame timing measurements

## Getting Accurate Results

For reliable benchmark scores:
1. Close other running applications
2. Connect to power source during testing
3. Disable power saving modes
4. Use latest version of Chrome or Firefox
5. Run test for at least 30 seconds
6. Allow the browser to use hardware acceleration

## Comparing Devices

When comparing different devices, focus on:
- Maximum stable FPS maintained
- Highest instance count before FPS drops significantly
- Consistency of frame times throughout the test

## Technical Specifications

- **Rendering Method**: Ray marching in fragment shader
- **Shader Complexity**: 64 iterations per pixel
- **Load Scaling**: Objects double every second
- **Measurement**: Uses window.performance API
- **Compatibility**: Works on all WebGL-capable devices

## License

MIT License - Copyright (c) 2025 Starexx (Ankit Mehta)
