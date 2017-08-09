/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global PageTile, PageSidebar */

var PageSystem = function () {
    var userConfig = {};
    function getConfig() {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/newhome/system/getMenu.jjs",
            success: function (result) {
                if (result.success) {
                    if (result.menu) {
                        PageSidebar.doLayout(result.menu);
                        PageTile.doLayout(result.menu);
                    }
                    userConfig = result.config;
                    if (userConfig.real_name)
                        $('.username', '.top-menu .dropdown.dropdown-user').html(userConfig.real_name);
                }
            },
            error: function () {
                location.href = "/newlogin/index.html";
            }
        });
    }
    ;
    function load(tag , src){
        if(tag === "s"){
            if(!$('head').find('script[src="'+src+'"]').length)
                $('<script></script>').attr({src: src, type : 'text/javascript'}).appendTo($('head'));
        } else if(tag === "c"){
            if(!$('head').find('link[src="'+src+'"]').length)
                $('<link></link>').attr({src: src, type : 'text/css' , rel : 'stylesheet'}).appendTo($('head'));
        }
    }
    ;
    return {
        init: function () {
            getConfig();
        },
        loadJS: function (src) {
            load('s' , src);
        },
        loadCSS : function(src){
           load('c' , src);
        },
        get:function(key){
            return userConfig[key] || '';
        }
    };
}();
