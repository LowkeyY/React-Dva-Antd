(function(){
    
    function getTabs(moduleId){
        return  '<div class="row" id="module_'+moduleId+'"> ' + 
                '    <div class="col-md-12"> ' + 
                '		<div class="portlet box blue"> ' + 
                '		    <div class="portlet-title"> ' + 
                '				<div class="caption"><i class="fa fa-file-o"></i>访问日志</div> ' + 
                '				<div class="tools">' + 
                '					<a href="" class="fullscreen" data-original-title="" title=""></a> ' + 
                '				    <a href="javascript:;" class="reload"></a> ' + 
                '				</div> ' + 
                '		    </div> ' + 
                '		    <div class="portlet-body"> ' + 
                '				<div id="'+moduleId+'" class="tabbable-custom " >' + 
                '					<ul class="nav nav-tabs ">' + 
                '						<li class="">' + 
                '							<a href="#'+moduleId+'_1" data-toggle="tab" aria-expanded="false">访问统计</a>' + 
                '						</li>' + 
                '						<li class="active">' + 
                '							<a href="#'+moduleId+'_2" data-toggle="tab" aria-expanded="false">访问列表</a>' + 
                '						</li>' + 
                '						<li class="">' + 
                '							<a href="#'+moduleId+'_3" data-toggle="tab" aria-expanded="false">系统访问曲线</a>' + 
                '						</li>' + 
                '						<li class="">' + 
                '							<a href="#'+moduleId+'_4" data-toggle="tab" aria-expanded="false">用户访问统计曲线</a>' + 
                '						</li>' + 
                '					</ul>' + 
                '					<div class="tab-content">' +
                '                           <div class="col-md-2">' +
                '                               <input class="form-control" id="loglevel_'+ moduleId +'" name="loglevel_'+ moduleId +'" type="hidden">' +
                '                           </div>' +
                '                           <div class="col-md-3">'+
                '                              <div class="input-group input-large date-picker input-daterange" data-date="2012/10/11" data-date-format="yyyy/mm/dd">'+
                '                                 <input type="text"  id="fTime_'+moduleId+'" class="form-control" name="fTime" placeholder="开始时间">'+
                '                                  <span class="input-group-addon"> 至 </span>'+
                '                                   <input type="text"  id="sTime_'+moduleId+'" class="form-control" name="sTime" placeholder="结束时间">'+
                '                               </div>'+
                '                           </div>'+
                '                           <div class="col-md-2">' +
                '                               <div class="clearfix">' +
                '                                   <button id="btn_' + moduleId + '_search" class="btn yellow">' +
                '                                       过滤 <i class="fa fa-search"></i>' +
                '                                   </button>' +
                '                               </div>' +
                '                           </div>' +
                '						<div class="tab-pane" id="'+moduleId+'_1">' + 
                '						</div>' + 
                '						<div class="tab-pane" id="'+moduleId+'_2">' + 
                '						</div>' + 
                '						<div class="tab-pane" id="'+moduleId+'_3">' + 
                '                                                    <img src="/bin/user/images/34385822676885.jpg">' +
                '						</div>' + 
                '						<div class="tab-pane" id="'+moduleId+'_4">' + 
                '                                                    <img src="/bin/user/images/6519327810620.jpg">' +
                '						</div>' + 
                '					</div>' + 
                '				</div>' + 
                '			</div>' + 
                '		</div>' + 
                '	</div>' + 
                '</div>';
    }
    var maps = {
        1 : "/bin/log/getstastic.jcp",
        2 : "/bin/log/userstat.jcp",
        3 : "/bin/log/pic.jcp",
        4 : "/bin/log/pic.jcp"
    }
    
    function getHtml(moduleId){
        var tabNum = moduleId && moduleId.substr(moduleId.length - 1) || -1 , url = maps[tabNum] || "";
        if(tabNum > -1 && url){
           $.ajax({
                type: "get",
                dataType: "json",
                url: url,
                
                success: function (result) {
                    var seletor = $(moduleId);
                    seletor.html(moduleId.endsWith("_1") ? panks(seletor.attr("id") , result.dataItem) : pank(seletor.attr("id") , result.dataItem));
                   
                   //时间汉化
                    if (jQuery().datepicker) {
                                $('.date-picker').datepicker({
                                    rtl: Metronic.isRTL(),
                                    orientation: "left",
                                    autoclose: true
                                });
                            }
                    
                    boforeLayout();
                    moduleId.endsWith("_1") ? doLayoutTable(seletor.attr("id")) : doLayoutTable1(seletor.attr("id"));
                    afterLayout(seletor.attr("id"));
                }
            }) 
        }
    }
    
    function boforeLayout(){
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
    
    function doLayoutTable(moduleId){
        if(!$().dataTable){
            return;
        }
        var table = $("#table_"+moduleId);
        table.dataTable({
            "searching": false ,
            //"lengthChange": false,
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "无数据",
                "info": "显示 _START_ 至 _END_ 条，共 _TOTAL_ 条数据",
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
            "bStateSave": true,
            "columns": [{
                    "orderable": true,
                    "width": "20%"
                }, {
                    "width": "20%",
                    "orderable": true
                }, {
                    "width": "20%",
                    "orderable": true
                }, {
                    "width": "20%",
                    "orderable": true
                }, {
                    "width": "20%",
                    "orderable": true
                }],
            "pageLength": 10,
            "pagingType": "bootstrap_full_number",
            "columnDefs": [{
                    'orderable': false,
                    'targets': [0]
                },{
                    "searchable": false,
                    "targets": [0]
                }],
            "order": [
                [1, "desc"]
            ]
        });
    }
    
    function doLayoutTable1(moduleId){
        if(!$().dataTable){
            return;
        }
        var table = $("#table_"+moduleId);
        table.dataTable({
            "searching": false ,
            //"lengthChange": false,
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "无数据",
                "info": "显示 _START_ 至 _END_ 条，共 _TOTAL_ 条数据",
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
            "bStateSave": true,
            "columns": [{
                    "orderable": true
                }, {
                    "orderable": true
                }, {
                    "orderable": true
                }, {
                    "orderable": true
                }],
            "pageLength": 10,
            "pagingType": "bootstrap_full_number",
            "columnDefs": [{
                    'orderable': false,
                    'targets': [0]
                },{
                    "width": "20%", 
                    "targets": [0]
                },{
                    "width": "20%", 
                    "targets": [1]
                },{
                    "width": "20%", 
                    "targets": [2]
                },{
                    "width": "20%", 
                    "targets": [3]
                },{
                    "searchable": false,
                    "targets": [0]
                }],
                    "order": [
                     [1, "desc"]
            ]
        });
    }
    
    function afterLayout(moduleId){
        if(!$().dataTable){
            return;
        }
        var table = $("#table_"+moduleId) ,tableWrapper = jQuery('#table_' + moduleId + '_wrapper');
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
        tableWrapper.find('.dataTables_length select').addClass("form-control input-xsmall input-inline");
    }
    
    function panks(moduleId , items) {
        return  '<table class="table table-striped table-bordered table-hover" id="table_' + moduleId + '">' +
                '    <thead>' +
                '	<tr>' +
                '	    <th>日期</th>' +
                '	    <th>当日访问人数</th>' +
                '	    <th>当日访问人次</th>' +
                '	    <th>当日使用时间(分钟)</th>' +
                '	    <th>单次停留(分钟)</th>' +
                '	</tr>' +
                '    </thead>' +
                '    <tbody>' + panksItem1(items) +
                '    </tbody>' +
                '</table>' ;
    }
    
    function panksItem1(items) {
        var html = [];
        if (items)
            $.each(items, function (i, item) {
                html.push('<tr class="odd gradeX">' +
                        '   <td>' + item.日期 + '</td>' +
                        '   <td>' + item.当日访问人数 + '</td>' +
                        '   <td>' + item.当日访问人次 + ' </td>' +
                        '   <td>' + item["当日使用时间(分钟)"] + '</td>' +
                        '   <td>' + item["单次停留(分钟)"] + '</td>' +
                        '</tr>');
            });
        return html.join("\n");
    }
    
    function pank(moduleId , items) {
        return  '<table class="table table-striped table-bordered table-hover" id="table_' + moduleId + '">' +
                '    <thead>' +
                '	<tr>' +
                '	    <th>姓名</th>' +
                '	    <th>访问次数</th>' +
                '	    <th>使用时间(分钟)</th>' +
                '	    <th>最后访问时间</th>' +
                '	</tr>' +
                '    </thead>' +
                '    <tbody>' + panksItem(items) +
                '    </tbody>' +
                '</table>' ;
    }
    
    function panksItem(items) {
        var html = [];
        if (items)
            $.each(items, function (i, item) {
                html.push('<tr class="odd gradeX">' +
                        '   <td>' + item.姓名 + '</td>' +
                        '   <td>' + item.访问次数 + '</td>' +
                        '   <td>' + item["使用时间(分钟)"] + '</td>' +
                        '   <td>' + item["最后访问时间"] + '</td>' +
                        '</tr>');
            });
        return html.join("\n");
    }
    
    function getSeachParam(moduleId){
        var param = {};
        param.combo = $('#loglevel_'+moduleId).val() || "";
        param.conText = $('#content_'+moduleId).val() || "";
        param.fTime = $('#fTime_'+moduleId).val() || "";
        param.sTime = $('#sTime_'+moduleId).val() || "";
        return param;
    }
    
    function getLogLevel2Sel(){
        var LogLevelsSel = [];
        for(var att in LogLevels)
            LogLevelsSel.push({id : att , text : LogLevels[att]});
        return LogLevelsSel;
    }
    
    return {
        init : function(conf , appendHtml){
            PageSystem.loadJS('/metronic/assets/global/plugins/select2/select2.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/datatables/media/js/jquery.dataTables.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min.js');
            
            $.fn.datepicker.defaults.language = "zh-CN";
            
//            appendHtml(getTabs(moduleId, []));
           
            
            appendHtml(getTabs(conf.id) , function(){
                
                $('#'+conf.id).on('click', 'li > a', function (el) {
                    var clickId = $(el.target).attr("href") || "" , selector;
                    if(clickId && (selector = $(clickId))){
                        if(clickId.endsWith("_1") || clickId.endsWith("_2") || clickId.endsWith("_3") || clickId.endsWith("_4"))
                            getHtml(clickId);
                        else
                            selector.html(clickId);
                    }
                });
                $('#'+conf.id).find('a:first').trigger("click");
            });
        }
    }
})()