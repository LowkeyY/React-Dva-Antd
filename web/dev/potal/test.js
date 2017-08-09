/* global java, jjs, cunovs, __FILE__ */
cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
        Files.read("D:/Platform/Project_Portal/web/dev/potal/test.js", function (content, state) {
            print("e:" + content);
            print("f:" + JSON.stringify(state));
        });
        return {
            success: true,
            length: 0,
            html: "<div>nothing</div>"
        };
    }
});