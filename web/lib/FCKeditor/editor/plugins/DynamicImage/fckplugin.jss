


//FCKCommands.RegisterCommand( 'DynamicImage', new FCKDialogCommand( 'DynamicImage', FCKLang.DynamicImageDlgTitle, FCKPlugins.Items['DynamicImage'].Path + 'fck_DynamicImage.jcp', 340,300 )) ;

FCKCommands.RegisterCommand( 'DynamicImage', new FCKExtCommand( 'DynamicImage', FCKLang.DynamicImageDlgTitle,function(Ext,field){

var urlStr="/lib/FCKeditor/editor/plugins/DynamicImage/getImagePlugin.jcp";
	this.imageSelect = new Ext.form.ComboBox({
							fieldLabel: '查询选择'.loc(),
							hiddenName: 'queryTable',
							width: 200,
							store :new Ext.data.JsonStore({
								url:urlStr,
								root: 'items',
								autoLoad :true,
								fields:["value","text"],
								baseParams:{type:'query',query_id:field.parent_id}
							}),
							valueField : 'value',
							displayField : 'text',
							allowBlank:false,
							triggerAction : 'all',
							mode : 'local',
							blankText:'查询必须选择'.loc()
						});
	this.itemSelect = new Ext.form.ComboBox({
						fieldLabel: '图片数据项'.loc(),
						hiddenName: 'item',
						width: 200,
						store :new Ext.data.JsonStore({
							url:urlStr,
							root: 'items',
							autoLoad :true,
							fields:["value","text"],
							baseParams:{type:'item'}
						}),
						valueField : 'value',
						displayField : 'text',
						allowBlank:false,
						triggerAction : 'all',
						mode : 'local',
						blankText:'图片数据项必须选择'.loc()
					});
	this.fileNameSelect = new Ext.form.ComboBox({
						fieldLabel: '文件名称项'.loc(),
						hiddenName: 'fileName',
						width: 200,
						store :new Ext.data.JsonStore({
							url:urlStr,
							root: 'items',
							autoLoad :true,
							fields:["value","text"],
							baseParams:{type:'fileName'}
						}),
						valueField : 'value',
						displayField : 'text',
						allowBlank:false,
						triggerAction : 'all',
						mode : 'local',
						blankText:'文件名称项必须选择'.loc()
					});
	this.fileTypeSelect = new Ext.form.ComboBox({
						fieldLabel: '文件类型项'.loc(),
						hiddenName: 'fileType',
						width: 200,
						store :new Ext.data.JsonStore({
							url:urlStr,
							root: 'items',
							autoLoad :true,
							fields:["value","text"],
							baseParams:{type:'fileType'}
						}),
						valueField : 'value',
						displayField : 'text',
						allowBlank:false,
						triggerAction : 'all',
						mode : 'local',
						blankText:'文件类型项必须选择'.loc()
					});
	this.fileSizeSelect = new Ext.form.ComboBox({
						fieldLabel: '文件大小项'.loc(),
						hiddenName: 'fileSize',
						width: 200,
						store :new Ext.data.JsonStore({
							url:urlStr,
							root: 'items',
							autoLoad :true,
							fields:["value","text"],
							baseParams:{type:'fileSize'}
						}),
						valueField : 'value',
						displayField : 'text',
						allowBlank:false,
						triggerAction : 'all',
						mode : 'local',
						blankText:'文件大小项必须选择'.loc()
					});
	this.ImageForm = new Ext.form.FormPanel({
			labelAlign: 'right',
			url:urlStr,
			method:'POST',
			border:false,
			height : 200,
			autoScroll :true,
			bodyStyle:'padding:10px 0px 0px 0px;background:#FFFFFF;',
			items: [
							this.imageSelect,
							this.itemSelect,
							this.fileNameSelect,
							this.fileTypeSelect,
							this.fileSizeSelect,
						{
							xtype:'numberfield',
							fieldLabel: '宽度'.loc(),
							name: 'Width',
							minLength : 0,
							width: 200,
							allowBlank:false,
							blankText:'宽度必须填写'.loc(),
							maxLength : 60
						},{
							xtype:'numberfield',
							fieldLabel: '高度'.loc(),
							name: 'Height',
							minLength : 0,
							width: 200,
							allowBlank:false,
							blankText:'高度必须填写'.loc(),
							maxLength : 60
						},{
							xtype:'combo',
							fieldLabel: '对齐方式'.loc(),
							hiddenName: 'align',
							width: 200,
							store : new Ext.data.SimpleStore( {
								fields : ['value', 'text'],
								data : [['Left','左对齐'.loc()],['absBottom','绝对底边'.loc()],['absMiddle','绝对居中'.loc()],['Baseline','基线'.loc()],['Bottom','底边'.loc()],['Middle','居中'.loc()],['Right','右对齐'.loc()],['Text Top','文本上方'.loc()],['Top','顶端'.loc()]]
							}),
							valueField : 'value',
							displayField : 'text',
							triggerAction : 'all',
							mode : 'local',
							readOnly : true
						}
					]
	});
	this.windowCancel = function(){
		win.close();
    };
	var frm=this.ImageForm.form;
	this.windowConfirm =function(){
		if (frm.isValid()) {
			var tabId = this.imageSelect.getValue();
			var items = "dataColumn_"+frm.findField('item').getRawValue();
			var imageWidth = "width_"+frm.findField('Width').getValue();
			var imageHeight = "height_"+frm.findField('Height').getValue();
			var alignValue=frm.findField('align').getValue();
			var fileName = "fileName_"+frm.findField('fileName').getRawValue();
			var fileType = "fileType_"+frm.findField('fileType').getRawValue();
			var fileSize = "fileSize_"+frm.findField('fileSize').getRawValue();
			if(alignValue==''){
				frm.findField('align').setValue("Left");
				alignValue=frm.findField('align').getValue();
			}
			var imageAlign = "align_"+alignValue;
			var name=tabId+"_"+items+"_"+imageWidth+"_"+imageHeight+"_"+imageAlign+"_"+fileName+"_"+fileType+"_"+fileSize;

			FCKDynamicImages.Add(name);	
			win.close();			
		}else{
			Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
		}
		
    };

	var win = new Ext.Window({
		    title:'插入动态编辑图片'.loc(),
			layout:'fit',
			width:350,
			height:300,
			closeAction:'hide',
			plain: true,
			modal:true,
			border : false,
			items : [this.ImageForm],
			buttons: [{
				text:'确定'.loc(),
				scope:this,
				handler: this.windowConfirm
			},{
				text: '取消'.loc(),
				scope:this,
				handler: this.windowCancel
			}]
	});
	win.show();


	this.imageSelect.on('select',function(){
		if(this.imageSelect.oldValue==this.imageSelect.getValue()){
			return;
		}
		this.imageSelect.oldValue=this.imageSelect.getValue();
		var types=this.imageSelect.getValue();
		var itemDS = frm.findField('item');
		var nameDS = frm.findField('fileName');
		var typeDS = frm.findField('fileType');
		var sizeDS = frm.findField('fileSize');
		itemDS.store.load({params:{query_id:types}});
		nameDS.store.load({params:{query_id:types}});
		typeDS.store.load({params:{query_id:types}});
		sizeDS.store.load({params:{query_id:types}});
	},this);
}));

// Create the "Plaholder" toolbar button.
var oDynamicImageItem = new FCKToolbarButton( 'DynamicImage', FCKLang.DynamicImageBtn ) ;
oDynamicImageItem.IconPath = FCKPlugins.Items['DynamicImage'].Path + 'DynamicImage.gif' ;
FCKToolbarItems.RegisterItem( 'DynamicImage', oDynamicImageItem ) ;


// The object used for all DynamicImage operations.
var FCKDynamicImages = new Object() ;

// Add a new DynamicImage at the actual selection.
FCKDynamicImages.Add = function( name )
{
	var oSpan = FCK.CreateElement( 'SPAN' ) ;
	this.SetupSpan( oSpan, name ) ;
}

FCKDynamicImages.SetupSpan = function( span, name )
{
	span.innerHTML = '${'+'DynamicImage_'+name+'}' ;

	span.style.backgroundColor = '#ffff00' ;
	span.style.color = '#000000' ;

	if ( FCKBrowserInfo.IsGecko )
		span.style.cursor = 'default' ;

	span._fckDynamicImage = name ;
	span.contentEditable = false ;

	// To avoid it to be resized.
	span.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}

// On Gecko we must do this trick so the user select all the SPAN when clicking on it.
FCKDynamicImages._SetupClickListener = function()
{
	FCKDynamicImages._ClickListener = function( e )
	{
		if ( e.target.tagName == 'SPAN' && e.target._fckDynamicImage )
			FCKSelection.SelectNode( e.target ) ;
	}

	FCK.EditorDocument.addEventListener( 'click', FCKDynamicImages._ClickListener, true ) ;
}

// Open the DynamicImage dialog on double click.
FCKDynamicImages.OnDoubleClick = function( span )
{
	if ( span.tagName == 'SPAN' && span._fckDynamicImage )
		FCKCommands.GetCommand( 'DynamicImage' ).Execute() ;
}

FCK.RegisterDoubleClickHandler( FCKDynamicImages.OnDoubleClick, 'SPAN' ) ;

// Check if a Placholder name is already in use.
FCKDynamicImages.Exist = function( name )
{
	var aSpans = FCK.EditorDocument.getElementsByTagName( 'SPAN' )

	for ( var i = 0 ; i < aSpans.length ; i++ )
	{
		if ( aSpans[i]._fckDynamicImage == name )
			return true ;
	}
}

if ( FCKBrowserInfo.IsIE )
{
	FCKDynamicImages.Redraw = function()
	{
		var aPlaholders = FCK.EditorDocument.body.innerText.match( /\[\[[^\[\]]+\]\]/g ) ;
		if ( !aPlaholders )
			return ;

		var oRange = FCK.EditorDocument.body.createTextRange() ;

		for ( var i = 0 ; i < aPlaholders.length ; i++ )
		{
			if ( oRange.findText( aPlaholders[i] ) )
			{
				var sName = aPlaholders[i].match( /\[\[\s*([^\]]*?)\s*\]\]/ )[1] ;
				oRange.pasteHTML( '<span style="color: #000000; background-color: #ffff00" contenteditable="false" _fckDynamicImage="' + sName + '">' + aPlaholders[i] + '</span>' ) ;
			}
		}
	}
}
else
{
	FCKDynamicImages.Redraw = function()
	{
		if ( FCK.EditMode != FCK_EDITMODE_WYSIWYG )
			return ;
		var oInteractor = FCK.EditorDocument.createTreeWalker( FCK.EditorDocument.body, NodeFilter.SHOW_TEXT, FCKDynamicImages._AcceptNode, true ) ;

		var	aNodes = new Array() ;

		while ( oNode = oInteractor.nextNode() )
		{
			aNodes[ aNodes.length ] = oNode ;
		}

		for ( var n = 0 ; n < aNodes.length ; n++ )
		{
			var aPieces = aNodes[n].nodeValue.split( /(\[\[[^\[\]]+\]\])/g ) ;

			for ( var i = 0 ; i < aPieces.length ; i++ )
			{
				alert(aPieces[i]);
				if ( aPieces[i].length > 0 )
				{
					if ( aPieces[i].indexOf( '${' ) == 0 )
					{
						var sName = aPieces[i].match( /\[\[\s*([^\]]*?)\s*\]\]/ )[1] ;

						var oSpan = FCK.EditorDocument.createElement( 'span' ) ;
						FCKDynamicImages.SetupSpan( oSpan, sName ) ;

						aNodes[n].parentNode.insertBefore( oSpan, aNodes[n] ) ;
					}
					else
						aNodes[n].parentNode.insertBefore( FCK.EditorDocument.createTextNode( aPieces[i] ) , aNodes[n] ) ;
				}
			}

			aNodes[n].parentNode.removeChild( aNodes[n] ) ;
		}
		
		FCKDynamicImages._SetupClickListener() ;
	}

	FCKDynamicImages._AcceptNode = function( node )
	{
		if ( /\[\[[^\[\]]+\]\]/.test( node.nodeValue ) )
			return NodeFilter.FILTER_ACCEPT ;
		else
			return NodeFilter.FILTER_SKIP ;
	}
}

FCK.Events.AttachEvent( 'OnAfterSetHTML', FCKDynamicImages.Redraw ) ;

// The "Redraw" method must be called on startup.
//FCKDynamicImages.Redraw() ;

// We must process the SPAN tags to replace then with the real resulting value of the DynamicImage.
FCKXHtml.TagProcessors['span'] = function( node, htmlNode )
{
	if ( htmlNode._fckDynamicImage )
		node = FCKXHtml.XML.createTextNode( '${'+'DynamicImage_'+htmlNode._fckDynamicImage+'}') ;
	else
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;

	return node ;
}