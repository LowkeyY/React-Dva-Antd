Ext.namespace('lib.ComboRemote');

lib.ComboRemote.ComboRemote = Ext.extend(Ext.form.ComboBox,{
    
	/**
	 * Set ComboRemote's value
     * @param {String} value
     * @param {Boolean} load,True to load store before setValue.
     */
	setValue:function(value,load){
		this.value=value;
		var st=this.store;
		if(st){
			if(st.getCount()>0)
				lib.ComboRemote.ComboRemote.superclass.setValue.call(this,value);
			else{
				var cb=this,val=value,initVal=this.initValue;
				this.initValue=Ext.emptyFn;
				var setVal=function(){
					if(cb){
						lib.ComboRemote.ComboRemote.superclass.setValue.call(cb,val);
						cb.initValue=initVal;
						if(st) st.un("load",setVal,cb);
					}
				}
				st.on("load",setVal,cb);
				if(st.lastOptions==null && load!=false){
					var tmp=cb.isExpanded;
					cb.isExpanded=function(){return true;}
					cb.lastQuery=null;
					cb.doQuery(cb.allQuery,true);
					cb.isExpanded=tmp;
				}
			}
		}
	}
});
Ext.reg('comboremote',lib.ComboRemote.ComboRemote);