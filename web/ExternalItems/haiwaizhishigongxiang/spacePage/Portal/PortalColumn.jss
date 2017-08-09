Ext.ns("ExternalItems.haiwaizhishigongxiang.spacePage.Portal");
loadcss("ExternalItems.haiwaizhishigongxiang.spacePage.Portal.portal");
/*
 * Ext JS Library 2.3.0
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

ExternalItems.haiwaizhishigongxiang.spacePage.Portal.PortalColumn = Ext.extend(Ext.Container, {
    layout: 'anchor',
    autoEl: 'div',
    defaultType: 'portlet',
    cls:'x-portal-column'
});
Ext.reg('portalcolumn', ExternalItems.haiwaizhishigongxiang.spacePage.Portal.PortalColumn);