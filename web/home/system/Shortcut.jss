/*
 * qWikiOffice Desktop 1.0
 * Copyright(c) 2007-2008, Integrated Technologies, Inc.
 * licensing@qwikioffice.com
 * 
 * http://www.qwikioffice.com/license
 */
Ext.ux.Shortcuts = function(desktop){
	var btnHeight = 74;
	var btnWidth = 64;
	var btnPadding = 15;
	var col = null;
	var row = null;
	var items = [];
	
	initColRow();
	
	function initColRow(){
		col = {index: 1, x: btnPadding};
		row = {index: 1, y: btnPadding};
	}
	
	function isOverflow(y){
		if(y > (desktop.getViewHeight())){
			return true;
		}
		return false;
	}
	
	this.addShortcut = function(config){
		var div = desktop.el.createChild({tag:'div', cls: 'ux-shortcut-item'}),
			btn = new Ext.ux.ShortcutButton(Ext.apply(config, {
				text: Ext.util.Format.ellipsis(config.text, 16)
			}), div);
		
		//btn.container.initDD('DesktopShortcuts');
		
		items.push(btn);
		this.setXY(btn.container);
		
		return btn;
	};
	
	this.removeShortcut = function(b){
		var d = document.getElementById(b.container.id);
		
		b.destroy();
		d.parentNode.removeChild(d);
		
		var s = [];
		for(var i = 0, len = items.length; i < len; i++){
			if(items[i] != b){
				s.push(items[i]);
			}
		}
		items = s;
		
		this.handleUpdate();
	}
	
	this.handleUpdate = function(){
		initColRow();
		for(var i = 0, len = items.length; i < len; i++){
			this.setXY(items[i].container);
		}
	}
	
	this.setXY = function(item){
		var bottom = row.y + btnHeight,
			overflow = isOverflow(row.y + btnHeight);
		
		if(overflow && bottom > (btnHeight + btnPadding)){
			col = {
				index: col.index++
				, x: col.x + btnWidth + btnPadding
			};
			row = {
				index: 1
				, y: btnPadding
			};
		}
		
		item.setXY([
			col.x
			, row.y
		]);
		
		row.index++;
		row.y = row.y + btnHeight + btnPadding;
	};
	
	Ext.EventManager.onWindowResize(this.handleUpdate, this, {delay:500});
};



/**
 * @class Ext.ux.ShortcutButton
 * @extends Ext.Button
 */
Ext.ux.ShortcutButton = function(config, el){
	
	Ext.ux.ShortcutButton.superclass.constructor.call(this, Ext.apply(config, {
		renderTo: el,
		//clickEvent: 'dblclick',
/*
		template: new Ext.Template(
			'<div class="ux-shortcut-btn"><div>',
				'<img src="'+Ext.BLANK_IMAGE_URL+'" />',
				'<div class="ux-shortcut-btn-text">{0}</div>',
			'</div></div>')
//*/
		template: new Ext.Template( //+X+ ADD REPLACE ABOVE START
			'<div class="ux-shortcut-btn {2}"><div>',
			'<div class="haiwaizhishi-info-number x-hide-display" title="您有新的待处理资料" style="line-height:18px;font-size:14px;right:0px;"></div>',
				'<img src="'+Ext.BLANK_IMAGE_URL+'" />',
				'<div class="ux-shortcut-btn-text">{0}</div>',
			'</div></div>') //+X+ ADD REPLACE ABOVE END
	}));
	
};

Ext.extend(Ext.ux.ShortcutButton, Ext.Button, {

	buttonSelector : 'div:first',
	
	/* onRender : function(){
		Ext.ux.ShortcutButton.superclass.onRender.apply(this, arguments);

		this.cmenu = new Ext.menu.Menu({
			items: [{
				id: 'open',
				text: 'Open',
				//handler: this.win.minimize,
				scope: this.win
			}, '-', {
				id: 'remove',
				iconCls: 'remove',
				text: 'Remove Shortcut',
				//handler: this.closeWin.createDelegate(this, this.win, true),
				scope: this.win
			}]
		});

		this.el.on('contextmenu', function(e){
			e.stopEvent();
			if(!this.cmenu.el){
				this.cmenu.render();
			}
			var xy = e.getXY();
			xy[1] -= this.cmenu.el.getHeight();
			this.cmenu.showAt(xy);
		}, this);
	}, */
	
	initButtonEl : function(btn, btnEl){
		Ext.ux.ShortcutButton.superclass.initButtonEl.apply(this, arguments);
		
		btn.removeClass("x-btn");
		
		if(this.iconCls){
			if(!this.cls){
				btn.removeClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
			}
		}
		if(this.faceAppUrl){
			if(this.faceAppIsUpdate === true){
				var fn = function(){
					this.loadFaceApp();
				};
				this.interval = setInterval(fn.createDelegate(this) , this.faceAppUpdateTimer);
			}
			this.loadFaceApp();
		}
	},
	
	autoWidth : function(){
		// do nothing
	},
	checkNumberInfo : function(value){
    	if(!value || (Ext.isNumber(value) && value < 0))
    		return 0;
    	return Ext.isNumber(value) ? value > 9 ? "9+" : value : "N";
    },
	setInfonumVisible : function(num){
		var info , numberInfo = this.checkNumberInfo(num);
		if(this.el && (info = this.el.child("div.haiwaizhishi-info-number"))){
			if(numberInfo){
				info.update(numberInfo);
				info.removeClass("x-hide-display");
			} else{
				info.update(0);
				info.addClass("x-hide-display");
			}
		}
	},
	loadFaceApp : function(){
		if(!this.faceAppUrl || !this.windowId)
			return;
		Ext.Ajax.request({
				url : '/dev/potal/messageAction.jcp',
				method : 'post',
				scope : this,
				params :{
					menuId : this.windowId.substring(7)
				},
				success : function(response, options) {
					var result = Ext.decode(response.responseText) , datas;
/*					if (result.success && Ext.isDefined(result.newMessageCounts))
						this.setInfonumVisible(result.newMessageCounts);*/
					if(result.success && (datas = result.datas)){
						Ext.each(datas , function(data){
							var show = data.applyTo;
							if(show){
								if(show == 'desktop' && Ext.isDefined(data.newMessageCounts)){
									this.setInfonumVisible(data.newMessageCounts)
								} else if(show.match(/info|infos/) && data.message){
									Ext.msg(show , data.message);
								}
							}
						},this);
					} else if(!result.success && result.message){
						Ext.msg("warn" , result.message);
					}
				}
			});
	},	
	/**
	 * Sets this shortcut button's text
	 * @param {String} text The button text
	 */
	setText : function(text){
		this.text = text;
		if(this.el){
			this.el.child("div.ux-shortcut-btn-text").update(text);
		}
	},
	
	//去掉默认加载的样式x-btn-text ，兼容ie浏览器，该样式不允许自动换行。 
	setIconClass : function(cls){
        this.iconCls = cls;
        if(this.el){
            this.btnEl.dom.className = '';
            this.btnEl.addClass(cls || '');
            this.setButtonClass();
        }
        return this;
    }
});