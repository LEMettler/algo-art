# Dotted Hills

Here is a rough, step by step outline. Quite a lot of math and background goes into some of these steps!

1. draw the sky
2. generate and draw the clouds 
3. generate the hills
   1. create noise heightmap from fractal noise with analytical derivatives
   2. stretch, modify, etc.
   3. 3D camera transformation (offset, pitch angle)
   4. 3D -> 2D projection
   5. scale to canvas
4. calculate lighting
5. draw the hills

### Directory overview
```
├── index.html
├── ...
├── sketch.js
└── utils
    ├── draw-functions.js
    ├── map-functions.js
    ├── noise-functions.js
    ├── OpenSimplexNoiseGrad.js
    ├── sky-functions.js
    ├── transform-functions.js
    └── utils.js
```