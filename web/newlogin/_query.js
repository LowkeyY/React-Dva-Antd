/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global cunovs, __FILE__, Java, PotalUnits, SystemEvent, CertManager, com */

cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
        var id = jjs.get("id") || null , userId = jjs.getUserId(), db = new cunovsDB("plat"), config = {}, ret = "" , user = {};
        
        if(userId == -1)
            return {
                success : false,
                message : "用户未登录。"
            };
        
        var imports = new JavaImporter(com.kinglib.portal.PotalUnits, com.social.api.core.model.CertManager, com.social.api.core.model.User);
        with (imports) {
            ret = PotalUnits.getUserMenuByString(db.getDB(), userId, id);
            var u  = CertManager.getUser(userId);
            user = {
                realname : u.getRealName(),
                username : username,
                id : u.getUserId(),
                permissions : ['systemlog']
            }
        }
        
        if(!ret)
            return {
                success : false,
                message : "获取菜单内容失败。"
            };
        ret = JSON.parse(ret);
        ret.success = true;
        ret.config = config;
        ret.user = user;
        return ret;
    }
});
