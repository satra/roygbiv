var NV_Window = function(div) {
    //div is the name of the div for the window
    this.init(div)
}

NV_Window.prototype = {
    
    constructor: NV_Window,

    init: function(div) {
        this.div_name = div
        this.div = $("#"+this.div_name);
        this.div.addClass("dropdown")
    },

    run_setup: function() {
        
        var tbg = "<form style='margin-top:20px' class='form-horizontal'><div class='control-group'><label class='control-label' for='select01'>Viewer: </label>"
        tbg+= "<div class='controls'>"
        tbg+= "<select id='select_"+this.div_name+"'>"
        for( plugin in nv_plugins)
        {
            tbg+="<option>"+nv_plugins[plugin].name+"</option>";
        }
        tbg+="</select></div></div>"
        tbg+= "<div class='control-group'>"
        tbg+="<label class='control-label' for='file_input'>File:</label>"
        tbg+="<div class='controls'>"
        tbg+="<input id='file_"+this.div_name+"' type='file' name='file' /></div></div>"
        tbg+="<div class='controls'><button id='"+this.div_name+"_button' class='btn btn-primary' type='button'>Start</button></div>"
        tbg+="</form>"
        this.div.html(tbg);

        //this.div.append();
        var temp_button = $("#"+this.div_name+"_button");
        var _this = this;
        temp_button.click(function(){
            var plugin = $("#select_"+_this.div_name).attr('value');
            var file = $("#file_"+_this.div_name).attr('value').replace(/^.*[\\\/]/, '');
            console.log("FILE "+file)
            _this.div.html("")

            //make a div to contain the dat.GUI
            jQuery('<div/>', {
                'id': 'guidiv'+_this.div_name.slice(1)//in the form guidiv_i_j, where (i,j) is location in the grid
            }).appendTo("#"+_this.div_name)
               
            _this.guiDiv = $('#guidiv'+_this.div_name.slice(1))

            _this.guiDiv.css({'position': 'fixed',
                'z-index': 10,
                'width': '245px',
                'right': $("#container").width()-_this.div.css("left").slice(0,-2)-_this.div.css("width").slice(0,-2)-2,
                'top': 1+parseInt(_this.div.css("top").slice(0,-2))
                
            })

            //make a fixed dropdown menu
            
            jQuery('<button/>', {
                'id': 'button'+_this.div_name.slice(1),//in the form guidiv_i_j, where (i,j) is location in the grid
                'class': 'btn btn-primary dropdown-toggle',
                'data-toggle': 'dropdown',
                'href': "#"+_this.div_name
            }).appendTo("#"+_this.div_name)
               
            _this.button = $('#button'+_this.div_name.slice(1))

            _this.button.css({'position': 'fixed',
                'z-index':15,
            })

            _this.button.html("<i class='icon-chevron-down'></i><ul style='z-index:15' class='dropdown-menu'><li onclick=\"NV_open_windows['"+_this.div_name.slice(2)+"'].destroy()\"><a href='#'>Close</a></li></ul>")

            _this.div.css({'background-color' : 'black'})
            _this.run_plugin(_this.div_name, plugin, file)
        });

    },

    run_plugin: function(div, plugin, file) {
                    
        var temp_object = nv_plugins[plugin].run(div, file);

        this.gui = temp_object["gui"]
        this.renderer = temp_object["renderer"]
        
        $("."+dat.gui.GUI.CLASS_AUTO_PLACE_CONTAINER)[0].removeChild(this.gui.domElement)
        this.guiDiv.append(this.gui.domElement)
    },

    destroy: function() {
        this.renderer.destroy()
        this.div.html("")
        this.div.css({'background-color' : 'white'})
        this.run_setup()
        //clearing dead variables
        this.renderer = null
        this.gui = null
        this.button = null

    }

}


var NV_open_windows = new Array()


$(window).load(function(){set_sizes(); make_window_grid(1, 1)});

function set_sizes()
{
    $("#container").height($(window).height()-$(".navbar").height())
}

function make_window_grid(n_rows, n_cols)
{
    $("#container").html("");   //clear container html
    //clear open window array
    for (i in NV_open_windows)
    {
        NV_open_windows[i]=null
    }

    var c_width = $("#container").width()
    var c_height = $("#container").height()

    var container = $("#container")

    for (var i = 0; i < n_rows; i++)
    {
        for (var j = 0; j < n_cols; j++)
        {

            jQuery('<div/>', {
                'id': 'r_'+i+'_'+j
            }).appendTo("#container")
                
            var thisDiv = $('#r_'+i+'_'+j)

            thisDiv.css({'position': 'absolute',
                'left': Math.round(c_width/n_cols*j)+'px',
                'top': $(".navbar").height()+ Math.round(c_height/n_rows*i)+'px',
                'height': (Math.round(c_height/n_rows*(i+1))-Math.round(c_height/n_rows*i)-2)+'px',
                'width': (Math.round(c_width/n_cols*(j+1))-Math.round(c_width/n_cols*j)-2)+'px',
                'border': '1px #ddd solid',
            })

            var temp_window = new NV_Window('r_'+i+'_'+j);
            temp_window.run_setup();
            NV_open_windows[i+'_'+j] = temp_window
        }
    }
}

