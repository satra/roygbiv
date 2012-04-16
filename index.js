/*function setSizes() {
   var n_width = $("#controls").width() - c_width;
   
   $("#r").width($("#container").width() - c_width);
}
$(window).resize(function() { setSizes(); });
$(window).load(function() { setSizes(); });*/
$(document).ready(function(){

    setSizes();

    $(".choice").click(function() {
        chooseSelection($(this));
    });
    $('#file').change(function() {
         pickFile($(this));
    }); 

    run(); 
});

function setSizes() {
   var n_width = $("#controls").width();
   
   $("#r").width($("#container").width() - n_width);
}

$(window).resize(function() { setSizes(); });
$(window).load(function() { setSizes(); });

function chooseSelection(element){
    if(element.hasClass("active")) {
        element.removeClass("active");
    }
    else {
        $(".choice").removeClass("active");
        element.addClass("active");
    }

    var type = element.attr('id');
    if(type=="red")
    {
        changeColor(1,0,0);
    }
    else if(type=="green")
    {
        changeColor(0,1,0);
    }
    else if(type=="blue")
    {
        changeColor(0,0,1);
    }

}
function pickFile(element){
    var filename = element.val().substring(element.val().lastIndexOf('\\')+1);
    var extension = filename.substring(filename.lastIndexOf("\.")+1);
    emptySelections();
    generateSelections(extension);
}

function emptySelections(){
    $("#selections").html("");
}

function generateSelections(extension){
    $("#selections").append("<li id='red' class='choice'><a  href='#'>"+extension.toUpperCase()+" Red</a></li>");
    $("#selections").append("<li id='green' class='choice'><a  href='#'>"+extension.toUpperCase()+" Green</a></li>");
    $("#selections").append("<li id='blue' class='choice'><a  href='#'>"+extension.toUpperCase()+" Blue</a></li>");
    $(".choice").click(function() {
        chooseSelection($(this));
    });
}
