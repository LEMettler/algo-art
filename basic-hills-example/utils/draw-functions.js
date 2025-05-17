
function drawNoisyLine(x0, y0, x1, y1, std) {
    let points_per_length = 4;
    let n_points = Math.floor(dist(x0, y0, x1, y1) * points_per_length);
    total_points += n_points;
    for (let i = 0; i < n_points; i++) {
      let t = i / (n_points - 1);
      
      let x = lerp(x0, x1, t);
      let y = lerp(y0, y1, t);
      
      x += randomGaussian(0, std);
      y += randomGaussian(0, std);
      point(x, y);
    }
  }
  


function interpolateHillColor(light_value, depth) {
    let col
    if (light_value > 0) {
      col = lerpColor(light_color0, light_color1, light_value);
    } else {
      col = lerpColor(shadow_color0, shadow_color1, abs(light_value));
    }
    col = lerpColor(atmo_color, col, 1.3 - depth / N_z)
    return col;
  }
  
  
  
  
  function drawSurface(scaled_field, light_arr) {
    
    // move from back to front
    for (let index = N_z-3; index > 0; index--) {
      
      fill(lerpColor(atmo_color, hill_bg_color, 1 - index / N_z));
      noStroke();
  
      // cover 
      beginShape();
      for (let i = 0; i < N_x - 1; i++) {
        vertex(scaled_field[i][index][0], scaled_field[i][index][1]);
      }
      vertex(width * 0.5, -height * 0.5 - 1);
      vertex(-width * 0.5, -height * 0.5 - 1);
      endShape();
      
      // new noise line
      for (let i = 0; i < N_x - 1; i++) {
        stroke(interpolateHillColor(light_arr[i][index], index));
        
        let horizontal_bound = abs(scaled_field[i][index][0]) < 0.5 * width;
        let vertical_bound = abs(scaled_field[i][index][1]) < 0.5 * height;
        
        if (horizontal_bound && vertical_bound) {
          drawNoisyLine(scaled_field[i][index][0], scaled_field[i][index][1], scaled_field[i + 1][index][0], scaled_field[i + 1][index][1], 1);
        } 
      }

    }
  }
  