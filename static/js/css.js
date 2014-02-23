$(document).ready(function(){
    $(".tools-cat").each(function(){
        var thisID = $(this).attr("id");
        $("#"+thisID)
        .mousedown(function(){
            $(this).css("font-size","10px");    
        })
        .mouseout(function(){
            $(this).css("font-size","16px");
        })
        .mouseup(function(){
            $(this).css("font-size","16px");
        });
    });
});