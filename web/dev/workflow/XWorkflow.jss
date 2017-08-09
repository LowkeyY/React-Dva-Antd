//-----------------------------------XMeta定义----------------------------------------------------

	XMeta=function(){
		this.name='';
		this.value='';
	}   
	XMeta.prototype.setName=function(name) {
		this.name=name;
	}
	XMeta.prototype.getName=function() {
			return this.name;   
	}
	XMeta.prototype.setValue=function(value) {
		this.value=value;
	}
	XMeta.prototype.getValue=function() {  
		if(this.value!=null){
			return this.value.LTrim().RTrim(); 
		}else{
		   return '';
		}
	}
	XMeta.prototype.init=function(name,value){
		this.name=name;
		this.value=value;
	}

//--------------------------------------------------------------------------------------------

	XArg=function(){
		this.name='';
		this.value='';
	}

    XArg.prototype.setName=function(name) {
		this.name=name;
    }

    XArg.prototype.getName=function() {
        return this.name;
    }

    XArg.prototype.setValue=function(value) {
		this.value=value;
    }

    XArg.prototype.getValue=function() {
       	if(this.value!=null){
			return this.value.LTrim().RTrim(); 
		}else{
		   return '';
		} 
    }

	XArg.prototype.init=function(name,value){
		this.name=name;
		this.value=value;
	}

//------------------------------注册值(register)-----------------------------------------------

	XRegister=function(){
		this.type;
		this.variableName;
		this.args={};
	}

 	XRegister.prototype.getArgs=function() {
        return this.args;
    }

	XRegister.prototype.addArgs=function(arg){
		var _args=this.args;
		if(_args[arg.getName()]){
			return _args[arg.getName()];
		}
		_args[arg.getName()]=arg;
		this.args=_args;
	}

    XRegister.prototype.setType=function(type) {
        this.type = type;
    }

    XRegister.prototype.getType=function() {
        return this.type;
    }

    XRegister.prototype.setVariableName=function(variableName) {
        this.variableName = variableName;
    }

    XRegister.prototype.getVariableName=function(){
        return this.variableName;
    }

	XRegister.prototype.toXML=function(){
		var str=[];
		var _args=this.args;
		str.push('\n  <register type="',this.type,'" variable-name="',this.variableName,'">');
		for(var i in _args){
			str.push('\n   <arg name="');
			str.push(_args[i].getName());
			str.push('">');
            if ("beanshell"==this.type || "bsf"==this.type) {
                str.push('<![CDA');
				str.push('TA[');
                str.push(_args[i].getValue());
				str.push(']');
                str.push(']>');
            } else {
               str.push(_args[i].getValue());
            }
			str.push('</arg>');
		}
		str.push('\n </register>');
		return str.join('');
	}

	XRegister.prototype.init=function(registerElement){
		
		var	type = registerElement.attributes.getNamedItem("type");
		if(type!=null)
			this.setType(type.value);

		var	variableName = registerElement.attributes.getNamedItem("variable-name");
		if(variableName!=null)
			this.setVariableName(variableName.value);

		var argElements=registerElement.childNodes;
		for(var j=0;j<argElements.length;j++){
			var argElement=argElements[j];
			if(argElement.nodeName=='arg'){				
				var	argName = argElement.attributes.getNamedItem("name");
				var	argValue =argElement.firstChild.data;
				var arg=new XArg();
				arg.init(argName.value,argValue);
				this.addArgs(arg);
			}
		}
	}

//----------------------------------条件(Condition)---------------------------------------------

	XCondition=function(){
		this.id;
		this.type;
		this.name;
		this.negate=false;
		this.args={};
	}

	XCondition.prototype.addArgs=function(arg){
		var _args=this.args;
		if(_args[arg.getName()]){
			return _args[arg.getName()];
		}
		_args[arg.getName()]=arg;
		this.args=_args;
	}

 	XCondition.prototype.getArgs=function() {
        return this.args;
    }

	XCondition.prototype.setId=function(id){
		this.id = id;
	}
	XCondition.prototype.getId=function(){
		return this.id;
	}
	XCondition.prototype.setName=function(name){
		this.name = name;
	}
	XCondition.prototype.getName=function(){
		return this.name;
	}
	XCondition.prototype.setNegate=function(negate){
		this.negate = negate;
	}
	XCondition.prototype.isNegate=function(){
		return this.negate;
	}
	XCondition.prototype.setType=function(type){
		this.type = type;
	}
	XCondition.prototype.getType=function(){
		return this.type;
	}

	XCondition.prototype.toXML=function(){
		var str=[];
		var _args=this.args;	
		str.push('\n	<condition  type="',this.type);
		
		if(this.id!=null){
			str.push('" id="',this.id);
		}

		if(this.name!=null){
			str.push('" name="',this.name);
		}

		if(this.negate!=null){
			str.push('" negate="',this.negate);
		}

		str.push('">');
		for(var i in _args){
			str.push('\n 	 <arg name="');
			str.push(_args[i].getName());
			str.push('">');
            if ("beanshell"==this.type || "bsf"==this.type) {
				str.push('<![CDA');
				str.push('TA[');
                 str.push(_args[i].getValue());
				str.push(']');
                str.push(']>');
            } else {
               str.push(_args[i].getValue());
            }
			str.push('</arg>');
		}
		str.push('\n	</condition>');
		return str.join('');
	}

	XCondition.prototype.init=function(conditionElement){
	
		var	type = conditionElement.attributes.getNamedItem("type");
		if(type!=null)
			this.setType(type.value);

		var	id = conditionElement.attributes.getNamedItem("id");
		if(id!=null)
			this.setId(id.value);

		var	n = conditionElement.attributes.getNamedItem("negate");
		if(n!=null)
			this.setNegate(n.value);

		var	name = conditionElement.attributes.getNamedItem("name");
		if(name!=null)
			this.setName(name.value);

		var argElements=conditionElement.childNodes;
		for(var j=0;j<argElements.length;j++){
			var argElement=argElements[j];
			if(argElement.nodeName=='arg'){				
				var	argName = argElement.attributes.getNamedItem("name");
				var	argValue =argElement.firstChild.data;
				var arg=new XArg();
				arg.init(argName.value,argValue);
				this.addArgs(arg);
			}
		}
	}

//------------------------------条件组(Conditions)---------------------------------------------

	XConditions=function(){
		this.type;
		this.conditions=[];
	}

	XConditions.prototype.addCondition=function(condition){
		this.conditions.push(condition);
	}

	XConditions.prototype.getConditions=function(){
		return this.conditions;
	}
	XConditions.prototype.setType=function(type){
		this.type = type;
	}
	XConditions.prototype.getType=function(){
		return this.type;
	}

	XConditions.prototype.toXML=function(){
		var str=[];
		var _conditions=this.conditions;	

		if (_conditions&&_conditions.length>0) {
           str.push('\n    <conditions');
            if (_conditions.length>1) {
				 str.push(' type="',this.type,'"');
            }
            str.push('>');
			for(var i=0;i<_conditions.length;i++){
				 str.push(_conditions[i].toXML());
			}
			 str.push('\n    </conditions>');
        }
		return str.join('');
	}

	XConditions.prototype.init=function(conditionElement){

		var	type = conditionElement.attributes.getNamedItem("type");
		
		if(type!=null)
			this.setType(type.value);
	
		var allConditionElement=conditionElement.childNodes;
		for(var j=0;j<allConditionElement.length;j++){
			var condElement=allConditionElement[j];
			  if(condElement.nodeName=='condition'){				
					var cd=new XCondition();
					cd.init(condElement);
					this.addCondition(cd);
			  }
			  if(condElement.nodeName=='conditions'){
					this.init(condElement);
			  }
		}
	}

//------------------------------功能(Function)-------------------------------------------------

	XFunction=function(){
		this.type;   
		this.name;
		this.args={};
	}

 	XFunction.prototype.getArgs=function() {
        return this.args;
    }

	XFunction.prototype.addArgs=function(arg){
		this.args[arg.getName()]=arg;
	}

    XFunction.prototype.setType=function(type) {
        this.type = type;
    }

    XFunction.prototype.getType=function() {
        return this.type;
    }

    XFunction.prototype.setName=function(name) {
        this.name = name;
    }

    XFunction.prototype.getName=function(){
        return  this.name;
    }

	XFunction.prototype.toXML=function(){
		var str=[];
		var _as=this.args;
		str.push('\n   <function  type="',this.type,'" name="',this.name);		
		if(this.id!=null){
			str.push('" id="',this.id);
		}
		str.push('">');

		for(var i in _as){
			str.push('\n   <arg name="');
			str.push(_as[i].getName());
			str.push('">');
            if ("beanshell"==this.type || "bsf"==this.type) {
				str.push('<![CDA');
				str.push('TA[');
                str.push(_as[i].getValue());
				str.push(']');
                str.push(']>');
            } else {
               str.push(_as[i].getValue());
            }
			str.push('</arg>');
		}
		str.push('\n   </function>');
		return str.join('');
	}

	XFunction.prototype.init=function(functionElement){
		
		var	type = functionElement.attributes.getNamedItem("type");
		if(type!=null)
			this.setType(type.value);

		var	name = functionElement.attributes.getNamedItem("name");
		if(name!=null)
			this.setName(name.value);

		var argElements=functionElement.childNodes;
		for(var j=0;j<argElements.length;j++){
			var argElement=argElements[j];
			if(argElement.nodeName=='arg'){				
				var	argName = argElement.attributes.getNamedItem("name");
				var	argValue =argElement.firstChild.data;
				var arg=new XArg();
				arg.init(argName.value,argValue);
				this.addArgs(arg);
			}
		}
	}

//------------------------------结果(Result)---------------------------------------------------

	XResult=function(){
		this.id='';
		this.displayName='';
		this.owner='';
		this.hasStep=false;
		this.status='';
		this.oldStatus='';
		this.dueDate='';
		this.preFunctions={};
		this.postFunctions={};
		this.join='';
		this.split=0;
		this.step=0;
	}

    XResult.prototype.setDisplayName=function(displayName) {
         this.displayName = displayName;
    }
    XResult.prototype.getDisplayName=function() {
          return this.displayName;
    }
	
	XResult.prototype.setId=function(id) {
         this.id = id;
    }

	XResult.prototype.getId=function() {
         return this.id;
    }

	XResult.prototype.setOwner=function(owner) {
         this.owner = owner;
    }

	XResult.prototype.getOwner=function() {
         return this.owner;
    }
	
	XResult.prototype.setDueDate=function(dueDate) {
         this.dueDate = dueDate;
    }

	XResult.prototype.getDueDate=function() {
         return this.dueDate;
    }

	XResult.prototype.getPostFunctions=function() {
         return this.postFunctions;
    }

	XResult.prototype.getPreFunctions=function() {
         return this.preFunctions;
    }
	XResult.prototype.removePostFunctions=function() {
        this.postFunctions={};
    }

	XResult.prototype.removePreFunctions=function() {
        this.preFunctions={};
    }

	XResult.prototype.addPostFunctions=function(ft){
		var _ft=this.postFunctions;
		_ft[ft.getName()]=ft;
		this.postFunctions=_ft;
	}
	XResult.prototype.addPreFunctions=function(ft){
		var _ft=this.preFunctions;
		_ft[ft.getName()]=ft;
		this.preFunctions=_ft;
	}
	XResult.prototype.setStatus=function(status) {
         this.status = status;
    }

	XResult.prototype.getStatus=function() {
         return this.status;
    }

	XResult.prototype.setOldStatus=function(oldStatus) {
        this.oldStatus = oldStatus;
    }
	XResult.prototype.getOldStatus=function() {
        return this.oldStatus;
    }

    XResult.prototype.setJoin=function(join) {
         this.join = join;
    }

	XResult.prototype.getJoin=function() {
          return this.join;
    }

    XResult.prototype.setSplit=function(split) {
         this.split = split;
    }

	XResult.prototype.getSplit=function() {
          return this.split;
    }

	XResult.prototype.setStep=function(step) {
        this.step = step;
		this.hasStep = true;
    }
	XResult.prototype.getStep=function() {
        return this.step;
    }
	
    XResult.prototype.printPostFunctions=function() {
		var str=[];
		var posf=this.postFunctions;
        if (!isEmty(posf)) {
			str.push('\n <post-functions>');
			for(var i in posf){
				str.push(posf[i].toXML());
			}
			str.push('\n  </post-functions>');
        }
		return str.join('');
    }

    XResult.prototype.printPreFunctions=function() {
		var str=[];
		var pref=this.preFunctions;
        if (!isEmty(pref)) {
			str.push('\n  <pre-functions>');
			for(var i in pref){
				str.push(pref[i].toXML());
			}
			str.push('\n  </pre-functions>');
        }
		return str.join('');
    }

	XResult.prototype.toXML=function(){
		var str=[];
		str.push(' \n    <unconditional-result');
		if(this.id!=''){
			str.push(' id="',this.id,'"');
		}
		if(this.dueDate!=''){
			str.push(' due-date=\"',this.dueDate,'"');
		}
		str.push(' old-status="',this.oldStatus,'"');

        if (this.join != 0) {
			str.push(' join="',this.join,'"');
        } else if (this.split != 0) {
			str.push(' split="',this.split,'"');
        } else {
			str.push(' status="',this.status,'"');
			str.push(' step="',this.step,'"');
			if(this.owner!=''){
				str.push(' owner=\"',this.owner,'"');
			}
			if(this.displayName!=''){
				str.push(' display-name=\"',this.displayName,'"');
			}
        }
		var pre=this.preFunctions;
		var pos=this.postFunctions;
        if (isEmty(pre) && isEmty(pos)) {
            str.push('/>');
        } else {
            str.push('>');
			str.push(this.printPreFunctions());
			str.push(this.printPostFunctions());
			str.push('\n    </unconditional-result>');
        }
		return str.join('');
	}

    XResult.prototype.init=function(resultElement) {
 
		var	oldStatus = resultElement.attributes.getNamedItem("old-status");
		
		if(oldStatus!=null)
		this.setOldStatus(oldStatus.value);

		var	status = resultElement.attributes.getNamedItem("status");
		
		if(status!=null)
			this.setStatus(status.value);

		var	owner = resultElement.attributes.getNamedItem("owner");
		
		if(owner!=null)
		this.setOwner(owner.value);

		var	displayName = resultElement.attributes.getNamedItem("display-name");
		
		if(displayName!=null)
			this.setDisplayName(displayName.value);

		var	id = resultElement.attributes.getNamedItem("id");
		
		if(id!=null)
			this.setId(id.value);

		var	dueDate = resultElement.attributes.getNamedItem("due-date");
		if(dueDate!=null)
			this.setDueDate(dueDate.value);

		var	split = resultElement.attributes.getNamedItem("split");
		if(split!=null)
			this.setSplit(split.value);

		var	join = resultElement.attributes.getNamedItem("join");
		if(join!=null)
			this.setJoin(join.value);

		var	step = resultElement.attributes.getNamedItem("step");
		if(step!=null)
			this.setStep(step.value);

		var functionElements=resultElement.childNodes;
		for(var k=0;k<functionElements.length;k++){
			  var functionElement=functionElements[k];
			  if(functionElement.nodeName=='pre-functions'){
					var preElement=functionElement.childNodes;
					if (preElement != null) {
						for(var j=0;j<preElement.length;j++){
							var funtionElememt=preElement[j];
							if(funtionElememt.nodeName=='function'){				
								var ft=new XFunction();
								ft.init(funtionElememt);
								this.addPreFunctions(ft);
							}
						}
					}			  
			  }
			  if(functionElement.nodeName=='post-functions'){
					var postElement=functionElement.childNodes;
					if (postElement != null) {
						for(var j=0;j<postElement.length;j++){
							var funtionElememt=postElement[j];
							if(funtionElememt.nodeName=='function'){				
								var ft=new XFunction();
								ft.init(funtionElememt);
								this.addPostFunctions(ft);
							}
						}
					}			  
			  }
		}
    }

//------------------------------条件结果(Result)---------------------------------------------------

	XConditionResult=function(){
		this.result;
		this.conditions;
	}
	XConditionResult.prototype.getConditions=function(){
	        return this.conditions;
	}
	XConditionResult.prototype.removeConditions=function(condition){
			this.conditions=null;
	}
	XConditionResult.prototype.setConditions=function(condition){
			this.conditions=condition;
	}
	XConditionResult.prototype.getResult=function(){
	        return this.result;
	}
	XConditionResult.prototype.setResult=function(result){
	       this.result=result;
	}
	XConditionResult.prototype.toXML=function(){
		var str=[];
		str.push(' \n    <result');
		var rt=this.result;

		if(rt.getId()!=''){
			str.push(' id="',rt.getId(),'"');
		}
		if(rt.getDueDate()!=''){
			str.push(' due-date=\"',rt.getDueDate(),'"');
		}
		str.push(' old-status="',rt.getOldStatus(),'"');

        if (rt.getJoin() != 0) {
			str.push(' join="',this.join,'"');
        } else if (rt.getSplit()!= 0) {
			str.push(' split="',this.split,'"');
        } else {
			str.push(' status="',rt.getStatus(),'"');
			str.push(' step="',rt.getStep(),'"');
			if(rt.getOwner()!=''){
				str.push(' owner=\"',rt.getOwner(),'"');
			}
			if(rt.getDisplayName()!=''){
				str.push(' display-name=\"',rt.getDisplayName(),'"');
			}
        }
		str.push('>');

		var _as=this.conditions;

		if(_as!=null)
			str.push(_as.toXML());

		var pre=rt.preFunctions;
		var pos=rt.postFunctions;
        if (!isEmty(pre)) {
			str.push(rt.printPreFunctions());
        }
		if (!isEmty(pos)) {
			str.push(rt.printPostFunctions());
        }
		str.push('\n    </result>');
		return str.join('');
	}

    XConditionResult.prototype.init=function(resultElement) {
		var rt=new XResult();
		rt.init(resultElement);
		this.result=rt;
		var resultChildElements=resultElement.childNodes;
		for(var k=0;k<resultChildElements.length;k++){
			  var resultChildElement=resultChildElements[k];
			  if(resultChildElement.nodeName=='conditions'){				
					var cds=new XConditions();
					cds.init(resultChildElement);
					this.setConditions(cds);
			  }
		}
    }

//-------------------------------条件(Restriction)--------------------------------------------
	XRestriction=function(){
		this.conditions;
	}
	XRestriction.prototype.getConditions=function(){
	        return this.conditions;
	}
	XRestriction.prototype.setConditions=function(condition){
			this.conditions=condition;
	}
	XRestriction.prototype.removeConditions=function(){
	        this.conditions=null;
	}
	XRestriction.prototype.toXML=function(){
		var str=[];
		var _as=this.conditions;

		if(_as&&_as.conditions.length>0){
			str.push('\n  <restrict-to>');
			str.push(_as.toXML());	
			str.push('\n  </restrict-to>');
		}
		
		return str.join('');
	}  
	XRestriction.prototype.init=function(restrictionElements){
		var restrictionElement=restrictionElements.childNodes;
		for(var j=0;j<restrictionElement.length;j++){
			var conditionElement=restrictionElement[j];
			  if(conditionElement.nodeName=='conditions'){				
					var cds=new XConditions();
					cds.init(conditionElement);
					this.setConditions(cds);
			  }
		}
	}
//-------------------------------动作(Action)--------------------------------------------------

	XAction=function(id){
		this.id=id;
		this.name;  
		this.view;  
		this.autoExecute=false;  
		this.finish=false; 
		this.comment=false;
		this.common;
		this.restriction;
		this.conditionalResults={};
		this.metaAttributes={};		
		this.postFunctions={};
		this.preFunctions={};
		this.metaAttributes={};
		this.unconditionalResult;
	}

	XAction.prototype.setId=function(id){
		this.id=id;
	}

	XAction.prototype.getId=function(){
		 return this.id;
	}

	XAction.prototype.addMetaAttributes=function(meta){
		var _meta=this.metaAttributes;
		_meta[meta.getName()]=meta;
		this.metaAttributes=_meta;
	}

	XAction.prototype.getMetaAttributes=function(){
		 return this.metaAttributes;
	}

	XAction.prototype.setAutoExecute=function(autoExecute){
		 this.autoExecute = autoExecute;
	}

	XAction.prototype.getAutoExecute=function(){
		 return this.autoExecute;
	}

	XAction.prototype.setComment=function(comment){
		 this.comment = comment;
	}

	XAction.prototype.getComment=function(){
		 return this.comment;
	}

	XAction.prototype.isCommon=function(){
		 return this.common;
	}

	XAction.prototype.getConditionalResults=function(){
		 return this.conditionalResults;
	}

	XAction.prototype.removeConditionalResult=function(id){
		 var _crt=this.conditionalResults;
		 for(var i in _crt){
			 var tmpId=0;
			var rt=_crt[i].getResult();
			 if (rt.getJoin() != 0) {
				tmpId=rt.getJoin();
			} else if (rt.getSplit()!= 0) {
				tmpId=rt.getSplit();
			} else {
				tmpId=rt.getStep();
			}
			if(id==rt.getId()){
				delete this.conditionalResults[tmpId];
			}
		}
	}

	XAction.prototype.addConditionalResults=function(result){
		 var _crt=this.conditionalResults;
		 var id=0;
		 var rt=result.getResult();
		 if (rt.getJoin() != 0) {
			id=rt.getJoin();
        } else if (rt.getSplit()!= 0) {
			id=rt.getSplit();
        } else {
			id=rt.getStep();
        }
		_crt[id]=result;
		this.conditionalResults=_crt;
	}

	XAction.prototype.setFinish=function(finish){
		 this.finish = finish;
	}

	XAction.prototype.isFinish=function(){
		 return this.finish;
	}

	XAction.prototype.setName=function(name){
		 this.name = name;
	}

	XAction.prototype.getName=function(){
		 return this.name;
	}

	XAction.prototype.addPostFunctions=function(ft){
		var _ft=this.postFunctions;
		_ft[ft.getName()]=ft;
		this.postFunctions=_ft;
	}


	XAction.prototype.removePostFunctions=function(){
		this.postFunctions={};
	}

	XAction.prototype.getPostFunctions=function(){
		 return this.postFunctions;
	}


	XAction.prototype.addPreFunctions=function(ft){
		var _ft=this.preFunctions;
		_ft[ft.getName()]=ft;
		this.preFunctions=_ft;
	}

	XAction.prototype.getPreFunctions=function(){
		 return this.preFunctions;
	}

	XAction.prototype.removePreFunctions=function(){
		 this.preFunctions={};
	}

	XAction.prototype.setUnconditionalResult=function(unconditionalResult){
		 this.unconditionalResult = unconditionalResult;
	}

	XAction.prototype.getUnconditionalResult=function(){
		 return this.unconditionalResult;
	}

	XAction.prototype.removeUnconditionalResult=function(){
		this.unconditionalResult=null;
	}

	XAction.prototype.getResult=function(id){
		  var _rt=this.unconditionalResult;
		  var _crt=this.conditionalResults;
		  var returnResult=new Array;
		  if(_rt){
			  if(_rt.getId()==id){
					returnResult[0]='1';
					returnResult[1]=_rt;
			  }
		  }
		  if (!isEmty(_crt)) {
				for(var i in _crt){
					var tmpRt=_crt[i].getResult();
					  if(tmpRt.getId()==id){
							returnResult[0]='0';
							returnResult[1]=_crt;
					  }
				}
		  }
		  return returnResult;
	}

	XAction.prototype.setView=function(view){
		 this.view = view;
	}

	XAction.prototype.getView=function(){
		 return  this.view;
	}

	XAction.prototype.setRestriction=function(restriction){
		 this.restriction = restriction;
	}

	XAction.prototype.removeRestriction=function(restriction){
		 this.restriction = null;
	}

	XAction.prototype.getRestriction=function(){
		 return  this.restriction;
	}

	XAction.prototype.toString=function(){
		 var str=[];
		 if (this.name !=null) {
			 str.push(this.name);
        }
        if (this.view!=null) {
			str.push(' (',this.view,')');
        }
		return str.join('');
	}

	XAction.prototype.toXML=function(){
		var str=[];
		str.push('\n   <action id="',this.id,'"');
		if(this.name!=null){
			str.push(' name="',this.name,'"');
		}
		if(this.view!=null){
			str.push(' view="',this.view,'"');
		}
        if (this.finish) {
			str.push(' finish="true"');
        }
        if (this.autoExecute) {
			str.push(' auto="true"');
        }

		if (this.comment) {
			str.push(' comment="true"');
        }
		str.push('>');

		var _metas=this.metaAttributes;
		for(var i in _metas){
			str.push('\n 	 <meta name="');
			str.push(_metas[i].getName());
			str.push('">');     
			str.push(_metas[i].getValue());
			str.push('</meta>');
		}
		var rst=this.restriction;
        if (rst!= null) {
			 str.push(rst.toXML());
        }
		var pre=this.preFunctions;
        if (!isEmty(pre)) {
			str.push('\n  <pre-functions>');
			for(var i in pre){
                str.push(pre[i].toXML());
            }
			str.push('\n  </pre-functions>');
        }
		str.push('\n  <results>');
		var cdr=this.conditionalResults;
		if (!isEmty(cdr)) {	
			for(var i in cdr){
				str.push(cdr[i].toXML());
            }
        }
		var udr=this.unconditionalResult;
        if (udr != null) {
			str.push(udr.toXML());
        }
		str.push('\n  </results>');
		var pos=this.postFunctions;
        if (!isEmty(pos)) {
            str.push("\n  <post-functions>");
			for(var i in pos){
				str.push(pos[i].toXML());
            }
            str.push("\n  </post-functions>");
        }
        str.push("\n   </action>");
		return str.join('');

	}

	XAction.prototype.init=function(actionElements){

		var	id = actionElements.attributes.getNamedItem("id");
		if(id!=null)
			this.setId(id.value);

		var	name = actionElements.attributes.getNamedItem("name");
		if(name!=null)
			this.setName(name.value);

		var	view = actionElements.attributes.getNamedItem("view");
		if(view!=null)
			this.setView(view.value);

		var	comment = actionElements.attributes.getNamedItem("comment");
		if(comment!=null)
			this.setComment(comment.value);

		var	autoExecute = actionElements.attributes.getNamedItem("autoExecute");
		if(autoExecute!=null)
			this.setAutoExecute(autoExecute.value.toLowerCase());

		var	finish = actionElements.attributes.getNamedItem("finish");
		if(finish!=null)
			this.setFinish(finish.value.toLowerCase());

		var actionElement=actionElements.childNodes;

		for(var k=0;k<actionElement.length;k++){
			  var actElement=actionElement[k];
			  if(actElement.nodeName=='meta'){
			  		var	metaName = actElement.attributes.getNamedItem("name");
					var	metaValue =actElement.firstChild.data;
					var meta=new XMeta();
					meta.init(metaName.value,metaValue);
					this.addMetaAttributes(meta);				  
			  }

			  if(actElement.nodeName=='restrict-to'){
					var rst=new XRestriction();
					rst.init(actElement);
					this.setRestriction(rst);			  
			  }
			  if(actElement.nodeName=='pre-functions'){
					var preElement=actElement.childNodes;
					if (preElement != null) {
						for(var j=0;j<preElement.length;j++){
							var funtionElememt=preElement[j];
							if(funtionElememt.nodeName=='function'){				
								var ft=new XFunction();
								ft.init(funtionElememt);
								this.addPreFunctions(ft);
							}
						}
					}			  
			  }    
			  if(actElement.nodeName=='results'){
					var resultsElememts=actElement.childNodes;
					for(var j=0;j<resultsElememts.length;j++){
						var resultsElememt=resultsElememts[j];
						if(resultsElememt.nodeName=='result'){
							var rt=new XConditionResult();
							rt.init(resultsElememt);
							this.addConditionalResults(rt);
						}
						if(resultsElememt.nodeName=='unconditional-result'){
							var rt=new XResult();
							rt.init(resultsElememt);
							this.setUnconditionalResult(rt);
						}
					}		  
			  }

			  if(actElement.nodeName=='post-functions'){
					var postElement=actElement.childNodes;
					if (postElement != null) {
						for(var j=0;j<postElement.length;j++){
							var funtionElememt=postElement[j];
							if(funtionElememt.nodeName=='function'){				
								var ft=new XFunction();
								ft.init(funtionElememt);
								this.addPostFunctions(ft);
							}
						}
					}			  
			  }
		}
	}

//-------------------------------权限---------------------------------------------------------

	XPermission=function(){
		this.name;
		this.restriction;
	}
	XPermission.prototype.getName=function(){
        return this.name;
	}
	XPermission.prototype.setName=function(name) {
        this.name = name;
    }
	XPermission.prototype.getRestriction=function(){
        return this.restriction;
	}
	XPermission.prototype.setRestriction=function(restriction) {
        this.restriction = restriction;
    }
	XPermission.prototype.toXML=function(){
		var str=[];
		var _as=this.restriction;
			str.push('\n  <permission name="',this.name,'">');
			str.push(_as.toXML());
			str.push('\n  </permission>');
		return str.join('');
	}

	XPermission.prototype.init=function(permissionElement){		
		var	name = permissionElement.attributes.getNamedItem("name");		
		
		if(name!=null)
			this.setName(name.value);	

		var restrictionElement=permissionElement.childNodes;
		if (restrictionElement != null) {
			for(var j=0;j<restrictionElement.length;j++){
				var rstElement=restrictionElement[j];
				if(actElement.nodeName=='permission'){
					var rst=new XRestriction();
					rst.init(rstElement);
					this.setRestriction(rst);
				}
			}
		}			  
	}

//-------------------------------步骤----------------------------------------------------------

	XStep=function(id,name){
		this.id=id;
		this.name=name;
		this.actions={};
		this.permissions={};
		this.postFunctions={};
		this.preFunctions={};
		this.metaAttributes={};
		this.hasActions = false;
	}

	XStep.prototype.getId=function(){
        return this.id;
	}

	XStep.prototype.addPermissions=function(perm){
		var _perm=this.permissions;
		if(_perm[perm.getName()]){
			return _perm[perm.getName()];
		}
		_perm[perm.getName()]=perm;
		this.permissions=_perm;
	}

	XStep.prototype.getPermissions=function(){
		 return this.permissions;
	}

	XStep.prototype.removeMetaAttributes=function(){
		this.metaAttributes={};
	}

	XStep.prototype.addMetaAttributes=function(meta){
		var _meta=this.metaAttributes;
		_meta[meta.getName()]=meta;
		this.metaAttributes=_meta;
	}

	XStep.prototype.getMetaAttributes=function(){
			 return this.metaAttributes;
	}

	XStep.prototype.addAction=function(action){
		var _act=this.actions;
		if(_act[action.getId()]){
			return _act[action.getId()];
		}
		_act[action.getId()]=action;
		this.actions=_act;
	}
	
	XStep.prototype.getAction=function(id) {
		return this.actions[id];
    }

    XStep.prototype.removeAction=function(id) {
       delete this.actions[id];
    }
	XStep.prototype.getName=function(){
        return this.name;
	}

	XStep.prototype.setName=function(name) {
        this.name = name;
    }

	XStep.prototype.addPostFunctions=function(ft){
		var _ft=this.postFunctions;
		_ft[ft.getName()]=ft;
		this.postFunctions=_ft;
	}

	XStep.prototype.getPostFunctions=function(){
		 return this.postFunctions;
	}

	XStep.prototype.removePostFunctions=function(){
		 this.postFunctions={};
	}

	XStep.prototype.getPreFunctions=function() {
        return  this.preFunctions; 
    }

	XStep.prototype.removePreFunctions=function(){
		 this.preFunctions={};
	}

	XStep.prototype.addPreFunctions=function(ft){
		var _ft=this.preFunctions;
		_ft[ft.getName()]=ft;
		this.preFunctions=_ft;
	}

	XStep.prototype.getActions=function() {
        return  this.actions; 
    }

	XStep.prototype.removeResult=function(id){
		var _act=this.actions;		
        if (!isEmty(_act)) {
			for(var i in _act){
				  var _rt=_act[i].getUnconditionalResult();
				  var _crt=_act[i].getConditionalResults();
				  if(_rt){			
					  if(_rt.getId()==id){
							_act[i].removeUnconditionalResult()
					  }
				 }
				if (!isEmty(_crt)) {
						for(var j in _crt){
							var tmpRt=_crt[j].getResult();
							  if(tmpRt.getId()==id){
									_act[i].removeConditionalResult(id)
							  }
						}
				}
            }
			for(var i in _act){
				  var _rt=_act[i].getUnconditionalResult();
				  var _crt=_act[i].getConditionalResults();
				  if(!_rt&&isEmty(_crt)){
						this.removeAction(i);
				  }
            }
        }	
	}

	XStep.prototype.getResult=function(id){
		var _act=this.actions;		
		var returnResult=[];
        if (!isEmty(_act)) {
			for(var i in _act){
				var _rt=_act[i].getUnconditionalResult();
				var _crt=_act[i].getConditionalResults();
				if(_rt){
				  if(_rt.getId()==id){
						returnResult=['1',_rt,_act[i]];
				  }
				}
				if (!isEmty(_crt)){
					for(var j in _crt){
						var tmpRt=_crt[j].getResult();
						  if(tmpRt.getId()==id){
								returnResult=['0',_crt[j],_act[i]];
						  }
					}
				}
            }
        }	
		return returnResult;
	}

	XStep.prototype.toXML=function(){

		var str=[];
		str.push('\n  <step id="',this.id,'"');
		if(this.name!=null){
			str.push(' name="',this.name,'"');
		}
		str.push('>');
		var _metas=this.metaAttributes;
		for(var i in _metas){
			str.push('\n   <meta name="');
			str.push(_metas[i].getName());
			str.push('">');     
			str.push(_metas[i].getValue());
			str.push('</meta>');
		}

		var pre=this.preFunctions;
        if (!isEmty(pre)) {
			str.push('\n  <pre-functions>');
			for(var i in pre){
                str.push(pre[i].toXML());
            }
			str.push('\n  </pre-functions>');
        }		
		var perm=this.permissions;
        if (!isEmty(perm)) {
			str.push('\n  <external-permissions>');
			for(var i in perm){
                str.push(perm[i].toXML());
            }
			str.push('\n  </external-permissions>');
        }
		var _as=this.actions;
        if (!isEmty(_as)) {
			str.push('\n   <actions>');
			for(var i in _as){
                str.push(_as[i].toXML());
            }
			str.push('\n   </actions>');
        }
		var pos=this.postFunctions;
        if (!isEmty(pos)) {
            str.push("\n  <post-functions>");
			for(var i in pos){
				str.push(pos[i].toXML());
            }
            str.push("\n  </post-functions>");
        }
        str.push("\n </step>");
		return str.join('')
	}

	XStep.prototype.init=function(stepElements){

		var stepElement=stepElements.childNodes;
		for(var k=0;k<stepElement.length;k++){
			  var stpElement=stepElement[k];
			  if(stpElement.nodeName=='meta'){
			  		var	metaName = stpElement.attributes.getNamedItem("name");
					var	metaValue =stpElement.firstChild.data;
					var meta=new XMeta();
					meta.init(metaName.value,metaValue);
					this.addMetaAttributes(meta);				  
			  }

			  if(stpElement.nodeName=='pre-functions'){
					var preElement=stpElement.childNodes;
					if (preElement != null) {
						for(var j=0;j<preElement.length;j++){
							var funtionElememt=preElement[j];
							if(funtionElememt.nodeName=='function'){				
								var ft=new XFunction();
								ft.init(funtionElememt);
								this.addPreFunctions(ft);
							}
						}
					}			  
			  }

			  if(stpElement.nodeName=='external-permissions'){
					var permElement=stpElement.childNodes;					
					if (permElement != null) {
						for(var j=0;j<permElement.length;j++){
							var permissionElememt=permElement[j];
							var pm=new XPermission();
							pm.init(permissionElememt);
							this.addPermissions(pm);
						}
					}			  
			  }

			  if(stpElement.nodeName=='actions'){
					this.hasActions = true;
					var actElement=stpElement.childNodes;
					if (actElement != null) {
						for(var j=0;j<actElement.length;j++){
							var actionElement=actElement[j];
							if(actionElement.nodeName=='action'){				
								var at=new XAction();
								at.init(actionElement);
								this.addAction(at);
							}
						}
					}			  
			  }

			  if(stpElement.nodeName=='post-functions'){
					var postElement=stpElement.childNodes;
					if (postElement != null) {
						for(var j=0;j<postElement.length;j++){
							var funtionElememt=postElement[j];
							if(funtionElememt.nodeName=='function'){				
								var ft=new XFunction();
								ft.init(funtionElememt);
								this.addPostFunctions(ft);
							}
						}
					}			  
			  }
		}
	}
//-------------------------------聚合(Joins)-----------------------------------------------------

	XJoin=function(id){
		this.id=id;
		this.conditions;
		this.result;
	}

	XJoin.prototype.getId=function(){
        return this.id;
	}

	XJoin.prototype.getConditions=function(){
		return this.conditions;
	}

	XJoin.prototype.removeConditions=function(condition){
		this.conditions=null;
	}

	XJoin.prototype.setConditions=function(condition){
		this.conditions=condition;
	}

	XJoin.prototype.setResult=function(result){
		 this.result = result;
	}

    XJoin.prototype.removeResults=function() {
		this.result=null;
    }

	XJoin.prototype.getResult=function(){
		return this.result;
	}

	XJoin.prototype.toXML=function(){
		var str=[];
		var _as=this.conditions;
		var _rt=this.result;
		str.push('\n  <join id="',this.id,'">');

		for(var j=0;j<_as.length;j++){
			str.push(_as[j].toXML());
		}		
		if(_rt!=null)
        str.push(_rt.toXML());
		str.push('\n  </join>');
		return str.join('');
	}

	XJoin.prototype.init=function(joinElements){
		var allJoinElement=joinElements.childNodes;
		for(var j=0;j<allJoinElement.length;j++){
			var joinElement=allJoinElement[j];
			  if(joinElement.nodeName=='conditions'){				
					var cds=new XConditions();
					cds.init(joinElement);
					this.addConditions(cds);
			  }
			  if(joinElement.nodeName=='unconditional-result'){
						var rt=new XResult();
						rt.init(joinElement);
						this.setResult(rt);
			  }
		}	
	}
//-------------------------------分支(Splits)--------------------------------------------

	XSplit=function(id){
		this.id=id;
		this.results={};
	}

	XSplit.prototype.getId=function(){
        return this.id;
	}

	XSplit.prototype.getResults=function(){
		 return this.results;
	}

	XSplit.prototype.getResult=function(id){
	
		var returnResult;
		var _rt=this.results;
		if (!isEmty(_rt)) {
			for(var j in _rt){
				  if(_rt[j].getId()==id){
						returnResult=_rt[j];
				  }
			}
		}
		return returnResult;
	}

	XSplit.prototype.addResults=function(result){
		var _rt=this.results;
		_rt[result.getStep()]=result;
		this.results=_rt;
	}

    XSplit.prototype.removeResults=function(id) {
		delete this.results[id];
    }

	XSplit.prototype.toXML=function(){
		var str=[];
		var _as=this.results;
		str.push('\n  <split id="',this.id,'">');
		for(var i in _as){
			str.push(_as[i].toXML());
		}
		str.push('\n  </split>');
		return str.join('');
	}

	XSplit.prototype.init=function(splitElements){
		var allSplitElement=splitElements.childNodes;
		for(var j=0;j<allSplitElement.length;j++){
			var splitElement=allSplitElement[j];
			  if(splitElement.nodeName=='unconditional-result'){
						var rt=new XResult();
						rt.init(splitElement);
						this.addResults(rt);
			  }
		}
	}

//---------------------------------------工作流(WorkFlow)---------------------------------------------------
    XWorkflow=function(name){
		this.workflowName = name;
		this.registers={};
		this.initialActions={};
		this.actions={};
		this.steps={};
		this.splits={};
		this.joins={};
	}
	
    XWorkflow.prototype.getRegisters=function(id) {
        return this.registers;
    }

//待实现
    XWorkflow.prototype.getAction=function(id) {
        return null;
    }

    XWorkflow.prototype.getInitialAction=function(id) {
        return this.initialActions[id];
    }

    XWorkflow.prototype.getInitialActions=function() {
        return this.initialActions;
    }

    XWorkflow.prototype.removeInitialAction=function(id) {
		delete this.initialActions[id];
    }

    XWorkflow.prototype.getJoin=function(id) {
		var _joins=this.joins;
		if(_joins[id]){
			return _joins[id];
		}else{
	        return null;	
		}
    }

    XWorkflow.prototype.getJoins=function() {
        return this.joins;
    }

    XWorkflow.prototype.setName=function(name) {
        this.workflowName = name;
    }

    XWorkflow.prototype.getName=function() {
        return this.workflowName;
    }

    XWorkflow.prototype.getRegisters=function() {
        return this.registers;
    }

    XWorkflow.prototype.getSplit=function(id) {
			var _splits=this.splits;
			if(_splits[id]){
				return _splits[id];
			}else{
						return null;	
			}
    }

    XWorkflow.prototype.removeSplit=function(id) {
			delete this.splits[id];
    }

    XWorkflow.prototype.getSplits=function() {
        return this.splits;
    }

    XWorkflow.prototype.getStep=function(id) {
			var _steps=	this.steps;
			if(_steps[id]){
				return _steps[id];
			}else{
						return null;	
			}
    }

    XWorkflow.prototype.getSteps=function() {
        return this.steps;
    }

    XWorkflow.prototype.addRegisters=function(register) {
			var _registers=	this.registers;
			if(_registers[register.getVariableName()]){
				return _registers[register.getVariableName()];
			}
			_registers[register.getVariableName()]=register;
			this.registers=_registers;
    }

    XWorkflow.prototype.addInitialAction=function(action) {
       	var _initialActions=this.initialActions;
		if(_initialActions[action.getId()]){
			return _initialActions[action.getId()];
		}
		_initialActions[action.getId()]=action;
		this.initialActions=_initialActions;
    }

    XWorkflow.prototype.addJoin=function(join) {
  		var _joins=this.joins;
		if(_joins[join.getId()]){
			return _joins[join.getId()];
		}
		_joins[join.getId()]=join;
		this.joins=_joins;
    }

    XWorkflow.prototype.removeJoin=function(id) {
		delete this.joins[id];
    }

    XWorkflow.prototype.addSplit=function(split) {
		var _splits=this.splits;
		if(_splits[split.getId()]){
			return _splits[split.getId()];
		}
		_splits[split.getId()]=split;
		this.splits=_splits;
    }

    XWorkflow.prototype.addStep=function(step) {
		var _steps=	this.steps;
		if(_steps[step.getId()]){
			return _steps[step.getId()];
		}
		_steps[step.getId()]=step;
		this.steps=_steps;
    }

    XWorkflow.prototype.removeStep=function(id) {
		delete this.steps[id];
    }

//待实现
    XWorkflow.prototype.removeAction=function() {
        return false;
    }

    XWorkflow.prototype.toXML=function() {
		var str=[];
		str.push('\n<flowmodal>');
		var _registers=this.registers;
		if(!isEmty(_registers)){
				str.push('\n <registers>');
				for(var i in _registers){
					str.push('  ');
					str.push(_registers[i].toXML());
				}
			str.push('\n</registers>');
		}
		str.push('\n<initial-actions>');
		var _initialActions=this.initialActions;
		for(var i in _initialActions){
			str.push('  ');
			str.push(_initialActions[i].toXML());
		}
		str.push('\n</initial-actions>');
		str.push('\n <steps>');
		var _steps=	this.steps;
		for(var i in _steps){
			str.push('  ');
			str.push(_steps[i].toXML());
		}
		str.push('\n </steps>');
		var _splits=this.splits;
		if(!isEmty(_splits)){
			str.push('\n <splits>');
				for(var i in _splits){
					str.push('  ');
					str.push(_splits[i].toXML());
				}
			str.push('\n </splits>');
		}
		var _joins=this.joins;
		if(!isEmty(_joins)){
			str.push('\n <joins>');
				for(var i in _joins){
					str.push('  ');
					str.push(_joins[i].toXML());
				}
			str.push('\n </joins>');
		}  
		str.push('\n</flowmodal>');
		return str.join('');
    }

    XWorkflow.prototype.removeAll=function() {
			for(var i in this.registers){
					delete this.registers[i];
			}
			for(var i in this.initialActions){
					delete this.initialActions[i];
			}
			for(var i in this.steps){
					delete this.steps[i];
			}
			for(var i in this.splits){
					delete this.splits[i];
			}
			for(var i in this.joins){
					delete this.joins[i];
			}
    }

    XWorkflow.prototype.init=function(flowElements) {
			for(var k=0;k<flowElements.length;k++){
				  var flowElement=flowElements[k];
				  if(flowElement.nodeName=='registers'){
				  		var registerElements=flowElement.childNodes;
						for(var j=0;j<registerElements.length;j++){
							var registerElement = registerElements[j];
							var register = new XRegister();
							register.init(registerElement);
							this.addRegisters(register);
						}					  
				  }
				  if(flowElement.nodeName=='initial-actions'){
				  		var initialActionsElements=flowElement.childNodes;
						for(var j=0;j<initialActionsElements.length;j++){
							var actionElement = initialActionsElements[j];
							if(actionElement.nodeName=='action'){
								var actionId = actionElement.attributes.getNamedItem("id");
								var action = new XAction(actionId.value);
								action.init(actionElement);
								this.addInitialAction(action);
							}
						}		 
				  }
				  if(flowElement.nodeName=='steps'){
				  		var stepElements=flowElement.childNodes;
						for(var j=0;j<stepElements.length;j++){
							var stepElement = stepElements[j];
							if(stepElement.nodeName=='step'){
								var stepId = stepElement.attributes.getNamedItem("id");
								var stepName =stepElement.attributes.getNamedItem("name");	
								var step = new XStep(stepId.value,stepName.value);
								step.init(stepElement);
								this.addStep(step);
							}
						}
				  }
				  if(flowElement.nodeName=='splits'){
				  		var splitElements=flowElement.childNodes;
						for(var j=0;j<splitElements.length;j++){
							var splitElement = splitElements[j];
							if(splitElement.nodeName=='split'){
								var splitId = splitElement.attributes.getNamedItem("id");
								var split = new XSplit(splitId.value);
								split.init(splitElement);
								this.addSplit(split);			
							}
						}	
				  }
				  if(flowElement.nodeName=='joins'){
				  		var joinElements=flowElement.childNodes;
						for(var j=0;j<joinElements.length;j++){
							var joinElement = joinElements[j];
							if(joinElement.nodeName=='join'){
								var joinId = joinElement.attributes.getNamedItem("id");
								var join = new XJoin(joinId.value);
								join.init(joinElement);
								this.addJoin(join);	
							}
						}				  
				  }
			}
    }

//------------------------------------------公共函数----------------------------------------------------
	function isEmty(s){
		for(var i in s)
			return false;
		return true;
	}
	String.prototype.LTrim  =  function(){  
		return  this.replace(/(^\s*)/g,  "");  
	}   
	String.prototype.RTrim  =  function(){  
		return  this.replace(/(\s*$)/g,  "");  
	}  


//-----------------------------------工作流定义文件操作--------------------------------------------
