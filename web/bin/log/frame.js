(function () {
    var isFirstLoad = true;

    function getTabs(moduleId) {
        return '<div class="row" id="module_' + moduleId + '"> ' + '    <div class="col-md-12"> ' + '		<div class="portlet box blue"> ' + '		    <div class="portlet-title"> ' + '				<div class="caption"><i class="fa fa-file-o"></i>访问日志</div> ' + '				<div class="tools">' + '					<a href="" class="fullscreen" data-original-title="" title=""></a> ' + '				    <a href="javascript:;" class="reload"></a> ' + "				</div> " + "		    </div> " + '		    <div class="portlet-body"> ' + '				<div id="' + moduleId + '" class="tabbable-custom ">' + '					<ul class="nav nav-tabs ">' + '						<li class="">' + '							<a href="#' + moduleId + '_1" data-toggle="tab" aria-expanded="false">访问统计</a>' + "						</li>" + '						<li class="active">' + '							<a href="#' + moduleId + '_2" data-toggle="tab" aria-expanded="false">访问列表</a>' + "						</li>" + '						<li class="">' + '							<a href="#' + moduleId + '_3" data-toggle="tab" aria-expanded="false">系统访问曲线</a>' + "						</li>" + '						<li class="">' + '							<a href="#' + moduleId + '_4" data-toggle="tab" aria-expanded="false">用户访问统计曲线</a>' + "						</li>" + "					</ul>" + '					<div class="tab-content">' + '						<div class="tab-pane" id="' + moduleId + '_1">' + getTableBar(moduleId + "_1") + "						</div>" + '						<div class="tab-pane" id="' + moduleId + '_2">' + getTableBar(moduleId + "_2") + "						</div>" + '						<div class="tab-pane" id="' + moduleId + '_3">' + getTableBar(moduleId + "_3") + "						</div>" + '						<div class="tab-pane" id="' + moduleId + '_4">' + getTableBar(moduleId + "_4") + "						</div>" + "					</div>" + "				</div>" + "			</div>" + "		</div>" + "	</div>" + "</div>";
    }

    function getTableBar(moduleId) {
        return '		<div class="table-toolbar">' + '		    <div class="row">' + '			<div class="col-md-12">' + '                           <div class="col-md-3">' + '                              <div class="input-group input-large date-picker input-daterange" data-date="2012/10/11" data-date-format="yyyy/mm/dd">' + '                                 <input type="text"  id="fTime_' + moduleId + '" class="form-control" name="fTime" placeholder="开始时间">' + '                                  <span class="input-group-addon"> 至 </span>' + '                                   <input type="text"  id="sTime_' + moduleId + '" class="form-control" name="sTime" placeholder="结束时间">' + "                               </div>" + "                           </div>" + '                           <div class="col-md-2">' + '                               <div class="clearfix">' + '                                   <button id="btn_' + moduleId + '_search" class="btn yellow">' + '                                       过滤 <i class="fa fa-search"></i>' + "                                   </button>" + "                               </div>" + "                           </div>" + "			</div>" + "		    </div>" + "		</div>" + '               <div id="content_' + moduleId + '"></div>';
    }

    var defaultConfig = {
        1: {
            url: "/bin/log/getstastic.jcp",
            columns: [{
                orderable: false, data: null, render: function (data, type, row, meta) {
                    return data = '<input type="checkbox" class="checkboxes" value="1"/>';
                }
            }, {"data": "日期", "orderable": false}, {"data": "当日访问人数", "orderable": false}, {
                "data": "当日访问人次",
                "orderable": false
            }, {"data": "当日使用时间(分钟)", "orderable": false}, {"data": "单次停留(分钟)", "orderable": false}]
        },
        2: {
            url: "/bin/log/userstat.jcp",
            columns: [{
                orderable: false, data: null, render: function (data, type, row, meta) {
                    return data = '<input type="checkbox" class="checkboxes" value="1"/>';
                }
            }, {"data": "姓名", "orderable": false}, {"data": "访问次数", "orderable": false}, {
                "data": "使用时间(分钟)",
                "orderable": false
            }, {"data": "最后访问时间", "orderable": false}]
        },
        3: {url: "/bin/log/pic.jcp?curve=1&view=1"},
        4: {url: "/bin/log/pic.jcp?curve=2&order=2&view=2"}
    };

    function getDate2Str(d) {
        d = d || new Date();
        return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    }

    function getFilters(moduleId) {
        var first = $("#fTime_" + moduleId).val() || "", second = $("#sTime_" + moduleId).val() || "";
        if (!first && !second) {
            first = getDate2Str(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
            $("#fTime_" + moduleId).val(first);
            second = getDate2Str(new Date());
            $("#sTime_" + moduleId).val(second);
        }
        var param = {};
        param.first = first;
        param.second = second;
        return param;
    }

    function getHtml(moduleId) {
        doLayoutCheck(moduleId);
        var tabNum = moduleId && moduleId.substr(moduleId.length - 1) || -1, options = defaultConfig[tabNum] || "";
        if ($().dataTable && tabNum > -1 && options) {
            var table = $("#table_" + moduleId);
            table.dataTable({
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
                    "paginate": {"previous": "上一页", "next": "下一页", "last": "末页", "first": "首页"}
                },
                "bStateSave": true,
                "columns": options.columns,
                searching: false,
                serverSide: true,
                ajax: function (data, callback, settings) {
                    var param = getFilters(moduleId);
                    param.limit = data.length;
                    if (isFirstLoad) {
                        isFirstLoad = false;
                        param.start = 0;
                    } else {
                        param.start = data.start;
                    }
                    param.page = (data.start / data.length) + 1;
                    $.ajax({
                        type: "GET",
                        url: options.url,
                        cache: false,
                        data: param,
                        dataType: "json",
                        success: function (result) {
                            var returnData = {};
                            returnData.draw = data.draw;
                            returnData.recordsTotal = result.totalCount;
                            returnData.recordsFiltered = result.totalCount;
                            returnData.data = result.dataItem;
                            callback(returnData);
                            doLayoutCheck(moduleId);
                            afterLayout(moduleId);
                        }
                    });
                },
                "pageLength": 10,
                "pagingType": "bootstrap_full_number",
                "columnDefs": [{"orderable": false, "targets": [0]}, {"searchable": false, "targets": [0]}],
                "order": [[1, "desc"]]
            });
            $("#" + moduleId).on("click", "button", function (e) {
                e.preventDefault();
                var btnId;
                if (btnId = $(e.target).attr("id")) {
                    if (btnId.endsWith("_search")) {
                        table.api().draw();
                    }
                }
            });
        }
    }

    function doLayoutCheck(moduleId) {
        if (!$().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)", $("#" + moduleId));
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }

    function doLayoutDatepicker() {
        if (jQuery().datepicker) {
            $(".date-picker").datepicker({rtl: Metronic.isRTL(), orientation: "left", autoclose: true});
        }
    }

    function afterLayout(moduleId) {
        if (!$().dataTable) {
            return;
        }
        var table = $("#table_" + moduleId), tableWrapper = jQuery("#table_" + moduleId + "_wrapper");
        table.find(".group-checkable").change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                    $(this).parents("tr").addClass("active");
                } else {
                    $(this).attr("checked", false);
                    $(this).parents("tr").removeClass("active");
                }
            });
            jQuery.uniform.update(set);
        });
        table.on("change", "tbody tr .checkboxes", function () {
            $(this).parents("tr").toggleClass("active");
        });
        tableWrapper.find(".dataTables_length select").addClass("form-control input-xsmall input-inline");
    }

    function getImageSrc(moduleId) {
        var param = getFilters(moduleId);
        var tabNum = moduleId && moduleId.substr(moduleId.length - 1) || -1, options = defaultConfig[tabNum] || "";
        if (options) {
            var w = $("#" + moduleId).parent().width();
            return options.url + "&firtim=" + param.first + "&sectim=" + param.second + "&height=800&width=" + w + "&ran=" + Math.random();
        }
        return "";
    }

    function getImage(moduleId) {
        var src;
        return (src = getImageSrc(moduleId)) && "<img src=" + src + "/>" || "";
    }

    function panks(moduleId, items) {
        return '<table class="table table-striped table-bordered table-hover" id="table_' + moduleId + '">' + "    <thead>" + "	<tr>" + '	    <th class="table-checkbox">' + '               <input type="checkbox" class="group-checkable" data-set="#table_' + moduleId + ' .checkboxes"/>' + "	    </th>" + panksItems(items) + "	</tr>" + "    </thead>" + "    <tbody>" + "    </tbody>" + "</table>";
    }

    function panksItems(items) {
        var html = [];
        if (items) {
            $.each(items, function (i, item) {
                html.push("<th>" + item + "</th>");
            });
        }
        return html.join("\n");
    }

    return {
        init: function (conf, appendHtml) {
            PageSystem.loadJS("/metronic/assets/global/plugins/select2/select2.min.js");
            PageSystem.loadJS("/metronic/assets/global/plugins/datatables/media/js/jquery.dataTables.js");
            PageSystem.loadJS("/metronic/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js");
            PageSystem.loadJS("/metronic/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js");
            PageSystem.loadJS("/metronic/assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min.js");
            appendHtml(getTabs(conf.id), function () {
                $.fn.datepicker.defaults.language = "zh-CN";
                $("#" + conf.id).on("click", "li > a", function (el) {
                    var clickId = $(el.target).attr("href") || "", selector;
                    if (clickId && (selector = $(clickId))) {
                        var content = $("#content_" + selector.attr("id"), selector);
                        if (!content) {
                            return;
                        }
                        if (clickId.endsWith("_1|_2")) {
                            content.html(panks(selector.attr("id"), clickId.endsWith("_1") ? ["日期", "当日访问人数", "当日访问人次", "当日使用时间(分钟)", "单次停留(分钟)"] : ["姓名", "访问次数", "使用时间(分钟)", "最后访问时间"]));
                            doLayoutDatepicker();
                            getHtml(selector.attr("id"));
                        } else {
                            if (clickId.endsWith("_3|_4")) {
                                content.html(getImage(selector.attr("id")), content);
                                selector.on("click", "button", function (e) {
                                    e.preventDefault();
                                    var btnId;
                                    if (btnId = $(e.target).attr("id")) {
                                        if (btnId.endsWith("_search")) {
                                            content.html(getImage(selector.attr("id")));
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
                $("#" + conf.id).find("a:first").trigger("click");
            });
        }
    };
})();