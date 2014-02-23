/*global document: true*/
/*global console: true*/

/* Drag */
var container = document.querySelector("#container");
var win = document.querySelector("#window");
var title = document.querySelector("#title");
var winX, winY;

function handleDrag(e) {
    "use strict";
    var rect = win.getBoundingClientRect(),
        curX = e.pageX,
        curY = e.pageY;
    win.style.left = (rect.left + curX - winX).toString();
    win.style.top = (rect.top + curY - winY).toString();
    winX = e.pageX;
    winY = e.pageY;
}

function handleMouseDown(e) {
    "use strict";
    winX = e.pageX;
    winY = e.pageY;
    title.addEventListener("mousemove", handleDrag, false);
    win.addEventListener("mousemove", handleDrag, false);
    container.addEventListener("mousemove", handleDrag, false);
}

function handleMouseUp(e) {
    "use strict";
    title.removeEventListener("mousemove", handleDrag, false);
    win.removeEventListener("mousemove", handleDrag, false);
    container.removeEventListener("mousemove", handleDrag, false);
}

title.addEventListener("mousedown", handleMouseDown, false);
title.addEventListener("mouseup", handleMouseUp, false);

/* Paint */
var drawings = Object();
var draws = io.connect('/draw');
var mysid;
var paintColor = "red";
var nowSize = 5;
var textFlag = false;
var sprayFlag = false;
var eraserFlag = false;
var context;
$(function () {

    draws.on('start', function (data) {
        mysid = data.sid;
    });
    draws.on('toDraw', function (data) {
        addClick(data.sid, data.x, data.y, data.dtype, data.pcolor, data.psize, data.stamp);
        redraw();
    });
    context = document.getElementById('canvas').getContext("2d");
    $('#canvas').mousedown(function (e) {
        if(textFlag){
            var rect = win.getBoundingClientRect();
            /*context.font = 'italic 20pt Calibri';
            context.fillText($("#textbox").val(),
                             $("#textbox").offset().left - rect.left,
                             $("#textbox").offset().top - rect.top + 18);*/
            addText($("#textbox").offset().left - rect.left, $("#textbox").offset().top - rect.top + 18, 'italic 20pt Calibri', $("#textbox").val());
            $("#textbox").val('');
            var x = e.pageX;
            var y = e.pageY;
            $("#textbox").css("top",y).css("left",x).show();
        }
        else if (sprayFlag) {
            paint = true;
            spray(e, $(this));
        }
        else{
            paint = true;
            draws.emit('addClick', {
                x: e.pageX - $(this).offset().left,
                y: e.pageY - $(this).offset().top,
                dtype: "click",
                psize: nowSize,
                pcolor: eraserFlag ? "eraser":paintColor
            });
        }
        //addClick(mysid, e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false, paintColor);
        //redraw();
    });
    $('#canvas').mousemove(function (e) {
        if (paint) {
            if (sprayFlag) {
                spray(e, $(this));
            }
            else {
                draws.emit('addClick', {
                    x: e.pageX - $(this).offset().left,
                    y: e.pageY - $(this).offset().top,
                    dtype: "drag",
                    psize: nowSize,
                    pcolor: eraserFlag ? "eraser":paintColor
                });
            }
            //addClick(mysid, e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true, paintColor);
            //redraw();
        }
    });
    $('#canvas').mouseup(function (e) {
        paint = false;
    });
    $('#canvas').mouseleave(function (e) {
        paint = false;
    });

    $("#color-choose-btn").click(function () {
        $(".tools-group").not("#color-choose").hide();
        $("#color-choose").toggle();
    });

    var paint;
    var addClick = function(sid, x, y, dragging, pcolor, psize, stamp)
    {
      if (!drawings[sid])
      {
          drawings[sid] = Object();
          drawings[sid]["clickX"] = new Array();
          drawings[sid]["clickY"]= new Array();
          drawings[sid]["dtypes"] = new Array();
          drawings[sid]["colors"] = new Array();
          drawings[sid]["sizes"] = new Array();
          drawings[sid]["stamps"] = new Array();
      }
      var clickX = drawings[sid].clickX;
      var clickY = drawings[sid].clickY;
      var dtypes = drawings[sid].dtypes;
      var colors = drawings[sid].colors;
      var sizes = drawings[sid].sizes;
      var stamps = drawings[sid].stamps;
      clickX.push(x);
      clickY.push(y);
      dtypes.push(dragging);
      colors.push(pcolor);
      sizes.push(psize);
      stamps.push(stamp);
    }
    var redraw = function(){
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas


      context.lineJoin = "round";


      var objs = new Array();
      for (var sid in drawings)
      {
         var stamps = drawings[sid].stamps;
         for (var i = 0; i < stamps.length; i++)
             objs.push({'sid': sid, 'i': i, 'stamp': stamps[i]});
      }
      objs = objs.sort(function(x, y) { return x.stamp - y.stamp; });
      //console.log(objs);
      for (var idx in objs)
      {
          var sid = objs[idx].sid;
          var i = objs[idx].i;
          if (drawings[sid].colors[i] == 'eraser')
              context.globalCompositeOperation = "destination-out";
          else
              context.globalCompositeOperation = "source-over";
          if (drawings[sid].dtypes[i] == 'text') {
              drawText(drawings[sid].clickX[i], drawings[sid].clickY[i], drawings[sid].sizes[i], drawings[sid].colors[i]);
          }
          else if (drawings[sid].dtypes[i] == "spray") {
                      drawSpray(drawings[sid].clickX[i] ,drawings[sid].clickY[i], drawings[sid].colors[i]);
          }
          else {
              context.strokeStyle = drawings[sid].colors[i];
          context.lineWidth = drawings[sid].sizes[i];
          
          context.beginPath();
          if(drawings[sid].dtypes[i] == "drag" && i){
              context.moveTo(drawings[sid].clickX[i-1], drawings[sid].clickY[i-1]);
          }else{
              context.moveTo(drawings[sid].clickX[i]-1, drawings[sid].clickY[i]);
          }
          context.lineTo(drawings[sid].clickX[i], drawings[sid].clickY[i]);
          context.closePath();
          context.stroke();
          }
      }
    }
    $("#color-choose span").click(function () {
        paintColor = $(this).css("background-color");
    });
    $("#eraser-btn").click(function() {
        $("#textbox").hide();
        eraserFlag = true;
        sprayFlag = false;
        textFlag = false;
    });
    $("#size-choose-btn").click(function(){
        $(".tools-group").not("#size-choose").hide();
        $("#size-choose").toggle();
    });
    //tools
    $(".tools-cat").each(function(){
        var thisID = $(this).attr("id");
        $("#"+thisID)
        .mousedown(function(){
            $(this).css("font-size","20px");    
        })
        .mouseout(function(){
            $(this).css("font-size","32px");
        })
        .mouseup(function(){
            $(this).css("font-size","32px");
        });
    });
    
    $("#size-choose span").click(function() {
        nowSize = parseInt($(this).attr("data-size"));
        $("#size-choose").hide();
        $("#textbox").hide();
    });
    $("#text-btn").click(function(){
        $(".tools-group").hide();
        textFlag = true;
        eraserFlag = false;
        sprayFlag = false;
        
    });
    $("#spray-btn").click(function(){
        $("#textbox").hide();
        sprayFlag = true;
        textFlag = false;
        eraserFlag = false;
    });
    $("#pencil-btn").click(function(){
        $("#textbox").hide();
        sprayFlag = false;
        textFlag = false;
        eraserFlag = false;
    });
});

function addText(nx, ny, font, text) {
    draws.emit('addClick', {
        x: nx,
        y: ny,
        dtype: "text",
        psize: font,
        pcolor: text
    });
}

function drawText(nx, ny, font, text) {
    context.font = font;
    context.fillStyle = "rgb(0,0,0)";
    context.fillText(text, nx, ny);
    //                         $("#textbox").offset().top - rect.top + 18);
}

function getRandomOffset(r) {
    var randomAngle = Math.random() * 360;
    var randomRadius = Math.random() * r;
    //console.log(r);
    
    return {
        x: Math.cos(randomAngle) * randomRadius,
        y: Math.sin(randomAngle) * randomRadius
    }
}

function getSpray(psize, posX, posY) {
    var xs = new Array(), ys = new Array();
    for (var i = 0; i < psize * 10; i++) {
        var offset = getRandomOffset(psize);
        xs.push(posX + offset.x);
        ys.push(posY + offset.y);
    }
    return {"xs": xs, "ys": ys};
}

function spray(e, ele) {
    var nx = e.pageX - ele.offset().left;
    var ny = e.pageY - ele.offset().top;
    var dots = getSpray(nowSize + 7, nx, ny);
    draws.emit('addClick', {
        x: dots.xs,
        y: dots.ys,
        dtype: "spray",
        psize: nowSize,
        pcolor: paintColor
    });
}

function drawSpray(xs, ys, color) {
    context.fillStyle = color;
    for (var i = 0; i < xs.length; i++) {
        context.fillRect(xs[i], ys[i], 1, 1);
    }
}
