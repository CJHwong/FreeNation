var userData = null;
window.fbAsyncInit = function () {
    FB.init({
        appId: '217097921818612',
        status: true,
        cookie: true,
        xfbml: true
    });
    //這裡要輸入你的appId 到 FB 開發者申請
    /* All the events registered */
    FB.Event.subscribe('auth.login', function (response) {
        // do something with response
        login();
    });
    FB.Event.subscribe('auth.logout', function (response) {
        // do something with response
        logout();
    });

    FB.getLoginStatus(function () {
        FB.api('/me', function (response) {
            userData = response;
        });
    });
};
(function () {
    //將FB的內容使用append方式加入
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.src = //document.location.protocol +
    'https://connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());

function login() {
    FB.api('/me', function (response) {
        userData = response;
        console.log(userData);
    });
}