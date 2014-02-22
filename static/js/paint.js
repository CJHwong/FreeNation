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
        addClick(data.sid, data.x, data.y, data.drag, data.pcolor);
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
        addClick(mysid, e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false, paintColor);
        redraw();
    });
    $('#window').mousemove(function (e) {
        if (paint) {
            draws.emit('addClick', {
                x: e.pageX - this.offsetLeft,
                y: e.pageY - this.offsetTop,
                drag: true,
                pcolor: paintColor
            });
            addClick(mysid, e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true, paintColor);
            redraw();
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

    var addClick = function (sid, x, y, dragging, pcolor) {
        if (!drawings[sid]) {
            drawings[sid] = Object();
            drawings[sid]["clickX"] = new Array();
            drawings[sid]["clickY"] = new Array();
            drawings[sid]["clickDrag"] = new Array();
            drawings[sid]["colors"] = new Array();
        }
        var clickX = drawings[sid].clickX;
        var clickY = drawings[sid].clickY;
        var clickDrag = drawings[sid].clickDrag;
        var colors = drawings[sid].colors;
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        colors.push(pcolor);
    }
    var redraw = function () {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas


        context.lineJoin = "round";
        context.lineWidth = 5;
        for (var sid in drawings) {
            var clickX = drawings[sid].clickX;
            var clickY = drawings[sid].clickY;
            var clickDrag = drawings[sid].clickDrag;
            var colors = drawings[sid].colors;
            for (var i = 0; i < clickX.length; i++) {
                context.strokeStyle = colors[i];
                context.beginPath();
                if (clickDrag[i] && i) {
                    context.moveTo(clickX[i - 1], clickY[i - 1]);
                } else {
                    context.moveTo(clickX[i] - 1, clickY[i]);
                }
                context.lineTo(clickX[i], clickY[i]);
                context.closePath();
                context.stroke();
            }
        }
    }
    $("#color-choose span").click(function () {
        paintColor = $(this).css("background-color");
    });
});