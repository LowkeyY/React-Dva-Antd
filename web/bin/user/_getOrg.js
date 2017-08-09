/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Files, cunovs, __FILE__, Java */

cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
        var parent = jjs.get("parent"), result = [];
        jjs.getResponse().setContentType("application/x-json");

        if (parent === "#")
            parent = 0;
        var imports = new JavaImporter(com.social.api.core.model.Dept);

        with (imports) {
            var depts = Dept.getDept(parent).getChildsBySort();
            for (var i = 0; i < depts.length; i++) {
                var dept = depts[i];
                result.push({
                    id: dept.getDeptId(),
                    text: dept.getShortName(),
                    icon: "fa fa-folder icon-lg icon-state-success",
                    children: dept.hasChild(),
                    type: parent === 0 ? "root" : ""
                })
            }
        }

        return JSON.stringify(result);
    }
});