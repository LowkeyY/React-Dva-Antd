/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global java, jjs, cunovs, __FILE__ */
cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
        var ids = jjs.get("ids"), names = jjs.getArray("names"), rArray = [], result = {
            success: true,
            ids: ids
        };
        for (var i = 0; i < names.length; i++)
            rArray.push(names[i]);
        result.array = rArray;

        var db = new cunovsDB("plat"), index = 1;

        result["data" + (index++)] = this.checkDatas(db.get("select application_id,default_title,default_icon_url,0 from potal_menu order by default_seq"));
        result["data" + (index++)] = this.checkDatas(db.get("select application_id,default_title,default_icon_url,0 from potal_menu where default_isValid = ? order by default_seq", [true]));
        result["data" + (index++)] = this.checkDatas(db.get("select application_id,default_title,default_icon_url,0 from potal_menu where default_isValid = ? order by default_seq", [true], 1));
        result["data" + (index++)] = this.checkDatas(db.get("select application_id,default_title,default_icon_url,0 from potal_menu where default_isValid = ? order by default_seq", [true], 1, 2));
        try {
            result["data" + (index++)] = this.checkDatas(db.get("select application_id,default_title,default_icon_url,0 from potal_menu where default_isValid = ? order by default_seq", 1, 2));
        } catch (e) {
            result["data" + (index - 1)] = e;
        }

        return result;
    },
    checkDatas: function (rows) {
        var data = [];
        if (rows && rows.length) {
            for (var i = 0; i < rows.length; i++) {
                data.push({
                    application_id: rows[i][0],
                    default_title: rows[i][1],
                    default_icon_url: rows[i][2]
                });
            }
        }
        return data;
    }
});