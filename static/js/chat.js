function randomColor() {
    var e = "1234567890ABCDE",
        s = "";
    for (var i = 0; i < 6; i += 1) {
        s += e[parseInt(Math.random()*100, 10) % e.length];
    }
    return "#" + s;
}

var chats = io.connect('/chat');
chats.on('news', function (data) {
    $("#chat-room").append("<p><span class='messages' style='color:" + data.color + ";'>" + data.name + "</span>: " + data.msg + "</p>");
});

$("#msg").keydown(function (e) {
    //console.log(e);
    if (e.keyCode === 13) {
        chats.emit('newmsg', {
            color: paintColor,
            name: userData.name,
            msg: $("#msg").val()
        });
        $("#chat-room").append("<p><span class='messages' style='color:" + paintColor + ";'>" + userData.name + "</span>: " + $("#msg").val() + "</p>");
        $("#msg").val("");
    }
});