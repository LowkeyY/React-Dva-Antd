/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global bootbox, PageSidebar */

var PageTab = function () {

    var tabContent = $(".page-content .tab-content"), tabUl = $('.page-content .nav');

//    var items = ["万年历", "即时通讯", "邮箱邮件", "天气预报"];

    function getId(config) {
        return config.sys_app_id || config.id;
    }

    function getTitle(config) {
        return config.default_title || config.title;
    }

    function getUrl(config) {
        return config.default_url || config.path;
    }

    function packsNav(config) {
        return  '<li>' +
                '<a href="#tab_' + getId(config) + '" data-toggle="tab" aria-expanded="true"> ' + getTitle(config) + ' </a>' +
                '<i class="icon-close"></i>' +
                '</li>';
    }

    function packsContent(config, content) {
        var html = [];
        html.push('<div class="tab-pane fade" id="tab_' + getId(config) + '">');
//      html.push('<h3 class="page-title">' + config.default_title + '</h3>');
        html.push(content);
        html.push('</div>');
        return html.join("\n");
    }

    function selectUlNode(config) {
        var createId = '#tab_' + getId(config);
        tabUl.children('li.active').removeClass("active");
        tabUl.find('li > a[href="' + createId + '"]').trigger("click");
    }

    function getContentHeight() {
        return ($('.page-content').height() - tabUl.outerHeight(true) - 5) + "px";
    }
    
    function evalCallbackFn(fn){
        if ($.isFunction(fn)) {
            fn.apply(null, arguments);
        }
    }
    
    function builds(nav, content, callback) {
        if (nav && content) {
            tabUl.append(nav);
            tabContent.append(content);
            evalCallbackFn(callback);
        }
    }

    function updates(config, content, html, callback) {
        if (content) {
            content.html(html);
            evalCallbackFn(callback);
        } else {
            builds(packsNav(config), packsContent(config, html), callback);
        }
        selectUlNode(config);
    }
    ;
    function getContent(el) {
        var list;
        if (el && (list = el.childNodes)) {
            var proto = new Array(), script;
            for (var i = 0; i < list.length; i++) {
                script = list[i];
                if ($.isIE)
                    proto.push(script.text);
                else
                    proto.push(script.textContent);
            }
            if (proto.length)
                return eval(proto.join("\n"));
        }
        return "";
    }
    ;

    function loads(url) {
        try {
            var xmlHTTP = new XmlHttp();
            xmlHTTP.open("GET", "/jsvm/JavaScript.jcp?" + url, false);
            xmlHTTP.send(null);
        } catch (e) {
            return false;
        }

        return getContent(xmlHTTP.responseXML.documentElement);
    }

    function packsHtml(config, content) {
        var url = getUrl(config), currentId = getId(config), currentHeight = getContentHeight();
        if (!url || !currentId) {
            bootbox.alert("系统建设中，敬请期待......");
            return;
        }
        if (config.default_open_type === 'false') {
            window.open(url);
        } else if (/^((https|http|ftp|rtsp|mms)?:\/\/)/i.test(url)) {
            updates(config, content, "<iframe id=\"model_" + currentId + "\" src=\"" + url + "\" style = 'border:0;width: 100%;height:" + currentHeight + ";'></iframe>");
        } else {
            var lib = url;
            var paramArray = url.split('?');
            lib = paramArray[0];
            var param = (paramArray.length > 1) ? decodeURIComponent(paramArray[1]) : {};
            for (var att in param)
                config[att] = param[att];
            try{
                var processModule = loads(lib);
                if (processModule) {
                    config.currentHeight = currentHeight;
                    function fn(html, callback) {
                        updates(config, content, html, callback);
                    }
                    processModule.init(config, fn);
                } else
                    bootbox.alert("系统建设中，敬请期待......");               
            }catch(e){
                bootbox.alert("系统建设中，敬请期待......"); 
            }
//            processModule = eval('new ' + lib + '()');
        }
    }

    function createTab(appid, content) {
        var conf;
        if ((conf = PageSidebar.get(appid)))
            packsHtml(conf, content);
        else
            $.ajax({
                type: "POST",
                dataType: "json",
                url: '/potal/menu/' + appid + '.json?' + Math.random(),
                success: function (result) {
                    if (result && result.sys_app_id)
                        packsHtml(result, content);
                }
            });
    }
    ;

    function deleteTab(el, selectOther) {
        var deleteId = $(el).siblings('a').attr('href') || $(el).attr('href'), sib, isActive = false;
        if (deleteId && deleteId.length > 1 && (deleteId = deleteId.substr(1))) {
            var curLi = $(el).parents('li');
            sib = curLi.next().size() ? curLi.next() : curLi.prev();
            isActive = (curLi.attr('class').indexOf("active") !== -1);
            curLi.remove();
            tabContent.children('#' + deleteId).remove();
        }
        if (selectOther === true && isActive === true && sib)
            sib.find('a:first').trigger("click");
    }

    return {
        //main function to initiate the module
        init: function () {
            tabUl.on('click', 'li > i', function (e) {
                deleteTab(this, true);
            });
        },

        create: function (app) {
            var appId = app.replace(/^(tm_|tile_|sideBar_)/, "");
            if (appId === 'desktop') {
                tabUl.find('li > a[href="#tab_desktop"]').trigger("click");
                return;
            }
            var createId = '#tab_' + appId, child = tabUl.find('li > a[href="' + createId + '"]'), content = "";
            if (child.length) {
                content = tabContent.children(createId);
                content.html("");
            }
            createTab(appId, content);
        }
    };
}();