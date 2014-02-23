module.exports.randomColor = function () {
    var e = "1234567890ABCDE",
        s = "";
    for (var i = 0; i < 6; i += 1) {
        s += e[parseInt(Math.random()*100, 10) % e.length];
    }
    return "#" + s;
}