VolumeViewerPlugin = {
  name: "Volume Viewer",
  filetypes: ["nrrd"],
  
  setupRenderer: function(div) {

    console.log(div);
    
    renderer = new X.renderer(div);
    renderer.init();
    
    renderer.onShowtime = function() {

      // create GUI
      
      var gui = new dat.GUI();
      var volumegui = gui.addFolder('Volume');
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
        r.render();
      });
      opacityController.onChange(function(value) {

        volume.modified();
        r.render();
      });
      lowerThresholdController.onChange(function(value) {

        volume.modified();
        r.render();
      });
      upperThresholdController.onChange(function(value) {

        volume.modified();
        r.render();
      });
      sliceXController.onChange(function(value) {

        volume.modified();
        r.render();
      });
      sliceYController.onChange(function(value) {

        volume.modified();
        r.render();
      });
      sliceZController.onChange(function(value) {

        volume.modified();
        r.render();
      });
      
    };
    
  },
  
  run: function(div, file) {

    this.setupRenderer(div); // make sure we have a renderer
    this.loadFile(file);
    
  },
  
  loadFile: function(file) {

    console.log('yo', file);
    
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
      
      console.log(message);
    };
    
    reader.onload = (function(file) {

      return function(e) {

        console.log('whatsup');
        
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
          console.log('worker done');
          
          if (!event.data) {
            
            throw new Error('Loading failed.');
            
          }
          
          volume = event.data;
          
          if (typeof volume['_volumeRendering'] != 'undefined') {
            
            // this is a X.volume
            
            volume = new X.volume(volume);
            
          }
          
          console.log(volume);
          

          renderer.add(volume);
          renderer.render();
          
          worker.terminate(); // bye, bye
          
        };
        
      };
      
    })(file);
    
    // Start reading the image off disk into a Data URI format.
    console.log('file', file);
    reader.readAsDataURL(file);
    console.log('file2', file);
    
  }

};



nv_plugins[VolumeViewerPlugin.name] = VolumeViewerPlugin;
