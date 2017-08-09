(function () {
    function getWinmailUrl(src , callback) {
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/ExternalItems/potal/P_winmail.jcp",
            success: function (result) {
                if (result.success) {
                    var url = "http://192.168.0.196:82/login.php?f_user=" + result.userId + "&f_pass=" + result.userPsd + "&f_lang=ch_gb&f_domain=cunovstest.com";
                    callback.apply(null , ['<iframe id="model_' + src.sys_app_id + '" src="' + url + '" style = "border:0;width:100%;height : ' + (src.currentHeight || "100%") + '";></iframe>']);
                }
            }
        });
    }

    return {
        init: function (src, callback) {
            getWinmailUrl(src, callback);
        }
    };
})();