
dev.report.model.XChart = function() {

	this.isShowLegend = "";
	
	this.evaluationTime = "Now";

	this.evaluationGroup = "";

	this.hyperlinkType = "";

	this.hyperlinkTarget = "";

	this.bookmarkLevel = "";

	this.customizerClass ="";

	this.renderType = "";

	this.theme = "";


	this.chartTitle = null;

	this.reportElement = [];

	this.box = null;

	this.chartSubtitle = null;

	this.chartLegend = null;

	this.anchorNameExpression = null;

	this.hyperlinkReferenceExpression = null;

	this.hyperlinkAnchorExpression = null;

	this.hyperlinkPageExpression = null;

	this.hyperlinkTooltipExpression = null;

	this.hyperlinkParameter = [];
}

var _p = dev.report.model.XChart.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='chart'){
		if(Elements.attributes.getNamedItem("isShowLegend")!=null){
			this.isShowLegend = Elements.attributes.getNamedItem("isShowLegend");
		}
		if(Elements.attributes.getNamedItem("evaluationTime")!=null){
			this.evaluationTime = Elements.attributes.getNamedItem("evaluationTime");
		}
		if(Elements.attributes.getNamedItem("evaluationGroup")!=null){
			this.evaluationGroup = Elements.attributes.getNamedItem("evaluationGroup");
		}
		if(Elements.attributes.getNamedItem("hyperlinkType")!=null){
			this.hyperlinkType = Elements.attributes.getNamedItem("hyperlinkType");
		}
		if(Elements.attributes.getNamedItem("hyperlinkTarget")!=null){
			this.hyperlinkTarget = Elements.attributes.getNamedItem("hyperlinkTarget");
		}
		if(Elements.attributes.getNamedItem("bookmarkLevel")!=null){
			this.bookmarkLevel = Elements.attributes.getNamedItem("bookmarkLevel");
		}
		if(Elements.attributes.getNamedItem("customizerClass")!=null){
			this.customizerClass = Elements.attributes.getNamedItem("customizerClass");
		}
		if(Elements.attributes.getNamedItem("renderType")!=null){
			this.renderType = Elements.attributes.getNamedItem("renderType");
		}
		if(Elements.attributes.getNamedItem("theme")!=null){
			this.theme = Elements.attributes.getNamedItem("theme");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='reportElement'){
				  var rp=new dev.report.model.XReportElement();
				  rp.init(Element);
				  this.reportElement.push(rp);
			  }
			  if(Element.nodeName=='box'){
				var rp = Element.firstChild;
				this.box.init(rp);
			  }
			  if(Element.nodeName=='chartTitle'){
				var rp = Element.firstChild;
				this.chartTitle.init(rp);
			  }
			  if(Element.nodeName=='chartSubtitle'){
				var rp = Element.firstChild;
				this.chartSubtitle.init(rp);
			  }
			  if(Element.nodeName=='chartLegend'){
				var rp = Element.firstChild;
				this.chartLegend.init(rp);
			  }
			  if(Element.nodeName=='anchorNameExpression'){
				var rp = Element.firstChild;
				this.anchorNameExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkReferenceExpression'){
				var rp = Element.firstChild;
				this.hyperlinkReferenceExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkAnchorExpression'){
				var rp = Element.firstChild;
				this.hyperlinkAnchorExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkPageExpression'){
				var rp = Element.firstChild;
				this.hyperlinkPageExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkTooltipExpression'){
				var rp = Element.firstChild;
				this.hyperlinkTooltipExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkParameter'){
				  var rp=new dev.report.model.XHyperlinkParameter();
				  rp.init(Element);
				  this.hyperlinkParameter.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<chart ');
	if(this.isShowLegend!="false"){
		str.push(' isShowLegend="'+this.isShowLegend+'"');
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
	if(this.customizerClass!=""){
		str.push(' customizerClass="'+this.customizerClass+'"');
	}
	if(this.renderType!=""){
		str.push(' renderType="'+this.renderType+'"');
	}
	if(this.theme!=""){
		str.push(' theme="'+this.theme+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.reportElement.length;i++){
		 str.push(this.reportElement[i].toXML());
	}
	if(this.box!=null){
		str.push(this.box.toXML());
	}
	if(this.chartTitle!=null){
		str.push(this.chartTitle.toXML());
	}
	if(this.chartSubtitle!=null){
		str.push(this.chartSubtitle.toXML());
	}
	if(this.chartLegend!=null){
		str.push(this.chartLegend.toXML());
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
		str.push(this.hyperlinkParameter.toXML());
	}
	str.push('\n</chart>');
	return str.join('');
}

dev.report.model.XChartTitle = function() {

	this.position = "";

	this.color = "";


	this.font = null;

	this.titleExpression = null;
}

var _p = dev.report.model.XChartTitle.prototype;
_p.setPosition = function(position){
	this.position = position;
}
_p.getPosition = function(){
	return this.position;
}
_p.setColor = function(color){
	this.color = color;
}
_p.getColor = function(){
	return this.color;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='chartTitle'){
		if(Elements.attributes.getNamedItem("position")!=null){
			this.position = Elements.attributes.getNamedItem("position");
		}
		if(Elements.attributes.getNamedItem("color")!=null){
			this.color = Elements.attributes.getNamedItem("color");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='font'){
				var rp = Element.firstChild;
				this.font.init(rp);
			  }
			  if(Element.nodeName=='titleExpression'){
				var rp = Element.firstChild;
				this.titleExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<chartTitle ');
	if(this.position!=""){
		str.push(' position="'+this.position+'"');
	}
	if(this.color!=""){
		str.push(' color="'+this.color+'"');
	}
	str.push('>\n');
	if(this.font!=null){
		str.push(this.font.toXML());
	}
	if(this.titleExpression!=null){
		str.push(this.titleExpression.toXML());
	}
	str.push('\n</chartTitle>');
	return str.join('');
}

dev.report.model.XTitleExpression = function() {

}
var _p = dev.report.model.XTitleExpression.prototype;
_p.init = function(Elements) {
}
_p.toXML = function() {
	var str=[];
	str.push('\n<titleExpression> ');

	str.push('\n</titleExpression>');
	return str.join('');
}

dev.report.model.XChartSubtitle = function() {

	this.color = "";


	this.font = null;

	this.subtitleExpression = null;
}

var _p = dev.report.model.XChartSubtitle.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='chartSubtitle'){
		if(Elements.attributes.getNamedItem("color")!=null){
			this.color = Elements.attributes.getNamedItem("color");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='font'){
				var rp = Element.firstChild;
				this.font.init(rp);
			  }
			  if(Element.nodeName=='subtitleExpression'){
				var rp = Element.firstChild;
				this.subtitleExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<chartSubtitle ');
	if(this.color!=""){
		str.push(' color="'+this.color+'"');
	}
	str.push('>\n');
	if(this.font!=null){
		str.push(this.font.toXML());
	}
	if(this.subtitleExpression!=null){
		str.push(this.subtitleExpression.toXML());
	}
	str.push('\n</chartSubtitle>');
	return str.join('');
}

dev.report.model.XSubtitleExpression = function() {

}

var _p = dev.report.model.XSubtitleExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<subtitleExpression> ');

	str.push('\n</subtitleExpression>');
	return str.join('');
}
dev.report.model.XChartLegend = function() {
	this.textColor = "";
	this.backgroundColor = "";
	this.position = "";
	this.font = null;
}

var _p = dev.report.model.XChartLegend.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='chartLegend'){
		if(Elements.attributes.getNamedItem("textColor")!=null){
			this.textColor = Elements.attributes.getNamedItem("textColor");
		}
		if(Elements.attributes.getNamedItem("backgroundColor")!=null){
			this.backgroundColor = Elements.attributes.getNamedItem("backgroundColor");
		}
		if(Elements.attributes.getNamedItem("position")!=null){
			this.position = Elements.attributes.getNamedItem("position");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='font'){
				var rp = Element.firstChild;
				this.font.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<chartLegend ');
	if(this.textColor!=""){
		str.push(' textColor="'+this.textColor+'"');
	}
	if(this.backgroundColor!=""){
		str.push(' backgroundColor="'+this.backgroundColor+'"');
	}
	if(this.position!=""){
		str.push(' position="'+this.position+'"');
	}
	str.push('>\n');
	if(this.font!=null){
		str.push(this.font.toXML());
	}
	str.push('\n</chartLegend>');
	return str.join('');
}

dev.report.model.XItemLabel = function() {

	this.color = "";

	this.backgroundColor = "";

	this.mask = "";


	this.font = null;
}

var _p = dev.report.model.XItemLabel.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='itemLabel'){
		if(Elements.attributes.getNamedItem("color")!=null){
			this.color = Elements.attributes.getNamedItem("color");
		}
		if(Elements.attributes.getNamedItem("backgroundColor")!=null){
			this.backgroundColor = Elements.attributes.getNamedItem("backgroundColor");
		}
		if(Elements.attributes.getNamedItem("mask")!=null){
			this.mask = Elements.attributes.getNamedItem("mask");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='font'){
				var rp = Element.firstChild;
				this.font.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<itemLabel ');
	if(this.color!=""){
		str.push(' color="'+this.color+'"');
	}
	if(this.backgroundColor!=""){
		str.push(' backgroundColor="'+this.backgroundColor+'"');
	}
	if(this.mask!=""){
		str.push(' mask="'+this.mask+'"');
	}
	str.push('>\n');
	if(this.font!=null){
		str.push(this.font.toXML());
	}
	str.push('\n</itemLabel>');
	return str.join('');
}

dev.report.model.XCategoryDataset = function() {

	this.dataset = null;

	this.categorySeries = [];

}

var _p = dev.report.model.XCategoryDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='categoryDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='categorySeries'){
				var rp = new dev.report.model.XCategorySeries();
				rp.init(Element);
				this.categorySeries.push(rp);
			  }
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<categoryDataset ');
	str.push('>\n');
	for(var i=0;i<this.categorySeries.length;i++){
		str.push(this.categorySeries[i].toXML());
	}
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	str.push('\n</categoryDataset>');
	return str.join('');
}

dev.report.model.XPlot = function() {

	this.backcolor = "";

	this.orientation = "";

	this.backgroundAlpha = "";

	this.foregroundAlpha = "";

	this.labelRotation = "";


	this.seriesColor = [];
}

var _p = dev.report.model.XPlot.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='plot'){
		if(Elements.attributes.getNamedItem("backcolor")!=null){
			this.backcolor = Elements.attributes.getNamedItem("backcolor");
		}
		if(Elements.attributes.getNamedItem("orientation")!=null){
			this.orientation = Elements.attributes.getNamedItem("orientation");
		}
		if(Elements.attributes.getNamedItem("backgroundAlpha")!=null){
			this.backgroundAlpha = Elements.attributes.getNamedItem("backgroundAlpha");
		}
		if(Elements.attributes.getNamedItem("foregroundAlpha")!=null){
			this.foregroundAlpha = Elements.attributes.getNamedItem("foregroundAlpha");
		}
		if(Elements.attributes.getNamedItem("labelRotation")!=null){
			this.labelRotation = Elements.attributes.getNamedItem("labelRotation");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='seriesColor'){
				var rp = new dev.report.model.XSeriesColor();
				rp.init(Element);
				this.seriesColor.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<plot ');
	if(this.backcolor!=""){
		str.push(' backcolor="'+this.backcolor+'"');
	}
	if(this.orientation!=""){
		str.push(' orientation="'+this.orientation+'"');
	}
	if(this.backgroundAlpha!=0){
		str.push(' backgroundAlpha="'+this.backgroundAlpha+'"');
	}
	if(this.foregroundAlpha!=0){
		str.push(' foregroundAlpha="'+this.foregroundAlpha+'"');
	}
	if(this.labelRotation!=""){
		str.push(' labelRotation="'+this.labelRotation+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.seriesColor.length;i++){
		str.push(this.seriesColor[i].toXML());
	}
	str.push('\n</plot>');
	return str.join('');
}

dev.report.model.XSeriesColor = function(seriesOrder,color) {

	this.seriesOrder = seriesOrder;

	this.color = color;
}

var _p = dev.report.model.XSeriesColor.prototype;
_p.setSeriesOrder = function(seriesOrder){
	this.seriesOrder = seriesOrder;
}
_p.getSeriesOrder = function(){
	return this.seriesOrder;
}
_p.setColor = function(color){
	this.color = color;
}
_p.getColor = function(){
	return this.color;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='seriesColor'){
		
		this.seriesOrder = Elements.attributes.getNamedItem("seriesOrder");
		this.color = Elements.attributes.getNamedItem("color");
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<seriesColor ');
	str.push(' seriesOrder="'+this.seriesOrder+'"');
	str.push(' color="'+this.color+'"');
	
	str.push('>\n');
	str.push('\n</seriesColor>');
	return str.join('');
}

dev.report.model.XPieChart = function() {
	this.chart = [];
	this.pieDataset = [];
	this.piePlot = [];
}

var _p = dev.report.model.XPieChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='pieChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				this.rp.init(Element);
				this.chart.push(rp);
			  }
			  if(Element.nodeName=='pieDataset'){
				var rp = new dev.report.model.XPieDataset();
				this.rp.init(Element);
				this.pieDataset.push(rp);
			  }
			  if(Element.nodeName=='piePlot'){
				var rp = new dev.report.model.XPiePlot();
				this.rp.init(Element);
				this.piePlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<pieChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.pieDataset.length;i++){
		str.push(this.pieDataset[i].toXML());
	}
	for(var i=0;i<this.piePlot.length;i++){
		str.push(this.piePlot[i].toXML());
	}
	str.push('\n</pieChart>');
	return str.join('');
}

dev.report.model.XPieDataset = function() {

	this.minPercentage = "";

	this.maxCount = "";


	this.dataset = null;

	this.pieSeries = [];

	this.keyExpression = null;

	this.valueExpression = null;

	this.labelExpression = null;

	this.sectionHyperlink = null;

	this.otherKeyExpression = null;

	this.otherLabelExpression = null;

	this.otherSectionHyperlink = null;
}

var _p = dev.report.model.XPieDataset.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='pieDataset'){
		if(Elements.attributes.getNamedItem("minPercentage")!=null){
			this.minPercentage = Elements.attributes.getNamedItem("minPercentage");
		}
		if(Elements.attributes.getNamedItem("maxCount")!=null){
			this.maxCount = Elements.attributes.getNamedItem("maxCount");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
			  if(Element.nodeName=='pieSeries'){
				var rp = new dev.report.model.XPieSeries();
				rp.init(Element);
				this.pieSeries.push(rp);
			  }
			  if(Element.nodeName=='keyExpression'){
				var rp = Element.firstChild;
				this.keyExpression.init(rp);
			  }
			  if(Element.nodeName=='valueExpression'){
				var rp = Element.firstChild;
				this.valueExpression.init(rp);
			  }
			  if(Element.nodeName=='labelExpression'){
				var rp = Element.firstChild;
				this.labelExpression.init(rp);
			  }
			  if(Element.nodeName=='sectionHyperlink'){
				var rp = Element.firstChild;
				this.sectionHyperlink.init(rp);
			  }
			  if(Element.nodeName=='otherKeyExpression'){
				var rp = Element.firstChild;
				this.otherKeyExpression.init(rp);
			  }
			  if(Element.nodeName=='otherLabelExpression'){
				var rp = Element.firstChild;
				this.otherLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='otherSectionHyperlink'){
				var rp = Element.firstChild;
				this.otherSectionHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<pieDataset ');
	if(this.minPercentage!=0){
		str.push(' minPercentage="'+this.minPercentage+'"');
	}
	if(this.maxCount!=0){
		str.push(' maxCount="'+this.maxCount+'"');
	}
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	for(var i=0;i<this.pieSeries.length;i++){
		str.push(this.pieSeries[i].toXML());
	}
	if(this.keyExpression!=null){
		str.push(this.keyExpression.toXML());
	}
	if(this.valueExpression!=null){
		str.push(this.valueExpression.toXML());
	}
	if(this.labelExpression!=null){
		str.push(this.labelExpression.toXML());
	}
	if(this.sectionHyperlink!=null){
		str.push(this.sectionHyperlink.toXML());
	}
	if(this.otherKeyExpression!=null){
		str.push(this.otherKeyExpression.toXML());
	}
	if(this.otherLabelExpression!=null){
		str.push(this.otherLabelExpression.toXML());
	}
	if(this.otherSectionHyperlink!=null){
		str.push(this.otherSectionHyperlink.toXML());
	}
	str.push('\n</pieDataset>');
	return str.join('');
}

dev.report.model.XKeyExpression = function() {
}
var _p = dev.report.model.XKeyExpression.prototype;
_p.init = function(Elements) {
}
_p.toXML = function() {
	var str=[];
	str.push('\n<keyExpression> ');

	str.push('\n</keyExpression>');
	return str.join('');
}
dev.report.model.XLabelExpression = function() {

}
var _p = dev.report.model.XLabelExpression.prototype;
_p.init = function(Elements) {
}
_p.toXML = function() {
	var str=[];
	str.push('\n<labelExpression> ');
	str.push('\n</labelExpression>');
	return str.join('');
}
dev.report.model.XXValueExpression = function() {

}
var _p = dev.report.model.XXValueExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<xValueExpression> ');
	str.push('\n</xValueExpression>');
	return str.join('');
}
dev.report.model.XOtherSectionHyperlink = function() {

	this.hyperlinkType = "";

	this.hyperlinkTarget = "";


	this.hyperlinkReferenceExpression = null;

	this.hyperlinkAnchorExpression = null;

	this.hyperlinkPageExpression = null;

	this.hyperlinkTooltipExpression = null;

	this.hyperlinkParameter = [];
}

var _p = dev.report.model.XOtherSectionHyperlink.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='otherSectionHyperlink'){
		if(Elements.attributes.getNamedItem("hyperlinkType")!=null){
			this.hyperlinkType = Elements.attributes.getNamedItem("hyperlinkType");
		}
		if(Elements.attributes.getNamedItem("hyperlinkTarget")!=null){
			this.hyperlinkTarget = Elements.attributes.getNamedItem("hyperlinkTarget");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='hyperlinkReferenceExpression'){
				var rp = Element.firstChild;
				this.hyperlinkReferenceExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkAnchorExpression'){
				var rp = Element.firstChild;
				this.hyperlinkAnchorExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkPageExpression'){
				var rp = Element.firstChild;
				this.hyperlinkPageExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkTooltipExpression'){
				var rp = Element.firstChild;
				this.hyperlinkTooltipExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkParameter'){
				  var rp=new dev.report.model.XHyperlinkParameter();
				  rp.init(Element);
				  this.hyperlinkParameter.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<otherSectionHyperlink ');
	if(this.hyperlinkType!=""){
		str.push(' hyperlinkType="'+this.hyperlinkType+'"');
	}
	if(this.hyperlinkTarget!=""){
		str.push(' hyperlinkTarget="'+this.hyperlinkTarget+'"');
	}
	str.push('>\n');
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
	str.push('\n</otherSectionHyperlink>');
	return str.join('');
}

dev.report.model.XOtherLabelExpression = function() {

}

var _p = dev.report.model.XOtherLabelExpression.prototype;

_p.init = function(Elements) {

}
dev.report.model.XOtherKeyExpression = function() {

}

var _p = dev.report.model.XOtherKeyExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<otherKeyExpression> ');

	str.push('\n</otherKeyExpression>');
	return str.join('');
}
_p.toXML = function() {
	var str=[];
	str.push('\n<otherLabelExpression> ');

	str.push('\n</otherLabelExpression>');
	return str.join('');
}
dev.report.model.XPiePlot = function() {

	this.isShowLabels = "";

	this.isCircular = "";

	this.labelFormat = "";

	this.legendLabelFormat = "";


	this.itemLabel = null;

	this.plot = [];
}

var _p = dev.report.model.XPiePlot.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='piePlot'){
		if(Elements.attributes.getNamedItem("isShowLabels")!=null){
			this.isShowLabels = Elements.attributes.getNamedItem("isShowLabels");
		}
		if(Elements.attributes.getNamedItem("isCircular")!=null){
			this.isCircular = Elements.attributes.getNamedItem("isCircular");
		}
		if(Elements.attributes.getNamedItem("labelFormat")!=null){
			this.labelFormat = Elements.attributes.getNamedItem("labelFormat");
		}
		if(Elements.attributes.getNamedItem("legendLabelFormat")!=null){
			this.legendLabelFormat = Elements.attributes.getNamedItem("legendLabelFormat");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='itemLabel'){
				var rp = Element.firstChild;
				this.itemLabel.init(rp);
			  }
			  if(Element.nodeName=='plot'){
				  var rp=new dev.report.model.XPlot();
				  rp.init(Element);
				  this.plot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<piePlot ');
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
	if(this.itemLabel!=null){
		str.push(this.itemLabel.toXML());
	}
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	str.push('\n</piePlot>');
	return str.join('');
}
dev.report.model.XPieSeries = function() {

	this.keyExpression = null;

	this.valueExpression = null;

	this.labelExpression = null;

	this.sectionHyperlink = null;

}

var _p = dev.report.model.XPieSeries.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='pieSeries'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='keyExpression'){
				var rp = Element.firstChild;
				this.keyExpression.init(rp);
			  }
			  if(Element.nodeName=='valueExpression'){
				var rp = Element.firstChild;
				this.valueExpression.init(rp);
			  }
			  if(Element.nodeName=='labelExpression'){
				var rp = Element.firstChild;
				this.labelExpression.init(rp);
			  }
			  if(Element.nodeName=='sectionHyperlink'){
				var rp = Element.firstChild;
				this.sectionHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<pieSeries ');
	str.push('>\n');
	if(this.keyExpression!=null){
		str.push(this.keyExpression.toXML());
	}
	if(this.valueExpression!=null){
		str.push(this.valueExpression.toXML());
	}
	if(this.labelExpression!=null){
		str.push(this.labelExpression.toXML());
	}
	if(this.sectionHyperlink!=null){
		str.push(this.sectionHyperlink.toXML());
	}
	str.push('\n</pieSeries>');
	return str.join('');
}


dev.report.model.XSectionHyperlink = function() {

	this.hyperlinkType = "";

	this.hyperlinkTarget = "";


	this.hyperlinkReferenceExpression = null;

	this.hyperlinkAnchorExpression = null;

	this.hyperlinkPageExpression = null;

	this.hyperlinkTooltipExpression = null;

	this.hyperlinkParameter = [];
}

var _p = dev.report.model.XSectionHyperlink.prototype;
_p.setHyperlinkType = function(hyperlinkType){
	this.hyperlinkType = hyperlinkType;
}
_p.getHyperlinkType = function(){
	return this.hyperlinkType;
}
_p.setHyperlinkTarget = function(hyperlinkTarget){
	this.hyperlinkTarget = hyperlinkTarget;
}
_p.getHyperlinkTarget = function(){
	return this.hyperlinkTarget;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='sectionHyperlink'){
		if(Elements.attributes.getNamedItem("hyperlinkType")!=null){
			this.hyperlinkType = Elements.attributes.getNamedItem("hyperlinkType");
		}
		if(Elements.attributes.getNamedItem("hyperlinkTarget")!=null){
			this.hyperlinkTarget = Elements.attributes.getNamedItem("hyperlinkTarget");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='hyperlinkReferenceExpression'){
				var rp = Element.firstChild;
				this.hyperlinkReferenceExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkAnchorExpression'){
				var rp = Element.firstChild;
				this.hyperlinkAnchorExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkPageExpression'){
				var rp = Element.firstChild;
				this.hyperlinkPageExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkTooltipExpression'){
				var rp = Element.firstChild;
				this.hyperlinkTooltipExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkParameter'){
				  var rp=new dev.report.model.XHyperlinkParameter();
				  rp.init(Element);
				  this.hyperlinkParameter.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<sectionHyperlink ');
	if(this.hyperlinkType!=""){
		str.push(' hyperlinkType="'+this.hyperlinkType+'"');
	}
	if(this.hyperlinkTarget!=""){
		str.push(' hyperlinkTarget="'+this.hyperlinkTarget+'"');
	}
	str.push('>\n');
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
	str.push('\n</sectionHyperlink>');
	return str.join('');
}


dev.report.model.XPie3DChart = function() {

	this.chart = [];

	this.pieDataset = [];

	this.pie3DPlot = [];

}

var _p = dev.report.model.XPie3DChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='pie3DChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='pieDataset'){
				var rp = new dev.report.model.XPieDataset();
				rp.init(Element);
				this.pieDataset.push(rp);
			  }
			  if(Element.nodeName=='pie3DPlot'){
				var rp = new dev.report.model.XPie3DPlot();
				rp.init(Element);
				this.pie3DPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<pie3DChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.pieDataset.length;i++){
		str.push(this.pieDataset[i].toXML());
	}
	for(var i=0;i<this.pie3DPlot.length;i++){
		str.push(this.pie3DPlot[i].toXML());
	}
	str.push('\n</pie3DChart>');
	return str.join('');
}
dev.report.model.XPie3DPlot = function() {

	this.isShowLabels = "";

	this.depthFactor = "";

	this.isCircular = "";

	this.labelFormat = "";

	this.legendLabelFormat = "";


	this.plot = [];

	this.itemLabel = null;
}

var _p = dev.report.model.XPie3DPlot.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='pie3DPlot'){
		if(Elements.attributes.getNamedItem("isShowLabels")!=null){
			this.isShowLabels = Elements.attributes.getNamedItem("isShowLabels");
		}
		if(Elements.attributes.getNamedItem("depthFactor")!=null){
			this.depthFactor = Elements.attributes.getNamedItem("depthFactor");
		}
		if(Elements.attributes.getNamedItem("isCircular")!=null){
			this.isCircular = Elements.attributes.getNamedItem("isCircular");
		}
		if(Elements.attributes.getNamedItem("labelFormat")!=null){
			this.labelFormat = Elements.attributes.getNamedItem("labelFormat");
		}
		if(Elements.attributes.getNamedItem("legendLabelFormat")!=null){
			this.legendLabelFormat = Elements.attributes.getNamedItem("legendLabelFormat");
		}
		
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='plot'){
				  var rp=new dev.report.model.XPlot();
				  rp.init(Element);
				  this.plot.push(rp);
			  }
			  if(Element.nodeName=='itemLabel'){
				var rp = Element.firstChild;
				this.itemLabel.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<pie3DPlot ');	
	if(this.isShowLabels!="false"){
		str.push(' isShowLabels="'+this.isShowLabels+'"');
	}
	if(this.isCircular!="false"){
		str.push(' isCircular="'+this.isCircular+'"');
	}
	if(this.depthFactor!=""){
		str.push(' depthFactor="'+this.depthFactor+'"');
	}
	if(this.labelFormat!=""){
		str.push(' labelFormat="'+this.labelFormat+'"');
	}
	if(this.legendLabelFormat!=""){
		str.push(' legendLabelFormat="'+this.legendLabelFormat+'"');
	}
	str.push('>\n');
	for(var i=0;i<this.plot.length;i++){
		 str.push(this.plot[i].toXML());
	}
	if(this.itemLabel!=null){
		str.push(this.itemLabel.toXML());
	}
	str.push('\n</pie3DPlot>');
	return str.join('');
}
dev.report.model.XBarChart = function() {

	this.chart = [];

	this.categoryDataset = [];

	this.barPlot = [];

}

var _p = dev.report.model.XBarChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='barChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='categoryDataset'){
				var rp = new dev.report.model.XCategoryDataset();
				rp.init(Element);
				this.categoryDataset.push(rp);
			  }
			  if(Element.nodeName=='barPlot'){
				var rp = new dev.report.model.XBarPlot();
				rp.init(Element);
				this.barPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<barChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.categoryDataset.length;i++){
		str.push(this.categoryDataset[i].toXML());
	}
	for(var i=0;i<this.barPlot.length;i++){
		str.push(this.barPlot[i].toXML());
	}
	str.push('\n</barChart>');
	return str.join('');
}

dev.report.model.XLabelFont = function() {

	this.font = null;
}

var _p = dev.report.model.XLabelFont.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='labelFont'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='font'){
				var rp = Element.firstChild;
				this.font.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<labelFont ');
	str.push('>\n');
	if(this.font!=null){
		str.push(this.font.toXML());
	}
	str.push('\n</labelFont>');
	return str.join('');
}
dev.report.model.XTickLabelFont = function() {

	this.font = null;
}

var _p = dev.report.model.XTickLabelFont.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='tickLabelFont'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='font'){
				var rp = Element.firstChild;
				this.font.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<tickLabelFont ');
	str.push('>\n');
	if(this.font!=null){
		str.push(this.font.toXML());
	}
	str.push('\n</tickLabelFont>');
	return str.join('');
}
dev.report.model.XBarPlot = function() {

	this.isShowLabels = "";

	this.isShowTickMarks = "";

	this.isShowTickLabels = "";


	this.plot = [];

	this.itemLabel = null;

	this.categoryAxisLabelExpression = null;

	this.categoryAxisFormat = null;

	this.valueAxisLabelExpression = null;

	this.valueAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XBarPlot.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='barPlot'){
		if(Elements.attributes.getNamedItem("isShowLabels")!=null){
			this.isShowLabels = Elements.attributes.getNamedItem("isShowLabels");
		}
		if(Elements.attributes.getNamedItem("isShowTickMarks")!=null){
			this.isShowTickMarks = Elements.attributes.getNamedItem("isShowTickMarks");
		}
		if(Elements.attributes.getNamedItem("isShowTickLabels")!=null){
			this.isShowTickLabels = Elements.attributes.getNamedItem("isShowTickLabels");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='itemLabel'){
				var rp = Element.firstChild;
				this.itemLabel.init(rp);
			  }
			  if(Element.nodeName=='categoryAxisLabelExpression'){
				var rp = Element.firstChild;
				this.categoryAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='categoryAxisFormat'){
				var rp = Element.firstChild;
				this.categoryAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='valueAxisLabelExpression'){
				var rp = Element.firstChild;
				this.valueAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='valueAxisFormat'){
				var rp = Element.firstChild;
				this.valueAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<barPlot ');
	if(this.isShowLabels!="false"){
		str.push(' isShowLabels="'+this.isShowLabels+'"');
	}
	if(this.isShowTickMarks!="false"){
		str.push(' isShowTickMarks="'+this.isShowTickMarks+'"');
	}
	if(this.isShowTickLabels!="false"){
		str.push(' isShowTickLabels="'+this.isShowTickLabels+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.itemLabel!=null){
		str.push(this.itemLabel.toXML());
	}
	if(this.categoryAxisLabelExpression!=null){
		str.push(this.categoryAxisLabelExpression.toXML());
	}
	if(this.categoryAxisFormat!=null){
		str.push(this.categoryAxisFormat.toXML());
	}
	if(this.valueAxisLabelExpression!=null){
		str.push(this.valueAxisLabelExpression.toXML());
	}
	if(this.valueAxisFormat!=null){
		str.push(this.valueAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</barPlot>');
	return str.join('');
}

dev.report.model.XCategorySeries = function() {

	this.seriesExpression = null;

	this.categoryExpression = null;

	this.valueExpression = null;

	this.labelExpression = null;

	this.itemHyperlink = null;
}

var _p = dev.report.model.XCategorySeries.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='categorySeries'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='categoryExpression'){
				var rp = Element.firstChild;
				this.categoryExpression.init(rp);
			  }
			  if(Element.nodeName=='valueExpression'){
				var rp = Element.firstChild;
				this.valueExpression.init(rp);
			  }
			  if(Element.nodeName=='labelExpression'){
				var rp = Element.firstChild;
				this.labelExpression.init(rp);
			  }
			  if(Element.nodeName=='itemHyperlink'){
				var rp = Element.firstChild;
				this.itemHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<categorySeries ');
	str.push('>\n');
	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.categoryExpression!=null){
		str.push(this.categoryExpression.toXML());
	}
	if(this.valueExpression!=null){
		str.push(this.valueExpression.toXML());
	}
	if(this.labelExpression!=null){
		str.push(this.labelExpression.toXML());
	}
	if(this.itemHyperlink!=null){
		str.push(this.itemHyperlink.toXML());
	}
	str.push('\n</categorySeries>');
	return str.join('');
}

dev.report.model.XItemHyperlink = function() {

	this.hyperlinkType = "";

	this.hyperlinkTarget = "";


	this.hyperlinkReferenceExpression = null;

	this.hyperlinkAnchorExpression = null;

	this.hyperlinkPageExpression = null;

	this.hyperlinkTooltipExpression = null;

	this.hyperlinkParameter = [];
}

var _p = dev.report.model.XItemHyperlink.prototype;
_p.setHyperlinkType = function(hyperlinkType){
	this.hyperlinkType = hyperlinkType;
}
_p.getHyperlinkType = function(){
	return this.hyperlinkType;
}
_p.setHyperlinkTarget = function(hyperlinkTarget){
	this.hyperlinkTarget = hyperlinkTarget;
}
_p.getHyperlinkTarget = function(){
	return this.hyperlinkTarget;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='itemHyperlink'){
		if(Elements.attributes.getNamedItem("hyperlinkType")!=null){
			this.hyperlinkType = Elements.attributes.getNamedItem("hyperlinkType");
		}
		if(Elements.attributes.getNamedItem("hyperlinkTarget")!=null){
			this.hyperlinkTarget = Elements.attributes.getNamedItem("hyperlinkTarget");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='hyperlinkReferenceExpression'){
				var rp = Element.firstChild;
				this.hyperlinkReferenceExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkAnchorExpression'){
				var rp = Element.firstChild;
				this.hyperlinkAnchorExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkPageExpression'){
				var rp = Element.firstChild;
				this.hyperlinkPageExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkTooltipExpression'){
				var rp = Element.firstChild;
				this.hyperlinkTooltipExpression.init(rp);
			  }
			  if(Element.nodeName=='hyperlinkParameter'){
				  var rp=new dev.report.model.XHyperlinkParameter();
				  rp.init(Element);
				  this.hyperlinkParameter.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<itemHyperlink ');
	if(this.hyperlinkType!=""){
		str.push(' hyperlinkType="'+this.hyperlinkType+'"');
	}
	if(this.hyperlinkTarget!=""){
		str.push(' hyperlinkTarget="'+this.hyperlinkTarget+'"');
	}
	str.push('>\n');
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
	str.push('\n</itemHyperlink>');
	return str.join('');
}


dev.report.model.XCategoryExpression = function() {

}

var _p = dev.report.model.XCategoryExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<categoryExpression> ');

	str.push('\n</categoryExpression>');
	return str.join('');
}

dev.report.model.XCategoryAxisLabelExpression = function() {

}

var _p = dev.report.model.XCategoryAxisLabelExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<categoryAxisLabelExpression> ');

	str.push('\n</categoryAxisLabelExpression>');
	return str.join('');
}

dev.report.model.XCategoryAxisFormat = function() {

	this.labelRotation = "";


	this.axisFormat = [];
}

var _p = dev.report.model.XCategoryAxisFormat.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='categoryAxisFormat'){
		if(Elements.attributes.getNamedItem("labelRotation")!=null){
			this.labelRotation = Elements.attributes.getNamedItem("labelRotation");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='axisFormat'){
				var rp = new dev.report.model.XAxisFormat();
				rp.init(Element);
				this.axisFormat.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<categoryAxisFormat ');
	if(this.labelRotation!=""){
		str.push(' labelRotation="'+this.labelRotation+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.axisFormat.length;i++){
		str.push(this.axisFormat[i].toXML());
	}
	str.push('\n</categoryAxisFormat>');
	return str.join('');
}

dev.report.model.XAxisFormat = function() {

	this.labelColor = "";

	this.tickLabelColor = "";

	this.tickLabelMask = "";

	this.verticalTickLabels = "";

	this.axisLineColor = "";


	this.labelFont = null;

	this.tickLabelFont = null;
}

var _p = dev.report.model.XAxisFormat.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='axisFormat'){
		if(Elements.attributes.getNamedItem("labelColor")!=null){
			this.labelColor = Elements.attributes.getNamedItem("labelColor");
		}
		if(Elements.attributes.getNamedItem("tickLabelColor")!=null){
			this.tickLabelColor = Elements.attributes.getNamedItem("tickLabelColor");
		}
		if(Elements.attributes.getNamedItem("tickLabelMask")!=null){
			this.tickLabelMask = Elements.attributes.getNamedItem("tickLabelMask");
		}
		if(Elements.attributes.getNamedItem("verticalTickLabels")!=null){
			this.verticalTickLabels = Elements.attributes.getNamedItem("verticalTickLabels");
		}
		if(Elements.attributes.getNamedItem("axisLineColor")!=null){
			this.axisLineColor = Elements.attributes.getNamedItem("axisLineColor");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='labelFont'){
				var rp = Element.firstChild;
				this.labelFont.init(rp);
			  }
			  if(Element.nodeName=='tickLabelFont'){
				var rp = Element.firstChild;
				this.tickLabelFont.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<axisFormat ');
	if(this.labelColor!=""){
		str.push(' labelColor="'+this.labelColor+'"');
	}
	if(this.tickLabelColor!=""){
		str.push(' tickLabelColor="'+this.tickLabelColor+'"');
	}
	if(this.tickLabelMask!=""){
		str.push(' tickLabelMask="'+this.tickLabelMask+'"');
	}
	if(this.verticalTickLabels!=""){
		str.push(' verticalTickLabels="'+this.verticalTickLabels+'"');
	}
	if(this.axisLineColor!=""){
		str.push(' axisLineColor="'+this.axisLineColor+'"');
	}
	str.push('>\n');
	if(this.labelFont!=null){
		str.push(this.labelFont.toXML());
	}
	if(this.tickLabelFont!=null){
		str.push(this.tickLabelFont.toXML());
	}
	str.push('\n</axisFormat>');
	return str.join('');
}

dev.report.model.XBar3DChart = function() {

	this.chart = [];

	this.categoryDataset = [];

	this.bar3DPlot = [];

}

var _p = dev.report.model.XBar3DChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='bar3DChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='categoryDataset'){
				var rp = new dev.report.model.XCategoryDataset();
				rp.init(Element);
				this.categoryDataset.push(rp);
			  }
			  if(Element.nodeName=='bar3DPlot'){
				var rp = new dev.report.model.XBar3DPlot();
				rp.init(Element);
				this.bar3DPlot.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<bar3DChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.categoryDataset.length;i++){
		str.push(this.categoryDataset[i].toXML());
	}
	for(var i=0;i<this.bar3DPlot.length;i++){
		str.push(this.bar3DPlot[i].toXML());
	}
	str.push('\n</bar3DChart>');
	return str.join('');
}
dev.report.model.XBar3DPlot = function() {

	this.isShowLabels = "";

	this.xOffset = "";

	this.yOffset = "";


	this.plot = [];

	this.itemLabel = null;

	this.categoryAxisLabelExpression = null;

	this.categoryAxisFormat = null;

	this.valueAxisLabelExpression = null;

	this.valueAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}



var _p = dev.report.model.XBar3DPlot.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='bar3DPlot'){
		if(Elements.attributes.getNamedItem("isShowLabels")!=null){
			this.isShowLabels = Elements.attributes.getNamedItem("isShowLabels");
		}
		if(Elements.attributes.getNamedItem("xOffset")!=null){
			this.xOffset = Elements.attributes.getNamedItem("xOffset");
		}
		if(Elements.attributes.getNamedItem("yOffset")!=null){
			this.yOffset = Elements.attributes.getNamedItem("yOffset");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='itemLabel'){
				var rp = Element.firstChild;
				this.itemLabel.init(rp);
			  }
			  if(Element.nodeName=='categoryAxisLabelExpression'){
				var rp = Element.firstChild;
				this.categoryAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='categoryAxisFormat'){
				var rp = Element.firstChild;
				this.categoryAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='valueAxisLabelExpression'){
				var rp = Element.firstChild;
				this.valueAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='valueAxisFormat'){
				var rp = Element.firstChild;
				this.valueAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<bar3DPlot ');
	if(this.isShowLabels!="false"){
		str.push(' isShowLabels="'+this.isShowLabels+'"');
	}
	if(this.xOffset!=""){
		str.push(' xOffset="'+this.xOffset+'"');
	}
	if(this.yOffset!=""){
		str.push(' yOffset="'+this.yOffset+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.itemLabel!=null){
		str.push(this.itemLabel.toXML());
	}
	if(this.categoryAxisLabelExpression!=null){
		str.push(this.categoryAxisLabelExpression.toXML());
	}
	if(this.categoryAxisFormat!=null){
		str.push(this.categoryAxisFormat.toXML());
	}
	if(this.valueAxisLabelExpression!=null){
		str.push(this.valueAxisLabelExpression.toXML());
	}
	if(this.valueAxisFormat!=null){
		str.push(this.valueAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</bar3DPlot>');
	return str.join('');
}


dev.report.model.XValueAxisLabelExpression = function() {

}
var _p = dev.report.model.XValueAxisLabelExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<valueAxisLabelExpression> ');

	str.push('\n</valueAxisLabelExpression>');
	return str.join('');
}

dev.report.model.XValueAxisFormat = function() {

	this.axisFormat = [];
}

var _p = dev.report.model.XValueAxisFormat.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='valueAxisFormat'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='axisFormat'){
				var rp = new dev.report.model.XAxisFormat();
				rp.init(Element);
				this.axisFormat.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<valueAxisFormat ');
	str.push('>\n');
	
	for(var i=0;i<this.axisFormat.length;i++){
		str.push(this.axisFormat[i].toXML());
	}
	str.push('\n</valueAxisFormat>');
	return str.join('');
}


dev.report.model.XDomainAxisMinValueExpression = function() {

}

var _p = dev.report.model.XDomainAxisMinValueExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<domainAxisMinValueExpression> ');

	str.push('\n</domainAxisMinValueExpression>');
	return str.join('');
}

dev.report.model.XDomainAxisMaxValueExpression = function() {

}

var _p = dev.report.model.XDomainAxisMaxValueExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<domainAxisMaxValueExpression> ');

	str.push('\n</domainAxisMaxValueExpression>');
	return str.join('');
}


dev.report.model.XRangeAxisMaxValueExpression = function() {

}

var _p = dev.report.model.XRangeAxisMaxValueExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<rangeAxisMaxValueExpression> ');

	str.push('\n</rangeAxisMaxValueExpression>');
	return str.join('');
}

dev.report.model.XRangeAxisMinValueExpression = function() {

}

var _p = dev.report.model.XRangeAxisMinValueExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<rangeAxisMinValueExpression> ');

	str.push('\n</rangeAxisMinValueExpression>');
	return str.join('');
}


dev.report.model.XXyBarChart = function() {

	this.chart = [];

	this.timePeriodDataset = [];

	this.timeSeriesDataset = [];

	this.xyDataset = [];

	this.barPlot = [];

}

var _p = dev.report.model.XXyBarChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='xyBarChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='timePeriodDataset'){
				var rp = new dev.report.model.XTimePeriodDataset();
				rp.init(Element);
				this.timePeriodDataset.push(rp);
			  }
			  if(Element.nodeName=='timeSeriesDataset'){
				var rp = new dev.report.model.XTimeSeriesDataset();
				rp.init(Element);
				this.timeSeriesDataset.push(rp);
			  }
			  if(Element.nodeName=='xyDataset'){
				var rp = new dev.report.model.XXyDataset();
				rp.init(Element);
				this.xyDataset.push(rp);
			  }
			  if(Element.nodeName=='barPlot'){
				var rp = new dev.report.model.XBarPlot();
				rp.init(Element);
				this.barPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xyBarChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.timePeriodDataset.length;i++){
		str.push(this.timePeriodDataset[i].toXML());
	}
	for(var i=0;i<this.timeSeriesDataset.length;i++){
		str.push(this.timeSeriesDataset[i].toXML());
	}
	for(var i=0;i<this.xyDataset.length;i++){
		str.push(this.xyDataset[i].toXML());
	}
	for(var i=0;i<this.barPlot.length;i++){
		str.push(this.barPlot[i].toXML());
	}
	str.push('\n</xyBarChart>');
	return str.join('');
}
dev.report.model.XTimePeriodDataset = function() {

	this.dataset = null;

	this.timePeriodSeries = [];

}

var _p = dev.report.model.XTimePeriodDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='timePeriodDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
			 if(Element.nodeName=='timePeriodSeries'){
				var rp = new dev.report.model.XTimePeriodSeries();
				rp.init(Element);
				this.timePeriodSeries.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timePeriodDataset ');
	str.push('>\n');
	for(var i=0;i<this.timePeriodSeries.length;i++){
		str.push(this.timePeriodSeries[i].toXML());
	}
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	str.push('\n</timePeriodDataset>');
	return str.join('');
}

dev.report.model.XTimePeriodExpression = function() {

}

var _p = dev.report.model.XTimePeriodExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<timePeriodExpression> ');

	str.push('\n</timePeriodExpression>');
	return str.join('');
}

dev.report.model.XTimePeriodSeries = function() {

	this.seriesExpression = null;

	this.startDateExpression = null;

	this.endDateExpression = null;

	this.valueExpression = null;

	this.labelExpression = null;

	this.itemHyperlink = null;
}

var _p = dev.report.model.XTimePeriodSeries.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='timePeriodSeries'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='startDateExpression'){
				var rp = Element.firstChild;
				this.startDateExpression.init(rp);
			  }
			  if(Element.nodeName=='endDateExpression'){
				var rp = Element.firstChild;
				this.endDateExpression.init(rp);
			  }
			  if(Element.nodeName=='valueExpression'){
				var rp = Element.firstChild;
				this.valueExpression.init(rp);
			  }
			  if(Element.nodeName=='labelExpression'){
				var rp = Element.firstChild;
				this.labelExpression.init(rp);
			  }
			  if(Element.nodeName=='itemHyperlink'){
				var rp = Element.firstChild;
				this.itemHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timePeriodSeries ');
	str.push('>\n');

	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.startDateExpression!=null){
		str.push(this.startDateExpression.toXML());
	}
	if(this.endDateExpression!=null){
		str.push(this.endDateExpression.toXML());
	}
	if(this.valueExpression!=null){
		str.push(this.valueExpression.toXML());
	}
	if(this.labelExpression!=null){
		str.push(this.labelExpression.toXML());
	}
	if(this.itemHyperlink!=null){
		str.push(this.itemHyperlink.toXML());
	}
	str.push('\n</timePeriodSeries>');
	return str.join('');
}


dev.report.model.XSeriesExpression = function() {

}

var _p = dev.report.model.XSeriesExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<seriesExpression> ');

	str.push('\n</seriesExpression>');
	return str.join('');
}

dev.report.model.XValueExpression = function() {

}

var _p = dev.report.model.XValueExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<valueExpression> ');

	str.push('\n</valueExpression>');
	return str.join('');
}

dev.report.model.XEndDateExpression = function() {

}

var _p = dev.report.model.XEndDateExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<endDateExpression> ');

	str.push('\n</endDateExpression>');
	return str.join('');
}


dev.report.model.XStartDateExpression = function() {

}

var _p = dev.report.model.XStartDateExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<startDateExpression> ');

	str.push('\n</startDateExpression>');
	return str.join('');
}


dev.report.model.XTimeSeriesDataset = function() {

	this.timePeriod = "Day";


	this.dataset = null;

	this.timeSeries = [];

}

var _p = dev.report.model.XTimeSeriesDataset.prototype;
_p.setTimePeriod = function(timePeriod){
	this.timePeriod = timePeriod
}
_p.getTimePeriod = function(){
	return this.timePeriod;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='timeSeriesDataset'){
		if(Elements.attributes.getNamedItem("timePeriod")!=null){
			this.timePeriod = Elements.attributes.getNamedItem("timePeriod");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='timeSeries'){
				var rp = new dev.report.model.XTimeSeries
				this.timeSeries.push(rp);
			  }
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timeSeriesDataset ');
	if(this.timePeriod!=""){
		str.push(' timePeriod="'+this.timePeriod+'"');
	}
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	for(var i=0;i<this.timeSeries.length;i++){
		str.push(this.timeSeries[i].toXML());
	}
	str.push('\n</timeSeriesDataset>');
	return str.join('');
}

dev.report.model.XTimeAxisLabelExpression = function() {

}

var _p = dev.report.model.XTimeAxisLabelExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<timeAxisLabelExpression> ');

	str.push('\n</timeAxisLabelExpression>');
	return str.join('');
}


dev.report.model.XTimeSeries = function() {

	this.seriesExpression = null;

	this.timePeriodExpression = null;

	this.valueExpression = null;

	this.labelExpression = null;

	this.itemHyperlink = null;
}

var _p = dev.report.model.XTimeSeries.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='timeSeries'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='timePeriodExpression'){
				var rp = Element.firstChild;
				this.timePeriodExpression.init(rp);
			  }
			  if(Element.nodeName=='valueExpression'){
				var rp = Element.firstChild;
				this.valueExpression.init(rp);
			  }
			  if(Element.nodeName=='labelExpression'){
				var rp = Element.firstChild;
				this.labelExpression.init(rp);
			  }
			  if(Element.nodeName=='itemHyperlink'){
				var rp = Element.firstChild;
				this.itemHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timeSeries ');
	str.push('>\n');

	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.timePeriodExpression!=null){
		str.push(this.timePeriodExpression.toXML());
	}
	if(this.valueExpression!=null){
		str.push(this.valueExpression.toXML());
	}
	if(this.labelExpression!=null){
		str.push(this.labelExpression.toXML());
	}
	if(this.itemHyperlink!=null){
		str.push(this.itemHyperlink.toXML());
	}
	str.push('\n</timeSeries>');
	return str.join('');
}
dev.report.model.XTimeSeriesChart = function() {

	this.chart = [];

	this.timeSeriesDataset = [];

	this.timeSeriesPlot = [];

}

var _p = dev.report.model.XTimeSeriesChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='timeSeriesChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='timeSeriesDataset'){
				var rp = new dev.report.model.XTimeSeriesDataset();
				rp.init(Element);
				this.timeSeriesDataset.push(rp);
			  }
			  if(Element.nodeName=='timeSeriesPlot'){
				var rp = new dev.report.model.XTimeSeriesPlot();
				rp.init(Element);
				this.timeSeriesPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timeSeriesChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.timeSeriesDataset.length;i++){
		str.push(this.timeSeriesDataset[i].toXML());
	}
	for(var i=0;i<this.timeSeriesPlot.length;i++){
		str.push(this.timeSeriesPlot[i].toXML());
	}
	str.push('\n</timeSeriesChart>');
	return str.join('');
}
dev.report.model.XTimeSeriesChart = function() {

	this.chart = [];

	this.timeSeriesDataset = [];

	this.timeSeriesPlot = [];

}

var _p = dev.report.model.XTimeSeriesChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='timeSeriesChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='timeSeriesDataset'){
				var rp = new dev.report.model.XTimeSeriesDataset();
				rp.init(Element);
				this.timeSeriesDataset.push(rp);
			  }
			  if(Element.nodeName=='timeSeriesPlot'){
				var rp = new dev.report.model.XTimeSeriesPlot();
				rp.init(Element);
				this.timeSeriesPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timeSeriesChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.timeSeriesDataset.length;i++){
		str.push(this.timeSeriesDataset[i].toXML());
	}
	for(var i=0;i<this.timeSeriesPlot.length;i++){
		str.push(this.timeSeriesPlot[i].toXML());
	}
	str.push('\n</timeSeriesChart>');
	return str.join('');
}
dev.report.model.XTimeSeriesPlot = function() {

	this.isShowLines = "";

	this.isShowShapes = "";


	this.plot = [];

	this.timeAxisLabelExpression = null;

	this.timeAxisFormat = null;

	this.valueAxisLabelExpression = null;

	this.valueAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XTimeSeriesPlot.prototype;
_p.setIsShowLines = function(isShowLines){
	this.isShowLines = isShowLines;
}
_p.getIsShowLines = function(){
	return this.isShowLines;
}
_p.setIsShowShapes = function(isShowShapes){
	this.isShowShapes = isShowShapes;
}
_p.getIsShowShapes = function(){
	return this.isShowShapes;
}

_p.init = function(Elements) {
	if(Elements.nodeName=='timeSeriesPlot'){
		if(Elements.attributes.getNamedItem("isShowLines")!=null){
			this.isShowLines = Elements.attributes.getNamedItem("isShowLines");
		}
		if(Elements.attributes.getNamedItem("isShowShapes")!=null){
			this.isShowShapes = Elements.attributes.getNamedItem("isShowShapes");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='timeAxisLabelExpression'){
				var rp = Element.firstChild;
				this.timeAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='timeAxisFormat'){
				var rp = Element.firstChild;
				this.timeAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='valueAxisLabelExpression'){
				var rp = Element.firstChild;
				this.valueAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='valueAxisFormat'){
				var rp = Element.firstChild;
				this.valueAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timeSeriesPlot ');
	if(this.isShowLines!="false"){
		str.push(' isShowLines="'+this.isShowLines+'"');
	}
	if(this.isShowShapes!="false"){
		str.push(' isShowShapes="'+this.isShowShapes+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.timeAxisLabelExpression!=null){
		str.push(this.timeAxisLabelExpression.toXML());
	}
	if(this.timeAxisFormat!=null){
		str.push(this.timeAxisFormat.toXML());
	}
	if(this.valueAxisLabelExpression!=null){
		str.push(this.valueAxisLabelExpression.toXML());
	}
	if(this.valueAxisFormat!=null){
		str.push(this.valueAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</timeSeriesPlot>');
	return str.join('');
}
dev.report.model.XTimeAxisFormat = function() {

	this.axisFormat = [];
}

var _p = dev.report.model.XTimeAxisFormat.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='timeAxisFormat'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='axisFormat'){
				var rp = new dev.report.model.XAxisFormat();
				rp.init(Element);
				this.axisFormat.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<timeAxisFormat ');
	
	str.push('>\n');
	
	for(var i=0;i<this.axisFormat.length;i++){
		str.push(this.axisFormat[i].toXML());
	}
	str.push('\n</timeAxisFormat>');
	return str.join('');
}
dev.report.model.XXyzDataset = function() {

	this.dataset = null;

	this.xySeries = [];

}

var _p = dev.report.model.XXyzDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='xyzDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
			  if(Element.nodeName=='xySeries'){
				var rp = new dev.report.model.XXySeries();
				rp.init(Element);
				this.xySeries.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<xyzDataset ');
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	for(var i=0;i<this.xySeries.length;i++){
		str.push(this.xySeries[i].toXML());
	}
	str.push('\n</xyzDataset>');
	return str.join('');
}
dev.report.model.XStackedBarChart = function() {

	this.chart = [];

	this.categoryDataset = [];

	this.barPlot = [];

}

var _p = dev.report.model.XStackedBarChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='stackedBarChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='categoryDataset'){
				var rp = new dev.report.model.XCategoryDataset();
				rp.init(Element);
				this.categoryDataset.push(rp);
			  }
			  if(Element.nodeName=='barPlot'){
				var rp = new dev.report.model.XBarPlot();
				rp.init(Element);
				this.barPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<stackedBarChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.categoryDataset.length;i++){
		str.push(this.categoryDataset[i].toXML());
	}
	for(var i=0;i<this.barPlot.length;i++){
		str.push(this.barPlot[i].toXML());
	}c
	str.push('\n</stackedBarChart>');
	return str.join('');
}

dev.report.model.XStackedBar3DChart = function() {

	this.chart = [];

	this.categoryDataset = [];

	this.bar3DPlot = [];

}

var _p = dev.report.model.XStackedBar3DChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='stackedBar3DChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='categoryDataset'){
				var rp = new dev.report.model.XCategoryDataset();
				rp.init(Element);
				this.categoryDataset.push(rp);
			  }
			  if(Element.nodeName=='bar3DPlot'){
				var rp = new dev.report.model.XBar3DPlot();
				rp.init(Element);
				this.bar3DPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<stackedBar3DChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.categoryDataset.length;i++){
		str.push(this.categoryDataset[i].toXML());
	}
	for(var i=0;i<this.bar3DPlot.length;i++){
		str.push(this.bar3DPlot[i].toXML());
	}c
	str.push('\n</stackedBar3DChart>');
	return str.join('');
}

dev.report.model.XLinePlot = function() {

	this.isShowLines = "";

	this.isShowShapes = "";


	this.plot = [];

	this.categoryAxisLabelExpression = null;

	this.categoryAxisFormat = null;

	this.valueAxisLabelExpression = null;

	this.valueAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XLinePlot.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='linePlot'){
		if(Elements.attributes.getNamedItem("isShowLines")!=null){
			this.isShowLines = Elements.attributes.getNamedItem("isShowLines");
		}
		if(Elements.attributes.getNamedItem("isShowShapes")!=null){
			this.isShowShapes = Elements.attributes.getNamedItem("isShowShapes");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='categoryAxisLabelExpression'){
				var rp = Element.firstChild;
				this.categoryAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='categoryAxisFormat'){
				var rp = Element.firstChild;
				this.categoryAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='valueAxisLabelExpression'){
				var rp = Element.firstChild;
				this.valueAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='valueAxisFormat'){
				var rp = Element.firstChild;
				this.valueAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<linePlot ');
	if(this.isShowShapes!="false"){
		str.push(' isShowShapes="'+this.isShowShapes+'"');
	}
	if(this.isShowLines!="false"){
		str.push(' isShowLines="'+this.isShowLines+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.categoryAxisLabelExpression!=null){
		str.push(this.categoryAxisLabelExpression.toXML());
	}
	if(this.categoryAxisFormat!=null){
		str.push(this.categoryAxisFormat.toXML());
	}
	if(this.valueAxisLabelExpression!=null){
		str.push(this.valueAxisLabelExpression.toXML());
	}
	if(this.valueAxisFormat!=null){
		str.push(this.valueAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</linePlot>');
	return str.join('');
}
dev.report.model.XLineChart = function() {

	this.chart = [];

	this.categoryDataset = [];

	this.linePlot = [];

}

var _p = dev.report.model.XLineChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='lineChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='categoryDataset'){
				var rp = new dev.report.model.XCategoryDataset();
				rp.init(Element);
				this.categoryDataset.push(rp);
			  }
			  if(Element.nodeName=='linePlot'){
				var rp = new dev.report.model.XLinePlot();
				rp.init(Element);
				this.linePlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<lineChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.categoryDataset.length;i++){
		str.push(this.categoryDataset[i].toXML());
	}
	for(var i=0;i<this.linePlot.length;i++){
		str.push(this.linePlot[i].toXML());
	}c
	str.push('\n</lineChart>');
	return str.join('');
}
dev.report.model.XXyLineChart = function() {

	this.chart = [];

	this.xyDataset = [];

	this.linePlot = [];

}

var _p = dev.report.model.XXyLineChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='xyLineChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='xyDataset'){
				var rp = new dev.report.model.XXyDataset();
				rp.init(Element);
				this.xyDataset.push(rp);
			  }
			  if(Element.nodeName=='linePlot'){
				var rp = new dev.report.model.XLinePlot();
				rp.init(Element);
				this.linePlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xyLineChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.xyDataset.length;i++){
		str.push(this.xyDataset[i].toXML());
	}
	for(var i=0;i<this.linePlot.length;i++){
		str.push(this.linePlot[i].toXML());
	}
	str.push('\n</xyLineChart>');
	return str.join('');
}
dev.report.model.XAreaChart = function() {

	this.chart = [];

	this.categoryDataset = [];

	this.areaPlot = [];

}

var _p = dev.report.model.XAreaChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='areaChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='categoryDataset'){
				var rp = new dev.report.model.XCategoryDataset();
				rp.init(Element);
				this.categoryDataset.push(rp);
			  }
			  if(Element.nodeName=='areaPlot'){
				var rp = new dev.report.model.XAreaPlot();
				rp.init(Element);
				this.areaPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<areaChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.categoryDataset.length;i++){
		str.push(this.categoryDataset[i].toXML());
	}
	for(var i=0;i<this.bar3DPlot.length;i++){
		str.push(this.bar3DPlot[i].toXML());
	}c
	str.push('\n</areaChart>');
	return str.join('');
}
dev.report.model.XAreaPlot = function() {

	this.plot = [];

	this.categoryAxisLabelExpression = null;

	this.categoryAxisFormat = null;

	this.valueAxisLabelExpression = null;

	this.valueAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XAreaPlot.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='areaPlot'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='categoryAxisLabelExpression'){
				var rp = Element.firstChild;
				this.categoryAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='categoryAxisFormat'){
				var rp = Element.firstChild;
				this.categoryAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='valueAxisLabelExpression'){
				var rp = Element.firstChild;
				this.valueAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='valueAxisFormat'){
				var rp = Element.firstChild;
				this.valueAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<areaPlot ');
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.categoryAxisLabelExpression!=null){
		str.push(this.categoryAxisLabelExpression.toXML());
	}
	if(this.categoryAxisFormat!=null){
		str.push(this.categoryAxisFormat.toXML());
	}
	if(this.valueAxisLabelExpression!=null){
		str.push(this.valueAxisLabelExpression.toXML());
	}
	if(this.valueAxisFormat!=null){
		str.push(this.valueAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</areaPlot>');
	return str.join('');
}
dev.report.model.XXyAreaChart = function() {

	this.chart = [];

	this.xyDataset = [];

	this.areaPlot = [];

}

var _p = dev.report.model.XXyAreaChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='xyAreaChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='xyDataset'){
				var rp = new dev.report.model.XXyDataset();
				rp.init(Element);
				this.xyDataset.push(rp);
			  }
			  if(Element.nodeName=='areaPlot'){
				var rp = new dev.report.model.XAreaPlot();
				rp.init(Element);
				this.areaPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xyAreaChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.xyDataset.length;i++){
		str.push(this.xyDataset[i].toXML());
	}
	for(var i=0;i<this.areaPlot.length;i++){
		str.push(this.areaPlot[i].toXML());
	}
	str.push('\n</xyAreaChart>');
	return str.join('');
}

dev.report.model.XXyDataset = function() {

	this.dataset = null;

	this.xySeries = [];

}

var _p = dev.report.model.XXyDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='xyDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='xySeries'){
				var rp = new dev.report.model.XXySeries();
				rp.init(Element);
				this.xySeries.push(rp);
			  }
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xyDataset ');
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	for(var i=0;i<this.xySeries.length;i++){
		str.push(this.xySeries[i].toXML());
	}
	str.push('\n</xyDataset>');
	return str.join('');
}

dev.report.model.XXySeries = function() {

	this.seriesExpression = null;

	this.xValueExpression = null;

	this.yValueExpression = null;

	this.labelExpression = null;

	this.itemHyperlink = null;
}

var _p = dev.report.model.XXySeries.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='xySeries'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='xValueExpression'){
				var rp = Element.firstChild;
				this.xValueExpression.init(rp);
			  }
			  if(Element.nodeName=='yValueExpression'){
				var rp = Element.firstChild;
				this.yValueExpression.init(rp);
			  }
			  if(Element.nodeName=='labelExpression'){
				var rp = Element.firstChild;
				this.labelExpression.init(rp);
			  }
			  if(Element.nodeName=='itemHyperlink'){
				var rp = Element.firstChild;
				this.itemHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xySeries ');
	str.push('>\n');

	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.xValueExpression!=null){
		str.push(this.xValueExpression.toXML());
	}
	if(this.yValueExpression!=null){
		str.push(this.yValueExpression.toXML());
	}
	if(this.labelExpression!=null){
		str.push(this.labelExpression.toXML());
	}
	if(this.itemHyperlink!=null){
		str.push(this.itemHyperlink.toXML());
	}
	str.push('\n</xySeries>');
	return str.join('');
}
dev.report.model.XYValueExpression = function() {

}

var _p = dev.report.model.XYValueExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<yValueExpression> ');

	str.push('\n</yValueExpression>');
	return str.join('');
}



dev.report.model.XScatterChart = function() {

	this.chart = [];

	this.xyDataset = [];

	this.scatterPlot = [];

}

var _p = dev.report.model.XScatterChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='scatterChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='xyDataset'){
				var rp = new dev.report.model.XXyDataset();
				rp.init(Element);
				this.xyDataset.push(rp);
			  }
			  if(Element.nodeName=='scatterPlot'){
				var rp = new dev.report.model.XScatterPlot();
				rp.init(Element);
				this.scatterPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<scatterChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.xyDataset.length;i++){
		str.push(this.xyDataset[i].toXML());
	}
	for(var i=0;i<this.scatterPlot.length;i++){
		str.push(this.scatterPlot[i].toXML());
	}
	str.push('\n</scatterChart>');
	return str.join('');
}
dev.report.model.XScatterPlot = function() {

	this.isShowLines = "";

	this.isShowShapes = "";


	this.plot = [];

	this.xAxisLabelExpression = null;

	this.xAxisFormat = null;

	this.yAxisLabelExpression = null;

	this.yAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XScatterPlot.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='scatterPlot'){
		if(Elements.attributes.getNamedItem("isShowLines")!=null){
			this.isShowLines = Elements.attributes.getNamedItem("isShowLines");
		}
		if(Elements.attributes.getNamedItem("isShowShapes")!=null){
			this.isShowShapes = Elements.attributes.getNamedItem("isShowShapes");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='xAxisLabelExpression'){
				var rp = Element.firstChild;
				this.xAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='xAxisFormat'){
				var rp = Element.firstChild;
				this.xAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='yAxisLabelExpression'){
				var rp = Element.firstChild;
				this.yAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='yAxisFormat'){
				var rp = Element.firstChild;
				this.yAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<scatterPlot ');
	if(this.isShowShapes!="false"){
		str.push(' isShowShapes="'+this.isShowShapes+'"');
	}
	if(this.isShowLines!="false"){
		str.push(' isShowLines="'+this.isShowLines+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.xAxisLabelExpression!=null){
		str.push(this.xAxisLabelExpression.toXML());
	}
	if(this.xAxisFormat!=null){
		str.push(this.xAxisFormat.toXML());
	}
	if(this.yAxisLabelExpression!=null){
		str.push(this.yAxisLabelExpression.toXML());
	}
	if(this.yAxisFormat!=null){
		str.push(this.yAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</scatterPlot>');
	return str.join('');
}

dev.report.model.XXAxisFormat = function() {

	this.axisFormat = [];
}

var _p = dev.report.model.XXAxisFormat.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='xAxisFormat'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='axisFormat'){
				var rp = new dev.report.model.XAxisFormat();
				rp.init(Element);
				this.axisFormat.push(rp);
			  }
		}
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<xAxisFormat ');
	
	str.push('>\n');
	
	for(var i=0;i<this.axisFormat.length;i++){
		str.push(this.axisFormat[i].toXML());
	}
	str.push('\n</xAxisFormat>');
	return str.join('');
}
dev.report.model.XYAxisFormat = function() {

	this.axisFormat = [];
}

var _p = dev.report.model.XYAxisFormat.prototype;

_p.init = function(Elements) {
	if(Elements.nodeName=='yAxisFormat'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='axisFormat'){
				var rp = new dev.report.model.XAxisFormat();
				rp.init(Element);
				this.axisFormat.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<yAxisFormat ');
	
	str.push('>\n');
	
	for(var i=0;i<this.axisFormat.length;i++){
		str.push(this.axisFormat[i].toXML());
	}
	str.push('\n</yAxisFormat>');
	return str.join('');
}

dev.report.model.XYAxisLabelExpression = function() {

}

var _p = dev.report.model.XYAxisLabelExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<yAxisLabelExpression> ');

	str.push('\n</yAxisLabelExpression>');
	return str.join('');
}




dev.report.model.XBubbleChart = function() {

	this.chart = [];

	this.xyzDataset = [];

	this.bubblePlot = [];

}

var _p = dev.report.model.XBubbleChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='bubbleChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				this.rp.init(Element);
				this.chart.push(rp);
			  }
			  if(Element.nodeName=='xyzDataset'){
				var rp = new dev.report.model.XXyzDataset();
				this.rp.init(Element);
				this.xyzDataset.push(rp);
			  }
			  if(Element.nodeName=='bubblePlot'){
				var rp = new dev.report.model.XBubblePlot();
				this.rp.init(Element);
				this.bubblePlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<bubbleChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.xyzDataset.length;i++){
		str.push(this.xyzDataset[i].toXML());
	}
	for(var i=0;i<this.bubblePlot.length;i++){
		str.push(this.bubblePlot[i].toXML());
	}
	str.push('\n</bubbleChart>');
	return str.join('');
}

dev.report.model.XXyzSeries = function() {

	this.seriesExpression = null;

	this.xValueExpression = null;

	this.yValueExpression = null;

	this.zValueExpression = null;

	this.itemHyperlink = null;
}

var _p = dev.report.model.XXyzSeries.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='xyzSeries'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='xValueExpression'){
				var rp = Element.firstChild;
				this.xValueExpression.init(rp);
			  }
			  if(Element.nodeName=='yValueExpression'){
				var rp = Element.firstChild;
				this.yValueExpression.init(rp);
			  }
			  if(Element.nodeName=='zValueExpression'){
				var rp = Element.firstChild;
				this.zValueExpression.init(rp);
			  }
			  if(Element.nodeName=='itemHyperlink'){
				var rp = Element.firstChild;
				this.itemHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xyzSeries ');
	str.push('>\n');

	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.xValueExpression!=null){
		str.push(this.xValueExpression.toXML());
	}
	if(this.yValueExpression!=null){
		str.push(this.yValueExpression.toXML());
	}
	if(this.zValueExpression!=null){
		str.push(this.zValueExpression.toXML());
	}
	if(this.itemHyperlink!=null){
		str.push(this.itemHyperlink.toXML());
	}
	str.push('\n</xyzSeries>');
	return str.join('');
}

dev.report.model.XZValueExpression = function() {

}

var _p = dev.report.model.XZValueExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<zValueExpression> ');

	str.push('\n</zValueExpression>');
	return str.join('');
}



dev.report.model.XBubblePlot = function() {

	this.scaleType = "";


	this.plot = [];

	this.xAxisLabelExpression = null;

	this.xAxisFormat = null;

	this.yAxisLabelExpression = null;

	this.yAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XBubblePlot.prototype;
_p.setScaleType =function(scaleType){
	this.scaleType = scaleType;
}
_p.getScaleType = function(){
	return this.scaleType;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='bubblePlot'){
		if(Elements.attributes.getNamedItem("scaleType")!=null){
			this.scaleType = Elements.attributes.getNamedItem("scaleType");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='xAxisLabelExpression'){
				var rp = Element.firstChild;
				this.xAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='xAxisFormat'){
				var rp = Element.firstChild;
				this.xAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='yAxisLabelExpression'){
				var rp = Element.firstChild;
				this.yAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='yAxisFormat'){
				var rp = Element.firstChild;
				this.yAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<bubblePlot ');
	if(this.scaleType !=""){
		str.push(' scaleType="'+this.scaleType+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.xAxisLabelExpression!=null){
		str.push(this.xAxisLabelExpression.toXML());
	}
	if(this.xAxisFormat!=null){
		str.push(this.xAxisFormat.toXML());
	}
	if(this.yAxisLabelExpression!=null){
		str.push(this.yAxisLabelExpression.toXML());
	}
	if(this.yAxisFormat!=null){
		str.push(this.yAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</bubblePlot>');
	return str.join('');
}

dev.report.model.XHighLowChart = function() {

	this.chart = [];

	this.highLowDataset = [];

	this.highLowPlot = [];

}

var _p = dev.report.model.XHighLowChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='highLowChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='highLowDataset'){
				var rp = new dev.report.model.XHighLowDataset();
				rp.init(Element);
				this.highLowDataset.push(rp);
			  }
			  if(Element.nodeName=='highLowPlot'){
				var rp = new dev.report.model.XHighLowPlot();
				rp.init(Element);
				this.highLowPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<highLowChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.highLowDataset.length;i++){
		str.push(this.highLowDataset[i].toXML());
	}
	for(var i=0;i<this.highLowPlot.length;i++){
		str.push(this.highLowPlot[i].toXML());
	}
	str.push('\n</highLowChart>');
	return str.join('');
}
dev.report.model.XHighLowPlot = function() {

	this.isShowCloseTicks = "";

	this.isShowOpenTicks = "";


	this.plot = [];

	this.timeAxisLabelExpression = null;

	this.timeAxisFormat = null;

	this.valueAxisLabelExpression = null;

	this.valueAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XHighLowPlot.prototype;


_p.init = function(Elements) {
	if(Elements.nodeName=='highLowPlot'){
		if(Elements.attributes.getNamedItem("isShowCloseTicks")!=null){
			this.isShowCloseTicks = Elements.attributes.getNamedItem("isShowCloseTicks");
		}
		if(Elements.attributes.getNamedItem("isShowOpenTicks")!=null){
			this.isShowOpenTicks = Elements.attributes.getNamedItem("isShowOpenTicks");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='timeAxisLabelExpression'){
				var rp = Element.firstChild;
				this.timeAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='timeAxisFormat'){
				var rp = Element.firstChild;
				this.timeAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='valueAxisLabelExpression'){
				var rp = Element.firstChild;
				this.valueAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='valueAxisFormat'){
				var rp = Element.firstChild;
				this.valueAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<highLowPlot ');
	if(this.isShowCloseTicks!="false"){
		str.push(' isShowCloseTicks="'+this.isShowCloseTicks+'"');
	}
	if(this.isShowOpenTicks!="false"){
		str.push(' isShowOpenTicks="'+this.isShowOpenTicks+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.timeAxisLabelExpression!=null){
		str.push(this.timeAxisLabelExpression.toXML());
	}
	if(this.timeAxisFormat!=null){
		str.push(this.timeAxisFormat.toXML());
	}
	if(this.valueAxisLabelExpression!=null){
		str.push(this.valueAxisLabelExpression.toXML());
	}
	if(this.valueAxisFormat!=null){
		str.push(this.valueAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</highLowPlot>');
	return str.join('');
}
dev.report.model.XHighLowDataset = function() {

	this.dataset = null;

	this.seriesExpression = null;

	this.dateExpression = null;

	this.highExpression = null;

	this.lowExpression = null;
	
	this.openExpression = null;

	this.closeExpression = null;

	this.volumeExpression = null;

	this.itemHyperlink = null;

}

var _p = dev.report.model.XHighLowDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='highLowDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='dateExpression'){
				var rp = Element.firstChild;
				this.dateExpression.init(rp);
			  }
			  if(Element.nodeName=='highExpression'){
				var rp = Element.firstChild;
				this.highExpression.init(rp);
			  }
			  if(Element.nodeName=='lowExpression'){
				var rp = Element.firstChild;
				this.lowExpression.init(rp);
			  }
			  if(Element.nodeName=='openExpression'){
				var rp = Element.firstChild;
				this.openExpression.init(rp);
			  }
			  if(Element.nodeName=='closeExpression'){
				var rp = Element.firstChild;
				this.closeExpression.init(rp);
			  }
			  if(Element.nodeName=='volumeExpression'){
				var rp = Element.firstChild;
				this.volumeExpression.init(rp);
			  }
			  if(Element.nodeName=='itemHyperlink'){
				var rp = Element.firstChild;
				this.itemHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xyzDataset ');
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.dateExpression!=null){
		str.push(this.dateExpression.toXML());
	}
	if(this.highExpression!=null){
		str.push(this.highExpression.toXML());
	}
	if(this.lowExpression!=null){
		str.push(this.lowExpression.toXML());
	}
	if(this.openExpression!=null){
		str.push(this.openExpression.toXML());
	}
	if(this.closeExpression!=null){
		str.push(this.closeExpression.toXML());
	}
	if(this.volumeExpression!=null){
		str.push(this.volumeExpression.toXML());
	}
	if(this.itemHyperlink!=null){
		str.push(this.itemHyperlink.toXML());
	}
	str.push('\n</highLowDataset>');
	return str.join('');
}

dev.report.model.XOpenExpression = function() {

}

var _p = dev.report.model.XOpenExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<openExpression> ');

	str.push('\n</openExpression>');
	return str.join('');
}

dev.report.model.XCloseExpression = function() {

}

var _p = dev.report.model.XCloseExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<closeExpression> ');

	str.push('\n</closeExpression>');
	return str.join('');
}

dev.report.model.XDateExpression = function() {

}

var _p = dev.report.model.XDateExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<dateExpression> ');

	str.push('\n</dateExpression>');
	return str.join('');
}

dev.report.model.XLowExpression = function() {

}

var _p = dev.report.model.XLowExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<lowExpression> ');

	str.push('\n</lowExpression>');
	return str.join('');
}


dev.report.model.XVolumeExpression = function() {

}

var _p = dev.report.model.XVolumeExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<volumeExpression> ');

	str.push('\n</volumeExpression>');
	return str.join('');
}


dev.report.model.XHighLowDataset = function() {

	this.dataset = null;

	this.seriesExpression = null;

	this.dateExpression = null;

	this.highExpression = null;

	this.lowExpression = null;
	
	this.openExpression = null;

	this.closeExpression = null;

	this.volumeExpression = null;

	this.itemHyperlink = null;

}

var _p = dev.report.model.XHighLowDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='highLowDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='dateExpression'){
				var rp = Element.firstChild;
				this.dateExpression.init(rp);
			  }
			  if(Element.nodeName=='highExpression'){
				var rp = Element.firstChild;
				this.highExpression.init(rp);
			  }
			  if(Element.nodeName=='lowExpression'){
				var rp = Element.firstChild;
				this.lowExpression.init(rp);
			  }
			  if(Element.nodeName=='openExpression'){
				var rp = Element.firstChild;
				this.openExpression.init(rp);
			  }
			  if(Element.nodeName=='closeExpression'){
				var rp = Element.firstChild;
				this.closeExpression.init(rp);
			  }
			  if(Element.nodeName=='volumeExpression'){
				var rp = Element.firstChild;
				this.volumeExpression.init(rp);
			  }
			  if(Element.nodeName=='itemHyperlink'){
				var rp = Element.firstChild;
				this.itemHyperlink.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<xyzDataset ');
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.dateExpression!=null){
		str.push(this.dateExpression.toXML());
	}
	if(this.highExpression!=null){
		str.push(this.highExpression.toXML());
	}
	if(this.lowExpression!=null){
		str.push(this.lowExpression.toXML());
	}
	if(this.openExpression!=null){
		str.push(this.openExpression.toXML());
	}
	if(this.closeExpression!=null){
		str.push(this.closeExpression.toXML());
	}
	if(this.volumeExpression!=null){
		str.push(this.volumeExpression.toXML());
	}
	if(this.itemHyperlink!=null){
		str.push(this.itemHyperlink.toXML());
	}
	str.push('\n</highLowDataset>');
	return str.join('');
}
dev.report.model.XHighRange = function() {

	this.dataRange = [];
}

var _p = dev.report.model.XHighRange.prototype;


_p.init = function(Elements) {
	if(Elements.nodeName=='highRange'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='dataRange'){
				var rp = new dev.report.model.XDataRange();
				rp.init(Element);
				this.dataRange.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<highRange ');
	str.push('>\n');
	for(var i=0;i<this.dataRange.length;i++){
		str.push(this.dataRange[i].toXML());
	}
	str.push('\n</highRange>');
	return str.join('');
}
dev.report.model.XHighExpression = function() {

}

var _p = dev.report.model.XHighExpression.prototype;

_p.init = function(Elements) {

}

_p.toXML = function() {
	var str=[];
	str.push('\n<highExpression> ');

	str.push('\n</highExpression>');
	return str.join('');
}

dev.report.model.XCandlestickChart = function() {

	this.chart = [];

	this.highLowDataset = [];

	this.candlestickPlot = [];

}

var _p = dev.report.model.XCandlestickChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='candlestickChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='highLowDataset'){
				var rp = new dev.report.model.XHighLowDataset();
				rp.init(Element);
				this.highLowDataset.push(rp);
			  }
			  if(Element.nodeName=='candlestickPlot'){
				var rp = new dev.report.model.XCandlestickPlot();
				rp.init(Element);
				this.candlestickPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<candlestickChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.highLowDataset.length;i++){
		str.push(this.highLowDataset[i].toXML());
	}
	for(var i=0;i<this.candlestickPlot.length;i++){
		str.push(this.candlestickPlot[i].toXML());
	}
	str.push('\n</candlestickChart>');
	return str.join('');
}
dev.report.model.XCandlestickPlot = function() {

	this.isShowVolume = "";


	this.plot = [];

	this.timeAxisLabelExpression = null;

	this.timeAxisFormat = null;

	this.valueAxisLabelExpression = null;

	this.valueAxisFormat = null;

	this.domainAxisMinValueExpression = null;

	this.domainAxisMaxValueExpression = null;

	this.rangeAxisMinValueExpression = null;

	this.rangeAxisMaxValueExpression = null;
}

var _p = dev.report.model.XCandlestickPlot.prototype;
_p.setIsShowVolume = function(isShowVolume){
	this.isShowVolume = isShowVolume;
}
_p.getIsShowVolume = function(){
	return this.isShowVolume;
}

_p.init = function(Elements) {
	if(Elements.nodeName=='candlestickPlot'){
		if(Elements.attributes.getNamedItem("isShowVolume")!=null){
			this.isShowVolume = Elements.attributes.getNamedItem("isShowVolume");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='timeAxisLabelExpression'){
				var rp = Element.firstChild;
				this.timeAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='timeAxisFormat'){
				var rp = Element.firstChild;
				this.timeAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='valueAxisLabelExpression'){
				var rp = Element.firstChild;
				this.valueAxisLabelExpression.init(rp);
			  }
			  if(Element.nodeName=='valueAxisFormat'){
				var rp = Element.firstChild;
				this.valueAxisFormat.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='domainAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.domainAxisMaxValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMinValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMinValueExpression.init(rp);
			  }
			  if(Element.nodeName=='rangeAxisMaxValueExpression'){
				var rp = Element.firstChild;
				this.rangeAxisMaxValueExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<candlestickPlot ');
	if(this.isShowVolume!="false"){
		str.push(' isShowVolume="'+this.isShowVolume+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.timeAxisLabelExpression!=null){
		str.push(this.timeAxisLabelExpression.toXML());
	}
	if(this.timeAxisFormat!=null){
		str.push(this.timeAxisFormat.toXML());
	}
	if(this.valueAxisLabelExpression!=null){
		str.push(this.valueAxisLabelExpression.toXML());
	}
	if(this.valueAxisFormat!=null){
		str.push(this.valueAxisFormat.toXML());
	}
	if(this.domainAxisMinValueExpression!=null){
		str.push(this.domainAxisMinValueExpression.toXML());
	}
	if(this.domainAxisMaxValueExpression!=null){
		str.push(this.domainAxisMaxValueExpression.toXML());
	}
	if(this.rangeAxisMinValueExpression!=null){
		str.push(this.rangeAxisMinValueExpression.toXML());
	}
	if(this.rangeAxisMaxValueExpression!=null){
		str.push(this.rangeAxisMaxValueExpression.toXML());
	}
	str.push('\n</candlestickPlot>');
	return str.join('');
}
dev.report.model.XMeterChart = function() {

	this.chart = [];

	this.valueDataset = [];

	this.meterPlot = [];

}

var _p = dev.report.model.XMeterChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='meterChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='valueDataset'){
				var rp = new dev.report.model.XValueDataset();
				rp.init(Element);
				this.valueDataset.push(rp);
			  }
			  if(Element.nodeName=='meterPlot'){
				var rp = new dev.report.model.XMeterPlot();
				rp.init(Element);
				this.meterPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<meterChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.valueDataset.length;i++){
		str.push(this.valueDataset[i].toXML());
	}
	for(var i=0;i<this.meterPlot.length;i++){
		str.push(this.meterPlot[i].toXML());
	}
	str.push('\n</meterChart>');
	return str.join('');
}
dev.report.model.XMeterPlot = function() {

	this.shape = "";
	/*
		chord:A straight line is drawn between the start point and the end point, and the area bounded by the meter and this line is shaded with the background color.
		circle:The unused portion of the circle that describes the meter is shaded with the background color.
		pie:The unused portion of the circle that describes the meter is not shaded at all.
		dial:The unused portion of the circle that describes the meter is shaded with the background color and handled with specific dial objects.
	*/


	this.plot = [];

	this.tickLabelFont = null;

	this.valueDisplay = null;

	this.dataRange = [];

	this.meterInterval = [];
}

var _p = dev.report.model.XMeterPlot.prototype;
_p.setShape = function(shape){
	this.shape = shape;
}
_p.getShape = function(){
	return this.shape;
}

_p.init = function(Elements) {
	if(Elements.nodeName=='meterPlot'){
		if(Elements.attributes.getNamedItem("shape")!=null){
			this.shape = Elements.attributes.getNamedItem("shape");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='tickLabelFont'){
				var rp = Element.firstChild;
				this.tickLabelFont.init(rp);
			  }
			  if(Element.nodeName=='valueDisplay'){
				var rp = Element.firstChild;
				this.valueDisplay.init(rp);
			  }
			  if(Element.nodeName=='dataRange'){
				var rp = new dev.report.model.XDataRange();
				rp.init(Element);
				this.dataRange.push(rp);
			  }
			  if(Element.nodeName=='meterInterval'){
				var rp = new dev.report.model.XMeterInterval();
				rp.init(Element);
				this.meterInterval.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<meterPlot ');
	if(this.shape!=""){
		str.push(' shape="'+this.shape+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.tickLabelFont!=null){
		str.push(this.tickLabelFont.toXML());
	}
	if(this.valueDisplay!=null){
		str.push(this.valueDisplay.toXML());
	}
	for(var i=0;i<this.dataRange.length;i++){
		str.push(this.dataRange[i].toXML());
	}
	for(var i=0;i<this.meterInterval.length;i++){
		str.push(this.meterInterval[i].toXML());
	}
	str.push('\n</meterPlot>');
	return str.join('');
}

dev.report.model.XValueDataset = function() {

	this.dataset = null;

	this.valueExpression = [];

}

var _p = dev.report.model.XValueDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='valueDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='valueExpression'){
				var rp = new dev.report.model.XValueExpression();
				rp.init(Element);
				this.valueExpression.push(rp);
			  }
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<valueDataset ');
	str.push('>\n');
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	for(var i=0;i<this.valueExpression.length;i++){
		str.push(this.valueExpression[i].toXML());
	}
	str.push('\n</valueDataset>');
	return str.join('');
}



dev.report.model.XMeterInterval = function() {

	this.label = "";

	this.color = "";

	this.alpha = "";


	this.dataRange = [];
}

var _p = dev.report.model.XMeterInterval.prototype;


_p.init = function(Elements) {
	if(Elements.nodeName=='meterInterval'){
		if(Elements.attributes.getNamedItem("label")!=null){
			this.label = Elements.attributes.getNamedItem("label");
		}
		if(Elements.attributes.getNamedItem("color")!=null){
			this.color = Elements.attributes.getNamedItem("color");
		}
		if(Elements.attributes.getNamedItem("alpha")!=null){
			this.alpha = Elements.attributes.getNamedItem("alpha");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='dataRange'){
				var rp = new dev.report.model.XDataRange();
				rp.init(Element);
				this.dataRange.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<meterInterval ');
	if(this.label!=""){
		str.push(' label="'+this.label+'"');
	}
	if(this.color!=""){
		str.push(' color="'+this.color+'"');
	}
	if(this.alpha!=""){
		str.push(' alpha="'+this.alpha+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.dataRange.length;i++){
		str.push(this.dataRange[i].toXML());
	}
	str.push('\n</meterInterval>');
	return str.join('');
}

dev.report.model.XThermometerChart = function() {

	this.chart = [];

	this.valueDataset = [];

	this.thermometerPlot = [];

}

var _p = dev.report.model.XThermometerChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='thermometerChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='valueDataset'){
				var rp = new dev.report.model.XValueDataset();
				rp.init(Element);
				this.valueDataset.push(rp);
			  }
			  if(Element.nodeName=='highLowPlot'){
				var rp = new dev.report.model.XThermometerPlot();
				rp.init(Element);
				this.thermometerPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<thermometerChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.valueDataset.length;i++){
		str.push(this.valueDataset[i].toXML());
	}
	for(var i=0;i<this.thermometerPlot.length;i++){
		str.push(this.thermometerPlot[i].toXML());
	}
	str.push('\n</thermometerChart>');
	return str.join('');
}

dev.report.model.XThermometerPlot = function() {

	this.valueLocation = "bulb";
	/*
		none:The textual value is not displayed.
		left:The text value is displayed to the left of the thermometer outline.
		right:The text value is displayed to the right of the thermometer outline.
		bulb:The text value is displayed in the bulb at the bottom of the thermometer.
	*/
	this.isShowValueLines = "false";
	/*
		true:Value lines are drawn.
		false:Value lines are not drawn.
	*/
	this.mercuryColor = "";


	this.plot = [];

	this.valueDisplay = null;

	this.dataRange = [];

	this.lowRange = null;

	this.mediumRange = null;

	this.highRange = null;
}

var _p = dev.report.model.XThermometerPlot.prototype;


_p.init = function(Elements) {
	if(Elements.nodeName=='thermometerPlot'){
		if(Elements.attributes.getNamedItem("valueLocation")!=null){
			this.valueLocation = Elements.attributes.getNamedItem("valueLocation");
		}
		if(Elements.attributes.getNamedItem("isShowValueLines")!=null){
			this.isShowValueLines = Elements.attributes.getNamedItem("isShowValueLines");
		}
		if(Elements.attributes.getNamedItem("mercuryColor")!=null){
			this.mercuryColor = Elements.attributes.getNamedItem("mercuryColor");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='valueDisplay'){
				var rp = Element.firstChild;
				this.valueDisplay.init(rp);
			  }
			  if(Element.nodeName=='dataRange'){
				var rp = new dev.report.model.XDataRange();
				rp.init(Element);
				this.dataRange.push(rp);
			  }
			  if(Element.nodeName=='lowRange'){
				var rp = Element.firstChild;
				this.lowRange.init(rp);
			  }
			  if(Element.nodeName=='mediumRange'){
				var rp = Element.firstChild;
				this.mediumRange.init(rp);
			  }
			  if(Element.nodeName=='highRange'){
				var rp = Element.firstChild;
				this.highRange.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<thermometerPlot ');
	if(this.valueLocation!=""){
		str.push(' valueLocation="'+this.valueLocation+'"');
	}
	if(this.isShowValueLines!="false"){
		str.push(' isShowValueLines="'+this.isShowValueLines+'"');
	}
	if(this.mercuryColor!=""){
		str.push(' mercuryColor="'+this.mercuryColor+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	if(this.valueDisplay!=null){
		str.push(this.valueDisplay.toXML());
	}
	for(var i=0;i<this.dataRange.length;i++){
		str.push(this.dataRange[i].toXML());
	}
	if(this.lowRange!=null){
		str.push(this.lowRange.toXML());
	}
	if(this.mediumRange!=null){
		str.push(this.mediumRange.toXML());
	}
	if(this.highRange!=null){
		str.push(this.highRange.toXML());
	}
	str.push('\n</thermometerPlot>');
	return str.join('');
}

dev.report.model.XDataRange = function() {

	this.highExpression = [];

	this.lowExpression = [];
}

var _p = dev.report.model.XDataRange.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='dataRange'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			 
			  if(Element.nodeName=='highExpression'){
				var rp = new dev.report.model.XHighExpression();
				rp.init(Element);
				this.highExpression.push(rp);
			  }
			  if(Element.nodeName=='lowExpression'){
				var rp = new dev.report.model.XLowExpression();
				rp.init(Element);
				this.lowExpression.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<dataRange ');
	str.push('>\n');
	for(var i=0;i<this.highExpression.length;i++){
		str.push(this.highExpression[i].toXML());
	}
	for(var i=0;i<this.lowExpression.length;i++){
		str.push(this.lowExpression[i].toXML());
	}
	str.push('\n</dataRange>');
	return str.join('');
}

dev.report.model.XLowRange = function() {

	this.dataRange = [];
}

var _p = dev.report.model.XLowRange.prototype;


_p.init = function(Elements) {
	if(Elements.nodeName=='lowRange'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='dataRange'){
				var rp = new dev.report.model.XDataRange();
				rp.init(Element);
				this.dataRange.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<lowRange ');
	str.push('>\n');
	for(var i=0;i<this.dataRange.length;i++){
		str.push(this.dataRange[i].toXML());
	}
	str.push('\n</lowRange>');
	return str.join('');
}

dev.report.model.XMediumRange = function() {

	this.dataRange = [];
}

var _p = dev.report.model.XMediumRange.prototype;


_p.init = function(Elements) {
	if(Elements.nodeName=='mediumRange'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='dataRange'){
				var rp = new dev.report.model.XDataRange();
				rp.init(Element);
				this.dataRange.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<mediumRange ');
	str.push('>\n');
	for(var i=0;i<this.dataRange.length;i++){
		str.push(this.dataRange[i].toXML());
	}
	str.push('\n</mediumRange>');
	return str.join('');
}
dev.report.model.XValueDisplay = function() {

	this.color = "";

	this.mask = "";


	this.font = null;
}

var _p = dev.report.model.XValueDisplay.prototype;
_p.setColor = function(color){
	this.color = color;
}
_p.getColor = function(){
	return this.color;
}
_p.setMask = function(mask){
	this.mask = mask;
}
_p.getMask = function(){
	return this.mask;
}
_p.init = function(Elements) {
	if(Elements.nodeName=='valueDisplay'){
		if(Elements.attributes.getNamedItem("color")!=null){
			this.color = Elements.attributes.getNamedItem("color");
		}
		if(Elements.attributes.getNamedItem("mask")!=null){
			this.mask = Elements.attributes.getNamedItem("mask");
		}
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='font'){
				var rp = Element.firstChild;
				this.font.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<valueDisplay ');
	if(this.color!=""){
		str.push(' color="'+this.color+'"');
	}
	if(this.mask!=""){
		str.push(' position="'+this.mask+'"');
	}
	str.push('>\n');
	if(this.font!=null){
		str.push(this.font.toXML());
	}
	str.push('\n</valueDisplay>');
	return str.join('');
}





dev.report.model.XMultiAxisChart = function() {

	this.chart = [];

	this.multiAxisPlot = [];

}

var _p = dev.report.model.XMultiAxisChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='multiAxisChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			  if(Element.nodeName=='multiAxisPlot'){
				var rp = new dev.report.model.XMultiAxisPlot();
				rp.init(Element);
				this.multiAxisPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<multiAxisChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.multiAxisPlot.length;i++){
		str.push(this.multiAxisPlot[i].toXML());
	}
	str.push('\n</multiAxisChart>');
	return str.join('');
}

dev.report.model.XMultiAxisPlot = function() {

	this.plot = [];

	this.axis = [];
}

var _p = dev.report.model.XMultiAxisPlot.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='multiAxisPlot'){
		
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='plot'){
				var rp = new dev.report.model.XPlot();
				rp.init(Element);
				this.plot.push(rp);
			  }
			  if(Element.nodeName=='axis'){
				var rp = new dev.report.model.XAxis();
				rp.init(Element);
				this.axis.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<multiAxisPlot ');
	str.push('>\n');
	
	for(var i=0;i<this.plot.length;i++){
		str.push(this.plot[i].toXML());
	}
	
	for(var i=0;i<this.axis.length;i++){
		str.push(this.axis[i].toXML());
	}
	str.push('\n</multiAxisPlot>');
	return str.join('');
}
dev.report.model.XStackedAreaChart = function() {

	this.chart = [];

	this.categoryDataset = [];

	this.areaPlot = [];

}

var _p = dev.report.model.XStackedAreaChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='stackedAreaChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='categoryDataset'){
				var rp = new dev.report.model.XCategoryDataset();
				rp.init(Element);
				this.categoryDataset.push(rp);
			  }
			  if(Element.nodeName=='areaPlot'){
				var rp = new dev.report.model.XAreaPlot();
				rp.init(Element);
				this.areaPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<stackedAreaChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.categoryDataset.length;i++){
		str.push(this.categoryDataset[i].toXML());
	}
	for(var i=0;i<this.areaPlot.length;i++){
		str.push(this.areaPlot[i].toXML());
	}c
	str.push('\n</stackedAreaChart>');
	return str.join('');
}
dev.report.model.XGanttChart = function() {

	this.chart = [];

	this.ganttDataset = [];

	this.barPlot = [];

}

var _p = dev.report.model.XGanttChart.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='ganttChart'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='chart'){
				var rp = new dev.report.model.XChart();
				rp.init(Element);
				this.chart.push(rp);
			  }
			 if(Element.nodeName=='ganttDataset'){
				var rp = new dev.report.model.XGanttDataset();
				rp.init(Element);
				this.ganttDataset.push(rp);
			  }
			  if(Element.nodeName=='barPlot'){
				var rp = new dev.report.model.XBarPlot();
				rp.init(Element);
				this.barPlot.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<ganttChart ');
	str.push('>\n');
	for(var i=0;i<this.chart.length;i++){
		str.push(this.chart[i].toXML());
	}
	for(var i=0;i<this.ganttDataset.length;i++){
		str.push(this.ganttDataset[i].toXML());
	}
	for(var i=0;i<this.barPlot.length;i++){
		str.push(this.barPlot[i].toXML());
	}
	str.push('\n</ganttChart>');
	return str.join('');
}
dev.report.model.XGanttDataset = function() {

	this.dataset = null;

	this.ganttSeries = [];

}

var _p = dev.report.model.XGanttDataset.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='ganttDataset'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  if(Element.nodeName=='ganttSeries'){
				var rp = new dev.report.model.XGanttSeries();
				rp.init(Element);
				this.ganttSeries.push(rp);
			  }
			 if(Element.nodeName=='dataset'){
				var rp = Element.firstChild;
				this.dataset.init(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<ganttDataset');
	str.push('>\n');
	for(var i=0;i<this.ganttSeries.length;i++){
		str.push(this.ganttSeries[i].toXML());
	}
	if(this.dataset!=null){
		str.push(this.dataset.toXML());
	}
	str.push('\n</ganttDataset>');
	return str.join('');
}
dev.report.model.XGanttSeries = function() {

	this.seriesExpression = null;

	this.startDateExpression = null;

	this.endDateExpression = null;

	this.percentExpression = null;

	this.taskExpression = [];

	this.subtaskExpression = [];
}

dev.report.model.XPercentExpression = function() {
}
var _p = dev.report.model.XPercentExpression.prototype;
_p.init = function(Elements) {
}
_p.toXML = function() {
	var str=[];
	str.push('\n<percentExpression> ');
	str.push('\n</percentExpression>');
	return str.join('');
}
dev.report.model.XTaskExpression = function() {

}
var _p = dev.report.model.XTaskExpression.prototype;
_p.init = function(Elements) {
}
_p.toXML = function() {
	var str=[];
	str.push('\n<taskExpression> ');
	str.push('\n</taskExpression>');
	return str.join('');
}
dev.report.model.XSubtaskExpression = function() {
}
var _p = dev.report.model.XSubtaskExpression.prototype;
_p.init = function(Elements) {

}
_p.toXML = function() {
	var str=[];
	str.push('\n<subtaskExpression> ');
	str.push('\n</subtaskExpression>');
	return str.join('');
}

var _p = dev.report.model.XGanttSeries.prototype;
_p.init = function(Elements) {
	if(Elements.nodeName=='ganttSeries'){
		var Elements=flowElement.childNodes;

		for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  
			  if(Element.nodeName=='seriesExpression'){
				var rp = Element.firstChild;
				this.seriesExpression.init(rp);
			  }
			  if(Element.nodeName=='startDateExpression'){
				var rp = Element.firstChild;
				this.startDateExpression.init(rp);
			  }
			  if(Element.nodeName=='endDateExpression'){
				var rp = Element.firstChild;
				this.endDateExpression.init(rp);
			  }
			  if(Element.nodeName=='percentExpression'){
				var rp = Element.firstChild;
				this.percentExpression.init(rp);
			  }
			  if(Element.nodeName=='taskExpression'){
				var rp = new dev.report.model.XTaskExpression();
				rp.init(Element);
				this.labelExpression.push(rp);
			  }
			   if(Element.nodeName=='subtaskExpression'){
				var rp = new dev.report.model.XSubtaskExpression();
				rp.init(Element);
				this.subtaskExpression.push(rp);
			  }
		}
	 }
}

_p.toXML = function() {
	var str=[];
	str.push('\n<ganttSeries ');
	str.push('>\n');

	if(this.seriesExpression!=null){
		str.push(this.seriesExpression.toXML());
	}
	if(this.startDateExpression!=null){
		str.push(this.startDateExpression.toXML());
	}
	if(this.endDateExpression!=null){
		str.push(this.endDateExpression.toXML());
	}
	if(this.percentExpression!=null){
		str.push(this.percentExpression.toXML());
	}
	for(var i=0;i<this.taskExpression.length;i++){
		str.push(this.taskExpression[i].toXML());
	}
	for(var i=0;i<this.subtaskExpression.length;i++){
		str.push(this.subtaskExpression[i].toXML());
	}
	str.push('\n</ganttSeries>');
	return str.join('');
}
dev.report.model.XAxis = function() {

	this.position = "";
	/*
		leftOrTop:Display the axis to the left (for charts with a Vertical orientation) or top (for charts with a Horizontal orientation.)
		rightOrBottom:Display the axis to the right (for charts with a Vertical orientation) or bottom (for charts with a Horizontal orientation.)
	*/

	this.barChart = [];

	this.bar3DChart = [];

	this.xyBarChart = [];

	this.stackedBarChart = [];

	this.stackedBar3DChart = [];

	this.lineChart = [];

	this.xyLineChart = [];

	this.areaChart = [];

	this.xyAreaChart = [];

	this.scatterChart = [];

	this.bubbleChart = [];

	this.timeSeriesChart = [];

	this.highLowChart = [];

	this.candlestickChart = [];

	this.stackedAreaChart = [];

	this.ganttChart = [];
}

var _p = dev.report.model.XAxis.prototype;
_p.setPosition = function(position){
	this.position = position;
}
_p.getPosition = function(){
	return this.position;
}

_p.init = function(Elements) {
	if(Elements.nodeName=='axis'){

		if(Elements.attributes.getNamedItem("position")!=null){
			this.position = Elements.attributes.getNamedItem("position");
		}
	 var Elements = flowElement.childNodes; 
	 for(var k=0;k<Elements.length;k++){
			  var Element=Elements[k];
			  }if(Element.nodeName=='barChart'){
				  var rp=new dev.report.model.XBarChart();
				  rp.init(Element);
				  this.barChart.push(rp);
			  }if(Element.nodeName=='bar3DChart'){
				  var rp=new dev.report.model.XBar3DChart();
				  rp.init(Element);
				  this.bar3DChart.push(rp);
			  }if(Element.nodeName=='xyBarChart'){
				  var rp=new dev.report.model.XXyBarChart();
				  rp.init(Element);
				  this.xyBarChart.push(rp);
			  }if(Element.nodeName=='stackedBarChart'){
				  var rp=new dev.report.model.XStackedBarChart();
				  rp.init(Element);
				  this.stackedBarChart.push(rp);
			  }if(Element.nodeName=='stackedBar3DChart'){
				  var rp=new dev.report.model.XStackedBar3DChart();
				  rp.init(Element);
				  this.stackedBar3DChart.push(rp);
			  }if(Element.nodeName=='lineChart'){
				  var rp=new dev.report.model.XLineChart();
				  rp.init(Element);
				  this.lineChart.push(rp);
			  }if(Element.nodeName=='xyLineChart'){
				  var rp=new dev.report.model.XXyLineChart();
				  rp.init(Element);
				  this.xyLineChart.push(rp);
			  }if(Element.nodeName=='areaChart'){
				  var rp=new dev.report.model.XAreaChart();
				  rp.init(Element);
				  this.areaChart.push(rp);
			  }if(Element.nodeName=='xyAreaChart'){
				  var rp=new dev.report.model.XXyAreaChart();
				  rp.init(Element);
				  this.xyAreaChart.push(rp);
			  }if(Element.nodeName=='scatterChart'){
				  var rp=new dev.report.model.XScatterChart();
				  rp.init(Element);
				  this.scatterChart.push(rp);
			  }if(Element.nodeName=='bubbleChart'){
				  var rp=new dev.report.model.XBubbleChart();
				  rp.init(Element);
				  this.bubbleChart.push(rp);
			  }if(Element.nodeName=='timeSeriesChart'){
				  var rp=new dev.report.model.XTimeSeriesChart();
				  rp.init(Element);
				  this.timeSeriesChart.push(rp);
			  }if(Element.nodeName=='highLowChart'){
				  var rp=new dev.report.model.XHighLowChart();
				  rp.init(Element);
				  this.highLowChart.push(rp);
			  }
			  if(Element.nodeName=='candlestickChart'){
				  var rp=new dev.report.model.XCandlestickChart();
				  rp.init(Element);
				  this.candlestickChart.push(rp);
			  }
			  if(Element.nodeName=='stackedAreaChart'){
				  var rp=new dev.report.model.XStackedAreaChart();
				  rp.init(Element);
				  this.stackedAreaChart.push(rp);
			  }
			  if(Element.nodeName=='ganttChart'){
				  var rp=new dev.report.model.XGanttChart();
				  rp.init(Element);
				  this.ganttChart.push(rp);
			  }
			  if(Element.nodeName=='genericElement'){
				  var rp=new dev.report.model.XGenericElement();
				  rp.init(Element);
				  this.genericElement.push(rp);
			  }
			  
	 }
}
_p.toXML = function() {
	var str=[];
	str.push('\n<axis ');
	if(this.position!=""){
		str.push(' position="'+this.position+'"');
	}
	str.push('>\n');
	
	for(var i=0;i<this.barChart.length;i++){
		str.push(this.barChart[i].toXML());
	}
	for(var i=0;i<this.bar3DChart.length;i++){
		str.push(this.bar3DChart[i].toXML());
	}
	for(var i=0;i<this.xyBarChart.length;i++){
		str.push(this.xyBarChart[i].toXML());
	}
	for(var i=0;i<this.stackedBarChart.length;i++){
		str.push(this.stackedBarChart[i].toXML());
	}
	for(var i=0;i<this.stackedBar3DChart.length;i++){
		str.push(this.stackedBar3DChart[i].toXML());
	}
	for(var i=0;i<this.lineChart.length;i++){
		str.push(this.lineChart[i].toXML());
	}
	for(var i=0;i<this.xyLineChart.length;i++){
		str.push(this.xyLineChart[i].toXML());
	}
	for(var i=0;i<this.areaChart.length;i++){
		str.push(this.areaChart[i].toXML());
	}
	for(var i=0;i<this.xyAreaChart.length;i++){
		str.push(this.xyAreaChart[i].toXML());
	}
	for(var i=0;i<this.scatterChart.length;i++){
		str.push(this.scatterChart[i].toXML());
	}
	for(var i=0;i<this.bubbleChart.length;i++){
		str.push(this.bubbleChart[i].toXML());
	}
	for(var i=0;i<this.timeSeriesChart.length;i++){
		str.push(this.timeSeriesChart[i].toXML());
	}
	for(var i=0;i<this.highLowChart.length;i++){
		str.push(this.highLowChart[i].toXML());
	}
	for(var i=0;i<this.candlestickChart.length;i++){
		str.push(this.candlestickChart[i].toXML());
	}
	
	for(var i=0;i<this.stackedAreaChart.length;i++){
		str.push(this.stackedAreaChart[i].toXML());
	}
	for(var i=0;i<this.ganttChart.length;i++){
		str.push(this.ganttChart[i].toXML());
	}
	
	str.push('\n</axis>');
	return str.join('');
}

