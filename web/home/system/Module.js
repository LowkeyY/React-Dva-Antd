Ext.app.Module=Ext.extend(Ext.util.Observable,{constructor:function(A){this.addEvents({actioncomplete:true});A=A||{};Ext.apply(this,A);Ext.app.Module.superclass.constructor.call(this);},locale:null,launcher:null,loaded:false,isLoading:false,menuPath:"StartMenu",type:null,id:null,init:Ext.emptyFn,createWindow:Ext.emptyFn,setLocale:Ext.emptyFn,handleRequest:Ext.emptyFn});