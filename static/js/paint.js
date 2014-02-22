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
