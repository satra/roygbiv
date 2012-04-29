var nv_r, nv_cube;
function run() {
    nv_r = new X.renderer('r');
    nv_r.init();
    
    // create some CSG primitives.. this is by the way an official example of CSG
    nv_cube = new X.cube([0,0,0],10,10,10);
    nv_cube.setColor(1,0,0);
    nv_cube.setCaption('a cube');
    
    nv_r.add(nv_cube);
   
    // .. and action!
    nv_r.render();
    
  }

function changeColor(x,y,z) {
    nv_cube.setColor(x, y, z);
    nv_r.render();
}

