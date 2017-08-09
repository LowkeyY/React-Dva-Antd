/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global cunovs, __FILE__, Java, PotalUnits, SystemEvent, CertManager, com */

cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
        var id = jjs.get("id") || null , userId = jjs.getUserId(), db = new cunovsDB("plat"), config = {}, ret = "";

        var imports = new JavaImporter(com.kinglib.portal.PotalUnits, com.social.api.core.model.CertManager, com.social.api.core.model.User);

        with (imports) {
            ret = PotalUnits.getUserMenuByString(db.getDB(), userId, id);
//            var string = Java.type('java.lang.String').valueOf(userId);
            var u  = CertManager.getUser(userId) , hs = jjs.getSession();
            if (u != null)
                config.userToken = (userId <= 1 ? "admin" : u.getUserName()) + "::" + u.getPassword();
            config.real_name = hs.getString("real_name");
            config.user_name = hs.getString("user_name");
            config.user_id = hs.getString("user_id");
            config.role_id = hs.getString("role_id");
        }
        
        if(!ret)
            return {
                success : false,
                message : "获取菜单内容失败。"
            };
        ret = JSON.parse(ret);
        ret.success = true;
        ret.config = config;
        return ret;
    }
});
