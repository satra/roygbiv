VolumeViewerPluginMultiple = function () {
  this.init()
}

VolumeViewerPluginMultiple.prototype.name = "Volume Viewer Multiple"

VolumeViewerPluginMultiple.prototype.input_rules = [{type: 'file', name: 'Data File 1', filetypes: ['nrrd']}, 
  {type: 'file', name: 'Data File 2', filetypes: ['nrrd']},
  {type: 'file', name: 'Data File 3', filetypes: ['nrrd']},
  {type: 'file', name: 'Data File 4', filetypes: ['nrrd']}]

VolumeViewerPluginMultiple.prototype.init = function() {

}

VolumeViewerPluginMultiple.prototype.setupRenderer = function(div) {
    
    this.renderer = new X.renderer(div);
    this.renderer.init();

    this.gui = new dat.GUI();

    var _this = this
    
    this.renderer.onShowtime = function() {

      // create GUI
      
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

VolumeViewerPluginMultiple.prototype.run = function(div, inputs) {
  this.inputs = inputs
  this.setupRenderer(div); // make sure we have a renderer
  this.loadFile(this.inputs);

}

VolumeViewerPluginMultiple.prototype.loadFile = function(file) {

  
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
      
      var worker = new Worker('plugins/X.bootstrap.js');
      worker.postMessage([fileExtension, data]); // start the worker
      
      worker.onmessage = function(event) {

        // callback for: worker is done
        
        if (!event.data) {
          throw new Error('Loading failed.');
        }
        
        volume = event.data;
        
        if (typeof volume['_volumeRendering'] != 'undefined') {
          
          // this is a X.volume
          
          volume = new X.volume(volume);
          
        }
        
        
        _this.renderer.onShowtime();

        _this.renderer.add(volume);
        _this.renderer.render();
        
        worker.terminate(); // bye, bye
        
      };
      
    };
    
  })(file[0]);
  
  // Start reading the image off disk into a Data URI format.
  reader.readAsDataURL(file[0]);
}

VolumeViewerPluginMultiple.prototype.serialize = function() {
  var serial_obj = {}
  return serial_obj
}

VolumeViewerPluginMultiple.prototype.load = function(load_obj) {

}

nv_plugins[VolumeViewerPluginMultiple.prototype.name] = VolumeViewerPluginMultiple;
