(function () {
    var datatableHead = '', numberCounts = 1 , currentSelectDeptId = '' , 
    paramRoles = [{'id': '20469', 'text': '办公厅用户'}, {'id': '20661', 'text': '省长'}, {'id': '21007', 'text': '副省长'}, {'id': '21006', 'text': '秘书长'}, {'id': '20657', 'text': '副秘书长'}, {'id': '20661', 'text': '厅级领导'}, {'id': '21007', 'text': '一般干部'}, {'id': '21006', 'text': '处长'}] , 
    paramUsertypes = [{"text": "正省级", "id": 2}, {"text": "副省级", "id": 5}, {"text": "正厅级", "id": 10}, {"text": "副厅级", "id": 20}, {"text": "正处级", "id": 100}, {"text": "副处级", "id": 10}, {"text": "科员", "id": 20}];
    var userPageHtml =  
                        '                <div class="alert alert-danger display-hide" style="display: none;">' +
                        '                    <button class="close" data-close="alert"></button>' +
                        '                    <span>您的输入信息有误，请检查并修改。</span>' +
                        '                </div>' +
                        '                <div class="alert alert-success display-hide" style="display: none;">' +
                        '                    <button class="close" data-close="alert"></button>' +
                        '                    您输入的信息完全正确。' +
                        '                </div>' +
                        '                <div class="row">' +
                        '                    <div class="col-md-6">' +
                        '                        <div class="form-group">' +
                        '                            <div class="controls">' +
                        '                                <input type="text" class="form-control" name="userName" placeholder="职位名称">' +
                        '                            </div>' +
                        '                        </div>' +
                        '                    </div>' +
                        '                </div>' +
                        '                <div class="row">' +
                        '                    <div class="col-md-6">' +
                        '                        <div class="form-group">' +
                        '                            <div class="controls">' +
                        '                                称谓:<input class="form-control" id="roleId" name="roleId" type="hidden" placeholder="选择或输入称谓">' +
                        '                            </div>' +
                        '                        </div>' +
                        '                        <div class="form-group">' +
                        '                            <div class="controls">' +
                        '                                级别:<input class="form-control" id="userType" name="userType" type="hidden" placeholder="选择或输入职位">' +
                        '                            </div>' +
                        '                        </div>' +
                        '                    </div>' +
                        '                </div>' +
                        '                <div class="row">' +
                        '                    <div class="col-md-4">' +
                        '                        <div class="form-group">' +
                        '                            <div class="controls">' +
                        '                                <input type="text" class="form-control" name="sortId" placeholder="优先顺序">' +
                        '                            </div>' +
                        '                        </div>' +
                        '                    </div>' +
                        '                </div>' +
                        '                <div class="row">' +
                        '                    <div class="col-md-12">' +
                        '                        <div class="form-group">' +
                        '                            <div class="controls">' +
                        '                                <textarea class="form-control" id="textarea" rows="3" placeholder="职责说明" name="duty"></textarea>' +
                        '                            </div>' +
                        '                        </div>' +
                        '                    </div>' +
                        '                </div>';
    function getToolsId(id, type) {
        return 'tools_' + (id ? id : numberCounts++) + (type ? '_' + type : '');
    }

    function panks(conf) {
        return '<div class="row" id="module_' + conf.id + '">' +
                '    <div class="col-md-12">' +
                '	<div class="portlet">' +
                '	    <div class="portlet-title">' +
                '		<div class="caption">' +
                '		    <i class="fa fa-user"></i>职位管理' +
                '		</div>' +
                '		<div class="tools">' +
                '                   <a href="" class="fullscreen" data-original-title="" title="">' +
                '                   </a>' +
                '		</div>' +
                '	    </div>' +
                '	    <div class="portlet-body">' +
               
                panksRight() +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>' + 
                panksToolsPage(conf, "create", "新建职位") +
                panksToolsPage(conf, "edit", "修改职位");
    }

    function panksToolsPage(conf, type, name) {
        if (!conf || !type)
            return '';
        name = name || conf.title
        return  '<div id="' + getToolsId(conf.id, type) + '" class="modal fade" tabindex="-1">' +
                '    <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
                '        <h4 class="modal-title">' + name + '</h4>' +
                '    </div>' +
                '    <form action="#" class="horizontal-form" novalidate="novalidate">' +
                '       <div class="modal-body">' +  toolsPageBody(type) +
                '       </div>' +
                '       <div class="modal-footer">' +
                '           <button class="btn default" data-dismiss="modal" aria-hidden="true">取消</button>' +
                '           <button class="btn green-meadow" type="submit">保存</button>' +
                '       </div>' +
                '   </form>'+
                '</div>';
    }

    function toolsPageBody(type) {
        return userPageHtml;
    }

    
    function panksRight() {
        return '<div class="profile-content">' + datatableHead + '</div>';
    }
    
    function fieldSetValue(el , v){
        var selector = $(el) , value = v || "";
        if(selector.length){
            selector.attr("text" , value);
            selector.attr("value" , value);
            selector.attr("checked" , !!value);
        }
    }
    
    function getActionsType(tag){
        
        var type = "";
        if(tag.endsWith("_create"))
            type = "save";
        else if(tag.endsWith("_edit"))
            type = "update";
        else if(tag.endsWith("_delete"))
            type = "delete";
        
        return type;
        
    }

    function initForm(selector , datas , moduleId) {
        
        var form = $('form' , $(selector)) , defaultParam = datas || {};
        
        $("#roleId" , form).select2({width: 'resolve', placeholder: "职位", allowClear: true, data: paramRoles});
        $("#userType" , form).select2({width: 'resolve', placeholder: "用户类别", allowClear: true, data: paramUsertypes});
        
        form.find('input').each(function(){
            fieldSetValue(this);
        });
        
        for(var att in defaultParam){
            if(att === "roleId")
                 $("#roleId" , form).select2('val' , defaultParam.roleId);
            else if (att === "userType")
                $("#userType" , form).select2('val' , defaultParam.userType);
            else
                fieldSetValue(selector + " #" + att , defaultParam[att]);
        }
        
        form.on('click', '.md-checkbox > label, .md-radio > label', function(e) {
            var inputId = $(this).attr('for') , field;
            if(inputId && (field = $('#'+inputId , form)).length){
                field.attr('checked' , typeof(field.attr('checked')) === "undefined");
            }
        });
        
        var errorInfo = $('.alert-danger', form);
        var successInfo = $('.alert-success', form);
        
        form.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input
            rules: {
                userName: {
                    minlength: 2,
                    required: true
                },
                realName: {
                    required: true
                },
                email: {
                    email: true
                },
                passwd: {
                    required: true
                },
                confirm_passwd: {
                    equalTo: selector + " #passwd"
                },
                sortId: {
                    number: true
                }
            },
            messages: {
                userName: {
                    minlength: jQuery.validator.format("登录名不能小于 {0} 个字符"),
                    required: "登录名必须填写。"
                },
                realName: {
                    required: "真实名称必须填写。"
                },
                email: {
                    email: "必须输入邮件格式。"
                },
                passwd: {
                    required: "登录密码必须填写."
                },
                confirm_passwd: {
                    equalTo: "两次输入密码不一致。"
                },
                sortId: {
                    number: "只能输入数字。"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                successInfo.hide();
                errorInfo.show();
                Metronic.scrollTo(errorInfo, -200);
            },

            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label, element) {
                var icon = $(element).parent('.input-icon').children('i');
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                icon.removeClass("fa-warning").addClass("fa-check");
            },

            submitHandler: function (form) {
                $.ajax({
                    type: "POST",
                    data: $(form).serialize() + '&type='+getActionsType(selector) + '&dept_id='+currentSelectDeptId,
                    url: "/bin/user/rolecreate.jcp",
                    success: function (data, status) {
                        var result = JSON.parse(data);
                        if(result.success){
                            $(selector).modal('hide');
                            var dt = $(moduleId).DataTable();
    //                        dt.context[0]['exportDeptId'] = data.selected[0];
                            dt.ajax.reload();
                        } else {
                            $('.alert-danger', $(form)).show().find("span").html(result && result.message || "新建职位失败，请联系管理员。");
                        }
                    },
                    error: function (result) {
                        $('.alert-danger', $(form)).show().find("span").html(result && result.message || "新建职位失败，请联系管理员!");
                    }
                });
                // submit the form
            }
        });
    }


    return {
        init: function (conf, appendHtml) {
            PageSystem.loadJS('/metronic/assets/global/plugins/jstree/dist/jstree.min.js');
            PageSystem.loadJS('/newhome/PageDatatable.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/bootstrap-select/bootstrap-select.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/select2/select2.min.js');
            PageSystem.loadJS('/metronic/assets/global/plugins/jquery-validation/js/jquery.validate.min.js');
            var table = new PageDatatable(conf.id);
            datatableHead = table.initHead({
                title: '职位管理',
                tools: [{
                        name: '新建职位',
                        id: getToolsId(conf.id, 'create')
                    }, {
                        name: '修改职位',
                        icon: 'edit',
                        id: getToolsId(conf.id, 'edit')
                    }, {
                        name: '删除职位',
                        icon: 'times',
                        id: getToolsId(conf.id, 'delete')
                    }],
                columns: ['职位名称', '称谓', '级别', '注册日期'],
                portletCss: 'box red-pink',
                portletTitleCss: 'user'
            });
            appendHtml(panks(conf), function () {
                $("#tree_" + conf.id).jstree({
                    "core": {
                        "themes": {
                            "responsive": false
                        },
                        // so that create works
                        "check_callback": true,
                        'data': {
                            'url': '/bin/user/_getOrg.jjs',
                            'data': function (node) {
                                return {'parent': node.id};
                            }
                        }
                    },
                    "types": {
                        "default": {
                            "icon": "fa fa-folder icon-state-warning icon-lg"
                        },
                        "file": {
                            "icon": "fa fa-file icon-state-warning icon-lg"
                        }
                    },
                    "state": {"key": "demo3"},
                    "plugins": ["dnd", "state", "types"]
                }).on('changed.jstree', function (e, data) {
                    if (data && data.selected && data.selected.length) {
                        currentSelectDeptId = data.selected[0];
                        var dt = $('#datatable_' + conf.id).DataTable();
//                        dt.context[0]['exportDeptId'] = data.selected[0];
                        dt.ajax.reload();
                    }
                });
                // begin first table
                table.initDatatable({
//                    serverSide: true, //启用服务器端分页
                    //列表表头字段
                    "columns": [{
                            "render": function () {
                                return '<input type="checkbox" class="checkboxes" value="1">';
                            }
                        }, {
                            "data": "职位名称",
                            "orderable": true
                        }, {
                            "data": "称谓",
                            "orderable": false
                        }, {
                            "data": "级别",
                            "orderable": true
                        }, {
                            "data": "注册日期",
                            "orderable": true
                        }],
                    "pageLength": 10,
                    "pagingType": "bootstrap_full_number",
                    "columnDefs": [{// set default column settings
                            'targets': 0,
                            "searchable": false,
                            'orderable': false
                        }],
                    "order": [
                        [1, "desc"]
                    ],
                    "ajax": function (data, callback, settings) {
                        if (!currentSelectDeptId)
                            return;
                        //封装请求参数
                        var param = {};
                        param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
                        param.start = data.start;//开始的记录序号
                        param.page = (data.start / data.length) + 1;//当前页码
                        param.dept_id = currentSelectDeptId;
                        //console.log(param);
                        //ajax请求数据
                        $.ajax({
                            type: "GET",
                            url: "/bin/user/rolelist.jcp",
                            cache: false, //禁用缓存
                            data: param, //传入组装的参数
                            dataType: "json",
                            success: function (result) {
                                var returnData = {};
                                returnData.draw = 0;//这里直接自行返回了draw计数器,应该由后台返回
                                returnData.recordsTotal = result.totalCount;//返回数据全部记录
                                returnData.recordsFiltered = result.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                                returnData.data = result.dataItem;//返回的数据列表
                                callback(returnData);
                                table.reUniform();
                            }
                        });
                    }
                });
                $('a.btn', '#module_' + conf.id + ' .profile-content').on('click', function (e) {
                    e.preventDefault();
                    var tag = $(this).attr("href"), wapper = $('#datatable_' + conf.id + '_wrapper');
                    
                    
                    if (tag === '#' + getToolsId(conf.id, 'delete')) {
                        var rows = table.selects("index");

                    } else if (tag === '#' + getToolsId(conf.id + '_edit')) {
                        var rows = table.selects("index");
                        
                        }
                     else if (tag === '#' + getToolsId(conf.id + '_create')) {
                        $(tag).modal('show');
                        initForm(tag , {
                            roleId : paramRoles[0].id,
                            userType : 100,
                            inActive : true
                        } , '#datatable_' + conf.id);
                    }
                    return false;//终止其它事件
                });
            });
        }
    }
})();