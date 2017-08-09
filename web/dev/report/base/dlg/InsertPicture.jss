
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

using("lib.FileUpload.FileUploadField");
dev.report.base.dlg.InsertPicture = function(editObj) {
		//dev.report.base.dlg.Picture.parent.constructor.call(this);
		this.id = "insPicture";
		var that = this;
		this.selectImageId='';
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var validateFile = function(fieldValue) {
			var nameSize = fieldValue.length - 4;
			fieldValue = fieldValue.toUpperCase();
			if ((nameSize > 0)
					&& ((fieldValue.lastIndexOf(".PNG") == nameSize)
							|| (fieldValue.lastIndexOf(".GIF") == nameSize)
							|| (fieldValue.lastIndexOf(".JPG") == nameSize) || (fieldValue
							.lastIndexOf(".JPEG") == (nameSize - 1)))) {
				return true
			} else {
				return "impImg_msgWrongType".localize()
			}
		};
		var fileUpload = new lib.FileUpload.FileUploadField({
					emptyText : "Select a picture".localize(),
					tabIndex : 1,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					fieldLabel : "_lbl: picToImport".localize(),
					defaultAutoCreate : {
						tag : "input",
						type : "text",
						size : "65",
						autocomplete : "off"
					},
					width : 420,
					name : "img_filename",
					validator : validateFile
				});
		var formPanel = new Ext.form.FormPanel({
					region: 'center',
					layout : "form",
					border : false,
					baseCls : "x-plain",
					labelWidth : 50,
					labelAlign : "top",
					width : 450,
					defaults : {
						width : 410
					},
					defaultType : "textfield",
					buttonAlign : "right",
					items : [fileUpload]
		});

		that.store = new Ext.data.JsonStore({

			url: '/dev/report/getimages.jcp?type=list&objectId='+dev.report.base.app.params['parent_id'],
			root: 'images',
			fields: ['id','name', 'url', {name:'size', type: 'float'}]
		});   
		that.store.load();

		var tpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{id}">',
				'<div class="thumb"><img src="{url}" title="{name}"></div>',
				'<span class="x-editable">{shortName}</span></div>',
			'</tpl>',
			'<div class="x-clear"></div>'
		);

		var viewPanel = new Ext.Panel({
			id:'images-view',
			region: 'north',
			frame:true,
			width:535,
			height:420,
			autoHeight:false,
			collapsible:false,
			layout:'fit',
			items: new Ext.DataView({
				id:'report-images-view',
				store: that.store,
				tpl: tpl,
				autoHeight:true,
				multiSelect: true,
				overClass:'x-view-over',
				itemSelector:'div.thumb-wrap',
				emptyText: 'No images to display',
				prepareData: function(data){
					data.shortName = Ext.util.Format.ellipsis(data.name, 15);
					data.sizeString = Ext.util.Format.fileSize(data.size);
					return data;
				},
				listeners: {
					click: {
						fn: function(dv,index,node,e){
							that.selectImageId=this.getSelectedRecords()[0].data.id;
							Ext.getCmp("deleteBtn").enable();
							Ext.getCmp("insertBtn").enable();
						}
					}
				}
			})
		});

		var mainPanel = new Ext.Panel({
			baseCls : "main-panel",
			layout: 'border',
			border : false,
			items : [viewPanel,formPanel]
		});
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px 5px 5px 15px"
			},
			title : "Insert Picture".localize(),
			closable : true,
			closeAction : "close",
			cls : "default-format-window",
			autoDestroy : true,
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			layout : "fit",
			width : 450,
			height : 540,
			items : mainPanel,
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				//	that.close()
				},
				show : function() {
					setTimeout(function() {
							})
				},
				activate : function(win) {
				//	that.activate()
				}
			},
			buttons : [ new Ext.Button({
				text : "Upload".localize(),
				tabIndex : 10,
				handler : function() {
					if (formPanel.getForm().isValid()) {
						var frameID = "tmpImportIFrame";
						var frame = Ext.get(frameID);
						if (!frame) {
							frame = document.createElement("iframe");
							frame.id = frameID;
							frame.name = frameID;
							frame.className = "x-hidden";
							if (Ext.isIE) {
								frame.src = Ext.SSL_SECURE_URL
							}
							document.body.appendChild(frame);
							if (Ext.isIE) {
								document.frames[frameID].name = frameID
							}
						}

						var form = Ext.getDom(formPanel.getForm().getEl());
						form.target = frameID;

						form.method = "POST";
						form.action = "/dev/report/picupload.jcp?buid="
								.concat(dev.report.base.app.activeBook.uid, "&suid=",
										dev.report.base.app.activeSheet.getUid(),"&suid=", "&objectId=",dev.report.base.app.params['parent_id']);
						form.enctype = form.encoding = "multipart/form-data";
						try {
						    form.addEventListener("submit", function(){that.store.reload();}, false);
							form.submit();
							Ext.MessageBox.show({
										msg : "_msg: PaloImport Wait".localize(),
										progressText : "Importing".localize().concat("..."),
										width : 300,
										wait : true,
										waitConfig : {
											interval : 200
										},
										fn : function() {
											
										}
									})
						}catch (e) {
							dev.report.base.general.showMsg("Application Error".localize(), e.message.localize(),Ext.MessageBox.ERROR)
						}
					}
				}
			}),new Ext.Button({
				text : "Delete".localize(),
				tabIndex : 10,
				disabled : true,
				id : "deleteBtn",
				handler : function() {
					var params={};
					params['type']="delete";
					params['imageId']=that.selectImageId;
					var conn = new Ext.data.Connection();
					conn.request({
						method : 'GET',
						url : '/dev/report/getimages.jcp',
						params : params
					});
					conn.on('requestcomplete', function(conn, oResponse) {
						that.store.reload();
					}, this);
				}
			}),new Ext.Button({
				text : "Insert".localize(),
				tabIndex : 10,
				disabled : true,
				id : "insertBtn",
				handler : function() {
					var params={};
					params['type']="information";
					params['imageId']=that.selectImageId;
					var conn = new Ext.data.Connection();
					conn.request({
						method : 'GET',
						url : '/dev/report/getimages.jcp',
						params : params
					});
					conn.on('requestcomplete', function(conn, oResponse) {
						var result=Ext.decode(oResponse.responseText);
						if (editObj && editObj.id) {
							var imgWrapper = Ext.get(dev.report.base.app.activePane._domId.concat("_wsel_cont_", editObj.id,"-rzwrap")),
								elX = imgWrapper.dom.offsetLeft, elY = imgWrapper.dom.offsetTop, zIndex = editObj.zindex, 
								locked = editObj.locked, hldata = Ext.encode(editObj.hldata);
								dev.report.base.wsel.img.remove(editObj.id);
						}else{
							var wssApp = dev.report.base.app, 
								selRangeCoords = wssApp.environment.defaultSelection.getActiveRange().getCoords(), 
								tlPx = wssApp.activePane.getPixelsByCoords(selRangeCoords[0],selRangeCoords[1]),
								elX = tlPx[0], elY = tlPx[1], zIndex = dev.report.base.wsel.wselRegistry.getZIndex(),
								locked = dev.report.base.wsel.Picture.defLockedState, hldata = ""
						}
						dev.report.base.wsel.img.createImg(null,that.selectImageId, elY, elX, result.width, result.height, true, zIndex, locked);
						that.win.close();
					}, this);
				}
			}),new Ext.Button({
						text : "Close".localize(),
						tabIndex : 11,
						ctCls : dev.report.kbd.tags.NO_ENTER,
						handler : function() {
							that.win.close()
						}
			})]
		});
	//	this.setContext();
		this.win.show()
}