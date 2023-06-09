
function normalizardatos(matrix){
  const columnMeans = [];
  for (let col = 0; col < matrix[0].length; col++) {
    let sum = 0;
    for (let row = 0; row < matrix.length; row++) {
      sum += matrix[row][col];
    }
    const mean = sum / matrix.length;
    columnMeans.push(mean);
  }

  const columnStdDeviations = [];
  for (let col = 0; col < matrix[0].length; col++) {
    let squaredDiffSum = 0;
    for (let row = 0; row < matrix.length; row++) {
      const diff = matrix[row][col] - columnMeans[col];
      squaredDiffSum += diff * diff;
    }
    const variance = squaredDiffSum / matrix.length;
    const stdDeviation = Math.sqrt(variance);
    columnStdDeviations.push(stdDeviation);
  }
  for (let col = 0; col < matrix[0].length; col++) {
    for (let row = 0; row < matrix.length; row++) {
      matrix[row][col] = (matrix[row][col] - columnMeans[col]) / columnStdDeviations[col];      
    }
  }

  return matrix;
}

function multiply(a, b) {
  var aNumRows = a.length, aNumCols = Object.values(a[0]).length,
      bNumRows = b.length, bNumCols = Object.values(b[0]).length,
      m = new Array(aNumRows); 
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols+1); 
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;   
      for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += Object.values(a[r])[i] * Object.values(b[i])[c];            
      }      
    }
        
    
  }
  m = normalizardatos(m);
  for (var r = 0; r < aNumRows; ++r) {
    m[r][3] =1;
    m[r] = Object.assign({},m[r]);
  }
  return m;
}
function deleteChildren(proxymatriz) {
  while (proxymatriz.firstChild) {
    proxymatriz.removeChild(proxymatriz.firstChild);
  }
}

function crearproxyburbujas(matriz){

    var proxymatriz = document.querySelector('#burbujasmatriz');
    m = new Array(matriz.length);
    
    for (var r = 0; r < matriz.length; ++r) {
      m[r] = new Array(Object.values(matriz[0]).length +1);
      m[r]= Object.values(matriz[r]);
      m[r][3] =1;
      m[r] = Object.assign({},m[r]);
    }
    //console.log(proxymatriz);

  
    proxymatriz.setAttribute('babia-bubbles','data',JSON.stringify(m));
    
  
    
}


AFRAME.registerComponent('multiply-matrix', {
    schema:{
        archivo: { type:'string',default:''},
        matriz: { type: 'string',default:''}  
    },
    init: function(){
      //cambio altura
      var geometry = this.el.getAttribute('geometry');
      geometry.height = 0.1;
      //fin cambio altura

      var  archivo = this.data.archivo;
      var  matriz = this.data.matriz;
      
      this.el.setAttribute('geometry', geometry);
      this.el.addEventListener('click', function(){
            var burbujas = document.querySelector('#bubblesrealdata');
            fetch(archivo)
              .then(function(response) {
                return response.json();
              })
              .then(function(archive) {
                fetch(matriz)
                  .then(function(response) {
                    return response.json();
                  })
                  .then(function(matrix) {
                    crearproxyburbujas(matrix);
                    var m  = multiply(archive,matrix);
                    console.log(matrix,m);
                    burbujas.setAttribute('babia-bubbles','axis',true);
                    burbujas.setAttribute('babia-bubbles','data',JSON.stringify(m));
                    
                  });
              });
            
      })
      
    }             
  });


