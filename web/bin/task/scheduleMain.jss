function delSchedule(){
	var _FORM_UNPOST_TASKDATE__=document.getElementsByName("_FORM_UNPOST_TASKDATE__")[0];
	var time = Ext.DomQuery.selectNode('select[name=D1]',_FORM_UNPOST_TASKDATE__.childNodes[2]);
	var opts = time.childNodes;
	for(var i=0;i<opts.length;i++){
		if(opts[i].selected){
			time.removeChild(opts[i]);
			i--;      
		}     
	} 
	return false;
}  
function removeAllTime(){
	var _FORM_UNPOST_TASKDATE__=document.getElementsByName("_FORM_UNPOST_TASKDATE__")[0];
	var time =  Ext.DomQuery.selectNode('select[name=D1]',_FORM_UNPOST_TASKDATE__.childNodes[2]);
	var opts = time.childNodes;
	for(var i=0;i<opts.length;i++){
			time.removeChild(opts[i]);
			i--;    
	}
}
function instSchedule(){
			var _FORM_UNPOST_TASKDATE__=document.getElementsByName("_FORM_UNPOST_TASKDATE__")[0];
			var hour = Ext.DomQuery.selectNode('select[name=D2]',_FORM_UNPOST_TASKDATE__.childNodes[2]);
			var minute = Ext.DomQuery.selectNode('select[name=D3]',_FORM_UNPOST_TASKDATE__.childNodes[2]);
			var times = Ext.DomQuery.selectNode('select[name=D1]',_FORM_UNPOST_TASKDATE__.childNodes[2]);
			var time = hour.value+':'+minute.value;
			for(var i=0;i<times.childNodes.length;i++){
				if(times.childNodes[i].value == time)
					return ;
			}
			var opt = document.createElement("option");
			opt.value = opt.text = time;
			opt._hh = hour.value;
			opt._mm = minute.value; 
			opt.innerHTML=time;
			times.appendChild(opt);
			return false;
}
function addHour(hourArr){
	
	 for (var j=0;j<hourArr.length;j++){
		var hour = Math.floor(hourArr[j]/60);
		var minute =hourArr[j]%60;
		var _FORM_UNPOST_TASKDATE__=document.getElementsByName("_FORM_UNPOST_TASKDATE__")[0];
		var times =Ext.DomQuery.selectNode('select[name=D1]',_FORM_UNPOST_TASKDATE__.childNodes[2]);
		var time = hour+':'+minute;
		for(var i=0;i<times.childNodes.length;i++){
			if(times.childNodes[i].value == time)
				return ;
		}						 
		var opt = document.createElement("option");
		opt.value = opt.text = time;
		opt._hh = hour;
		opt._mm = minute;
		opt.innerHTML=time;
		times.appendChild(opt);	 
	 }
}
function DayTypeSelect(val){
	var c_dates=document.getElementById("c_dates");
	var c_week=document.getElementById("c_week");
	if(val=='day'){
		c_dates.style.display='';
		c_week.style.display='block';
	}else{
		c_dates.style.display='';
		c_week.style.display='none';
	}
}