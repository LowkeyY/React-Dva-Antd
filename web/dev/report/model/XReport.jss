Ext.namespace("dev.report");
Ext.namespace("dev.report.model");

dev.report.model.XReport = function() {

	this.name = '新建报表';
	this.language = "java";
	this.columnCount = 1;

	/*
	 * Horizontal:columnNum on the report are filled horizontally Vertical:columnNum
	 * on the report are filled vertically
	 */
	this.printOrder = "Vertical";
	/*
	 * LTR:columnNum on the report are filled from left to right RTL:columnNum on
	 * the report are filled from right to left
	 */
	this.columnDirection = "LTR";  

	this.pageSize = "A4";

	this.pageWidth = 595;
	this.pageHeight = 842;
	/*
	 * Portrait:Portrait page layout Landscape:Landscape page layout
	 */
	this.orientation = "Portrait";
	/*
	 * NoPages:The generated document contains zero pages. BlankPage:The
	 * generated document contains one blank page AllSectionsNoDetail:All the
	 * report sections except the detail section will get printed
	 * NoDataSection:The generated document contains only the noData section
	 */
	this.whenNoDataType = "NoPages";

	this.columnWidth = 555;
	this.columnSpacing = 0;
	this.leftMargin = 20;
	this.rightMargin = 20;
	this.topMargin = 30;
	this.bottomMargin = 30;
	this.rowNum=5;
	this.columnNum=30;
   
	this.isTitleNewPage = "false";
	/*
	 * true:Title section will be printed on a separate initial page.
	 * false:Title section will be printed on the first page of the report,
	 * along with the other sections
	 */
	this.isSummaryNewPage = "false";
	/*
	 * true:Summary section will be printed on a separate last page.
	 * false:Summary section will be printed on the last page of the report,
	 * along with the other sections, if there is enough space.
	 */

	this.isSummaryWithPageHeaderAndFooter = "false";
	/*
	 * true:Summary section will be printed along with the page header and
	 * footer. false:Summary section will be printed without page header and
	 * footer.
	 */

	this.isFloatColumnFooter = "false";
	/*
	 * true:The column footer section is printed immediately after the last
	 * detail or group footer printed on the current column. false:The column
	 * footer section is printed at the bottom of the current column.
	 */
	this.scriptletClass = "";
	/*
	 * Indicates which class implements the scriptlets functionality for this
	 * report. The specified class must be a subclass of <code>JRAbstractScriptlet</code>
	 * class. If omitted, an instance of <code>JRDefaultScriptlet</code> will
	 * be created.
	 */

	this.resourceBundle = "";
	/*
	 * The base name of the report associated resource bundle.
	 */

	this.whenResourceMissingType = "Null";
	/*
	 * Null:Null is returned for the missing resource. Empty:An empty string is
	 * returned for the missing resource. Key:The key is returned for the
	 * missing resources. Error:An exception is thrown when the resource with
	 * the specified key is missing.
	 */

	this.isIgnorePagination = "false";
	/*
	 * true:The report will be generated on one long page. The specified page
	 * height will still be used for report design. false:The report will be
	 * paginated according to the pageHeight attribute.
	 */

	this.formatFactoryClass = "";
	/*
	 * Specifies the name of the class implementing the <code>net.sf.jasperreports.engine.util.FormatFactory</code>
	 * interface to use with this report. If omitted, an instance of <code>net.sf.jasperreports.engine.util.DefaultFormatFactory</code>
	 * will be created.
	 */

	this.title=null;

	this.pageHeader=new dev.report.model.XPageHeader();

	this.pageFooter=new dev.report.model.XPageFooter();

	this.background=null;

	this.query=new dev.report.model.XQuery();

	this.columnHeader=null;

	this.detail=null;

	this.columnFooter=null;

	this.lastPageFooter=null;

	this.summary=null;

	this.noData=null;

	this.tabMap=new dev.report.model.XTable();

	this.styles={};

	this.propertys={};

	this.scriptlets={};

	this.variables={};

	this.reportFonts={};

	this.groups={};

	this.imports={};

	this.templates={};

	this.subDataset=[];

	this.parameter=[];

	this.fields={};

	this.sortField=[];

	this.typeMap={};

	this.typeMap['java.lang.String']=0;
	this.typeMap['java.lang.Double']=1;
	this.typeMap['java.lang.Integer']=2;

}

var _p = dev.report.model.XReport.prototype;


_p.removeAll = function() {

	this.name = '新建报表';

	this.language = "java";

	this.columnCount = 1;

	this.printOrder = "Vertical";

	this.columnDirection = "LTR";

	this.pageSize = "A4";

	this.pageWidth = 595;
	this.pageHeight = 842;

	this.orientation = "Portrait";

	this.whenNoDataType = "NoPages";

	this.columnWidth = 555;
	this.columnSpacing = 0;
	this.leftMargin = 20;
	this.rightMargin = 20;
	this.topMargin = 30;
	this.bottomMargin = 30;
	this.rowNum=5;
	this.columnNum=30;
   
	this.isTitleNewPage = "false";

	this.isSummaryNewPage = "false";

	this.isSummaryWithPageHeaderAndFooter = "false";

	this.isFloatColumnFooter = "false";

	this.scriptletClass = "";

	this.resourceBundle = "";

	this.whenResourceMissingType = "Null";

	this.isIgnorePagination = "false";

	this.formatFactoryClass = "";

	this.title=null;

	this.pageHeader=new dev.report.model.XPageHeader();

	this.pageFooter=new dev.report.model.XPageFooter();

	this.background=null;

	this.query=new dev.report.model.XQuery();

	this.columnHeader=null;

	this.detail=null;

	this.columnFooter=null;

	this.lastPageFooter=null;

	this.summary=null;

	this.noData=null;

	this.tabMap=new dev.report.model.XTable();

	this.styles={};

	this.reportFonts={};

	this.propertys={};

	this.variables={};

	this.groups={};

	this.scriptlets={};
	
	this.imports={};

	this.templates={};

	this.fields={};

/*

	this.subDataset=[];

	this.parameter=[];

	this.sortField=[];
	*/

}

_p.addField=function(fld){
	var _field=this.fields;
	_field[fld.name]=fld;
	this.fields=_field;
}
_p.removeField=function(name) {
	delete this.fields[name];
}
_p.getField=function(name) {
    return this.fields[name];
}

_p.addProperty=function(prop){
	var _prop=this.propertys;
	_prop[prop.name]=prop;
	this.propertys=_prop;
}
_p.removeProperty=function(name) {
	delete this.propertys[name];
}
_p.getProperty=function(name) {
    return this.propertys[name];
}

_p.addGroup=function(grp){
	var _group=this.groups;
	_group[grp.name]=grp;
	this.groups=_group;
}
_p.removeGroup=function(name) {
	delete this.groups[name];
}
_p.getGroup=function(name) {
    return this.groups[name];
}
_p.addReportFont=function(rpf){
	var _reportFont=this.reportFonts;
	_reportFont[rpf.id]=rpf;
	this.reportFonts=_reportFont;
}
_p.removeReportFont=function(id) {
	delete this.reportFonts[id];
}
_p.getReportFont=function(id) {
    return this.reportFonts[id];
}
_p.addVariable=function(v){
	var _variable=this.variables;
	_variable[v.name]=v;
	this.variables=_variable;
}
_p.removeVariable=function(name) {
	delete this.variables[name];
}
_p.getVariable=function(id) {
    return this.variables[id];
}
_p.addScriptlet=function(v){
	var _scriptlet=this.scriptlets;
	_scriptlet[v.name]=v;
	this.scriptlets=_scriptlet;
}
_p.removeScriptlet=function(name) {
	delete this.scriptlets[name];
}
_p.getScriptlet=function(id) {
    return this.scriptlets[id];
}

_p.addImport=function(imp){
	var _import=this.imports;
	_import[imp.class1]=imp;
	this.imports=_import;
}
_p.removeImport=function(class1) {
	delete this.imports[class1];
}
_p.getImport=function(id) {
    return this.imports[class1];
}
_p.addTemplate=function(t){
	var _template=this.templates;
	_template[t.value]=t;
	this.templates=_template;
}
_p.removeTemplate=function(value) {
	delete this.templates[value];
}
_p.getTemplate=function(value) {
    return this.templates[value];
}

_p.addStyle=function(s){
	var _styles=this.styles;
	_styles[s.name]=s;
	this.styles=_styles;
}
_p.getStyle=function(id) {
	return this.styles[id];
}
_p.getStylesObject=function() {
	return this.styles;
}
_p.removeStyle=function(id) {
   delete this.styles[id];
}
_p.init = function(rptElements) {
	
	 if(rptElements.nodeName=='xReport'){
		 if(rptElements.attributes.getNamedItem("name")!=null){
			this.name = rptElements.attributes.getNamedItem("name").value;
		}
		this.language = rptElements.attributes.getNamedItem("language").value;

		if(rptElements.attributes.getNamedItem("columnCount")!=null){
			this.columnCount = rptElements.attributes.getNamedItem("columnCount").value;
		}
		if(rptElements.attributes.getNamedItem("columnDirection")!=null){
			this.columnDirection = rptElements.attributes.getNamedItem("columnDirection").value;
		}
		if(rptElements.attributes.getNamedItem("pageSize")!=null){
			this.pageSize = rptElements.attributes.getNamedItem("pageSize").value;
		}

		this.printOrder = rptElements.attributes.getNamedItem("printOrder").value;
		this.orientation = rptElements.attributes.getNamedItem("orientation").value;
		this.whenNoDataType =rptElements.attributes.getNamedItem("whenNoDataType").value;	
		this.pageWidth = rptElements.attributes.getNamedItem("pageWidth").value;
		this.pageHeight =rptElements.attributes.getNamedItem("pageHeight").value;	
		this.columnWidth = rptElements.attributes.getNamedItem("columnWidth").value;
		this.columnSpacing =rptElements.attributes.getNamedItem("columnSpacing").value;	
		this.leftMargin = rptElements.attributes.getNamedItem("leftMargin").value;
		this.rightMargin =rptElements.attributes.getNamedItem("rightMargin").value;	
		this.topMargin = rptElements.attributes.getNamedItem("topMargin").value;
		this.bottomMargin =rptElements.attributes.getNamedItem("bottomMargin").value;	
		if(rptElements.attributes.getNamedItem("isTitleNewPage")!=null){
			this.isTitleNewPage = rptElements.attributes.getNamedItem("isTitleNewPage").value;
		}
		if(rptElements.attributes.getNamedItem("isSummaryNewPage")!=null){
			this.isSummaryNewPage = rptElements.attributes.getNamedItem("isSummaryNewPage").value;
		}
		if(rptElements.attributes.getNamedItem("isSummaryWithPageHeaderAndFooter")!=null){
			this.isSummaryWithPageHeaderAndFooter = rptElements.attributes.getNamedItem("isSummaryWithPageHeaderAndFooter").value;
		}
		if(rptElements.attributes.getNamedItem("isFloatColumnFooter")!=null){
			this.isFloatColumnFooter = rptElements.attributes.getNamedItem("isFloatColumnFooter").value;
		}
		if(rptElements.attributes.getNamedItem("scriptletClass")!=null){
			this.scriptletClass = rptElements.attributes.getNamedItem("scriptletClass").value;
		}
		if(rptElements.attributes.getNamedItem("resourceBundle")!=null){
			this.resourceBundle = rptElements.attributes.getNamedItem("resourceBundle").value;
		}
		if(rptElements.attributes.getNamedItem("whenResourceMissingType")!=null){
			this.whenResourceMissingType = rptElements.attributes.getNamedItem("whenResourceMissingType").value;
		}
		if(rptElements.attributes.getNamedItem("isIgnorePagination")!=null){
			this.isIgnorePagination = rptElements.attributes.getNamedItem("isIgnorePagination").value;
		}
		if(rptElements.attributes.getNamedItem("formatFactoryClass")!=null){
			this.formatFactoryClass = rptElements.attributes.getNamedItem("formatFactoryClass").value;
		}
		var rptEles=rptElements.childNodes;

		var fieldArray=[];
		for(var k=0;k<rptEles.length;k++){
			  var rptEle=rptEles[k];
			  if(rptEle.nodeName=='Table'){
					this.tabMap=new dev.report.model.XTable();
					this.tabMap.init(rptEle);
			  }
			  if(rptEle.nodeName=='background'){
					this.background=new dev.report.model.XBackground();
					this.background.init(rptEle);
			  }
			  if(rptEle.nodeName=='title'){
					this.title=new dev.report.model.XTitle();
					this.title.init(rptEle);
			  }
			  if(rptEle.nodeName=='pageHeader'){
					this.pageHeader=new dev.report.model.XPageHeader();
					this.pageHeader.init(rptEle);
			  }
			  if(rptEle.nodeName=='pageFooter'){
					this.pageFooter=new dev.report.model.XPageFooter();
					this.pageFooter.init(rptEle);
			  }
			  if(rptEle.nodeName=='columnHeader'){
					this.columnHeader=new dev.report.model.XColumnHeader();
					this.columnHeader.init(rptEle);
			  }
			  if(rptEle.nodeName=='detail'){
					this.detail=new dev.report.model.XDetail();
					this.detail.init(rptEle);
			  }
			  if(rptEle.nodeName=='columnFooter'){
					this.columnFooter=new dev.report.model.XColumnFooter();
					this.columnFooter.init(rptEle);
			  }
			  if(rptEle.nodeName=='lastPageFooter'){
					this.lastPageFooter=new dev.report.model.XLastPageFooter();
					this.lastPageFooter.init(rptEle);
			  }
			  if(rptEle.nodeName=='noData'){
					this.noData=new dev.report.model.XNoData();
					this.noData.init(rptEle);
			  }
			  if(rptEle.nodeName=='query'){
					dev.report.base.app.Report.rt.removeAll();
					this.query=new dev.report.model.XQuery();
					this.query.init(rptEle);
			  }
			  if(rptEle.nodeName=='field'){
					var fld=new dev.report.model.XField();
					fld.init(rptEle);
					var col={};
					col.name=fld.name;
					col.type=fld.class1;
					col.category="F";
					col.is_group=false;
					fieldArray.push(col);
			  }
			  if(rptEle.nodeName=='summary'){
					this.summary=new dev.report.model.XSummary();
					this.summary.init(rptEle);
			  }
			  if(rptEle.nodeName=='style'){
				var style=new dev.report.model.XStyle();
				style.init(rptEle);
				this.addStyle(style)
			 }
			 if(rptEle.nodeName=='property'){
				var property=new dev.report.model.XProperty();
				property.init(rptEle);
				this.addProperty(property)
			 }
			 if(rptEle.nodeName=='reportFont'){
				var reportFont=new dev.report.model.XFont();
				reportFont.init(rptEle);
				this.addReportFont(reportFont);
			 }
			 if(rptEle.nodeName=='group'){
				var group=new dev.report.model.XGroup();
				group.init(rptEle);
				this.addGroup(group)
			 }
			 if(rptEle.nodeName=='variable'){
				var variable=new dev.report.model.XVariable();
				variable.init(rptEle);
				if(variable.calculation=='Nothing'){
					var col={};
					col.name=variable.name;
					col.type=variable.class1;
					col.category="V";
					col.is_group=false;
					fieldArray.push(col);
				}
				this.addVariable(variable);
			 }
			 if(rptEle.nodeName=='scriptlet'){
				var scriptlet=new dev.report.model.XScriptlet();
				scriptlet.init(rptEle);
				this.addScriptlet(scriptlet)
			 }
			 if(rptEle.nodeName=='import'){
				var imp=new dev.report.model.XImport();
				imp.init(rptEle);
				this.addImport(imp);
			 }
			 if(rptEle.nodeName=='template'){
				var template=new dev.report.model.XTemplate();
				template.init(rptEle);
				this.addTemplate(template);
			 }
		}
		for(var i in this.groups){
			var grp=this.groups[i].groupExpression.expression;
			grp=grp.replace("$F{","");
			grp=grp.replace("$V{","");
			grp=grp.replace("}","");
			grp=grp.replace(" ","");
			for(j=0;j<fieldArray.length;j++){
				if(fieldArray[j].name==grp){
					fieldArray[j].is_group=true;
				}
			}
		}
		
		var rt=this.query;
		rt.columns=fieldArray;
		dev.report.base.app.Report.rt.add(rt);
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('<xReport ');
	str.push(' name="'+this.name+'"');
	str.push(' language="'+this.language+'"');
	str.push(' columnCount="'+this.columnCount+'"');
	str.push(' printOrder="'+this.printOrder+'"');
	str.push(' columnDirection="'+this.columnDirection+'"');
	str.push(' orientation="'+this.orientation+'"');
	str.push(' whenNoDataType="'+this.whenNoDataType+'"');
	
	str.push(' pageSize="'+this.pageSize+'"');
	str.push(' pageWidth="'+this.pageWidth+'"');
	str.push(' pageHeight="'+this.pageHeight+'"');

	str.push(' columnWidth="'+this.columnWidth+'"');
	str.push(' columnSpacing="'+this.columnSpacing+'"');
	str.push(' leftMargin="'+this.leftMargin+'"');
	str.push(' rightMargin="'+this.rightMargin+'"');
	str.push(' topMargin="'+this.topMargin+'"');
	str.push(' bottomMargin="'+this.bottomMargin+'"');
	

	if(this.isTitleNewPage!='false'){
		str.push(' isTitleNewPage="'+this.isTitleNewPage+'"');
	}
	if(this.isSummaryNewPage!='false'){
		str.push(' isSummaryNewPage="'+this.isSummaryNewPage+'"');
	}
	if(this.isSummaryWithPageHeaderAndFooter!='false'){
		str.push(' isSummaryWithPageHeaderAndFooter="'+this.isSummaryWithPageHeaderAndFooter+'"');
	}
	if(this.isFloatColumnFooter!='false'){
		str.push(' isFloatColumnFooter="'+this.isFloatColumnFooter+'"');
	}
	if(this.scriptletClass!=''){
		str.push(' scriptletClass="'+this.scriptletClass+'"');
	}
	if(this.resourceBundle!=''){
		str.push(' resourceBundle="'+this.resourceBundle+'"');
	}
	if(this.whenResourceMissingType!='Null'){
		str.push(' whenResourceMissingType="'+this.whenResourceMissingType+'"');
	}
	if(this.isIgnorePagination!='false'){
		str.push(' isIgnorePagination="'+this.isIgnorePagination+'"');
	}
	if(this.formatFactoryClass!=''){
		str.push(' formatFactoryClass="'+this.formatFactoryClass+'"');
	}
	str.push('>');

	for(var i in this.propertys){
		str.push(this.propertys[i].toXML());;
	}

	for(var i in this.imports){
		str.push(this.imports[i].toXML());;
	}

	for(var i in this.templates){
		str.push(this.templates[i].toXML());;
	}
	for(var i in this.reportFonts){
		str.push(this.reportFonts[i].toXML());;
	}
	for(var i in this.styles){
		str.push(this.styles[i].toXML());
	}
	for(var i in this.scriptlets){
		str.push(this.scriptlets[i].toXML());;
	}
	if(this.query!=null){
		str.push(this.query.toXML());
	}
	for(var i in this.fields){
		str.push(this.fields[i].toXML());;
	}
	if(	this.tabMap!=null){
		str.push(this.tabMap.toXML());
	}
	for(var i in this.variables){
		str.push(this.variables[i].toXML());;
	}
	for(var i in this.groups){
		str.push(this.groups[i].toXML());
	}
	if(this.background!=null){
		str.push(this.background.toXML());
	}
	if(this.title!=null){
		str.push(this.title.toXML());
	}
	if(this.pageHeader!=null){
		str.push(this.pageHeader.toXML());
	}
	if(this.columnHeader!=null){
		str.push(this.columnHeader.toXML());
	}
	if(this.detail!=null){
		str.push(this.detail.toXML());
	}
	if(this.columnFooter!=null){
		str.push(this.columnFooter.toXML());
	}
	if(this.pageFooter!=null){
		str.push(this.pageFooter.toXML());
	}
	if(this.lastPageFooter!=null){
		str.push(this.lastPageFooter.toXML());
	}
	if(this.summary!=null){
		str.push(this.summary.toXML());
	}
	if(this.noData!=null){
		str.push(this.noData.toXML());
	}	
	str.push('\n</xReport>');
	return str.join('');
}
//====================================================查询资源定义===================================================
dev.report.model.XQuery = function() {  
	this.tableName= "";
	this.rename="";
	this.isSys= "";
	this.query_id= "";
	this.server= "";
	this.level= "";
	this.params = new Array();
}
var _p = dev.report.model.XQuery.prototype;

_p.init = function(resourceElement) {
	this.tableName= resourceElement.attributes.getNamedItem("name").value;
	this.rename= resourceElement.attributes.getNamedItem("rename").value;
	this.isSys= resourceElement.attributes.getNamedItem("isSys").value;
	this.query_id= resourceElement.attributes.getNamedItem("id").value;
	this.server= resourceElement.attributes.getNamedItem("server").value;
	this.level= resourceElement.attributes.getNamedItem("level").value;
	var paramsElements=resourceElement.childNodes;
	for(var n=0;n<paramsElements.length;n++){
		 var pElement=paramsElements[n];
		 if(pElement.nodeName=='param'){
			 this.params.push([pElement.attributes.getNamedItem("name").value,pElement.attributes.getNamedItem("value").value,pElement.attributes.getNamedItem("notnull").value]) ;
		 }
	}
	//dev.report.base.app.Report.rt.add(this);
}
_p.toXML = function() {
	var str=[];
	for(var i=0;i<dev.report.base.app.Report.rt.list.length;i++){
		var o = dev.report.base.app.Report.rt.list[i];
		if(o.params){
			str.push('\r\n  <query id="',o.query_id,'" name="',o.tableName,'" rename="',o.rename,'" isSys="',o.isSys,'" server="',o.server,'" level="',o.level,'">');
			for(var j=0;j<o.params.length;j++){
				str.push('\r\n    <param name="',o.params[j][0],'" value="',o.params[j][1],'" notnull="',o.params[j][2],'"/>');
			}
			str.push('\r\n  </query>');
		}else
			str.push('\r\n  <query id="',o.query_id,'" name="',o.tableName,'" rename="',o.rename,'" isSys="',o.isSys,'" server="',o.server,'" level="',o.level,'"/>');

	}
	return str.join('');
}

dev.report.model.XField = function() {
	this.name = "";
	this.class1 = "java.lang.String";
}
var _p = dev.report.model.XField.prototype;
_p.init = function(fldElements) {
	this.name = fldElements.attributes.getNamedItem("name").value;
	if(fldElements.attributes.getNamedItem("class")!= null){
		this.class1 = fldElements.attributes.getNamedItem("class").value;
	}
	//dev.report.base.app.Report.rt.addColumn(this);
}
_p.toXML = function(){
	var str=[];
	str.push('\r\n  <field name="',this.name,'" class="',this.class1,'"/>');
	return str.join('');
}
   
//====================================================表定义，用于设计阶段===================================================
dev.report.model.XTable = function(){
	this.expandedColumnCount=1;
	this.expandedRowCount=1;
	this.fullColumns=1;
	this.fullRows=1;
	this.defaultColumnWidth=64;
	this.defaultRowHeight=20;
	this.columns = {};
	this.rows = {};
	this.copyCutType={};
	this.copyRange={};
	this.mergeCells=[];
	this.ranges={};
	this.pictures={};
	this.copySeq=0;
};
var _p = dev.report.model.XTable.prototype;
_p.copyCut=function(type,range) {
	var res=[]; 
	var res1=[];
	res1.push(true);
	var arr=[];
	arr.push(this.copySeq);
	this.copyCutType[this.copySeq]=type;
	this.copyRange[this.copySeq]=range;
	this.copySeq++;
	res1.push(arr);
	res.push(res1);
	console.log(Ext.encode(res));
	return res;
}
_p.addPicture=function(picture){
	var _pictures=this.pictures;
	_pictures[picture.id]=picture;
	this.pictures=_pictures;
}
_p.getPicture=function(id) {
	return this.pictures[id];
}
_p.removePicture=function(id) {
  /*需要重新设计方案
	var range=this.ranges[id];
	*/
   delete this.pictures[id];
}
_p.getPictureObject=function() {
	return this.pictures;
}
_p.addRange=function(range){
	var _ranges=this.ranges;
	if(this.expandedRowCount<range.endRow) this.expandedRowCount=range.endRow;
	if(this.expandedColumnCount<range.endCol) this.expandedColumnCount=range.endCol;
	_ranges[range.id]=range;
	this.ranges=_ranges;
}
_p.getRange=function(id) {
	return this.ranges[id];
}
_p.removeRange=function(id) {
  /*需要重新设计方案
	var range=this.ranges[id];
	*/
   delete this.ranges[id];
}
_p.getRangeObject=function() {
	return this.ranges;
}
_p.paste=function(type,range) {
	var res=[];
	if(type=='ptrn'){
		var clipId=range[0];
		var x1,x2,y1,y2;

		var copyRange=this.copyRange[clipId];
		var type=this.copyCutType[clipId];

		x1=copyRange[0],y1=copyRange[1],x2=copyRange[2],y2=copyRange[3];

		var pasteWhat=range[5];

		var pasteX1,pasteX2,pasteY1,pasteY2;
		pasteX1=range[1],pasteY1=range[2],pasteX2=range[3],pasteY2=range[4];

		if(this.expandedRowCount<pasteY2) this.expandedRowCount=pasteY2;
		if(this.expandedColumnCount<pasteX2) this.expandedColumnCount=pasteX2;

		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var xOffset=pasteX1-x1;
		var yOffset=pasteY1-y1;

		if(pasteWhat==22){
			if(x1==x2&&y1==y2){
				
				var oCell=this.getCellNoCreate(x1,y1);
				if(oCell!=null){
					for(var j=pasteY1;j<pasteY2+1;j++){
						for(var i=pasteX1;i<pasteX2+1;i++){
								var arr1=[];
								var row= this.getRow(j);
								if(row==null){
									row=new dev.report.model.XRow(j);
									row.height=this.defaultRowHeight;
									this.addRow(row);
								}else{
									if(row.height==0) row.height=this.defaultRowHeight;
								}
								var cell=this.getCell(i,j);
								cell.mergeAcross=oCell.mergeAcross;
								cell.mergeDown=oCell.mergeDown;
								cell.styleID=oCell.styleID;

								if(cell.mergeAcross>0||cell.mergeDown>0){
									var mergeAcross=parseInt(cell.mergeAcross);
									var mergeDown=parseInt(cell.mergeDown);
									arr1.push(i);
									arr1.push(j);
									arr1.push(mergeAcross+1);
									var val={};
									val["m"]=[true,mergeDown,mergeAcross];
									val["t"]="s";
									val["s"]=cell.getStyle();
									arr1.push(val);
									var b=true;
									for(var k=j;k<j+mergeDown;k++){
										for(var m=i;m<i+mergeAcross+1;m++){
											if(b)
												b=false;
											else{
												if(m==i+mergeAcross){
													val={};	
													val["s"]="border-left: ;";
													arr1.push(val);
												}else{
													val={};	
													val["s"]="border-left: ;";
													val["m"]=[false,i-1,j-1];
													arr1.push(val);
												}
											}
										}
									}  
									arr.push(arr1);
								}else{
									arr1.push(i);
									arr1.push(j);
									arr1.push(0);
									var val={};
									val["s"]=cell.getStyle();
									val["t"]="s";
									arr1.push(val);
									arr.push(arr1);	
								}
						}
					}
				}
			}else{
				for(var j=y1;j<y2+1;j++){
					for(var i=x1;i<x2+1;i++){
						var arr1=[];
						var oCell=this.getCellNoCreate(i,j);
						if(oCell!=null){
							var row= this.getRow(j+yOffset);
							if(row==null){
								row=new dev.report.model.XRow(j+yOffset);
								row.height=this.defaultRowHeight;
								this.addRow(row);
							}else{
								if(row.height==0) row.height=this.defaultRowHeight;
							}
							var cell=this.getCell(i+xOffset,j+yOffset);
							cell.mergeAcross=oCell.mergeAcross;
							cell.mergeDown=oCell.mergeDown;
							cell.styleID=oCell.styleID;
							if(cell.mergeAcross>0||cell.mergeDown>0){
								var mergeAcross=parseInt(cell.mergeAcross);
								var mergeDown=parseInt(cell.mergeDown);
								arr1.push(i+xOffset);
								arr1.push(j+yOffset);
								arr1.push(mergeAcross+1);
								var val={};
								val["m"]=[true,mergeDown,mergeAcross];
								val["t"]="s";
								val["s"]=cell.getStyle();
								arr1.push(val);
								var b=true;
								for(var k=j;k<j+mergeDown;k++){
									for(var m=i;m<i+mergeAcross+1;m++){
										if(b)
											b=false;
										else{
											if(m==i+mergeAcross){
												val={};	
												val["s"]="border-left: ;";
												arr1.push(val);
											}else{
												val={};	
												val["s"]="border-left: ;";
												val["m"]=[false,i-1,j-1];
												arr1.push(val);
											}
										}
									}
								}  
								arr.push(arr1);
							}else{
								arr1.push(i+xOffset);
								arr1.push(j+yOffset);
								arr1.push(0);
								var val={};
								val["t"]="s";
								val["s"]=cell.getStyle();
								arr1.push(val);
								arr.push(arr1);	
							}
						}
					}
				}
			}
		}else{
			for(var j=y1;j<y2+1;j++){
				for(var i=x1;i<x2+1;i++){
					var arr1=[];
					var oCell=this.getCellNoCreate(i,j);
					if(oCell!=null){
						if(type=='ctrn'){
							arr1.push(i);
							arr1.push(j);
							arr1.push(0);
							var val={};
							val["v"]="";
							val["t"]="e";
							val["l"]="";
							val["s"]="";
							arr1.push(val);
							arr.push(arr1);	
							arr1=[];
						}
						var row= this.getRow(j+yOffset);
						if(row==null){
							row=new dev.report.model.XRow(j+yOffset);
							row.height=this.defaultRowHeight;
							this.addRow(row);
						}else{
							if(row.height==0) row.height=this.defaultRowHeight;
						}
						
						var cell=this.getCell(i+xOffset,j+yOffset);
						cell.mergeAcross=oCell.mergeAcross;
						cell.mergeDown=oCell.mergeDown;
						cell.styleID=oCell.styleID;
						cell.dataValue=oCell.dataValue;

						if(cell.mergeAcross>0||cell.mergeDown>0){
							var mergeAcross=parseInt(cell.mergeAcross);
							var mergeDown=parseInt(cell.mergeDown);
							arr1.push(i+xOffset);
							arr1.push(j+yOffset);
							arr1.push(mergeAcross+1);
							var val={};
							val["m"]=[true,mergeDown,mergeAcross];
							val["v"]=cell.dataValue;
							val["l"]=cell.dataValue;
							val["t"]="s";
							val["s"]=cell.getStyle();
							arr1.push(val);
							var b=true;
							for(var k=j;k<j+mergeDown;k++){
								for(var m=i;m<i+mergeAcross+1;m++){
									if(b)
										b=false;
									else{
										if(m==i+mergeAcross){
											val={};	
											val["s"]="border-left: ;";
											arr1.push(val);
										}else{
											val={};	
											val["s"]="border-left: ;";
											val["m"]=[false,i-1,j-1];
											arr1.push(val);
										}
									}
								}
							}  
							arr.push(arr1);
						}else{
							arr1.push(i+xOffset);
							arr1.push(j+yOffset);
							arr1.push(0);
							var val={};
							val["v"]=cell.dataValue;
							val["t"]="s";
							val["l"]=cell.dataValue;
							val["s"]=cell.getStyle();
							arr1.push(val);
							arr.push(arr1);	
						}
						if(type=='ctrn'){
							this.removeCell(i,j);
						}
					}
				}
			} 
		}
		obj1["1"].push(arr);
		res.push(obj1);
	}
	return res;
}

_p.clear=function(range) {
		var res=[];
		var clearWhat=range[0];
		var x1,x2,y1,y2;
		x1=range[1],y1=range[2],x2=range[3],y2=range[4];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		for(var j=y1;j<y2+1;j++){
			for(var i=x1;i<x2+1;i++){
				var arr1=[];
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null){
					arr1.push(i);
					arr1.push(j);
					arr1.push(0);
					var val={};
					if(clearWhat==22){
						cell.styleID="";
						val["s"]="";
						if(cell.dataValue==""){
							this.removeCell(i,j);
						}
					}else if(clearWhat==1){
						cell.dataValue="";
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						if(cell.styleID==""){
							this.removeCell(i,j);
						}
					}else{  
						cell.dataValue="";
						cell.styleID="";
						val["s"]="";
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						this.removeCell(i,j);
					}
					arr1.push(val);
					arr.push(arr1);	
				}
			}
		}
		obj1["1"].push(arr);
		res.push(obj1);
		return res;
}
_p.addColumn=function(column){
	var _columns=this.columns;
	//column.width=this.defaultColumnWidth;
	_columns[column.index]=column;
	this.columns=_columns;
}
_p.getColumn=function(id) {
	return this.columns[id];
}
_p.removeColumn=function(id) {
   delete this.columns[id];
}
_p.getColumnObject=function() {
	return this.columns;
}
_p.addRow=function(row){
	var _rows=this.rows;
	_rows[row.index]=row;
	row.table=this;
	this._rows=_rows;
}
_p.getRow=function(id) {
	return this.rows[id];
}
_p.getRowObject=function() {
	return this.rows;
}
_p.removeRow=function(id) {
   delete this.rows[id];
}
_p.deleteRows=function(id,rowNum) {
	var end=id+rowNum;
    
	var res=[];
	var obj1={};
	obj1["1"]=[];
	var arr=[];
	arr.push("crgn");
	arr.push({"cm":true,"p":0});
	
	var rowHeight={};

	for(var j=0;j<end;j++){
		var row=this.getRow(j);
		if(row!=null){
			for(var i=0;i<=this.expandedColumnCount;i++){
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null){
					if(cell.mergeDown>0&&j<end&&j>id){
						for(var k=i;k<i+cell.mergeAcross;k++){
							for(var m=j;m<j+cell.mergeDown;m++){
								var arr1=[];
								arr1.push(k);
								arr1.push(m);
								arr1.push(0);
								var val={}; 
								val["m"]="";
								val["v"]="";
								val["t"]="e";
								val["l"]="";
								val["s"]="";
								arr1.push(val);
								arr.push(arr1);	
							}
						}
					}else if(cell.mergeDown>0&&cell.mergeDown+j>end&&j<=id){
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["s"]=cell.getStyle();
						val["v"]=cell.dataValue;
						val["t"]="S";
						var mergeD=cell.mergeDown-rowNum;
						val["m"]=[true,mergeD,cell.mergeAcross];
						val["l"]=cell.dataValue;
						arr1.push(val);
						arr.push(arr1);
					}else if(cell.mergeDown>0&&cell.mergeDown+j<end&&cell.mergeDown+j>id){
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["s"]=cell.getStyle();
						val["v"]=cell.dataValue;
						val["t"]="S";
						var mergeD=cell.mergeDown-(cell.mergeDown+j-id);
						val["m"]=[true,mergeD,cell.mergeAcross];
						val["l"]=cell.dataValue;
						arr1.push(val);
						arr.push(arr1);
					}
					if(cell.mergeDown>0&&cell.mergeDown+j>end&&j<=id){
						for(var k=i;k<i+cell.mergeAcross;k++){
							for(var m=j+cell.mergeDown;m<j+cell.mergeDown+rowNum;m++){
								var arr1=[];
								arr1.push(k);
								arr1.push(m-rowNum);
								arr1.push(0);
								var val={}; 
								val["m"]="";
								val["v"]="";
								val["t"]="e";
								val["l"]="";
								val["s"]="";
								arr1.push(val);
								arr.push(arr1);	
							}
						}
						var mergeD=cell.mergeDown-rowNum;
						cell.mergeDown=mergeD;
					}else if(cell.mergeDown>0&&cell.mergeDown+j<end&&cell.mergeDown+j>id){
						for(var k=i;k<i+cell.mergeAcross;k++){
							for(var m=j+cell.mergeDown;m<j+cell.mergeDown+(cell.mergeDown+j-id);m++){
								var arr1=[];
								arr1.push(k);
								arr1.push(m-(cell.mergeDown+j-id));
								arr1.push(0);
								var val={}; 
								val["m"]="";
								val["v"]="";
								val["t"]="e";
								val["l"]="";
								val["s"]="";
								arr1.push(val);
								arr.push(arr1);	
							}
						}
						var mergeD=id-j;
						cell.mergeDown=mergeD;
					}
				}
			}
			if(j>=id&&row.height!=this.defaultRowHeight){
				rowHeight[j]=-1;
			}
			if(j>=id){
				this.removeRow(j);
			}
		}
	}
	if(end<=this.expandedRowCount){
		for(var j=end;j<=this.expandedRowCount;j++){
			var row=this.getRow(j);
			if(row!=null){
				for(var i=0;i<=this.expandedColumnCount;i++){
					var cell=this.getCellNoCreate(i,j);
					if(cell!=null){
						var arr1=[];
						arr1.push(i);
						arr1.push(j-rowNum);
						arr1.push(0);
						var val={}; 
						val["s"]=cell.getStyle();
						val["v"]=cell.dataValue;
						val["t"]="S";
						if(cell.mergeDown>0){
							val["m"]=[true,cell.mergeDown,cell.mergeAcross];
						}
						val["l"]=cell.dataValue;
						arr1.push(val);
						arr.push(arr1);
						var noFirst=true;
						if(cell.mergeDown>0){
							for(var k=i;k<i+cell.mergeAcross;k++){
								for(var m=j;m<j+cell.mergeDown;m++){
									if(noFirst){
										noFirst=false;
									}else{
										var arr1=[];
										arr1.push(k);
										arr1.push(m-rowNum);
										arr1.push(0);
										var val={}; 
										val["s"]=cell.getStyle();
										val["v"]=cell.dataValue;
										val["t"]="S";
										val["m"]=[false];
										val["l"]=cell.dataValue;
										arr1.push(val);
										arr.push(arr1);
									}
									var arr1=[];
									arr1.push(k);
									arr1.push(m+cell.mergeDown-rowNum);
									arr1.push(0);
									var val={}; 
									val["m"]="";
									val["v"]="";
									val["t"]="e";
									val["l"]="";
									val["s"]="";
									arr1.push(val);
									arr.push(arr1);	
								}
							}
						}else{
							var arr1=[];
							arr1.push(i);
							arr1.push(j);
							arr1.push(0);
							var val={}; 
							val["m"]="";
							val["v"]="";
							val["t"]="e";
							val["l"]="";
							val["s"]="";
							arr1.push(val);
							arr.push(arr1);	
						}
					}
				}
				if(row.height!=this.defaultRowHeight){
					rowHeight[j-rowNum]=row.height;
					rowHeight[j]=-1;
				}
				this.removeRow(j);
				row.index=row.index-rowNum;
				this.addRow(row);
			}
		}
	}

	this.expandedRowCount=this.expandedRowCount-rowNum;
	
	if(arr.length>2)
		obj1["1"].push(arr);

	if(!isEmty(rowHeight)){
		var arr2=[];
		arr2.push("ccr");
		arr2.push(1);
		for(var i in rowHeight){
			var arr3=[];
			arr3.push(parseInt(i));
			arr3.push(parseInt(i));
			arr3.push(rowHeight[i]);
			arr2.push(arr3);
		}
		obj1["1"].push(arr2);
	}
	var arr3=[];
	arr3.push("curn");
	arr3.push(this.expandedRowCount);
	arr3.push(this.expandedColumnCount);
	arr3.push(false);
	arr3.push(false);
	obj1["1"].push(arr3);
	res.push(obj1);
	console.log(Ext.encode(res));
	return res;
}
_p.insertRows=function(id,rowNum) {
	var end=id+rowNum;
	var res=[];
	var obj1={};
	obj1["1"]=[];
	var arr=[];
	arr.push("crgn");
	arr.push({"cm":true,"p":0});
	var rowHeight={};
	if(id<this.expandedRowCount){
		for(var j=this.expandedRowCount;j>0;j--){
			 for(var i=0;i<=this.expandedColumnCount;i++){
				 var selectCell;
					selectCell=this.getCellNoCreate(i,j);
					var cell=this.getCellNoCreate(i,j+rowNum);
					if(selectCell!=null&&cell!=null){
						if(selectCell.mergeDown>0&&id<j+selectCell.mergeDown&&id>j){
								selectCell.mergeDown=selectCell.mergeDown+rowNum;
								cell.noChange=false;
						}else{   
							if(selectCell.mergeDown>0){
								cell.mergeDown=selectCell.mergeDown;
								cell.mergeAcross=selectCell.mergeAcross;
							}
							cell.dataValue=selectCell.dataValue;
							cell.styleID=selectCell.styleID;
							if(selectCell.row.height!=this.defaultRowHeight){
								row.height=selectCell.row.height;
								rowHeight[j+rowNum]=selectCell.row.height;
								selectCell.row.height=this.defaultRowHeight;
								rowHeight[j]=this.defaultRowHeight;
							}
							cell.noChange=true;
						}
					}else if(selectCell!=null&&cell==null){
						if(selectCell.mergeDown>0&&id<j+selectCell.mergeDown&&id>j){
								selectCell.mergeDown=selectCell.mergeDown+rowNum;
								selectCell.noChange=false;
						}else{   
							var row=this.getRow(j+rowNum);
							if(row==null){
								row=new dev.report.model.XRow(j+rowNum);
								this.addRow(row);
							}
							var cell=new dev.report.model.XCell(i);
							if(selectCell.mergeDown>0){
								cell.mergeDown=selectCell.mergeDown;
								cell.mergeAcross=selectCell.mergeAcross;
							}
							cell.dataValue=selectCell.dataValue;
							cell.styleID=selectCell.styleID;
							if(selectCell.row.height!=this.defaultRowHeight){
								row.height=selectCell.row.height;
								rowHeight[j+rowNum]=selectCell.row.height;
								selectCell.row.height=this.defaultRowHeight;
								rowHeight[j]=this.defaultRowHeight;
							}
							cell.noChange=true;
							row.addCell(cell);
						}
					}else if(selectCell==null&&cell!=null){
						console.log(cell.noChange);
						if(cell.noChange){
							this.removeCell(i,j+rowNum);
						}
					}
				 //}
			}
		}
		this.expandedRowCount=this.expandedRowCount+rowNum;
		for(var j=0;j<this.expandedRowCount+rowNum;j++){
			for(var i=0;i<=this.expandedColumnCount;i++){
					var cell=this.getCellNoCreate(i,j);
					var styleString='';
					if(cell!=null){
						styleString=cell.getStyle();
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["v"]=cell.dataValue;
						val["t"]="s";
						val["l"]=cell.dataValue;
						if(cell.mergeDown>0){    
							val["m"]=[true,cell.mergeDown,cell.mergeAcross];
						}
						val["s"]=styleString;
						arr1.push(val);
						arr.push(arr1);	
						var noFirst=true;
						if(cell.mergeDown>0){    
							for(var k=i;k<i+cell.mergeAcross;k++){
								for(var m=j;m<j+cell.mergeDown;m++){
									if(noFirst){
										noFirst=false;
									}else{
										var arr1=[];
										arr1.push(k);
										arr1.push(m);
										arr1.push(0);
										var val={}; 
										val["s"]=cell.getStyle();
										val["v"]=cell.dataValue;
										val["t"]="S";
										val["m"]=[false];
										val["l"]=cell.dataValue;
										arr1.push(val);
										arr.push(arr1);
									}
								}
							}
							i=i+cell.mergeAcross;
							j=j+cell.mergeDown;
						}
					}else{
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["m"]="";
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						val["s"]="";
						arr1.push(val);
						arr.push(arr1);	
					}
				}
		}
	}
	if(arr.length>2)
		obj1["1"].push(arr);

	if(!isEmty(rowHeight)){
		var arr2=[];
		arr2.push("ccr");
		arr2.push(1);
		for(var i in rowHeight){
			var arr3=[];
			arr3.push(parseInt(i));
			arr3.push(parseInt(i));
			arr3.push(rowHeight[i]);
			arr2.push(arr3);
		}
		obj1["1"].push(arr2);
	}
	var arr3=[];
	arr3.push("curn");
	arr3.push(this.expandedRowCount);
	arr3.push(this.expandedColumnCount);
	arr3.push(false);
	arr3.push(false);
	obj1["1"].push(arr3);
	res.push(obj1);
	return res;
}
_p.deleteColumns=function(id,colNum) {
	var end=id+colNum;
	var res=[];
	var obj1={};
	obj1["1"]=[];
	var arr=[];
	arr.push("crgn");
	arr.push({"cm":true,"p":0});
	
	var colWidth={};
	for(var i=0;i<end;i++){
		var col=this.getColumn(i);
		for(var j=0;j<=this.expandedRowCount;j++){
			var cell=this.getCellNoCreate(i,j);
			if(cell!=null){
				if(cell.mergeAcross>0&&i<end&&i>id){
					for(var k=i;k<i+cell.mergeAcross;k++){
						for(var m=j;m<j+cell.mergeDown;m++){
							var arr1=[];
							arr1.push(k);
							arr1.push(m);
							arr1.push(0);
							var val={}; 
							val["m"]="";
							val["v"]="";
							val["t"]="e";
							val["l"]="";
							val["s"]="";
							arr1.push(val);
							arr.push(arr1);	
						}
					}
				}else if(cell.mergeAcross>0&&cell.mergeAcross+i>end&&i<=id){
					console.log("1");
					var arr1=[];
					arr1.push(i);
					arr1.push(j);
					arr1.push(0);
					var val={}; 
					val["s"]=cell.getStyle();
					val["v"]=cell.dataValue;
					val["t"]="S";
					var mergeD=cell.mergeAcross-colNum;
					val["m"]=[true,cell.mergeDown,mergeD];
					val["l"]=cell.dataValue;
					arr1.push(val);
					arr.push(arr1);
				}else if(cell.mergeAcross>0&&cell.mergeAcross+i<end&&cell.mergeAcross+i>id){
					console.log("2");
					var arr1=[];
					arr1.push(i);
					arr1.push(j);
					arr1.push(0);
					var val={}; 
					val["s"]=cell.getStyle();
					val["v"]=cell.dataValue;
					val["t"]="S";
					var mergeD=cell.mergeAcross-(cell.mergeAcross+i-id);
					val["m"]=[true,cell.mergeDown,mergeD];
					val["l"]=cell.dataValue;
					arr1.push(val);
					arr.push(arr1);
				}
				if(cell.mergeAcross>0&&cell.mergeAcross+i>end&&i<=id){
					for(var k=i+cell.mergeAcross;k<i+cell.mergeAcross+colNum;k++){
						for(var m=j;m<j+cell.mergeDown;m++){
							var arr1=[];
							arr1.push(k-colNum);
							arr1.push(m);
							arr1.push(0);
							var val={}; 
							val["m"]="";
							val["v"]="";
							val["t"]="e";
							val["l"]="";
							val["s"]="";
							arr1.push(val);
							arr.push(arr1);	
						}
					}
					var mergeD=cell.mergeAcross-colNum;
					cell.mergeAcross=mergeD;
				}else if(cell.mergeAcross>0&&cell.mergeAcross+i<end&&cell.mergeAcross+i>id){
					for(var k=i+cell.mergeAcross;k<i+cell.mergeAcross+(cell.mergeAcross+i-id);k++){
						for(var m=j;m<j+cell.mergeDown;m++){
							var arr1=[];
							arr1.push(k-(cell.mergeAcross+i-id));
							arr1.push(m);
							arr1.push(0);
							var val={}; 
							val["m"]="";
							val["v"]="";
							val["t"]="e";
							val["l"]="";
							val["s"]="";
							arr1.push(val);
							arr.push(arr1);	
						}
					}
					var mergeD=id-i;
					cell.mergeAcross=mergeD;
				}
			}
		}
		if(col!=null){
			if(col.width!=this.defaultColumnWidth){
				colWidth[i]=-1;
				this.removeColumn(i);
			}
		}
	}
	if(end<=this.expandedColumnCount){
		for(var i=end;i<=this.expandedColumnCount;i++){
			for(var j=0;j<=this.expandedRowCount;j++){		
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null){
					var arr1=[];
					arr1.push(i-colNum);
					arr1.push(j);
					arr1.push(0);
					var val={}; 
					val["s"]=cell.getStyle();
					val["v"]=cell.dataValue;
					val["t"]="S";
					if(cell.mergeAcross>0){
						val["m"]=[true,cell.mergeDown,cell.mergeAcross];
					}
					val["l"]=cell.dataValue;
					arr1.push(val);
					arr.push(arr1);
					var noFirst=true;
					if(cell.mergeAcross>0){
						for(var k=i;k<i+cell.mergeAcross;k++){
							for(var m=j;m<j+cell.mergeDown;m++){
								if(noFirst){
									noFirst=false;
								}else{
									var arr1=[];
									arr1.push(k-colNum);
									arr1.push(m);
									arr1.push(0);
									var val={}; 
									val["s"]=cell.getStyle();
									val["v"]=cell.dataValue;
									val["t"]="S";
									val["m"]=[false];
									val["l"]=cell.dataValue;
									arr1.push(val);
									arr.push(arr1);
								}
								var arr1=[];
								arr1.push(k+cell.mergeAcross-colNum);
								arr1.push(m);
								arr1.push(0);
								var val={}; 
								val["m"]="";
								val["v"]="";
								val["t"]="e";
								val["l"]="";
								val["s"]="";
								arr1.push(val);
								arr.push(arr1);	
							}
						}
					}else{
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["m"]="";
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						val["s"]="";
						arr1.push(val);
						arr.push(arr1);	
					}
					var row=this.getRow(j);
					row.removeCell(i);
					cell.index=cell.index-colNum;
					row.addCell(cell);
				}
			}
			var col=this.getColumn(i);
			if(col!=null){
				if(col.height!=this.defaultColumnWidth){
					colWidth[i-colNum]=col.width;
					colWidth[i]=-1;
				}
				this.removeColumn(i);
				col.index=col.index-colNum;
				this.addColumn(col);
			}
		}
	}

	this.expandedColumnCount=this.expandedColumnCount-colNum;
	
	if(arr.length>2)
		obj1["1"].push(arr);

	if(!isEmty(colWidth)){
		var arr2=[];
		arr2.push("ccr");
		arr2.push(0);
		for(var i in colWidth){
			var arr3=[];
			arr3.push(parseInt(i));
			arr3.push(parseInt(i));
			arr3.push(colWidth[i]);
			arr2.push(arr3);
		}
		obj1["1"].push(arr2);
	}
	var arr3=[];
	arr3.push("curn");
	arr3.push(this.expandedRowCount);
	arr3.push(this.expandedColumnCount);
	arr3.push(false);
	arr3.push(false);
	obj1["1"].push(arr3);
	res.push(obj1);
		console.log(Ext.encode(res));
	return res;
}
_p.insertColumns=function(id,colNum) {
	var end=id+colNum;
	var res=[];
	var obj1={};
	obj1["1"]=[];
	var arr=[];
	arr.push("crgn");
	arr.push({"cm":true,"p":0});
	var colWidth={};

	if(id<this.expandedColumnCount){
		for(var i=this.expandedColumnCount;i>0;i--){
			for(var j=0;j<=this.expandedRowCount;j++){
				    var selectCell=this.getCellNoCreate(i,j);
					var cell=this.getCellNoCreate(i+colNum,j);
					if(selectCell!=null&&cell!=null){
						if(selectCell.mergeAcross>0&&id<i+selectCell.mergeAcross&&id>i){
								selectCell.mergeAcross=selectCell.mergeAcross+colNum;
								cell.noChange=false;
						}else{   
							if(selectCell.mergeAcross>0){
								cell.mergeDown=selectCell.mergeDown;
								cell.mergeAcross=selectCell.mergeAcross;
							}
							cell.dataValue=selectCell.dataValue;
							cell.styleID=selectCell.styleID;
							var col=this.getColumn(i+colNum);
							if(col==null){
								col=new dev.report.model.XColumn(i+colNum);
								this.addColumn(col);
							}
							var selectCol=this.getColumn(i);
							if(selectCol==null){
								selectCol=new dev.report.model.XColumn(i);
								this.addColumn(selectCol);
							}
							if(selectCol.width!=this.defaultColumnWidth){
								colWidth[i+colNum]=selectCol.width;
								colWidth[i]=this.defaultColumnWidth;
								col.width=selectCol.width;
								selectCol.width=this.defaultColumnWidth;
							}
							cell.noChange=true;
						}
					}else if(selectCell!=null&&cell==null){
						if(selectCell.mergeAcross>0&&id<i+selectCell.mergeAcross&&id>i){
								selectCell.mergeAcross=selectCell.mergeAcross+colNum;
								selectCell.noChange=false;
						}else{   
							var col=this.getColumn(i+colNum);
							if(col==null){
								col=new dev.report.model.XColumn(i+colNum);
								this.addColumn(col);
							}
							var cell=new dev.report.model.XCell(i+colNum);
							if(selectCell.mergeAcross>0){
								cell.mergeDown=selectCell.mergeDown;
								cell.mergeAcross=selectCell.mergeAcross;
							}
							cell.dataValue=selectCell.dataValue;
							cell.styleID=selectCell.styleID;

							var selectCol=this.getColumn(i);
							if(selectCol==null){
								selectCol=new dev.report.model.XColumn(i);
								this.addColumn(selectCol);
							}
							
							if(selectCol.width!=this.defaultColumnWidth){
								colWidth[i+colNum]=selectCol.width;
								colWidth[i]=this.defaultColumnWidth;
								col.width=selectCol.width;
								selectCol.width=this.defaultColumnWidth;
							}
							cell.noChange=true;
							var row=this.getRow(j);
							row.addCell(cell);
						}
					}else if(selectCell==null&&cell!=null){
						if(cell.noChange){
							this.removeCell(i+colNum,j);
						}
					}
			}
		}
		this.expandedColumnCount=this.expandedColumnCount+colNum;
		for(var i=0;i<=this.expandedColumnCount;i++){
			for(var j=0;j<=this.expandedRowCount;j++){
					var cell=this.getCellNoCreate(i,j);
					var styleString='';
					if(cell!=null){
						styleString=cell.getStyle();
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["v"]=cell.dataValue;
						val["t"]="s";
						val["l"]=cell.dataValue;
						if(cell.mergeAcross>0){    
							val["m"]=[true,cell.mergeDown,cell.mergeAcross];
						}
						val["s"]=styleString;
						arr1.push(val);
						arr.push(arr1);	
						var noFirst=true;
						if(cell.mergeAcross>0){    
							for(var k=i;k<i+cell.mergeAcross;k++){
								for(var m=j;m<j+cell.mergeDown;m++){
									if(noFirst){
										noFirst=false;
									}else{
										var arr1=[];
										arr1.push(k);
										arr1.push(m);
										arr1.push(0);
										var val={}; 
										val["s"]=cell.getStyle();
										val["v"]=cell.dataValue;
										val["t"]="S";
										val["m"]=[false];
										val["l"]=cell.dataValue;
										arr1.push(val);
										arr.push(arr1);
									}
								}
							}
							i=i+cell.mergeAcross;
							j=j+cell.mergeDown;
						}
					}else{
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["m"]="";
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						val["s"]="";
						arr1.push(val);
						arr.push(arr1);	
					}
				}
		}
	}
	if(arr.length>2)
		obj1["1"].push(arr);

	if(!isEmty(colWidth)){
		var arr2=[];
		arr2.push("ccr");
		arr2.push(0);
		for(var i in colWidth){
			var arr3=[];
			arr3.push(parseInt(i));
			arr3.push(parseInt(i));
			arr3.push(colWidth[i]);
			arr2.push(arr3);
		}
		obj1["1"].push(arr2);
	}
	var arr3=[];
	arr3.push("curn");
	arr3.push(this.expandedRowCount);
	arr3.push(this.expandedColumnCount);
	arr3.push(false);
	arr3.push(false);
	obj1["1"].push(arr3);
	res.push(obj1);
	console.log(Ext.encode(res));
	return res;
}

_p.insertCells=function(range) {
	var x1,x2,y1,y2;
	x1=range[0][0],y1=range[0][1],x2=range[0][2],y2=range[0][3];
	var mode=range[0][4];

	var res=[];
	var obj1={};
	obj1["1"]=[];
	var arr=[];
	arr.push("crgn");
	arr.push({"cm":true,"p":0});
	var xOffset=x2-x1+1;
	var yOffset=y2-y1+1;

	if(mode==2){
		var colWidth={};
		if(x2<this.expandedColumnCount){
			for(var i=this.expandedColumnCount;i>=x2;i--){
				for(var j=y1;j<=y2;j++){
					var selectCell=this.getCellNoCreate(x2,y2);
					var styleString='';
					if(selectCell!=null){
						styleString=selectCell.getStyle();
					}
					var cell=this.getCellNoCreate(i,j);
					if(cell!=null){
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						val["s"]=styleString;
						arr1.push(val);
						arr.push(arr1);	
						var row=this.getRow(j);
						if(row!=null){
							row.removeCell(i);
						}
						var arr1=[];
						arr1.push(i+xOffset);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["s"]=cell.getStyle();
						val["v"]=cell.dataValue;
						val["t"]="s";
						val["l"]=cell.dataValue;
						arr1.push(val);
						arr.push(arr1);	
						var newCell=this.getCell(i+xOffset,j);
						newCell.dataValue=cell.dataValue;
						newCell.styleID=cell.styleID;
					}
				}
			}
		}
		this.expandedColumnCount=this.expandedColumnCount+xOffset;

		if(arr.length>2)
			obj1["1"].push(arr);

		res.push(obj1);
	}else{
		var rowHeight={};
		if(y2<this.expandedRowCount){
			for(var j=this.expandedRowCount;j>=y2;j--){
				var row=this.getRow(j);
				if(row!=null){
					for(var i=x1;i<=x2;i++){
						var selectCell=this.getCellNoCreate(x2,y2);
						var styleString='';
						if(selectCell!=null){
							styleString=selectCell.getStyle();
						}
						var cell=this.getCellNoCreate(i,j);
						if(cell!=null){
							var arr1=[];
							arr1.push(i);
							arr1.push(j);
							arr1.push(0);
							var val={}; 
							val["v"]="";
							val["t"]="e";
							val["l"]="";
							val["s"]=styleString;
							arr1.push(val);
							arr.push(arr1);	

							var arr1=[];
							arr1.push(i);
							arr1.push(j+yOffset);
							arr1.push(0);
							var val={}; 
							val["s"]=cell.getStyle();
							val["v"]=cell.dataValue;
							val["t"]="S";
							val["l"]=cell.dataValue;
							arr1.push(val);
							arr.push(arr1);	

							var newCell=this.getCell(i,j+yOffset);
							newCell.dataValue=cell.dataValue;
							newCell.styleID=cell.styleID;

						}
					}
				}
			}
		}
		this.expandedRowCount=this.expandedRowCount+yOffset;

		if(arr.length>2)
			obj1["1"].push(arr);

		res.push(obj1);
	}
	return res;
}
_p.deleteCells=function(range) {
	var x1,x2,y1,y2;
	x1=range[0][0],y1=range[0][1],x2=range[0][2],y2=range[0][3];
	var mode=range[0][4];

	var res=[];
	var obj1={};
	obj1["1"]=[];
	var arr=[];
	arr.push("crgn");
	arr.push({"cm":true,"p":0});
	var xOffset=x2-x1+1;
	var yOffset=y2-y1+1;
	if(mode==2){
		var colWidth={};
		for(var i=x1;i<x2;i++){
			for(var j=y1;j<=y2;j++){
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null){
					var arr1=[];
					arr1.push(i);
					arr1.push(j);
					arr1.push(0);
					var val={}; 
					val["v"]="";
					val["t"]="e";
					val["l"]="";
					val["s"]="";
					arr1.push(val);
					arr.push(arr1);	
				}
				var row=this.getRow(j);
				if(row!=null){
					row.removeCell(i);
				}
			}
		}
		if(x2<=this.expandedColumnCount){
			for(var i=x2;i<=this.expandedColumnCount;i++){
				for(var j=y1;j<=y2;j++){		
					var cell=this.getCellNoCreate(i,j);
					if(cell!=null){
						var arr1=[];
						arr1.push(i-xOffset);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["s"]=cell.getStyle();
						val["v"]=cell.dataValue;
						val["t"]="S";
						val["l"]=cell.dataValue;
						arr1.push(val);
						arr.push(arr1);	
							
						var newCell=this.getCell(i-xOffset,j);
						newCell.dataValue=cell.dataValue;
						newCell.styleID=cell.styleID;

						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						val["s"]="";
						arr1.push(val);
						arr.push(arr1);	
						
						var row=this.getRow(j);
						if(row!=null){
							row.removeCell(i);
						}
					}
				}
			}
		}
		if(arr.length>2)
			obj1["1"].push(arr);
		res.push(obj1);
	}else{
		var rowHeight={};
		for(var j=y1;j<y2;j++){
			var row=this.getRow(j);
			if(row!=null){
				for(var i=x1;i<=x2;i++){
					var cell=this.getCellNoCreate(i,j);
					if(cell!=null){
						var arr1=[];
						arr1.push(i);
						arr1.push(j);
						arr1.push(0);
						var val={}; 
						val["v"]="";
						val["t"]="e";
						val["l"]="";
						val["s"]="";
						arr1.push(val);
						arr.push(arr1);	
					}
				}
				row.removeCell(i);
			}
		}
		if(y2<=this.expandedRowCount){
			for(var j=y2;j<=this.expandedRowCount;j++){
				var row=this.getRow(j);
				if(row!=null){
					for(var i=x1;i<=x2;i++){
						var cell=this.getCellNoCreate(i,j);
						if(cell!=null){
							var arr1=[];
							arr1.push(i);
							arr1.push(j-yOffset);
							arr1.push(0);
							var val={}; 
							val["s"]=cell.getStyle();
							val["v"]=cell.dataValue;
							val["t"]="S";
							val["l"]=cell.dataValue;
							arr1.push(val);
							arr.push(arr1);	
							var newCell=this.getCell(i,j-yOffset);
							newCell.dataValue=cell.dataValue;
							newCell.styleID=cell.styleID;

							var arr1=[];
							arr1.push(i);
							arr1.push(j);
							arr1.push(0);
							var val={}; 
							val["v"]="";
							val["t"]="e";
							val["l"]="";
							val["s"]="";
							arr1.push(val);
							arr.push(arr1);	
							row.removeCell(i);
						}
					}
				}
			}
		}
		if(arr.length>2)
			obj1["1"].push(arr);
		res.push(obj1);
	}
	return res;
}
_p.autoFit = function(type,range){
	var x1,x2,y1,y2;

	var res=[];
	var obj1={};
	obj1["1"]=[];
	var arr=[];
	if(type==0){
		x1=range[0][0];
		x2=range[0][1];
		var colWidth={};

		for(var i=x1;i<=x2;i++){
			var w=0;
			for(var j=0;j<=this.expandedRowCount;j++){
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null&&cell.styleID!=''){
					var tempStyle=dev.report.model.report.getStyle(cell.styleID);
					var fontSize=tempStyle.fontSize;
					fontSize=fontSize.replace("pt","");
					var fontPixel=parseInt(fontSize)/0.75;
					var dataWidth=fontPixel*cell.dataValue.length;
					if(dataWidth>w) w=dataWidth;
				}
			}
			if(w!=0){
				var col=this.getColumn(i);
				if(col!=null){
					col.width=w;
				}else{
					col=new dev.report.model.XColumn(i);
					col.width=w;
					this.addColumn(col);
				}
				colWidth[i]=w+10;
			}
		}
		if(!isEmty(colWidth)){
			var arr2=[];
			arr2.push("ccr");
			arr2.push(0);
			for(var i in colWidth){
				var arr3=[];
				arr3.push(parseInt(i));
				arr3.push(parseInt(i));
				arr3.push(colWidth[i]);
				arr2.push(arr3);
			}
			obj1["1"].push(arr2);
		}
		res.push(obj1);
	}else{
		y1=range[0][0];
		y2=range[0][1];
		var rowHeight={};
		for(var j=y1;j<=y2;j++){
			var row=this.getRow(j);
			var h=0;
			if(row!=null){
				for(var i=0;i<=this.expandedColumnCount;i++){
					var cell=this.getCellNoCreate(i,j);
					if(cell!=null&&cell.styleID!=''){
						var tempStyle=dev.report.model.report.getStyle(cell.styleID);
						var fontSize=tempStyle.fontSize;
						fontSize=fontSize.replace("pt","");
						var fontPixel=parseInt(fontSize)/0.75+8;
						if(fontPixel>h) h=fontPixel;
					}
				}
				if(h!=0){
					row.height=h;
					rowHeight[j]=h;
				}
			}
		}
		if(!isEmty(rowHeight)){
			var arr2=[];
			arr2.push("ccr");
			arr2.push(1);
			for(var i in rowHeight){
				var arr3=[];
				arr3.push(parseInt(i));
				arr3.push(parseInt(i));
				arr3.push(rowHeight[i]);
				arr2.push(arr3);
			}
			obj1["1"].push(arr2);
		}
		res.push(obj1);
	}
	return res;
}
_p.getCell = function(x,y){
	var merged=false;
	for(var i=0;i<this.mergeCells.length;i++){
		var temp=this.mergeCells[i];
		if(x==temp[0]&&y==temp[1]){
			merged=true;
			break;
		}
	}
	if(merged){
		return null;
	}else{
		var row=this.getRow(y);
		if(row==null){
			row=new dev.report.model.XRow(y);
			row.height=this.defaultRowHeight;
			this.addRow(row);
		}
		var cell=row.getCell(x);
		if(cell==null){
			cell=new dev.report.model.XCell(x);
			row.addCell(cell);
		}
		return cell;
	}
}
_p.getCreateRow = function(y){
	var row=this.getRow(y);
	if(row==null){
		row=new dev.report.model.XRow(y);
		this.addRow(row);
	}
	return row;
}
_p.getCellNoCreate = function(x,y){
	var row=this.getRow(y);
	if(row==null){
		return null;
	}else{
		var cell=row.getCell(x);
		if(cell==null){
			return null;
		}else{
			return cell;
		}
	}
}  
_p.getCellStyles = function(styleString){
	var num=0;
	for(var i=1;i<=this.expandedRowCount;i++){
		for(var j=1;j<=this.expandedRowCount;j++){
			var row=this.getRow(i);
			if(row!=null){
				var cell=row.getCell(j);
				if(cell!=null){
					if(cell.styleID==styleString){
						num++;
					}
				}
			}
		}   
	}
	return num;
}
_p.removeCell = function(x,y){
	var row=this.getRow(y);
	if(row!=null){
		var cell=row.getCell(x);
		if(cell!=null){
			row.removeCell(x);
		}
		if(isEmty(row.cells)){
			if(row.height==this.defaultRowHeight){
				this.removeRow(row.index);
			}
		}
	}
}
_p.getCells = function(){
	var cells=[];
	for(var i=0;i<this.expandedRowCount;i++){
		for(var j=0;j<this.expandedRowCount;j++){
			var row=this.getRow(i);
			if(row!=null){
				var cell=row.getCell(j);
				if(cell!=null){
					cells.push(cell);
				}
			}
		}
	}
	return cells;
}
_p.resize = function(type,range,size){
	if(type==1){
		for(var i=range[0];i<range[1]+1;i++){
			var tempRow=this.getRow(i);
			if(tempRow==null){
				tempRow=new dev.report.model.XRow(i);
			}
			tempRow.height=size;
			this.addRow(tempRow);
		}   
		if(this.expandedRowCount<range[1]) this.expandedRowCount=range[1];
	}else{
		for(var i=range[0];i<range[1]+1;i++){
			var tempCol=this.getColumn(i);
			if(tempCol==null){
				tempCol=new dev.report.model.XColumn(i);
			}
			tempCol.width=size;
			this.addColumn(tempCol);
		}
		if(this.expandedColumnCount<range[1]) this.expandedColumnCount=range[1];
	}
}
_p.cellCoalition= function(range){
		var x1,x2,y1,y2;
		x1=range[0],y1=range[1],x2=range[2],y2=range[3];
		var res=[];
		if(x1 == x2 && y1 == y2)
			return res;

		var p = [x1,y1,x2,y2];
		var colspan = x2-x1+1;
		var rowspan = y2-y1+1;

		var first = this.getCell(x1,y1);
		first.mergeAcross=colspan;
		first.mergeDown=rowspan;

		var row= this.getRow(y1);
		if(row.height==0) row.height=this.defaultRowHeight;

		if(this.expandedRowCount<x2) this.expandedRowCount=x2;
		if(this.expandedColumnCount<y2) this.expandedColumnCount=y2;

		var b=true;

		for(var i=y1;i<y2+1;i++){
			for(var j=x1;j<x2+1;j++){
				if(b)
					b=false;
				else{
					var c=[j,i];
					this.mergeCells.push(c);
					this.removeCell(j,i);
				}
			}
		}
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];
		arr1.push(x1,y1,colspan);
		arr1.push({"m":[true,rowspan,colspan]});
		b=true;
		for(var i=y1;i<y2+1;i++){
			for(var j=x1;j<x2+1;j++){
				if(b)
					b=false;
				else{
					arr1.push({"s":"border-left: ;","m":[false,y1-1,x1-1]});
				}
			}
		}
		arr.push(arr1);
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]);
		return res;
}
_p.cellSolve = function(range){
		var x1,y1,x2,y2;
		var n1,m1,n2,m2;

		x1=range[0],y1=range[1],x2=range[2],y2=range[3];
		
		var res=[];
		if(x1 == x2 && y1 == y2)
			return res;

		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];
		for(var i=y1;i<y2+1;i++){
			for(var j=x1;j<x2+1;j++){
				var cell=this.getCellNoCreate(j,i);
				var styleId;
				if(cell!=null){
					styleId=cell.styleID;
					var  styleString=cell.getStyle();;
					if(cell.mergeAcross>0&&cell.mergeDown>0){
						arr1=[];
						arr1.push(j,i,cell.mergeAcross);
						for(var k=0;k<cell.mergeAcross;k++){	
							for(var m=0;m<cell.mergeDown;m++){
								var obj={};
								obj["m"]="";
								obj["s"]=styleString;
								arr1.push(obj);
							}

						}
						arr.push(arr1);
					}
				}else{
					var c=[j,i];
					var n=0;
					for(m=0;m<this.mergeCells.length;m++){
						if(this.mergeCells[m]==c){
							n=m;
						}
					}
					this.mergeCells=this.mergeCells.slice(0,n).concat(this.mergeCells.slice(n+1,this.mergeCells.length));
					var cell=this.getCell(j,i);
					cell.styleID=styleId;
				}
			}
		}
	
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]);
		for(var i=y1;i<y2+1;i++){
			for(var j=x1;j<x2+1;j++){
				var cell=this.getCellNoCreate(j,i);
				if(cell!=null){
					if(cell.mergeAcross>0)
						cell.mergeAcross=0;
					if(cell.mergeDown>0)
						cell.mergeDown=0;
				}
			}
		}  
		return res;
	}
	_p.cellSpan = function(isUnMerge,range){
		if(!isUnMerge){
			return this.cellCoalition(range);
		}else{
			return this.cellSolve(range);
		}
	}
	_p.setBorder = function(type,range,style){
		if(this.expandedRowCount<range[3]) this.expandedRowCount=range[3];
		if(this.expandedColumnCount<range[2]) this.expandedColumnCount=range[2];
		if(type==dev.report.base.style.borderType.TOP){
			return this.drawBorderTop(range,style);
		}
		if(type==dev.report.base.style.borderType.BOTTOM){
			return this.drawBorderBottom(range,style);
		}
		if(type==dev.report.base.style.borderType.LEFT){
			return this.drawBorderLeft(range,style);
		}
		if(type==dev.report.base.style.borderType.RIGHT){
			return this.drawBorderRight(range,style);
		}
		if(type==dev.report.base.style.borderType.ALL){
			return this.drawEveryBorder(range,style);
		}
		if(type==dev.report.base.style.borderType.OUT){
			return this.drawBorder(range,style);
		}
		if(type==dev.report.base.style.borderType.INS_HORIZ){
			//return this.drawBorder(range,style);
			return this.drawHorizontalBorder(range,style);
		}
		if(type==dev.report.base.style.borderType.INS_VERT){
			//return this.drawBorder(range,style);
			return this.drawVerticalBorder(range,style);
		}
		/* : 0,
		INS_HORIZ : 16,
		INS_VERT : 32,
		INS : 16 | 32
		*/
	}
	_p.getBorder = function(range){

		var x1,y1,x2,y2;
		x1=range[0][0],y1=range[0][1],x2=range[0][2],y2=range[0][3];

		var res=[];
		var arr=[];
		arr.push(true);
		var arr1=[];
		
		for(var i=y1;i<y2+1;i++){
			for(var j=x1;j<x2+1;j++){
				var cell=this.getCellNoCreate(j,i);
				if(cell!=null&&cell.styleID!=''){
					var style=dev.report.model.report.getStyle(cell.styleID);
					var styleStr='""';
					var box=style.box;
					if(box!=null){
						var tpen=box.topPen;
						var tpenStr='""';
						console.log(tpen);
						if(tpen!=null){
							tpenStr=tpen.lineWidth+' '+tpen.lineStyle+' '+tpen.lineColor;
						}
						var bpen=box.bottomPen;
						var bpenStr='""';
						if(bpen!=null){
							bpenStr=bpen.lineWidth+' '+bpen.lineStyle+' '+bpen.lineColor;
						}
						var lpen=box.leftPen;
						var lpenStr='""';
						if(lpen!=null){
							lpenStr=lpen.lineWidth+' '+lpen.lineStyle+' '+lpen.lineColor;
						}
						var rpen=box.rightPen;
						var rpenStr='""';
						if(rpen!=null){
							rpenStr=rpen.lineWidth+' '+rpen.lineStyle+' '+rpen.lineColor;
						}
						if(rpenStr==lpenStr&&rpenStr==bpenStr&&rpenStr==tpenStr){
							styleStr=rpenStr;
						}else{
							styleStr="mixed";
						}
					}else{
						styleStr='""'	
					}

					if(cell.mergeAcross>0&&cell.mergeDown>0){
						for(var k=0;k<cell.mergeAcross;k++){	
							j++;
							for(var m=0;m<cell.mergeDown;m++){
								arr1.push(styleStr);
								i++;
							}
						}
					}else{
						arr1.push(styleStr);
					}
				}else{
					arr1.push('');
				}
			}
		}
		arr1.push('');
		arr1.push('');
		arr1.push('');
		arr1.push('');
				arr1.push('');
		arr.push(arr1);
		res.push(arr);
		return res;
	}
	_p.drawBorderTop = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];
		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];

		b=true;
		var row= this.getRow(y1);
		if(row==null){
			row=new dev.report.model.XRow(y1);
			row.height=this.defaultRowHeight;
			this.addRow(row);
		}else{
			if(row.height==0) row.height=this.defaultRowHeight;
		}
		for(var j=x1;j<x2+1;j++){
				var cell=this.getCell(j,y1);
				arr1=[];
				arr1.push(j,y1,0);
				if(cell.styleID!=''){
					var styleNum=this.getCellStyles(cell.styleID);
					var tempStyle=dev.report.model.report.getStyle(cell.styleID);
					if(styleNum>1){
						style=tempStyle.clone();
					}else{
						style=tempStyle;
					}
				}else{
					style=new dev.report.model.XStyle();
				}
				var stylePair=s.split(" ");
				var topPen=new dev.report.model.XTopPen();
				topPen.lineWidth =stylePair[0] ;
				topPen.lineStyle =stylePair[1] ;
				topPen.lineColor =stylePair[2] ;

				if(style.box==null){
					style.box=new dev.report.model.XBox();
				}
				style.box.topPen=topPen;
				if(style.name==''){
					var styles=dev.report.model.report.getStylesObject();
					var alreadyHave=false;
					var styleName=randomString(5);
					for(var i in styles){
						var tempStyle=styles[i];
						if(tempStyle.equals(style)){
							alreadyHave=true;
							styleName=tempStyle.name;
							break;
						}
					}
					if(!alreadyHave){
						style.name=styleName;
						dev.report.model.report.addStyle(style);
					}
					cell.styleID=styleName;
				}
			var styleString=cell.getStyle();;
			arr1.push({"s":styleString});
			if(cell.mergeAcross>0){
				j=j+cell.mergeAcross-1;
			}	
			arr.push(arr1);
		}
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]); 
		return res;
	}
	_p.drawBorderBottom = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];
		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];
		b=true;

		var row= this.getRow(y2);
		if(row==null){
			row=new dev.report.model.XRow(y2);
			row.height=this.defaultRowHeight;
			this.addRow(row);
		}else{
			if(row.height==0) row.height=this.defaultRowHeight;
		}
		
		for(var j=x1;j<x2+1;j++){
				var topCell=this.getCell(j,y1);
				var cell;
				if(topCell.mergeAcross>0&&y1+topCell.mergeDown-1==y2){
					arr1=[];
					arr1.push(j,y1,0);
					cell=topCell;
				}else{
					arr1=[];
					arr1.push(j,y2,0);
					cell=this.getCell(j,y2);
				}
				if(cell.styleID!=''){
					var styleNum=this.getCellStyles(cell.styleID);
					var tempStyle=dev.report.model.report.getStyle(cell.styleID);
					if(styleNum>1){
						style=tempStyle.clone();
					}else{
						style=tempStyle;
					}
				}else{
					style=new dev.report.model.XStyle();
				}
				var stylePair=s.split(" ");
				
				var bPen=new dev.report.model.XBottomPen();
				bPen.lineWidth =stylePair[0] ;
				bPen.lineStyle =stylePair[1] ;
				bPen.lineColor =stylePair[2] ;

				if(style.box==null){
					style.box=new dev.report.model.XBox();
				}
				style.box.bottomPen=bPen;
				
				if(style.name==''){
					var styles=dev.report.model.report.getStylesObject();
					var alreadyHave=false;
					var styleName=randomString(5);
	
					for(var i in styles){
						var tempStyle=styles[i];
						if(tempStyle.equals(style)){
							alreadyHave=true;
							styleName=tempStyle.name;
							break;
						}
					}
					if(!alreadyHave){
						style.name=styleName;
						dev.report.model.report.addStyle(style);
					}
					cell.styleID=styleName;
				}
				var styleString=cell.getStyle();;
				arr1.push({"s":styleString});
				if(topCell.mergeAcross>0&&y1+topCell.mergeDown-1==y2){
					j=j+topCell.mergeAcross-1;
				}
				arr.push(arr1);
		}
		obj1["1"].push(arr);
		console.log(obj1);
		res.push(obj1);
		res.push([[true,""]]); 
		return res;
	}
	_p.drawBorderLeft = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];
		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];
	
		b=true;

		for(var j=y1;j<y2+1;j++){
			var row= this.getRow(j);
			if(row==null){
				row=new dev.report.model.XRow(j);
				row.height=this.defaultRowHeight;
				this.addRow(row);
			}else{
				if(row.height==0) row.height=this.defaultRowHeight;
			}
			var cell=this.getCell(x1,j);
			arr1=[];
			arr1.push(x1,j,1);
			if(cell.styleID!=''){
				var styleNum=this.getCellStyles(cell.styleID);
				var tempStyle=dev.report.model.report.getStyle(cell.styleID);
				if(styleNum>1){
					style=tempStyle.clone();
				}else{
					style=tempStyle;
				}
			}else{
				style=new dev.report.model.XStyle();
			}
			var stylePair=s.split(" ");
			
			var lPen=new dev.report.model.XLeftPen();
			lPen.lineWidth =stylePair[0] ;
			lPen.lineStyle =stylePair[1] ;
			lPen.lineColor =stylePair[2] ;
			if(style.box==null){
				style.box=new dev.report.model.XBox();
			}
			style.box.leftPen=lPen;
			
			if(style.name==''){
				var styles=dev.report.model.report.getStylesObject();
				var alreadyHave=false;
				var styleName=randomString(5);

				for(var i in styles){
					var tempStyle=styles[i];
					if(tempStyle.equals(style)){
						alreadyHave=true;
						styleName=tempStyle.name;
						break;
					}
				}
				if(!alreadyHave){
					style.name=styleName;
					dev.report.model.report.addStyle(style);
				}
				cell.styleID=styleName;
			}
			var styleString=cell.getStyle();
			arr1.push({"s":styleString});
			if(cell.mergeDown>0){
				j=j+cell.mergeDown-1;
			}	
			arr.push(arr1);
		}
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]); 
		return res;
	}
	_p.drawBorderRight = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];

		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];
		b=true;
		for(var j=y1;j<y2+1;j++){
			var row= this.getRow(j);
			if(row==null){
				row=new dev.report.model.XRow(j);
				row.height=this.defaultRowHeight;
				this.addRow(row);
			}else{
				if(row.height==0) row.height=this.defaultRowHeight;
			}
			var leftCell=this.getCell(x1,j);
			var cell;
			if(leftCell.mergeDown>0&&x1+leftCell.mergeAcross-1==x2){
				arr1=[];
				arr1.push(x1,j,1);
				cell=leftCell;
			}else{
				arr1=[];
				arr1.push(x2,j,1);
				cell=this.getCell(x2,j);	
			}
   
			if(cell.styleID!=''){
				var styleNum=this.getCellStyles(cell.styleID);
				var tempStyle=dev.report.model.report.getStyle(cell.styleID);
				if(styleNum>1){
					style=tempStyle.clone();
				}else{
					style=tempStyle;
				}
			}else{
				style=new dev.report.model.XStyle();
			}
			var stylePair=s.split(" ");
			
			var rPen=new dev.report.model.XRightPen();
			rPen.lineWidth =stylePair[0] ;
			rPen.lineStyle =stylePair[1] ;
			rPen.lineColor =stylePair[2] ;

			if(style.box==null){
				style.box=new dev.report.model.XBox();
			}
			style.box.rightPen=rPen;

			if(style.name==''){
				var styles=dev.report.model.report.getStylesObject();
				var alreadyHave=false;
				var styleName=randomString(5);

				for(var i in styles){
					var tempStyle=styles[i];
					if(tempStyle.equals(style)){
						alreadyHave=true;
						styleName=tempStyle.name;
						break;
					}
				}
				if(!alreadyHave){
					style.name=styleName;
					dev.report.model.report.addStyle(style);
				}
				cell.styleID=styleName;
			}
			var styleString=cell.getStyle();
			arr1.push({"s":styleString});
			if(leftCell.mergeDown>0&&x1+leftCell.mergeAcross-1==x2){
				j=j+leftCell.mergeDown-1;
			}
			arr.push(arr1);
		}
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]);
		return res;
	}
	_p.drawHorizontalBorder = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];

		var colSpan=x2-x1+1;
		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];
	

		for(var j=y1;j<y2+1;j++){
			for(var i=x1;i<x2+1;i++){		
				var row= this.getRow(j);
				if(row==null){
					row=new dev.report.model.XRow(j);
					row.height=this.defaultRowHeight;
					this.addRow(row);
				}else{
					if(row.height==0) row.height=this.defaultRowHeight;
				}
				var cell=this.getCell(i,j);
				if(cell!=null){
					arr1=[];
					arr1.push(i,j,0);
					if(cell.styleID!=''){
						var styleNum=this.getCellStyles(cell.styleID);
						var tempStyle=dev.report.model.report.getStyle(cell.styleID);
						if(styleNum>1){
							style=tempStyle.clone();
						}else{
							style=tempStyle;
						}
					}else{
						style=new dev.report.model.XStyle();
					}
					if(s!=""){
						var stylePair=s.split(" ");
						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}
						if(j!=y1&&j!=y2){
								var topPen=new dev.report.model.XTopPen();
								topPen.lineWidth =stylePair[0] ;
								topPen.lineStyle =stylePair[1] ;
								topPen.lineColor =stylePair[2] ;
								style.box.topPen=topPen;

								var bPen=new dev.report.model.XBottomPen();
								bPen.lineWidth =stylePair[0] ;
								bPen.lineStyle =stylePair[1] ;
								bPen.lineColor =stylePair[2] ;
								style.box.bottomPen=bPen;

						}else if(j==y1){
								var bPen=new dev.report.model.XBottomPen();
								bPen.lineWidth =stylePair[0] ;
								bPen.lineStyle =stylePair[1] ;
								bPen.lineColor =stylePair[2] ;
								style.box.bottomPen=bPen;
						}else if(j==y2){
								var topPen=new dev.report.model.XTopPen();
								topPen.lineWidth =stylePair[0] ;
								topPen.lineStyle =stylePair[1] ;
								topPen.lineColor =stylePair[2] ;
								style.box.topPen=topPen;
						}
					}  
					if(style.name==''){
						var styles=dev.report.model.report.getStylesObject();
						var alreadyHave=false;
						var styleName=randomString(5);

						for(var k in styles){
							var tempStyle=styles[k];
							if(tempStyle.equals(style)){
								alreadyHave=true;
								styleName=tempStyle.name;
								break;
							}
						}
						if(!alreadyHave){
							style.name=styleName;
							dev.report.model.report.addStyle(style);
						}
						cell.styleID=styleName;
					}
					var styleString=cell.getStyle();
					arr1.push({"s":styleString});
					arr.push(arr1);
				}
			}
		}
	
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]);
		return res;
	}
	_p.drawVerticalBorder = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];

		var colSpan=x2-x1+1;
		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];

		for(var j=y1;j<y2+1;j++){
			for(var i=x1;i<x2+1;i++){		
				var row= this.getRow(j);
				if(row==null){
					row=new dev.report.model.XRow(j);
					row.height=this.defaultRowHeight;
					this.addRow(row);
				}else{
					if(row.height==0) row.height=this.defaultRowHeight;
				}
				
				var cell=this.getCell(i,j);
				if(cell!=null){
					arr1=[];
					arr1.push(i,j,0);
					if(cell.styleID!=''){
						var styleNum=this.getCellStyles(cell.styleID);
						var tempStyle=dev.report.model.report.getStyle(cell.styleID);
						if(styleNum>1){
							style=tempStyle.clone();
						}else{
							style=tempStyle;
						}
					}else{
						style=new dev.report.model.XStyle();
					}
					if(s!=""){
						var stylePair=s.split(" ");
						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}
						if(i!=x1&&i!=x2){
								var rPen=new dev.report.model.XRightPen();
								rPen.lineWidth =stylePair[0] ;
								rPen.lineStyle =stylePair[1] ;
								rPen.lineColor =stylePair[2] ;
								style.box.rightPen=rPen;

								var lPen=new dev.report.model.XLeftPen();
								lPen.lineWidth =stylePair[0] ;
								lPen.lineStyle =stylePair[1] ;
								lPen.lineColor =stylePair[2] ;
								style.box.leftPen=lPen;

						}else if(i==x1){
								var rPen=new dev.report.model.XRightPen();
								rPen.lineWidth =stylePair[0] ;
								rPen.lineStyle =stylePair[1] ;
								rPen.lineColor =stylePair[2] ;
								style.box.rightPen=rPen;
						}else if(i==x2){
								var lPen=new dev.report.model.XLeftPen();
								lPen.lineWidth =stylePair[0] ;
								lPen.lineStyle =stylePair[1] ;
								lPen.lineColor =stylePair[2] ;
								style.box.leftPen=lPen;
						}
					}
					if(style.name==''){
						var styles=dev.report.model.report.getStylesObject();
						var alreadyHave=false;
						var styleName=randomString(5);

						for(var k in styles){
							var tempStyle=styles[k];
							if(tempStyle.equals(style)){
								alreadyHave=true;
								styleName=tempStyle.name;
								break;
							}
						}
						if(!alreadyHave){
							style.name=styleName;
							dev.report.model.report.addStyle(style);
						}
						cell.styleID=styleName;
					}
					var styleString=cell.getStyle();
					arr1.push({"s":styleString});
					arr.push(arr1);
				}
			}
		}
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]);
		return res;
	}
	_p.drawEveryBorder = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];

		var colSpan=x2-x1+1;
		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];

		for(var j=y1;j<y2+1;j++){
			for(var i=x1;i<x2+1;i++){		
				var row= this.getRow(j);
				if(row==null){
					row=new dev.report.model.XRow(j);
					row.height=this.defaultRowHeight;
					this.addRow(row);
				}else{
					if(row.height==0) row.height=this.defaultRowHeight;
				}
				var cell=this.getCell(i,j);
				if(cell!=null){
					if(j<y2){
						var style;
						var cell=this.getCell(i,j);
						if(cell!=null){
							arr1=[];
							arr1.push(i,j,0);
							if(cell.styleID!=''){
								var styleNum=this.getCellStyles(cell.styleID);
								var tempStyle=dev.report.model.report.getStyle(cell.styleID);
								if(styleNum>1){
									style=tempStyle.clone();
								}else{
									style=tempStyle;
								}
							}else{
								style=new dev.report.model.XStyle();
							}
							var stylePair=s.split(" ");

							if(style.box==null){
								style.box=new dev.report.model.XBox();
							}
							if(i<x2){
								var topPen=new dev.report.model.XTopPen();
								topPen.lineWidth =stylePair[0] ;
								topPen.lineStyle =stylePair[1] ;
								topPen.lineColor =stylePair[2] ;
								style.box.topPen=topPen;
								
								var lPen=new dev.report.model.XLeftPen();
								lPen.lineWidth =stylePair[0] ;
								lPen.lineStyle =stylePair[1] ;
								lPen.lineColor =stylePair[2] ;
								style.box.leftPen=lPen;
							}else{
								var topPen=new dev.report.model.XTopPen();
								topPen.lineWidth =stylePair[0] ;
								topPen.lineStyle =stylePair[1] ;
								topPen.lineColor =stylePair[2] ;
								style.box.topPen=topPen;

								var lPen=new dev.report.model.XLeftPen();
								lPen.lineWidth =stylePair[0] ;
								lPen.lineStyle =stylePair[1] ;
								lPen.lineColor =stylePair[2] ;
								style.box.leftPen=lPen;

								var rPen=new dev.report.model.XRightPen();
								rPen.lineWidth =stylePair[0] ;
								rPen.lineStyle =stylePair[1] ;
								rPen.lineColor =stylePair[2] ;
								style.box.rightPen=rPen;
							}
							if(style.name==''){
								var styles=dev.report.model.report.getStylesObject();
								var alreadyHave=false;
								var styleName=randomString(5);

								for(var k in styles){
									var tempStyle=styles[k];
									if(tempStyle.equals(style)){
										alreadyHave=true;
										styleName=tempStyle.name;
										break;
									}
								}
								if(!alreadyHave){
									style.name=styleName;
									dev.report.model.report.addStyle(style);
								}
								cell.styleID=styleName;
							}
							var styleString=cell.getStyle();
							arr1.push({"s":styleString});
							arr.push(arr1);	
						}
				}else {	
					var style;
					var cell=this.getCell(i,j);
					if(cell!=null){
						arr1=[];
						arr1.push(i,j,0);
						if(cell.styleID!=''){
							var styleNum=this.getCellStyles(cell.styleID);
							var tempStyle=dev.report.model.report.getStyle(cell.styleID);
							if(styleNum>1){
								style=tempStyle.clone();
							}else{
								style=tempStyle;
							}
						}else{
							style=new dev.report.model.XStyle();
						}
						var stylePair=s.split(" ");
						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}

						if(i<x2){
							var topPen=new dev.report.model.XTopPen();
							topPen.lineWidth =stylePair[0] ;
							topPen.lineStyle =stylePair[1] ;
							topPen.lineColor =stylePair[2] ;
							style.box.topPen=topPen;
							
							var lPen=new dev.report.model.XLeftPen();
							lPen.lineWidth =stylePair[0] ;
							lPen.lineStyle =stylePair[1] ;
							lPen.lineColor =stylePair[2] ;
							style.box.leftPen=lPen;

							var bPen=new dev.report.model.XBottomPen();
							bPen.lineWidth =stylePair[0] ;
							bPen.lineStyle =stylePair[1] ;
							bPen.lineColor =stylePair[2] ;
							style.box.bottomPen=bPen;

						}else{
							var topPen=new dev.report.model.XTopPen();
							topPen.lineWidth =stylePair[0] ;
							topPen.lineStyle =stylePair[1] ;
							topPen.lineColor =stylePair[2] ;
							style.box.topPen=topPen;

							var lPen=new dev.report.model.XLeftPen();
							lPen.lineWidth =stylePair[0] ;
							lPen.lineStyle =stylePair[1] ;
							lPen.lineColor =stylePair[2] ;
							style.box.leftPen=lPen;

							var rPen=new dev.report.model.XRightPen();
							rPen.lineWidth =stylePair[0] ;
							rPen.lineStyle =stylePair[1] ;
							rPen.lineColor =stylePair[2] ;
							style.box.rightPen=rPen;

							var bPen=new dev.report.model.XBottomPen();
							bPen.lineWidth =stylePair[0] ;
							bPen.lineStyle =stylePair[1] ;
							bPen.lineColor =stylePair[2] ;
							style.box.bottomPen=bPen;
						}

						if(style.name==''){
							var styles=dev.report.model.report.getStylesObject();
							var alreadyHave=false;
							var styleName=randomString(5);

							for(var k in styles){
								var tempStyle=styles[k];
								if(tempStyle.equals(style)){
									alreadyHave=true;
									styleName=tempStyle.name;
									break;
								}
							}
							if(!alreadyHave){
								style.name=styleName;
								dev.report.model.report.addStyle(style);
							}
							cell.styleID=styleName;
						}
						var styleString=cell.getStyle();
						arr1.push({"s":styleString});
						arr.push(arr1);	
					}
				}
				}
			}
		}
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]);
		return res;
}
_p.drawBorder = function(span,s){
		var x1,y1,x2,y2;
		x1=span[0],y1=span[1],x2=span[2],y2=span[3];
		var colSpan=x2-x1+1;
		var res=[];
		var obj1={};
		obj1["1"]=[];
		var arr=[];
		arr.push("crgn");
		arr.push({"cm":true,"p":0});
		var arr1=[];
		for(var j=y1;j<y2+1;j++){
			for(var i=x1;i<x2+1;i++){
				var row= this.getRow(j);
				if(row==null){
					row=new dev.report.model.XRow(j);
					row.height=this.defaultRowHeight;
					this.addRow(row);
				}else{
					if(row.height==0) row.height=this.defaultRowHeight;
				}
				
				if(j==y1){
					var style;
					var cell=this.getCell(i,j);
					if(cell!=null){
						arr1=[];
						arr1.push(i,j,0);
						if(cell.styleID!=''){
							var styleNum=this.getCellStyles(cell.styleID);
							var tempStyle=dev.report.model.report.getStyle(cell.styleID);
							if(styleNum>1){
								style=tempStyle.clone();
							}else{
								style=tempStyle;
							}
						}else{
							style=new dev.report.model.XStyle();
						}
						var stylePair=s.split(" ");

						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}
						if(i==x1){
							var topPen=new dev.report.model.XTopPen();
							topPen.lineWidth =stylePair[0] ;
							topPen.lineStyle =stylePair[1] ;
							topPen.lineColor =stylePair[2] ;
							style.box.topPen=topPen;
							
							var lPen=new dev.report.model.XLeftPen();
							lPen.lineWidth =stylePair[0] ;
							lPen.lineStyle =stylePair[1] ;
							lPen.lineColor =stylePair[2] ;
							style.box.leftPen=lPen;
						}else if(i<x2){
							var topPen=new dev.report.model.XTopPen();
							topPen.lineWidth =stylePair[0] ;
							topPen.lineStyle =stylePair[1] ;
							topPen.lineColor =stylePair[2] ;
							style.box.topPen=topPen;
						}else{
							var topPen=new dev.report.model.XTopPen();
							topPen.lineWidth =stylePair[0] ;
							topPen.lineStyle =stylePair[1] ;
							topPen.lineColor =stylePair[2] ;
							style.box.topPen=topPen;

							var rPen=new dev.report.model.XRightPen();
							rPen.lineWidth =stylePair[0] ;
							rPen.lineStyle =stylePair[1] ;
							rPen.lineColor =stylePair[2] ;
							style.box.rightPen=rPen;
						}
						if(style.name==''){
							var styles=dev.report.model.report.getStylesObject();
							var alreadyHave=false;
							var styleName=randomString(5);

							for(var k in styles){
								var tempStyle=styles[k];
								if(tempStyle.equals(style)){
									alreadyHave=true;
									styleName=tempStyle.name;
									break;
								}
							}
							if(!alreadyHave){
								style.name=styleName;
								dev.report.model.report.addStyle(style);
							}
							cell.styleID=styleName;
						}
						var styleString=cell.getStyle();
						arr1.push({"s":styleString});
						arr.push(arr1);	
					}
				}
	
				if(j<y2+1&&i==x1&&j!=y1){	
					var style;
					var cell=this.getCell(i,j);
					if(cell!=null){
						arr1=[];
						arr1.push(i,j,0);
						if(cell.styleID!=''){
							var styleNum=this.getCellStyles(cell.styleID);
							var tempStyle=dev.report.model.report.getStyle(cell.styleID);
							if(styleNum>1){
								style=tempStyle.clone();
							}else{
								style=tempStyle;
							}
						}else{
							style=new dev.report.model.XStyle();
						}
						var stylePair=s.split(" ");
						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}

						var lPen=new dev.report.model.XLeftPen();
						lPen.lineWidth =stylePair[0] ;
						lPen.lineStyle =stylePair[1] ;
						lPen.lineColor =stylePair[2] ;
						style.box.leftPen=lPen;
						if(style.name==''){
							var styles=dev.report.model.report.getStylesObject();
							var alreadyHave=false;
							var styleName=randomString(5);

							for(var k in styles){
								var tempStyle=styles[k];
								if(tempStyle.equals(style)){
									alreadyHave=true;
									styleName=tempStyle.name;
									break;
								}
							}
							if(!alreadyHave){
								style.name=styleName;
								dev.report.model.report.addStyle(style);
							}
							cell.styleID=styleName;
						}
						var styleString=cell.getStyle();
						arr1.push({"s":styleString});
						arr.push(arr1);	
					}
				}

				if(j<y2+1&&i==x2){
					var style;
					var cell=this.getCell(i,j);
					if(cell!=null){
						arr1=[];
						arr1.push(i,j,0);
						if(cell.styleID!=''){
							var styleNum=this.getCellStyles(cell.styleID);
							var tempStyle=dev.report.model.report.getStyle(cell.styleID);
							if(styleNum>1){
								style=tempStyle.clone();
							}else{
								style=tempStyle;
							}
						}else{
							style=new dev.report.model.XStyle();
						}
						var stylePair=s.split(" ");
						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}

						var rPen=new dev.report.model.XRightPen();
						rPen.lineWidth =stylePair[0] ;
						rPen.lineStyle =stylePair[1] ;
						rPen.lineColor =stylePair[2] ;
						style.box.rightPen=rPen;

						if(style.name==''){
							var styles=dev.report.model.report.getStylesObject();
							var alreadyHave=false;
							var styleName=randomString(5);

							for(var k in styles){
								var tempStyle=styles[k];
								if(tempStyle.equals(style)){
									alreadyHave=true;
									styleName=tempStyle.name;
									break;
								}
							}
							if(!alreadyHave){
								style.name=styleName;
								dev.report.model.report.addStyle(style);
							}
							cell.styleID=styleName;
						}
						var styleString=cell.getStyle();
						arr1.push({"s":styleString});
						arr.push(arr1);	
					}
				}
				if(j==y2&&i<x2+1){
					var style;
					var cell=this.getCell(i,j);
					if(cell!=null){
						arr1=[];
						arr1.push(i,j,0);
						if(cell.styleID!=''){
							var styleNum=this.getCellStyles(cell.styleID);		
							var tempStyle=dev.report.model.report.getStyle(cell.styleID);
							if(styleNum>1){
								style=tempStyle.clone();	
							}else{
								style=tempStyle;
							}
						}else{
							style=new dev.report.model.XStyle();
						}
						var stylePair=s.split(" ");
						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}
						var bottomPen=new dev.report.model.XBottomPen();
						bottomPen.lineWidth =stylePair[0] ;
						bottomPen.lineStyle =stylePair[1] ;
						bottomPen.lineColor =stylePair[2] ;
						style.box.bottomPen=bottomPen;	
						if(style.name==''){
							var styles=dev.report.model.report.getStylesObject();
							var alreadyHave=false;
							var styleName=randomString(5);

							for(var k in styles){
								var tempStyle=styles[k];
								if(tempStyle.equals(style)){
									alreadyHave=true;
									styleName=tempStyle.name;
									break;
								}
							}
							if(!alreadyHave){
								style.name=styleName;
								dev.report.model.report.addStyle(style);
							}
							cell.styleID=styleName;
						}
						var styleString=cell.getStyle();
						arr1.push({"s":styleString});
						arr.push(arr1);	
					}
				}

				var style;
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null){
					if(cell.mergeDown>0&&j+cell.mergeDown-1==y2){
							arr1=[];
							arr1.push(i,j,0);
							if(cell.styleID!=''){
								var styleNum=this.getCellStyles(cell.styleID);		
								var tempStyle=dev.report.model.report.getStyle(cell.styleID);
								if(styleNum>1){
									style=tempStyle.clone();	
								}else{
									style=tempStyle;
								}
							}else{  
								style=new dev.report.model.XStyle();
							}
							var stylePair=s.split(" ");
							if(style.box==null){
								style.box=new dev.report.model.XBox();
							}
							var bottomPen=new dev.report.model.XBottomPen();
							bottomPen.lineWidth =stylePair[0] ;
							bottomPen.lineStyle =stylePair[1] ;
							bottomPen.lineColor =stylePair[2] ;
							style.box.bottomPen=bottomPen;	
							if(style.name==''){
								var styles=dev.report.model.report.getStylesObject();
								var alreadyHave=false;
								var styleName=randomString(5);

								for(var k in styles){
									var tempStyle=styles[k];
									if(tempStyle.equals(style)){
										alreadyHave=true;
										styleName=tempStyle.name;
										break;
									}
								}
								if(!alreadyHave){
									style.name=styleName;
									dev.report.model.report.addStyle(style);
								}
								cell.styleID=styleName;
							}
						var styleString=cell.getStyle();
						arr1.push({"s":styleString});
						arr.push(arr1);	
					}
				}
				var style;
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null){  
					if(cell.mergeAcross>0&&i+cell.mergeAcross-1==x2){
						arr1=[];
						arr1.push(i,j,1);
						if(cell.styleID!=''){
							var styleNum=this.getCellStyles(cell.styleID);		
							var tempStyle=dev.report.model.report.getStyle(cell.styleID);
							if(styleNum>1){
								style=tempStyle.clone();	
							}else{
								style=tempStyle;
							}
						}else{  
							style=new dev.report.model.XStyle();
						}
						var stylePair=s.split(" ");
						if(style.box==null){
							style.box=new dev.report.model.XBox();
						}
						var rPen=new dev.report.model.XRightPen();
						rPen.lineWidth =stylePair[0] ;
						rPen.lineStyle =stylePair[1] ;
						rPen.lineColor =stylePair[2] ;
						style.box.rightPen=rPen;
						if(style.name==''){
							var styles=dev.report.model.report.getStylesObject();
							var alreadyHave=false;
							var styleName=randomString(5);
							for(var k in styles){
								var tempStyle=styles[k];
								if(tempStyle.equals(style)){
									alreadyHave=true;
									styleName=tempStyle.name;
									break;
								}
							}
							if(!alreadyHave){
								style.name=styleName;
								dev.report.model.report.addStyle(style);
							}
							cell.styleID=styleName;
						}
						var styleString=cell.getStyle();
						arr1.push({"s":styleString});
						arr.push(arr1);	
					}
				}
			}
		} 
		obj1["1"].push(arr);
		res.push(obj1);
		res.push([[true,""]]);
		return res;
}
_p.init = function(tableElement) {
		this.expandedColumnCount= parseInt(tableElement.attributes.getNamedItem("ExpandedColumnCount").value);
		this.expandedRowCount= parseInt(tableElement.attributes.getNamedItem("ExpandedRowCount").value);
		this.fullColumns= tableElement.attributes.getNamedItem("FullColumns").value;
		this.fullRows= tableElement.attributes.getNamedItem("FullRows").value;
		this.defaultColumnWidth= tableElement.attributes.getNamedItem("DefaultColumnWidth").value;
		this.defaultRowHeight= tableElement.attributes.getNamedItem("DefaultRowHeight").value;
		var itemsElements=tableElement.childNodes;
		for(var n=0;n<itemsElements.length;n++){
			 var pElement=itemsElements[n];
			 if(pElement.nodeName=='Column'){
				var col=new dev.report.model.XColumn();
				col.init(pElement);
				this.addColumn(col)
			 }
			if(pElement.nodeName=='Row'){
				var row=new dev.report.model.XRow();
				row.init(pElement);
				this.addRow(row)
			}
			if(pElement.nodeName=='Range'){
				var range=new dev.report.model.XRange();
				range.init(pElement);
				this.addRange(range);
			 }
			 if(pElement.nodeName=='Picture'){
				var img=new dev.report.model.XPicture();
				img.init(pElement);
				this.addPicture(img);
			 }
		}
		for(var j=0;j<this.expandedRowCount;j++){
			for(var i=0;i<=this.expandedColumnCount;i++){
				var cell=this.getCellNoCreate(i,j);
				if(cell!=null){
					var mergeAcross=parseInt(cell.mergeAcross);
					var mergeDown=parseInt(cell.mergeDown);
					if(mergeAcross!=0&&mergeDown!=0){
						var b=true;
						var y=parseInt(cell.row.index);
						var x=parseInt(cell.index);
						for(var k=y;k<y+mergeDown;k++){
							for(var m=x;m<x+mergeAcross;m++){
								if(b)
									b=false;
								else{
									var c=[m,k];
									this.mergeCells.push(c);
								}
							}
						}
					}
					mergeAcross=0;
					mergeDown=0;
				}else{
					mergeAcross=0;
					mergeDown=0;
				}
			}
		}
}
_p.toXML= function() {
	var str=[];
	str.push('\n <Table ExpandedColumnCount="',this.expandedColumnCount,'" ExpandedRowCount="',this.expandedRowCount,'" FullColumns="',this.fullColumns,'" FullRows="',this.fullRows,'" DefaultColumnWidth="',this.defaultColumnWidth,'" DefaultRowHeight="',this.defaultRowHeight,'">');
	for(var i in this.columns){
		str.push(this.columns[i].toXML());
	}
	for(var i in this.rows){
		str.push(this.rows[i].toXML());
	}
	for(var i in this.ranges){
		str.push(this.ranges[i].toXML());
	}
	for(var i in this.pictures){
		str.push(this.pictures[i].toXML());
	}
	str.push('\n</Table>');
	return str.join('');
}
dev.report.model.XColumn = function(index){
	this.autoFitWidth=0;
	this.index=index;
	this.span=0;
	this.styleID="";
	this.width=0;
};
var _p = dev.report.model.XColumn.prototype;

_p.init = function(colElement) {
		this.autoFitWidth= colElement.attributes.getNamedItem("AutoFitWidth").value;
		this.index= colElement.attributes.getNamedItem("Index").value;
		this.width= colElement.attributes.getNamedItem("Width").value;
		if(colElement.attributes.getNamedItem("Span")!=null)
			this.span= colElement.attributes.getNamedItem("Span").value;
		if(colElement.attributes.getNamedItem("StyleID")!=null)
			this.styleID= colElement.attributes.getNamedItem("StyleID").value;
}
_p.toXML= function() {
	var str=[];
	str.push('\n <Column Index="',this.index,'" AutoFitWidth="',this.autoFitWidth,'" Width="',this.width,'"');
	if(this.styleID!="") str.push('" StyleID="',this.styleID,'"');
	if(this.span!=0) str.push('" Span="',this.span,'"');
	str.push('/>');
	return str.join('');
}
dev.report.model.XRow = function(index){
	this.autoFitHeight=0;
	this.index=index;
	this.span=0;
	this.table=null;
	this.styleID="";
	this.height=0;
	this.cells={};
};
var _p = dev.report.model.XRow.prototype;
_p.addCell=function(cell){
	var _cells=this.cells;
	_cells[cell.index]=cell;
	cell.row=this;
	this._cells=_cells;
}
_p.getCell=function(id) {
	return this.cells[id];
}
_p.removeCell=function(id) {
   delete this.cells[id];
}
_p.init = function(rowElement) {
		this.autoFitHeight= rowElement.attributes.getNamedItem("AutoFitHeight").value;
		this.index= rowElement.attributes.getNamedItem("Index").value;
		this.height= rowElement.attributes.getNamedItem("Height").value;
		if(rowElement.attributes.getNamedItem("Span")!=null)
			this.span= rowElement.attributes.getNamedItem("Span").value;
		if(rowElement.attributes.getNamedItem("StyleID")!=null)
			this.styleID= rowElement.attributes.getNamedItem("StyleID").value;
		var itemsElements=rowElement.childNodes;
		for(var n=0;n<itemsElements.length;n++){
			 var pElement=itemsElements[n];
			 if(pElement.nodeName=='Cell'){
				var cell=new dev.report.model.XCell();
				cell.init(pElement);
				this.addCell(cell);
			 }
		}
}
_p.toXML= function() {
	var str=[];
	str.push('\n <Row Index="',this.index,'" AutoFitHeight="',this.autoFitHeight,'" Height="',this.height,'"');
	if(this.styleID!="") str.push(' StyleID="',this.styleID,'"');
	if(this.span!=0) str.push(' Span="',this.span,'"');
	str.push('>');
	for(var i in this.cells){
		str.push(this.cells[i].toXML());
	}
	str.push('\n </Row>');
	return str.join('');
}
dev.report.model.XCell = function(index){
	this.arrayRange="";
	this.formula="";
	this.row=null;
	this.index=index;
	this.mergeAcross=0;
	this.mergeDown=0;
	this.styleID="";
	this.dataType="string";
	this.dataValue="";
	this.noChange=true;
};

var _p = dev.report.model.XCell.prototype;

_p.getStyle = function() {
   var styleString="";
   if(this.styleID!=''){
	   var style=dev.report.model.report.getStyle(this.styleID);
	   var str=[];  
	   if(style.fontName!=''){
		 str.push('font-family:',style.fontName,';');
	   }
	   if(style.fontSize!=''){
		 str.push('font-size:',style.fontSize,';');
	   }
	    if(style.isBold) {
			 str.push('font-weight:bold;');
		}else{
			 str.push('font-weight:normal;');
		}
		if(style.isItalic) {
			str.push('font-style:italic;');
		}else{
			str.push('font-style:normal;');
		}

		if(style.isUnderline||style.isStrikeThrough){
			str.push('text-decoration:');
			if(style.isUnderline) {
				str.push('underline');
			}
			if(style.isStrikeThrough) {
				str.push('line-through;');
			}else{
				str.push(';');
			}
		}
		if(style.forecolor!=''){
			str.push('color:',style.forecolor,';');
		}
		if(style.backcolor!=''){
			str.push('background-color:',style.backcolor,';');
		}
		if(style.hAlign!=''){
			str.push('text-align:',style.hAlign,';');
		}
		if(this.styleID!=''){
			var style1=dev.report.model.report.getStyle(this.styleID);
			var box=style1.box;
			if(box!=null){
				var tpen=box.topPen;
				if(tpen!=null){
					str.push('border-top:',tpen.lineWidth+' '+tpen.lineStyle+' '+tpen.lineColor,';');
				}
				var bpen=box.bottomPen;
				if(bpen!=null){
					str.push('border-bottom:',bpen.lineWidth+' '+bpen.lineStyle+' '+bpen.lineColor,';');
				}
				var lpen=box.leftPen;
				if(lpen!=null){
					str.push('border-left:',lpen.lineWidth+' '+lpen.lineStyle+' '+lpen.lineColor,';');
				}
				var rpen=box.rightPen;
				if(rpen!=null){
					str.push('border-right:',rpen.lineWidth+' '+rpen.lineStyle+' '+rpen.lineColor,';');
				}
			}
		}
		styleString=str.join('');
   }
	return styleString;
}
_p.init = function(cellElement) {
		this.index= cellElement.attributes.getNamedItem("Index").value;
		if(cellElement.attributes.getNamedItem("MergeAcross")!=null)
			this.mergeAcross= parseInt(cellElement.attributes.getNamedItem("MergeAcross").value);
		if(cellElement.attributes.getNamedItem("MergeDown")!=null)
			this.mergeDown= parseInt(cellElement.attributes.getNamedItem("MergeDown").value);


		if(cellElement.attributes.getNamedItem("Formula")!=null)
			this.formula= cellElement.attributes.getNamedItem("Formula").value;
		if(cellElement.attributes.getNamedItem("StyleID")!=null)
			this.styleID= cellElement.attributes.getNamedItem("StyleID").value;
		var itemsElements=cellElement.childNodes;
		for(var n=0;n<itemsElements.length;n++){
			 var pElement=itemsElements[n];
			 if(pElement.nodeName=='Data'){
				this.dataType= pElement.attributes.getNamedItem("Type").value;
				this.dataValue= pElement.firstChild.data;
			 }
		}
}
_p.toXML= function() {
	var str=[];
	str.push('\n <Cell Index="',this.index,'"');
	if(this.styleID!="") str.push(' StyleID="',this.styleID,'"');
	if(this.mergeAcross!=0) str.push(' MergeAcross="',this.mergeAcross,'"');
	if(this.mergeDown!=0) str.push(' MergeDown="',this.mergeDown,'"');
	if(this.arrayRange!="") str.push(' ArrayRange="',this.arrayRange,'"');
	if(this.formula!="") str.push(' Formula="',this.formula,'"');
	str.push('>');
	str.push('<Data Type="',this.dataType,'">');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.dataValue);
	str.push(']');
	str.push(']>');
	str.push('</Data>');
	str.push(' </Cell>');  
	return str.join('');
}
dev.report.model.XRange = function(id){
	this.id=id;
	this.type=0;
	this.startRow=0;
	this.startCol=0;
	this.endRow=0;
	this.endCol=0;
};
var _p = dev.report.model.XRange.prototype;

_p.init = function(rangeElement) {
		this.id= rangeElement.attributes.getNamedItem("Index").value;
		this.type= rangeElement.attributes.getNamedItem("type").value;
		this.startRow= rangeElement.attributes.getNamedItem("startRow").value;
		this.startCol= rangeElement.attributes.getNamedItem("startCol").value;
		this.endRow= rangeElement.attributes.getNamedItem("endRow").value;
		this.endCol= rangeElement.attributes.getNamedItem("endCol").value;
}   
_p.toXML= function() {
	var str=[];
	str.push('\n <Range Index="',this.id,'" type="',this.type,'" startRow="',this.startRow,'"');
	str.push(' startCol="',this.startCol,'"');
	str.push(' endRow="',this.endRow,'"');
	str.push(' endCol="',this.endCol,'"');
	str.push('/>');
	return str.join('');
}

dev.report.model.XPicture= function(id){
	this.id=id;
	this.location=null;
	this.offset=[];
	this.size=[];
	this.zindex=0;
	this.locked=false;
};

var _p = dev.report.model.XPicture.prototype;

_p.init = function(imageElement) {
		this.id= imageElement.attributes.getNamedItem("Index").value;
		this.locked= imageElement.attributes.getNamedItem("locked").value;
		this.zindex= imageElement.attributes.getNamedItem("zindex").value;
		this.location=imageElement.attributes.getNamedItem("location").value;
		this.offset.push(parseFloat(imageElement.attributes.getNamedItem("offsetX").value));
		this.offset.push(parseFloat(imageElement.attributes.getNamedItem("offsetY").value));
		this.size.push(parseFloat(imageElement.attributes.getNamedItem("sizeW").value));
		this.size.push(parseFloat(imageElement.attributes.getNamedItem("sizeH").value));
}   
_p.toXML= function() {
	var str=[];
	str.push('\n <Picture Index="',this.id,'" locked="',this.locked,'" zindex="',this.zindex,'"');
	str.push(' location="',this.location,'"');
	str.push(' offsetX="',this.offset[0],'"',' offsetY="',this.offset[1],'"');
	str.push(' sizeW="',this.size[0],'"',' sizeH="',this.size[1],'"');
	str.push('/>');
	return str.join('');
}


//====================================================基础对象定义===================================================

dev.report.model.XTitle = function() {
	this.band=null;
}
var _p = dev.report.model.XTitle.prototype;
_p.init = function(titleElements) {
	var titleEls=titleElements.childNodes;
	for(var k=0;k<titleEls.length;k++){
		  var titleElement=titleEls[k];
		  if(titleElement.nodeName=='band'){
			   this.band=new dev.report.model.XBand();
				this.band.init(titleElement);
		  }
	}
}  
_p.toXML = function() {
	var str=[];
	str.push('\n<title>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</title>');
	return str.join('');
}

dev.report.model.XDetail = function() {
	this.band=[];
}
var _p = dev.report.model.XDetail.prototype;
_p.init = function(detailElements) {
	var detailEls=detailElements.childNodes;
	for(var k=0;k<detailEls.length;k++){
		  var detailElement=detailEls[k];
		  if(detailElement.nodeName=='band'){
			  var bd=new dev.report.model.XBand();
			  bd.init(detailElement);
			  this.band.push(bd);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<detail>');
	for(var i=0;i<this.band.length;i++){
		 str.push(this.band[i].toXML());
	}
	str.push('\n</detail>');
	return str.join('');
}
dev.report.model.XColumnHeader = function() {
	this.band=null;
}
var _p = dev.report.model.XColumnHeader.prototype;
_p.init = function(columnElements) {
	var columnEles=columnElements.childNodes;
	for(var k=0;k<columnEles.length;k++){
		  var columnElement=columnEles[k];
		  if(columnElement.nodeName=='band'){
			   this.band=new dev.report.model.XBand();
			   this.band.init(columnElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<columnHeader>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</columnHeader>');
	return str.join('');
}
dev.report.model.XColumnFooter = function() {
	this.band=null;
}
var _p = dev.report.model.XColumnFooter.prototype;
_p.init = function(columnElements) {
	var columnEles=columnElements.childNodes;
	for(var k=0;k<columnEles.length;k++){
		  var columnElement=columnEles[k];
		  if(columnElement.nodeName=='band'){
			   this.band=new dev.report.model.XBand();
				this.band.init(columnElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<columnFooter>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</columnFooter>');
	return str.join('');
}
dev.report.model.XSummary = function() {
	this.band=null;
}
var _p = dev.report.model.XSummary.prototype;
_p.init = function(summaryElements) {
	var summaryEls=summaryElements.childNodes;
	for(var k=0;k<summaryEls.length;k++){
		  var summaryElement=summaryEls[k];
		  if(summaryElement.nodeName=='band'){
			   this.band=new dev.report.model.XBand();
				this.band.init(summaryElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<summary>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</summary>');
	return str.join('');
}
dev.report.model.XPageHeader = function() {
	this.band=new dev.report.model.XBand();
}
var _p = dev.report.model.XPageHeader.prototype;
_p.setBand= function(b){
	this.band=b;
}
_p.getBand= function(){
	return this.band;
}
_p.init = function(pageElement) {
	var pageElements=pageElement.childNodes;
	for(var k=0;k<pageElements.length;k++){
		  var pageElement=pageElements[k];
		  if(pageElement.nodeName=='band'){
			   this.band=new dev.report.model.XBand();
				this.band.init(pageElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<pageHeader>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</pageHeader>');
	return str.join('');
}
dev.report.model.XPageFooter = function() {
	this.band=new dev.report.model.XBand();
}
var _p = dev.report.model.XPageFooter.prototype;
_p.setBand= function(b){
	this.band=b;
}
_p.getBand= function(){
	return this.band;
}
_p.init = function(pageFooterElement) {
	var pageFooterElements=pageFooterElement.childNodes;
	for(var k=0;k<pageFooterElements.length;k++){
		  var pageFooterElement=pageFooterElements[k];
		  if(pageFooterElement.nodeName=='band'){
			   this.band=new dev.report.model.XBand();
				this.band.init(pageFooterElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<pageFooter>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</pageFooter>');
	return str.join('');
}

dev.report.model.XNoData = function() {
	this.band=null;
}
var _p = dev.report.model.XNoData.prototype;
_p.init = function(noDataElements) {
	if(noDataElements.nodeName=='noData'){
		var noDataEles=noDataElements.childNodes;
		for(var k=0;k<noDataEles.length;k++){
			  var noDataElement=noDataEles[k];
			  if(noDataElement.nodeName=='band'){
				   this.band=new dev.report.model.XBand();
				this.band.init(noDataElement);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<noData>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</noData>');
	return str.join('');
}
dev.report.model.XBackground = function() {
	this.band=null;
}
var _p = dev.report.model.XBackground.prototype;
_p.init = function(bgElements) {
	if(bgElements.nodeName=='background'){
		var bgEles=bgElements.childNodes;
		for(var k=0;k<bgEles.length;k++){
			  var bgElement=bgEles[k];
			  if(bgElement.nodeName=='band'){
				   this.band=new dev.report.model.XBand();
					this.band.init(bgElement);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<background>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</background>');
	return str.join('');
}
dev.report.model.XLastPageFooter = function() {
	this.band=null;
}
var _p = dev.report.model.XLastPageFooter.prototype;
_p.init = function(pageFooterElements) {
	if(pageFooterElements.nodeName=='lastPageFooter'){
		var pageFooterEles=pageFooterElements.childNodes;
		for(var k=0;k<pageFooterEles.length;k++){
			  var pageFooterElement=pageFooterEles[k];
			  if(pageFooterElement.nodeName=='band'){
				   this.band=new dev.report.model.XBand();
					this.band.init(bandElement);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<lastPageFooter>');
	if(this.band!= null){
		str.push(this.band.toXML());
	}
	str.push('\n</lastPageFooter>');
	return str.join('');
}


//====================================================基础属性对象定义：样式，分组、属性等================================================


dev.report.model.XProperty = function(name) {
	this.name = name;
	this.value = "";
}
var _p = dev.report.model.XProperty.prototype;
_p.init = function(propElements) {
	this.name = propElements.attributes.getNamedItem("name").value;
	if(propElements.attributes.getNamedItem("value")!= null){
		this.value = propElements.attributes.getNamedItem("value").value;
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<property ');
	str.push(' name="'+this.name+'"');
	if(this.value!=""){
		str.push(' value="'+this.value+'"');
	}
	str.push('></property>');
	return str.join('');
}

dev.report.model.XVariable = function(name) {
	this.name = name;

	this.class1= "java.lang.String";

	this.resetType = "Report";
	/*
		None:Variable is never initialized using the initial value expression and only holds the values obtained by evaluating its main expression.
		Report:Variable is initialized only once, at the beginning of the report.
		Page:Variable is initialized at the beginning of each page.
		Column:Variable is initialized at the beginning of each column.
		Group:Variable is initialized when the group specified by the <code>resetGroup</code> attribute changes.
	*/
	this.resetGroup = "";

	this.incrementType = "None";
	/*
		None:Variable is incremented with every record in the data source.
		Report:Variable is incremented only once, at the end of the report.
		Page:Variable is incremented at the end of each page.
		Column:Variable is incremented at the end of each column.
		Group:Variable is incremented when the group specified by the <code>incrementGroup</code> attribute changes.
	*/
	this.incrementGroup = "";
	
	this.calculation = "Nothing";
	/*
		Nothing:No calculations are performed.
		Count:Variable stores the number of the not null values encountered for the variable expression.
		DistinctCount:Variable stores the number of distinct not null values encountered for the variable expression.
		Sum:Variable stores the sum of the not null values encountered for the variable expression. Numeric variables only.
		Average:Variable stores the average of the not null values encountered for the variable expression. Numeric variables only.
		Lowest:Variable stores the lowest value encountered for the variable expression.
		Highest:Variable stores the highest value encountered for the variable expression.
		StandardDeviation:Variable stores the standard deviation of the not null values encountered for the variable expression. Numeric variables only.
		Variance:Variable stores the variance of the not null values encountered for the variable expression. Numeric variables only.
		System:Variable stores a system (custom) calculated value.
		First:Variable stores the first value encountered and ignores subsequent values.
	*/

	this.incrementerFactoryClass = "";
	/*
		The name of a class that implements the <code>net.sf.jasperreports.engine.fill.JRIncrementerFactory</code> 
		interface to use when creating the incrementer instance for this variable. 
		Incrementers are objects that implement the <code>net.sf.jasperreports.engine.fill.JRIncrementer</code> interface and 
		handle the incremental calculation performed on the variable's current value with every iteration in the data source.
	*/

	this.initialValueExpression = null;
	
	this.variableExpression = null;
}

var _p = dev.report.model.XVariable.prototype;

_p.init = function(variableElements) {
	this.name =variableElements.attributes.getNamedItem("name").value;	
	if(variableElements.attributes.getNamedItem("class")!=null){
		this.class1 = variableElements.attributes.getNamedItem("class").value;
	}
	if(variableElements.attributes.getNamedItem("resetType")!=null){
		this.resetType = variableElements.attributes.getNamedItem("resetType").value;
	}
	if(variableElements.attributes.getNamedItem("resetGroup")!=null){
		this.resetGroup = variableElements.attributes.getNamedItem("resetGroup").value;
	}
	if(variableElements.attributes.getNamedItem("incrementType")!=null){
		this.incrementType = variableElements.attributes.getNamedItem("incrementType").value;
	}
	if(variableElements.attributes.getNamedItem("incrementGroup")!=null){
		this.incrementGroup = variableElements.attributes.getNamedItem("incrementGroup").value;
	}
	if(variableElements.attributes.getNamedItem("calculation")!=null){
		this.calculation = variableElements.attributes.getNamedItem("calculation").value;
	}
	if(variableElements.attributes.getNamedItem("incrementerFactoryClass")!=null){
		this.incrementerFactoryClass = variableElements.attributes.getNamedItem("incrementerFactoryClass").value;
	}
	var variableEles=variableElements.childNodes;

	for(var k=0;k<variableEles.length;k++){
		  var variableElement=variableEles[k];
		  if(variableElement.nodeName=='variableExpression'){
			    this.variableExpression=new dev.report.model.XVariableExpression();
				this.variableExpression.init(variableElement);
		  }
		  if(variableElement.nodeName=='initialValueExpression'){
			   this.initialValueExpression=new dev.report.model.XInitialValueExpression();
			   this.initialValueExpression.init(variableElement);
		  }
	}
}

_p.toXML = function() {
	var str=[];
	str.push('\n<variable ');
	str.push(' name="'+this.name+'"');
	str.push(' class="'+this.class1+'"');	

	if(this.resetType!=''){
		str.push(' resetType="'+this.resetType+'"');
	}
	if(this.resetGroup!=''){
		str.push(' resetGroup="'+this.resetGroup+'"');
	}
	if(this.incrementType!=''){
		str.push(' incrementType="'+this.incrementType+'"');
	}
	if(this.incrementGroup!=''){
		str.push(' incrementGroup="'+this.incrementGroup+'"');
	}
	if(this.calculation!=''){
		str.push(' calculation="'+this.calculation+'"');
	}
	if(this.incrementerFactoryClass!=''){
		str.push(' incrementerFactoryClass="'+this.incrementerFactoryClass+'"');
	}
	str.push('>');
	if(this.variableExpression!=null){
			str.push(this.variableExpression.toXML());
	}
	if(this.initialValueExpression!=null){
			str.push(this.initialValueExpression.toXML());
	}
	str.push('\n</variable>');
	return str.join('');
}

dev.report.model.XVariableExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XVariableExpression.prototype;
_p.init = function(varExpressionElements) {
	this.expression= varExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n<variableExpression>');
	str.push(this.expression);
	str.push('</variableExpression>');
	return str.join('');
}

dev.report.model.XInitialValueExpression = function() {
	this.expression=null;
}

var _p = dev.report.model.XInitialValueExpression.prototype;

_p.init = function(initValueExpressionElements) {
	this.expression= initValueExpressionElements.firstChild.data;
}

_p.toXML = function() {
	var str=[];
	str.push('\n<initialValueExpression>');
		str.push(this.expression);
	str.push('</initialValueExpression>');
	return str.join('');
}

dev.report.model.XScriptlet = function(name,class1) {
	this.name = name;
	this.class1 = class1;
	this.properties={};
	this.scriptletDescription = null;
}
var _p = dev.report.model.XScriptlet.prototype;
_p.addProperty=function(prop){
	var _prop=this.properties;
	_prop[prop.name]=prop;
	this.properties=_prop;
}
_p.removeProperty=function(name) {
	delete this.properties[name];
}
_p.getProperty=function(name) {
    return this.properties[name];
}
_p.init = function(scriptletElements) {
		this.name = scriptletElements.attributes.getNamedItem("name").value;
		if(scriptletElements.attributes.getNamedItem("class")!=null){
			this.class1 = scriptletElements.attributes.getNamedItem("class").value;
		}
		var scriptletEls=scriptletElements.childNodes;
		for(var k=0;k<scriptletEls.length;k++){
			  var scriptletElement=scriptletEls[k];
			  if(scriptletElement.nodeName=='scriptletDescription'){
				  this.scriptletDescription=new dev.report.model.XScriptletDescription();
				  this.scriptletDescription.init(scriptletElement);
			  }
			  if(scriptletElement.nodeName=='property'){
				 var prop=new dev.report.model.XProperty();
				prop.init(scriptletElement);
				this.addProperty(prop);
			  }
		}
}

_p.toXML = function() {
	var str=[];
	str.push('\n<scriptlet ');
	str.push(' name="'+this.name+'"');
	str.push(' class="'+this.class1+'"');
	str.push('>');
	if(this.scriptletDescription!= null){
		str.push(this.scriptletDescription.toXML());
	}
	for(var i in this.properties){
		this.properties[name].toXML();
	}
	str.push('\n</scriptlet>');
	return str.join('');
}

dev.report.model.XScriptletDescription = function() {
	this.expression=null;
}

var _p = dev.report.model.XScriptletDescription.prototype;

_p.init = function(scriptletDesElements) {
	this.expression=scriptletDesElements.firstChild.data;
}

_p.toXML = function() {
	var str=[];
	str.push('\n<scriptletDescription> ');
	str.push(this.expression);
	str.push('</scriptletDescription>');
	return str.join('');
}
dev.report.model.XTemplate = function() {
	this.class1 = "java.lang.String";
}
var _p = dev.report.model.XTemplate.prototype;
_p.init = function(temElements) {
	if(temElements.attributes.getNamedItem("class")!=null){
		this.class1 = temElements.attributes.getNamedItem("class");
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<template ');
		str.push(' class="'+this.class1+'"');
	str.push('></template>');
	return str.join('');
}
dev.report.model.XImprot = function(value) {
	this.value = value;
}
var _p = dev.report.model.XImprot.prototype;
_p.init = function(impElements) {
	 this.value = impElements.attributes.getNamedItem("value");
}
_p.toXML = function() {
	var str=[];
	str.push('\n<import ');
		str.push(' value="'+this.value+'"');
	str.push('></import>');
	return str.join('');
}
dev.report.model.XGroup = function(name) {

	this.name = name;

	this.isStartNewColumn = "false";
	/*
	 * true:Group header section is printed always on a new column.
	 * false:Group header section is printed on the current column, if there is enough space.
	 */
	this.isStartNewPage = "false";
	/*
	 * true:Group header section is printed always on a new page.
	 * false:Group header section is printed on the current page, if there is enough space.
	 */
	 this.isResetPageNumber = "false";
	/*
	 * true:Group header section is printed always on a new page and the page number is reinitialized.
	 * false:Group header section is printed accordingly with the <code>isStartNewPage</code> attribute and the page number is not affected.
	 */
	 this.isReprintHeaderOnEachPage = "false";
	/*
	 * true:Group header section is reprinted always at the beginning of a new page.
	 * false:Group header section is not reprinted at the beginning of a new page.
	 */

	this.minHeightToStartNewPage = 0;
	/*
	 *Minimum amount of vertically space needed at the bottom of the column in order to place the group header on the current column.
	 */

	this.footerPosition = "Normal";
	/*
	 * Normal:The group footer section is rendered at normal position, just right after the last detail or right after the nested group footer section.
	 * StackAtBottom:The group footer section is rendered at bottom of the current page, provided that an inner group having this value would force outer group footers to stack at the bottom of the current page, regardless of the outer group footer setting.
     * ForceAtBottom:The group footer section is rendered at bottom of the current page, provided that an inner group having this value would render its footer right at the bottom of the page, forcing the outer group footers to render on the next page.
	 * CollateAtBottom:he group footer section is rendered at bottom of the current page, provided that the outer footers have a similar footer display option to render at the page bottom as well, because otherwise, they cannot be forced to change their behavior in any way.
	 */

	this.keepTogether = "false";
	/*
	 * true:Group can split across two separate pages/column at any moment.
	 * false:Group is moved onto a new new page/column, before being split.
	 */

	this.groupExpression= null;

	this.groupHeader= null;

	this.groupFooter= null;
}

var _p = dev.report.model.XGroup.prototype;
_p.init = function(groupElements) {
	 if(groupElements.nodeName=='group'){	
		this.name = groupElements.attributes.getNamedItem("name").value;
		if(groupElements.attributes.getNamedItem("isStartNewColumn")!=null){
			this.isStartNewColumn = groupElements.attributes.getNamedItem("isStartNewColumn").value;
		}
		if(groupElements.attributes.getNamedItem("isStartNewPage")!=null){
			this.isStartNewPage = groupElements.attributes.getNamedItem("isStartNewPage").value;
		}
		if(groupElements.attributes.getNamedItem("isResetPageNumber")!=null){
			this.isResetPageNumber = groupElements.attributes.getNamedItem("isResetPageNumber").value;
		}
		if(groupElements.attributes.getNamedItem("isReprintHeaderOnEachPage")!=null){
			this.isReprintHeaderOnEachPage = groupElements.attributes.getNamedItem("isReprintHeaderOnEachPage").value;
		}
		if(groupElements.attributes.getNamedItem("minHeightToStartNewPage")!=null){
			this.minHeightToStartNewPage = groupElements.attributes.getNamedItem("minHeightToStartNewPage").value;
		}
		//this.minHeightToStartNewPage = groupElements.attributes.getNamedItem("minHeightToStartNewPage").value;
		if(groupElements.attributes.getNamedItem("footerPosition")!=null){
			this.footerPosition = groupElements.attributes.getNamedItem("footerPosition").value;
		}
		if(groupElements.attributes.getNamedItem("keepTogether")!=null){
			this.keepTogether = groupElements.attributes.getNamedItem("keepTogether").value;
		}
		var groupEles=groupElements.childNodes;
		for(var k=0;k<groupEles.length;k++){
			  var groupElement=groupEles[k];
			  if(groupElement.nodeName=='groupExpression'){
				 this.groupExpression=new dev.report.model.XGroupExpression();
				  this.groupExpression.init(groupElement);
			  }
			  if(groupElement.nodeName=='groupHeader'){
					this.groupHeader=new dev.report.model.XGroupHeader();
					this.groupHeader.init(groupElement);
			  }
			  if(groupElement.nodeName=='groupFooter'){
					this.groupFooter=new dev.report.model.XGroupFooter();
					this.groupFooter.init(groupElement);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<group ');
	
	str.push(' name="'+this.name+'"');
	if(this.isStartNewColumn!='false'){
		str.push(' isStartNewColumn="'+this.isStartNewColumn+'"');
	}
	if(this.isStartNewPage!='false'){
		str.push(' isStartNewPage="'+this.isStartNewPage+'"');
	}
	if(this.isResetPageNumber!='false'){
		str.push(' isResetPageNumber="'+this.isResetPageNumber+'"');
	}
	if(this.isReprintHeaderOnEachPage!='false'){
		str.push(' isReprintHeaderOnEachPage="'+this.isReprintHeaderOnEachPage+'"');
	}
	if(this.minHeightToStartNewPage!=0){
		str.push(' minHeightToStartNewPage="'+this.minHeightToStartNewPage+'"');
	}
	/*if(this.footerPosition!=''){
		str.push(' footerPosition="'+this.footerPosition+'"');
	}*/
	if(this.keepTogether!='false'){
		str.push(' keepTogether="'+this.keepTogether+'"');
	}
	str.push('>');

	if(this.groupExpression!=null){
			str.push(this.groupExpression.toXML());
	}
	if(this.groupHeader!=null){
			str.push(this.groupHeader.toXML());
	}
	if(this.groupFooter!=null){
			str.push(this.groupFooter.toXML());
	}
	str.push('\n</group>');
	return str.join('');
}
dev.report.model.XGroupHeader = function() {
	this.band=[];
}

var _p = dev.report.model.XGroupHeader.prototype;
_p.init = function(gpHeaderElements) {
	if(gpHeaderElements.nodeName=='groupHeader'){
		var gpHeaderEls=gpHeaderElements.childNodes;
		for(var k=0;k<gpHeaderEls.length;k++){
			  var gpHeaderElement=gpHeaderEls[k];
			  if(gpHeaderElement.nodeName=='band'){
				  var bd=new dev.report.model.XBand();
				  bd.init(gpHeaderElement);
				  this.band.push(bd);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<groupHeader ');
	str.push('>\n');
	for(var i=0;i<this.band.length;i++){
		 str.push(this.band[i].toXML());
	}
	str.push('\n</groupHeader>');
	return str.join('');
}
dev.report.model.XGroupFooter = function() {
	this.band=[];
}
var _p = dev.report.model.XGroupFooter.prototype;
_p.init = function(gpFooterElements) {
	if(gpFooterElements.nodeName=='groupFooter'){
		var gpFooterEls=gpFooterElements.childNodes;
		for(var k=0;k<gpFooterEls.length;k++){
			  var gpFooterElement=gpFooterEls[k];
			  if(gpFooterElement.nodeName=='band'){
				  var bd=new dev.report.model.XBand();
				  bd.init(gpFooterElement);
				  this.band.push(bd);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<groupFooter ');
	str.push('>');
	for(var i=0;i<this.band.length;i++){
		 str.push(this.band[i].toXML());
	}
	str.push('\n</groupFooter>');
	return str.join('');
}
dev.report.model.XGroupExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XGroupExpression.prototype;
_p.init = function(gpExpressionElements) {
	this.expression= gpExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n<groupExpression>');
	str.push(this.expression);
	str.push('</groupExpression>');
	return str.join('');
}

dev.report.model.XFont = function() {

	this.id = "";

	this.fontName = "";

	this.size = "";
	
	this.isBold = "";
	
	this.isItalic = "";
	
	this.isUnderline = "";

	this.isStrikeThrough = "";

	this.pdfFontName = "";

	this.pdfEncoding = "";
	
	this.isPdfEmbedded = "true";

}

var _p = dev.report.model.XFont.prototype;

_p.init = function(Elements) {
		if(Elements.attributes.getNamedItem("id")!=null){
			this.id = Elements.attributes.getNamedItem("id").value;
		}
		if(Elements.attributes.getNamedItem("fontName")!=null){
			this.fontName = Elements.attributes.getNamedItem("fontName").value;
		}
		if(Elements.attributes.getNamedItem("size")!=null){
			this.size = Elements.attributes.getNamedItem("size").value;
		}
		if(Elements.attributes.getNamedItem("isBold")!=null){
			this.isBold = Elements.attributes.getNamedItem("isBold").value;
		}
		if(Elements.attributes.getNamedItem("isItalic")!=null){
			this.isItalic = Elements.attributes.getNamedItem("isItalic").value;
		}
		if(Elements.attributes.getNamedItem("isUnderline")!=null){
			this.isUnderline = Elements.attributes.getNamedItem("isUnderline").value;
		}
		if(Elements.attributes.getNamedItem("isStrikeThrough")!=null){
			this.isStrikeThrough = Elements.attributes.getNamedItem("isStrikeThrough").value;
		}
		if(Elements.attributes.getNamedItem("pdfFontName")!=null){
			this.pdfFontName = Elements.attributes.getNamedItem("pdfFontName").value;
		}
		if(Elements.attributes.getNamedItem("pdfEncoding")!=null){
			this.pdfEncoding = Elements.attributes.getNamedItem("pdfEncoding").value;
		}
		if(Elements.attributes.getNamedItem("isPdfEmbedded")!=null){
			this.isPdfEmbedded = Elements.attributes.getNamedItem("isPdfEmbedded").value;
		}	
}

_p.toXML = function() {
	var str=[];
	str.push('\n<font ');
	if(this.id!=""){
		str.push(' id="'+this.id+'"');
	}
	if(this.fontName!=""){
		str.push(' fontName="'+this.fontName+'"');
	}
	if(this.size!=0){
		str.push(' size="'+this.size+'"');
	}
	if(this.isBold=="true"){
		str.push(' isBold="'+this.isBold+'"');
	}
	if(this.isItalic=="true"){
		str.push(' isItalic="'+this.isItalic+'"');
	}
	if(this.isUnderline=="true"){
		str.push(' isUnderline="'+this.isUnderline+'"');
	}
	if(this.isStrikeThrough=="true"){
		str.push(' isStrikeThrough="'+this.isStrikeThrough+'"');
	}
	if(this.pdfFontName!=""){
		str.push(' pdfFontName="'+this.pdfFontName+'"');
	}
	if(this.pdfEncoding!=""){
		str.push(' pdfEncoding="'+this.pdfEncoding+'"');
	}
	if(this.isPdfEmbedded=="true"){
		str.push(' isPdfEmbedded="'+this.isPdfEmbedded+'"');
	}
	str.push('>');

	str.push('</font>');
	return str.join('');
}

dev.report.model.XStyle = function() {

	this.name = "";
	
	this.isDefault = "";

	this.style = "";

	this.mode = "Opaque";

	this.forecolor = "";

	this.backcolor = "";

	this.pen1 = "None";

	this.fill = "Solid";

	this.radius = "";

	this.scaleImage = "Clip";

	this.hAlign = "Left";

	this.vAlign = "Middle";

	this.border = "None";
	
	this.borderColor = "";

	this.padding = "";

	this.topBorder = "None";

	this.topBorderColor = "";

	this.topPadding = "";

	this.leftBorder = "None";

	this.leftBorderColor = "";

	this.leftPadding = "";

	this.bottomBorder = "None";

	this.bottomBorderColor = "";

	this.bottomPadding = "";

	this.rightBorder = "None";

	this.rightBorderColor = "";

	this.rightPadding = "";

	this.rotation = "None";

	this.isStyledText = "";

	this.markup = "";

	this.fontName = "";

	this.fontSize = "";

	this.isBold = false;

	this.isItalic = false;

	this.isUnderline = false;

	this.isStrikeThrough = false;

	this.pdfFontName = "MHei-Medium";

	this.pdfEncoding = "UniCNS-UCS2-H";

	this.isPdfEmbedded = "true";

	this.pattern = "";

	this.isBlankWhenNull = "";

	this.pen=null;

	this.box=null;

	this.paragraph=null;

	this.conditionalStyle=[];
}

var _p = dev.report.model.XStyle.prototype;

_p.clone = function(){
   var x=new dev.report.model.XStyle();
   x.isDefault=this.isDefault;
   x.style=this.style;
   x.mode=this.mode;
   x.forecolor=this.forecolor;
   x.backcolor=this.backcolor;
   x.pen1=this.pen1;
   x.fill=this.fill;
   x.radius=this.radius;
   x.scaleImage=this.scaleImage;
   x.hAlign=this.hAlign;
   x.vAlign=this.vAlign;
   x.border=this.border;
   x.borderColor=this.borderColor;
   x.padding=this.padding;
   x.topBorder=this.topBorder;
   x.topBorderColor=this.topBorderColor;
   x.topPadding=this.topPadding;
   x.leftBorder=this.leftBorder;
   x.leftBorderColor=this.leftBorderColor;
   x.leftPadding=this.leftPadding;
   x.bottomBorder=this.bottomBorder;
   x.bottomBorderColor=this.bottomBorderColor;
   x.bottomPadding=this.bottomPadding;
   x.rightBorder=this.rightBorder;
   x.rightBorderColor=this.rightBorderColor;
   x.rightPadding=this.rightPadding;
   x.rotation=this.rotation;
   x.isStyledText=this.isStyledText;
   x.markup=this.markup;
   x.fontName=this.fontName;
   x.fontSize=this.fontSize; 
   x.isItalic=this.isItalic;
   x.isBold=this.isBold;
   x.isUnderline=this.isUnderline;
   x.isStrikeThrough=this.isStrikeThrough;
   x.pdfFontName=this.pdfFontName;
   x.pdfEncoding=this.pdfEncoding;
   x.isPdfEmbedded=this.isPdfEmbedded;
   x.pattern=this.pattern;
   x.isBlankWhenNull=this.isBlankWhenNull;
	if(this.box!=null){
			x.box=new dev.report.model.XBox();
			x.box.border=this.box.border;
			x.box.borderColor=this.box.borderColor;
			x.box.padding=this.box.padding;
			if(this.box.topPen!=null){
				x.box.topPen=new dev.report.model.XTopPen();
				x.box.topPen.lineWidth=this.box.topPen.lineWidth;
				x.box.topPen.lineStyle=this.box.topPen.lineStyle;
				x.box.topPen.lineColor=this.box.topPen.lineColor;
			}	
			if(this.box.leftPen!=null){
				x.box.leftPen=new dev.report.model.XLeftPen();
				x.box.leftPen.lineWidth=this.box.leftPen.lineWidth;
				x.box.leftPen.lineStyle=this.box.leftPen.lineStyle;
				x.box.leftPen.lineColor=this.box.leftPen.lineColor;
			}
			if(this.box.bottomPen!=null){
				x.box.bottomPen=new dev.report.model.XBottomPen();
				x.box.bottomPen.lineWidth=this.box.bottomPen.lineWidth;
				x.box.bottomPen.lineStyle=this.box.bottomPen.lineStyle;
				x.box.bottomPen.lineColor=this.box.bottomPen.lineColor;
			}
			if(this.box.rightPen!=null){
				x.box.rightPen=new dev.report.model.XRightPen();
				x.box.rightPen.lineWidth=this.box.rightPen.lineWidth;
				x.box.rightPen.lineStyle=this.box.rightPen.lineStyle;
				x.box.rightPen.lineColor=this.box.rightPen.lineColor;
			}
			if(this.box.pen!=null){
				x.box.pen=new dev.report.model.XPen();
				x.box.pen.lineWidth=this.box.pen.lineWidth;
				x.box.pen.lineStyle=this.box.pen.lineStyle;
				x.box.pen.lineColor=this.box.pen.lineColor;
			}
	} 
	if(this.pen!=null){
		x.pen!=new dev.report.model.XPen();
		x.pen.lineWidth=this.pen.lineWidth;
		x.pen.lineStyle=this.pen.lineStyle;
		x.pen.lineColor=this.pen.lineColor;
	}
	return x;
 }
_p.equals = function(x){
   var same=this.isDefault==x.isDefault&&this.style==x.style&&this.mode==x.mode&&this.forecolor==x.forecolor
			&&this.backcolor==x.backcolor&&this.pen1==x.pen1&&this.fill==x.fill&&this.radius ==x.radius
			&&this.scaleImage ==x.scaleImage&&this.hAlign ==x.hAlign&&this.vAlign ==x.vAlign&&this.border ==x.border
			&&this.borderColor ==x.borderColor&&this.padding ==x.padding&&this.topBorder ==x.topBorder&&this.topBorderColor==x.topBorderColor
			&&this.topPadding ==x.topPadding&&this.leftBorder ==x.leftBorder&&this.leftBorderColor ==x.leftBorderColor&&this.leftPadding ==x.leftPadding
			&&this.bottomBorder ==x.bottomBorder&&this.bottomBorderColor ==x.bottomBorderColor&&this.bottomPadding ==x.bottomPadding&&this.rightBorder ==x.rightBorder
			&&this.rightBorderColor ==x.rightBorderColor&&this.rightPadding ==x.rightPadding&&this.rotation ==x.rotation
			&&this.isStyledText ==x.isStyledText&&this.markup ==x.markup&&this.fontName ==x.fontName&&this.fontSize ==x.fontSize
		    &&this.isBold ==x.isBold&&this.isItalic ==x.isItalic&&this.isUnderline ==x.isUnderline&&this.isStrikeThrough ==x.isStrikeThrough
		    &&this.pdfFontName ==x.pdfFontName&&this.pdfEncoding ==x.pdfEncoding&&this.isPdfEmbedded ==x.isPdfEmbedded&&this.pattern ==x.pattern
		    &&this.isBlankWhenNull ==x.isBlankWhenNull
			if(this.box!=null&&x.box!=null){
				 same=same&&this.box.border ==x.box.border&&this.box.borderColor ==x.box.borderColor&&this.box.padding ==x.box.padding
				if(this.box.topPen!=null&&x.box.topPen!=null){
					same=same&&this.box.topPen.lineWidth ==x.box.topPen.lineWidth&&this.box.topPen.lineStyle ==x.box.topPen.lineStyle&&this.box.topPen.lineColor ==x.box.topPen.lineColor;
				}else if(this.box.topPen==null&&x.box.topPen==null){
				    same=same&&true;
				}else{
				    same=same&&false;
				}
				
				if(this.box.leftPen!=null&&x.box.leftPen!=null){
					same=same&&this.box.leftPen.lineWidth ==x.box.leftPen.lineWidth&&this.box.leftPen.lineStyle ==x.box.leftPen.lineStyle&&this.box.leftPen.lineColor ==x.box.leftPen.lineColor;
				}else if(this.box.leftPen==null&&x.box.leftPen==null){
				    same=same&&true;
				}else{
					same=same&&false;
				}
				if(this.box.bottomPen!=null&&x.box.bottomPen!=null){
					same=same&&this.box.bottomPen.lineWidth ==x.box.bottomPen.lineWidth&&this.box.bottomPen.lineStyle ==x.box.bottomPen.lineStyle&&this.box.bottomPen.lineColor ==x.box.bottomPen.lineColor;
				}else if(this.box.bottomPen==null&&x.box.bottomPen==null){
				    same=same&&true;
				}else{
				  same=same&&false;
				}
				if(this.box.rightPen!=null&&x.box.rightPen!=null){
					same=same&&this.box.rightPen.lineWidth ==x.box.rightPen.lineWidth&&this.box.rightPen.lineStyle ==x.box.rightPen.lineStyle&&this.box.rightPen.lineColor ==x.box.rightPen.lineColor;
				}else if(this.box.rightPen==null&&x.box.rightPen==null){
				    same=same&&true;
				}else{
				  same=same&&false;
				}
				if(this.box.pen!=null&&x.box.pen!=null){
					same=same&&this.box.pen.lineWidth ==x.box.pen.lineWidth&&this.box.pen.lineStyle ==x.box.pen.lineStyle&&this.box.pen.lineColor ==x.box.pen.lineColor;
				}else if(this.box.pen==null&&x.box.pen==null){
				    same=same&&true;
				}else{
					same=same&&false;
				}
			}else if(this.box==null&&x.box==null){
				same=same&&true;
			}else{
			    same=same&&false;
			}  
			if(this.pen!=null&&x.pen!=null){
				if(this.box.topPen!=null&&x.box.topPen!=null){
					same=same&&this.pen.lineWidth ==x.pen.lineWidth&&this.pen.lineWidth ==x.pen.lineWidth&&this.pen.lineWidth ==x.pen.lineWidth;
				}else if(this.box.topPen==null&&x.box.topPen==null){
				    same=same&&true;
				}else{
				  same=same&&false;  
				}
			}else if(this.pen==null&&x.pen==null){
				    same=same&&true;
			}else{
			  same=same&&false;
			}
			return same;
 }

_p.init = function(styleElements) {
		if(styleElements.attributes.getNamedItem("name")!=null){
			this.name = styleElements.attributes.getNamedItem("name").value;
		}
		if(styleElements.attributes.getNamedItem("isDefault")!=null){
			this.isDefault = styleElements.attributes.getNamedItem("isDefault").value;
		}
		if(styleElements.attributes.getNamedItem("style")!=null){
			this.style = styleElements.attributes.getNamedItem("style").value;
		}
		if(styleElements.attributes.getNamedItem("mode")!=null){
			this.mode = styleElements.attributes.getNamedItem("mode").value;
		}
		if(styleElements.attributes.getNamedItem("forecolor")!=null){
			this.forecolor = styleElements.attributes.getNamedItem("forecolor").value;
		}

		if(styleElements.attributes.getNamedItem("backcolor")!=null){
			this.backcolor = styleElements.attributes.getNamedItem("backcolor").value;
		}
		
		if(styleElements.attributes.getNamedItem("pen")!=null){
			this.pen1 = styleElements.attributes.getNamedItem("pen").value;
		}
		if(styleElements.attributes.getNamedItem("fill")!=null){
			this.fill = styleElements.attributes.getNamedItem("fill").value;
		}
		if(styleElements.attributes.getNamedItem("radius")!=null){
			this.radius = styleElements.attributes.getNamedItem("radius").value;
		}
		if(styleElements.attributes.getNamedItem("scaleImage")!=null){
			this.scaleImage = styleElements.attributes.getNamedItem("scaleImage").value;
		}
		if(styleElements.attributes.getNamedItem("hAlign")!=null){
			this.hAlign = styleElements.attributes.getNamedItem("hAlign").value;
		}
		if(styleElements.attributes.getNamedItem("vAlign")!=null){
			this.vAlign = styleElements.attributes.getNamedItem("vAlign").value;
		}
		if(styleElements.attributes.getNamedItem("border")!=null){
			this.border = styleElements.attributes.getNamedItem("border").value;
		}
		if(styleElements.attributes.getNamedItem("borderColor")!=null){
			this.borderColor = styleElements.attributes.getNamedItem("borderColor").value;
		}
		if(styleElements.attributes.getNamedItem("padding")!=null){
			this.padding = styleElements.attributes.getNamedItem("padding").value;
		}
		if(styleElements.attributes.getNamedItem("topBorder")!=null){
			this.topBorder = styleElements.attributes.getNamedItem("topBorder").value;
		}
		if(styleElements.attributes.getNamedItem("topBorderColor")!=null){
			this.topBorderColor = styleElements.attributes.getNamedItem("topBorderColor").value;
		}
		if(styleElements.attributes.getNamedItem("topPadding")!=null){
			this.topPadding = styleElements.attributes.getNamedItem("topPadding").value;
		}
		if(styleElements.attributes.getNamedItem("leftBorder")!=null){
			this.leftBorder = styleElements.attributes.getNamedItem("leftBorder").value;
		}
		if(styleElements.attributes.getNamedItem("leftBorderColor")!=null){
			this.leftBorderColor = styleElements.attributes.getNamedItem("leftBorderColor").value;
		}
		if(styleElements.attributes.getNamedItem("leftPadding")!=null){
			this.leftPadding = styleElements.attributes.getNamedItem("leftPadding").value;
		}
		if(styleElements.attributes.getNamedItem("bottomBorder")!=null){
			this.bottomBorder = styleElements.attributes.getNamedItem("bottomBorder").value;
		}
		if(styleElements.attributes.getNamedItem("bottomBorderColor")!=null){
			this.bottomBorderColor = styleElements.attributes.getNamedItem("bottomBorderColor").value;
		}
		if(styleElements.attributes.getNamedItem("bottomPadding")!=null){
			this.bottomPadding = styleElements.attributes.getNamedItem("bottomPadding").value;
		}
		if(styleElements.attributes.getNamedItem("rightBorder")!=null){
			this.rightBorder = styleElements.attributes.getNamedItem("rightBorder").value;
		}
		if(styleElements.attributes.getNamedItem("rightBorderColor")!=null){
			this.rightBorderColor = styleElements.attributes.getNamedItem("rightBorderColor").value;
		}
		if(styleElements.attributes.getNamedItem("rightPadding")!=null){
			this.rightPadding = styleElements.attributes.getNamedItem("rightPadding").value;
		}
		if(styleElements.attributes.getNamedItem("rotation")!=null){
			this.rotation = styleElements.attributes.getNamedItem("rotation").value;
		}
		if(styleElements.attributes.getNamedItem("isStyledText")!=null){
			this.isStyledText = styleElements.attributes.getNamedItem("isStyledText").value;
		}
		if(styleElements.attributes.getNamedItem("markup")!=null){
			this.markup = styleElements.attributes.getNamedItem("markup").value;
		}
		if(styleElements.attributes.getNamedItem("fontName")!=null){
			this.fontName = styleElements.attributes.getNamedItem("fontName").value;
		}
		if(styleElements.attributes.getNamedItem("fontSize")!=null){
			this.fontSize = styleElements.attributes.getNamedItem("fontSize").value+'pt';
		}
		if(styleElements.attributes.getNamedItem("isBold")!=null){
			this.isBold = styleElements.attributes.getNamedItem("isBold").value;
		}
		if(styleElements.attributes.getNamedItem("isItalic")!=null){
			this.isItalic = styleElements.attributes.getNamedItem("isItalic").value;
		}
		if(styleElements.attributes.getNamedItem("isUnderline")!=null){
			this.isUnderline = styleElements.attributes.getNamedItem("isUnderline").value;
		}
		if(styleElements.attributes.getNamedItem("isStrikeThrough")!=null){
			this.isStrikeThrough = styleElements.attributes.getNamedItem("isStrikeThrough").value;
		}
		if(styleElements.attributes.getNamedItem("pdfFontName")!=null){
			this.pdfFontName = styleElements.attributes.getNamedItem("pdfFontName").value;
		}
		if(styleElements.attributes.getNamedItem("pdfEncoding")!=null){
			this.pdfEncoding = styleElements.attributes.getNamedItem("pdfEncoding").value;
		}
		if(styleElements.attributes.getNamedItem("isPdfEmbedded")!=null){
			this.isPdfEmbedded = styleElements.attributes.getNamedItem("isPdfEmbedded").value;
		}
		if(styleElements.attributes.getNamedItem("pattern")!=null){
			this.pattern = styleElements.attributes.getNamedItem("pattern").value;
		}
		if(styleElements.attributes.getNamedItem("isBlankWhenNull")!=null){
			this.isBlankWhenNull = styleElements.attributes.getNamedItem("isBlankWhenNull").value;
		}

		var subItems=styleElements.childNodes;

		for(var k=0;k<subItems.length;k++){
			  var styleElement=subItems[k];

			  if(styleElement.nodeName=='pen'){
				  this.pen=new dev.report.model.XPen();
				  this.pen.init(styleElement);
			  }
			  if(styleElement.nodeName=='box'){
				  this.box=new dev.report.model.XBox();
				  this.box.init(styleElement);
			  }
			  if(styleElement.nodeName=='paragraph'){
				  this.paragraph=new dev.report.model.XParagraph();
				  this.paragraph.init(styleElement);
			  }
			  if(styleElement.nodeName=='conditionalStyle'){
				  var conditionalStyles=new dev.report.model.XConditionalStyle();
				  conditionalStyles.init(styleElement);
				  this.conditionalStyle.push(conditionalStyles);
			  }
		}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<style ');
	if(this.name!=""){
		str.push(' name="'+this.name+'"');
	}
	if(this.isDefault!="false"&&this.isDefault!=""){
		str.push(' isDefault="'+this.isDefault+'"');
	}
	if(this.style!=""){
		str.push(' style="'+this.style+'"');
	}
	if(this.mode!=""){
		str.push(' mode="'+this.mode+'"');
	}
	if(this.forecolor!=""){
		str.push(' forecolor="'+this.forecolor+'"');
	}
	if(this.backcolor!=""){
		str.push(' backcolor="'+this.backcolor+'"');
	}
	if(this.pen1!=""&&this.pen1!="None"){
		str.push(' pen="'+this.pen1+'"');
	}
	if(this.fill!=""){
		str.push(' fill="'+this.fill+'"');
	}
	if(this.radius!=""){
		str.push(' radius="'+this.radius+'"');
	}
	if(this.scaleImage!=""){
		str.push(' scaleImage="'+this.scaleImage+'"');
	}
	if(this.hAlign!=""){
		str.push(' hAlign="'+this.hAlign+'"');
	}
	if(this.vAlign!=""){
		str.push(' vAlign="'+this.vAlign+'"');
	}
	if(this.border!=""&&this.pen1!="None"){
		str.push(' border="'+this.border+'"');
	}
	if(this.borderColor!=""){
		str.push(' borderColor="'+this.borderColor+'"');
	}
	if(this.padding!=""){
		str.push(' padding="'+this.padding+'"');
	}
	if(this.topBorder!=""&&this.topBorder!="None"){
		str.push(' topBorder="'+this.topBorder+'"');
	}
	if(this.topBorderColor!=""){
		str.push(' topBorderColor="'+this.topBorderColor+'"');
	}
	if(this.topPadding!=""){
		str.push(' topPadding="'+this.topPadding+'"');
	}
	if(this.leftBorder!=""&&this.leftBorder!="None"){
		str.push(' leftBorder="'+this.leftBorder+'"');
	}
	if(this.leftBorderColor!=""){
		str.push(' leftBorderColor="'+this.leftBorderColor+'"');
	}
	if(this.leftPadding!=""){
		str.push(' leftPadding="'+this.leftPadding+'"');
	}
	if(this.bottomBorder!=""&&this.bottomBorder!="None"){
		str.push(' bottomBorder="'+this.bottomBorder+'"');
	}
	if(this.bottomBorderColor!=""){
		str.push(' bottomBorderColor="'+this.bottomBorderColor+'"');
	}
	if(this.bottomPadding!=""){
		str.push(' bottomPadding="'+this.bottomPadding+'"');
	}
	if(this.rightBorder!=""&&this.rightBorder!="None"){
		str.push(' rightBorder="'+this.rightBorder+'"');
	}
	if(this.rightBorderColor!=""){
		str.push(' rightBorderColor="'+this.rightBorderColor+'"');
	}
	if(this.rightPadding!=""){
		str.push(' rightPadding="'+this.rightPadding+'"');
	}
	if(this.rotation!=""&&this.rotation!="None"){
		str.push(' rotation="'+this.rotation+'"');
	}
	if(this.isStyledText!=false&&this.isStyledText!=""){
		str.push(' isStyledText="'+this.isStyledText+'"');
	}
	if(this.markup!=""){
		str.push(' markup="'+this.markup+'"');
	}
	if(this.fontName!=""){
		str.push(' fontName="'+this.fontName+'"');
	}
	if(this.fontSize!=""){
		str.push(' fontSize="'+this.fontSize.replace('pt','')+'"');
	}
	if(this.isBold!=false&&this.isBold!=""){
		str.push(' isBold="'+this.isBold+'"');
	}
	if(this.isItalic!=false&&this.isItalic!=""){
		str.push(' isItalic="'+this.isItalic+'"');
	}
	if(this.isUnderline!=false&&this.isUnderline!=""){
		str.push(' isUnderline="'+this.isUnderline+'"');
	}
	if(this.isStrikeThrough!=false&&this.isStrikeThrough!=""){
		str.push(' isStrikeThrough="'+this.isStrikeThrough+'"');
	}
	if(this.pdfFontName!=""){
		str.push(' pdfFontName="'+this.pdfFontName+'"');
	}
	if(this.pdfEncoding!=""){
		str.push(' pdfEncoding="'+this.pdfEncoding+'"');
	}
	if(this.isPdfEmbedded!="false"&&this.isPdfEmbedded!=""){
		str.push(' isPdfEmbedded="'+this.isPdfEmbedded+'"');
	}
	if(this.pattern!=""){
		str.push(' pattern="'+this.pattern+'"');
	}
	if(this.isBlankWhenNull!="false"&&this.isBlankWhenNull!=""){
		str.push(' isBlankWhenNull="'+this.isBlankWhenNull+'"');
	}
	str.push('>');
	if(this.pen!=null){
			str.push(this.pen.toXML());
	}
	if(this.box!=null){
			str.push(this.box.toXML());
	}
	if(this.paragraph!=null){
			str.push(this.paragraph.toXML());
	}
	for(var i=0;i<this.conditionalStyle.length;i++){
		 str.push(this.conditionalStyle[i].toXML());
	}
	str.push('\n</style>');
	return str.join('');
}

dev.report.model.XBox = function() {

	this.border = "None";
	/*
	*None:No border.
	*Thin:Thin border.
	*1Point:Normal border.
	*2Point:Medium border.
	*4Point:Thick border.
	*Dotted:Dotted border.
	*/

	this.borderColor = "";

	this.padding = "";

	this.topBorder = "None";
	/*
	*None:No border.
	*Thin:Thin border.
	*1Point:Normal border.
	*2Point:Medium border.
	*4Point:Thick border.
	*Dotted:Dotted border.
	*/
	this.topBorderColor = "";

	this.topPadding = "";

	this.leftBorder = "None";
	/*
	*None:No border.
	*Thin:Thin border.
	*1Point:Normal border.
	*2Point:Medium border.
	*4Point:Thick border.
	*Dotted:Dotted border.
	*/
	this.leftBorderColor = "";

	this.leftPadding = "";

	this.bottomBorder = "None";
	/*
	*None:No border.
	*Thin:Thin border.
	*1Point:Normal border.
	*2Point:Medium border.
	*4Point:Thick border.
	*Dotted:Dotted border.
	*/
	this.bottomBorderColor = "";

	this.bottomPadding = "";

	this.rightBorder = "None";
	/*
	*None:No border.
	*Thin:Thin border.
	*1Point:Normal border.
	*2Point:Medium border.
	*4Point:Thick border.
	*Dotted:Dotted border.
	*/
	this.rightBorderColor = "";

	this.rightPadding = "";


	this.pen= null;

	this.topPen=null;

	this.leftPen=null;

	this.bottomPen=null;

	this.rightPen=null;

}

var _p = dev.report.model.XBox.prototype;

_p.init = function(boxElements) {
	if(boxElements.attributes.getNamedItem("border")!=null){
		this.border = boxElements.attributes.getNamedItem("border").value;
	}
	if(boxElements.attributes.getNamedItem("borderColor")!=null){
		this.borderColor = boxElements.attributes.getNamedItem("borderColor").value;
	}
	if(boxElements.attributes.getNamedItem("padding")!=null){
		this.padding = boxElements.attributes.getNamedItem("padding").value;
	}
	if(boxElements.attributes.getNamedItem("topBorder")!=null){
		this.topBorder = boxElements.attributes.getNamedItem("topBorder").value;
	}
	if(boxElements.attributes.getNamedItem("topBorderColor")!=null){
		this.topBorderColor = boxElements.attributes.getNamedItem("topBorderColor").value;
	}
	if(boxElements.attributes.getNamedItem("topPadding")!=null){
		this.topPadding = boxElements.attributes.getNamedItem("topPadding").value;
	}
	if(boxElements.attributes.getNamedItem("leftBorder")!=null){
		this.leftBorder = boxElements.attributes.getNamedItem("leftBorder").value;
	}
	if(boxElements.attributes.getNamedItem("leftBorderColor")!=null){
		this.leftBorderColor = boxElements.attributes.getNamedItem("leftBorderColor").value;
	}
	if(boxElements.attributes.getNamedItem("leftPadding")!=null){
		this.leftPadding = boxElements.attributes.getNamedItem("leftPadding").value;
	}
	if(boxElements.attributes.getNamedItem("bottomBorder")!=null){
		this.bottomBorder = boxElements.attributes.getNamedItem("bottomBorder").value;
	}
	if(boxElements.attributes.getNamedItem("bottomBorderColor")!=null){
		this.bottomBorderColor = boxElements.attributes.getNamedItem("bottomBorderColor").value;
	}
	if(boxElements.attributes.getNamedItem("bottomPadding")!=null){
		this.bottomPadding = boxElements.attributes.getNamedItem("bottomPadding").value;
	}
	if(boxElements.attributes.getNamedItem("rightBorder")!=null){
		this.rightBorder = boxElements.attributes.getNamedItem("rightBorder").value;
	}
	if(boxElements.attributes.getNamedItem("rightBorderColor")!=null){
		this.rightBorderColor = boxElements.attributes.getNamedItem("rightBorderColor").value;
	}
	if(boxElements.attributes.getNamedItem("rightPadding")!=null){
		this.rightPadding = boxElements.attributes.getNamedItem("rightPadding").value;
	}

	var boxEles=boxElements.childNodes;

	for(var k=0;k<boxEles.length;k++){
		  var boxElement=boxEles[k];
		  if(boxElement.nodeName=='pen'){
			   this.pen=new dev.report.model.XPen();
			   this.pen.init(boxElement);
		  }
		  if(boxElement.nodeName=='topPen'){
			    this.topPen=new dev.report.model.XTopPen();
				this.topPen.init(boxElement);
		  }
		  if(boxElement.nodeName=='leftPen'){
			   this.leftPen=new dev.report.model.XLeftPen();
				this.leftPen.init(boxElement);
		  }
		  if(boxElement.nodeName=='bottomPen'){
			 this.bottomPen=new dev.report.model.XBottomPen();
			 this.bottomPen.init(boxElement);
		  }
		  if(boxElement.nodeName=='rightPen'){
			   this.rightPen=new dev.report.model.XRightPen();
			   this.rightPen.init(boxElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<box');
	if(this.border!='None'){
		str.push(' border="'+this.border+'"');
	}
	if(this.borderColor!=''){
		str.push(' borderColor="'+this.borderColor+'"');
	}
	if(this.padding!=''){
		str.push(' padding="'+this.padding+'"');
	}
	if(this.topBorder!='None'){
		str.push(' topBorder="'+this.topBorder+'"');
	}
	if(this.topBorderColor!=''){
		str.push(' topBorderColor="'+this.topBorderColor+'"');
	}
	if(this.topPadding!=''){
		str.push(' topPadding="'+this.topPadding+'"');
	}
	if(this.leftBorder!='None'){
		str.push(' leftBorder="'+this.leftBorder+'"');
	}
	if(this.leftBorderColor!=''){
		str.push(' leftBorderColor="'+this.leftBorderColor+'"');
	}
	if(this.leftPadding!=''){
		str.push(' leftPadding="'+this.leftPadding+'"');
	}
	if(this.bottomBorder!='None'){
		str.push(' bottomBorder="'+this.bottomBorder+'"');
	}
	if(this.bottomBorderColor!=''){
		str.push(' bottomBorderColor="'+this.bottomBorderColor+'"');
	}
	if(this.bottomPadding!=''){
		str.push(' bottomPadding="'+this.bottomPadding+'"');
	}
	if(this.rightBorder!='None'){
		str.push(' rightBorder="'+this.rightBorder+'"');
	}
	if(this.rightBorderColor!=''){
		str.push(' rightBorderColor="'+this.rightBorderColor+'"');
	}
	if(this.rightPadding!=''){
		str.push(' rightPadding="'+this.rightPadding+'"');
	}
	str.push('>');
	if(this.pen!=null){
			str.push(this.pen.toXML());
	}
	if(this.topPen!=null){
			str.push(this.topPen.toXML());
	}
	if(this.leftPen!=null){
			str.push(this.leftPen.toXML());
	}
	if(this.bottomPen!=null){
			str.push(this.bottomPen.toXML());
	}
	if(this.rightPen!=null){
			str.push(this.rightPen.toXML());
	}
	str.push('\n</box>');
	return str.join('');
}

dev.report.model.XPen = function() {
	this.lineWidth = "";
	this.lineStyle = "Solid";
	this.lineColor = "";
}
var _p = dev.report.model.XPen.prototype;
_p.init = function(penElements) {
	 if(penElements.nodeName=='pen'){	
		if(penElements.attributes.getNamedItem("lineWidth")!=null){
			this.lineWidth = penElements.attributes.getNamedItem("lineWidth").value+'px';;
		}
		if(penElements.attributes.getNamedItem("lineStyle")!=null){
			this.lineStyle = penElements.attributes.getNamedItem("lineStyle").value;;
		}
		if(penElements.attributes.getNamedItem("lineColor")!=null){
			this.lineColor = penElements.attributes.getNamedItem("lineColor").value;;
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<pen ');
	if(this.lineWidth!=0){
		str.push(' lineWidth="'+this.lineWidth.replace('px','')+'"');
	}
	if(this.lineStyle!=""){
		str.push(' lineStyle="'+this.lineStyle+'"');
	}
	if(this.lineColor!=""){
		str.push(' lineColor="'+this.lineColor+'"');
	}
	str.push('></pen>');
	return str.join('');
}

dev.report.model.XTopPen = function() {

	this.lineWidth = "";

	this.lineStyle = "Solid";
	/*
	 * Solid:Solid line.
	 * Dashed:Dashed line.
	 * Dotted:Dotted line.
	 * Double:Double line.
	 */

	this.lineColor = "";
	/*
	*Line color for the pen. Hexadecimal formatted values preceded by the # character or decimal values are accepted along with the following predefined color values: black, blue, cyan, darkGray, gray, green, lightGray, magenta, orange, pink, red, yellow, white.
	*/
}
var _p = dev.report.model.XTopPen.prototype;
_p.init = function(penElements) {
	 if(penElements.nodeName=='topPen'){	
		if(penElements.attributes.getNamedItem("lineWidth")!=null){
			this.lineWidth = penElements.attributes.getNamedItem("lineWidth").value+'px';;
		}
		if(penElements.attributes.getNamedItem("lineStyle")!=null){
			this.lineStyle = penElements.attributes.getNamedItem("lineStyle").value;;
		}
		if(penElements.attributes.getNamedItem("lineColor")!=null){
			this.lineColor = penElements.attributes.getNamedItem("lineColor").value;;
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<topPen ');
	if(this.lineWidth!=""){
		str.push(' lineWidth="'+this.lineWidth.replace('px','')+'"');
	}
	if(this.lineStyle!=""){
		str.push(' lineStyle="'+this.lineStyle+'"');
	}
	if(this.lineColor!=""){
		str.push(' lineColor="'+this.lineColor+'"');
	}
	str.push('></topPen>');
	return str.join('');
}
dev.report.model.XLeftPen = function() {
	this.lineWidth = "";
	this.lineStyle = "Solid";
	/*
	 * Solid:Solid line.
	 * Dashed:Dashed line.
	 * Dotted:Dotted line.
	 * Double:Double line.
	 */

	this.lineColor = "";
	/*
	*Line color for the pen. Hexadecimal formatted values preceded by the # character or decimal values are accepted along with the following predefined color values: black, blue, cyan, darkGray, gray, green, lightGray, magenta, orange, pink, red, yellow, white.
	*/
}
var _p = dev.report.model.XLeftPen.prototype;

_p.init = function(penElements) {
	 if(penElements.nodeName=='leftPen'){	
		if(penElements.attributes.getNamedItem("lineWidth")!=null){
			this.lineWidth = penElements.attributes.getNamedItem("lineWidth").value+'px';;
		}
		if(penElements.attributes.getNamedItem("lineStyle")!=null){
			this.lineStyle = penElements.attributes.getNamedItem("lineStyle").value;;
		}
		if(penElements.attributes.getNamedItem("lineColor")!=null){
			this.lineColor = penElements.attributes.getNamedItem("lineColor").value;;
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<leftPen ');
	if(this.lineWidth!=0){
		str.push(' lineWidth="'+this.lineWidth.replace('px','')+'"');
	}
	if(this.lineStyle!=""){
		str.push(' lineStyle="'+this.lineStyle+'"');
	}
	if(this.lineColor!=""){
		str.push(' lineColor="'+this.lineColor+'"');
	}
	str.push('></leftPen>');
	return str.join('');
}
dev.report.model.XBottomPen = function() {
	this.lineWidth = "";
	this.lineStyle = "Solid";
	/*
	 * Solid:Solid line.
	 * Dashed:Dashed line.
	 * Dotted:Dotted line.
	 * Double:Double line.
	 */
	this.lineColor = "";
	/*
	*Line color for the pen. Hexadecimal formatted values preceded by the # character or decimal values are accepted along with the following predefined color values: black, blue, cyan, darkGray, gray, green, lightGray, magenta, orange, pink, red, yellow, white.
	*/
}

var _p = dev.report.model.XBottomPen.prototype;

_p.init = function(penElements) {
	 if(penElements.nodeName=='bottomPen'){	
		if(penElements.attributes.getNamedItem("lineWidth")!=null){
			this.lineWidth = penElements.attributes.getNamedItem("lineWidth").value+'px';;
		}
		if(penElements.attributes.getNamedItem("lineStyle")!=null){
			this.lineStyle = penElements.attributes.getNamedItem("lineStyle").value;;
		}
		if(penElements.attributes.getNamedItem("lineColor")!=null){
			this.lineColor = penElements.attributes.getNamedItem("lineColor").value;;
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<bottomPen ');
	if(this.lineWidth!=0){
		str.push(' lineWidth="'+this.lineWidth.replace('px','')+'"');
	}
	if(this.lineStyle!=""){
		str.push(' lineStyle="'+this.lineStyle+'"');
	}
	if(this.lineColor!=""){
		str.push(' lineColor="'+this.lineColor+'"');
	}
	str.push('></bottomPen>');
	return str.join('');
}
dev.report.model.XRightPen = function() {

	this.lineWidth = "";

	this.lineStyle = "Solid";
	/*
	 * Solid:Solid line.
	 * Dashed:Dashed line.
	 * Dotted:Dotted line.
	 * Double:Double line.
	 */

	this.lineColor = "";
	/*
	*Line color for the pen. Hexadecimal formatted values preceded by the # character or decimal values are accepted along with the following predefined color values: black, blue, cyan, darkGray, gray, green, lightGray, magenta, orange, pink, red, yellow, white.
	*/
}
var _p = dev.report.model.XRightPen.prototype;

_p.init = function(penElements) {
	 if(penElements.nodeName=='rightPen'){	
		if(penElements.attributes.getNamedItem("lineWidth")!=null){
			this.lineWidth = penElements.attributes.getNamedItem("lineWidth").value;
		}
		if(penElements.attributes.getNamedItem("lineStyle")!=null){
			this.lineStyle = penElements.attributes.getNamedItem("lineStyle").value;
		}
		if(penElements.attributes.getNamedItem("lineColor")!=null){
			this.lineColor = penElements.attributes.getNamedItem("lineColor").value;
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<rightPen ');
	if(this.lineWidth!=0){
		str.push(' lineWidth="'+this.lineWidth.replace('px','')+'"');
	}
	if(this.lineStyle!=""){
		str.push(' lineStyle="'+this.lineStyle+'"');
	}
	if(this.lineColor!=""){
		str.push(' lineColor="'+this.lineColor+'"');
	}
	str.push('></rightPen>');
	return str.join('');
}

dev.report.model.XParagraph = function() {

	this.lineSpacing = "Single";

	this.lineSpacingSize = "";

	this.firstLineIndent = "";

	this.leftIndent = "";

	this.rightIndent = "";

	this.spacingBefore = "";

	this.spacingAfter = "";

	this.tabStopWidth = "";

	this.tabStop=[];

}

var _p = dev.report.model.XParagraph.prototype;

_p.init = function(paragraphElements) {
		if(paragraphElements.attributes.getNamedItem("lineSpacing")!=null){
			this.lineSpacing = paragraphElements.attributes.getNamedItem("lineSpacing");
		}
		if(paragraphElements.attributes.getNamedItem("lineSpacingSize")!=null){
			this.lineSpacingSize = paragraphElements.attributes.getNamedItem("lineSpacingSize");
		}
		if(paragraphElements.attributes.getNamedItem("firstLineIndent")!=null){
			this.firstLineIndent = paragraphElements.attributes.getNamedItem("firstLineIndent");
		}
		if(paragraphElements.attributes.getNamedItem("leftIndent")!=null){
			this.leftIndent = paragraphElements.attributes.getNamedItem("leftIndent");
		}
		if(paragraphElements.attributes.getNamedItem("rightIndent")!=null){
			this.rightIndent = paragraphElements.attributes.getNamedItem("rightIndent");
		}
		if(paragraphElements.attributes.getNamedItem("spacingBefore")!=null){
			this.spacingBefore = paragraphElements.attributes.getNamedItem("spacingBefore");
		}
		if(paragraphElements.attributes.getNamedItem("spacingAfter")!=null){
			this.spacingAfter = paragraphElements.attributes.getNamedItem("spacingAfter");
		}
		if(paragraphElements.attributes.getNamedItem("tabStopWidth")!=null){
			this.tabStopWidth = paragraphElements.attributes.getNamedItem("tabStopWidth");
		}
		var paragraphEls=paragraphElements.childNodes;
		for(var k=0;k<paragraphEls.length;k++){
			  var paragraphElement=paragraphEls[k];
			  if(paragraphElement.nodeName=='tabStop'){
				  var tbs=new dev.report.model.XTabStop();
				  tbs.init(paragraphElement);
				  this.tabStop.push(tbs);
			  }
		}
}

_p.toXML = function() {
	var str=[];
	str.push('\n<paragraph ');
	if(this.lineSpacing!=""){
		str.push(' lineSpacing="'+this.lineSpacing+'"');
	}
	
	if(this.lineSpacingSize!=0){
		str.push(' lineSpacingSize="'+this.lineSpacingSize+'"');
	}
	if(this.firstLineIndent!=0){
		str.push(' firstLineIndent="'+this.firstLineIndent+'"');
	}
	if(this.leftIndent!=0){
		str.push(' leftIndent="'+this.leftIndent+'"');
	}
	if(this.rightIndent!=0){
		str.push(' rightIndent="'+this.rightIndent+'"');
	}
	if(this.spacingBefore!=""){
		str.push(' spacingBefore="'+this.spacingBefore+'"');
	}
	if(this.spacingAfter!=0){
		str.push(' spacingAfter="'+this.spacingAfter+'"');
	}
	if(this.tabStopWidth!=0){
		str.push(' tabStopWidth="'+this.tabStopWidth+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.tabStop.length;i++){
		 str.push(this.tabStop[i].toXML());
	}
	str.push('\n</paragraph>');
	return str.join('');
}
dev.report.model.XTabStop = function(position) {
	this.position = position;
	this.alignment = "Left";
}

var _p = dev.report.model.XTabStop.prototype;

_p.init = function(tabStopElements) {	
	this.position = tabStopElements.attributes.getNamedItem("position");
	if(tabStopElements.attributes.getNamedItem("alignment")!=null){
		this.alignment = tabStopElements.attributes.getNamedItem("alignment");
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<tabStop ');
	str.push(' position="'+this.position+'"');
	if(this.alignment!=""){
		str.push(' alignment="'+this.alignment+'"');
	}
	str.push('>\n</tabStop>');
	return str.join('');
}
dev.report.model.XConditionalStyle = function() {
	this.conditionExpression=null;
	this.style=[];
}

var _p = dev.report.model.XConditionalStyle.prototype;

_p.init = function(conStyleElements) {
	var conStyleEls=conStyleElements.childNodes;
	for(var k=0;k<conStyleEls.length;k++){
		  var conStyleElement=conStyleEls[k];
		  if(conStyleElement.nodeName=='conditionExpression'){
			  var bandElement=conStyleElement.firstChild;
			  	this.conditionExpression=new dev.report.model.XConditionExpression();
				this.conditionExpression.init(bandElement);
		  }
		  if(conStyleElement.nodeName=='style'){
			  var style=new dev.report.model.XStyle();
			  style.init(conStyleElement);
			  this.style.push(style);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<conditionalStyle ');
	str.push('>\n');
	if(this.conditionExpression!=null){
		str.push(this.conditionExpression.toXML());
	}
	for(var i=0;i<this.style.length;i++){
		 str.push(this.style[i].toXML());
	}
	str.push('\n</conditionalStyle>');
	return str.join('');
}
dev.report.model.XConditionExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XConditionExpression.prototype;
_p.init = function(conExpressionElements) {
	this.expression= gpExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n<conditionExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('\n</conditionExpression>');
	return str.join('');
}

//===============================================================BAND 对象定义================================================================

dev.report.model.XPatternExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XPatternExpression.prototype;
_p.init = function(Elements) {
	this.expression= Elements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<patternExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</patternExpression>');
	return str.join('');
}
dev.report.model.XAnchorNameExpression = function() {
	this.expression=null;
}

var _p = dev.report.model.XAnchorNameExpression.prototype;

_p.init = function(Elements) {
	this.expression= Elements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<anchorNameExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</anchorNameExpression>');
	return str.join('');
}

dev.report.model.XHyperlinkReferenceExpression = function() {
	this.expression=null;
}

var _p = dev.report.model.XHyperlinkReferenceExpression.prototype;

_p.init = function(hypreferExpressionElements) {
	this.expression= hypreferExpressionElements.firstChild.data;
}

_p.toXML = function() {
	var str=[];
	str.push('\n				<hyperlinkReferenceExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</hyperlinkReferenceExpression>');
	return str.join('');
}

dev.report.model.XHyperlinkAnchorExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XHyperlinkAnchorExpression.prototype;
_p.init = function(hypExpressionElements) {
	this.expression= hypExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<hyperlinkAnchorExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</hyperlinkAnchorExpression>');
	return str.join('');
}

dev.report.model.XHyperlinkPageExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XHyperlinkPageExpression.prototype;
_p.init = function(hypExpressionElements) {
	this.expression= hypExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<hyperlinkPageExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</hyperlinkPageExpression>');
	return str.join('');
}
dev.report.model.XHyperlinkTooltipExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XHyperlinkTooltipExpression.prototype;
_p.init = function(hypExpressionElements) {
	this.expression= hypExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<hyperlinkTooltipExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</hyperlinkTooltipExpression>');
	return str.join('');
}
dev.report.model.XPropertyExpression = function(name) {
	this.name = name;
	str.push(this.expression);
}
var _p = dev.report.model.XPropertyExpression.prototype;
_p.init = function(pExpressionElements) {
	 this.name = pExpressionElements.attributes.getNamedItem("name").value;
	 this.expression= hypExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<propertyExpression ');
	str.push(' name="'+this.name+'">');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</propertyExpression>');
	return str.join('');
}

dev.report.model.XHyperlinkParameter = function(name) {
	this.name = name;
	this.hyperlinkParameterExpression = [];
}

var _p = dev.report.model.XHyperlinkParameter.prototype;
_p.init = function(Elements) {
	 this.name = Elements.attributes.getNamedItem("name").value;
	 var Eles = Elements.childNodes; 
	 for(var k=0;k<Eles.length;k++){
		  var Element=Eles[k];
		  if(Element.nodeName=='hyperlinkParameterExpression'){
			  var rp=new dev.report.model.XHyperlinkParameterExpression();
			  rp.init(Element);
			  this.hyperlinkParameterExpression.push(rp);
		  }
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<hyperlinkParameter ');
	str.push(' name="'+this.name+'"');
	str.push('>');
	for(var i=0;i<this.hyperlinkParameterExpression.length;i++){
		str.push(this.hyperlinkParameterExpression[i].toXML());
	}
	str.push('</hyperlinkParameter>');
	return str.join('');
}
dev.report.model.XHyperlinkParameterExpression = function() {
	this.class1 = "java.lang.String";
	this.expression=null;
}
var _p = dev.report.model.XHyperlinkParameterExpression.prototype;
_p.init = function(Elements) {
	 this.class1 = Elements.attributes.getNamedItem("class").value;

	 this.expression= hypExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n			<hyperlinkParameterExpression');
	str.push(' class="'+this.class1+'"');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('></hyperlinkParameterExpression>');
	return str.join('');
}
dev.report.model.XPrintWhenExpression = function() {
	this.expression=null;
}
var _p = dev.report.model.XPrintWhenExpression.prototype;
_p.init = function(pwExpressionElements) {
	this.expression= pwExpressionElements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n			<printWhenExpression> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.expression);
	str.push(']');
	str.push(']>');
	str.push('</printWhenExpression>');
	return str.join('');
}
dev.report.model.XTextFieldExpression = function() {
	this.class1 = "java.lang.String";
	this.data="";
}
var _p = dev.report.model.XTextFieldExpression.prototype;
_p.init = function(Elements) {
	if(Elements.attributes.getNamedItem("class")!=null){
		this.class1 = Elements.attributes.getNamedItem("class").value;
	}
	this.data = Elements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<textFieldExpression');
		str.push(' class="'+this.class1+'"');
		str.push('>');
		str.push('<![CDA');
		str.push('TA[');
		str.push(this.data);
		str.push(']');
		str.push(']>');
	str.push('</textFieldExpression>');
	return str.join('');
}

dev.report.model.XImageExpression = function() {
	this.class1 = "java.lang.String";
	this.data="";
}
var _p = dev.report.model.XImageExpression.prototype;
_p.init = function(Elements) {
	if(Elements.attributes.getNamedItem("class")!=null){
		this.class1 = Elements.attributes.getNamedItem("class").value;
	}
	this.data = Elements.firstChild.data;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<imageExpression');
		str.push(' class="'+this.class1+'"');
		str.push('>');
		str.push('<![CDA');
		str.push('TA[');
		str.push(this.data);
		str.push(']');
		str.push(']>');
	str.push('</imageExpression>');
	return str.join('');
}


dev.report.model.XBand = function() {

	this.height = 0;

	this.splitType = "Stretch";  
	/*
	 * Stretch:The band is allowed to split, but never within its declared height. This means the band splits only when its content stretches
	   Prevent:Prevents the band from splitting on first break attempt. On subsequent pages/columnNum, the band is allowed to split, to avoid infinite loops.
	 * Immediate:The band is allowed to split anywhere, as early as needed, but not before at least one element being printed on the current page/column.
	 */

	this.printWhenExpression=null;

	this.breaks={};

	this.lines = {};

	this.rectangles = {};

	this.ellipses = {};

	this.imgs = {};

	this.staticTexts = [];

	this.textFields = [];

	this.subreports = {};

	this.elementGroups = {};

	this.crosstabs = {};

	this.frames = {};

	this.componentElements = {};

	this.genericElements = {};

}

var _p = dev.report.model.XBand.prototype;

_p.addBreak=function(v){
	var _break=this.breaks;
	_break[v.id]=v;
	this.breaks=_break;
}
_p.removeBreak=function(id) {
	delete this.breaks[id];
}
_p.getBreak=function(id) {
    return this.breaks[id];
}
_p.addLine=function(v){
	var _line=this.lines;
	_line[v.id]=v;
	this.lines=_line;
}
_p.removeLine=function(id) {
	delete this.lines[id];
}
_p.getLine=function(id) {
    return this.lines[id];
}

_p.addRectangle=function(v){
	var _rectangle=this.rectangles;
	_rectangle[v.id]=v;
	this.rectangles=_rectangle;
}
_p.removeRectangle=function(id) {
	delete this.rectangles[id];
}
_p.getRectangle=function(id) {
    return this.rectangles[id];
}

_p.addEllipse=function(v){
	var _ellipse=this.ellipses;
	_ellipse[v.id]=v;
	this.ellipses=_ellipse;
}
_p.removeEllipse=function(id) {
	delete this.ellipses[id];
}
_p.getEllipse=function(id) {
    return this.ellipses[id];
}

_p.addImage=function(v){
	var _img=this.imgs;
	_img[v.id]=v;
	this.imgs=_img;
}
_p.removeImage=function(id) {
	delete this.imgs[id];
}
_p.getImage=function(id) {
    return this.imgs[id];
}
_p.addStaticText=function(v){
	var _staticText=this.staticTexts;
	_staticText.push(v);
	this.staticTexts=_staticText;
}
_p.removeStaticText=function(id) {
	//delete this.staticTexts[id];
}
_p.getStaticText=function(id) {
    return this.staticTexts[id];
}
_p.addTextField=function(v){
	var _textField=this.textFields;
	_textField.push(v);
	this.textFields=_textField;
}
_p.removeTextField==function(id) {
	//delete this.textFields[id];
}
_p.getTextField==function(id) {
    return this.textFields[id];
}
_p.addSubReport=function(v){
	var _subreport=this.subreports;
	_subreport[v.id]=v;
	this.subreports=_subreport;
}
_p.removeSubReport==function(id) {
	delete this.subreports[id];
}
_p.getSubReport==function(id) {
    return this.subreports[id];
}
_p.addElementGroup=function(v){
	var _elementGroup=this.elementGroups;
	_elementGroup[v.id]=v;
	this.elementGroups=_elementGroup;
}
_p.removeElementGroup==function(id) {
	delete this.elementGroups[id];
}
_p.getElementGroup==function(id) {
    return this.elementGroups[id];
}
_p.addCrossTab=function(v){
	var _crosstab=this.crosstabs;
	_crosstab[v.id]=v;
	this.crosstabs=_crosstab;
}
_p.removeCrossTab==function(id) {
	delete this.crosstabs[id];
}
_p.getCrossTab==function(id) {
    return this.crosstabs[id];
}
_p.addFrame=function(v){
	var _frame=this.frames;
	_frame[v.id]=v;
	this.frames=_frame;
}
_p.removeFrame==function(id) {
	delete this.frames[id];
}
_p.getFrame==function(id) {
    return this.frames[id];
}
_p.addComponentElement=function(v){
	var _componentElement=this.componentElements;
	_componentElement[v.id]=v;
	this.componentElements=_componentElement;
}
_p.removeComponentElement==function(id) {
	delete this.componentElements[id];
}
_p.getComponentElement==function(id) {
    return this.componentElements[id];
}
_p.addGenericElement=function(v){
	var _genericElement=this.genericElements;
	_genericElement[v.id]=v;
	this.genericElements=_genericElement;
}
_p.removeGenericElement==function(id) {
	delete this.genericElements[id];
}
_p.getGenericElement==function(id) {
    return this.genericElements[id];
}
_p.init = function(bandElements) {

		if(bandElements.attributes.getNamedItem("height")!=null){
			this.height = bandElements.attributes.getNamedItem("height").value;
		}
		if(bandElements.attributes.getNamedItem("splitType")!=null){
			this.splitType = bandElements.attributes.getNamedItem("splitType").value;
		}

		var bandEles=bandElements.childNodes;

		for(var k=0;k<bandEles.length;k++){
			  var Element=bandEles[k];
			  if(Element.nodeName=='printWhenExpression'){
					this.printWhenExpression=new dev.report.model.XPrintWhenExpression();
					this.printWhenExpression.init(Element);
			  }

			  if(Element.nodeName=='break'){
				  var brk=new dev.report.model.XBreak();
				  brk.init(Element);
				  this.addBreak(brk);
			  }
			  if(Element.nodeName=='line'){
				  var rp=new dev.report.model.XLine();
				  rp.init(Element);
				   this.addLine(rp);
			  }
			  if(Element.nodeName=='rectangle'){
				  var rp=new dev.report.model.XRectangle();
				  rp.init(Element);
				  this.addRectangle(rp);
			  }
			  if(Element.nodeName=='ellipse'){
				  var rp=new dev.report.model.XEllipse();
				  rp.init(Element);
				   this.addEllipse(rp);
			  }
			  if(Element.nodeName=='image'){
				  var rp=new dev.report.model.XImage();
				  rp.init(Element);
				  this.addImage(rp);
			  }
			  if(Element.nodeName=='staticText'){
				  var rp=new dev.report.model.XStaticText();
				  rp.init(Element);
				  this.addStaticText(rp);
			  }
			  if(Element.nodeName=='textField'){
				  var rp=new dev.report.model.XTextField();
				  rp.init(Element);
				   this.addTextField(rp);
			  }
			  if(Element.nodeName=='genericElement'){
				  var rp=new dev.report.model.XGenericElement();
				  rp.init(Element);
				  this.addGenericElement(rp);
			  }
			  if(Element.nodeName=='elementGroup'){
				  var rp=new dev.report.model.XElementGroup();
				  rp.init(Element);
				  this.addElementGroup(rp);
			  }
			  if(Element.nodeName=='frame'){
				  var rp=new dev.report.model.XFrame();
				  rp.init(Element);
				  this.addFrame(rp);
			  }
			  if(Element.nodeName=='componentElement'){
				  var rp=new dev.report.model.XComponentElement();
				  rp.init(Element);
				  this.addComponentElement(rp);
			  }
			  if(Element.nodeName=='crosstab'){
				  var rp=new dev.report.model.XCrosstab();
				  rp.init(Element);
				  this.addCrossTab(rp);
			  }
			   if(Element.nodeName=='subreport'){
				  var rp=new dev.report.model.XSubreport();
				  rp.init(Element);
				  this.addSubReport(rp);
			  }
		}
}
_p.toXML = function() {
	var str=[];
	str.push('\n		<band ');
	if(this.height!=0){
		str.push(' height="'+this.height+'"');
	}
	str.push(' splitType="'+this.splitType+'"');
	str.push('>');

	if(this.printWhenExpression!=null){
		str.push(this.printWhenExpression.toXML());
	}
	for(var i in this.breaks){
		str.push(this.breaks[i].toXML());;
	}
	for(var i in this.lines){
		str.push(this.lines[i].toXML());
	}
	for(var i in this.rectangles){
		str.push(this.rectangle[i].toXML());
	}
	for(var i in this.ellipses){
		str.push(this.ellipses[i].toXML());
	}
	for(var i in this.imgs){
		str.push(this.imgs[i].toXML());
	}
	for(var i=0;i<this.staticTexts.length;i++){
		str.push(this.staticTexts[i].toXML());
	}
	for(var i=0;i<this.textFields.length;i++){
		str.push(this.textFields[i].toXML());
	}
	for(var i in this.elementGroups){
		str.push(this.elementGroups[i].toXML());
	}
	for(var i in this.frames){
		str.push(this.frames[i].toXML());
	}
	for(var i in this.componentElements){
		str.push(this.componentElements[i].toXML());
	}
	for(var i in this.genericElements){
		str.push(this.genericElements[i].toXML());
	}
	for(var i in this.subreports){
		str.push(this.subreports[i].toXML());
	}
	for(var i in this.crosstabs){
		str.push(this.crosstabs[i].toXML());
	}
	str.push('\n		</band>');
	return str.join('');
}

dev.report.model.XFrame = function(name) {

	this.box = null;

	this.reportElement = {};

	this.breaks = {};

	this.lines = {};

	this.rectangles = {};

	this.ellipses = {};

	this.images = {};

	this.staticTexts = {};

	this.textFields = {};

	this.subreports = {};

	this.elementGroups = {};

	this.crosstabs = {};

	this.frames = {};

	this.componentElements = {};

	this.genericElements = {};
}

var _p = dev.report.model.XFrame.prototype;
_p.addBreak=function(v){
	var _break=this.breaks;
	_break[v.id]=v;
	this.breaks=_break;
}
_p.removeBreak=function(id) {
	delete this.breaks[id];
}
_p.getBreak=function(id) {
    return this.breaks[id];
}
_p.addLine=function(v){
	var _line=this.lines;
	_line[v.id]=v;
	this.lines=_line;
}
_p.removeLine=function(id) {
	delete this.lines[id];
}
_p.getLine=function(id) {
    return this.lines[id];
}

_p.addRectangle=function(v){
	var _rectangle=this.rectangles;
	_rectangle[v.id]=v;
	this.rectangles=_rectangle;
}
_p.removeRectangle=function(id) {
	delete this.rectangles[id];
}
_p.getRectangle=function(id) {
    return this.rectangles[id];
}

_p.addEllipse=function(v){
	var _ellipse=this.ellipses;
	_ellipse[v.id]=v;
	this.ellipses=_ellipse;
}
_p.removeEllipse=function(id) {
	delete this.ellipses[id];
}
_p.getEllipse=function(id) {
    return this.ellipses[id];
}

_p.addImage=function(v){
	var _img=this.imgs;
	_img[v.id]=v;
	this.imgs=_img;
}
_p.removeImage=function(id) {
	delete this.imgs[id];
}
_p.getImage=function(id) {
    return this.imgs[id];
}
_p.addStaticText=function(v){
	var _staticText=this.staticTexts;
	_staticText[v.id]=v;
	this.staticTexts=_staticText;
}
_p.removeStaticText=function(id) {
	delete this.staticTexts[id];
}
_p.getStaticText=function(id) {
    return this.staticTexts[id];
}
_p.addTextField=function(v){
	var _textField=this.textFields;
	_textField[v.id]=v;
	this.textFields=_textField;
}
_p.removeTextField==function(id) {
	delete this.textFields[id];
}
_p.getTextField==function(id) {
    return this.textFields[id];
}
_p.addSubReport=function(v){
	var _subreport=this.subreports;
	_subreport[v.id]=v;
	this.subreports=_subreport;
}
_p.removeSubReport==function(id) {
	delete this.subreports[id];
}
_p.getSubReport==function(id) {
    return this.subreports[id];
}
_p.addElementGroup=function(v){
	var _elementGroup=this.elementGroups;
	_elementGroup[v.id]=v;
	this.elementGroups=_elementGroup;
}
_p.removeElementGroup==function(id) {
	delete this.elementGroups[id];
}
_p.getElementGroup==function(id) {
    return this.elementGroups[id];
}
_p.addCrossTab=function(v){
	var _crosstab=this.crosstabs;
	_crosstab[v.id]=v;
	this.crosstabs=_crosstab;
}
_p.removeCrossTab==function(id) {
	delete this.crosstabs[id];
}
_p.getCrossTab==function(id) {
    return this.crosstabs[id];
}
_p.addFrame=function(v){
	var _frame=this.frames;
	_frame[v.id]=v;
	this.frames=_frame;
}
_p.removeFrame==function(id) {
	delete this.frames[id];
}
_p.getFrame==function(id) {
    return this.frames[id];
}
_p.addComponentElement=function(v){
	var _componentElement=this.componentElements;
	_componentElement[v.id]=v;
	this.componentElements=_componentElement;
}
_p.removeComponentElement==function(id) {
	delete this.componentElements[id];
}
_p.getComponentElement==function(id) {
    return this.componentElements[id];
}
_p.addGenericElement=function(v){
	var _genericElement=this.genericElements;
	_genericElement[v.id]=v;
	this.genericElements=_genericElement;
}
_p.removeGenericElement==function(id) {
	delete this.genericElements[id];
}
_p.getGenericElement==function(id) {
    return this.genericElements[id];
}
_p.init = function(Elements) {
	if(Elements.nodeName=='frame'){
	 var Eles = Elements.childNodes; 
	 for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='box'){
				this.box = new dev.report.model.XBox();
				this.box.init(rp);
			  }
			  if(Element.nodeName=='break'){
				  var brk=new dev.report.model.XBreak();
				  brk.init(Element);
				  this.addBreak(brk);
			  }
			  if(Element.nodeName=='line'){
				  var rp=new dev.report.model.XLine();
				  rp.init(Element);
				   this.addLine(rp);
			  }
			  if(Element.nodeName=='rectangle'){
				  var rp=new dev.report.model.XRectangle();
				  rp.init(Element);
				  this.addRectangle(rp);
			  }
			  if(Element.nodeName=='ellipse'){
				  var rp=new dev.report.model.XEllipse();
				  rp.init(Element);
				   this.addEllipse(rp);
			  }
			  if(Element.nodeName=='image'){
				  var rp=new dev.report.model.XImage();
				  rp.init(Element);
				  this.addImage(rp);
			  }
			  if(Element.nodeName=='staticText'){
				  var rp=new dev.report.model.XStaticText();
				  rp.init(Element);
				  this.addStaticText(rp);
			  }
			  if(Element.nodeName=='textField'){
				  var rp=new dev.report.model.XTextField();
				  rp.init(Element);
				   this.addTextField(rp);
			  }
			  if(Element.nodeName=='genericElement'){
				  var rp=new dev.report.model.XGenericElement();
				  rp.init(Element);
				  this.addGenericElement(rp);
			  }
			  if(Element.nodeName=='elementGroup'){
				  var rp=new dev.report.model.XElementGroup();
				  rp.init(Element);
				  this.addElementGroup(rp);
			  }
			  if(Element.nodeName=='frame'){
				  var rp=new dev.report.model.XFrame();
				  rp.init(Element);
				  this.addFrame(rp);
			  }
			  if(Element.nodeName=='componentElement'){
				  var rp=new dev.report.model.XComponentElement();
				  rp.init(Element);
				  this.addComponentElement(rp);
			  }
			  if(Element.nodeName=='crosstab'){
				  var rp=new dev.report.model.XCrosstab();
				  rp.init(Element);
				  this.addCrossTab(rp);
			  }
			   if(Element.nodeName=='subreport'){
				  var rp=new dev.report.model.XSubreport();
				  rp.init(Element);
				  this.addSubReport(rp);
			  }
	 }
}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<frame ');
	str.push('>\n');
	if(this.box!=null){
		str.push(this.box.toXML());
	}
	for(var i in this.breaks){
		str.push(this.breaks[i].toXML());;
	}
	for(var i in this.lines){
		str.push(this.lines[i].toXML());
	}
	for(var i in this.rectangles){
		str.push(this.rectangle[i].toXML());
	}
	for(var i in this.ellipses){
		str.push(this.ellipses[i].toXML());
	}
	for(var i in this.imgs){
		str.push(this.imgs[i].toXML());
	}
	for(var i in this.staticTexts){
		str.push(this.staticTexts[i].toXML());
	}
	for(var i in this.textFields){
		str.push(this.textFields[i].toXML());
	}
	for(var i in this.elementGroups){
		str.push(this.elementGroups[i].toXML());
	}
	for(var i in this.frames){
		str.push(this.frames[i].toXML());
	}
	for(var i in this.componentElements){
		str.push(this.componentElements[i].toXML());
	}
	for(var i in this.genericElements){
		str.push(this.genericElements[i].toXML());
	}
	for(var i in this.subreports){
		str.push(this.subreports[i].toXML());
	}
	for(var i in this.crosstabs){
		str.push(this.crosstabs[i].toXML());
	}
	str.push('\n</frame>');
	return str.join('');
}

dev.report.model.XElementGroup = function(name) {

	this.breaks = {};

	this.lines = {};

	this.rectangles = {};

	this.ellipses = {};

	this.images = {};

	this.staticTexts = {};

	this.textFields = {};

	this.subreports = {};

	this.elementGroups = {};

	this.crosstabs = {};

	this.frames = {};

	this.componentElements = {};

	this.genericElements = {};
}

var _p = dev.report.model.XElementGroup.prototype;
_p.addBreak=function(v){
	var _break=this.breaks;
	_break[v.id]=v;
	this.breaks=_break;
}
_p.removeBreak=function(id) {
	delete this.breaks[id];
}
_p.getBreak=function(id) {
    return this.breaks[id];
}
_p.addLine=function(v){
	var _line=this.lines;
	_line[v.id]=v;
	this.lines=_line;
}
_p.removeLine=function(id) {
	delete this.lines[id];
}
_p.getLine=function(id) {
    return this.lines[id];
}

_p.addRectangle=function(v){
	var _rectangle=this.rectangles;
	_rectangle[v.id]=v;
	this.rectangles=_rectangle;
}
_p.removeRectangle=function(id) {
	delete this.rectangles[id];
}
_p.getRectangle=function(id) {
    return this.rectangles[id];
}

_p.addEllipse=function(v){
	var _ellipse=this.ellipses;
	_ellipse[v.id]=v;
	this.ellipses=_ellipse;
}
_p.removeEllipse=function(id) {
	delete this.ellipses[id];
}
_p.getEllipse=function(id) {
    return this.ellipses[id];
}

_p.addImage=function(v){
	var _img=this.imgs;
	_img[v.id]=v;
	this.imgs=_img;
}
_p.removeImage=function(id) {
	delete this.imgs[id];
}
_p.getImage=function(id) {
    return this.imgs[id];
}
_p.addStaticText=function(v){
	var _staticText=this.staticTexts;
	_staticText[v.id]=v;
	this.staticTexts=_staticText;
}
_p.removeStaticText=function(id) {
	delete this.staticTexts[id];
}
_p.getStaticText=function(id) {
    return this.staticTexts[id];
}
_p.addTextField=function(v){
	var _textField=this.textFields;
	_textField[v.id]=v;
	this.textFields=_textField;
}
_p.removeTextField==function(id) {
	delete this.textFields[id];
}
_p.getTextField==function(id) {
    return this.textFields[id];
}
_p.addSubReport=function(v){
	var _subreport=this.subreports;
	_subreport[v.id]=v;
	this.subreports=_subreport;
}
_p.removeSubReport==function(id) {
	delete this.subreports[id];
}
_p.getSubReport==function(id) {
    return this.subreports[id];
}
_p.addElementGroup=function(v){
	var _elementGroup=this.elementGroups;
	_elementGroup[v.id]=v;
	this.elementGroups=_elementGroup;
}
_p.removeElementGroup==function(id) {
	delete this.elementGroups[id];
}
_p.getElementGroup==function(id) {
    return this.elementGroups[id];
}
_p.addCrossTab=function(v){
	var _crosstab=this.crosstabs;
	_crosstab[v.id]=v;
	this.crosstabs=_crosstab;
}
_p.removeCrossTab==function(id) {
	delete this.crosstabs[id];
}
_p.getCrossTab==function(id) {
    return this.crosstabs[id];
}
_p.addFrame=function(v){
	var _frame=this.frames;
	_frame[v.id]=v;
	this.frames=_frame;
}
_p.removeFrame==function(id) {
	delete this.frames[id];
}
_p.getFrame==function(id) {
    return this.frames[id];
}
_p.addComponentElement=function(v){
	var _componentElement=this.componentElements;
	_componentElement[v.id]=v;
	this.componentElements=_componentElement;
}
_p.removeComponentElement==function(id) {
	delete this.componentElements[id];
}
_p.getComponentElement==function(id) {
    return this.componentElements[id];
}
_p.addGenericElement=function(v){
	var _genericElement=this.genericElements;
	_genericElement[v.id]=v;
	this.genericElements=_genericElement;
}
_p.removeGenericElement==function(id) {
	delete this.genericElements[id];
}
_p.getGenericElement==function(id) {
    return this.genericElements[id];
}
_p.init = function(Elements) {
	if(Elements.nodeName=='elementGroup'){
	 var Eles = Elements.childNodes; 
	 for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='break'){
				  var brk=new dev.report.model.XBreak();
				  brk.init(Element);
				  this.addBreak(brk);
			  }
			  if(Element.nodeName=='line'){
				  var rp=new dev.report.model.XLine();
				  rp.init(Element);
				   this.addLine(rp);
			  }
			  if(Element.nodeName=='rectangle'){
				  var rp=new dev.report.model.XRectangle();
				  rp.init(Element);
				  this.addRectangle(rp);
			  }
			  if(Element.nodeName=='ellipse'){
				  var rp=new dev.report.model.XEllipse();
				  rp.init(Element);
				   this.addEllipse(rp);
			  }
			  if(Element.nodeName=='image'){
				  var rp=new dev.report.model.XImage();
				  rp.init(Element);
				  this.addImage(rp);
			  }
			  if(Element.nodeName=='staticText'){
				  var rp=new dev.report.model.XStaticText();
				  rp.init(Element);
				  this.addStaticText(rp);
			  }
			  if(Element.nodeName=='textField'){
				  var rp=new dev.report.model.XTextField();
				  rp.init(Element);
				   this.addTextField(rp);
			  }
			  if(Element.nodeName=='genericElement'){
				  var rp=new dev.report.model.XGenericElement();
				  rp.init(Element);
				  this.addGenericElement(rp);
			  }
			  if(Element.nodeName=='elementGroup'){
				  var rp=new dev.report.model.XElementGroup();
				  rp.init(Element);
				  this.addElementGroup(rp);
			  }
			  if(Element.nodeName=='frame'){
				  var rp=new dev.report.model.XFrame();
				  rp.init(Element);
				  this.addFrame(rp);
			  }
			  if(Element.nodeName=='componentElement'){
				  var rp=new dev.report.model.XComponentElement();
				  rp.init(Element);
				  this.addComponentElement(rp);
			  }
			  if(Element.nodeName=='crosstab'){
				  var rp=new dev.report.model.XCrosstab();
				  rp.init(Element);
				  this.addCrossTab(rp);
			  }
			   if(Element.nodeName=='subreport'){
				  var rp=new dev.report.model.XSubreport();
				  rp.init(Element);
				  this.addSubReport(rp);
			  }
	 }
}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<elementGroup ');
	str.push('>');
	for(var i in this.breaks){
		str.push(this.breaks[i].toXML());;
	}
	for(var i in this.lines){
		str.push(this.lines[i].toXML());
	}
	for(var i in this.rectangles){
		str.push(this.rectangle[i].toXML());
	}
	for(var i in this.ellipses){
		str.push(this.ellipses[i].toXML());
	}
	for(var i in this.imgs){
		str.push(this.imgs[i].toXML());
	}
	for(var i in this.staticTexts){
		str.push(this.staticTexts[i].toXML());
	}
	for(var i in this.textFields){
		str.push(this.textFields[i].toXML());
	}
	for(var i in this.elementGroups){
		str.push(this.elementGroups[i].toXML());
	}
	for(var i in this.frames){
		str.push(this.frames[i].toXML());
	}
	for(var i in this.componentElements){
		str.push(this.componentElements[i].toXML());
	}
	for(var i in this.genericElements){
		str.push(this.genericElements[i].toXML());
	}
	for(var i in this.subreports){
		str.push(this.subreports[i].toXML());
	}
	for(var i in this.crosstabs){
		str.push(this.crosstabs[i].toXML());
	}
	str.push('\n</elementGroup>');
	return str.join('');
}
dev.report.model.XReportElement = function(x,y,width,height) {

	this.x = x;
	
	this.y = y;

	this.width = width;

	this.height = height;

	this.key = "";

	this.style = "";

	this.positionType = "Float";
	/*
		Float:The element moves relative to the size of the surrounding elements.
		FixRelativeToTop:The element maintains its position relative to the top of the band.
		FixRelativeToBottom:The element maintains its position relative to the bottom of the band.
	*/

	this.stretchType = "NoStretch";

	this.isPrintRepeatedValues = "true";
	/*
		true:Dynamic elements will print even if their values repeat. Static elements will appear every time the band that contains them is started.
		false:Suppresses the repeated values for the dynamic elements. The static elements will print only according to the other 3 attributes: <code>isPrintInFirstWholeBand</code>, <code>isPrintWhenDetailOverflows</code>, <code>printWhenGroupChanges</code>.
	*/
	this.mode = "";

	this.isRemoveLineWhenBlank = "false";
	
	this.isPrintInFirstWholeBand = "false";

	this.isPrintWhenDetailOverflows = "false";
	
	this.printWhenGroupChanges = "";

	this.forecolor = "";

	this.backcolor = "";

	this.property={};

	this.propertyExpression={};
	
	this.printWhenExpression = null;

}
var _p = dev.report.model.XReportElement.prototype;
_p.addProperty=function(prop){
	var _prop=this.property;
	_prop[prop.name]=prop;
	this.property=_prop;
}
_p.removeProperty=function(name) {
	delete this.property[name];
}
_p.getProperty=function(name) {
    return this.property[name];
}
_p.addPropertyExpression=function(prop){
	var _propExpression=this.propertyExpression;
	_propExpression[prop.name]=prop;
	this.propertyExpression=_prop;
}
_p.removePropertyExpression=function(name) {
	delete this.propertyExpression[name];
}
_p.getPropertyExpression=function(name) {
    return this.propertyExpression[name];
}
_p.init = function(rpElements) {  

		this.x = rpElements.attributes.getNamedItem("x").value;
		this.y = rpElements.attributes.getNamedItem("y").value;
		this.width = rpElements.attributes.getNamedItem("width").value;
		this.height = rpElements.attributes.getNamedItem("height").value;
		if(rpElements.attributes.getNamedItem("key")!=null){
			this.key = rpElements.attributes.getNamedItem("key").value;
		}
		if(rpElements.attributes.getNamedItem("style")!=null){
			this.style = rpElements.attributes.getNamedItem("style").value;
		}
		if(rpElements.attributes.getNamedItem("positionType")!=null){
			this.positionType = rpElements.attributes.getNamedItem("positionType").value;
		}
		if(rpElements.attributes.getNamedItem("stretchType")!=null){
			this.stretchType = rpElements.attributes.getNamedItem("stretchType").value;
		}
		if(rpElements.attributes.getNamedItem("isPrintRepeatedValues")!=null){
			this.isPrintRepeatedValues = rpElements.attributes.getNamedItem("isPrintRepeatedValues").value;
		}
		if(rpElements.attributes.getNamedItem("mode")!=null){
			this.mode = rpElements.attributes.getNamedItem("mode").value;
		}
		if(rpElements.attributes.getNamedItem("isRemoveLineWhenBlank")!=null){
			this.isRemoveLineWhenBlank = rpElements.attributes.getNamedItem("isRemoveLineWhenBlank").value;
		}
		if(rpElements.attributes.getNamedItem("isPrintInFirstWholeBand")!=null){
			this.isPrintInFirstWholeBand = rpElements.attributes.getNamedItem("isPrintInFirstWholeBand").value;
		}
		if(rpElements.attributes.getNamedItem("isPrintWhenDetailOverflows")!=null){
			this.isPrintWhenDetailOverflows = rpElements.attributes.getNamedItem("isPrintWhenDetailOverflows").value;
		}
		if(rpElements.attributes.getNamedItem("printWhenGroupChanges")!=null){
			this.printWhenGroupChanges = rpElements.attributes.getNamedItem("printWhenGroupChanges").value;
		}
		if(rpElements.attributes.getNamedItem("forecolor")!=null){
			this.forecolor = rpElements.attributes.getNamedItem("forecolor").value;
		}
		if(rpElements.attributes.getNamedItem("backcolor")!=null){
			this.backcolor = rpElements.attributes.getNamedItem("backcolor").value;
		}

		var rpEles=rpElements.childNodes;

		for(var k=0;k<rpEles.length;k++){
			  var rpElement=rpEles[k];
			  if(rpElement.nodeName=='property'){
					var obj=new dev.report.model.XProperty();
					obj.init(rpElement);
					this.addProperty(obj);
			  }
			  if(rpElement.nodeName=='propertyExpression'){
				  var rp=new dev.report.model.XPropertyExpression();
				  rp.init(rpElement);
				  this.addPropertyExpression(rp);
			  }
			  if(rpElement.nodeName=='printWhenExpression'){
				this.printWhenExpression=new XPrintWhenExpression();
				this.printWhenExpression.init(rpElement);
			  }
		}
}

_p.toXML = function() {
	var str=[];
	str.push('\n			<reportElement ');
	str.push(' x="'+this.x+'"');
	str.push(' y="'+this.y+'"');
	str.push(' width="'+this.width+'"');
	str.push(' height="'+this.height+'"');
	if(this.key!=""){
		str.push(' key="'+this.key+'"');
	}
	if(this.style!=""){
		str.push(' style="'+this.style+'"');
	}
	if(this.positionType!=""){
		str.push(' positionType="'+this.positionType+'"');
	}
	if(this.stretchType!=""){
		str.push(' stretchType="'+this.stretchType+'"');
	}
	if(this.isPrintRepeatedValues!="false"){
		str.push(' isPrintRepeatedValues="'+this.isPrintRepeatedValues+'"');
	}
	if(this.mode!=""){
		str.push(' mode="'+this.mode+'"');
	}
	if(this.isRemoveLineWhenBlank!="false"){
		str.push(' isRemoveLineWhenBlank="'+this.isRemoveLineWhenBlank+'"');
	}
	if(this.isPrintInFirstWholeBand!="false"){
		str.push(' isPrintInFirstWholeBand="'+this.isPrintInFirstWholeBand+'"');
	}
	if(this.isPrintWhenDetailOverflows!="false"){
		str.push(' isPrintWhenDetailOverflows="'+this.isPrintWhenDetailOverflows+'"');
	}
	if(this.printWhenGroupChanges!=""){
		str.push(' printWhenGroupChanges="'+this.printWhenGroupChanges+'"');
	}
	if(this.forecolor!=""){
		str.push(' forecolor="'+this.forecolor+'"');
	}
	if(this.backcolor!=""){
		str.push(' backcolor="'+this.backcolor+'"');
	}
	str.push('>');
	for(var i in this.property){
		str.push(this.property[i].toXML());
	}
	for(var i in this.propertyExpression){
		 str.push(this.propertyExpression[i].toXML());
	}
	if(this.printWhenExpression!=null){
		str.push(this.printWhenExpression.toXML());
	}
	str.push('</reportElement>');
	return str.join('');
}
dev.report.model.XGraphicElement = function() {

	this.fill = "";
	/*
		Solid:Solid fill.
	*/

	this.pen1 = "";
	/*
		None:No line.
		Thin:Thin line.
		1Point:Normal line.
		2Point:Medium line.
		4Point:Thick line.
		Dotted:Dotted line.
	*/

	this.stretchType = "";
	
	this.pen = null;

}

var _p = dev.report.model.XGraphicElement.prototype;
_p.init = function(gpElements) {
	if(gpElements.nodeName=='graphicElement'){
		if(gpElements.attributes.getNamedItem("stretchType")!=null){
			this.stretchType = gpElements.attributes.getNamedItem("stretchType").value;
		}
		if(gpElements.attributes.getNamedItem("pen")!=null){
			this.pen1 = gpElements.attributes.getNamedItem("pen").value;
		}
		if(gpElements.attributes.getNamedItem("fill")!=null){
			this.fill = gpElements.attributes.getNamedItem("fill").value;
		}
		var gpEles=gpElements.childNodes;
		for(var k=0;k<gpEles.length;k++){
			  var gpElement=gpEles[k];
			  if(gpElement.nodeName=='pen'){
				  this.pen=new dev.report.model.Pen();
				  this.pen.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<graphicElement ');
	if(this.stretchType!=""){
		str.push(' stretchType="'+this.stretchType+'"');
	}
	if(this.pen1!=""){
		str.push(' pen="'+this.pen1+'"');
	}
	if(this.fill!=""){
		str.push(' fill="'+this.fill+'"');
	}
	str.push('>\n');
	if(this.pen!=null){
		 str.push(this.pen.toXML());
	}
	str.push('\n</graphicElement>');
	return str.join('');
}
dev.report.model.XBreak = function() {
	this.type = "Page";
	this.reportElements={};
}
var _p = dev.report.model.XBreak.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.init = function(breakElements) {
	if(breakElements.attributes.getNamedItem("type")!=null){
		this.type = breakElements.attributes.getNamedItem("type");
	}
	var breakEles=breakElements.childNodes;
	for(var k=0;k<breakEles.length;k++){
		  var breakElement=breakEles[k];
		  if(breakElement.nodeName=='reportElement'){
			  var rp=new dev.report.model.XReportElement();
			  rp.init(breakElement);
			  this.addReportElement(rp);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<break ');
	if(this.type!=""){
		str.push(' type="'+this.type+'"');
	}
	str.push('>');
	for(var i in this.reportElements){
		str.push(this.reportElements[i].toXML());
	}
	str.push('\n</break>');
	return str.join('');
}
dev.report.model.XLine = function() {

	this.direction = "TopDown";
	/*
		TopDown:The diagonal that starts in the top-left corner of the rectangle will be drawn.
		BottomUp:The diagonal that starts in the bottom-left corner of the rectangle will be drawn.
	*/
	this.reportElements={};
	this.graphicElement = null;
}

var _p = dev.report.model.XLine.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.init = function(lineElements) {
	if(lineElements.attributes.getNamedItem("direction")!=null){
		this.direction = lineElements.attributes.getNamedItem("direction").value;
	}
	var lineEles=lineElements.childNodes;
	for(var k=0;k<lineEles.length;k++){
		  var lineElement=lineEles[k];
		  if(lineElement.nodeName=='reportElement'){
			  var rp=new dev.report.model.XReportElement();
			  rp.init(lineElement);
			  this.addReportElement(rp);
		  }
		  if(lineElement.nodeName=='graphicElement'){
			this.graphicElement= new dev.report.model.XGraphicElement();
			this.graphicElement.init(lineElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<line ');
	if(this.direction!=""){
		str.push(' direction="'+this.direction+'"');
	}
	str.push('>\n');
	for(var i in this.reportElements){
		 str.push(this.reportElements[i].toXML());
	}
	if(this.graphicElement!=null){
		str.push(this.graphicElement.toXML());
	}
	str.push('\n</line>');
	return str.join('');
}
dev.report.model.XRectangle = function(x,y,width,height) {
	this.radius = "";
	this.graphicElement = null;
	this.reportElements = {};
}
var _p = dev.report.model.XRectangle.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.init = function(recElements) {
	if(recElements.attributes.getNamedItem("radius")!=null){
		this.radius = recElements.attributes.getNamedItem("radius");
	}
	var recEles=recElements.childNodes;
	for(var k=0;k<recEles.length;k++){
		  var recElement=recEles[k];
		  if(recElement.nodeName=='reportElement'){
			  var rp=new dev.report.model.XReportElement();
			  rp.init(recElement);
			   this.addReportElement(rp);
		  }
		  if(recElement.nodeName=='graphicElement'){
				this.graphicElement= new dev.report.model.XGraphicElement();
				this.graphicElement.init(rp);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<rectangle ');
	if(this.radius!=0){
		str.push(' radius="'+this.radius+'"');
	}
	str.push('>');
	for(var i in this.reportElements){
		 str.push(this.reportElements[i].toXML());
	}
	if(this.graphicElement!=null){
		str.push(this.graphicElement.toXML());
	}
	str.push('\n</rectangle>');
	return str.join('');
}
dev.report.model.XEllipse = function(x,y,width,height) {
	this.graphicElement = null;
	this.reportElements = {};
}
var _p = dev.report.model.XEllipse.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement=function(id) {
	delete this.reportElements[id];
}
_p.getReportElement=function(id) {
    return this.reportElements[id];
}
_p.init = function(ellipseElements) {
	var ellipseEles=ellipseElements.childNodes;
	for(var k=0;k<ellipseEles.length;k++){
		  var ellipseElement=ellipseEles[k];
		  if(ellipseElement.nodeName=='reportElement'){
			  var rp=new dev.report.model.XReportElement();
			  rp.init(ellipseElement);
			  this.addReportElement(rp);
		  }
		  if(ellipseElement.nodeName=='graphicElement'){
			  this.graphicElement= new dev.report.model.XGraphicElement();
			  this.graphicElement.init(ellipseElement);
		  }
	}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<ellipse ');
	str.push('>');
	for(var i in this.reportElements){
		 str.push(this.reportElements[i].toXML());
	}
	if(this.graphicElement!=null){
		str.push(this.graphicElement.toXML());
	}
	str.push('\n</ellipse>');
	return str.join('');
}
dev.report.model.XImage = function() {

	this.scaleImage = "";
	/*
		Clip:Only the portion of the image that fits the specified object width and height will be printed. Image is not stretched.
		FillFrame:Image will be stretched to adapt to the specified object width and height.
		RetainShape:Image will adapt to the specified object width or height keeping its original shape.
		RealHeight:A scale image type that instructs the engine to stretch the image height to fit the actual height of the image.
		RealSize:A scale image type that stretches the images height in the same way as <code>RealHeight</code>, and in addition it changes the image width to the actual with of the image.
	*/

	this.hAlign = "";
	
	this.vAlign = "";

	this.isUsingCache = "";

	this.isLazy = "false";
	/*
		true:The image is loaded from the specified location only when the document is viewed or exported to other formats.
		false:The image is loaded during the report filling process and stored in the resulting document.
	*/
	this.onErrorType = "Error";
	/*
		Error:An exception is raised when loading the image.
		Blank:The exception is ignored and the image displays as blank.
		Icon:The exception is ignored and an image replacement icon is displayed.
	*/
	this.evaluationTime = "Now";

	this.evaluationGroup = "";

	this.hyperlinkType = "";

	this.hyperlinkTarget = "";

	this.bookmarkLevel = "";

	this.graphicElement = null;

	this.reportElements = {};

	this.box = null;

	this.imageExpression = null;

	this.anchorNameExpression = null;

	this.hyperlinkReferenceExpression = null;

	this.hyperlinkAnchorExpression = null;

	this.hyperlinkPageExpression = null;

	this.hyperlinkTooltipExpression = null;

	this.hyperlinkParameter = {};
}

var _p = dev.report.model.XImage.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.addHyperlinkParameter=function(v){
	var _hyperlinkParameter=this.hyperlinkParameter;
	_hyperlinkParameter[v.id]=v;
	this.hyperlinkParameter=_hyperlinkParameter;
}
_p.removeHyperlinkParameter==function(id) {
	delete this.hyperlinkParameter[id];
}
_p.getHyperlinkParameter==function(id) {
    return this.hyperlinkParameter[id];
}

_p.init = function(imageElements) {
	if(imageElements.nodeName=='image'){
		if(imageElements.attributes.getNamedItem("scaleImage")!=null){
			this.scaleImage = imageElements.attributes.getNamedItem("scaleImage").value;
		}
		if(imageElements.attributes.getNamedItem("hAlign")!=null){
			this.hAlign = imageElements.attributes.getNamedItem("hAlign").value;
		}
		if(imageElements.attributes.getNamedItem("vAlign")!=null){
			this.vAlign = imageElements.attributes.getNamedItem("vAlign").value;
		}
		if(imageElements.attributes.getNamedItem("isUsingCache")!=null){
			this.isUsingCache = imageElements.attributes.getNamedItem("isUsingCache").value;
		}
		if(imageElements.attributes.getNamedItem("isLazy")!=null){
			this.isLazy = imageElements.attributes.getNamedItem("isLazy").value;
		}
		if(imageElements.attributes.getNamedItem("onErrorType")!=null){
			this.onErrorType = imageElements.attributes.getNamedItem("onErrorType").value;
		}
		if(imageElements.attributes.getNamedItem("evaluationTime")!=null){
			this.evaluationTime = imageElements.attributes.getNamedItem("evaluationTime").value;
		}
		if(imageElements.attributes.getNamedItem("evaluationGroup")!=null){
			this.evaluationGroup = imageElements.attributes.getNamedItem("evaluationGroup").value;
		}
		if(imageElements.attributes.getNamedItem("hyperlinkType")!=null){
			this.hyperlinkType = imageElements.attributes.getNamedItem("hyperlinkType").value;
		}
		if(imageElements.attributes.getNamedItem("hyperlinkTarget")!=null){
			this.hyperlinkTarget = imageElements.attributes.getNamedItem("hyperlinkTarget").value;
		}
		if(imageElements.attributes.getNamedItem("bookmarkLevel")!=null){
			this.bookmarkLevel = imageElements.attributes.getNamedItem("bookmarkLevel").value;
		}
		var imageEls=imageElements.childNodes;

		for(var k=0;k<imageEls.length;k++){
			  var imageElement=imageEls[k];
			  if(imageElement.nodeName=='reportElement'){
				  var rp=new dev.report.model.XReportElement();
				  rp.init(imageElement);
				  this.addReportElement(rp);
			  }
			  if(imageElement.nodeName=='box'){
				this.box = new dev.report.model.XBox();
				this.box.init(rp);
			  }
			  if(imageElement.nodeName=='graphicElement'){
				this.graphicElement = new dev.report.model.XGraphicElement();
				this.graphicElement.init(imageElement);
			  }
			  if(imageElement.nodeName=='imageExpression'){
				  this.imageExpression = new dev.report.model.XImageExpression();
				  this.imageExpression.init(imageElement);
			  }
			  if(imageElement.nodeName=='anchorNameExpression'){
				this.anchorNameExpression = new dev.report.model.XAnchorNameExpression();
				this.anchorNameExpression.init(imageElement);
			  }
			  if(imageElement.nodeName=='hyperlinkReferenceExpression'){
				this.hyperlinkReferenceExpression =  new dev.report.model.XHyperlinkReferenceExpression();
				this.hyperlinkReferenceExpression.init(imageElement);
			  }
			  if(imageElement.nodeName=='hyperlinkAnchorExpression'){
				this.hyperlinkAnchorExpression=new dev.report.model.XHyperlinkAnchorExpression();
				this.hyperlinkAnchorExpression.init(imageElement);
			  }
			  if(imageElement.nodeName=='hyperlinkPageExpression'){
				this.hyperlinkAnchorExpression=new dev.report.model.XHyperlinkPageExpression();
				this.hyperlinkPageExpression.init(imageElement);
			  }
			  if(imageElement.nodeName=='hyperlinkTooltipExpression'){
				this.hyperlinkTooltipExpression=new dev.report.model.XHyperlinkTooltipExpression();
				this.hyperlinkTooltipExpression.init(imageElement);
			  }
			  if(imageElement.nodeName=='hyperlinkTooltipExpression'){
				this.imageExpression=new dev.report.model.XImageExpression();
				this.imageExpression.init(imageElement);
			  }
			  if(imageElement.nodeName=='hyperlinkParameter'){
				  var rp=new dev.report.model.XHyperlinkParameter();
				  rp.init(imageElement);
				  this.addHyperlinkParameter(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<image ');
	if(this.scaleImage!=""){
		str.push(' scaleImage="'+this.scaleImage+'"');
	}
	if(this.hAlign!=""){
		str.push(' hAlign="'+this.hAlign+'"');
	}
	if(this.vAlign!=""){
		str.push(' vAlign="'+this.vAlign+'"');
	}
	if(this.isUsingCache!="false"){
		str.push(' isUsingCache="'+this.isUsingCache+'"');
	}
	if(this.isLazy!="false"){
		str.push(' isLazy="'+this.isLazy+'"');
	}
	if(this.onErrorType!=""){
		str.push(' onErrorType="'+this.onErrorType+'"');
	}
	if(this.evaluationTime!=""){
		str.push(' evaluationTime="'+this.evaluationTime+'"');
	}
	if(this.evaluationGroup!=""){
		str.push(' evaluationGroup="'+this.evaluationGroup+'"');
	}
	if(this.hyperlinkType!=""){
		str.push(' hyperlinkType="'+this.hyperlinkType+'"');
	}
	if(this.hyperlinkTarget!=""){
		str.push(' hyperlinkTarget="'+this.hyperlinkTarget+'"');
	}
	if(this.bookmarkLevel!=""){
		str.push(' bookmarkLevel="'+this.bookmarkLevel+'"');
	}
	str.push('>\n');
	for(var i in this.reportElements){
		 str.push(this.reportElements[i].toXML());
	}
	if(this.box!=null){
		str.push(this.box.toXML());
	}
	if(this.graphicElement!=null){
		str.push(this.graphicElement.toXML());
	}
	if(this.imageExpression!=null){
		str.push(this.imageExpression.toXML());
	}
	if(this.anchorNameExpression!=null){
		str.push(this.anchorNameExpression.toXML());
	}
	if(this.hyperlinkReferenceExpression!=null){
		str.push(this.hyperlinkReferenceExpression.toXML());
	}
	if(this.hyperlinkAnchorExpression!=null){
		str.push(this.hyperlinkAnchorExpression.toXML());
	}
	if(this.hyperlinkPageExpression!=null){
		str.push(this.hyperlinkPageExpression.toXML());
	}
	if(this.hyperlinkTooltipExpression!=null){
		str.push(this.hyperlinkTooltipExpression.toXML());
	}
	for(var i in this.hyperlinkParameter){
		 str.push(this.hyperlinkParameter[i].toXML());
	}
	str.push('\n</image>');
	return str.join('');
}

dev.report.model.XStaticText = function() {
	this.reportElements = {};
	this.box=null;
	this.textElement = null;
	this.text = null;
}
var _p = dev.report.model.XStaticText.prototype;

_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.init = function(Elements) {
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='reportElement'){
				  var rp=new dev.report.model.XReportElement();
				  rp.init(Element);
				  this.addReportElement(rp);
			  }
			  if(Element.nodeName=='box'){
				  this.box=new dev.report.model.XBox();
				  this.box.init(Element);
			  }
			  if(Element.nodeName=='textElement'){
				  this.textElement=new dev.report.model.XTextElement();
				  this.textElement.init(Element);
			  }
			  if(Element.nodeName=='text'){
				   this.text=new dev.report.model.XText();
				   this.text.init(Element);
			  }
		}
}
_p.toXML = function() {
	var str=[];
	str.push('\n		<staticText ');
	str.push('>');
	for(var i in this.reportElements){
		str.push(this.reportElements[i].toXML());
	}
	if(this.box!= null){
		str.push(this.box.toXML());
	}
	if(this.textElement!= null){
		str.push(this.textElement.toXML());
	}
	if(this.text!= null){
		str.push(this.text.toXML());
	}
	str.push('\n		</staticText>');
	return str.join('');
}

dev.report.model.XText = function() {
	this.value= "";
}
var _p = dev.report.model.XText.prototype;
_p.init = function(Elements) {
	this.value=Elements.firstChild.data;;
}
_p.toXML = function() {
	var str=[];
	str.push('\n				<text> ');
	str.push('<![CDA');
	str.push('TA[');
	str.push(this.value);
	str.push(']');
	str.push(']>');
	str.push('</text>');
	return str.join('');
}

dev.report.model.XTextField = function() {

	this.isStretchWithOverflow = "false";

	this.evaluationTime = "Now";
	
	this.evaluationGroup = "";

	this.pattern = "";

	this.isBlankWhenNull = "true";
	
	this.hyperlinkType = "";

	this.hyperlinkTarget = "";

	this.bookmarkLevel = "";

	this.textFieldExpression = null;

	this.textElement = null;

	this.reportElements = [];

	this.box = null;

	this.patternExpression = null;

	this.anchorNameExpression = null;

	this.hyperlinkReferenceExpression = null;

	this.hyperlinkAnchorExpression = null;

	this.hyperlinkPageExpression = null;

	this.hyperlinkTooltipExpression = null;

	this.hyperlinkParameter = {};
}

var _p = dev.report.model.XTextField.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement.push(v);
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.addHyperlinkParameter=function(v){
	var _hyperlinkParameter=this.hyperlinkParameter;
	_hyperlinkParameter[v.id]=v;
	this.hyperlinkParameter=_hyperlinkParameter;
}
_p.removeHyperlinkParameter==function(id) {
	delete this.hyperlinkParameter[id];
}
_p.getHyperlinkParameter==function(id) {
    return this.hyperlinkParameter[id];
}
_p.init = function(Elements) {
		if(Elements.attributes.getNamedItem("isStretchWithOverflow")!=null){
			this.isStretchWithOverflow = Elements.attributes.getNamedItem("isStretchWithOverflow").value;
		}
		if(Elements.attributes.getNamedItem("pattern")!=null){
			this.pattern = Elements.attributes.getNamedItem("pattern").value;
		}
		if(Elements.attributes.getNamedItem("isBlankWhenNull")!=null){
			this.isBlankWhenNull = Elements.attributes.getNamedItem("isBlankWhenNull").value;
		}
		if(Elements.attributes.getNamedItem("evaluationTime")!=null){
			this.evaluationTime = Elements.attributes.getNamedItem("evaluationTime").value;
		}
		if(Elements.attributes.getNamedItem("evaluationGroup")!=null){
			this.evaluationGroup = Elements.attributes.getNamedItem("evaluationGroup").value;
		}
		if(Elements.attributes.getNamedItem("hyperlinkType")!=null){
			this.hyperlinkType = Elements.attributes.getNamedItem("hyperlinkType").value;
		}
		if(Elements.attributes.getNamedItem("hyperlinkTarget")!=null){
			this.hyperlinkTarget = Elements.attributes.getNamedItem("hyperlinkTarget").value;
		}
		if(Elements.attributes.getNamedItem("bookmarkLevel")!=null){
			this.bookmarkLevel = Elements.attributes.getNamedItem("bookmarkLevel").value;
		}
		var Eles=Elements.childNodes;

		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='reportElement'){
				  var rp=new dev.report.model.XReportElement();
				  rp.init(Element);
				  this.addReportElement(rp);
			  }
			  if(Element.nodeName=='box'){
				this.box =new dev.report.model.XBox();
				this.box.init(Element);
			  }
			  if(Element.nodeName=='textElement'){
				this.textElement =new dev.report.model.XTextElement();
				this.textElement.init(Element);
			  }
			  if(Element.nodeName=='textFieldExpression'){
				this.textFieldExpression =new dev.report.model.XTextFieldExpression();
				this.textFieldExpression.init(Element);
			  }
			  if(Element.nodeName=='patternExpression'){
				this.patternExpression= new dev.report.model.XPatternExpression();
				this.patternExpression.init(Element);
			  }
			  if(Element.nodeName=='anchorNameExpression'){
				this.anchorNameExpression= new dev.report.model.XAnchorNameExpression();
				this.anchorNameExpression.init(Element);
			  }
			  if(Element.nodeName=='hyperlinkReferenceExpression'){
				this.hyperlinkReferenceExpression=new dev.report.model.XHyperlinkReferenceExpression();
				this.hyperlinkReferenceExpression.init(Element);
			  }
			  if(Element.nodeName=='hyperlinkAnchorExpression'){
				this.hyperlinkAnchorExpression=new dev.report.model.XHyperlinkAnchorExpression();
				this.hyperlinkAnchorExpression.init(Element);
			  }   
			  if(Element.nodeName=='hyperlinkPageExpression'){
				this.hyperlinkPageExpression=new dev.report.model.XHyperlinkPageExpression();
				this.hyperlinkPageExpression.init(Element);
			  }
			  if(Element.nodeName=='hyperlinkTooltipExpression'){
				this.hyperlinkTooltipExpression=new  dev.report.model.XHyperlinkTooltipExpression();
				this.hyperlinkTooltipExpression.init(Element);
			  }
			  if(Element.nodeName=='hyperlinkParameter'){
				var hl=new  dev.report.model.XHyperlinkParameter();
				this.addHyperlinkParameter(hl);
			  }
		}
}

_p.toXML = function() {
	var str=[];
	str.push('\n		<textField ');
	if(this.pattern!=""){
		str.push(' pattern="'+this.pattern+'"');
	}	
	if(this.isStretchWithOverflow!="false"&&this.isStretchWithOverflow!=""){
		str.push(' isStretchWithOverflow="'+this.isStretchWithOverflow+'"');
	}
	if(this.isBlankWhenNull!="false"&&this.isBlankWhenNull!=""){
		str.push(' isBlankWhenNull="'+this.isBlankWhenNull+'"');
	}
	if(this.evaluationTime!=""){
		str.push(' evaluationTime="'+this.evaluationTime+'"');
	}
	if(this.evaluationGroup!=""){
		str.push(' evaluationGroup="'+this.evaluationGroup+'"');
	}
	if(this.hyperlinkType!=""){
		str.push(' hyperlinkType="'+this.hyperlinkType+'"');
	}
	if(this.hyperlinkTarget!=""){
		str.push(' hyperlinkTarget="'+this.hyperlinkTarget+'"');
	}
	if(this.bookmarkLevel!=""){
		str.push(' bookmarkLevel="'+this.bookmarkLevel+'"');
	}
	str.push('>');
	for(var i=0;i<this.reportElements.length;i++){
		 str.push(this.reportElements[i].toXML());
	}
	if(this.box!=null){
		str.push(this.box.toXML());
	}
	if(this.textElement!=null){
		str.push(this.textElement.toXML());
	}
	if(this.textFieldExpression!=null){
		str.push(this.textFieldExpression.toXML());
	}
	if(this.patternExpression!=null){
		str.push(this.patternExpression.toXML());
	}
	if(this.anchorNameExpression!=null){
		str.push(this.anchorNameExpression.toXML());
	}
	if(this.hyperlinkReferenceExpression!=null){
		str.push(this.hyperlinkReferenceExpression.toXML());
	}
	if(this.hyperlinkAnchorExpression!=null){
		str.push(this.hyperlinkAnchorExpression.toXML());
	}
	if(this.hyperlinkPageExpression!=null){
		str.push(this.hyperlinkPageExpression.toXML());
	}
	if(this.hyperlinkTooltipExpression!=null){
		str.push(this.hyperlinkTooltipExpression.toXML());
	}
	for(var i=0;i<this.hyperlinkParameter.length;i++){
		str.push(this.hyperlinkParameter[i].toXML());
	}
	str.push('\n		</textField>');
	return str.join('');
}

dev.report.model.XTextElement = function() {

	this.textAlignment = "";
	/*
		Left:Text is aligned to the left.
		Center:Text is centered.
		Right:Text is aligned to the right.
		Justified:Text is justified.
	*/

	this.verticalAlignment = "";
	/*
		Top:Text is aligned to the top.
		Middle:Text is vertically centered.
		Bottom:Text is aligned to the bottom.
	*/

	this.rotation = "";
	/*
		None:Text runs horizontally from left to right and from top to bottom.
		Left:Text runs vertically from bottom to top and from left to right.
		Right:Text runs vertically from top to bottom and from right to left.
		UpsideDown:Text is rotated with 180 degrees.
	*/
	this.lineSpacing = "";
	/*
		Single:Normal line spacing.
		1_1_2:Medium line spacing.
		Double:Double line spacing.
	*/
	this.isStyledText = "";
	/*
		true:The text element contains text formatted using nested <code>&lt;style&gt;</code> tags.
		false:The text element has a pure text content, without style information.
	*/
	this.markup = "";


	this.font = null;

	this.paragraph = null;

}

var _p = dev.report.model.XTextElement.prototype;

_p.init = function(Elements) {
	if(Elements.attributes.getNamedItem("textAlignment")!=null){
		this.textAlignment = Elements.attributes.getNamedItem("textAlignment").value;
	}
	if(Elements.attributes.getNamedItem("verticalAlignment")!=null){
		this.verticalAlignment = Elements.attributes.getNamedItem("verticalAlignment").value;
	}
	if(Elements.attributes.getNamedItem("rotation")!=null){
		this.rotation = Elements.attributes.getNamedItem("rotation").value;
	}
	if(Elements.attributes.getNamedItem("lineSpacing")!=null){
		this.lineSpacing = Elements.attributes.getNamedItem("lineSpacing").value;
	}
	if(Elements.attributes.getNamedItem("isStyledText")!=null){
		this.isStyledText = Elements.attributes.getNamedItem("isStyledText").value;
	}
	if(Elements.attributes.getNamedItem("markup")!=null){
		this.markup = Elements.attributes.getNamedItem("markup").value;
	}

	var Eles=Elements.childNodes;

	for(var k=0;k<Eles.length;k++){
		  var Element=Eles[k];
		  if(Element.nodeName=='font'){
			  this.font=new dev.report.model.XFont();
			  this.font.init(Element);
		  }
		  if(Element.nodeName=='paragraph'){
			  this.paragraph=new dev.report.model.XParagraph();
			  this.paragraph.init(rp);
		  }
	}
}

_p.toXML = function() {
	var str=[];
	str.push('\n<textElement ');
	if(this.textAlignment!=""){
		str.push(' textAlignment="'+this.textAlignment+'"');
	}
	if(this.verticalAlignment!=""){
		str.push(' verticalAlignment="'+this.verticalAlignment+'"');
	}
	if(this.rotation!=""){
		str.push(' rotation="'+this.rotation+'"');
	}
	if(this.lineSpacing!=""){
		str.push(' lineSpacing="'+this.lineSpacing+'"');
	}
	if(this.isStyledText=="true"){
		str.push(' isStyledText="'+this.isStyledText+'"');
	}
	if(this.markup!=""){
		str.push(' markup="'+this.markup+'"');
	}
	str.push('>');
	if(this.font!=null){
		 str.push(this.font.toXML());
	}
	if(this.paragraph!=null){
		 str.push(this.paragraph.toXML());
	}
	str.push('</textElement>');
	return str.join('');
}

dev.report.model.XGenericElement = function() {

	this.evaluationTime = "Now";

	this.evaluationGroup = "";

	this.reportElement =null;

	this.genericElementType=null ;

	this.genericElementParameter = {};

}
var _p = dev.report.model.XGenericElement.prototype;
_p.addGenericElementParameter=function(v){
	var _genericElementParameter=this.genericElementParameter;
	_genericElementParameter[v.id]=v;
	this.genericElementParameter=_genericElementParameter;
}
_p.removeGenericElementParameter==function(id) {
	delete this.genericElementParameter[id];
}
_p.getGenericElementParameter==function(id) {
    return this.genericElementParameter[id];
}
_p.init = function(Elements) {
	if(Elements.nodeName=='genericElement'){
		if(Elements.attributes.getNamedItem("evaluationTime")!=null){
			this.evaluationTime = Elements.attributes.getNamedItem("evaluationTime");
		}
		if(Elements.attributes.getNamedItem("evaluationGroup")!=null){
			this.evaluationGroup = Elements.attributes.getNamedItem("evaluationGroup");
		}
	 var Eles = Elements.childNodes; 
	 for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='reportElement'){
				  this.reportElement=new dev.report.model.XReportElement();
				  this.reportElement.init(Element);
			  }if(Element.nodeName=='genericElementType'){
				  this.genericElementType=new dev.report.model.XGenericElementType();
				  this.genericElementType.init(Element);;
			  }if(Element.nodeName=='genericElementParameter'){
				  var rp=new dev.report.model.XGenericElementParameter();
				  rp.init(Element);
				  this.addGenericElementParameter(rp);
			  }
	 }
}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<genericElement ');
	if(this.evaluationTime!=""){
		str.push(' evaluationTime="'+this.evaluationTime+'"');
	}
	if(this.evaluationGroup!=""){
		str.push(' evaluationGroup="'+this.evaluationGroup+'"');
	}
	str.push('>');
	if(this.reportElement!=null){
		str.push(this.reportElement[i].toXML());
	}
	if(this.genericElementType!=null){
		str.push(this.genericElementType[i].toXML());
	}
	for(var i=0;i<this.genericElementParameter.length;i++){
		str.push(this.genericElementParameter[i].toXML());
	}
	str.push('\n</genericElement>');
	return str.join('');
}

dev.report.model.XGenericElementParameter = function(name) {
	this.name = name;
	this.class1= "java.lang.Object";
	this.skipWhenNull = false;
	this.valueExpression = null;
}

var _p = dev.report.model.XGenericElementParameter.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='genericElementParameter'){
		this.name = Elements.attributes.getNamedItem("name");
		if(Elements.attributes.getNamedItem("class")!=null){
			this.class1 = Elements.attributes.getNamedItem("class").value;
		}
		if(Elements.attributes.getNamedItem("skipWhenNull")!=null){
			this.skipWhenNull = Elements.attributes.getNamedItem("skipWhenNull");
		}
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='valueExpression'){
				this.valueExpression=new dev.report.model.XValueExpression();
				this.valueExpression.init(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<genericElementParameter ');
	str.push(' name="'+this.name+'"');
	if(this.class1!=""){
		str.push(' class="'+this.class1+'"');
	}
	if(this.skipWhenNull!="false"){
		str.push(' skipWhenNull="'+this.skipWhenNull+'"');
	}
	str.push('>');
	if(this.valueExpression!=null){
		str.push(this.valueExpression.toXML());
	}
	str.push('\n</genericElementParameter>');
	return str.join('');
}
dev.report.model.XGenericElementType = function(namespace,name) {
	this.name = name;
	this.namespace = namespace;
}
var _p = dev.report.model.XGenericElementType.prototype;
_p.init = function(Elements) {
	this.subDataset = Elements.attributes.getNamedItem("name").value;
	this.namespace = Elements.attributes.getNamedItem("namespace").value
}
_p.toXML = function() {
	var str=[];
	str.push('\n<genericElementType ');
	str.push(' name="'+this.name+'"');
	str.push(' namespace="'+this.namespace+'"');
	str.push('>');
	str.push('</genericElementType>');
	return str.join('');
}

dev.report.model.XComponentElement = function() {
	this.reportElement = null;
	this.component = null;
}
var _p = dev.report.model.XComponentElement.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='componentElement'){
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='reportElement'){
				this.reportElement = new dev.report.model.XReportElement();
				this.reportElement.init(Element);
			  }
			  if(Element.nodeName=='component'){
				this.component = new dev.report.model.XComponent();
				this.component.init(Element);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<componentElement ');
	str.push('>');
	if(this.reportElement!=null){
		str.push(this.reportElement.toXML());
	}
	if(this.component!=null){
		str.push(this.component.toXML());
	}
	str.push('\n</componentElement>');
	return str.join('');
}

//-------------------------------------------------子表定义--------------------------------------------------------------
dev.report.model.XSubreport = function() {

	this.isUsingCache = true;

	this.runToBottom = false;

	this.reportElements = {};

	this.parametersMapExpression = null;

	this.connectionExpression = null;

	this.dataSourceExpression = null;

	this.returnValue = {};
	
	this.subreportExpression = null;

	this.subreportParameter = {};
}

var _p = dev.report.model.XSubreport.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.addReturnValue=function(v){
	var _returnValue=this.returnValue;
	_returnValue[v.id]=v;
	this.returnValue=_returnValue;
}
_p.removeReturnValue==function(id) {
	delete this.returnValue[id];
}
_p.getReturnValue==function(id) {
    return this.returnValue[id];
}
_p.addSubreportParameter=function(v){
	var _subreportParameter=this.subreportParameter;
	_subreportParameter[v.id]=v;
	this.subreportParameter=_subreportParameter;
}
_p.removeSubreportParameter==function(id) {
	delete this.subreportParameter[id];
}
_p.getSubreportParameter==function(id) {
    return this.subreportParameter[id];
}

_p.init = function(Elements) {
	if(Elements.nodeName=='subreport'){
		if(Elements.attributes.getNamedItem("isUsingCache")!=null){
			this.isUsingCache = Elements.attributes.getNamedItem("isUsingCache").value;
		}
		if(Elements.attributes.getNamedItem("runToBottom")!=null){
			this.runToBottom = Elements.attributes.getNamedItem("runToBottom").value;
		}
		var Eles=Elements.childNodes;
		for(var k=0;k<Elements.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='reportElement'){
				  var rp=new dev.report.model.XReportElement();
				  rp.init(Element);
				  this.reportElement.push(rp);
			  }
			  if(Element.nodeName=='parametersMapExpression'){
				var rp = Element.firstChild;
				this.parametersMapExpression.init(rp);
			  }
			  if(Element.nodeName=='subreportParameter'){
				  var rp=new dev.report.model.XSubreportParameter();
				  rp.init(Element);
				  this.subreportParameter.push(rp);
			  }
			  if(Element.nodeName=='connectionExpression'){
				var rp = Element.firstChild;
				this.connectionExpression.init(rp);
			  }
			  if(Element.nodeName=='dataSourceExpression'){
				var rp = Element.firstChild;
				this.dataSourceExpression.init(rp);
			  }
			  if(Element.nodeName=='subreportExpression'){
				var rp = Element.firstChild;
				this.subreportExpression.init(rp);
			  }
			  if(Element.nodeName=='returnValue'){
				  var rp=new dev.report.model.XReturnValue();
				  rp.init(Element);
				  this.returnValue.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<subreport ');	
	if(this.isUsingCache!="false"){
		str.push(' isUsingCache="'+this.isUsingCache+'"');
	}
	if(this.runToBottom!="false"){
		str.push(' runToBottom="'+this.runToBottom+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.reportElement.length;i++){
		 str.push(this.reportElement[i].toXML());
	}
	for(var i=0;i<this.subreportParameter.length;i++){
		 str.push(this.subreportParameter[i].toXML());
	}
	if(this.parametersMapExpression!=null){
		str.push(this.parametersMapExpression.toXML());
	}
	if(this.connectionExpression!=null){
		str.push(this.connectionExpression.toXML());
	}
	if(this.dataSourceExpression!=null){
		str.push(this.dataSourceExpression.toXML());
	}
	if(this.subreportExpression!=null){
		str.push(this.subreportExpression.toXML());
	}
	for(var i=0;i<this.returnValue.length;i++){
		str.push(this.returnValue.toXML());
	}
	str.push('\n</subreport>');
	return str.join('');
}

dev.report.model.XReturnValue = function() {
	this.subreportVariable = "";
	this.toVariable = "";
	this.calculation = "Nothing";
	/*
		Nothing:No calculations are performed.
		Count:Variable stores the number of the not null values returned from the subreport.
		DistinctCount:Variable stores the number of distinct not null values returned from the subreport.
		Sum:Variable stores the sum of the not null values returned from the subreport. Numeric variables only.
		Average:Variable stores the average of the not null values returned from the subreport. Numeric variables only.
		Lowest:Variable stores the lowest value returned from the subreport.
		Highest:Variable stores the highest value returned from the subreport.
		StandardDeviation:Variable stores the standard deviation of the not null values returned from the subreport. Numeric variables only.
		Variance:Variable stores the variance of the not null values returned from the subreport. Numeric variables only.
		First:Variable stores the first value encountered and ignores subsequent values.
	*/
	this.incrementerFactoryClass = "";
}
var _p = dev.report.model.XReturnValue.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='returnValue'){
		if(Elements.attributes.getNamedItem("subreportVariable")!=null){
			this.subreportVariable = Elements.attributes.getNamedItem("subreportVariable");
		}
		if(Elements.attributes.getNamedItem("toVariable")!=null){
			this.toVariable = Elements.attributes.getNamedItem("toVariable");
		}
		if(Elements.attributes.getNamedItem("calculation")!=null){
			this.calculation = Elements.attributes.getNamedItem("calculation");
		}
		if(gpElements.attributes.getNamedItem("incrementerFactoryClass")!=null){
			this.incrementerFactoryClass = Elements.attributes.getNamedItem("incrementerFactoryClass");
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<returnValue ');
	if(this.subreportVariable!=""){
		str.push(' subreportVariable="'+this.subreportVariable+'"');
	}
	if(this.toVariable!=""){
		str.push(' toVariable="'+this.toVariable+'"');
	}
	if(this.calculation!=""){
		str.push(' calculation="'+this.calculation+'"');
	}
	if(this.incrementerFactoryClass!=""){
		str.push(' incrementerFactoryClass="'+this.incrementerFactoryClass+'"');
	}
	str.push('>');
	str.push('\n</returnValue>');
	return str.join('');
}

dev.report.model.XParametersMapExpression = function() {

}

var _p = dev.report.model.XParametersMapExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<parametersMapExpression> ');

	str.push('\n</parametersMapExpression>');
	return str.join('');
}

dev.report.model.XDataSourceExpression = function() {

}

var _p = dev.report.model.XDataSourceExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<dataSourceExpression> ');

	str.push('\n</dataSourceExpression>');
	return str.join('');
}

dev.report.model.XSubreportExpression = function() {

	this.class1 = "";
	/*
	 * Name of the object property.
	 */
}

var _p = dev.report.model.XSubreportExpression.prototype;


_p.init = function(pExpressionElements) {
	 if(pExpressionElements.nodeName=='subreportExpression'){	
	  if(pExpressionElements.attributes.getNamedItem("class")!=null){
			this.class1 = pExpressionElements.attributes.getNamedItem("class").value;
	  }
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<subreportExpression ');
	if(this.class1!=null){
		str.push(' class="'+this.class1+'"');}
	str.push('>\n</subreportExpression>');
	return str.join('');
}
dev.report.model.XSubreportParameter = function(name) {
	this.name = name;
	this.subreportParameterExpression = null;
}

var _p = dev.report.model.XSubreportParameter.prototype;

_p.init = function(Elements) {
	 if(Elements.nodeName=='subreportParameter'){	

	 this.name = Elements.attributes.getNamedItem("name");
	 }
	 var Eles = Elements.childNodes; 
	 for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='subreportParameterExpression'){
				  var rp=Element.firstChild;
				  this.subreportParameterExpression.init(rp);
			  }
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<subreportParameter ');
	str.push(' name="'+this.name+'"');
	str.push('>\n');
	if(this.subreportParameterExpression!=null){
		str.push(this.subreportParameterExpression.toXML());
	}
	str.push('\n</subreportParameter>');
	return str.join('');
}
dev.report.model.XSubreportParameterExpression = function() {

}
var _p = dev.report.model.XSubreportParameterExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<subreportParameterExpression> ');

	str.push('\n</subreportParameterExpression>');
	return str.join('');
}
//------------------------------------------------------------------------------------------------------------------------------------
dev.report.model.XCrosstab = function() {

	this.isRepeatColumnHeaders = "true";
	/*
		true:The column headers will be reprinted after a page break.
		false:The column headers will be printed only on the page where the crosstab starts.
	*/
	
	this.isRepeatRowHeaders = "true";
	/*
		true:The row headers will be reprinted after a crosstab column break.
		false:The column headers will be printed for all rows only for the first set of columns and not after a column break.
	*/

	this.columnBreakOffset = 10;

	this.runDirection = "LTR";
	/*
		LTR:Left to right run direction.
		RTL:Right to left run direction.
	*/

	this.ignoreWidth = "";

	this.reportElements = {};

	this.box = null;

	this.crosstabParameter = {};

	this.parametersMapExpression = null;

	this.crosstabDataset = null;

	this.crosstabHeaderCell = null;

	this.rowGroup = {};

	this.columnGroup = {};

	this.measure = {};

	this.crosstabCell = {};
	
	this.whenNoDataCell = null;
}

var _p = dev.report.model.XCrosstab.prototype;
_p.addReportElement=function(v){
	var _reportElement=this.reportElements;
	_reportElement[v.id]=v;
	this.reportElements=_reportElement;
}
_p.removeReportElement==function(id) {
	delete this.reportElements[id];
}
_p.getReportElement==function(id) {
    return this.reportElements[id];
}
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstab'){
		if(Elements.attributes.getNamedItem("isRepeatColumnHeaders")!=null){
			this.isRepeatColumnHeaders = Elements.attributes.getNamedItem("isRepeatColumnHeaders").value;
		}
		if(Elements.attributes.getNamedItem("isRepeatRowHeaders")!=null){
			this.isRepeatRowHeaders = Elements.attributes.getNamedItem("isRepeatRowHeaders").value;
		}
		if(Elements.attributes.getNamedItem("columnBreakOffset")!=null){
			this.columnBreakOffset = Elements.attributes.getNamedItem("columnBreakOffset").value;
		}
		if(Elements.attributes.getNamedItem("runDirection")!=null){
			this.runDirection = Elements.attributes.getNamedItem("runDirection").value;
		}
		if(Elements.attributes.getNamedItem("ignoreWidth")!=null){
			this.ignoreWidth = Elements.attributes.getNamedItem("ignoreWidth").value;
		}
		var Eles=Elements.childNodes;

		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='reportElement'){
				  var rp=new dev.report.model.XReportElement();
				  rp.init(Element);
				  this.reportElement.push(rp);
			  }
			  if(Element.nodeName=='box'){
				var rp = Element.firstChild;
				this.box.init(rp);
			  }
			  if(Element.nodeName=='crosstabParameter'){
				  var rp=new dev.report.model.XCrosstabParameter();
				  rp.init(Element);
				  this.crosstabParameter.push(rp);
			  }
			  if(Element.nodeName=='parametersMapExpression'){
				var rp = Element.firstChild;
				this.parametersMapExpression.init(rp);
			  }
			  if(Element.nodeName=='crosstabDataset'){
				var rp = Element.firstChild;
				this.crosstabDataset.init(rp);
			  }
			  if(Element.nodeName=='crosstabHeaderCell'){
				var rp = Element.firstChild;
				this.crosstabHeaderCell.init(rp);
			  }
			  if(Element.nodeName=='rowGroup'){
				  var rp=new dev.report.model.XRowGroup();
				  rp.init(Element);
				  this.rowGroup.push(rp);
			  }
			  if(Element.nodeName=='columnGroup'){
				  var rp=new dev.report.model.XColumnGroup();
				  rp.init(Element);
				  this.columnGroup.push(rp);
			  }
			  if(Element.nodeName=='measure'){
				  var rp=new dev.report.model.XMeasure();
				  rp.init(Element);
				  this.measure.push(rp);
			  }
			  if(Element.nodeName=='crosstabCell'){
				  var rp=new dev.report.model.XCrosstabCell();
				  rp.init(Element);
				  this.crosstabCell.push(rp);
			  }
			  if(Element.nodeName=='whenNoDataCell'){
				var rp = Element.firstChild;
				this.whenNoDataCell.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<crosstab ');
	if(this.isRepeatColumnHeaders!="false"){
		str.push(' isRepeatColumnHeaders="'+this.isRepeatColumnHeaders+'"');
	}
	if(this.isRepeatRowHeaders!="false"){
		str.push(' isRepeatRowHeaders="'+this.isRepeatRowHeaders+'"');
	}
	if(this.columnBreakOffset!=0){
		str.push(' columnBreakOffset="'+this.columnBreakOffset+'"');
	}
	if(this.runDirection!=""){
		str.push(' runDirection="'+this.runDirection+'"');
	}
	if(this.ignoreWidth!="false"){
		str.push(' ignoreWidth="'+this.ignoreWidth+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.reportElement.length;i++){
		 str.push(this.reportElement[i].toXML());
	}
	if(this.box!=null){
		str.push(this.box.toXML());
	}
	for(var i=0;i<this.crosstabParameter.length;i++){
		 str.push(this.crosstabParameter[i].toXML());
	}
	if(this.parametersMapExpression!=null){
		str.push(this.parametersMapExpression.toXML());
	}
	if(this.crosstabDataset!=null){
		str.push(this.crosstabDataset.toXML());
	}
	if(this.crosstabHeaderCell!=null){
		str.push(this.crosstabHeaderCell.toXML());
	}
	for(var i=0;i<this.rowGroup.length;i++){
		 str.push(this.rowGroup[i].toXML());
	}
	for(var i=0;i<this.columnGroup.length;i++){
		 str.push(this.columnGroup[i].toXML());
	}
	for(var i=0;i<this.measure.length;i++){
		 str.push(this.measure[i].toXML());
	}
	for(var i=0;i<this.crosstabCell.length;i++){
		 str.push(this.crosstabCell[i].toXML());
	}
	if(this.whenNoDataCell!=null){
		str.push(this.whenNoDataCell.toXML());
	}
	str.push('\n</crosstab>');
	return str.join('');
}
dev.report.model.XCrosstabParameter = function(name) {
	this.name = name;
	this.class1 = "java.lang.String";
	this.parameterValueExpression = null;
}

var _p = dev.report.model.XCrosstabParameter.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabParameter'){
		this.subDataset = Elements.attributes.getNamedItem("name");
		if(Elements.attributes.getNamedItem("class")!=null){
			this.class1 = Elements.attributes.getNamedItem("class")
		}
		var Eles=Elements.childNodes;

		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='parameterValueExpression'){
				var rp = Element.firstChild;
				this.parameterValueExpression.init(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabParameter ');
	str.push(' name="'+this.name+'"');
	if(this.class1!=""){
		str.push(' class="'+this.class1+'"');
	}
	str.push('>\n');
	if(this.parameterValueExpression!=null){
		str.push(this.parameterValueExpression.toXML());
	}
	str.push('\n</crosstabParameter>');
	return str.join('');
}
dev.report.model.XParameterValueExpression = function() {

}
var _p = dev.report.model.XParameterValueExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<parameterValueExpression> ');

	str.push('\n</parameterValueExpression>');
	return str.join('');
}

dev.report.model.XCrosstabDataset = function() {

	this.isDataPreSorted = "false";
	/*
		true:The calculation engine will assume that the data is presorted.  If the data is not presorted, the outcome is undefined.
		false:The crosstab dataset data is not presorted.
	*/
	this.dataset = null;
}

var _p = dev.report.model.XCrosstabDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabDataset'){
		if(Elements.attributes.getNamedItem("isDataPreSorted")!=null){
			this.isDataPreSorted = Elements.attributes.getNamedItem("isDataPreSorted").value;
		}
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabDataset ');
	if(this.isDataPreSorted!="false"){
		str.push(' isDataPreSorted="'+this.isDataPreSorted+'"');
	}
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	str.push('\n</crosstabDataset>');
	return str.join('');
}

dev.report.model.XDataset = function() {

	this.resetType = "";

	this.resetGroup = "";

	this.incrementType = "";

	this.incrementGroup = "";

	this.incrementWhenExpression = null;

	this.datasetRun = null;
}

var _p = dev.report.model.XDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='dataset'){
		if(Elements.attributes.getNamedItem("resetType")!=null){
			this.resetType = Elements.attributes.getNamedItem("resetType");
		}
		if(Elements.attributes.getNamedItem("resetGroup")!=null){
			this.resetGroup = Elements.attributes.getNamedItem("resetGroup");
		}
		if(Elements.attributes.getNamedItem("incrementType")!=null){
			this.incrementType = Elements.attributes.getNamedItem("incrementType");
		}
		if(Elements.attributes.getNamedItem("incrementGroup")!=null){
			this.incrementGroup = Elements.attributes.getNamedItem("incrementGroup");
		}
		var Eles=Elements.childNodes;

		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='incrementWhenExpression'){
				var rp = Element.firstChild;
				this.incrementWhenExpression.init(rp);
			  }
			  if(Element.nodeName=='datasetRun'){
				var rp = Element.firstChild;
				this.datasetRun.init(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<dataset ');
	if(this.isShowLabels!="false"){
		str.push(' isShowLabels="'+this.isShowLabels+'"');
	}
	if(this.isCircular!="false"){
		str.push(' isCircular="'+this.isCircular+'"');
	}
	if(this.labelFormat!=""){
		str.push(' labelFormat="'+this.labelFormat+'"');
	}
	if(this.legendLabelFormat!=""){
		str.push(' legendLabelFormat="'+this.legendLabelFormat+'"');
	}
	str.push('>\n');
	if(this.incrementWhenExpression!=null){
		str.push(this.incrementWhenExpression.toXML());
	}
	if(this.datasetRun!=null){
		str.push(this.datasetRun.toXML());
	}
	str.push('\n</dataset>');
	return str.join('');
}
dev.report.model.XIncrementWhenExpression = function() {

}
var _p = dev.report.model.XIncrementWhenExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<incrementWhenExpression> ');

	str.push('\n</incrementWhenExpression>');
	return str.join('');
}

dev.report.model.XDatasetRun = function(subDataset) {

	this.subDataset = subDataset;

	this.parametersMapExpression = null;

	this.connectionExpression = null;

	this.dataSourceExpression = null;

	this.datasetParameter = {};
}

var _p = dev.report.model.XDatasetRun.prototype;
_p.setSubDataset = function(subDataset){
	this.subDataset = subDataset;
}
_p.getSubDataset = function(){
	return this.subDataset;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='datasetRun'){
		this.subDataset = Elements.attributes.getNamedItem("subDataset");
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='datasetParameter'){
				var rp = new dev.report.model.XDatasetParameter();
				rp.init(Element);
				this.datasetParameter.push(rp);
			  }
			  if(Element.nodeName=='parametersMapExpression'){
				var rp = Element.firstChild;
				this.parametersMapExpression.init(rp);
			  }
			  if(Element.nodeName=='connectionExpression'){
				var rp = Element.firstChild;
				this.connectionExpression.init(rp);
			  }
			  if(Element.nodeName=='dataSourceExpression'){
				var rp = Element.firstChild;
				this.dataSourceExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<datasetRun ');
	str.push(' subDataset="'+this.subDataset+'"');
	str.push('>\n');
	if(this.parametersMapExpression!=null){
		str.push(this.parametersMapExpression.toXML());
	}
	for(var i=0;i<this.datasetParameter.length;i++){
		str.push(this.datasetParameter[i].toXML());
	}
	if(this.connectionExpression!=null){
		str.push(this.connectionExpression.toXML());
	}
	if(this.dataSourceExpression!=null){
		str.push(this.dataSourceExpression.toXML());
	}
	str.push('\n</datasetRun>');
	return str.join('');
}
dev.report.model.XDatasetParameter = function(name) {
	this.name = name;
	this.datasetParameterExpression = null;
}

var _p = dev.report.model.XDatasetParameter.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='datasetParameter'){
		this.name = Elements.attributes.getNamedItem("name");
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='datasetParameterExpression'){
				var rp = Element.firstChild;
				this.datasetParameterExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<datasetParameter ');
	str.push(' name="'+this.name+'"');
	str.push('>\n');
	if(this.datasetParameterExpression!=null){
		str.push(this.datasetParameterExpression.toXML());
	}
	str.push('\n</datasetParameter>');
	return str.join('');
}
dev.report.model.XDatasetParameterExpression = function() {

}
var _p = dev.report.model.XDatasetParameterExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<datasetParameterExpression> ');

	str.push('\n</datasetParameterExpression>');
	return str.join('');
}

dev.report.model.XCrosstabHeaderCell = function() {
	this.cellContents = [];
}
var _p = dev.report.model.XCrosstabHeaderCell.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabHeaderCell'){
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='cellContents'){
				var rp = new dev.report.model.XCellContents();
				rp.init(Element);
				this.cellContents.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabHeaderCell ');
	str.push('>\n');
	for(var i=0;i<this.cellContents.length;i++){
		str.push(this.cellContents[i].toXML());
	}
	str.push('\n</crosstabHeaderCell>');
	return str.join('');
}
dev.report.model.XCrosstabColumnHeader = function() {
	this.cellContents = [];
}
var _p = dev.report.model.XCrosstabColumnHeader.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabColumnHeader'){
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='cellContents'){
				var rp = new dev.report.model.XCellContents();
				rp.init(Element);
				this.cellContents.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabColumnHeader ');
	str.push('>\n');
	for(var i=0;i<this.cellContents.length;i++){
		str.push(this.cellContents[i].toXML());
	}
	str.push('\n</crosstabColumnHeader>');
	return str.join('');
}
dev.report.model.XCrosstabRowHeader = function() {
	this.cellContents = [];
}
var _p = dev.report.model.XCrosstabRowHeader.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabRowHeader'){
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='cellContents'){
				var rp = new dev.report.model.XCellContents();
				rp.init(Element);
				this.cellContents.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabRowHeader ');
	str.push('>\n');
	for(var i=0;i<this.cellContents.length;i++){
		str.push(this.cellContents[i].toXML());
	}
	str.push('\n</crosstabRowHeader>');
	return str.join('');
}
dev.report.model.XCrosstabCell = function() {

	this.width = "";

	this.height = "";

	this.rowTotalGroup = "";
	
	this.columnTotalGroup = "";

	this.cellContents = null;

}

var _p = dev.report.model.XCrosstabCell.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabCell'){

		if(Elements.attributes.getNamedItem("width")!=null){
			this.width = Elements.attributes.getNamedItem("width");
		}
		if(Elements.attributes.getNamedItem("height")!=null){
			this.height = Elements.attributes.getNamedItem("height");
		}
		if(Elements.attributes.getNamedItem("rowTotalGroup")!=null){
			this.rowTotalGroup = Elements.attributes.getNamedItem("rowTotalGroup");
		}
		if(Elements.attributes.getNamedItem("columnTotalGroup")!=null){
			this.columnTotalGroup = Elements.attributes.getNamedItem("columnTotalGroup");
		}

		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  
			  if(Element.nodeName=='cellContents'){
				var rp = Element.firstChild;
				this.cellContents.init(rp);
			  }
	 }
	}
}

_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabCell ');
	if(this.width!=0){
		str.push(' width="'+this.width+'"');
	}
	if(this.height!=0){
		str.push(' height="'+this.height+'"');
	}
	if(this.rowTotalGroup!=""){
		str.push(' rowTotalGroup="'+this.rowTotalGroup+'"');
	}
	if(this.columnTotalGroup!=""){
		str.push(' columnTotalGroup="'+this.columnTotalGroup+'"');
	}
	str.push('>\n');
	if(this.cellContents!=null){
		str.push(this.cellContents.toXML());
	}
	str.push('\n</crosstabCell>');
	return str.join('');
}
dev.report.model.XCrosstabTotalColumnHeader = function() {
	this.cellContents = [];
}
var _p = dev.report.model.XCrosstabTotalColumnHeader.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabTotalColumnHeader'){
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='cellContents'){
				var rp = new dev.report.model.XCellContents();
				rp.init(Element);
				this.cellContents.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabTotalColumnHeader ');
	str.push('>\n');
	for(var i=0;i<this.cellContents.length;i++){
		str.push(this.cellContents[i].toXML());
	}
	str.push('\n</crosstabTotalColumnHeader>');
	return str.join('');
}
dev.report.model.XCrosstabTotalRowHeader = function() {
	this.cellContents = [];
}
var _p = dev.report.model.XCrosstabTotalRowHeader.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='crosstabTotalRowHeader'){
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='cellContents'){
				var rp = new dev.report.model.XCellContents();
				rp.init(Element);
				this.cellContents.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<crosstabTotalRowHeader ');
	str.push('>\n');
	for(var i=0;i<this.cellContents.length;i++){
		str.push(this.cellContents[i].toXML());
	}
	str.push('\n</crosstabTotalRowHeader>');
	return str.join('');
}
dev.report.model.XWhenNoDataCell = function() {
	this.cellContents = [];
}
var _p = dev.report.model.XWhenNoDataCell.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='whenNoDataCell'){
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='cellContents'){
				var rp = new dev.report.model.XCellContents();
				rp.init(Element);
				this.cellContents.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<whenNoDataCell ');
	str.push('>\n');
	for(var i=0;i<this.cellContents.length;i++){
		str.push(this.cellContents[i].toXML());
	}
	str.push('\n</whenNoDataCell>');
	return str.join('');
}
dev.report.model.XCellContents = function(name) {

	this.backcolor = "";

	this.mode = "";

	this.style = "";

	this.box = null;

	this.line = [];

	this.rectangle = [];

	this.ellipse = [];

	this.image = [];

	this.staticText = [];

	this.textField = [];

	this.elementGroup = [];

	this.frame = [];

	this.componentElement = [];

	this.genericElement = [];
}

var _p = dev.report.model.XCellContents.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='cellContents'){
		if(Elements.attributes.getNamedItem("backcolor")!=null){
			this.backcolor = Elements.attributes.getNamedItem("backcolor");
		}
		if(Elements.attributes.getNamedItem("mode")!=null){
			this.mode = Elements.attributes.getNamedItem("mode");
		}
		if(Elements.attributes.getNamedItem("style")!=null){
			this.style = Elements.attributes.getNamedItem("style");
		}
	 var Eles = Elements.childNodes; 
	 for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='box'){
				  var rp= Element.firstChild;
				  this.box.init(rp);
			  }
			  if(Element.nodeName=='line'){
				  var rp=new dev.report.model.XLine();
				  rp.init(Element);
				  this.line.push(rp);
			  }if(Element.nodeName=='rectangle'){
				  var rp=new dev.report.model.XRectangle();
				  rp.init(Element);
				  this.rectangle.push(rp);
			  }if(Element.nodeName=='ellipse'){
				  var rp=new dev.report.model.XEllipse();
				  rp.init(Element);
				  this.ellipse.push(rp);
			  }if(Element.nodeName=='image'){
				  var rp=new dev.report.model.XImage();
				  rp.init(Element);
				  this.image.push(rp);
			  }if(Element.nodeName=='staticText'){
				  var rp=new dev.report.model.XStaticText();
				  rp.init(Element);
				  this.staticText.push(rp);
			  }if(Element.nodeName=='textField'){
				  var rp=new dev.report.model.XTextField();
				  rp.init(Element);
				  this.textField.push(rp);
			  }
			  if(Element.nodeName=='genericElement'){
				  var rp=new dev.report.model.XGenericElement();
				  rp.init(Element);
				  this.genericElement.push(rp);
			  }
			  if(Element.nodeName=='elementGroup'){
				  var rp=new dev.report.model.XElementGroup();
				  rp.init(Element);
				  this.elementGroup.push(rp);
			  }
			  if(Element.nodeName=='frame'){
				  var rp=new dev.report.model.XFrame();
				  rp.init(Element);
				  this.frame.push(rp);
			  }
			  if(Element.nodeName=='componentElement'){
				  var rp=new dev.report.model.XComponentElement();
				  rp.init(Element);
				  this.componentElement.push(rp);
			  }
	 }
}
}
_p.toXML = function() {
	var str=[];
	str.push('\n<cellContents ');
	if(this.backcolor!=""){
		str.push(' backcolor="'+this.backcolor+'"');
	}
	if(this.mode!=""){
		str.push(' mode="'+this.mode+'"');
	}
	if(this.style!=""){
		str.push(' style="'+this.style+'"');
	}
	str.push('>\n');
	if(this.box!=null){
		str.push(this.box.toXML());
	}
	for(var i=0;i<this.line.length;i++){
		str.push(this.line[i].toXML());
	}
	for(var i=0;i<this.rectangle.length;i++){
		str.push(this.rectangle[i].toXML());
	}
	for(var i=0;i<this.ellipse.length;i++){
		str.push(this.ellipse[i].toXML());
	}
	for(var i=0;i<this.image.length;i++){
		str.push(this.image[i].toXML());
	}
	for(var i=0;i<this.staticText.length;i++){
		str.push(this.staticText[i].toXML());
	}
	for(var i=0;i<this.textField.length;i++){
		str.push(this.textField[i].toXML());
	}
	for(var i=0;i<this.elementGroup.length;i++){
		str.push(this.elementGroup[i].toXML());
	}
	for(var i=0;i<this.frame.length;i++){
		str.push(this.frame[i].toXML());
	}
	for(var i=0;i<this.componentElement.length;i++){
		str.push(this.componentElement[i].toXML());
	}
	for(var i=0;i<this.genericElement.length;i++){
		str.push(this.genericElement[i].toXML());
	}
	str.push('\n</cellContents>');
	return str.join('');
}

dev.report.model.XColumnGroup = function(name,height) {

	this.name = name;
	
	this.height = height;

	this.totalPosition = "None";
	/*
		Start:The total row will be displayed before the group rows.
		End:The total row will be displayed after the group rows.
		None:The total row will not be displayed.
	*/

	this.headerPosition = "Top";
	/*
		Top:The contents will be rendered at the top of the header.
		Middle:The contents will be rendered on the center of the header.
		Bottom:The contents will be rendered at the bottom of the header.
		Stretch:The contents will be proportionally stretched to the new header height.
	*/


	this.bucket = [];

	this.crosstabColumnHeader = null;

	this.crosstabTotalColumnHeader = null;
}

var _p = dev.report.model.XColumnGroup.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='columnGroup'){
		this.name = Elements.attributes.getNamedItem("name");

		this.width = Elements.attributes.getNamedItem("height");

		if(Elements.attributes.getNamedItem("totalPosition")!=null){
			this.totalPosition = Elements.attributes.getNamedItem("totalPosition");
		}
		if(Elements.attributes.getNamedItem("headerPosition")!=null){
			this.headerPosition = Elements.attributes.getNamedItem("headerPosition");
		}
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='bucket'){
				  var rp=new dev.report.model.XBucket();
				  rp.init(Element);
				  this.bucket.push(rp);
			  }
			  if(Element.nodeName=='crosstabColumnHeader'){
				var rp = Element.firstChild;
				this.crosstabColumnHeader.init(rp);
			  }
			  
			  if(Element.nodeName=='crosstabTotalColumnHeader'){
				var rp = Element.firstChild;
				this.crosstabTotalColumnHeader.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<columnGroup ');
	str.push(' name="'+this.name+'"');
	str.push(' height="'+this.height+'"');
	if(this.totalPosition!=""){
		str.push(' totalPosition="'+this.totalPosition+'"');
	}
	if(this.headerPosition!=""){
		str.push(' headerPosition="'+this.headerPosition+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.bucket.length;i++){
		 str.push(this.bucket[i].toXML());
	}
	if(this.crosstabColumnHeader!=null){
		str.push(this.crosstabColumnHeader.toXML());
	}
	if(this.crosstabTotalColumnHeader!=null){
		str.push(this.crosstabTotalColumnHeader.toXML());
	}
	str.push('\n</columnGroup>');
	return str.join('');
}

dev.report.model.XRowGroup = function(name,width) {

	this.name = name;
	
	this.width = width;

	this.totalPosition = "None";
	/*
		Start:The total row will be displayed before the group rows.
		End:The total row will be displayed after the group rows.
		None:The total row will not be displayed.
	*/

	this.headerPosition = "Top";
	/*
		Top:The contents will be rendered at the top of the header.
		Middle:The contents will be rendered on the center of the header.
		Bottom:The contents will be rendered at the bottom of the header.
		Stretch:The contents will be proportionally stretched to the new header height.
	*/


	this.bucket = [];

	this.crosstabRowHeader = null;

	this.crosstabTotalRowHeader = null;
}
var _p = dev.report.model.XRowGroup.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='rowGroup'){
		this.name = Elements.attributes.getNamedItem("name");

		this.width = Elements.attributes.getNamedItem("width");

		if(Elements.attributes.getNamedItem("totalPosition")!=null){
			this.totalPosition = Elements.attributes.getNamedItem("totalPosition");
		}
		if(Elements.attributes.getNamedItem("headerPosition")!=null){
			this.headerPosition = Elements.attributes.getNamedItem("headerPosition");
		}
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='bucket'){
				  var rp=new dev.report.model.XBucket();
				  rp.init(Element);
				  this.bucket.push(rp);
			  }
			  if(Element.nodeName=='crosstabRowHeader'){
				var rp = Element.firstChild;
				this.crosstabRowHeader.init(rp);
			  }
			  
			  if(Element.nodeName=='crosstabTotalRowHeader'){
				var rp = Element.firstChild;
				this.crosstabTotalRowHeader.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<rowGroup ');
	str.push(' name="'+this.name+'"');
	str.push(' width="'+this.width+'"');
	if(this.totalPosition!=""){
		str.push(' totalPosition="'+this.totalPosition+'"');
	}
	if(this.headerPosition!=""){
		str.push(' headerPosition="'+this.headerPosition+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.bucket.length;i++){
		 str.push(this.bucket[i].toXML());
	}
	if(this.crosstabRowHeader!=null){
		str.push(this.crosstabRowHeader.toXML());
	}
	if(this.crosstabTotalRowHeader!=null){
		str.push(this.crosstabTotalRowHeader.toXML());
	}
	str.push('\n</rowGroup>');
	return str.join('');
}
dev.report.model.XBucket = function() {

	this.class1 = "java.lang.String";

	this.order = "Ascending";
	/*
		Ascending:The buckets will be sorted in ascending order by using the specified comparator or by the natural order if no comparator specified.
		Descending:The buckets will be sorted in descending order by using the specified comparator or by the natural order if no comparator specified.
	*/
	this.bucketExpression = null;
	this.orderByExpression = null;
	this.comparatorExpression = null;
}

var _p = dev.report.model.XBucket.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='bucket'){

		if(Elements.attributes.getNamedItem("class")!=null){
			this.class1 = Elements.attributes.getNamedItem("class").value;
		}
		if(Elements.attributes.getNamedItem("order")!=null){
			this.order = Elements.attributes.getNamedItem("order").value;
		}
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='bucketExpression'){
				var rp = Element.firstChild;
				this.bucketExpression.init(rp);
			  }
			  if(Element.nodeName=='orderByExpression'){
				var rp = Element.firstChild;
				this.orderByExpression.init(rp);
			  }
			  if(Element.nodeName=='comparatorExpression'){
				var rp = Element.firstChild;
				this.comparatorExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<bucket ');
	if(this.class1!=""){
		str.push(' class="'+this.class1+'"');
	}
	if(this.order!=""){
		str.push(' order="'+this.order+'"');
	}
	str.push('>\n');
	if(this.bucketExpression!=null){
		str.push(this.bucketExpression.toXML());
	}
	if(this.orderByExpression!=null){
		str.push(this.orderByExpression.toXML());
	}
	if(this.comparatorExpression!=null){
		str.push(this.comparatorExpression.toXML());
	}
	str.push('\n</bucket>');
	return str.join('');
}
dev.report.model.XBucketExpression = function() {
	this.class1 = "java.lang.String";

}
var _p = dev.report.model.XBucketExpression.prototype;
_p.setClass1 = function(class1){
	this.class1 = class1;
}
_p.getClass1 = function(){
	return this.class1;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='bucketExpression'){

		if(Elements.attributes.getNamedItem("class")!=null){
			this.class1 = Elements.attributes.getNamedItem("class");
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<bucketExpression ');
	if(this.class1!=""){
		str.push(' class="'+this.class1+'"');
	}
	str.push('\n</bucketExpression>');
	return str.join('');
}
dev.report.model.XOrderByExpression = function() {

	this.class1 = "java.lang.String";

}

var _p = dev.report.model.XOrderByExpression.prototype;
_p.setClass1 = function(class1){
	this.class1 = class1;
}
_p.getClass1 = function(){
	return this.class1;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='orderByExpression'){

		if(Elements.attributes.getNamedItem("class")!=null){
			this.class1 = Elements.attributes.getNamedItem("class");
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<orderByExpression ');
	if(this.class1!=""){
		str.push(' class="'+this.class1+'"');
	}
	str.push('\n</orderByExpression>');
	return str.join('');
}
dev.report.model.XComparatorExpression = function() {

}
var _p = dev.report.model.XComparatorExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<comparatorExpression> ');
	str.push('\n</comparatorExpression>');
	return str.join('');
}

dev.report.model.XMeasure = function(name) {

	this.name = name;

	this.class1 = "";

	this.calculation = "Nothing";
	/*
		Nothing:No calculations are performed.
		Count:Variable stores the number of the not null values returned from the subreport.
		DistinctCount:Variable stores the number of distinct not null values returned from the subreport.
		Sum:Variable stores the sum of the not null values returned from the subreport. Numeric variables only.
		Average:Variable stores the average of the not null values returned from the subreport. Numeric variables only.
		Lowest:Variable stores the lowest value returned from the subreport.
		Highest:Variable stores the highest value returned from the subreport.
		StandardDeviation:Variable stores the standard deviation of the not null values returned from the subreport. Numeric variables only.
		Variance:Variable stores the variance of the not null values returned from the subreport. Numeric variables only.
		First:Variable stores the first value encountered and ignores subsequent values.
	*/
	
	this.incrementerFactoryClass = "";

	this.percentageOf = "None";
	/*
		None:The value will not be calculated as a percentage.
		GrandTotal:The value will be calculated as percentage of the grand total value.
	*/
	this.percentageCalculatorClass = "";


	this.measureExpression = null;

}

var _p = dev.report.model.XMeasure.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='measure'){
		this.name = Elements.attributes.getNamedItem("name");

		if(Elements.attributes.getNamedItem("class")!=null){
			this.class1 = Elements.attributes.getNamedItem("class").value;
		}
		if(Elements.attributes.getNamedItem("percentageOf")!=null){
			this.percentageOf = Elements.attributes.getNamedItem("percentageOf");
		}
		if(Elements.attributes.getNamedItem("percentageCalculatorClass")!=null){
			this.percentageCalculatorClass = Elements.attributes.getNamedItem("percentageCalculatorClass");
		}
		if(Elements.attributes.getNamedItem("calculation")!=null){
			this.calculation = Elements.attributes.getNamedItem("calculation");
		}
		if(gpElements.attributes.getNamedItem("incrementerFactoryClass")!=null){
			this.incrementerFactoryClass = Elements.attributes.getNamedItem("incrementerFactoryClass");
		}
		var Eles=Elements.childNodes;
		for(var k=0;k<Eles.length;k++){
			  var Element=Eles[k];
			  if(Element.nodeName=='measureExpression'){
				var rp = Element.firstChild;
				this.measureExpression.init(rp);
			  }
	 }
	}
}

_p.toXML = function() {
	var str=[];
	str.push('\n<measure ');
	str.push(' name="'+this.name+'"');
	if(this.class1!=""){
		str.push(' class="'+this.class1+'"');
	}
	if(this.calculation!=""){
		str.push(' calculation="'+this.calculation+'"');
	}
	if(this.incrementerFactoryClass!=""){
		str.push(' incrementerFactoryClass="'+this.incrementerFactoryClass+'"');
	}
	if(this.percentageOf!=""){
		str.push(' percentageOf="'+this.percentageOf+'"');
	}
	if(this.percentageCalculatorClass!=""){
		str.push(' percentageCalculatorClass="'+this.percentageCalculatorClass+'"');
	}
	str.push('>\n');
	if(this.measureExpression!=null){
		str.push(this.measureExpression.toXML());
	}
	str.push('\n</measure>');
	return str.join('');
}
dev.report.model.XMeasureExpression = function() {

}
var _p = dev.report.model.XMeasureExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<measureExpression> ');

	str.push('\n</measureExpression>');
	return str.join('');
}