
Ext.namespace('dev.gis'); 
/////////////////////////////////////// dev.gis.PicGridView
//
////////////////////////////////////////////////////////////////////
dev.gis.PicGridView = Ext.extend(Ext.grid.GridView, {
    
    tpl: null,
    
    initTemplates : function(){                      
        
        dev.gis.PicGridView.superclass.initTemplates.call(this);
                    
        if(!this.templatedNode){
            this.templatedNode = new Ext.XTemplate(
                    '<div class="db-fg-item x-grid3-row x-unselectable">{content}</div>'
            );
        }
        this.templatedNode.compile();                          
    },
    
    prepareData : function(data){
        return data;
    },
    
    doRender : function(cs, rs, ds, startRow, colCount, stripe){
		if(this.tpl === null) {
			return dev.gis.PicGridView.superclass.doRender.apply(this, arguments);
		}
        var buf = [], rp = {}, r;
        for(var j = 0, len = rs.length; j < len; j++){
            r = rs[j];
            r.data = this.prepareData(r.data);
            rp.content = this.tpl.apply(r.data);
            buf[buf.length] =  this.templatedNode.apply(rp);
        }
        return buf.join("") + '<div style="clear:both"></div>';
    },
    
    updateAllColumnWidths : function(){
        
        
		if(this.tpl === null) {
           
		return dev.gis.PicGridView.superclass.updateAllColumnWidths.apply(this);
       
	}    
    
       
	var tw = this.getTotalWidth();
     
	var clen = this.cm.getColumnCount();
      
	var ws = [];
       
	for(var i = 0; i < clen; i++){
       
		ws[i] = this.getColumnWidth(i);
     
	}

        
	this.innerHd.firstChild.firstChild.style.width = tw;

  
	for(var i = 0; i < clen; i++){
          
		var hd = this.getHeaderCell(i);
      
		hd.style.width = ws[i];
        
	}

      
	this.onAllColumnWidthsUpdated(ws, tw);
  
	},
    
    // private
    updateColumnWidth : function(col, width){
    
        if(this.tpl === null) {
            return dev.gis.PicGridView.superclass.updateColumnWidth.apply(this, arguments);
        }    
    
        var w = this.getColumnWidth(col);
        var tw = this.getTotalWidth();

        this.innerHd.firstChild.firstChild.style.width = tw;
        var hd = this.getHeaderCell(col);
        hd.style.width = w;

        this.onColumnWidthUpdated(col, w, tw);
    },    
    
    updateColumnHidden : function(col, hidden){
    
      
		if(this.tpl === null) {
          
		return dev.gis.PicGridView.superclass.updateColumnHidden.apply(this, arguments);
   
	}        
    
       
	var tw = this.getTotalWidth();

      
		this.innerHd.firstChild.firstChild.style.width = tw;

      
		var display = hidden ? 'none' : '';

       
		var hd = this.getHeaderCell(col);
      
		hd.style.display = display;
        
   
		this.onColumnHiddenUpdated(col, hidden, tw);

    
		delete this.lastViewWidth; // force recalc
        this.layout();
    }
});