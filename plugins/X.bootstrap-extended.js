// 
// X.bootstrap.js (c) XTK Developers 2012
//
window = {}; // window is not known to workers
importScripts('xtk_edge.js');

//
// LOADING
//
function load(url, callback) {

  var xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function() {

    if (xhr.readyState == 4) {
      
      if (xhr.status == 200 || xhr.status == 0) {
        
        callback(xhr.responseText);
        
      }
      
    }
    
  };
  
  xhr.open("GET", url, true);
  xhr.send(null);
  
};

//
// PARSING
//
function parse(data) {

  xParser.parse(xObject, data);
  self.postMessage(xObject);
  
}

self.onmessage = function(event) {

  var _data = event.data;
  var extension = _data[0].toUpperCase();
  var stream = _data[1];
   
  xObject = new X.object();

  switch (extension) {

  case 'VTK':
    xParser = new X.parserVTK();
    break;
  case 'TRK':
    xParser = new X.parserTRK();
    break;
  case 'STL':
    xParser = new X.parserSTL();
    break;
  case 'NRRD':
    xObject = new X.volume();
    xParser = new X.parserNRRD();
    break;
  case 'MGH':
    xObject = new X.volume();
    xParser = new X.parserMGZ();
    break;
  case 'MGZ':
    xObject = new X.volume();
    xParser = new X.parserMGZ();
    break;
  case 'CRV':
	xObject = new X.scalars();
	xParser = new X.parserCRW();
  case 'TXT':
	xParser = new X.parserLUT();
	xColorTable = new X.colorTable();
	xParser.parse(this, stream, xColorTable);
	self.postMessage(xColorTable);
	return;
  default:
    xParser = new X.parserFSM();
  }
  if(_data.length > 2 && _data[2] == 'LABELMAP'){
	xObject = new X.labelMap();
  }
  
  // .. start the loading
  // load('skull.vtk', parse);
  parse(stream);
  
};
