Ext.namespace("bin.user");

using("lib.jsvm.MenuTree");
using("bin.user.UserListPanel");
using("bin.user.UserNavPanel");
using("lib.CachedPanel.CachedPanel");
using("lib.PasswordField.PasswordField");

bin.user.UserFrame = Ext.extend(WorkBench.baseNode, {
			main : function(launcher) {
				this.mainPanel = new lib.CachedPanel.CachedPanel({
							id : 'UserMain',
							region : 'center',
							statusBar : true,
							statusConfig : {
								hidden : true
							},
							split : true
						});
				this.frames.set('state', 'list');
				this.frames.set('User', this);
				this.userListPanel = this.frames
						.createPanel(new bin.user.UserListPanel(this));
				this.navPanel = this.frames
						.createPanel(new bin.user.UserNavPanel(this));
				this.Frame = new Ext.Panel({
							border : false,
							layout : 'border',
							items : [this.navPanel, this.mainPanel]
						});
				this.mainPanel.add(this.userListPanel.MainTabPanel);
				this.mainPanel.setActiveTab(this.userListPanel.MainTabPanel);
				return this.Frame;
			},
			doWinLayout : function(win) {
				this.navPanel.init();
			}
		});