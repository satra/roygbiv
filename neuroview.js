var NV_Window = function(div) {

  // div is the name of the div for the window
  this.init(div)
}

NV_Window.prototype = {
  
  constructor: NV_Window,
  
  init: function(div) {

    this.div_name = div
    this.div = jQuery("#" + this.div_name);
    this.div.addClass("dropdown")
    this.renderer = null
  },
  
  run_setup: function() {

    var tbg = "<form style='margin-top:20px' class='form-horizontal'>"
      
    tbg += "<div class='control-group'>"
    tbg += "<label class='control-label' for='select01'>Viewer: </label>"
    tbg += "<div class='controls'>"
    tbg += "<select id='select_" + this.div_name + "'>"
    for (plugin in nv_plugins) {
      tbg += "<option>" + nv_plugins[plugin].prototype.name+ "</option>";
    }
    tbg += "</select></div></div>"

    tbg += "<div class='controls' style = 'width: 200px; margin-top:20px; margin-bottom:20px'><hr></div>"
    
    tbg += "<div id='variable_" + this.div_name + "'></div>"
    
    tbg += "</form>"
    this.div.html(tbg)
    
    for (plugin in nv_plugins) {
      this.create_plugin_inputs(nv_plugins[plugin].prototype.name)
      break

    }
    var _this = this
    jQuery("#select_" + this.div_name).change(function(evt) {
      _this.create_plugin_inputs(evt.target.value)
    })

  },

  create_plugin_inputs: function(plugin) {
    var tbg = ""
    var plugin_inputs = nv_plugins[plugin].prototype.input_rules
    for (input in plugin_inputs)
    {
      var input_obj = plugin_inputs[input]
      switch (input_obj['type'])
      {
        case 'file':
          tbg += "<div class='control-group'>"
          tbg += "<label class='control-label' for='file_input'>" + input_obj['name'] + "</label>"
          tbg += "<div class='controls'>"
          tbg += "<input id='file_" + this.div_name +
                "_" + input + "' type='file' name='file' /></div></div>"
          break
      }

    }
    tbg += "<div class='controls'><button id='" + this.div_name +
        "_button' class='btn btn-primary' type='button'>Start</button></div>"
    jQuery("#variable_" + this.div_name).html(tbg)
    
    var temp_button = jQuery("#" + this.div_name + "_button");
    //var file_button = jQuery("#file_" + this.div_name);
    var _this = this;
    /*file_button.change(function(evt) {

      _this.plugin = jQuery("#select_" + _this.div_name).attr('value');
      _this.file = (evt.target.files)[0];
      create_plugin_UI(_this);
      _this.run_plugin(_this.div_name, _this.plugin, _this.file)

    });*/
    temp_button.click(function() {
      console.log("HERE");

      _this.plugin = jQuery("#select_" + _this.div_name).attr('value');
      var inputs = []
      for(var i = 0; i < nv_plugins[plugin].prototype.input_rules.length; i++)
      {
        switch (input_obj['type'])
        {
          case 'file':
            inputs.push(document.getElementById("file_" + _this.div_name + "_" + i).files[0])
            break

        }
      }
      create_plugin_UI(_this);
      _this.run_plugin(_this.div_name, _this.plugin, inputs)
    });

    
          

  },
  
  run_plugin: function(div, plugin, inputs) {
    this.plugin = new nv_plugins[plugin]()
    this.plugin.run(div, inputs)  
    
    jQuery("." + dat.gui.GUI.CLASS_AUTO_PLACE_CONTAINER)[0]
        .removeChild(this.plugin.gui.domElement)
    this.guiDiv.append(this.plugin.gui.domElement)
  },
  
  destroy: function() {

    this.plugin.renderer.destroy()
    this.div.html("")
    this.div.css({
      'background-color': 'white'
    })
    this.run_setup()
    // clearing dead variables
    this.button = null
    this.plugin = null
  },

  serialize: function() {
    if(this.plugin)
    {
      var serial_obj = this.plugin.serialize()
      //add essential items
      serial_obj['plugin'] = this.plugin.name
      serial_obj['inputs'] = this.plugin.inputs
      return serial_obj;
    }
    return null
   
  },

  load: function(load_obj) {

    if(load_obj['plugin'])
    {
      create_plugin_UI(this)
      this.run_plugin(this.div_name, load_obj['plugin'], load_obj['inputs'])
      this.plugin.load(load_obj)
    }

  }

};

function create_plugin_UI(this_window) {

  this_window.div.html("")

  // make a div to contain the dat.GUI
  jQuery('<div/>', {
    'id': 'guidiv' + this_window.div_name.slice(1)// in the form guidiv_i_j,
  // where (i,j) is location in
  // the grid
  }).appendTo("#" + this_window.div_name)

  this_window.guiDiv = jQuery('#guidiv' + this_window.div_name.slice(1))

  this_window.guiDiv.css({
    'position': 'fixed',
    'z-index': 10,
    'width': '245px',
    'right': jQuery("#container").width() -
        this_window.div.css("left").slice(0, -2) -
        this_window.div.css("width").slice(0, -2) - 2,
    'top': 1 + parseInt(this_window.div.css("top").slice(0, -2))
  
  })

  // make a fixed dropdown menu
  
  jQuery('<button/>', {
    'id': 'button' + this_window.div_name.slice(1),// in the form guidiv_i_j,
    // where (i,j) is location
    // in the grid
    'class': 'btn btn-primary dropdown-toggle',
    'data-toggle': 'dropdown',
    'href': "#" + this_window.div_name
  }).appendTo("#" + this_window.div_name)

  this_window.button = jQuery('#button' + this_window.div_name.slice(1))

  this_window.button.css({
    'position': 'fixed',
    'z-index': 15,
  })

  this_window.button
      .html("<i class='icon-chevron-down'></i><ul style='z-index:15' class='dropdown-menu'><li onclick=\"NV_open_windows['" +
          this_window.div_name.slice(2) +
          "'].destroy()\"><a href='#'>Close</a></li></ul>")

  this_window.div.css({
    'background-color': 'black'
  })


}

var NV_rows, NV_cols
var NV_open_windows = new Array()


jQuery(window).load(function() {

  set_sizes();
  make_window_grid(1, 1)
});

function set_sizes() {

  jQuery("#container").height(
      jQuery(window).height() - jQuery(".navbar").height())
}

function clear_windows() {
  jQuery("#container").html(""); // clear container html
  for (i in NV_open_windows) {
    NV_open_windows[i] = null
  }
}

function save_windows() {
  var save_obj = {}
  save_obj['rows'] = NV_rows
  save_obj['cols'] = NV_cols
  for ( var i = 0; i < NV_rows; i++) {
    for ( var j = 0; j < NV_cols; j++) {

      save_obj[i + '_' + j] = NV_open_windows[i + '_' + j]!=null ? NV_open_windows[i + '_' + j].serialize() : null;

    }
  }

  localStorage.setItem("NV_temp", JSON.stringify(save_obj))
  console.log(JSON.stringify(save_obj))
  
}

function load_windows() {
  var load_obj = JSON.parse(localStorage.getItem("NV_temp"));
  NV_rows = load_obj['rows']
  NV_cols = load_obj['cols']
  make_window_grid(NV_rows, NV_cols)
  for ( var i = 0; i < NV_rows; i++) {
    for ( var j = 0; j < NV_cols; j++) {

      if(NV_open_windows[i + '_' + j] && load_obj[i + '_' + j])
      {
        NV_open_windows[i + '_' + j].load(load_obj[i + '_' + j])
      }

    }
  }
  

}

function make_window_grid(n_rows, n_cols) {

  clear_windows()
  var container = jQuery("#container")
  var c_width = container.width()
  var c_height = container.height()
  NV_rows = n_rows
  NV_cols = n_cols
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
      NV_open_windows[i + '_' + j] = temp_window

    }
  }
}
