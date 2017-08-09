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
 * 	Plugin to insert "Reports" in the editor.
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

// Register the related command.




var FCKExtCommand = function(name,title,func)
{
	this.Name =name;
	this.Title=title;
	this.func=func;
}

FCKExtCommand.prototype.Execute = function()
{
	window.parent.FCKeditor_OnExtWindow(FCK,this.func);
}

FCKExtCommand.prototype.GetState = function()
{
	return FCK_TRISTATE_OFF ;
}

//FCKCommands.RegisterCommand( 'Report', new FCKDialogCommand( 'Report', FCKLang.ReportDlgTitle, 
//FCKPlugins.Items['Report'].Path + 'fck_Report.jcp', 340, 170 ) ) ;

FCKCommands.RegisterCommand( 'Report', new FCKExtCommand( 'Report', FCKLang.ReportDlgTitle,function(Ext,field){
	var urlStr="/lib/FCKeditor/editor/plugins/Report/getReportPlugin.jcp";
	this.reportSelect = new Ext.form.ComboBox({
							fieldLabel: '报表选择'.loc(),
							hiddenName: 'queryTable',
							width: 200,
							store :new Ext.data.JsonStore({
								url:urlStr,
								root: 'items',
								autoLoad :true,
								fields:["value","text"],
								baseParams:{type:'report',report_id:field.parent_id}
							}),
							valueField : 'value',
							displayField : 'text',
							allowBlank:false,
							blankText:'请选择报表!'.loc(),
							triggerAction : 'all',
							mode : 'local'
						});

	this.ReportForm = new Ext.form.FormPanel({
			labelAlign: 'right',
			url:urlStr,
			method:'POST',
			border:false,
			height : 200,
			width:300,
			autoScroll :true,
			bodyStyle:'padding:10px 0px 0px 0px;background:#FFFFFF;',
			items: [this.reportSelect]
	});
	this.windowCancel = function(){
		win.close();
    };
	this.windowConfirm =function(){
		if(this.ReportForm.form.isValid()){
			var name=this.reportSelect.getValue();
			FCKReports.Add(name);
			win.close();
		}else{
			Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
		}
    };

	var win = new Ext.Window({
		    title:'报表选择'.loc(),
			layout:'fit',
			width:350,
			height:130,
			closeAction:'hide',
			plain: true,
			modal:true,
			border : false,
			items : [this.ReportForm],
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
var oReportItem = new FCKToolbarButton( 'Report', FCKLang.ReportBtn ) ;
oReportItem.IconPath = FCKPlugins.Items['Report'].Path + 'Report.gif' ;
FCKToolbarItems.RegisterItem( 'Report', oReportItem ) ;


// The object used for all Report operations.
var FCKReports = new Object() ;

// Add a new Report at the actual selection.
FCKReports.Add = function( name )
{
	var oSpan = FCK.CreateElement( 'SPAN' ) ;
	this.SetupSpan( oSpan, name ) ;
}

FCKReports.SetupSpan = function( span, name )
{
	span.innerHTML = '${'+'Report_'+name+'}' ;

	span.style.backgroundColor = '#ffff00' ;
	span.style.color = '#000000' ;

	if ( FCKBrowserInfo.IsGecko )
		span.style.cursor = 'default' ;

	span._fckReport = name ;
	span.contentEditable = false ;

	// To avoid it to be resized.
	span.onresizestart = function()
	{
		FCK.EditorWindow.event.returnValue = false ;
		return false ;
	}
}

// On Gecko we must do this trick so the user select all the SPAN when clicking on it.
FCKReports._SetupClickListener = function()
{
	FCKReports._ClickListener = function( e )
	{
		if ( e.target.tagName == 'SPAN' && e.target._fckReport )
			FCKSelection.SelectNode( e.target ) ;
	}

	FCK.EditorDocument.addEventListener( 'click', FCKReports._ClickListener, true ) ;
}

// Open the Report dialog on double click.
FCKReports.OnDoubleClick = function( span )
{
	if ( span.tagName == 'SPAN' && span._fckReport )
		FCKCommands.GetCommand( 'Report' ).Execute() ;
}

FCK.RegisterDoubleClickHandler( FCKReports.OnDoubleClick, 'SPAN' ) ;

// Check if a Placholder name is already in use.
FCKReports.Exist = function( name )
{
	var aSpans = FCK.EditorDocument.getElementsByTagName( 'SPAN' )

	for ( var i = 0 ; i < aSpans.length ; i++ )
	{
		if ( aSpans[i]._fckReport == name )
			return true ;
	}
}

if ( FCKBrowserInfo.IsIE )
{
	FCKReports.Redraw = function()
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
				oRange.pasteHTML( '<span style="color: #000000; background-color: #ffff00" contenteditable="false" _fckReport="' + sName + '">' + aPlaholders[i] + '</span>' ) ;
			}
		}
	}
}
else
{
	FCKReports.Redraw = function()
	{
		if ( FCK.EditMode != FCK_EDITMODE_WYSIWYG )
			return ;
		var oInteractor = FCK.EditorDocument.createTreeWalker( FCK.EditorDocument.body, NodeFilter.SHOW_TEXT, FCKReports._AcceptNode, true ) ;

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
						FCKReports.SetupSpan( oSpan, sName ) ;

						aNodes[n].parentNode.insertBefore( oSpan, aNodes[n] ) ;
					}
					else
						aNodes[n].parentNode.insertBefore( FCK.EditorDocument.createTextNode( aPieces[i] ) , aNodes[n] ) ;
				}
			}

			aNodes[n].parentNode.removeChild( aNodes[n] ) ;
		}
		
		FCKReports._SetupClickListener() ;
	}

	FCKReports._AcceptNode = function( node )
	{
		if ( /\[\[[^\[\]]+\]\]/.test( node.nodeValue ) )
			return NodeFilter.FILTER_ACCEPT ;
		else
			return NodeFilter.FILTER_SKIP ;
	}
}

FCK.Events.AttachEvent( 'OnAfterSetHTML', FCKReports.Redraw ) ;

// The "Redraw" method must be called on startup.
//FCKReports.Redraw() ;

// We must process the SPAN tags to replace then with the real resulting value of the Report.
FCKXHtml.TagProcessors['span'] = function( node, htmlNode )
{
	if ( htmlNode._fckReport )
		node = FCKXHtml.XML.createTextNode('${'+'Report_'+htmlNode._fckReport+'}') ;
	else
		FCKXHtml._AppendChildNodes( node, htmlNode, false ) ;

	return node ;
}