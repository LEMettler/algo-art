
function single_octave(atot, a, f, last_grad, last_dndx, last_dndy, xx, zz, x_speed, z_speed, nn){
  atot += a;
  a *= 0.5; // Reduce amplitude
  f *= 1.9; // Increase frequency
    
  // Calculate slope magnitude using analytical derivatives
  let minSlope = Infinity;
  let maxSlope = -Infinity;
  for (let i = 0; i < xx.length; i++) {
    for (let j = 0; j < xx[0].length; j++) {
      
      last_grad[i][j] = sqrt(last_dndx[i][j]**2 + last_dndy[i][j]**2);
      minSlope = min(minSlope, last_grad[i][j]);
      maxSlope = max(maxSlope, last_grad[i][j]);
    }
  }
  
  // Add noise based on slope
  for (let i = 0; i < xx.length; i++) {
    for (let j = 0; j < xx[0].length; j++) {

      const mappedSlope = map(last_grad[i][j], minSlope, maxSlope, 0.6, 0.1); // Map slope to weight
      const [noiseValue, dn_dx, dn_dy] = noise.noisegrad2D(f * xx[i][j] * x_speed, f * zz[i][j] * z_speed);
      nn[i][j] += a * mappedSlope * noiseValue; // Add weighted noise

      //last_grad[i][j] = last_grad[i][j] + sqrt(dn_dx*dn_dx + dn_dy*dn_dy);
      last_dndx[i][j] += a * dn_dx;
      last_dndy[i][j] += a * dn_dy;
    }
  }

  return [atot, a, f, last_grad, last_dndx, last_dndy, nn];
}


function base_octave(xx, zz, x_speed, z_speed){

  let f = 1;
  let a = 1;
  let atot = 0;
  
  let last_grad = createArray2D(xx.length, xx[0].length);
  let last_dndx  = createArray2D(xx.length, xx[0].length);
  let last_dndy  = createArray2D(xx.length, xx[0].length);
   
  // Initialize noise array
  let nn = createArray2D(xx.length, xx[0].length);
  for (let i = 0; i < xx.length; i++) {
    for (let j = 0; j < xx[0].length; j++) {       
      const [noiseValue, dn_dx, dn_dy] = noise.noisegrad2D(f * xx[i][j] * x_speed, f * zz[i][j] * z_speed);
      nn[i][j] = noiseValue;
      //last_grad[i][j] = sqrt(dn_dx*dn_dx + dn_dy*dn_dy);
      last_dndx[i][j] = a * dn_dx;
      last_dndy[i][j] = a * dn_dy;
    }
  }
  
  return [f, a, atot, last_grad, last_dndx, last_dndy, nn];
}



function final_octave(xx, zz, x_speed, z_speed, atot, a, f, nn){
  for (let i = 0; i < xx.length; i++) {
    for (let j = 0; j < xx[0].length; j++) {
      nn[i][j] += a *       noise.noise2D(f * xx[i][j]*x_speed, f * zz[i][j]*z_speed );
      nn[i][j] += 1.5 * a * noise.noise2D(2 * f * xx[i][j]*x_speed , 2 * f * zz[i][j]*z_speed );
      
    }
  }
  atot += 1.5 * a;
  
  // Remap final values
  for (let i = 0; i < xx.length; i++) {
    for (let j = 0; j < xx[0].length; j++) {
      nn[i][j] = map(nn[i][j], -atot, +atot, 0, 1);
    }
  }

  return [x_speed, z_speed, atot, a, f, nn];
}


function mynoise(xx, zz, x_speed, z_speed, n_iters = 12) {

  let [f, a, atot, last_grad, last_dndx, last_dndy, nn] = base_octave(xx, zz, x_speed, z_speed);

  // Iterative noise generation
  for (let iter = 0; iter < n_iters; iter++) {
    [atot, a, f, last_grad, last_dndx, last_dndy, nn] = single_octave(atot, a, f, last_grad, last_dndx, last_dndy, xx, zz, x_speed, z_speed, nn);
  }

  // Final noise additions
  [x_speed, z_speed, atot, a, f, nn] = final_octave(xx, zz, x_speed, z_speed, atot, a, f, nn);
  
  return nn;
}
  
  