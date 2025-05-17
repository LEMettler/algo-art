
// points of one circle
function getCirclepoints(n_points, x, y, radius) {
  const points = [];
  for (let i = 0; i < n_points; i++) {
    let baseX = randomGaussian(0, radius);
    let baseY = randomGaussian(0, radius);
    points.push([baseX + x, baseY + y]);
  }
  return points;
}


function getMulticircles(n, xc, yc, xstd, ystd, max_rad) {
  let circles = [];

  // Generate base positions using for loop

  for (let i = 0; i < 40; i++) {
    let temp_circles = []
    for (let j = 0; j < n; j++) {

      let radius = random(0.1, 1) * max_rad;
      let rx = (1 - 2 * random(0, 1)) * xstd;
      let ry = (1 - 2 * random(0, 1)) * ystd;
      let noiseVal = 0.5 + 0.5 * noise.noise2D(rx, ry);
      let base_x = xc + rx * noiseVal + randomGaussian(0, xstd * 0.1);
      let base_y = yc + ry * noiseVal + randomGaussian(0, ystd * 0.1);

      let n_points = Math.floor(1.35 * radius ** 2 * (1 + 0.2 * randomGaussian(0, 1)));
      let circlePoints = getCirclepoints(n_points, base_x, base_y, radius);

      for (let k = 0; k < circlePoints.length; k++) {
        temp_circles.push(circlePoints[k]);
      }
    }
    circles.push(temp_circles);
  }

  return circles;
}



function generateClouds(lower_y = 0, n_clouds_min = 6, n_clouds_max = 9) {

  stroke(cloud_color);

  lower_y = lower_y * height;
  let n_clouds = Math.floor(random(n_clouds_min, n_clouds_max + 1));


  for (let i = 0; i < n_clouds; i++) {
    let n_circles = Math.floor(12 + 3 * randomGaussian());
    let cloud_x = random(-0.45, 0.45) * width;
    let cloud_y = random(lower_y / height, 0.5) * height;
    let cloud_std_val = 0.3;
    let cloud_x_std = width * cloud_std_val;
    let cloud_y_std = height * random(0.1, cloud_std_val * 0.3);
    let cloud_max_rad = width * 0.01;

    let cloud_circles = getMulticircles(n_circles, cloud_x, cloud_y, cloud_x_std, cloud_y_std, cloud_max_rad);

    for (let k = 0; k < cloud_circles.length; k++) {
      let circle = cloud_circles[k];
      for (let j = 0; j < circle.length; j++) {
        point(circle[j][0], circle[j][1]);
      }
    }
  }
}



function generateSky() {
  
  for (let y=height*sky_lower_limit; y<= height*0.5; y+=3){

    let i = 1 - exp(- (y / height * 2));
    let col = lerpColor(atmo_color, sky_color, i);
    
    stroke(col);
    drawNoisyLine(-0.5*width, y, 0.5*width, y, 1);
  }
}



