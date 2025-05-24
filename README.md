
# Black Hole

>[!CAUTION]  
> This is an extremely dangerous stress test that pushes hardware to absolute limits.  
> **Potential risks include**:  
> - Severe overheating  
> - System instability or crashes  
> - Rapid battery drain  
> - Thermal throttling or forced shutdowns  
>  
> *For high-end PCs/flagship devices only. Not safe for average/low-end hardware.*  
>  
> **The creator disclaims all responsibility** for any damage, data loss, or performance issues.

## Technical Overview

### Core Mechanism
- Renders **thousands of ray-marched spheres** with volumetric lighting  
- Uses **WebGL fragment shaders** (no rasterization)  
- Performs **64-step per-pixel calculations**  
- Features exponentially increasing object count
- Interaction (mouse/touch) **accelerates object growth rate**, compounding stress on hardware.


### Performance Metrics Format
**Compact string representation**:  
```js
{FPS}{Instances}{FrameTime}{Elapsed}{Resolution}
```
**Example**:  `60816.673.2119201080`  
<br>
| Component      | Description                          | Ideal          |
|---------------|-------------------------------------|---------------|
| `FPS`         | Frames per second                   | Higher = Better |
| `Instances`   | Count of 3D objects (doubles/sec)   | -             |
| `FrameTime`   | Frame render time (ms)              | Lower = Better |
| `Elapsed`     | Test duration in seconds            | -             |
| `Resolution`  | Canvas dimensions (e.g., 1920x1080) | -             |


### Stress Test Configuration
```js
const MIN_INSTANCES = 41824;   // Forced high initial load
const MAX_INSTANCES = Infinity; // Practical infinity
```

**Exponential Growth Pattern**:  `1 ~ 2 ~ 4 ~ 8 ~ 16 ~ 32 ~ 64 ~ ···`


## Hardware Impact
Targets all critical subsystems simultaneously, **Sustained maximum load on all components:**
| Subsystem  | Stress Factor                     |
|-----------|----------------------------------|
| GPU       | Parallel shader computations      |
| CPU       | JS draw loop + memory management |
| RAM       | Rapid buffer scaling             |
| Thermal   | Continuous 100% GPU utilization  |


## License
This project released under MIT License
