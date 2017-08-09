/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function ($) {
    //首先备份下jquery的ajax方法  
    var _ajax = $.ajax;

    //重写jquery的ajax方法  
    $.ajax = function (opt) {
        //备份opt中error和success方法  
        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown) {},
            success: function (data, textStatus) {}
        }
        if (opt.error) {
            fn.error = opt.error;
        }
        if (opt.success) {
            fn.success = opt.success;
        }

        //扩展增强处理  
        var _opt = $.extend(opt, {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //错误方法增强处理
                if (XMLHttpRequest.status == 401) {
                    var callbackScript = XMLHttpRequest.getResponseHeader("Callback-Script");
                    if (callbackScript) {
                        eval(callbackScript);
                    } else {
                        location.href = "/newlogin/index.html";
                    }
                    return;
                };
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus) {
                //成功回调方法增强处理  
                fn.success(data, textStatus);
            }
        });
        
        return _ajax(_opt);
    };
})(jQuery);  