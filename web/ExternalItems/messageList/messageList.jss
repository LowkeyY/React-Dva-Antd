Ext.namespace("ExternalItems.messageList");
ExternalItems.messageList.messageList = function () {
}

ExternalItems.messageList.messageList.prototype = {
    init: function (src, param) {
        var runProgressBar = Ext.Msg.wait("正在加载信息...");
        this.winWidth = src.winWidth || 0;
        Ext.Ajax.request({
            url: '/ExternalItems/messageList/messageList.jcp',
            method: 'Post',
            scope: this,
            success: function (response, options) {
                runProgressBar.hide();
                var result = Ext.decode(response.responseText);
                var datas = result.datas || [], items = this.buildItems(datas);
                if (result.success && datas.length && items.length) {
                    this.createWindow(src, {
                        items: {
                            autoScroll: true,
                            items: items
                        }
                    })
                } else {
                    Ext.msg("info", "没有新的待处理消息。");
                }
            }
        });
    },

    buildItems: function (datas) {
        var items = [];
        Ext.each(datas, function (data) {
            var grid = this.buildGrid(data);
            if (grid) {
                var item = {
                    xtype: 'fieldset',
                    width: this.getWinWidth(),
                    style: 'margin:5px ' + ((this.winWidth - this.getWinWidth() - 12) / 2),
                    collapsible: true,
                    buttonAlign: 'left',
                    title: data.title,
                    items: grid
                }
                items.push(item);
            }
        }, this);
        return items;
    },

    getWinWidth: function () {
        if (this.winWidth && +this.winWidth)
            return this.winWidth * .9;
        return (Ext.lib.Dom.getViewWidth() || 800) * .9
    },
    changeTag2A: function (v, p, rec) {
        var u;
        return '<a class = "potal-message-new" herf = "' + ((u = rec.get("url")) ? u : 'javascript:void(0)') + '">' + v + '</a>';
    },
    buildGrid: function (config) {
        if (!config || !config.appid || !config.msg)
            return "";
        var data = [], button = [];
        Ext.each(config.msg, function (msg) {
            if (msg.title && msg.date)
                data.push([msg.title, msg.date, msg.url || ""]);
            if (!button.length && msg.type && msg.type === "more")
                button.push({
                    text: '更多',
                    url: msg.url || "",
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.executeURL(this.url);
                    }
                })
        });
        if (!data.length)
            return "";

        var store = new Ext.data.ArrayStore({
            fields: [
                {name: 'title'},
//	           {name: 'date', type: 'date'},
                {name: 'date'},
                {name: 'url'}
            ]
        });
        store.loadData(data);
//	    var height = Math.min(data.length * 26 + 35, 220) + (button.length ? 25 : 0);
        var height = Math.min(data.length * 26 + 2, 210) + (button.length ? 25 : 0);
        var grid = new Ext.grid.GridPanel({
            store: store,
            hideHeaders: true,
            viewConfig: {
                forceFit: true
            },
            moduleId: "module_" + config.appid,
            enableHdMenu: false,
            columns: [
                new Ext.grid.RowNumberer(),
                {id: 'title', header: '标题', width: this.getWinWidth() * .6, sortable: true, dataIndex: 'title', renderer: this.changeTag2A.createDelegate(this)},
//	            {header: '日期', width: this.getWinWidth() * .28, sortable: true, renderer: Ext.util.Format.dateRenderer('Y/m/d'), dataIndex: 'date'}
                {header: '日期', width: this.getWinWidth() * .28, sortable: true, dataIndex: 'date'}
            ],
            width: '95%',
            height: height,
            stripeRows: true,
            //title: config.title,
            stateful: true,
            getModule: function (moduleId) {
                var module;
                Ext.each(WorkBench.modules, function (m) {
                    if (!module && m.moduleId === moduleId)
                        module = m;
                })
                return module;
            },
            cls: 'portal-message',
            buttons: button.length ? button : null,
            getIndex: function (index) {
                if (index && +index)
                    return "(" + (++index) + ")";
                return "";
            },
            executeURL: function (url, index) {
                var module = this.getModule(this.moduleId);
                if (url || module) {
                    var launcher = module && module.launcher;
                    if (!url && launcher.handler) {
                        launcher.handler.createDelegate(launcher).defer(1);
                        return;
                    }
                    if (launcher && launcher.openType && launcher.openType === 'true' && launcher.isIFrame && launcher.isIFrame === 'true') {
                        var newLanuncher = Ext.apply({}, module.launcher);
                        newLanuncher.text = newLanuncher.text + this.getIndex(index);
                        newLanuncher.windowId = Ext.id();
                        newLanuncher.url = url;
                        module.launcher.handler.createDelegate(newLanuncher).defer(1);
                        return;
                    }
                    window.open(url);
                }
            },
            listeners: {
                cellclick: function (grid, rowIndex, columnIndex) {
                    var view = grid.view.getRow(rowIndex);
                    Ext.each(view.getElementsByTagName("a"), function (tag) {
                        Ext.fly(tag).removeClass("potal-message-new");
                    });
                    this.executeURL(grid.getStore().getAt(rowIndex).get("url"), rowIndex);
                }
            }
        });

        return grid;
    },

    createWindow: function (src, windowConfig) {
        var win = src.desktop.getWindow(src.windowId);
        if (win)
            win.close();
        var viewWidth = src.desktop.getViewWidth();
        var viewHeight = src.desktop.getViewHeight();

        function fixSize(value, sign) {
            if (value == 0)
                return sign;
            return value < 1 ? sign * value : value;
        }

        function fixPosition(offset, max, limit) {
            if (offset == -1)
                return (max - limit) / 2;
            if (offset < 0)
                offset *= -1;
            if (offset < 1 && offset > 0)
                return max * offset;
            return offset;
        }

        src.winWidth = fixSize(+src.winWidth, viewWidth);
        src.winHeight = fixSize(+src.winHeight, viewHeight);
        Ext.isMultiScreen && (src.winWidth /= 2);

        var config = Ext.apply({
            id: src.windowId,
            title: src.text || src.tooltip,
            layout: 'fit',
            icon: src.icon || src.windowIcon,
            shim: true,
            animCollapse: false,
            constrainHeader: true,
            hideBorders: true,
            minimizable: src.winResizable === true,
            maximizable: src.winResizable === true,
            draggable: src.winDraggable === true,
            width: src.winWidth,
            height: src.winHeight,
            x: fixPosition(+src.x, viewWidth, src.winWidth),
            y: fixPosition(+src.y, viewHeight, src.winHeight)
        }, windowConfig);

        win = src.desktop.createWindow(config);

        win.show();
    }
}