/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global cunovs, __FILE__, Java, LoginService, com, KingleSystem */

cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
//        var username = jjs.get("username"), password = jjs.get("password"), success = jjs.isValid(username, password), message = success ? "登录成功。" : "密码错误。";
        var username = jjs.get("username"), password = jjs.get("password"), success = false, message = "密码错误。" , user = {};
        var imports = new JavaImporter(com.kinglib.service.login.LoginService, com.kinglib.service.login.ValidateResult, com.susing.KingleServletRequest, com.susing.KingleServletResponse , com.social.api.core.model.CertManager);
        with (imports) {
            var loginService = Java.type("com.susing.core.KingleSystem").getService("登录服务");
            var v = loginService.validate(username, password);
            if (v.isSuccess() == true) {
                try{
                    loginService.login(v.getAttribute().toString(), new KingleServletRequest(jjs.getRequest() , jjs.getResponse()), new KingleServletResponse(jjs.getResponse()));
                }catch(e){
                }
                success = true;
                var u  = CertManager.getInstance().findUserByName(username);
                user = {
                    realname : u.getRealName(),
                    username : username,
                    id : u.getUserId(),
                    permissions : ['systemlog']
                }
                message = "登录成功。";
            } else {
                message = v.getAttribute();
            }
        }
        return {
            success: success,
            message: message,
            user : user
        };
    }
});
