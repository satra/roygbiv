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


function getParser(extension){
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
    xParser = new X.parserNRRD();
    break;
  case 'MGH':
    xParser = new X.parserMGZ();
    break;
  case 'MGZ':
    xParser = new X.parserMGZ();
    break;
  default:
    xParser = new X.parserFSM();
  }
  return xParser;
}

function simpleLoad(extension, stream){
  
  xObject = new X.object();

  switch (extension) {
  case 'NRRD':
    xObject = new X.volume();
    break;
  case 'MGH':
    xObject = new X.volume();
    break;
  case 'MGZ':
    xObject = new X.volume();
    break;
  }
  
  xParser = getParser(extension);
  xParser.parse(xObject, data);
  self.postMessage(xObject);
  //parse(stream);
}




// Order of data Volume, LabelMap, ColorMap
// data ['filetype', file || url, 'filetype', file || url, 'url of colormap'] 
function volumeLoad(data){
	xVolume = new X.volume();
	xLabelMap = xVolume.labelMap();
	
	if(data[0].toUpperCase() == 'URL'){
		xVolume.load(data[1]);
	}else{
		xVParser = getParser(data[0].toUpperCase());
		xVParser.parse(xVolume,data[1]);
	}
	
	if(data[1].toUpperCase() == 'URL'){
		xLabelMap.load(data[2]);
	}else{
		xLParser = getParser(data[2].toUpperCase());
		xLParser.parse(xLabelMap, data[3]);
	
	}
	xLabelMap.setColorTable(data[4]);
	self.postMessage(xVolume);
}





self.onmessage = function(event) {

  var _data = event.data;
  var type = _data[0].toLowerCase();
  switch(type){
    switch "volume":
		volumeLoad(_data.slice(1, _data.length);
		break;
	default: 
		simpleLoad(_data[1].toUpperCase(), _data[2]);
		break;
  }
    
};
