MultiModalViewerPlugin = function () {
  this.init()
  this.xObjs =  {'volumes': [], 'surfaces':[], 'tracks': []};
  
}

MultiModalViewerPlugin.prototype.name = "MultiModal Viewer"

MultiModalViewerPlugin.prototype.input_rules = [{type: 'file', name: 'Volume', filetypes: ['nrrd', 'mgh', 'mgz']}, 
  {type: 'file', name: 'LabelMap', filetypes: ['nrrd', 'mgh', 'mgz']},
  {type: 'file', name: 'ColorMap', filetypes: ['txt']}] /*,
  {type: 'file', name: 'Surface', filetypes: ['fsm']},
  {type: 'file', name: 'Curve', filetypes: ['crv']},
  {type: 'file', name: 'Track', filetypes: ['trk', 'vtk']},  {type: 'text', name:"Transform Matrix"}]*/  
  
MultiModalViewerPlugin.prototype.init = function() {

}

MultiModalViewerPlugin.prototype.setupRenderer = function(div) {
    
    this.renderer = new X.renderer(div);
    this.renderer.init();

    this.gui = new dat.GUI();

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
        ren.render();
      });
      labelMapOpacityController.onChange(function(value) {
        volume.labelMap().modified();
        ren.render();
      });
	}
	/*
	function addTrack(trackgui, track){
	   var trackVisibleController = trackgui.add(track, '_visible');
       var trackLengthThresholdController = trackgui.add(track.scalars(),
           '_minThreshold', track.scalars().min(), track.scalars().max());
       trackgui.open();
	   
	   
	   // trackgui callbacks
       trackVisibleController.onChange(function(value) {
         ren.render();
       });
       trackLengthThresholdController.onChange(function(value) {
		//Why is this necessary, i'm not sure
		
  	    for(var i=0; i<this.xObjs[volumes].length;i++){ 
			this.xObjs[volumes][i].modified();
		 }
         ren.render();
       });
	}	
	function addSurface(surfacegui, surface, surfacename){  	   
      var surgui = surfacegui.addFolder(surfacename);
      var surVisibleController = surgui.add(surface, '_visible');
      var surOpacityController = surgui.add(surface, '_opacity', 0, 1);
      var surColorController = lhgui.addColor(surface, '_color');
      surgui.open();

      // meshesgui callbacks
      surVisibleController.onChange(function(value) {
        ren.render();
      });
      
      surOpacityController.onChange(function(value) {
        ren.render();
      });
      
      surColorController.onChange(function(value) {
        ren.render();
      });
	  
	}
	
	
	//--Find more stuff laters, need to add a surface -> [curves,] map
	function addCurv(surfacegui,surface, curve, curveName, curveTypes){
	  var curvgui = surfacegui.addFolder('Curvature');
	  if(curveTypes.length > 1){
		var _loader = function() {this[curveName] = curveTypes[0]; }
		var curvtypeController = curvgui.add(_loader, curveName, curvatureTypes);
		  
		curtypeController.onChange(function(value) {
			var _index = curvatureTypes.indexOf(value);
			
			// we need to buffer the (maybe changed) colors
			// else wise we would start with the default red<->green mapping
			var oldMinColor = surface.scalars().colorRange()[0];
			var oldMaxColor = surface.scalars().colorRange()[1];
			
			surface.setScalars(curvatureFiles[_index]);
			surface.modified();
			
			surface.scalars().setColorRange(oldMinColor, oldMaxColor);
			
			// this render call will trigger the onShowtime function again to re-create the GUI
			ren.render();
        
		});
      
	  }
	  var curvminColorController = curvgui.addColor(curve.scalars(), '_minColor');
	  var curvmaxColorController = curvgui.addColor(curve.scalars(), '_maxColor');
	  var curvminThresholdController = curvgui.add(curve.scalars(),
		  '_minThreshold', curve.scalars().min(), curve.scalars().max());
	  var curvmaxThresholdController = curvgui.add(curve.scalars(),
		  '_maxThreshold', curve.scalars().min(), curve.scalars().max());
	  curvgui.open();
		  
	  //
      // Change the curvature type callback
      //

      curminColorController.onChange(function(value) {

        ren.render();
      });
      
      curmaxColorController.onChange(function(value) {

        ren.render();
      });
      
      curminThresholdController.onChange(function(value) {

        ren.render();
      });
      
      curmaxThresholdController.onChange(function(value) {

        ren.render();
      });
		  
		  
		  
		  
		  
		  
		  
	}
	
	*/
	
	function addSection(gui, addFunc, name){
	  var sectiongui = gui.addFolder(name);
	  sectiongui.open();
	  if(this.xObjs[name].length == 1){
		addFunc(sectiongui, xObjs[name][1]);
	  }else{
		for(var i=0; i< this.xObjs[name].length; i++){
			var innervgui = sectiongui.addFolder(name+i);
			addFunc(innervgui, this.xObjs[name][i]);
		}
      }
	}
	
	
	
    this.renderer.onShowtime = function() {

      // create GUI
      addSection(_this.gui, addVolume, 'volumes');
	  //addSection(_this.gui, addTrack, 'tracks');
	  //addSection(_this.gui, addSurface, 'surfaces');
	  
	  
	  //Add curvs ?!
    };

   

}

MultiModalViewerPlugin.prototype.run = function(div, inputs) {
  this.inputs = inputs
  this.setupRenderer(div); // make sure we have a renderer
  this.loadFiles(this.inputs);

}

MultiModalViewerPlugin.prototype.loadFiles = function(files) {
  var types = ['volume', 'labelMap', 'colorTable'];
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
			_this.renderer.add(volume);
			
		}else if(i == 1){
			output = new X.labelMap(output);
			_this.xObjs['volume'][0].labelMap() = output;
		}else{
			_this.xObjs['volume'][0].labelMap().setColorTable(output);
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

MultiModalViewerPlugin.prototype.serialize = function() {
  var serial_obj = {}
  return serial_obj
}

MultiModalViewerPlugin.prototype.load = function(load_obj) {

}

nv_plugins[MultiModalViewerPlugin.prototype.name] = MultiModalViewerPlugin;
