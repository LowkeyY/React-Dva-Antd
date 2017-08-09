/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Metronic */

(function () {
    function panks(conf, items) {
        return  '<div class="row" id="module_' + conf.id + '">' +
                '   <div class="col-md-12">' +
                '	<!-- BEGIN EXAMPLE TABLE PORTLET-->' +
                '	<div class="portlet box blue">' +
                '	       <div class="portlet-title">' +
                '                   <div class="caption">' +
                '		    <i class="fa fa-file-o"></i>集成管理' +
                '                   </div>' +
                '                   <div class="tools">' +
                '                   <a href="" class="fullscreen" data-original-title="" title="">' +
                '                   </a>' +
                '		    <a href="javascript:;" class="reload">' +
                '		    </a>' +
                '                   </div>' +
                '	      </div>' +
                '                  <div class="portlet-body">' +
                '                       <div class="table-toolbar">' +
                '                            <div class="row">' +
                '                               <div class="portlet-body">' +
                '			    <ul class="nav nav-tabs">'+
                '                              <li><a href="#tab_1_1" data-toggle="tab">百度-万年历</a></li>'+
                '                              <li><a href="#tab_1_2" data-toggle="tab">天气</a></li>'+
                '                              <li><a href="#tab_1_3" data-toggle="tab">即时通讯</a></li>'+
                '                              <li><a href="#tab_1_4" data-toggle="tab">邮箱邮件</a></li>'+
                '                              <li><a href="#tab_1_5" data-toggle="tab">网易新闻</a></li>'+
                '                              <li><a href="#tab_1_6" data-toggle="tab">公文流转系统</a></li>'+
                '                              <li><a href="#tab_1_7" data-toggle="tab">待处理消息</a></li>'+
                '                            </ul>'+
                '                               </div>'+
                '                             <p align="right"><div class="form-group">'+
		'					<div class="col-md-4" style="float:right;">'+
		'								<div class="test"><label class="control-label col-md-3"><br/>选择日期:</label></div>'+
		'                                                   <div class="input-group input-large date-picker input-daterange" data-date="10/11/2012" id="regDate" data-date-format="yyyy/mm/dd">'+
		'										<input type="text" class="form-control" name="from">'+
		'										<span class="input-group-addon">'+
		'										至 </span>'+
		'										<input type="text" class="form-control" name="to">'+
		'                                                   </div>'+
                '                                        </div><br/>'+
                '                                           <div class="tab-content">'+
                '                                               <div class="tab-pane fade active in" id="tab_1_1">'+
                '                                                   <table class="table table-striped table-bordered table-hover" id="system_' + conf.id + '">' +
                '                                                       <thead>' +
                '                                                           <tr>' +
                '                                                                <th class="table-checkbox">' +
                '                                                                        <input type="checkbox" class="group-checkable" data-set="#system_' + conf.id + ' .checkboxes"/>' +
                '                                                                </th>' +
                '                                                               <th>日期</th>' +
                '                                                               <th>当日访问人数</th>' +
                '                                                               <th>当次访问人数</th>' +
                '                                                               <th>当日使用时间(分钟)</th>' +
                '                                                               <th>单次停留时间(分钟)</th>' +
                '                                                           </tr>' +
                '                                                       </thead>' +
                '                                                           <tbody>' + panksItems(items) +
                '                                                           </tbody>' +
                '                                                   </table>' +
                '                                               </div>'+
                '                                                       <div class="tab-pane fade" id="tab_1_2" style="float:center;">'+
                '                                                               <br/><br/><table class="table table-striped table-bordered table-hover" id="systems_' + conf.id + '">' +
                '                                                                    <thead>' +
                '                                                                             <tr align="center">' +
                '                                                                                   <th>姓名</th>' +
                '                                                                                   <th>访问次数</th>' +
                '                                                                                   <th>使用时间(分钟)</th>' +
                '                                                                                   <th>最后访问时间</th>' +
                '                                                                              </tr>' +
                '                                                                    </thead>' +
                '                                                               </table>' +
                '                                                       </div>'+
                '                <div class="tab-pane fade" id="tab_1_3">'+
                '                       </br><h3 align="center">系统访问统计</h3>' +
                '                </div>'+
                '               <div class="tab-pane fade" id="tab_1_4">'+
                '                       </br><h3 align="center">人员访问统计</h3>' +
                '                </div>'+
                '                </div>'+
                '			</div>' +
                '		    </div>' +
                '		</div>' +
                '           </div>'+
                '         </div>'+
                '	<!-- END EXAMPLE TABLE PORTLET-->' +
                '      </div>' +
                '    </div>' +
              
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
                '    <h4 class="modal-title">集成管理</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '    <div class="portlet box">' +
                '        <div class="portlet-body form">' +
                '            <!-- BEGIN FORM-->' +
                '            <form class="form-horizontal form-bordered">' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">日期</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="ENTRY_DATE"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">当日访问人数</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="CATEGORY"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">当次访问人数</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="LOG_LEVEL"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-4">单日使用时间(分钟)</label>' +
                '                    <div class="col-md-8">' +
                '                        <p class="form-control-static" id="RECORDER"></p>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                    <label class="control-label col-md-2">单次停留时间(分钟)</label>' +
                '                    <div class="col-md-10">' +
                '                        <p class="form-control-static" id="CONTENT"></p>' +
                '                    </div>' +
                '                </div>' +
                '            </form>' +
                '            <!-- END FORM-->' +
                '        </div>' +
                '    </div>' +
                '</div>' +
                '        <style type="text/css">'+
                '   .test{height:15px;}'+
                '  </style>'
                
    }

    var LogLevels = {
        '0': '跟踪日志',
        '10': '调试信息',
        '20': '日志提示',
        '30': '警告',
        '40': '错误报告'
    };

   
    function panksItems(items) {
        var html = [];
        if (items)
            $.each(items, function (i, item) {
                html.push('<tr class="odd gradeX">' +
                        '   <td>' +
                        '	<input type="checkbox" class="checkboxes" value="1"/>' +
                        '   </td>' +
                        '   <td>' + item.日期 + '</td>' +
                        '   <td>' + item.当日访问人数 + '</td>' +
                        '   <td>' + item.当日访问人次 + ' </td>' +
                        '   <td>' + item["当日使用时间(分钟)"] + '</td>' +
                        '   <td>' + item["单次停留(分钟)"] + '</td>' +
                        '</tr>');
            });
        return html.join("\n");
    }
           
     
        function getSelectedRows(table){
            var rows =[], rows =['ENTRY_DATE', 'CATEGONTENT','LOG_LEVEL','RECORDER'];
            $('tbody>tr>td:nth-child(1) input[type="checkbox"]:checked',table).each(function (){
                var oData = {};
                $(this).patents('td').siblings('td').each(function(){
                           oData[cols.shoft()] = $(this).text();
                        })
                        rows.push(oData);
                      });
                   return rows;   
    }
    
    return {
        init: function (conf, callback) {
            PageSystem.loadJS('/metronic/assets/global/plugins/select2/select2.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/datatables/media/js/jquery.dataTables.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min.js');
            $.fn.datepicker.defaults.language = "zh-CN";
            $.ajax({
                type: "get",
                dataType: "json",
                url: "/bin/log/getstastic.jcp",
                complete: function (response) {
                    var result = JSON.parse(response.responseText);
                    if (result.dataItem) {
                        callback(panks(conf, result.dataItem), function () {
                            if (jQuery().datepicker) {
                                $('.date-picker').datepicker({
                                    rtl: Metronic.isRTL(),
                                    orientation: "left",
                                    autoclose: true
                                    
                                });
                            }
                            if (jQuery().dataTable) {
                                (function () {
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
                                })();
                                var table = $('#system_' + conf.id);
                                // begin first table
                                table.dataTable({
//                                "lengthChange": false,
                                    "searching":false,
                                    // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                                    "language": {
                                        "aria": {
                                            "sortAscending": ": activate to sort column ascending",
                                            "sortDescending": ": activate to sort column descending"
                                        },
                                        "emptyTable": "无数据",
                                        "info": "",
                                        "infoEmpty": "没有数据",
                                        "infoFiltered": "",
                                        "lengthMenu": "",
                                        "zeroRecords": "无数据",
                                        "paginate": {
                                            "previous": "上一页",
                                            "next": "下一页",
                                            "last": "末页",
                                            "first": "首页"
                                        }
                                    },
                                    // Or you can use remote translation file
                                    //"language": {
                                    //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
                                    //},

                                    // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                                    // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
                                    // So when dropdowns used the scrollable div should be removed. 
                                    //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

                                    "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                                    "columns": [{
                                            "orderable": false
                                        }, {
                                            "orderable": true
                                        }, {
                                            "orderable": false
                                        }, {
                                            "orderable": false
                                        }, {
                                            "orderable": true
                                        }, {
                                            "orderable": false
                                        }],
//                                "lengthMenu": [
//                                    [5, 15, 20, -1],
//                                    [5, 15, 20, "All"] // change per page values here
//                                ],
                                    // set the initial value
                                    "pageLength": 10,
                                    "pagingType": "bootstrap_full_number",
                                    "columnDefs": [{// set default column settings
                                            'orderable': false,
                                            'targets': [0]
                                        }, {
                                            "searchable": false,
                                            "targets": [0]
                                        }],
                                    "order": [
                                        [1, "desc"]
                                    ] // set first column as a default sort by asc
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
                                    var rows = getSelectedRows(tableWrapper);
                                    if (!rows || !rows.length || rows.length !== 1) {
                                        Metronic.alert({
                                            type: 'danger',
                                            icon: 'warning',
                                            message: (!rows || !rows.length) ? '请选择需要查看的数据' : '只能',
                                            container: tableWrapper,
                                            place: 'prepend'
                                        });
                                        return;
                                    }

                                    var infoId = '#module_' + conf.id + '_infos';
                                    infosUpdateVal(infoId, rows[0]);
                                    $(infoId).modal();
                                });
                            }
                        });
                    }
                }
            });
            
        }
    };
})();
