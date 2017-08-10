(function () {
    var datatableHead = "", numberCounts = 1, currentSelectDeptId = "",
        paramRoles = [{"id": "20469", "text": "办公厅用户"}, {"id": "20661", "text": "省长"}, {
            "id": "21007",
            "text": "厅级干部"
        }, {"id": "21006", "text": "秘书长"}, {"id": "20657", "text": "副省长"}],
        paramUsertypes = [{"text": "架构师", "id": 2}, {"text": "开发人员", "id": 5}, {
            "text": "定制人员",
            "id": 10
        }, {"text": "部门管理员", "id": 20}, {"text": "普通用户", "id": 100}];
    var userPageHtml = '                <div class="alert alert-danger display-hide" style="display: none;">' + '                    <button class="close" data-close="alert"></button>' + "                    <span>您的输入信息有误，请检查并修改。</span>" + "                </div>" + '                <div class="alert alert-success display-hide" style="display: none;">' + '                    <button class="close" data-close="alert"></button>' + "                    您输入的信息完全正确。" + "                </div>" + '                <div class="row">' + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="text" class="form-control" name="userName" placeholder="用户名">' + "                            </div>" + "                        </div>" + "                    </div>" + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="text" class="form-control" name="realName" placeholder="真实姓名">' + "                            </div>" + "                        </div>" + "                    </div>" + "                </div>" + '                <div class="row">' + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input class="form-control" id="roleId" name="roleId" type="hidden">' + "                            </div>" + "                        </div>" + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input class="form-control" id="userType" name="userType" type="hidden">' + "                            </div>" + "                        </div>" + '                        <div class="form-group">' + '                            <div class="controls input-icon right">' + '                                <i class="fa"></i>' + '                                <input type="text" class="form-control" name="email" placeholder="电子邮件">' + "                            </div>" + "                        </div>" + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="text" class="form-control" name="celler" placeholder="手机">' + "                            </div>" + "                        </div>" + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="text" class="form-control" name="phone" placeholder="办公电话">' + "                            </div>" + "                        </div>" + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="text" class="form-control" name="phoneHome" placeholder="家庭电话">' + "                            </div>" + "                        </div>" + "                    </div>" + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="text" class="form-control" name="zp" placeholder="照片">' + "                            </div>" + "                        </div>" + "                    </div>" + "                </div>" + '                <div class="row">' + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="password" class="form-control" id = "passwd" name="passwd" placeholder="密码">' + "                            </div>" + "                        </div>" + "                    </div>" + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="password" class="form-control" name="confirm_passwd" placeholder="再次输入密码">' + "                            </div>" + "                        </div>" + "                    </div>" + "                </div>" + '                <div class="row">' + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <div class="form-group form-md-checkboxes">' + '                                    <div class="md-checkbox-inline">' + '                                        <div class="md-checkbox has-success">' + '                                            <input type="checkbox" id="inActive" name = "inActive" class="md-check" checked>' + '                                            <label for="inActive">激活' + "                                                <span></span>" + '                                                <span class="check"></span>' + '                                                <span class="box"></span>' + "                                            </label>" + "                                        </div>" + "                                    </div>" + "                                </div>" + "                            </div>" + "                        </div>" + "                    </div>" + '                    <div class="col-md-6">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <div class="form-group form-md-checkboxes">' + '                                    <div class="md-checkbox-inline">' + '                                        <div class="md-checkbox has-success">' + '                                            <input type="checkbox" id = "isMaster" name = "isMaster"  class="md-check">' + '                                            <label for="isMaster">是否部门业务主管' + "                                                <span></span>" + '                                                <span class="check"></span>' + '                                                <span class="box"></span>' + "                                            </label>" + "                                        </div>" + "                                    </div>" + "                                </div>" + "                            </div>" + "                        </div>" + "                    </div>" + "                </div>" + '                <div class="row">' + '                    <div class="col-md-4">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <input type="text" class="form-control" name="sortId" placeholder="优先顺序">' + "                            </div>" + "                        </div>" + "                    </div>" + "                </div>" + '                <div class="row">' + '                    <div class="col-md-12">' + '                        <div class="form-group">' + '                            <div class="controls">' + '                                <textarea class="form-control" id="textarea" rows="3" placeholder="职责说明" name="duty"></textarea>' + "                            </div>" + "                        </div>" + "                    </div>" + "                </div>";

    function getToolsId(id, type) {
        return "tools_" + (id ? id : numberCounts++) + (type ? "_" + type : "");
    }

    function panks(conf) {
        return '<div class="row" id="module_' + conf.id + '">' + '    <div class="col-md-12">' + '	<div class="portlet">' + '	    <div class="portlet-title">' + '		<div class="caption">' + '		    <i class="fa fa-user"></i>用户管理' + "		</div>" + '		<div class="tools">' + '                   <a href="" class="fullscreen" data-original-title="" title="">' + "                   </a>" + "		</div>" + "	    </div>" + '	    <div class="portlet-body">' + panksLeft(conf) + panksRight() + "           </div>" + "       </div>" + "   </div>" + "</div>" + panksToolsPage(conf, "create", "新建用户") + panksToolsPage(conf, "edit", "修改用户");
    }

    function panksToolsPage(conf, type, name) {
        if (!conf || !type) {
            return "";
        }
        name = name || conf.title;
        return '<div id="' + getToolsId(conf.id, type) + '" class="modal fade" tabindex="-1">' + '    <div class="modal-header">' + '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' + '        <h4 class="modal-title">' + name + "</h4>" + "    </div>" + '    <form action="#" class="horizontal-form" novalidate="novalidate">' + '       <div class="modal-body">' + toolsPageBody(type) + "       </div>" + '       <div class="modal-footer">' + '           <button class="btn default" data-dismiss="modal" aria-hidden="true">取消</button>' + '           <button class="btn green-meadow" type="submit">保存</button>' + "       </div>" + "   </form>" + "</div>";
    }

    function toolsPageBody(type) {
        return userPageHtml;
    }

    function panksLeft(conf) {
        return '<div class="profile-sidebar">' + '    <div class="portlet red-pink box">' + '        <div class="portlet-title">' + '            <div class="caption">' + '                <i class="fa fa-users"></i>组织结构导航' + "            </div>" + '            <div class="tools">' + '                <a href="javascript:;" class="collapse">' + "                </a>" + "            </div>" + "        </div>" + '        <div class="portlet-body">' + '            <div id="tree_' + conf.id + '" class="tree-demo">' + "            </div>" + "        </div>" + "    </div>" + "</div>";
    }

    function panksRight() {
        return '<div class="profile-content">' + datatableHead + "</div>";
    }

    function fieldSetValue(el, v) {
        var selector = $(el), value = v || "";
        if (selector.length) {
            selector.attr("text", value);
            selector.attr("value", value);
            selector.attr("checked", !!value);
        }
    }

    function getActionsType(tag) {
        var type = "";
        if (tag.endsWith("_create")) {
            type = "save";
        } else {
            if (tag.endsWith("_edit")) {
                type = "update";
            } else {
                if (tag.endsWith("_delete")) {
                    type = "delete";
                }
            }
        }
        return type;
    }

    function initForm(selector, datas, moduleId) {
        var form = $("form", $(selector)), defaultParam = datas || {};
        $("#roleId", form).select2({width: "resolve", placeholder: "职位", allowClear: true, data: paramRoles});
        $("#userType", form).select2({width: "resolve", placeholder: "用户类别", allowClear: true, data: paramUsertypes});
        form.find("input").each(function () {
            fieldSetValue(this);
        });
        for (var att in defaultParam) {
            if (att === "roleId") {
                $("#roleId", form).select2("val", defaultParam.roleId);
            } else {
                if (att === "userType") {
                    $("#userType", form).select2("val", defaultParam.userType);
                } else {
                    fieldSetValue(selector + " #" + att, defaultParam[att]);
                }
            }
        }
        form.on("click", ".md-checkbox > label, .md-radio > label", function (e) {
            var inputId = $(this).attr("for"), field;
            if (inputId && (field = $("#" + inputId, form)).length) {
                field.attr("checked", typeof (field.attr("checked")) === "undefined");
            }
        });
        var errorInfo = $(".alert-danger", form);
        var successInfo = $(".alert-success", form);
        form.validate({
            errorElement: "span",
            errorClass: "help-block help-block-error",
            focusInvalid: false,
            ignore: "",
            rules: {
                userName: {minlength: 2, required: true},
                realName: {required: true},
                email: {email: true},
                passwd: {required: true},
                confirm_passwd: {equalTo: selector + " #passwd"},
                sortId: {number: true}
            },
            messages: {
                userName: {minlength: jQuery.validator.format("登录名不能小于 {0} 个字符"), required: "登录名必须填写。"},
                realName: {required: "真实名称必须填写。"},
                email: {email: "必须输入邮件格式。"},
                passwd: {required: "登录密码必须填写."},
                confirm_passwd: {equalTo: "两次输入密码不一致。"},
                sortId: {number: "只能输入数字。"}
            },
            invalidHandler: function (event, validator) {
                successInfo.hide();
                errorInfo.show();
                Metronic.scrollTo(errorInfo, -200);
            },
            highlight: function (element) {
                $(element).closest(".form-group").addClass("has-error");
            },
            unhighlight: function (element) {
                $(element).closest(".form-group").removeClass("has-error");
            },
            success: function (label, element) {
                var icon = $(element).parent(".input-icon").children("i");
                $(element).closest(".form-group").removeClass("has-error").addClass("has-success");
                icon.removeClass("fa-warning").addClass("fa-check");
            },
            submitHandler: function (form) {
                $.ajax({
                    type: "POST",
                    data: $(form).serialize() + "&type=" + getActionsType(selector) + "&dept_id=" + currentSelectDeptId,
                    url: "/bin/user/usercreate.jcp",
                    success: function (data, status) {
                        var result = JSON.parse(data);
                        if (result.success) {
                            $(selector).modal("hide");
                            var dt = $(moduleId).DataTable();
                            dt.ajax.reload();
                        } else {
                            $(".alert-danger", $(form)).show().find("span").html(result && result.message || "新建用户失败，请联系管理员。");
                        }
                    },
                    error: function (result) {
                        $(".alert-danger", $(form)).show().find("span").html(result && result.message || "新建用户失败，请联系管理员。");
                    }
                });
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
            var table = new PageDatatable(conf.id);
            datatableHead = table.initHead({
                title: "用户管理",
                tools: [{name: "新建用户", id: getToolsId(conf.id, "create")}, {
                    name: "修改用户",
                    icon: "edit",
                    id: getToolsId(conf.id, "edit")
                }, {name: "删除用户", icon: "times", id: getToolsId(conf.id, "delete")}],
                columns: ["姓名", "部门", "角色", "登录名", "电话", "注册时间", "用户ID"],
                portletCss: "box red-pink",
                portletTitleCss: "user"
            });
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
                        var dt = $("#datatable_" + conf.id).DataTable();
                        dt.ajax.reload();
                    }
                });
                table.initDatatable({
                    "columns": [{
                        "render": function () {
                            return '<input type="checkbox" class="checkboxes" value="1">';
                        }
                    }, {"data": "real_name", "orderable": true}, {"data": "dept_name", "orderable": false}, {
                        "data": "roles",
                        "orderable": true
                    }, {"data": "user_name", "orderable": true}, {"data": "phone", "orderable": true}, {
                        "data": "entry_time",
                        "orderable": true
                    }, {"data": "index", "orderable": false, "searchable": false, "bVisible": true}],
                    "pageLength": 10,
                    "pagingType": "bootstrap_full_number",
                    "columnDefs": [{"targets": 0, "searchable": false, "orderable": false}],
                    "order": [[1, "desc"]],
                    "ajax": function (data, callback, settings) {
                        if (!currentSelectDeptId) {
                            return;
                        }
                        var param = {};
                        param.limit = data.length;
                        param.start = data.start;
                        param.page = (data.start / data.length) + 1;
                        param.dept_id = currentSelectDeptId;
                        $.ajax({
                            type: "GET",
                            url: "/bin/user/userlist.jcp",
                            cache: false,
                            data: param,
                            dataType: "json",
                            success: function (result) {
                                var returnData = {};
                                returnData.draw = 0;
                                returnData.recordsTotal = result.totalCount;
                                returnData.recordsFiltered = result.totalCount;
                                returnData.data = result.dataItem;
                                callback(returnData);
                                table.reUniform();
                            }
                        });
                    }
                });
                $("a.btn", "#module_" + conf.id + " .profile-content").on("click", function (e) {
                    e.preventDefault();
                    var tag = $(this).attr("href"), wapper = $("#datatable_" + conf.id + "_wrapper");
                    if (!currentSelectDeptId) {
                        Metronic.alert({
                            type: "danger",
                            icon: "warning",
                            message: "请选选择一个部门。",
                            container: wapper,
                            place: "prepend"
                        });
                        return false;
                    }
                    if (tag === "#" + getToolsId(conf.id, "delete")) {
                        var rows = table.PageDatatable("index");
                    } else {
                        if (tag === "#" + getToolsId(conf.id + "_edit")) {
                            var rows = table.selects("index");
                            if (rows.length === 1) {
                                $(tag).modal("show");
                                initForm(tag);
                            } else {
                                Metronic.alert({
                                    type: "danger",
                                    icon: "warning",
                                    message: (!rows || !rows.length) ? "请选择需要修改的数据" : "只能选择一条数据",
                                    container: wapper,
                                    place: "prepend"
                                });
                            }
                        } else {
                            if (tag === "#" + getToolsId(conf.id + "_create")) {
                                $(tag).modal("show");
                                initForm(tag, {
                                    roleId: paramRoles[0].id,
                                    userType: 100,
                                    inActive: true
                                }, "#datatable_" + conf.id);
                            }
                        }
                    }
                    return false;
                });
            });
        }
    };
})();