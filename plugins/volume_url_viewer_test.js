VolumeURLViewerPlugin = function () {
  this.init()
  
}

VolumeURLViewerPlugin.prototype.name = "Volume URL Viewer"

VolumeURLViewerPlugin.prototype.input_rules = [{type: 'file-url', name: 'Data File', filetypes: ['nrrd','mgh', 'mgz']}]

VolumeURLViewerPlugin.prototype.init = function() {

}

VolumeURLViewerPlugin.prototype.setupRenderer = function(div) {
    
    this.renderer = new X.renderer(div);
    this.renderer.init();
 
    var _this = this
   	
    this.renderer.onShowtime = function() {
	  _this.gui = new dat.GUI();
	  
	  var volumegui = _this.gui.addFolder('Volume');
      // ,, switch between slicing and volume rendering
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
      volumegui.open();
      
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
      
    };

   

}

VolumeURLViewerPlugin.prototype.run = function(div, inputs) {
  this.inputs = inputs
  this.setupRenderer(div); // make sure we have a renderer
  this.loadFile(this.inputs[0]);

}

VolumeURLViewerPlugin.prototype.loadFile = function(file) {
   console.log(file);
  if(typeof file == 'string'){
	  volume = new X.volume();
	  volume.load(file);
	  this.renderer.add(volume);
	  this.renderer.render();
	  //this.renderer.onShowtime();
	  this.volume = volume;
	  	  
  }else{
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
		  var extension = file.name.split('.')[1];
		  var extension = extension.toUpperCase();
		  data = window.atob(data.substring(base64StartIndex));
		  volume = _this.parse(extension, data)
		  console.log(volume)
		  _this.renderer.add(volume);
		  _this.renderer.render();
		  _this.renderer.onShowtime();
		  _this.volume = volume;
		 
		  
		};
		
	  })(file);
	  
	  // Start reading the image off disk into a Data URI format.
	  reader.readAsDataURL(file);
  }
}

VolumeURLViewerPlugin.prototype.parse = function(extension, data){
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
  case 'TXT':
	xObject = new X.labelMap();
	xParser = new X.parserLUT();
	xColorTable = xObject.colorTable;
	xParser.parse(xObject, stream, xColorTable);
	return xObject;
  default:
    xParser = new X.parserFSM();
  }
  
  xParser.parse(xObject, data);
  return xObject;
}





VolumeURLViewerPlugin.prototype.serialize = function() {
  var serial_obj = {}
  if(this.volume.file() != null){
	serial_obj['volume'] = [this.volume.file().path]
  }
  return serial_obj
}

VolumeURLViewerPlugin.prototype.destroy = function(){
	//this.renderer.destroy();
	this.gui.destroy();
	
}

VolumeURLViewerPlugin.prototype.load = function(load_obj) {
	if(load_obj.hasOwnProperty("volume")){
		this.volume = new X.volume();
		this.volume.load(load_obj['volume']);
	}
}

VolumeURLViewerPlugin.prototype.destroy = function(){
	this.gui.destroy();
}


nv_plugins[VolumeURLViewerPlugin.prototype.name] = VolumeURLViewerPlugin;
