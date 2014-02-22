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
$(function () {

    draws.on('start', function (data) {
        mysid = data.sid;
    });
    draws.on('toDraw', function (data) {
        addClick(data.sid, data.x, data.y, data.drag, data.pcolor, data.stamp);
        redraw();
    });
    var context = document.getElementById('canvas').getContext("2d");
    $('#window').mousedown(function (e) {
        paint = true;
        draws.emit('addClick', {
            x: e.pageX - this.offsetLeft,
            y: e.pageY - this.offsetTop,
            drag: false,
            pcolor: paintColor
        });
        //addClick(mysid, e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false, paintColor);
        //redraw();
    });
    $('#window').mousemove(function (e) {
        if (paint) {
            draws.emit('addClick', {
                x: e.pageX - this.offsetLeft,
                y: e.pageY - this.offsetTop,
                drag: true,
                pcolor: paintColor
            });
            //addClick(mysid, e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true, paintColor);
            //redraw();
        }
    });
    $('#window').mouseup(function (e) {
        paint = false;
    });
    $('#window').mouseleave(function (e) {
        paint = false;
    });


    $("#color-choose-btn").click(function () {
        $("#color-choose").show();
    });

    var paint;
            var addClick = function(sid, x, y, dragging, pcolor, stamp)
            {
              if (!drawings[sid])
              {
                  drawings[sid] = Object();
                  drawings[sid]["clickX"] = new Array();
                  drawings[sid]["clickY"]= new Array();
                  drawings[sid]["clickDrag"] = new Array();
                  drawings[sid]["colors"] = new Array();
                  drawings[sid]["stamps"] = new Array();
              }
              var clickX = drawings[sid].clickX;
              var clickY = drawings[sid].clickY;
              var clickDrag = drawings[sid].clickDrag;
              var colors = drawings[sid].colors;
              var stamps = drawings[sid].stamps;
              clickX.push(x);
              clickY.push(y);
              clickDrag.push(dragging);
              colors.push(pcolor);
              stamps.push(stamp);
            }
            var redraw = function(){
              context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

              
              context.lineJoin = "round";
              context.lineWidth = 5;
                
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
});