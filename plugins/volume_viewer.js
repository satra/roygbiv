VolumeViewerPlugin = {
    name : "Volume Viewer",
    filetypes : ["nrrd"],

    run: function(div, file){
        console.log("GO"+div+" "+file);
        var r = new X.renderer(div);

        r.config.ORDERING_ENABLED = false;
        r.init();

        var volume = new X.volume();
        volume.load(file);

        r.add(volume)
        r.camera().setPosition(120,80,160);
        r.render();

        r.onShowtime = function() {
          
          //
            // The GUI panel
            //
            // (we need to create this during onShowtime(..) since we do not know the volume
            // dimensions before the loading was completed)
            
            var modelWasLoaded = false;
            
            var gui = new dat.GUI();
            var volumegui = gui.addFolder('Volume');
          // ,, switch between slicing and volume rendering
          var vrController = volumegui.add(volume, '_volumeRendering');
          // .. configure the volume rendering opacity
          var opacityController = volumegui.add(volume, '_opacity', 0,1);
          // .. we can threshold
          var lowerThresholdController = volumegui.add(volume, '_lowerThreshold', volume.scalarRange()[0], volume.scalarRange()[1]);
          var upperThresholdController = volumegui.add(volume, '_upperThreshold', volume.scalarRange()[0], volume.scalarRange()[1]);
            var sliceXController = volumegui.add(volume, '_indexX', 0, volume.dimensions()[0]-1);
            var sliceYController = volumegui.add(volume, '_indexY', 0, volume.dimensions()[1]-1);
            var sliceZController = volumegui.add(volume, '_indexZ', 0, volume.dimensions()[2]-1);
            volumegui.open();
            
          // volumegui callbacks
          vrController.onChange(function(value) {
            
            
            // this setting makes the volume rendering look good
            volume.setOpacity(0.5);
            
            // Iterate over the gui controllers to grab updated values
            for (var i in volumegui.__controllers) {
              volumegui.__controllers[i].updateDisplay();
            }                
            
            volume.modified();
            r.render();
          });
          opacityController.onChange(function(value){
            volume.modified();
            r.render();
          });     
          lowerThresholdController.onChange(function(value){
            volume.modified();
            r.render();
          });
          upperThresholdController.onChange(function(value){
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
        console.log("YY")
    }
    
}

nv_plugins[VolumeViewerPlugin.name] = VolumeViewerPlugin;

