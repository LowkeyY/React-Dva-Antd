lib.lms.paperplayer.Question = Ext.extend(Ext.Panel, {
			getAnswer : Ext.emptyFn,
			setAnswer : Ext.emptyFn
		});

lib.lms.paperplayer.SingleSelect = Ext.extend(lib.lms.paperplayer.Question, {
			afterRender : function() {

				lib.lms.paperplayer.SingleSelect.superclass.afterRender
						.call(this);
			},
			initComponent : function() {
				this.html = "<div style='margin:20 0 0 30;width:300px;'><h2>"
						+ this.text + "</h2><p></p>";
				for (var i = 0; i < this.options.length; i++) {
					this.html += "<input type='radio' name='" + this.id
							+ "' style='margin:0 10 0 5'>"
							+ this.options[i].title + "<br>"
				}
				this.html += "</div>";
				lib.lms.paperplayer.SingleSelect.superclass.initComponent
						.call(this);
			}

		});