
function modifySurface(xx, yy, zz) {

  const yy_undamped = JSON.parse(JSON.stringify(yy)); // deep copy

  // dampening
  for (let i = 0; i < yy.length; i++) {
    for (let j = 0; j < yy[0].length; j++) {
      yy[i][j] = pow(yy[i][j], 1.8);
      //yy[i][j] *= pow(map(zz[i][j], -1, 1, 0.2, 1), 1.4);
      yy[i][j] *= pow(tanh(zz[i][j] * 0.5 + 0.5) * 1.31, 0.8);
      
    }
  }

  // remap height values
  const maxHeight = findMax(yy);
  const minHeight = findMin(yy);
  for (let i = 0; i < yy.length; i++) {
    for (let j = 0; j < yy[0].length; j++) {
      yy[i][j] = map(yy[i][j], minHeight, maxHeight, 0, 1);
    }
  }

  // create coordinate arrays of positions (x, y, z)
  const heightfieldCoordinates = [];
  const heightfieldCoordinatesUndamped = [];

  for (let i = 0; i < xx.length; i++) {
    const row = [];
    const rowUndamped = [];
    for (let j = 0; j < xx[0].length; j++) {
      row.push([xx[i][j], yy[i][j], zz[i][j]]);
      rowUndamped.push([xx[i][j], yy_undamped[i][j], zz[i][j]]);
    }
    heightfieldCoordinates.push(row);
    heightfieldCoordinatesUndamped.push(rowUndamped);
  }


  return [heightfieldCoordinates, yy_undamped];
}




function getLighting(yy, light_vector) {

  const [dhDx, dhDz] = gradient(yy);
  const dhDy = 1.0;
  const light_arr = createArray2D(dhDx.length, dhDx[0].length);


  for (let i = 0; i < light_arr.length; i++) {
    for (let j = 0; j < light_arr[0].length; j++) {
      const norm = dhDx[i][j] ** 2 + dhDz[i][j] ** 2 + dhDy ** 2;

      light_arr[i][j] = (-dhDx[i][j] * light_vector[0] + dhDy * light_vector[1] - dhDz[i][j] * light_vector[2]) / norm;
    }
  }

  let max_light = findMax(light_arr);
  let min_light = findMin(light_arr);

  for (let i = 0; i < light_arr.length; i++) {
    for (let j = 0; j < light_arr[0].length; j++) {

      //light_arr[i][j] = map(light_arr[i][j], min_light, max_light, -1, 1);

      if (light_arr[i][j] < 0) {
        light_arr[i][j] = map(light_arr[i][j], min_light, 0, -1, 0);
      } else {
        light_arr[i][j] = map(light_arr[i][j], 0, max_light, 0, 1);
      }
    }
  }

  return light_arr;
}






function generateDrawSurface() {

  let x_speed = width_param;
  let z_speed = depth_param;
  let xn_range = linspace(-1, 1, N_x);
  let zn_range = linspace(-1, 1, N_z);
  let theta = [-radians(angle), 0, 0];

  // noise map
  let [xx, zz] = meshgrid(xn_range, zn_range);
  let yy = mynoise(xx, zz, x_speed, z_speed, n_iters);

  // modifications / stretchings nxmx3 matrix
  let [heightfield_untransformed, yy_undamped] = modifySurface(xx, yy, zz);
  
  let transformed_field = matrixCameraTransform(heightfield_untransformed, camera_position, theta);
  let projected_field = matrixProjectTo2D(transformed_field, radians(fov_deg));
  let scaled_field = scaleToCanvas(projected_field, width, height, scalingHeight = scalingHeight);
  
  let light_arr = getLighting(yy_undamped, light_vector);
  
  // this call actually draws *after* everything is generated
  drawSurface(scaled_field, light_arr);

}


