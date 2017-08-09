/*
 * FCKeditor - The text editor for internet
 * Copyright (C) 2003-2005 Frederico Caldeira Knabben
 * 
 * Licensed under the terms of the GNU Lesser General Public License:
 * 		http://www.opensource.org/licenses/lgpl-license.php
 * 
 * For further information visit:
 * 		http://www.fckeditor.net/
 * 
 * "Support Open Source software. What about a donation today?"
 * 
 * File Name: fckplugin.js
 * 	Plugin to insert "Charts" in the editor.
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

// Register the related command.





//FCKCommands.RegisterCommand( 'Chart', new FCKDialogCommand( 'Chart', FCKLang.ChartDlgTitle, FCKPlugins.Items['Chart'].Path + 'fck_Chart.jcp',  340,250 ) ) ;

FCKCommands.RegisterCommand( 'Chart', new FCKExtCommand( 'Chart', FCKLang.ChartDlgTitle,function(Ext,field){
	var urlStr="/lib/FCKeditor/editor/plugins/Chart/getChartPlugin.jcp";
	this.chartSelect = new Ext.form.ComboBox({
							fieldLabel: '图表选择'.loc(),
							hiddenName: 'queryTable',
							width: 200,
							store :new Ext.data.JsonStore({
								url:urlStr,
								root: 'items',
								autoLoad :true,
								fields:["value","text"],
								baseParams:{type:'chart',chart_id:field.parent_id}
							}),
							valueField : 'value',
							displayField : 'text',
							allowBlank:false,
							triggerAction : 'all',
							mode : 'local',
							blankText:'图表必须选择'.loc()
						});
	this.ChartForm = new Ext.form.FormPanel({
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
							this.chartSelect,
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
					}

					]
	});
	this.windowCancel = function(){
		win.close();
    };
	this.windowConfirm =function(){
		var frm = this.ChartForm.form;
		if (frm.isValid()) {
			var tabId=this.chartSelect.getValue();
			var chartWidth = "width_"+frm.findField('Width').getValue();
			var chartHeight = "height_"+frm.findField('Height').getValue();
			var alignValue=frm.findField('align').getValue();
			if(alignValue==''){
				frm.findField('align').setValue("Left");
				alignValue=frm.findField('align').getValue();
			}
			var chartAlign = "align_"+alignValue;
			var name=tabId+"_"+chartWidth+"_"+chartHeight+"_"+chartAlign;

			FCKCharts.Add(name);	
			win.close();			
		}else{
			Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
		}
		
    };


	var win = new Ext.Window({
		    title:'图标选择'.loc(),
			layout:'fit',
			width:350,
			height:200,
			closeAction:'hide',
			plain: true,
			modal:true,
			border : false,
			items : [this.ChartForm],
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

}));

// Create the "Plaholder" toolbar button.
var oChartItem = new FCKToolbarButton( 'Chart', FCKLang.ChartBtn ) ;
oChartItem.IconPath = FCKPlugins.Items['Chart'].Path + 'Chart.gif' ;
FCKToolbarItems.RegisterItem( 'Chart', oChartItem ) ;


// The object used for all Chart operations.
var FCKCharts = new Object() ;

// Add a new Chart at the actual selection.
FCKCharts.Add = function( name )
{
	var oSpan = FCK.CreateElement( 'SPAN' ) ;
	this.SetupSpan( oSpan, name ) ;
}

FCKCharts.SetupSpan = function( span, name )
{
	span.innerHTML = '${'+'Chart_'+name+'}' ;

	span.style.backgroundColor = '#ffff00' ;
	span.style.color = '#000000' ;

	if ( FCKBrowserInfo.IsGecko )
		span.style.cursor = 'default' ;

	span._fckChart = name ;
	span.contentEditable = false ;

	// To avoid it to be resized.
	span.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}

// On Gecko we must do this trick so the user select all the SPAN when clicking on it.
FCKCharts._SetupClickListener = function()
{
	FCKCharts._ClickListener = function( e )
	{
		if ( e.target.tagName == 'SPAN' && e.target._fckChart )
			FCKSelection.SelectNode( e.target ) ;
	}

	FCK.EditorDocument.addEventListener( 'click', FCKCharts._ClickListener, true ) ;
}

// Open the Chart dialog on double click.
FCKCharts.OnDoubleClick = function( span )
{
	if ( span.tagName == 'SPAN' && span._fckChart )
		FCKCommands.GetCommand( 'Chart' ).Execute() ;
}

FCK.RegisterDoubleClickHandler( FCKCharts.OnDoubleClick, 'SPAN' ) ;

// Check if a Placholder name is already in use.
FCKCharts.Exist = function( name )
{
	var aSpans = FCK.EditorDocument.getElementsByTagName( 'SPAN' )

	for ( var i = 0 ; i < aSpans.length ; i++ )
	{
		if ( aSpans[i]._fckChart == name )
			return true ;
	}
}

if ( FCKBrowserInfo.IsIE )
{
	FCKCharts.Redraw = function()
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
				oRange.pasteHTML( '<span style="color: #000000; background-color: #ffff00" contenteditable="false" _fckChart="' + sName + '">' + aPlaholders[i] + '</span>' ) ;
			}
		}
	}
}
else
{
	FCKCharts.Redraw = function()
	{
		var oInteractor = FCK.EditorDocument.createTreeWalker( FCK.EditorDocument.body, NodeFilter.SHOW_TEXT, FCKCharts._AcceptNode, true ) ;

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
						FCKCharts.SetupSpan( oSpan, sName ) ;

						aNodes[n].parentNode.insertBefore( oSpan, aNodes[n] ) ;
					}
					else
						aNodes[n].parentNode.insertBefore( FCK.EditorDocument.createTextNode( aPieces[i] ) , aNodes[n] ) ;
				}
			}

			aNodes[n].parentNode.removeChild( aNodes[n] ) ;
		}
		
		FCKCharts._SetupClickListener() ;
	}

	FCKCharts._AcceptNode = function( node )
	{
		if ( /\[\[[^\[\]]+\]\]/.test( node.nodeValue ) )
			return NodeFilter.FILTER_ACCEPT ;
		else
			return NodeFilter.FILTER_SKIP ;
	}
}

FCK.Events.AttachEvent( 'OnAfterSetHTML', FCKCharts.Redraw ) ;

// The "Redraw" method must be called on startup.
//FCKCharts.Redraw() ;

// We must process the SPAN tags to replace then with the real resulting value of the Chart.
FCKXHtml.TagProcessors['span'] = function( node, htmlNode )
{
	if ( htmlNode._fckChart )
		node = FCKXHtml.XML.createTextNode( '${'+'Chart_'+htmlNode._fckChart+'}') ;
	else
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;

	return node ;
}