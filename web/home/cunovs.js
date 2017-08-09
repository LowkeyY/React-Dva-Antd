/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global */

var cunovs = {
    callbackFCName : '_callback_',
    getScriptNameSpace: function (name) {
        return name.replaceAll("^file:/|:", "").replaceAll("/|\\\\", ".");
    },
    modules: {},
    defineCalss: function (classname , contents) {
        var nameSpace = this.getScriptNameSpace(classname);
        this.modules[nameSpace] = contents;
    }, isFunction: function (fn) {
        return fn && Object.prototype.toString.apply(fn) === "[object Function]";
    }, isObject: function (o) {
        return o && Object.prototype.toString.apply(o) === "[object Object]";
    }, isArray: function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    },
    runCallback: function (fn) {
        if (this.isFunction(fn))
            return fn.apply(fn, Array.prototype.slice.call(arguments, 1));
    }
};

var cunovsInvoke = function (name, jjs) {
    var script, result , hasCB = jjs.get(cunovs.callbackFCName);
    if ((script = cunovs.modules[cunovs.getScriptNameSpace(name)])) {
        result = script.service(jjs);
        try {
            if (result) {
                if (cunovs.isObject(result)){
                    result = JSON.stringify(result);
                    jjs.print(hasCB ? hasCB+"("+result+")" : result);
                } else
                    jjs.print(result);
            }
        } catch (e) {
        }
    }
};