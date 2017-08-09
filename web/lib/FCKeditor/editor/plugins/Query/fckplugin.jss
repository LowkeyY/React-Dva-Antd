
var FCKExtCommand = function(name,title,func)
{
	this.Name =name;
	this.Title=title;
	this.func=func;
}

FCKExtCommand.prototype.Execute = function(dom)
{	value=(dom)?dom.innerHTML:"";
	window.parent.FCKeditor_OnExtWindow(FCK,this.func,value);
}

FCKExtCommand.prototype.GetState = function()
{
	return FCK_TRISTATE_OFF ;
}

FCKCommands.RegisterCommand( 'Query', new FCKExtCommand( 'Query', FCKLang.QueryDlgTitle,function(Ext,field,value){
	var urlStr="/lib/FCKeditor/editor/plugins/Query/getQueryPlugin.jcp";

	this.tableSelect = new Ext.form.ComboBox({
							fieldLabel: '查询选择'.loc(),
							hiddenName: 'queryTable',
							width: 180,
							store :new Ext.data.JsonStore({
								url:urlStr,
								root: 'items',
								autoLoad :true,
								fields:["value","text"],
								baseParams:{type:'query',query_id:field.parent_id}
							}),
							valueField : 'value',
							displayField : 'text',
							triggerAction : 'all',
							allowBlank:false,
							blankText:'请选择查询!'.loc(),
							mode : 'local'
						});
	this.itemSelect =  new Ext.form.ComboBox({
							fieldLabel: '数据项选择'.loc(),
							hiddenName: 'queryColumn',
							width: 180,
							store :new Ext.data.JsonStore({
								url:urlStr,
								root: 'items',
								autoLoad :true,
								fields:["value","text"],
								baseParams:{type:'queryCol'}
							}),
							valueField : 'value',
							displayField : 'text',
							triggerAction : 'all',
							allowBlank:false,
							blankText:'请选择数据项!'.loc(),
							mode : 'local'
				});
	this.QueryForm = new Ext.form.FormPanel({
			labelAlign: 'right',
			url:urlStr,
			method:'POST',
			border:false,
			height : 200,
			autoScroll :true,
			bodyStyle:'padding:10px 0px 0px 0px;background:#FFFFFF;',
			items: [
				{
					columnWidth:1.0,
					layout: 'form',
					clear: true,
					border:false,
					items: [	
							this.tableSelect,this.itemSelect
					 ]
					}
			]
	});
	this.windowCancel = function(){
		win.close();
    };
	this.windowConfirm =function(){
		var frm= this.QueryForm.form;
		if(frm.isValid()){
			var tabId=this.tableSelect.getValue();
			var colName = frm.findField('queryColumn').getRawValue();
			var name=tabId+"."+colName;
			FCKQuerys.Add(name);
			win.close();
		}else{
			Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
		}
    };


	var win = new Ext.Window({
		    title:'插入查询数据项'.loc(),
			layout:'fit',
			width:350,
			height:150,
			closeAction:'hide',
			plain: true,
			modal:true,
			border : false,
			items : [this.QueryForm],
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

	this.tableSelect.on('select',function(){
		if(this.tableSelect.oldValue==this.tableSelect.getValue()){
			return;
		}
		this.tableSelect.oldValue=this.tableSelect.getValue();
		var types=this.tableSelect.getValue();
		var itemDS = this.QueryForm.form.findField('queryColumn');
		itemDS.store.load({params:{query_id:types}});
	},this);

}));

var oQueryItem = new FCKToolbarButton( 'Query', FCKLang.QueryBtn ) ;
oQueryItem.IconPath = FCKPlugins.Items['Query'].Path + 'Query.gif' ;
FCKToolbarItems.RegisterItem( 'Query', oQueryItem ) ;

var FCKQuerys = new Object() ;
FCKQuerys.Add = function(name){
	var oSpan = FCK.CreateElement( 'SPAN' ) ;
	this.SetupSpan( oSpan, name ) ;
}

FCKQuerys.SetupSpan = function( span, name )
{
	span.innerHTML = '${'+'Query_'+name+'}' ;

	span.style.backgroundColor = '#ffff00' ;
	span.style.color = '#000000' ;

	if ( FCKBrowserInfo.IsGecko )
		span.style.cursor = 'default' ;

	span._fckQuery = name ;
	span.contentEditable = false ;

	// To avoid it to be resized.
	span.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}

// On Gecko we must do this trick so the user select all the SPAN when clicking on it.
FCKQuerys._SetupClickListener = function()
{
	FCKQuerys._ClickListener = function( e )
	{
		if ( e.target.tagName == 'SPAN' && e.target._fckQuery )
			FCKSelection.SelectNode( e.target ) ;
	}

	FCK.EditorDocument.addEventListener( 'click', FCKQuerys._ClickListener, true ) ;
}

FCKQuerys.OnDoubleClick = function( span )
{
	if ( span.tagName == 'SPAN' && span._fckQuery )
		FCKCommands.GetCommand( 'Query' ).Execute(span) ;
}

FCK.RegisterDoubleClickHandler( FCKQuerys.OnDoubleClick, 'SPAN' ) ;

// Check if a Placholder name is already in use.
FCKQuerys.Exist = function( name )
{
	var aSpans = FCK.EditorDocument.getElementsByTagName( 'SPAN' )

	for ( var i = 0 ; i < aSpans.length ; i++ )
	{
		if ( aSpans[i]._fckQuery == name )
			return true ;
	}
}

if ( FCKBrowserInfo.IsIE )
{
	FCKQuerys.Redraw = function()
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
				oRange.pasteHTML( '<span style="color: #000000; background-color: #ffff00" contenteditable="false" _fckQuery="' + sName + '">' + aPlaholders[i] + '</span>' ) ;
			}
		}
	}
}else{
	FCKQuerys.Redraw = function()
	{
		if ( FCK.EditMode != FCK_EDITMODE_WYSIWYG )
			return ;
		var oInteractor = FCK.EditorDocument.createTreeWalker( FCK.EditorDocument.body, NodeFilter.SHOW_TEXT, FCKQuerys._AcceptNode, true ) ;

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
				if ( aPieces[i].length > 0 )
				{
					if ( aPieces[i].indexOf( '${' ) == 0 )
					{
						var sName = aPieces[i].match( /\[\[\s*([^\]]*?)\s*\]\]/ )[1] ;

						var oSpan = FCK.EditorDocument.createElement( 'span' ) ;
						FCKQuerys.SetupSpan( oSpan, sName ) ;

						aNodes[n].parentNode.insertBefore( oSpan, aNodes[n] ) ;
					}
					else
						aNodes[n].parentNode.insertBefore( FCK.EditorDocument.createTextNode( aPieces[i] ) , aNodes[n] ) ;
				}
			}

			aNodes[n].parentNode.removeChild( aNodes[n] ) ;
		}
		
		FCKQuerys._SetupClickListener() ;
	}

	FCKQuerys._AcceptNode = function( node )
	{
		if ( /\[\[[^\[\]]+\]\]/.test( node.nodeValue ) )
			return NodeFilter.FILTER_ACCEPT ;
		else
			return NodeFilter.FILTER_SKIP ;
	}
}
FCK.Events.AttachEvent( 'OnAfterSetHTML', FCKQuerys.Redraw ) ;
FCKXHtml.TagProcessors['span'] = function( node, htmlNode )
{
	if ( htmlNode._fckQuery )
		node = FCKXHtml.XML.createTextNode( '${'+'Query_'+htmlNode._fckQuery+'}' ) ;
	else
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;

	return node ;
}