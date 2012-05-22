MultiModalViewerPlugin = function () {
  this.init()
  this.xObjs =  {'volumes': [], 'surfaces':[], 'tracks': []};
}

/*
    Volumes:
		{name: "Name?", volume: XTK obj} || XTK volume
    
	Tracks
		{name: "Name", track: XTK obj} || XTK track
    
	Surfaces:
		surface || {name: "Surface name", surface: XTK surface Obj, 
					curves: {"curveType": "curveFile"}, 
					curveTypes: ["curveTypes",], loader: loader object};

*/



MultiModalViewerPlugin.prototype.name = "MultiModal Viewer"

MultiModalViewerPlugin.prototype.input_rules = 
[ {type: 'text', name: 'Volume', filetypes: ['nrrd', 'mgh', 'mgz'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/orig.mgh"}, 
  {type: 'text', name: 'LabelMap', filetypes: ['nrrd', 'mgh', 'mgz'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/aseg.mgh"},
  {type: 'text', name: 'ColorMap', filetypes: ['txt'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/FreeSurferColorLUT.txt"},
  {type: 'text', name: "Surface 1 Name", initial: "lh"},
  {type: 'text', name: 'Surface 1', filetypes: ['fsm'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/lh.smoothwm.fsm"},
  {type: 'text', name: "Surface 1 - Curve 1  Name", initial: "C"},
  {type: 'text', name: 'Surface 1 - Curve 1', filetypes: ['crv'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/lh.smoothwm.C.crv"},
  {type: 'text', name: "Surface 1 - Curve 2 Name", initial: "H"},
  {type: 'text', name: 'Surface 1 - Curve 2', filetypes: ['crv'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/lh.smoothwm.H.crv"},
  {type: 'text', name: "Surface 1 - Curve 3 Name", initial: "K1"},
  {type: 'text', name: 'Surface 1 - Curve 3', filetypes: ['crv'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/lh.smoothwm.K1.crv"},
  {type: 'text', name: "Surface 2 Name", initial: "rh"},
  {type: 'text', name: 'Surface 2', filetypes: ['fsm'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/rh.smoothwm.fsm"},
  {type: 'text', name: "Surface 2 - Curve 1 Name", initial: "C"},
  {type: 'text', name: 'Surface 2 - Curve 1', filetypes: ['crv'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/rh.smoothwm.C.crv"},
  {type: 'text', name: "Surface 2 - Curve 2 Name", initial: "H"},
  {type: 'text', name: 'Surface 2 - Curve 2', filetypes: ['crv'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/rh.smoothwm.H.crv"},
  {type: 'text', name: "Surface 2 - Curve 3 Name", initial: "K1"},
  {type: 'text', name: 'Surface 2 - Curve 3', filetypes: ['crv'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/rh.smoothwm.K1.crv"},
  {type: 'text', name: 'Track', filetypes: ['trk', 'vtk'], initial: "http://web.mit.edu/willcu/www/roygbiv/teenage/brainfibers.trk"},  
  {type: 'text', name: "Transform Matrix", 
  initial: "[[ -1.96000,    0.00000 ,   0.00000 , 110.00000 ]"+
  ",[0.00000 ,   0.00000  ,  -2.0000 , 76.00000 ]"+
  ",[0.00000 ,  -1.9600  ,  0.00000,  110.00000 ]"+
  ",[0.00000  ,  0.00000 ,   0.00000 ,   1.00000 ]]"} ]
	
	//Switch Transform matrix to textarea with 4 rows for better look
	//Create new custom type for volumes, surfaces, tracks so processing can be cleaner
	
	
	
MultiModalViewerPlugin.prototype.init = function() {

}

MultiModalViewerPlugin.prototype.destroy = function(){
	this.gui.destroy();
}


MultiModalViewerPlugin.prototype.setupRenderer = function(div) {
    
    this.renderer = new X.renderer(div);
    this.renderer.init();

    

    var _this = this
    
	function addVolume(volumegui, volume){
	  var vrController = volumegui.add(volume, '_volumeRendering');
      
	  // .. configure the volume rendering opacity
      var opacityController = volumegui.add(volume, '_opacity', 0, 1);
      // .. we can threshold
      var lowerThresholdController = volumegui.add(volume, '_lowerThreshold',
          volume.scalarRange()[0], volume.scalarRange()[1]);
      var upperThresholdController = volumegui.add(volume, '_upperThreshold',
          volume.scalarRange()[0], volume.scalarRange()[1]);
      var sliceXController = volumegui.add(volume, '_indexX', 0, volume
          .dimensions()[0] - 1);
      var sliceYController = volumegui.add(volume, '_indexY', 0, volume
          .dimensions()[1] - 1);
      var sliceZController = volumegui.add(volume, '_indexZ', 0, volume
          .dimensions()[2] - 1);
		  
      var labelmapgui = volumegui.addFolder('Label Map');
      var labelMapVisibleController = labelmapgui.add(volume.labelMap(),
          '_visible');
      var labelMapOpacityController = labelmapgui.add(volume.labelMap(),
          '_opacity', 0, 1);
      labelmapgui.open();
  
      // volumegui callbacks
      vrController.onChange(function(value) {

        
        // this setting makes the volume rendering look good
        volume.setOpacity(0.5);
        
        // Iterate over the gui controllers to grab updated values
        for ( var i in volumegui.__controllers) {
          volumegui.__controllers[i].updateDisplay();
        }
        
        volume.modified();
        _this.renderer.render();
      });
      opacityController.onChange(function(value) {

        volume.modified();
        _this.renderer.render();
      });
      lowerThresholdController.onChange(function(value) {

        volume.modified();
        _this.renderer.render();
      });
      upperThresholdController.onChange(function(value) {

        volume.modified();
        _this.renderer.render();
      });
      sliceXController.onChange(function(value) {

        volume.modified();
        _this.renderer.render();
      });
      sliceYController.onChange(function(value) {

        volume.modified();
        _this.renderer.render();
      });
      sliceZController.onChange(function(value) {
        volume.modified();
        _this.renderer.render();
      });	
	
	  //labelmap callbacks
	  labelMapVisibleController.onChange(function(value) {
        volume.labelMap().modified();
        _this.renderer.render();
      });
      labelMapOpacityController.onChange(function(value) {
        volume.labelMap().modified();
        _this.renderer.render();
      });
	}
	
	function addTrack(trackgui, track){
	   var trackVisibleController = trackgui.add(track, '_visible');
       var trackLengthThresholdController = trackgui.add(track.scalars(),
           '_minThreshold', track.scalars().min(), track.scalars().max());
       trackgui.open();
	   
	   
	   // trackgui callbacks
       trackVisibleController.onChange(function(value) {
          _this.renderer.render();
       });
       trackLengthThresholdController.onChange(function(value) {
		//Why this is necessary, i'm not sure
		
  	    for(var i=0; i<_this.xObjs["volumes"].length;i++){ 
			_this.xObjs["volumes"][i].modified();
		 }
          _this.renderer.render();
       });
	}
    	
	function addSurface(surfacegui, surfaceObj){	
	  console.log("surface UI");
	  console.log(surfaceObj);
	  var surface = surfaceObj.surface;
      var surgui = surfacegui.addFolder(surfaceObj.name);
      var surVisibleController = surgui.add(surface, '_visible');
      var surOpacityController = surgui.add(surface, '_opacity', 0, 1);
      var surColorController = surgui.addColor(surface, '_color');
      surgui.open();

      // meshesgui callbacks
      surVisibleController.onChange(function(value) {
        _this.renderer.render();
      });
      
      surOpacityController.onChange(function(value) {
        _this.renderer.render();
      });
      
      surColorController.onChange(function(value) {
        _this.renderer.render();
      });
	  
		
	  if(surfaceObj.curves != undefined){
			addCurv(surgui, surfaceObj.surface, surfaceObj);
	  }
	}
	
	
	//CurveTypes == CurveNAmes
	//Files -> XTK obj 
	
	//surface == xtk surface, surfaceObj is the surface included in xObjs
	function addCurv(surfacegui,surface, surfaceObj){
	  var curvgui = surfacegui.addFolder('Curvature');
	  console.log(surfaceObj);
	  var curve = surfaceObj.curves[surfaceObj["curveTypes"][0]]
	  var curvNames = surfaceObj["curveTypes"]
	  if(curvNames.length > 1){
		console.log("add loader");
		console.log(surfaceObj);   
		var curvtypeController = curvgui.add(surfaceObj.loader, surfaceObj.name, curvNames);
		console.log("curve gui add loader");
		console.log(surfaceObj.name);
	    console.log(curvNames);
		curvtypeController.onChange(function(value) {
			//var _index = curvNames.indexOf(value);
			
			// we need to buffer the (maybe changed) colors
			// else wise we would start with the default red<->green mapping
			var oldMinColor = surface.scalars().colorRange()[0];
			var oldMaxColor = surface.scalars().colorRange()[1];
			console.log("change value");
			console.log(value);
			surface.setScalars(surfaceObj.curves[value]);
			surface.modified();
			
			surface.scalars().setColorRange(oldMinColor, oldMaxColor);
			
			// this render call will trigger the onShowtime function again to re-create the GUI
			_this.renderer.render();
        
		});
      
	  }else{console.log("if statement error"); console.log(surfaceObj);}
	  var curvminColorController = curvgui.addColor(surface.scalars(), '_minColor');
	  var curvmaxColorController = curvgui.addColor(surface.scalars(), '_maxColor');
	  var curvminThresholdController = curvgui.add(surface.scalars(),
		  '_minThreshold', surface.scalars().min(), surface.scalars().max());
	  var curvmaxThresholdController = curvgui.add(surface.scalars(),
		  '_maxThreshold', surface.scalars().min(), surface.scalars().max());
	  curvgui.open();
		  
	  //
      // Change the curvature type callback
      //

      curvminColorController.onChange(function(value) {

        _this.renderer.render();
      });
      
      curvmaxColorController.onChange(function(value) {

        _this.renderer.render();
      });
      
      curvminThresholdController.onChange(function(value) {

        _this.renderer.render();
      });
      
      curvmaxThresholdController.onChange(function(value) {

        _this.renderer.render();
      });
		  
		  
		  
		  
		  
		  
		  
	}
	
	
	
	function addSection(gui, addFunc, name, _this){
	  console.log("add "+name);
	  var sectiongui = gui.addFolder(name);
	  sectiongui.open();
	  if(_this.xObjs[name].length == 1){
		addFunc(sectiongui, _this.xObjs[name][0]);
	  }else{
	    console.log("surfaces should go here");	
		for(var i=0; i< _this.xObjs[name].length; i++){
			addFunc(sectiongui, _this.xObjs[name][i]);
		}
      }
	  console.log("add section done");
	}
	
	
	
    this.renderer.onShowtime = function() {
	  if(_this.gui != undefined){
		_this.gui.destroy();
	  }else{
		_this.flipVolume(); //Teenage Demo flips volume, in the future add a checkbox to determine if it needs to be fliped
		_this.xObjs["tracks"][0].scalars()['_minThreshold'] = 20; //Probabaly want to make this an input, until then.
		_this.renderer.resetBoundingBox();
	  }
	  _this.gui = new dat.GUI();
      // create GUI
      addSection(_this.gui, addVolume, 'volumes', _this);
	  console.log("add surface gui")
	  addSection(_this.gui, addSurface, 'surfaces', _this);
	  addSection(_this.gui, addTrack, 'tracks', _this);
	  
	  
    };

   

}

MultiModalViewerPlugin.prototype.run = function(div, inputs) {
  console.log(inputs);
  this.inputs = inputs
  this.setupRenderer(div); // make sure we have a renderer
  this.loadVolume(this.inputs.slice(0,3));
  this.loadSurface(this.inputs.slice(3,11));
  this.loadSurface(this.inputs.slice(11,19));
  this.loadTracks(this.inputs.slice(19));
  this.renderer.camera().setPosition(120,80,160); //Settings found in teenage brain demo, will allow inputs that determine this later
  this.renderer.camera().setUp(0,-1,0); //No idea what this means.
  this.renderer.render();

}

MultiModalViewerPlugin.prototype.loadVolume = function(files){
	console.log("volume");
	console.log(files);
	var volume; var labelMap; var colorTable; var hasLabelMap;
	var volume = new X.volume(); //IDEA Pass volume object to parsers instead of getting one back
	if(typeof files[0] == 'string'){
		volume = new X.volume();
		volume.load(files[0]);
	}else{
		volume = this.readFile(files[0]);
		console.log(volume);
	}
	if(files[1] == ""){
		hasLabelMap = false;
	}else if(typeof files[1] == 'string'){
		labelMap = volume.labelMap()
		labelMap.load(files[1])
		hasLabelMap = true;
	}else{
		labelMap = readFileLabelMap(files[1], volume.labelMap());
		hasLabelMap = true;
	}	
	if(hasLabelMap){
		if(typeof files[2] == 'string' && files[2] != ""){
			volume.labelMap().setColorTable(files[2]);
		}else if(files[2] != ""){
		}else{
			readFileColorTable(files[2], volume.labelMap());
		}
	}
	this.xObjs['volumes'].push(volume);
	this.renderer.add(volume);
}


MultiModalViewerPlugin.prototype.loadSurface = function(files){
	console.log(files)
	var surfaceObj = new Object();
	surfaceObj["name"] = files[0];
	surfaceObj["surface"] = new X.object();
	if(typeof files[1] == "string"){
		surfaceObj["surface"].load(files[1]);
	}else{
		//Do local File Support Here
	}
	var curveData = files.slice(2);
	console.log(curveData);
	if(curveData.length >= 2){
		surfaceObj["curves"] = new Object();
		surfaceObj["curveTypes"] = new Array();
		for(var i=0; i<curveData.length; i=i+2){
			if(typeof curveData[i+1] == "string"){
				surfaceObj["curves"][curveData[i]] = curveData[i+1];
				surfaceObj["curveTypes"].push(curveData[i])
			}else{
				//Local File Support Goes here
			}
		}	
	}
	
	surfaceObj["surface"].transform().rotateY(90);
    if(surfaceObj.curves != undefined){
    	//There potentially could be ordering errors since Object.keys isn't deterministic
		surfaceObj["surface"].setScalars(surfaceObj["curves"][surfaceObj["curveTypes"][0]]);
		var Loader = function() {
			// default type
			this[surfaceObj.name] = surfaceObj["curveTypes"][0]; 
		}
		surfaceObj["loader"]  = new Loader();
	}
	surfaceObj["surface"].setOpacity(0.7);
	this.xObjs["surfaces"].push(surfaceObj);
    this.renderer.add(surfaceObj["surface"]);

}




MultiModalViewerPlugin.prototype.loadTracks = function(files){
	console.log("tracks");
	console.log(files);
	var tracks = new X.object();
	if(typeof files[0] == 'string'){
		tracks.load(files[0]);
	}else{
		//Local file handling here.
	}
	var matrix = eval(files[1]); //Security-wise this is crazy. But there isn't any cookies, secure content to steal so it's okay for now.
	var transMatrix = new X.matrix(matrix);
	tracks.transform().setMatrix(transMatrix);
	
	this.xObjs["tracks"].push(tracks);
	this.renderer.add(tracks);

	
}


MultiModalViewerPlugin.prototype.flipVolume=function(){
	for(var i=0;i<this.xObjs['volumes'].length;i++){
		var volume = this.xObjs['volumes'][i];
		for (c in volume.children()) {
          for (d in volume.children()[c].children()) {
            volume.children()[c].children()[d].transform().flipX();           
            for (b in volume.children()[c].children()[d].children()) {
              volume.children()[c].children()[d].children()[b].transform().flipX();
            }            
          }
        }
	}
}

/*
MultiModalViewerPlugin.prototype.loadFiles = function(files) {
  var types = ['volume', 'labelMap', 'colorTable'];
  if(typeof files[0] == 'string' && typeof files[1] == 'string' && typeof files[2] == 'string'){
	var volume = new X.volume();
	volume.load(files[0]);
	volume.labelMap().load(files[1]);
	volume.labelMap().setColorTable(files[2]);
	this.xObjs['volumes'].push(volume);
	this.renderer.add(volume);
	this.renderer.render();
	
	
  }
  
  
  for(var i=0; i<files.length;i++){
	var reader = new FileReader();
	
	// Handle errors that might occur while reading the file (before upload).
	reader.onerror = function(evt) {

    var message = 'Error';
    
    // REF: http://www.w3.org/TR/FileAPI/#ErrorDescriptions
    switch (evt.target.error.code) {
    case 1:
      message = file.name + " not found.";
      break;
    
    case 2:
      message = file.name + " has changed on disk, please re-try.";
      break;
    
    case 3:
      messsage = "Upload cancelled.";
      break;
    
    case 4:
      message = "Cannot read " + file.name + ".";
      break;
    
    case 5:
      message = "File too large for browser to upload.";
      break;
    }
    
  };

    var _this = this; 
	reader.onload = (function(file) {

    return function(e) {

      
      var data = e.target.result;
      
      var base64StartIndex = data.indexOf(',') + 1;
      
      //
      //
      //
      file = file.name;
      data = window.atob(data.substring(base64StartIndex));
      
      var fileExtension = file.split('.')[1];
      
	  output = this.parse(fileExtension, data);
	  
	  
      var worker = new Worker('plugins/X.bootstrap-extended.js');
      worker.postMessage([fileExtension, data]); // start the worker
      
      worker.onmessage = function(event) {

        // callback for: worker is done
        
        if (!event.data) {
          throw new Error('Loading failed.');
        }
        
        output = event.data;
        if(i == 0){
			output = new X.volume(output);
			_this.xObjs['volume'].push(output);
			
			
		}else if(i == 1){
			output = new X.labelMap(output);
			_this.xObjs['volume'][0].labelMap() = output;
		}else{
			_this.xObjs['volume'][0].labelMap().setColorTable(output);
			_this.renderer.add(volume);
			_this.renderer.onShowtime();
            _this.renderer.render();
        
		}
        worker.terminate(); // bye, bye
        
      };
      
    };
    
  })(files[i])
	reader.readAsDataURL(files[i]);
  }
  
  
  
  
  
}
*/

MultiModalViewerPlugin.prototype.readFile = function(file){
	var reader = new FileReader();
	  
	// Handle errors that might occur while reading the file (before upload).
	reader.onerror = function(evt) {

		var message = 'Error';
		
		// REF: http://www.w3.org/TR/FileAPI/#ErrorDescriptions
		switch (evt.target.error.code) {
		case 1:
		  message = file.name + " not found.";
		  break;
		
		case 2:
		  message = file.name + " has changed on disk, please re-try.";
		  break;
		
		case 3:
		  messsage = "Upload cancelled.";
		  break;
		
		case 4:
		  message = "Cannot read " + file.name + ".";
		  break;
		
		case 5:
		  message = "File too large for browser to upload.";
		  break;
		}
		
	  };

	var _this = this;
	var output;
	reader.onload = (function(file) {

    return function(e) {
		var data = e.target.result;
		  
		var base64StartIndex = data.indexOf(',') + 1;

		var extension = file.name.split('.')[1];
		var extension = extension.toUpperCase();
		data = window.atob(data.substring(base64StartIndex));
		output = _this.parse(extension, data) //Store XObject in _this.output
		};
	})(file);
	
	reader.onloadend = function(e){
		console.log(e);
	}
	
	
	// Start reading the image off disk into a Data URI format.
	reader.readAsDataURL(file);
	return output;
}

MultiModalViewerPlugin.prototype.parse = function(extension, stream) {
  xObject = new X.object();
  console.log(extension);
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
  default:
    xParser = new X.parserFSM();
  }
  
  xParser.parse(xObject, stream);
  console.log("parse");
  console.log(xObject);
  return xObject;
}

MultiModalViewerPlugin.prototype.readFileLabelMap = function(file, labelMap){
	var reader = new FileReader();
	  
	// Handle errors that might occur while reading the file (before upload).
	reader.onerror = function(evt) {

		var message = 'Error';
		
		// REF: http://www.w3.org/TR/FileAPI/#ErrorDescriptions
		switch (evt.target.error.code) {
		case 1:
		  message = file.name + " not found.";
		  break;
		
		case 2:
		  message = file.name + " has changed on disk, please re-try.";
		  break;
		
		case 3:
		  messsage = "Upload cancelled.";
		  break;
		
		case 4:
		  message = "Cannot read " + file.name + ".";
		  break;
		
		case 5:
		  message = "File too large for browser to upload.";
		  break;
		}
		
	  };

	var _this = this;
	
	reader.onload = (function(file) {

    return function(e) {
		var data = e.target.result;		  
		var base64StartIndex = data.indexOf(',') + 1;
		var extension = file.name.split('.')[1];
		var extension = extension.toUpperCase();
		data = window.atob(data.substring(base64StartIndex));
		_this.output = _this.parseLabelMap(extension, data, labelMap) //Store XObject in _this.output
		};
	})(file);
	
	// Start reading the image off disk into a Data URI format.
	reader.readAsDataURL(file);

	return _this.output;
}

MultiModalViewerPlugin.prototype.parseLabelMap = function(extension, stream, labelMap){
  xObject = labelMap;

  switch (extension) {
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
	return;
  }
  xParser.parse(xObject, stream);
  return xObject;

}

MultiModalViewerPlugin.prototype.readFileColorTable = function(file,labelMap){
	var reader = new FileReader();
	  
	// Handle errors that might occur while reading the file (before upload).
	reader.onerror = function(evt) {

		var message = 'Error';
		
		// REF: http://www.w3.org/TR/FileAPI/#ErrorDescriptions
		switch (evt.target.error.code) {
		case 1:
		  message = file.name + " not found.";
		  break;
		
		case 2:
		  message = file.name + " has changed on disk, please re-try.";
		  break;
		
		case 3:
		  messsage = "Upload cancelled.";
		  break;
		
		case 4:
		  message = "Cannot read " + file.name + ".";
		  break;
		
		case 5:
		  message = "File too large for browser to upload.";
		  break;
		}
		
	  };

	var _this = this;
	
	reader.onload = (function(file) {

    return function(e) {
		var data = e.target.result;		  
		var base64StartIndex = data.indexOf(',') + 1;
		var extension = file.name.split('.')[1];
		var extension = extension.toUpperCase();
		data = window.atob(data.substring(base64StartIndex));
		_this.output = _this.parseColorTable(extension, data,labelMap) //Store XObject in _this.output
		};
	})(file);
	
	// Start reading the image off disk into a Data URI format.
	reader.readAsDataURL(file);

	return _this.output;
}

MultiModalViewerPlugin.prototype.parseColorTable = function(extension, data, labelMap){
	switch(extension){
	  case 'TXT':
		xParser = new X.parserLUT();
		xColorTable = labelMap.colorTable;
		xParser.parse(labelMap, data, xColorTable);
		return labelMap;
	  default:
		
	}
}

MultiModalViewerPlugin.prototype.serialize = function() {
  return this.inputs;
}

MultiModalViewerPlugin.prototype.load = function(load_obj) {
	//pass don't need to do anything;
}

nv_plugins[MultiModalViewerPlugin.prototype.name] = MultiModalViewerPlugin;
