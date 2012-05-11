
if (typeof(nv_scripts) == 'undefined') var nv_scripts = new Object();

function nv_include(jsFile) {
if (nv_scripts[jsFile] != null) return;
var scriptElt = document.createElement('script');
scriptElt.type = 'text/javascript';
scriptElt.src = jsFile;
document.getElementsByTagName('head')[0].appendChild(scriptElt);
nv_scripts[jsFile] = jsFile; // or whatever value you prefer
}

var nv_plugins = new Array()

nv_include("plugins/volume_viewer.js");
nv_include("plugins/volume_viewer_multiple.js");
nv_include("plugins/multimodal_viewer.js");
nv_include("plugins/volume_url_viewer.js");