
# Black Hole

**WARNING**: This is an extremely dangerous stress test that pushes your device to its absolute limits. It renders thousands of animated, ray-marched spheres with real-time volumetric lighting via WebGL fragment shaders.

- Running this test may cause:
- Overheating
- System lag or unresponsiveness
- Crashes or automatic reboots
- Battery drainage or thermal throttling

This is not a demo. This is not a visualizer. This is a torture test.
Use only on high-end PCs or flagship devices. Not safe for average or low-end hardware.

**The creator takes no responsibility for any damage, data loss, or performance degradation caused by running this test.**

## How It Works

This site uses ray-marched spheres with glowing volumetric effects and 64-step per-pixel calculations, rendering via shader-based lighting (no rasterization) in a real-time WebGL loop with exponentially increasing object count and live performance metrics.



### Output Format

Displays as a compact string:

```js
{FPS}{Instances}{FrameTime}{Elapsed}{Resolution}
```

**Example**: `60816.673.2119201080`

**Components:**

- **FPS**: Frames Per Second. Higher is better.
- **Instances**: Number of 3D objects. Doubles each second.
- **FrameTime**: Time to render a frame (ms). Lower is better.
- **Elapsed**: Seconds since start.
- **Resolution**: Pixel dimensions of canvas.

### Initial Load Configuration
```js
const MIN_INSTANCES = 41824;  // Forced starting pressure
const MAX_INSTANCES = 2 ** 99;  // Effectively infinite
```
**Objects multiply exponentially:**

```js
1 → 2 → 4 → 8 → 16 → 32 → 64 → ...
```
**Note**: Any interaction (mouse/touch) accelerates this growth rate.


## Performance Evaluation

This test hits multiple subsystems at once:

**GPU**: Shader intensity, parallel computation load
**CPU**: JavaScript draw loop + memory management
**Memory**: Rapid buffer scaling, exponential allocations
**Thermals**: Sustained draw calls under full GPU load

# License
MIT License © 2025 Ankit Mehta
