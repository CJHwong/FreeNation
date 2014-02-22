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

/*
function draw() {
    "use strict";
    var canvas = document.querySelector("#canvas"),
        ctx = null;
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgb(200, 0, 0)";
        ctx.fillRect(10, 25, 100, 7);
        ctx.fillRect(52, 15, 14, 35);
        ctx.fillRect(17, 45, 89, 7);
        ctx.fillRect(17, 45, 14, 35);
        ctx.fillRect(92, 45, 14, 35);
        ctx.fillRect(17, 61, 89, 7);
        ctx.fillRect(17, 77, 89, 7);
        ctx.fillRect(52, 84, 14, 35);
        ctx.fillRect(10, 95, 100, 7);
        ctx.fillRect(135, 76, 85, 7);
        ctx.fillRect(128, 95, 100, 7);
        ctx.fillRect(170, 76, 14, 45);
    } else {
        console.log("canvas error");
    }
}

document.addEventListener("DOMContentLoaded", draw, false);
*/
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
