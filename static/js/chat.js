var chats = io.connect('/chat');
chats.on('news', function (data) {
    $("#chat-room").append("<span>" + data.name + ": " + data.msg + "<br></span>");
});

$("#msg").keydown(function (e) {
    //console.log(e);
    if (e.keyCode === 13) {
        console.log(typeof userData);
        chats.emit('newmsg', {
            name: userData.name,
            msg: $("#msg").val()
        });
        $("#chat-room").append("<span>" + userData.name + ": " + $("#msg").val() + "</span><br>");
        $("#msg").val("");
    }
});