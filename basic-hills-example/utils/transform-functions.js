// Rotate a set of 3D points around the x-axis
function matrixRotateX(points, angle) {
    const c = cos(angle);
    const s = sin(angle);
    const matrix = [
      [1, 0, 0],
      [0, c, -s],
      [0, s, c]
    ];

    const result = createArray2D(points.length, points[0].length);

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[0].length; j++) {
      
        result[i][j] = [
          matrix[0][0] * points[i][j][0] + matrix[0][1] * points[i][j][1] + matrix[0][2] * points[i][j][2],
          matrix[1][0] * points[i][j][0] + matrix[1][1] * points[i][j][1] + matrix[1][2] * points[i][j][2],
          matrix[2][0] * points[i][j][0] + matrix[2][1] * points[i][j][1] + matrix[2][2] * points[i][j][2]
        ];
        }
    }
    return result;
  }
  
  // Rotate a set of 3D points around the y-axis
  function matrixRotateY(points, angle) {
    const c = cos(angle);
    const s = sin(angle);
    const matrix = [
      [c, 0, s],
      [0, 1, 0],
      [-s, 0, c]
    ];

    const result = createArray2D(points.length, points[0].length);

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[0].length; j++) {
      
        result[i][j] = [
          matrix[0][0] * points[i][j][0] + matrix[0][1] * points[i][j][1] + matrix[0][2] * points[i][j][2],
          matrix[1][0] * points[i][j][0] + matrix[1][1] * points[i][j][1] + matrix[1][2] * points[i][j][2],
          matrix[2][0] * points[i][j][0] + matrix[2][1] * points[i][j][1] + matrix[2][2] * points[i][j][2]
        ];
        }
    }
    return result;
  } 

  
  // Rotate a set of 3D points around the z-axis
  function matrixRotateZ(points, angle) {
    const c = cos(angle);
    const s = sin(angle);
    const matrix = [
      [c, -s, 0],
      [s, c, 0],
      [0, 0, 1]
    ];

    const result = createArray2D(points.length, points[0].length);

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[0].length; j++) {
      
        result[i][j] = [
          matrix[0][0] * points[i][j][0] + matrix[0][1] * points[i][j][1] + matrix[0][2] * points[i][j][2],
          matrix[1][0] * points[i][j][0] + matrix[1][1] * points[i][j][1] + matrix[1][2] * points[i][j][2],
          matrix[2][0] * points[i][j][0] + matrix[2][1] * points[i][j][1] + matrix[2][2] * points[i][j][2]
        ];
        }
    }
    return result;
  } 



  
  // Apply a camera transformation to a set of 3D points
  function matrixCameraTransform(points, cameraPosition, theta) {
  
    // Translate points by subtracting the camera position
    let translatedPoints = createArray2D(points.length, points[0].length);
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[0].length; j++) {
        
        translatedPoints[i][j] = [
          points[i][j][0] - cameraPosition[0],
          points[i][j][1] - cameraPosition[1],
          points[i][j][2] - cameraPosition[2]
        ];
      }
    }
  
    
    // Rotate points around each axis
    translatedPoints = matrixRotateX(translatedPoints, theta[0]);

    translatedPoints = matrixRotateY(translatedPoints, theta[1]);  
    translatedPoints = matrixRotateZ(translatedPoints, theta[2]);
  
    return translatedPoints;
  }




  // Project a set of 3D points to 2D using a field of view
function matrixProjectTo2D(points, fov) {

  const eZ = 1 / Math.tan(fov / 2);

  let projected2D = createArray2D(points.length, points[0].length);
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[0].length; j++) {
      let point = points[i][j];
      
      projected2D[i][j] = [eZ * point[0] / (point[2] + 2.0), 
                           eZ * point[1] / (point[2] + 2.0)];
    }
  }

  const maxVal = findAbsMax(projected2D);


  if (maxVal > 0) {
    //return projected2D.map(([x, y]) => [x / maxVal, y / maxVal]);

    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[0].length; j++) {
        let point = points[i][j];
        projected2D[i][j] = [point[0] / maxVal, point[1] / maxVal];
      }
    }

  }


  return projected2D;
}



  
  // Helper function to apply a matrix to a set of points
  function applyMatrix(points, matrix) {

    const result = createArray2D(points.length, points[0].length);

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[0].length; j++) {
      
        let [x, y, z] = points[i][j];
        result[i][j] = [
          matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
          matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
          matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z
        ];
        }
    }
    return result;
  }
  

  function scaleToCanvas(projectedHeightfield, width, height, scalingHeight = 2.) {
    const xCornerLeft = abs(projectedHeightfield[0][projectedHeightfield[0].length - 1][0]);
    const xCornerRight = abs(projectedHeightfield[projectedHeightfield.length - 1][projectedHeightfield[0].length - 1][0]);
    
    const xScalingFactor = 0.5 * width / max(xCornerLeft, xCornerRight);
    
    // Scale the heightfield
    const scaledHeightfield = JSON.parse(JSON.stringify(projectedHeightfield)); // Deep copy
    for (let i = 0; i < scaledHeightfield.length; i++) {
      for (let j = 0; j < scaledHeightfield[0].length; j++) {
        scaledHeightfield[i][j][0] *= xScalingFactor;
        scaledHeightfield[i][j][1] *= scalingHeight * height;
      }
    }
    
    // Calculate y offset
    const yOffset = -(0.5 * height + Math.max(...scaledHeightfield.map(row => row[0][1])));
    
    // Apply y offset
    for (let i = 0; i < scaledHeightfield.length; i++) {
      for (let j = 0; j < scaledHeightfield[0].length; j++) {
        scaledHeightfield[i][j][1] += yOffset;
      }
    }
    
    return scaledHeightfield;
  }

