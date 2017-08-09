(function () {
    var rightHtml = '<div class="portlet box red-pink ">' + '<div class="portlet-title">' + '<div class="caption">' + '<i class="fa fa-gift"></i> 组织机构管理' + "</div>" + "</div>" + '<div class="portlet-body form">' + '<form class="form-horizontal" role="form">' + '<div class="form-body">' + '<div style="margin-bottom:20px">' + '<div class="row">' + '<div class="col-md-offset-1 col-md-9">' + '<button class="btn red-pink " id="create">新建</button>' + '<button  class="btn red-pink" id="delete">删除</button>' + '<button  class="btn red-pink" id="save">修改</button>' + "</div>" + "</div>" + "</div>" + '<div class="form-group">' + '<label class="col-md-3 control-label">名称：<span class="required" aria-required="true">*</span></label>' + '<div class="col-md-9">' + '<div class="input-icon right">' + '<input type="text" class="form-control input-inline input-medium " id="name" name="name" >' + "</div>" + "</div></div>" + '<div class="form-group">' + '<label class="col-md-3 control-label">单位类型：<span class="required" aria-required="true">*</span></label>' + '<div class="col-md-9">' + '<select class="form-control input-medium" id="type">' + "</select>" + "</div>" + "</div>" + '<div class="form-group">' + '<label class="col-md-3 control-label">优先顺序：</label>' + '<div class="col-md-9">' + '<input type="text" class="form-control input-inline input-medium " id="order">' + "</div>" + "</div>" + '<div class="form-group">' + '<label class="col-md-3 control-label">创建时间：</label>' + '<div class="col-md-9">' + '<input type="text" class="form-control input-inline input-medium "  readonly= "true " id="create-time">' + "</div>" + "</div>" + '<div class="form-group">' + '<label class="col-md-3 control-label">单位全称：<span class="required" aria-required="true">*</span></label>' + '<div class="col-md-9">' + '<input type="text" class="form-control input-inline input-medium" id="company-name" name="company-name">' + "</div>" + "</div>" + "</div>" + "</form>" + "</div>" + "</div>";
    var datatableHead = "", numberCounts = 1, currentSelectDeptId = "";

    function getToolsId(id, type) {
        return "tools_" + (id ? id : numberCounts++) + (type ? "_" + type : "");
    }

    function panks(conf) {
        return '<div class="row" id="module_' + conf.id + '">' + '    <div class="col-md-12">' + '	<div class="portlet">' + '	    <div class="portlet-title">' + '		<div class="caption">' + '		    <i class="fa fa-user"></i>组织机构管理' + "		</div>" + '		<div class="tools">' + '                   <a href="" class="fullscreen" data-original-title="" title="">' + "                   </a>" + "		</div>" + "	    </div>" + '	    <div class="portlet-body">' + panksLeft(conf) + panksRight() + "           </div>" + "       </div>" + "   </div>" + "</div>";
    }

    function panksLeft(conf) {
        return '<div class="profile-sidebar">' + '    <div class="portlet red-pink box">' + '        <div class="portlet-title">' + '            <div class="caption">' + '                <i class="fa fa-users"></i>组织结构导航' + "            </div>" + '            <div class="tools">' + '                <a href="javascript:;" class="collapse">' + "                </a>" + "            </div>" + "        </div>" + '        <div class="portlet-body">' + '            <div id="tree_' + conf.id + '" class="tree-demo">' + "            </div>" + "        </div>" + "    </div>" + "</div>";
    }

    function panksRight() {
        return '<div class="profile-content">' + rightHtml + "</div>";
    }

    function getDate(id) {
        $.ajax({
            type: "get",
            url: "/bin/user/create.jcp?dept_id=" + id + "&type=view",
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("#name").val(data.deptName);
                $("#order").val(data.sort_id);
                $("#create-time").val(data.createDateModify);
                $("#company-name").val(data.shortName);
                var options = $.parseJSON(data.dept);
                console.log(options);
                var html = "";
                for (var i = 0; i < options.length; i++) {
                    html += "<option value='" + options[i][0] + "'>" + options[i][1] + "</option>";
                }
                $("#type").html(html);
                $("#type").find("option[value=" + data.deptType + "]").attr("selected", true);
            }
        });
    }

    return {
        init: function (conf, appendHtml) {
            PageSystem.loadJS("/metronic/assets/global/plugins/jstree/dist/jstree.min.js");
            PageSystem.loadJS("/newhome/PageDatatable.js");
            PageSystem.loadJS("/metronic/assets/global/plugins/bootstrap-select/bootstrap-select.min.js");
            PageSystem.loadJS("/metronic/assets/global/plugins/select2/select2.min.js");
            PageSystem.loadJS("/metronic/assets/global/plugins/jquery-validation/js/jquery.validate.min.js");
            appendHtml(panks(conf), function () {
                $("#tree_" + conf.id).jstree({
                    "core": {
                        "themes": {"responsive": false},
                        "check_callback": true,
                        "data": {
                            "url": "/bin/user/_getOrg.jjs", "data": function (node) {
                                return {"parent": node.id};
                            }
                        }
                    },
                    "types": {
                        "default": {"icon": "fa fa-folder icon-state-warning icon-lg"},
                        "file": {"icon": "fa fa-file icon-state-warning icon-lg"}
                    },
                    "state": {"key": "demo3"},
                    "plugins": ["dnd", "state", "types"]
                }).on("changed.jstree", function (e, data) {
                    if (data && data.selected && data.selected.length) {
                        currentSelectDeptId = data.selected[0];
                        if (data.selected) {
                        }
                        getDate(currentSelectDeptId);
                        console.log(currentSelectDeptId);
                    }
                });
                $("#create").on("click", function (e) {
                    e.preventDefault();
                    $("input").val("");
                });
                $("#delete").on("click", function (e) {
                    e.preventDefault();
                    $.ajax({
                        type: "post",
                        url: "/bin/user/create.jcp",
                        data: {type: "delete", dept_id: currentSelectDeptId},
                        success: function () {
                            panks(conf);
                        }
                    });
                });
                $("#save").on("click", function (e) {
                    e.preventDefault();
                    var params = {};
                    params.dept_id = currentSelectDeptId;
                    params.type = "updatesave";
                    params.sort_id = $("#order").val();
                    params.shortName = $("#company-name").val();
                    params.deptName = $("#name").val();
                    console.log(params);
                    $.ajax({
                        type: "post", url: "/bin/user/create.jcp", data: params, success: function () {
                        }
                    });
                });
            });
        }
    };
})();