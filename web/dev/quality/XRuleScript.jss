XCleanSchema = function(){
	this.ruleList=[];
	this.name = "";
}
XCleanSchema.prototype.setName=function(name){	
	this.name=name;
}
XCleanSchema.prototype.getName=function(){
	return this.name;
}
XCleanSchema.prototype.addObjItems=function(schemaItems){
	this.ruleList.push(schemaItems);
}
XCleanSchema.prototype.getObjItems=function(){
	return this.ruleList;
}
XCleanSchema.prototype.getObjTipValue=function(objname){
	return "方案";
}
XCleanSchema.prototype.getObjAttributes=function(obj){

}
XCleanSchema.prototype.getChildItems=function(){
	return ["XRuleList"];
}
XCleanSchema.prototype.isHaveItems=function(ruleItems){
	return true;
}
XCleanSchema.prototype.getObjName=function(){
	return "XCleanSchema";
}
XCleanSchema.prototype.getObjCnName=function(){
	return "方案";
}
XCleanSchema.prototype.getObjIcon=function(){
	return "";
}
XCleanSchema.prototype.toXML=function(){
	var str=[];
	str.push('<?xml version="1.0" encoding="UTF-8"?>');
	str.push('\r<dataAnalysisRules xmlns="http://www.sun.com/schema/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sun.com/schema/DIDataAnalysisSchema.xsd">');
	str.push('\r	<cleansingRules>');
	var _schemaItems = this.ruleList;
	if (_schemaItems&&_schemaItems.length>0) {           
		for(var i=0;i<_schemaItems.length;i++){
			 str.push(_schemaItems[i].toXML());
		}			
	}
	str.push('\r	</cleansingRules>');
	str.push('\r</dataAnalysisRules>');
	return str.join('');
}
XCleanSchema.prototype.init=function(schemaElement){
	this.setName("XCleanSchema"+Math.random());
	var allElement=schemaElement.childNodes;
	for(var j=0;j<allElement.length;j++){
		if(allElement[j].nodeName=="cleansingRules"){
			var childElements = allElement[j].childNodes;
			for(var i=0;i<childElements.length;i++){
				if(childElements[i].nodeName=="ruleList"){
					var rulelist=new XRuleList();
					rulelist.init(childElements[i]);
					this.addObjItems(rulelist);
					break;
				}
			}
		}
	}
}

XRuleList = function(){
	this.ruleListItems = [];
	this.name = "";
}
XRuleList.prototype.setName=function(name){	
	this.name=name;
}
XRuleList.prototype.getName=function(){
	return this.name;
}
XRuleList.prototype.getObjAttributes=function(obj){

}
XRuleList.prototype.getObjTipValue=function(objname){
	return "规则列表";
}
XRuleList.prototype.getObjIcon=function(){
	return "/themes/icon/database/table.gif";
}
XRuleList.prototype.getObjName=function(){
	return "XRuleList";
}
XRuleList.prototype.addObjItems=function(ruleItems){
		this.ruleListItems.push(ruleItems);
}
XRuleList.prototype.getObjItems=function(){
	return this.ruleListItems;
}
XRuleList.prototype.getChildItems=function(){
	return ["XRule"];
}
XRuleList.prototype.isHaveItems=function(ruleItems){
	if(this.ruleListItems.length>0){
		return true;
	}else{
		return false;
	}
}
XRuleList.prototype.toXML=function(){
	var str=[];
	str.push('\r	<ruleList>');
	var _ruleListItems = this.ruleListItems;
	if (_ruleListItems&&_ruleListItems.length>0) {           
		for(var i=0;i<_ruleListItems.length;i++){
			 str.push(_ruleListItems[i].toXML());
		}			
	}
	str.push('\r	</ruleList>');
	return str.join('');
}
XRuleList.prototype.init=function(ruleListElement){
	var allElement=ruleListElement.childNodes;
	this.setName("RuleList"+Math.random());
	for(var j=0;j<allElement.length;j++){
		if(allElement[j].nodeName=="rule"){
			var itemElement=allElement[j];
			var rule=new XRule();
			rule.init(itemElement);
			this.addObjItems(rule);
		}
	}
}

XRule = function(){
	//this.id="";
	this.name="";
	this.conditions=[];
	this.conditionType="and";
}
XRule.prototype.getObjAttributes=function(obj){
}
XRule.prototype.getObjTipValue=function(objname){
	return "规则";
}
XRule.prototype.getObjIcon=function(){
	return "/themes/icon/database/tablenode.gif";
}
XRule.prototype.getObjName=function(){
	return "XRule";
}
XRule.prototype.setName=function(name){	
	this.name=name;
}
XRule.prototype.getName=function(){
	return this.name;
}
XRule.prototype.addObjItems=function(ruleItems){
		this.conditions.push(ruleItems);
}
XRule.prototype.getObjItems=function(){
	return this.conditions;
}
XRule.prototype.getChildItems=function(){
	return ["delrule"];
}
XRule.prototype.isHaveItems=function(ruleItems){
	if(this.conditionType.length>0){
		return true;
	}else{
		return false;
	}
}
XRule.prototype.toXML=function(){
	var str=[];
	str.push('\r			<rule>');
	var _conditions = this.conditions;
	if (_conditions&&_conditions.length>0) {           
		for(var i=0;i<_conditions.length;i++){
			 str.push(_conditions[i].toXML());
		}			
	}
	str.push('\r			</rule>');
	return str.join('');
}
XRule.prototype.init=function(ruleElement){
	var allElement=ruleElement.childNodes;
	this.setName("Rule"+Math.random());
	for(var j=0;j<allElement.length;j++){
		if(allElement[j].nodeName=="if"){
			var itemElement=allElement[j];
			var obj=new XIf();
			obj.init(itemElement);
			this.addObjItems(obj);
		}
	}
}

XIf = function(){
	this.name = "";
	this.conditions = [];
}
XIf.prototype.getObjAttributes=function(obj){

}
XIf.prototype.getObjTipValue=function(objname){
	return "if";
}
XIf.prototype.getObjIcon=function(){
	return "/themes/icon/database/forward_nav.gif";
}
XIf.prototype.getObjName=function(){
	return "XIf";
}
XIf.prototype.setName=function(name){	
	this.name=name;
}
XIf.prototype.getName=function(){
	return this.name;
}
XIf.prototype.addObjItems=function(conditionItems){
	this.conditions.push(conditionItems);
}
XIf.prototype.getObjItems=function(){
	return this.conditions;
}
XIf.prototype.getChildItems=function(){
	return [];
}
XIf.prototype.isHaveItems=function(conditionItems){
	if(this.conditions.length>0){
		return true;
	}else{
		return false;
	}
}
XIf.prototype.toXML=function(){
	var str=[];
	str.push('\r				<if>');
	var _conditions = this.conditions;
	if (_conditions&&_conditions.length>0) {           
		for(var i=0;i<_conditions.length;i++){
			 str.push(_conditions[i].toXML());
		}			
	}
	str.push('\r				</if>');
	return str.join('');
}
XIf.prototype.init=function(conditionElement){
	var allElement=conditionElement.childNodes;
	this.setName("If"+Math.random());
	for(var j=0;j<allElement.length;j++){
		var itemElement=allElement[j];
		if(itemElement.nodeName=='condition'){				
			var obj=new XCondition();
			obj.init(itemElement);
			this.addObjItems(obj);
		}
		if(itemElement.nodeName=='then'){				
			var obj=new Xthen();
			obj.init(itemElement);
			this.addObjItems(obj);
		}
	}
}

XCondition = function(){
	this.name = "";
	this.conditionType = "";
	this.items = [];
}
XCondition.prototype.getObjAttributes=function(obj){

}
XCondition.prototype.getObjTipValue=function(objname){
	return "条件";
}
XCondition.prototype.getObjIcon=function(){
	return "/themes/icon/database/configs.gif";
}
XCondition.prototype.getObjName=function(){
	return "XCondition";
}
XCondition.prototype.setName=function(name){	
	this.name=name;
}
XCondition.prototype.getName=function(){
	return this.name;
}
XCondition.prototype.setConditionType=function(conditionType){	
	this.conditionType=conditionType;
}
XCondition.prototype.getConditionType=function(){
	return this.conditionType;
}
XCondition.prototype.addObjItems=function(conditionItems){
		this.items.push(conditionItems);
}
XCondition.prototype.getObjItems=function(){
	return this.items;
}
XCondition.prototype.getChildItems=function(){
	return [];
}
XCondition.prototype.isHaveItems=function(conditionItems){
	if(this.items.length>0){
		return true;
	}else{
		return false;
	}
}
XCondition.prototype.getObj=function(objname){
	switch(objname){
		case "isnull":
			return new XIsNull();
			break;
		case "equals":
			return new XEquals();
			break;
		case "matches":
			return new XMatches();
			break;
		case "dataLength":
			return new XDataLength();
			break;
		case "largerThan":
			return new XLargerThan();
			break;
		case "smallerThan":
			return new XSmallerThan();
			break;
		case "foreignIn":
			return new XForeignIn();
			break;
		case "foreignOut":
			return new XForeignOut();
			break;
		case "dictIn":
			return new XDictIn();
			break;
	}
}
XCondition.prototype.toXML=function(){
	var str=[];
	str.push('\r					<condition>');
	if(this.conditionType != ""){
		str.push('\r						<',this.conditionType);
		str.push('>');
	}
	var _conditions = this.items;
	if (_conditions&&_conditions.length>0) {           
		for(var i=0;i<_conditions.length;i++){
			 str.push(_conditions[i].toXML());
		}			
	}
	if(this.conditionType != ""){
		str.push('\r						</',this.conditionType);
		str.push('>');
	}
	str.push('\r					</condition>');
	return str.join('');
}
XCondition.prototype.init=function(conditionElement){
	var allElement=conditionElement.childNodes;
	this.setName("Condition"+Math.random());
	for(var j=0;j<allElement.length;j++){
		var itemElement=allElement[j];
		if(itemElement.nodeName=='and' || itemElement.nodeName=='or'){
			this.setConditionType(itemElement.nodeName);
			var andChildElement=itemElement.childNodes;
			for(var h=0;h<andChildElement.length;h++){
				if(andChildElement[h].nodeName=='not'){
					var notChildElement=andChildElement[h].childNodes;
					for(var k=0;k<notChildElement.length;k++){
						var obj = this.getObj(notChildElement[k].nodeName);
						if(typeof(obj) != "undefined"){
							obj.init(notChildElement[k]);
							obj.setIsNot("not");
							this.addObjItems(obj);
						}
					}
				}else{
					var obj = this.getObj(andChildElement[h].nodeName);
					if(typeof(obj) != "undefined"){
						obj.init(andChildElement[h]);
						this.addObjItems(obj);
					}
				}
				
			}
		}else{
			if(itemElement.nodeName=='not'){
				var notChildElement=itemElement.childNodes;
				for(var k=0;k<notChildElement.length;k++){
					var obj = this.getObj(notChildElement[k].nodeName);
					if(typeof(obj) != "undefined"){
						obj.init(notChildElement[k]);
						obj.setIsNot("not");
						this.addObjItems(obj);
					}
				}
			}else{
				var obj = this.getObj(itemElement.nodeName);
				if(typeof(obj) != "undefined"){
					obj.init(itemElement);
					this.addObjItems(obj);
				}
			}
		}
	}
}

Xthen = function(){
	this.name = "";
	this.resobjs = [];
}
Xthen.prototype.getObjAttributes=function(obj){

}
Xthen.prototype.getObjTipValue=function(objname){
	return "then";
}
Xthen.prototype.getObjIcon=function(){
	return "/themes/icon/database/feature_obj.gif";
}
Xthen.prototype.getObjName=function(){
	return "Xthen";
}
Xthen.prototype.setName=function(name){	
	this.name=name;
}
Xthen.prototype.getName=function(){
	return this.name;
}
Xthen.prototype.addObjItems=function(resItems){
		this.resobjs.push(resItems);
}
Xthen.prototype.getObjItems=function(){
	return this.resobjs;
}
Xthen.prototype.getChildItems=function(){
	return ["XIf"];
}
Xthen.prototype.isHaveItems=function(resItems){
	//var allElement=resItems.childNodes;
	if(this.resobjs.length>0){
		return true;
	}else{
		return false;
	}
}
Xthen.prototype.toXML=function(){
	var str=[];
	str.push('\r					<then>');
	var _resobjs = this.resobjs;
	if (_resobjs&&_resobjs.length>0) {           
		for(var i=0;i<_resobjs.length;i++){
			 str.push(_resobjs[i].toXML());
		}			
	}
	str.push('\r					</then>');
	return str.join('');
}
Xthen.prototype.init=function(resItems){
	var allElement=resItems.childNodes;
	this.setName("then"+Math.random());
	for(var j=0;j<allElement.length;j++){
		var itemElement=allElement[j];
		if(itemElement.nodeName=='reject'){				
			var obj=new XReject();
			obj.init(itemElement);
			this.addObjItems(obj);
		}
		if(itemElement.nodeName=="if"){
			var obj=new XIf();
			obj.init(itemElement);
			this.addObjItems(obj);
		}
	}
}

XReject = function(){
	this.name= "";
	this.fieldName = "";
	this.errorType = "";
	this.errorMessage = "";
	this.errorLevel = "";
	this.items = [];
}
XReject.prototype.getObjTipValue=function(objname){
	return "扫描结果设置";
}
XReject.prototype.getObjAttributes=function(obj){
	return { 
			"字段名称":obj.getFieldName(),
			"错误类型":obj.getErrorType(),
			"错误级别":obj.getErrorLevel(),
			"错误提示":obj.getErrorMessage()
			};
}
XReject.prototype.getObjIcon=function(){
	return "/themes/icon/database/filelist.gif";
}
XReject.prototype.getObjName=function(){
	return "XReject";
}
XReject.prototype.setName=function(name){	
	this.name=name;
}
XReject.prototype.getName=function(){
	return this.name;
}
XReject.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XReject.prototype.getFieldName=function(){
	return this.fieldName;
}
XReject.prototype.setErrorType=function(errorType){	
	this.errorType=errorType;
}
XReject.prototype.getErrorType=function(){
	return this.errorType;
}
XReject.prototype.setErrorMessage=function(errorMessage){	
	this.errorMessage=errorMessage;
}
XReject.prototype.getErrorMessage=function(){
	return this.errorMessage;
}
XReject.prototype.setErrorLevel=function(errorLevel){	
	this.errorLevel=errorLevel;
}
XReject.prototype.getErrorLevel=function(){
	return this.errorLevel;
}
XReject.prototype.addObjItems=function(items){
	this.items.push(items);
}
XReject.prototype.getObjItems=function(){
	return this.items;
}
XReject.prototype.getChildItems=function(){
	return [];
}
XReject.prototype.isHaveItems=function(items){
	return false;
}
XReject.prototype.toXML=function(){
	var str=[];
	str.push('\r						<reject   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
	}
	if(this.errorType!=""){
		str.push(' errorType="',this.errorType);
		str.push('"');
	}
	if(this.errorMessage!=""){
		str.push(' errorMessage="',this.errorMessage);
		str.push('"');
	}
	if(this.errorLevel!=""){
		str.push(' errorLevel="',this.errorLevel);
		str.push('"');
	}
	str.push('/>');
	return str.join('');
}
XReject.prototype.init=function(items){
	this.setName("XReject"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
	var errorType = items.attributes.getNamedItem("errorType");
	if (errorType != null){
		this.setErrorType(errorType.value);
	}
	var errorMessage = items.attributes.getNamedItem("errorMessage");
	if (errorMessage != null){
		this.setErrorMessage(errorMessage.value);
	}
	var errorLevel = items.attributes.getNamedItem("errorLevel");
	if (errorLevel != null){
		this.setErrorLevel(errorLevel.value);
	}
}


XIsNull = function(){
	this.name= "";
	this.fieldName = "";
	this.value2 = "";
	this.isNot = "";
	this.items = [];
}
XIsNull.prototype.getObjTipValue=function(objname){
	return "空值规则";
}
XIsNull.prototype.getObjAttributes=function(obj){
	return { 
			"字段名称":obj.getFieldName()
			};
}
XIsNull.prototype.getObjIcon=function(){
	return "/themes/icon/database/pkColumn.gif";
}
XIsNull.prototype.getObjName=function(){
	return "XIsNull";
}
XIsNull.prototype.setName=function(name){	
	this.name=name;
}
XIsNull.prototype.getName=function(){
	return this.name;
}
XIsNull.prototype.setIsNot=function(isNot){	
	this.isNot=isNot;
}
XIsNull.prototype.getIsNot=function(){
	return this.isNot;
}
XIsNull.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XIsNull.prototype.getFieldName=function(){
	return this.fieldName;
}
XIsNull.prototype.getOperator=function(){
	var operator = "为空";
	if(this.isNot != "")
		operator = "不为空";
	return operator;
}
XIsNull.prototype.setValue2=function(value2){	
	this.value2=value2;
}
XIsNull.prototype.getValue2=function(){
	return this.value2;
}
XIsNull.prototype.addObjItems=function(items){
	this.items.push(items);
}
XIsNull.prototype.getObjItems=function(){
	return this.items;
}
XIsNull.prototype.getChildItems=function(){
	return [];
}
XIsNull.prototype.isHaveItems=function(items){
	return false;
}
XIsNull.prototype.toXML=function(){
	var str=[];
	if(this.isNot != ""){
		str.push('\r							<not>');
	}
	str.push('\r								<isnull   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
	}
	str.push('/>');
	if(this.isNot != ""){
		str.push('\r							</not>');
	}
	return str.join('');
}
XIsNull.prototype.init=function(items){
	this.setName("IsNull"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
}
//----------------------------
XEquals = function(){
	this.name= "";
	this.fieldName = "";
	this.value2 = "";
	this.exact = "true";
	this.isNot = "";
	this.items = [];
}
XEquals.prototype.getObjTipValue=function(objname){
	return "字段比较";
}
XEquals.prototype.getObjAttributes=function(obj){
	return { 
			"字段名称":obj.getFieldName()
			};
}
XEquals.prototype.getObjIcon=function(){
	return "/themes/icon/database/connected_session.gif";
}
XEquals.prototype.getObjName=function(){
	return "XEquals";
}
XEquals.prototype.setName=function(name){	
	this.name=name;
}
XEquals.prototype.getName=function(){
	return this.name;
}
XEquals.prototype.setIsNot=function(isNot){	
	this.isNot=isNot;
}
XEquals.prototype.getIsNot=function(){
	return this.isNot;
}
XEquals.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XEquals.prototype.getFieldName=function(){
	return this.fieldName;
}
XEquals.prototype.getOperator=function(){
	var operator = "等于";
	if(this.isNot != "")
		operator = "不等于";
	return operator;
}
XEquals.prototype.setValue2=function(value2){	
	this.value2=value2;
}
XEquals.prototype.getValue2=function(){
	return this.value2;
}
XEquals.prototype.setExact=function(exact){	
	this.exact=exact;
}
XEquals.prototype.getExact=function(){
	return this.exact;
}
XEquals.prototype.addObjItems=function(items){
	this.items.push(items);
}
XEquals.prototype.getObjItems=function(){
	return this.items;
}
XEquals.prototype.getChildItems=function(){
	return [];
}
XEquals.prototype.isHaveItems=function(items){
	return false;
}
XEquals.prototype.toXML=function(){
	var str=[];
	if(this.isNot != ""){
		str.push('\r							<not>');
	}
	str.push('\r								<equals   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
		str.push(' value2="',this.value2);
		str.push('"');
		str.push(' exact="',this.exact);
		str.push('"');
	}
	str.push('/>');
	if(this.isNot != ""){
		str.push('\r							</not>');
	}
	return str.join('');
}
XEquals.prototype.init=function(items){
	this.setName("Equals"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
	var value2 = items.attributes.getNamedItem("value2");
	if (value2 != null){
		this.setValue2(value2.value);
	}
	var exact = items.attributes.getNamedItem("exact");
	if (exact != null){
		this.setExact(exact.value);
	}
}

//-------------------------------------------------------

XDataLength = function(){
	this.name= "";
	this.fieldName = "";
	this.len = "";
	this.more = "true";
	//this.isNot = "";
	this.items = [];
}
XDataLength.prototype.getObjTipValue=function(objname){
	return "字段长度";
}
XDataLength.prototype.getObjAttributes=function(obj){
	return {};
}
XDataLength.prototype.getObjIcon=function(){
	return "/themes/icon/database/columns.gif";
}
XDataLength.prototype.getObjName=function(){
	return "XDataLength";
}
XDataLength.prototype.setName=function(name){	
	this.name=name;
}
XDataLength.prototype.getName=function(){
	return this.name;
}
/*XDataLength.prototype.setIsNot=function(isNot){	
	this.isNot=isNot;
}
XDataLength.prototype.getIsNot=function(){
	return this.isNot;
}*/
XDataLength.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XDataLength.prototype.getFieldName=function(){
	return this.fieldName;
}
XDataLength.prototype.getOperator=function(){
	return "字段长度";
}
XDataLength.prototype.setLen=function(len){	
	this.len=len;
}
XDataLength.prototype.getLen=function(){
	return this.len;
}
XDataLength.prototype.setMore=function(more){	
	this.more=more;
}
XDataLength.prototype.getMore=function(){
	return this.more;
}
XDataLength.prototype.addObjItems=function(items){
	this.items.push(items);
}
XDataLength.prototype.getObjItems=function(){
	return this.items;
}
XDataLength.prototype.getChildItems=function(){
	return [];
}
XDataLength.prototype.isHaveItems=function(items){
	return false;
}
XDataLength.prototype.toXML=function(){
	var str=[];
	/*if(this.isNot != ""){
		str.push('\r							<not>');
	}*/
	str.push('\r								<dataLength   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
		str.push(' len="',this.len);
		str.push('"');
		str.push(' more="',this.more);
		str.push('"');
	}
	str.push('/>');
	/*if(this.isNot != ""){
		str.push('\r							</not>');
	}*/
	return str.join('');
}
XDataLength.prototype.init=function(items){
	this.setName("DataLength"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
	var len = items.attributes.getNamedItem("len");
	if (len != null){
		this.setLen(len.value);
	}
	var more = items.attributes.getNamedItem("more");
	if (more != null){
		this.setMore(more.value);
	}
}

//---------------------------------------------------------
XLargerThan = function(){
	this.name= "";
	this.fieldName = "";
	this.value2 = "";
	//this.isNot = "";
	this.items = [];
}
XLargerThan.prototype.getObjTipValue=function(objname){
	return "大于";
}
XLargerThan.prototype.getObjAttributes=function(obj){
	return {};
}
XLargerThan.prototype.getObjIcon=function(){
	return "/themes/icon/database/connected_session.gif";
}
XLargerThan.prototype.getObjName=function(){
	return "XLargerThan";
}
XLargerThan.prototype.setName=function(name){	
	this.name=name;
}
XLargerThan.prototype.getName=function(){
	return this.name;
}
/*XLargerThan.prototype.setIsNot=function(isNot){	
	this.isNot=isNot;
}
XLargerThan.prototype.getIsNot=function(){
	return this.isNot;
}*/
XLargerThan.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XLargerThan.prototype.getFieldName=function(){
	return this.fieldName;
}
XLargerThan.prototype.getOperator=function(){
	return "大于";
}
XLargerThan.prototype.setValue2=function(value2){	
	this.value2=value2;
}
XLargerThan.prototype.getValue2=function(){
	return this.value2;
}
XLargerThan.prototype.addObjItems=function(items){
	this.items.push(items);
}
XLargerThan.prototype.getObjItems=function(){
	return this.items;
}
XLargerThan.prototype.getChildItems=function(){
	return [];
}
XLargerThan.prototype.isHaveItems=function(items){
	return false;
}
XLargerThan.prototype.toXML=function(){
	var str=[];
	/*if(this.isNot != ""){
		str.push('\r							<not>');
	}*/
	str.push('\r								<largerThan   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
		str.push(' value2="',this.value2);
		str.push('"');
	}
	str.push('/>');
	/*if(this.isNot != ""){
		str.push('\r							</not>');
	}*/
	return str.join('');
}
XLargerThan.prototype.init=function(items){
	this.setName("LargerThan"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
	var value2 = items.attributes.getNamedItem("value2");
	if (value2 != null){
		this.setValue2(value2.value);
	}
}
//--------------------------------------------------------
XSmallerThan = function(){
	this.name= "";
	this.fieldName = "";
	this.value2 = "";
	//this.isNot = "";
	this.items = [];
}
XSmallerThan.prototype.getObjTipValue=function(objname){
	return "小于";
}
XSmallerThan.prototype.getObjAttributes=function(obj){
	return {};
}
XSmallerThan.prototype.getObjIcon=function(){
	return "/themes/icon/database/connected_session.gif";
}
XSmallerThan.prototype.getObjName=function(){
	return "XSmallerThan";
}
XSmallerThan.prototype.setName=function(name){	
	this.name=name;
}
XSmallerThan.prototype.getName=function(){
	return this.name;
}
/*XLargerThan.prototype.setIsNot=function(isNot){	
	this.isNot=isNot;
}
XLargerThan.prototype.getIsNot=function(){
	return this.isNot;
}*/
XSmallerThan.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XSmallerThan.prototype.getFieldName=function(){
	return this.fieldName;
}
XSmallerThan.prototype.getOperator=function(){
	return "小于";
}
XSmallerThan.prototype.setValue2=function(value2){	
	this.value2=value2;
}
XSmallerThan.prototype.getValue2=function(){
	return this.value2;
}
XSmallerThan.prototype.addObjItems=function(items){
	this.items.push(items);
}
XSmallerThan.prototype.getObjItems=function(){
	return this.items;
}
XSmallerThan.prototype.getChildItems=function(){
	return [];
}
XSmallerThan.prototype.isHaveItems=function(items){
	return false;
}
XSmallerThan.prototype.toXML=function(){
	var str=[];
	/*if(this.isNot != ""){
		str.push('\r							<not>');
	}*/
	str.push('\r								<smallerThan   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
		str.push(' value2="',this.value2);
		str.push('"');
	}
	str.push('/>');
	/*if(this.isNot != ""){
		str.push('\r							</not>');
	}*/
	return str.join('');
}
XSmallerThan.prototype.init=function(items){
	this.setName("SmallerThan"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
	var value2 = items.attributes.getNamedItem("value2");
	if (value2 != null){
		this.setValue2(value2.value);
	}
}
//--------------------------------------------------------

XForeignOut = function(){
	this.name= "";
	this.fieldName = "";
	this.foreignTable = "";
	this.value2 = "";
	this.items = [];
}
XForeignOut.prototype.getObjTipValue=function(objname){
	return "关联规则";
}
XForeignOut.prototype.getObjAttributes=function(obj){
	return {};
}
XForeignOut.prototype.getObjIcon=function(){
	return "/themes/icon/database/pkfk_rdbcolumn.gif";
}
XForeignOut.prototype.getObjName=function(){
	return "XForeignOut";
}
XForeignOut.prototype.setName=function(name){	
	this.name=name;
}
XForeignOut.prototype.getName=function(){
	return this.name;
}
XForeignOut.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XForeignOut.prototype.getFieldName=function(){
	return this.fieldName;
}
XForeignOut.prototype.setForeignTable=function(foreignTable){	
	this.foreignTable=foreignTable;
}
XForeignOut.prototype.getForeignTable=function(){
	return this.foreignTable;
}
XForeignOut.prototype.getOperator=function(){
	return "foreignOut";
}
XForeignOut.prototype.setValue2=function(value2){	
	this.value2=value2;
}
XForeignOut.prototype.getValue2=function(){
	return this.value2;
}
XForeignOut.prototype.addObjItems=function(items){
	this.items.push(items);
}
XForeignOut.prototype.getObjItems=function(){
	return this.items;
}
XForeignOut.prototype.getChildItems=function(){
	return [];
}
XForeignOut.prototype.isHaveItems=function(items){
	return false;
}
XForeignOut.prototype.toXML=function(){
	var str=[];
	str.push('\r								<foreignOut   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
	}
	if(this.fieldName!=""){
		str.push(' foreignTable="',this.foreignTable);
		str.push('"');
	}
	str.push('/>');
	return str.join('');
}
XForeignOut.prototype.init=function(items){
	this.setName("XForeignOut"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
	var foreignTable = items.attributes.getNamedItem("foreignTable");
	if (foreignTable != null){
		this.setForeignTable(foreignTable.value);
	}
}

//------------------------------------------------------------------
XForeignIn = function(){
	this.name= "";
	this.fieldName = "";
	this.foreignTable = "";
	this.value2 = "";
	this.items = [];
}
XForeignIn.prototype.getObjTipValue=function(objname){
	return "ForeignIn";
}
XForeignIn.prototype.getObjAttributes=function(obj){
	return {};
}
XForeignIn.prototype.getObjIcon=function(){
	return "/themes/icon/database/pkfk_rdbcolumn.gif";
}
XForeignIn.prototype.getObjName=function(){
	return "XForeignIn";
}
XForeignIn.prototype.setName=function(name){	
	this.name=name;
}
XForeignIn.prototype.getName=function(){
	return this.name;
}
XForeignIn.prototype.setFieldName=function(fieldname){	
	this.fieldName=fieldname;
}
XForeignIn.prototype.getFieldName=function(){
	return this.fieldName;
}
XForeignIn.prototype.setForeignTable=function(foreignTable){	
	this.foreignTable=foreignTable;
}
XForeignIn.prototype.getForeignTable=function(){
	return this.foreignTable;
}
XForeignIn.prototype.getOperator=function(){
	return "foreignIn";
}
XForeignIn.prototype.setValue2=function(value2){	
	this.value2=value2;
}
XForeignIn.prototype.getValue2=function(){
	return this.value2;
}
XForeignIn.prototype.addObjItems=function(items){
	this.items.push(items);
}
XForeignIn.prototype.getObjItems=function(){
	return this.items;
}
XForeignIn.prototype.getChildItems=function(){
	return [];
}
XForeignIn.prototype.isHaveItems=function(items){
	return false;
}
XForeignIn.prototype.toXML=function(){
	var str=[];
	str.push('\r								<foreignIn   ');
	if(this.fieldName!=""){
		str.push(' fieldName="',this.fieldName);
		str.push('"');
	}
	if(this.fieldName!=""){
		str.push(' foreignTable="',this.foreignTable);
		str.push('"');
	}
	str.push('/>');
	return str.join('');
}
XForeignIn.prototype.init=function(items){
	this.setName("XForeignIn"+Math.random());
	var fieldname = items.attributes.getNamedItem("fieldName");
	if (fieldname != null){
		this.setFieldName(fieldname.value);
	}
	var foreignTable = items.attributes.getNamedItem("foreignTable");
	if (foreignTable != null){
		this.setForeignTable(foreignTable.value);
	}
}