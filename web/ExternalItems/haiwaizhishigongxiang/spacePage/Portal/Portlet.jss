Ext.ns("ExternalItems.haiwaizhishigongxiang.spacePage.Portal");
loadcss("ExternalItems.haiwaizhishigongxiang.spacePage.Portal.portal");
/*
 * Ext JS Library 2.3.0 Copyright(c) 2006-2009, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet = Ext.extend(Ext.Panel, {
		    anchor : '100%',
		    frame : true,
		    collapsible : true,
		    draggable : true,
		    cls : 'x-portlet'
		});
Ext.reg('portlet', ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet);