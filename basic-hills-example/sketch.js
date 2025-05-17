// grid size (heightmap)
let N_x = 400;
let N_z = 800;

//canvas size
let size = 1080;

// map generation parameters
let n_iters = 12; //fbm octaves
let width_param = 1.05; //fbm speed
let depth_param = 2.9; //fbm speed

// sun angles (spherical coordinates, lefthanded system)
let theta = 90;
let phi = 250;

// camera parameters
let camera_position = [0, 0, 0]; // (x, y, z)
let angle = 20; //pitch
let fov_deg = 20;
// retrospectivly added scaling coefficient
let scalingHeight = 2.3; 

let sky_lower_limit = -0.3; //relative start of sky

let light_color0, light_color1, shadow_color0, shadow_color1, bg_color, sky_color, atmo_color, cloud_color, hill_bg_color;
let light_vector, current_step, total_points;
let noise, seed, canvas;


function setup() {

  canvas = createCanvas(ceil(size/2), ceil(size/2)); 
  scale(1, -1);
  translate(width * 0.5, -height * 0.5);

  seed = Date.now();
  noise = new OpenSimplexNoise(seed);

  // orange scheme
  bg_color =      color('#6b2d23');
  hill_bg_color = color('#b9552d');
  light_color0 =  color('#e06038');
  light_color1 =  color('#ffa87a');
  shadow_color0 = color('#4a1510');
  shadow_color1 = color('#3c0e0b');
  atmo_color =    color('#f0a06b');
  cloud_color =   color('#ffd3b9');
  sky_color = bg_color;
  background(bg_color);


  light_vector = [sin(PI*theta/180)*sin(PI*phi/180), 
                  cos(PI*theta/180), 
                  sin(PI*theta/180)*cos(PI*phi/180)];
  current_step = 'sky';
  total_points = 0;
}



function draw() {

  scale(1, -1);
  translate(width * 0.5, -height * 0.5);

  console.log(current_step);

  if (current_step === 'sky'){
    generateSky();
    current_step = 'cloud';
  } else if (current_step === 'cloud'){
    generateClouds();
    current_step = 'map';
  } else if (current_step === 'map'){
    generateDrawSurface();
    current_step = 'end';
  } else {
    closer();
    //saveImage();
    noLoop();
    console.log('total points: ', total_points);

  }

}






