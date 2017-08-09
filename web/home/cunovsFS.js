/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Java, cunovs */

var cunovsFS = {
    fileCls: Java.type("java.io.File"),
    exists: function (filepath, callback) {
        var file = new this.fileCls(filepath), exists = file.exists();
        if (cunovs.isFunction(callback))
            cunovs.runCallback(callback, exists, file);
        return exists;
    },
    read: function (filepath, callback) {
        var content = "", state = {};
        this.exists(filepath, function (exists, file) {
            if (exists) {
                var imports = new JavaImporter(java.io, java.lang);
                with (imports) {
                    var result = new StringBuilder() , bufReader;
                    try {
                        bufReader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "utf-8")), temp;
                        while ((temp = bufReader.readLine()) != null) {
                            result.append(temp);
                        }
                    } catch (e) {
                        state.error = {message: e.getMessage()};
                    } finally{
                        if(bufReader)
                            try{
                                bufReader.close();
                            }catch(ex){
                            }
                    }
                    content = result.toString();
                }
            } else {
                state.error = {message: "未找到文件" + filepath};
            }
        });
        if (cunovs.isFunction(callback))
            cunovs.runCallback(callback, content, state);
        return content;
    },
    write: function (filepath, content, callback) {
        var state = {}, success = false;
        this.exists(filepath, function (exists, file) {
            if (exists)
                if (!file.delete()) {
                    state.error = {message: "文件已存在，并删除失败:" + filepath};
                    return;
                }
            if (!content) {
                success = true;
                return;
            }
            var imports = new JavaImporter(java.io, java.lang);
            with (imports) {
                var fos = null, osw = null;
                try {
                    fos = new FileOutputStream(file);
                    osw = new OutputStreamWriter(fos, "UTF-8");
                    osw.write(content);
                    osw.flush();
                    success = true;
                } catch (e) {
                    state.error = {message: "文件保存失败:" + e.getMessage()};
                } finally {
                    try {
                        if (fos != null) {
                            fos.close();
                        }
                        if (osw != null) {
                            osw.close();
                        }
                    } catch (ex) {
                    }
                }
            }
            ;
        });
        return cunovs.isFunction(callback) ? cunovs.runCallback(callback, success, state) : state;
    },
    delete: function (filepath, callback) {
        var state = {}, success = false;
        this.exists(filepath, function (exists, file) {
            if (exists) {
                success = file.delete();
                if (!success)
                    state.error = {message: "文件删除失败:" + filepath};
            } else
                state.error = {message: "未找到文件:" + filepath};
        });
        return cunovs.isFunction(callback) ? cunovs.runCallback(callback, success, state) : state;
    }
}