/*global document: true*/
/*global console: true*/
var trigger = false;

function toggleSidebar() {
    "use strict";
    var sidebar = document.querySelector("#sidebar");
    sidebar.style.right = "-200%";
}

function toggleCanvas() {
    "use strict";
    var canvas = document.querySelector("#canvas");
    canvas.style.width = "100%";
}

var members = document.querySelector("#members");
members.addEventListener("click", function () {
    "use strict";
    toggleCanvas();
    toggleSidebar();
}, false);

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
$(function () {

    draws.on('start', function (data) {
        mysid = data.sid;
    });
    draws.on('toDraw', function (data) {
        addClick(data.sid, data.x, data.y, data.drag, data.pcolor, data.psize, data.stamp);
        redraw();
    });
    var context = document.getElementById('canvas').getContext("2d");
    $('#canvas').mousedown(function (e) {
        paint = true;
        draws.emit('addClick', {
            x: e.pageX - $(this).offset().left,
            y: e.pageY - $(this).offset().top,
            drag: false,
            psize: nowSize,
            pcolor: paintColor
        });
        //addClick(mysid, e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false, paintColor);
        //redraw();
    });
    $('#canvas').mousemove(function (e) {
        if (paint) {
            draws.emit('addClick', {
                x: e.pageX - $(this).offset().left,
                y: e.pageY - $(this).offset().top,
                drag: true,
                psize: nowSize,
                pcolor: paintColor
            });
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
                  drawings[sid]["clickDrag"] = new Array();
                  drawings[sid]["colors"] = new Array();
                  drawings[sid]["sizes"] = new Array();
                  drawings[sid]["stamps"] = new Array();
              }
              var clickX = drawings[sid].clickX;
              var clickY = drawings[sid].clickY;
              var clickDrag = drawings[sid].clickDrag;
              var colors = drawings[sid].colors;
              var sizes = drawings[sid].sizes;
              var stamps = drawings[sid].stamps;
              clickX.push(x);
              clickY.push(y);
              clickDrag.push(dragging);
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
                  context.strokeStyle = drawings[sid].colors[i];
                  context.lineWidth = drawings[sid].sizes[i];
                  if (drawings[sid].colors[i] == 'eraser')
                      context.globalCompositeOperation = "destination-out";
                  else
                      context.globalCompositeOperation = "source-over";
                  context.beginPath();
                  if(drawings[sid].clickDrag[i] && i){
                      context.moveTo(drawings[sid].clickX[i-1], drawings[sid].clickY[i-1]);
                  }else{
                      context.moveTo(drawings[sid].clickX[i]-1, drawings[sid].clickY[i]);
                  }
                  context.lineTo(drawings[sid].clickX[i], drawings[sid].clickY[i]);
                  context.closePath();
                  context.stroke();
              }
            }
    $("#color-choose span").click(function () {
        paintColor = $(this).css("background-color");
    });
    $("#eraser-btn").click(function() {
        paintColor = "eraser";
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
            $(this).css("font-size","10px");    
        })
        .mouseout(function(){
            $(this).css("font-size","16px");
        })
        .mouseup(function(){
            $(this).css("font-size","16px");
        });
    });
    
    $("#size-choose span").click(function() {
        nowSize = $(this).attr("data-size");
        $("#size-choose").hide();
    });

    
});