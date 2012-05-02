var NV_Window = function(div) {

  // div is the name of the div for the window
  this.init(div)
}

NV_Window.prototype = {
  
  constructor: NV_Window,
  
  init: function(div) {

    this.div_name = div
    this.div = jQuery("#" + this.div_name);
    this.renderer = null
  },
  
  run_setup: function() {

    var tbg = "<form class='form-horizontal'><div class='control-group'><label class='control-label' for='select01'>Viewer: </label>"
    tbg += "<div class='controls'>"
    tbg += "<select id='select_" + this.div_name + "'>"
    for (plugin in nv_plugins) {
      tbg += "<option>" + nv_plugins[plugin].name + "</option>";
    }
    tbg += "</select></div></div>"
    tbg += "<div class='control-group'>"
    tbg += "<label class='control-label' for='file_input'>File:</label>"
    tbg += "<div class='controls'>"
    tbg += "<input id='file_" + this.div_name +
        "' type='file' name='file' /></div></div>"
    tbg += "</form>"
    this.div.html(tbg);
    this.div.append("<button id='" + this.div_name +
        "_button' class='btn btn-primary' type='button'>Start</button>");
    var temp_button = jQuery("#" + this.div_name + "_button");
    var file_button = jQuery("#file_" + this.div_name);
    var _this = this;
    file_button.change(function(evt) {

      var plugin = jQuery("#select_" + _this.div_name).attr('value');
      var files = evt.target.files;
      _this.div.html("")
      _this.div.css({
        'background-color': 'black'
      })
      _this.run_plugin(_this.div_name, plugin, files[0])

    });
    temp_button.click(function() {

      var plugin = jQuery("#select_" + _this.div_name).attr('value');
      var file = jQuery("#file_" + _this.div_name).attr('value').replace(
          /^.*[\\\/]/, '');
      _this.div.html("")
      _this.div.css({
        'background-color': 'black'
      })
      _this.run_plugin(_this.div_name, plugin, file)
    });
    
  },
  
  run_plugin: function(div, plugin, file) {

    nv_plugins[plugin].run(div, file);
  }
};


jQuery(window).load(function() {

  set_sizes();
  make_window_grid(1, 1)
});

function set_sizes() {

  jQuery("#container").height(
      jQuery(window).height() - jQuery(".navbar").height())
}

function make_window_grid(n_rows, n_cols) {

  jQuery("#container").html(""); // clear container html
  
  var c_width = jQuery("#container").width()
  var c_height = jQuery("#container").height()

  var container = jQuery("#container")

  for ( var i = 0; i < n_rows; i++) {
    for ( var j = 0; j < n_cols; j++) {
      
      jQuery('<div/>', {
        'id': 'r_' + i + '_' + j
      }).appendTo("#container")

      var thisDiv = jQuery('#r_' + i + '_' + j)

      thisDiv.css({
        'position': 'absolute',
        'left': Math.round(c_width / n_cols * j) + 'px',
        'top': jQuery(".navbar").height() + Math.round(c_height / n_rows * i) +
            'px',
        'height': (Math.round(c_height / n_rows * (i + 1)) - Math
            .round(c_height / n_rows * i)) +
            'px',
        'width': (Math.round(c_width / n_cols * (j + 1)) - Math.round(c_width /
            n_cols * j)) +
            'px',
        'border': '1px #ddd solid',
      })



      var temp_window = new NV_Window('r_' + i + '_' + j);
      temp_window.run_setup();
    }
  }
}



var nv_r, nv_cube;
function run() {

  nv_r = new X.renderer('r');
  nv_r.init();
  
  // create some CSG primitives.. this is by the way an official example of CSG
  nv_cube = new X.cube([0, 0, 0], 10, 10, 10);
  nv_cube.setColor(1, 0, 0);
  nv_cube.setCaption('a cube');
  
  nv_r.add(nv_cube);
  
  // .. and action!
  nv_r.render();
  
}

function changeColor(x, y, z) {

  nv_cube.setColor(x, y, z);
  nv_r.render();
}
