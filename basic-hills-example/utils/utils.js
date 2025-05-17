

function createArray2D(rows, cols, defaultValue = 0) {
    return Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => defaultValue));
  }
  

  function linspace(a, b, steps){
    let range = Array.from({ length: steps }, (_, i) => map(i, 0, steps-1, a, b));
    return range;
  }
  
  
  function gradient(arr) {
    const gradX = createArray2D(arr.length, arr[0].length);
    const gradY = createArray2D(arr.length, arr[0].length);
    
    // Calculate gradients
    for (let i = 0; i < arr.length-1; i++) {
      for (let j = 0; j < arr[0].length-1; j++) {
        // X gradient
        gradX[i][j] = arr[i][j] - arr[i+1][j];
        
        // Y gradient
        gradY[i][j] = arr[i][j] - arr[i][j+1];
      }
    }
    
    return [gradX, gradY];
  }

  

function meshgrid(xArray, zArray) {
    const xx = [];
    const zz = [];
    
    for (let x of xArray) {
      const newXRow = [];
      const newZRow = [];
      for (let z of zArray) {
        newXRow.push(x);
        newZRow.push(z);
      }
      xx.push(newXRow);
      zz.push(newZRow);
    }
    
    return [xx, zz];
  }

  

  function findMax(arr) {
    let max = -Infinity;
  
    // Flatten and find the maximum value iteratively
    const stack = [...arr];
    while (stack.length) {
      const next = stack.pop();
      if (Array.isArray(next)) {
        stack.push(...next);
      } else {
        max = Math.max(max, next);
      }
    }
  
    return max;
  }
  
  function findMin(arr) {
    let max = Infinity;
  
    // Flatten and find the maximum value iteratively
    const stack = [...arr];
    while (stack.length) {
      const next = stack.pop();
      if (Array.isArray(next)) {
        stack.push(...next);
      } else {
        max = Math.min(max, next);
      }
    }
  
    return max;
  }

  
  function findAbsMax(arr) {
    let max = -Infinity;
  
    // Flatten and find the maximum value iteratively
    const stack = [...arr];
    while (stack.length) {
      const next = stack.pop();
      if (Array.isArray(next)) {
        stack.push(...next);
      } else {
        max = Math.max(max, abs(next));
      }
    }
  
    return max;
  }



function transposeArray(arrayA) {
    let arrayALengths = [];
    let arrayB = [];
    let arrayAmax;
  
    for (let i = 0; i < arrayA.length; i++) {
      //create an array of array lengths of each subarray
      arrayALengths.push(arrayA[i].length);
    }
    //get length of longest array
    arrayAmax = Math.max(...arrayALengths);
  
    //construct each subarray (row) of arrayB
    for (let i = 0; i < arrayAmax; i++) {
      arrayB.push([]);
    }
  
    //fill
    //xy in relation to arrayB, yx for arrayA
  
    //for each (column) of arrayB or row of arrayA (3 times)
    for (let x = 0; x < arrayA.length; x++) {
      //for the limit of each (row) of arrayA or column of arrayB (4 times)
      for (let y = 0; y < arrayAmax; y++) {
          arrayB[y].push(arrayA[x][y]);
      }
    }
    return arrayB;
  }


  function tanh(x) {
    return (exp(x) - exp(-x)) / (exp(x) + exp(-x))
  }


  function smoothstep(x) {
    if (x < 0){
      return 0;
    } else if (x > 1) {
      return 1;
    } else {
      return 3*x*x - 2*x*x*x;
    }
  }
  

  function smootherstep(x) {
    if (x < 0){
      return 0;
    } else if (x > 1) {
      return 1;
    } else {
      return 6*pow(x, 5) - 15*pow(x, 4) + 10*pow(x, 3);
    }
  }



  function border() {
    noStroke();
    fill(bg_color);
  
    let t = 0.015;
    let s = min(width, height);
  
    rect(-0.5*width, -0.5*height, t*s, height);
    rect(-0.5*width, -0.5*height, width, t*s);
    rect(0.5*width - t*s, -0.5*height, t*s, height);
    rect(-0.5*width, 0.5*height - t*s*2.5, width, t*s*2.5);
    
  }

  function closer() {
  
    border();
    
    fill(light_color1);
    noStroke();
    
    resetMatrix();
    
    let text_y = height * 0.025;
    
    textAlign(RIGHT);
    text("points: " + total_points, width - height * 0.03, text_y);
    textAlign(CENTER);
    text("grid: " + N_x + "x" + + N_z, width - height * 0.33, text_y);
    text("canvas: " + size + "x" + + size, width - height * 0.66, text_y);
    
    textAlign(LEFT);
    text(encodeSeed(seed), height * 0.03, text_y);
    
  }
  

function saveImage() {
  let filename = `${seed}.jpg`;
  save(filename);
}




function encodeSeed(seed) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const base = chars.length;

  if (seed === 0) return chars[0];

  let encoded = '';
  let num = Math.abs(seed);

  while (num > 0) {
    const remainder = num % base;
    encoded = chars[remainder] + encoded;
    num = Math.floor(num / base);
  }

  return (seed < 0 ? '-' : '') + encoded;
}
