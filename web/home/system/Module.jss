/*
 * qWikiOffice Desktop 1.0
 * Copyright(c) 2007-2008, Integrated Technologies, Inc.
 * licensing@qwikioffice.com
 * 
 * http://www.qwikioffice.com/license
 *
 * NOTE:
 * This code is based on code from the original Ext JS desktop demo.
 * I have made many modifications/additions.
 *
 * The Ext JS licensing can be viewed here:
 *
 * Ext JS Library 2.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
Ext.app.Module = Ext.extend(Ext.util.Observable, {
	constructor : function(config){
      this.addEvents({
         'actioncomplete': true
      });

      config = config || {};
      Ext.apply(this, config);
      Ext.app.Module.superclass.constructor.call(this);  
   },
   /**
    * Read/Write {object}
    * Set this by calling setLocal().
    */
   locale: null,
	/**
    * Read only. {object}
    * Override this with the launcher for your module.
    * 
    * Example:
    * 
    * {
    *    iconCls: 'pref-icon',
    *    shortcutIconCls: 'pref-shortcut-icon',
    *    text: 'Preferences',
    *    tooltip: '<b>Preferences</b><br />Allows you to modify your desktop'
    * }
    */
   launcher: null,
   /**
    * Read only. {boolean}
    * Ext.app.App uses this property to determine if the module has been loaded.
    */
   loaded: false,
   /**
    * Read only. {boolean}
    * Ext.app.App uses this property to determine if the module is currently being loaded.
    */
   isLoading: false,
   /**
    * Read only. {string}
    * Override this with the menu path for your module.
    * Ext.app.App uses this property to add this module to the Start Menu.
    * 
    * Case sensitive options are:
    * 1. StartMenu
    * 2. ToolMenu
    * 
    * Example:
    * menuPath: 'StartMenu/Bogus Menu'
    * 
    * To prevent a module from being listed in the StartMenu or ToolMenu, do the following:
    * menuPath: null
    */   
   menuPath: 'StartMenu',
   /**
    * Read only. {string}
    * Override this with the type of your module.
    * Example: 'system/preferences'
    */
   type: null,
   /**
    * Read only. {string}
    * Override this with the unique id of your module.
    */
   id: null,
   /**
    * Override this to initialize your module.
    * Is called by initModules() of the Ext.app.App class.
    */
   init : Ext.emptyFn,
   /**
    * Override this function to create your module's window.
    */
   createWindow : Ext.emptyFn,
   /**
    * @param {object} locale
    *
    * Override this function to allow the locale to be set
    */
   setLocale : Ext.emptyFn,
   /**
	 * @param {array} An array of request objects
	 *
	 * Override this function to handle requests from other modules.
	 * Expect the passed in param to look like the following.
	 * 
	 * {
	 *    requests: [
	 *       {
	 *          action: 'createWindow',
	 *          params: '',
	 *          callback: this.myCallbackFunction,
	 *          scope: this
	 *       },
	 *       { ... }
	 *    ]
	 * }
	 *
	 * View makeRequest() in App.js for more details.
	 */
   handleRequest : Ext.emptyFn
});