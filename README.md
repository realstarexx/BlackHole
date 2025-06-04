# Black Hole

> [!CAUTION]  
> This is an **extremely dangerous real-time benchmark** that pushes your hardware to its absolute limits.  
>  
> **Potential risks include**:  
> - Severe overheating  
> - System instability or crashes  
> - Rapid battery drain  
> - Thermal throttling or forced shutdowns  
>  
>  **Use only on high-end PCs or flagship devices.**  
>  **Not safe for average or low-end hardware.**  
>  
> The creator disclaims all responsibility for any damage, data loss, or performance issues.

## Technical Overview

### Core Mechanism

- Renders **thousands of ray-marched volumetric spheres**
- Built using **pure WebGL fragment shaders**
- Executes **64 per-pixel raymarch steps** per frame
- Uses time and interaction data to stress GPU
- Mouse/touch input modifies internal interaction factor (`u_interaction`) to increase rendering complexity

## Stress Test Configuration

- Starts with a **high object count baseline**
- Load scales **exponentially over time**
- No hard cap on stress ceiling

## Hardware Impact

| Subsystem | Stress Factor                         |
|-----------|----------------------------------------|
| GPU       | Parallel volumetric shader evaluation |
| CPU       | Real-time draw loop & buffer control  |
| RAM       | Continuous memory pressure            |
| Thermal   | Sustained 100% GPU utilization        |

## License

Released under the **MIT License**
