/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Metronic */

(function () {
    function panks(conf) {
        return '<div class="row" id="module_' + conf.id + '">' +
                '    <div class="col-md-12">' +
                '	<!-- BEGIN EXAMPLE TABLE PORTLET-->' +
                '	<div class="portlet box grey-cascade">' +
                '	    <div class="portlet-title">' +
                '		<div class="caption">' +
                '		    <i class="fa fa-file-o"></i>系统日志' +
                '		</div>' +
                '		<div class="tools">' +
                '                   <a href="" class="fullscreen" data-original-title="" title="">' +
                '                   </a>' +
                '		    <a href="javascript:;" class="reload">' +
                '		    </a>' +
                '		</div>' +
                '	    </div>' +
                '	    <div class="portlet-body">' +
                '		<div class="table-toolbar">' +
                '		    <div class="row">' +
                '			<div class="col-md-12">' +
                '                           <div class="col-md-2">' +
                '                               <input class="form-control" id="loglevel_'+conf.id+'" name="loglevel_'+conf.id+'" type="hidden">' +
                '                           </div>' +
                '                           <div class="col-md-2">' +
                '                               <input class="form-control" id="content_'+conf.id+'" name="content_'+conf.id+'" placeholder="日志内容">' +
                '                           </div>' +
                '                           <div class="col-md-3">'+
                '                              <div class="input-group input-large date-picker input-daterange" data-date="2012/10/11" data-date-format="yyyy/mm/dd">'+
                '                                 <input type="text"  id="fTime_'+conf.id+'" class="form-control" name="fTime" placeholder="开始时间">'+
                '                                  <span class="input-group-addon"> 至 </span>'+
                '                                   <input type="text"  id="sTime_'+conf.id+'" class="form-control" name="sTime" placeholder="结束时间">'+
                '                               </div>'+
                '                           </div>'+
                '                           <div class="col-md-2">' +
                '                               <div class="clearfix">' +
                '                                   <button id="btn_' + conf.id + '_search" class="btn yellow">' +
                '                                       过滤 <i class="fa fa-search"></i>' +
                '                                   </button>' +
                '                                   <button id="btn_' + conf.id + '_infos" class="btn green" href="#system_' + conf.id + '_infos" data-toggle="modal">' +
                '                                    详细信息 <i class="fa fa-info"></i>' +
                '                                   </button>' +
                '                               </div>' +
                '                           </div>' +                   
                '			</div>' +             
                '		    </div>' +
                '		</div>' +
                '		<table class="table table-striped table-bordered table-hover" id="system_' + conf.id + '">' +
                '		    <thead>' +
                '			<tr>' +
                '			    <th class="table-checkbox">' +
                '				<input type="checkbox" class="group-checkable" data-set="#system_' + conf.id + ' .checkboxes"/>' +
                '			    </th>' +
                '			    <th>日志日期</th>' +
                '			    <th>日志级别</th>' +
                '			    <th>日志内容</th>' +
                '			    <th>日志类型</th>' +
                '			    <th>记录者</th>' +
                '			</tr>' +
                '		    </thead>' +
                '		    <tbody>' +
                '		    </tbody>' +
                '		</table>' +
                '	    </div>' +
                '	</div>' +
                '	<!-- END EXAMPLE TABLE PORTLET-->' +
                '    </div>' +
                '</div>' +
                infosModal(conf)
                ;
    }

    function infosModal(conf) {
        return '<div id="module_' + conf.id + '_infos" class="modal fade" tabindex="-1">' + infosData() + '</div>';
    }

    function infosUpdateVal(selector, values) {
        for (var att in values)
            $(selector).find('#' + att).html(values[att]);
    }

    function infosData() {
        return  '<div class="modal-header">' +
                '    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
                '    <h4 class="modal-title">系统日志</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '    <div class="portlet box">' +
                '        <div class="portlet-body form">' +
                '            <!-- BEGIN FORM-->' +
                '            <form class="form-horizontal form-bordered">' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">日志日期:</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="ENTRY_DATE"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">日志级别:</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="CATEGORY"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">日志类型:</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="LOG_LEVEL"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">记录者:</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="RECORDER"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-2"></label>' +
                '                    <div class="col-md-10">' +
                '                        <p class="form-control-static" id="CONTENT"></p>' +
                '                    </div>' +
                '                </div>' +
                '            </form>' +
                '            <!-- END FORM-->' +
                '        </div>' +
                '    </div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '    <button class="btn blue" data-dismiss="modal" aria-hidden="true">确定</button>' +
                '</div>';
    }

    var LogLevels = {
        '0': '跟踪日志',
        '10': '调试信息',
        '20': '日志提示',
        '30': '警告',
        '40': '错误报告'
    };

    function getLogLevel(level) {
        return LogLevels[level] || '未知类型';
    }
    
    function getLogLevel2Sel(){
        var LogLevelsSel = [];
        for(var att in LogLevels)
            LogLevelsSel.push({id : att , text : LogLevels[att]});
        return LogLevelsSel;
    }

    function getSelectedRows(table) {
        var rows = [], cols = ['ENTRY_DATE', 'CATEGORY', 'CONTENT', 'LOG_LEVEL', 'RECORDER'];
        $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function () {
            var oData = {};
            $(this).parents('td').siblings('td').each(function () {
                oData[cols.shift()] = $(this).text();
            });
            rows.push(oData);
        });
        return rows;
    }
    
    function doLayoutCheck(){
        if (!$().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }
    
    function doLayoutDatepicker(){
        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            });
        }
    }
    
    function getSeachParam(moduleId){
        var param = {};
        param.combo = $('#loglevel_'+moduleId).val() || "";
        param.conText = $('#content_'+moduleId).val() || "";
        param.fTime = $('#fTime_'+moduleId).val() || "";
        param.sTime = $('#sTime_'+moduleId).val() || "";
        return param;
    }
    
    return {
        init: function (conf, appendHtml) {
            PageSystem.loadJS('/metronic/assets/global/plugins/select2/select2.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/datatables/media/js/jquery.dataTables.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min.js');
            
            appendHtml(panks(conf, []));
            $("#loglevel_" + conf.id , "#module_" + conf.id).select2({width: 'resolve', placeholder: "级别", allowClear: true, data: getLogLevel2Sel()});
            if (jQuery().dataTable) {
                $.fn.datepicker.defaults.language = "zh-CN";
                doLayoutCheck();
                doLayoutDatepicker();
                var table = $('#system_' + conf.id) , language = {
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
                };
                
                table.dataTable({
                    language: language,
                    searching: false,
                    bStateSave: true,
                    serverSide: true,
                    ajax: function (data, callback, settings) {
                        var param = getSeachParam(conf.id);
                        param.limit = data.length;
                        param.start = data.start;
                        param.page = (data.start / data.length)+1;
                        $.ajax({
                            type: "GET",
                            url: "/bin/log/Log.jcp",
                            cache: false,
                            data: param,
                            dataType: "json",
                            success: function (result) {
                                var returnData = {};
                                returnData.draw = data.draw;
                                returnData.recordsTotal = result.totalNumber;
                                returnData.recordsFiltered = result.totalNumber;
                                returnData.data = result.data;
                                callback(returnData);
                                doLayoutCheck();
                            }
                        });
                    },
                    columns: [{
                            orderable: false,
                            data: null,
                            render: function (data, type, row, meta) {
                                return data = '<input type="checkbox" class="checkboxes" value="1"/>';
                            }
                        },{
                            "data" : "ENTRY_DATE",
                            "orderable": false
                        }, {
                            "data" : "CATEGORY",
                            "orderable": false
                        }, {
                            "data" : "CONTENT",
                            "orderable": false
                        }, {
                            "data" : "LOG_LEVEL",
                            "orderable": false,
                            "render": function(data,type,row,meta){
                                return data = getLogLevel(data);
                            }
                        }, {
                            "data" : "RECORDER",
                            "orderable": false
                        }],
                    "pageLength": 10,
                    "pagingType": "bootstrap_full_number",
                    "order": [
                        [1, "desc"]
                    ]
                });
                var tableWrapper = jQuery('#system_' + conf.id + '_wrapper');
                table.find('.group-checkable').change(function () {
                    var set = jQuery(this).attr("data-set");
                    var checked = jQuery(this).is(":checked");
                    jQuery(set).each(function () {
                        if (checked) {
                            $(this).attr("checked", true);
                            $(this).parents('tr').addClass("active");
                        } else {
                            $(this).attr("checked", false);
                            $(this).parents('tr').removeClass("active");
                        }
                    });
                    jQuery.uniform.update(set);
                });
                table.on('change', 'tbody tr .checkboxes', function () {
                    $(this).parents('tr').toggleClass("active");
                });
                tableWrapper.find('.dataTables_length select').addClass("form-control input-xsmall input-inline"); // modify table per page dropdown
                $('#module_' + conf.id).on('click', 'button', function (e) {
                    e.preventDefault();
                    var btnId;
                    if(btnId = $(e.target).attr("id")){
                        if(btnId.endsWith("_search")){
                            table.api().draw();
                        } else if(btnId.endsWith("_infos")){
                            var rows = getSelectedRows(tableWrapper);
                            if (!rows || !rows.length || rows.length !== 1) {
                                Metronic.alert({
                                    type: 'danger',
                                    icon: 'warning',
                                    message: (!rows || !rows.length) ? '请选择需要查看的数据' : '只能选择一条数据查看',
                                    container: tableWrapper,
                                    place: 'prepend'
                                });
                                return;
                            }
                            var infoId = '#module_' + conf.id + '_infos';
                            infosUpdateVal(infoId, rows[0]);
                            $(infoId).modal();
                        }
                    }
                });
            }
        }
    };
})();
