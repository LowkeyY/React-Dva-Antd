/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PageSidebar = function () {
    
    var cache = {};
    
    function packs(config) {
        return '<li>' +
                '<a href="javascript:void(0);" id="sideBar_'+config.sys_app_id+'">' +
                    '<i class="icon-'+(config.sidebar_icon || 'tag')+'"></i>' +
                    '<span class="title">' + config.default_title + '</span>' +
                '</a>' +
                '</li>';
    }
    
    function packSys(config){
         return '<li>' +
                    '<a href="javascript:;" id="sideBar_'+config.id+'">' +
                        '<i class="icon-'+(config.sidebar_icon || 'wrench')+'"></i>' +
                        '<span class="title">' + config.title + '</span>' +
                        '<span class="arrow "></span>' +
                    '</a>' + packSysChild(config.submenu) + 
                '</li>';       
    }
    
    function packSysChild(items){
        if(!items)
            return '';
        var html = ['<ul class="sub-menu">'];
        $.each(items, function (i , item) {
            cache[item.id]  =  item;
            html.push('<li><a href="javascript:void(0);" id="sideBar_'+item.id+'">'+item.title+'</a>');
            html.push(packSysChild(item.submenu));
            html.push('</li>');
        });
        html.push('</ul>');
        return html.join("");
    }

    function builds(html , selector) {
        if (html && selector)
            $(selector).append(html);
    }
    
    function layoutByConfig(ds , selector , cache) {
//        var items = [{title: "桌面", icon: 'home'}, {title: "万年历", icon: "calendar"}, {title: "即时通讯", icon: "bubble"}, {title: "邮箱邮件", icon: "envelope"}, {title: "天气预报", icon: "umbrella"}];
        var items = ds || [];
        $.each(items, function (i , item) {
            if(item.show_startmenu_isValid === 'true')
                builds(packs(item) , selector);
            else if(item.id && item.id.match("0|1")){
                builds(packSys(item , cache) , selector);
            }
        });
    };
    
    
    return {
        //main function to initiate the module
        init: function (selector) {
            this.selector = selector || '.page-sidebar .page-sidebar-menu';
        },
        doLayout : function(items){
            layoutByConfig(items , this.selector);
        },
        get : function(sysId){
            return sysId && cache[sysId] || "";
        }
    };
}();