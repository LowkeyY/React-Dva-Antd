/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PageTopMenu = function () {


    function packs(config) {
        return '<li class="dropdown dropdown-extended dropdown-notification" id="header_notification_bar">' +
                    '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">' +
                        '<i class="icon-bell"></i>' +
                        '<span class="badge badge-default">'+config.total+'</span>' +
                    '</a>'+
                '</li>';
    }

    function builds(html , selector) {
        if (html && selector)
            $(selector).prepend(html);
    }
    
//    var getTopMenuConfig = function () {
//        $.ajax({
//            type: "POST",
//            dataType: "json",
//            url: "/newlogin/login.jjs",
//            success: function (result) {
//                if (result.success && result.items && $.isArray(result.items)) {
//                    var html = "";
//                    $.each(function (item) {
//                        var newHtml = packingMenuApp(item);
//                        if (newHtml)
//                            html += newHtml;
//                    });
//                    insertTopMenu(html);
//                }
//            }
//        });
//    };

    function layoutByConfig(selector) {
        builds(packs({total:10}) , selector);
    };
    
    return {
        //main function to initiate the module
        init: function (selector) {
            this.selector = selector || '.top-menu .nav';
            layoutByConfig(this.selector);
        }
    };

}();