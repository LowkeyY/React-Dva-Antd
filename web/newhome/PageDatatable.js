/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PageDatatable = function (id) {
    
    PageSystem.loadJS('/metronic/assets/global/plugins/select2/select2.min.js');
    PageSystem.loadJS('/metronic/assets/global/plugins/datatables/media/js/jquery.dataTables.js');
    PageSystem.loadJS('/metronic/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js');

    var selector = id ? '#datatable_' + id : "", isValid = !!selector && jQuery().dataTable , dateTableColumns = [];

    var opt = {
        "language": {
            "aria": {
                "sortAscending": ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            },
            "emptyTable": "无数据",
            "info": "显示 _START_ 至 _END_ ，共 _TOTAL_ 条数据",
            "infoEmpty": "没有数据",
            "infoFiltered": "(从 _MAX_ 条数据中查找)",
            "lengthMenu": "每页显示 _MENU_ 条数据",
            "search": "搜索:",
            "zeroRecords": "无数据",
            "paginate": {
                "previous": "上一页",
                "next": "下一页",
                "last": "末页",
                "first": "首页"
            }
        },

        "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

        "pagingType": "bootstrap_full_number"
    }

    function uniform(dom) {
        if (!$().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)", dom || selector);
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }

    function afterInit() {
        if (isValid) {
            var table = $(selector), tableWrapper = $(selector + '_wrapper');
            table.find('.group-checkable').change(function () {
                var set = $(this).attr("data-set");
                var checked = $(this).is(":checked");
                $(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                        $(this).parents('tr').addClass("active");
                    } else {
                        $(this).attr("checked", false);
                        $(this).parents('tr').removeClass("active");
                    }
                });
                $.uniform.update(set);
            });
            table.on('change', 'tbody tr .checkboxes', function () {
                $(this).parents('tr').toggleClass("active");
            });
            tableWrapper.find('.dataTables_length select').addClass("form-control input-xsmall input-inline");
        }
    }
    
    function panksTh(items){
        if($.isArray(items) && items.length){
            var htmls = ['<th><input type="checkbox" class="group-checkable" data-set="' + selector + ' .checkboxes"></th>'];
            $.each(items , function(i , item){
                htmls.push('<th>' +item+'</th>');
            })
            return htmls.join("\n");
        }
        return '';
    }
    
    function panksTools(items){
        if($.isArray(items) && items.length){
            var htmls = [];
            $.each(items , function(i , item){
                htmls.push('<a href="' + (item.id ? '#' + item.id : 'javascript:void(0);') + '" class="btn'+(item.color ? ' ' + item.color : ' default yellow-stripe') +'" data-toggle="modal" >');
                htmls.push('<i class="fa fa-'+(item.icon ? item.icon : 'plus')+'"></i><span class="hidden-480">' + item.name + '</span></a>');
            })
            return htmls.join("\n");
        }
        return '';
    }

    function panks(o) {
        return  '    <div class="portlet'+(o.portletCss ? ' ' + o.portletCss: '')+'">' +
                '        <div class="portlet-title">' +
                '            <div class="caption">' +
                '                <i class="fa fa-'+(o.portletTitleCss ? o.portletTitleCss : 'tag')+'"></i>' + o.title +
                '            </div>' +
                '            <div class="actions">' + panksTools(o.tools) +
                '            </div>' +
                '        </div>' +
                '        <div class="portlet-body">' +
                '            <div class="table-container">' +
                '                <table class="table table-striped table-bordered table-hover" id="' + selector.substr(1) + '">' +
                '                    <thead>' +
                '                        <tr role="row" class="heading">' + panksTh(o.columns) +
                '                        </tr>' +
                '                    </thead>' +
                '                    <tbody>' +
                '                    </tbody>' +
                '                </table>' +
                '            </div>' +
                '        </div>' +
                '    </div>'
    }
    
    function getSelectRows(cols){
        var columnIndex = {};
        $.each(cols , function(i , col){
            $.each(dateTableColumns , function(j , dateTableColumn){
                if(dateTableColumn.data && dateTableColumn.data === col){
                    columnIndex[j] = col; 
                }
            })
        })
        var rows = [];
        $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', selector).each(function () {
            $(this).parents('td').siblings('td').each(function (i) {
                if(columnIndex[i+1])
                    rows.push($(this).text());
            })
        });
        return rows;
    }

    return {
        initDatatable: function (options) {
            if (isValid && options) {
                uniform();
                if(options.columns && $.isArray(options.columns))
                    dateTableColumns = options.columns;
                $(selector).dataTable($.extend(true, opt, options));
                afterInit();
            }
        },
        initHead : function(conf){
            if(isValid && conf){
                return panks(conf);
            }
            return '';
        },
        reUniform : function(){
            uniform();
        },
        selects : function(cols){
            return isValid && cols ? getSelectRows($.isArray(cols) ? cols : [cols]) : [];
        }
    }
}