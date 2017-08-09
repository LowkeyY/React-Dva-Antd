var PageLogin = function () {
    function checkInputs(){
        var input = $('.login-form').find("input:password") , data = $('.login-form').serializeArray();
        data.forEach(function(e){
            if(e.name === input.attr("name"))
                e.value = hex_md5(e.value);
        });
        return $.param(data);
    }
    function valid()
    {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: checkInputs(),
            url: "/newlogin/login.jjs",
            success: function (result) {
                if (result.success){
                    location.href = "/newhome/desktop.html";
                }else
                    $('.alert-danger', $('.login-form')).show().find("span").html(result.message);
            },
            error: function (result) {
                $('.alert-danger', $('.login-form')).show().find("span").html(result && result.message || "链接失败，请稍候重试。");
            }
        });
    }
    var handleLogin = function () {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },

            messages: {
                username: {
                    required: "用户名/Email必须提供."
                },
                password: {
                    required: "密码必须提供."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                valid();
                return false;
            }
        });

        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    };

    return {
        //main function to initiate the module
        init: function () {
            handleLogin();
        }
    };

}();