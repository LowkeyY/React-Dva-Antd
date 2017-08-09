/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global PageTab */

var PageTile = function () {

    var colors = ['blue', 'green', 'yellow', 'purple', 'red'];

    function getColors() {
        colors = colors.concat(colors[0]);
        return colors.shift(0);
    }

    function packs(config) {
        var tile_image_url = config.tile_image;
        var tile_double = config.tile_doblue === "true";
        return '<div class="tile ' + (tile_image_url ? 'image' + (tile_double ? ' double' : '') : 'bg-' + getColors()) + '" id="tile_' + config.sys_app_id + '">' +
                    '<div class="tile-body">' +
                    (tile_image_url ? '<img src="' + tile_image_url + '"/>' : '<i class="fa fa-' + (config.tile_icon || 'tag') + '"></i>') +
                    '</div>' +
                    '<div class="tile-object">' +
                        '<div class="name">' + (config.default_title || '') + '</div>' +
                        '<div class="number">0</div>' +
                    '</div>' +
                '</div>';
    }

    function builds(html, selector) {
        if (html && selector)
            $(selector).append(html);
    }

    function layoutByCongfig(datas, selector) {
//        var items = datas || [{title: "万年历", icon: "calendar"}, {title: "即时通讯", icon: "comment"}, {title: "邮箱邮件", icon: "envelope"}, {title: "天气预报", icon: "umbrella" ,img : 'ljf.jpg'}];
        var items = datas || [];
        $.each(items, function (i , item) {
            if(item.show_desktop_isValid === 'true')
                builds(packs(item), selector);
        });
    }
    ;
    return {
        //main function to initiate the module
        init: function (selector) {
            this.selector = selector || '.page-content .tiles';

        },
        doLayout: function (items) {
            layoutByCongfig(items, this.selector);
            $(this.selector).on('click', '.tile', function (e) {
                PageTab.create($(this).attr('id'));
            });
        }
    };
}();