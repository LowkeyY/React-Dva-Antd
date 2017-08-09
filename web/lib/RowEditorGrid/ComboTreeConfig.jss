Ext.ux.RowEditorGrid.ComboTreeConfig=function(){
	this.init=function(grid,config){
					this.dataField=config.realValueIndex;
					this.textField=config.dataIndex;
					var st=grid.getStore();
					var r;
					var cmv=function(store,recs){
						var combo=this.field;
						for(var i=0;i<recs.length;i++){
							var r=window.transTree(recs[i].get(this.dataField));
							if(r)
								recs[i].set(this.textField,r);
						}
						grid.checkToRefresh();
					};
					grid.regist(this,st,cmv);
				};
	this.save=function(grid, rec, rowIndex){
				  var v=this.getValue();
					rec.set(this.dataField,v);
					var combo=this.field;
					r=window.transTree(v);//树文字与id转换函数,此处看能不能写成本类的函数
					if(r)
					rec.set(this.textField,r);
				}
}