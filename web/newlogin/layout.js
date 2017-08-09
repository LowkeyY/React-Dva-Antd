/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global cunovs, __FILE__, Java, LoginService, com, KingleSystem */

cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
        var userId = jjs.getUserId();
        var imports = new JavaImporter(com.kinglib.service.login.LoginService, com.kinglib.service.login.ValidateResult, com.susing.KingleServletRequest, com.susing.KingleServletResponse , com.social.api.core.model.CertManager);
        with (imports) {
            var loginService = Java.type("com.susing.core.KingleSystem").getService("登录服务");
            try{
                loginService.logout(userId , new KingleServletRequest(jjs.getRequest() , jjs.getResponse()), new KingleServletResponse(jjs.getResponse()));
            }catch(e){
                print(e);
            }
        }
        return {
            success: true
        };
    }
});
