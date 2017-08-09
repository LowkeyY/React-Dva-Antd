/* 
 * Will ensure that the checkchange event is fired on node double click
 */
Ext.override(Ext.tree.TreeNodeUI, {
   toggleCheck : function(value){      
      var cb = this.checkbox;
      if(cb){
         cb.checked = (value === undefined ? !cb.checked : value);
         this.fireEvent('checkchange', this.node, cb.checked);
      }
   }
});