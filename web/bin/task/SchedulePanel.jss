Ext.namespace('bin.task');

bin.task.SchedulePanel = function(frames){

	this.frames = frames;
	Task = this.frames.get("Task");
	this.retFn=function(main){
		main.setActiveTab("SchedulePanel");
		main.setStatusValue(['任务执行'.loc()]);
	}.createCallback(Task.mainPanel);
	
	this.ButtonArray=[];

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				state:'create',  
				handler :this.onButtonClick
	}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'updatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Separator());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'param',
				text: '参数设置'.loc(),
				icon: '/themes/icon/xp/properties.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Separator());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'run',
				text : '测试执行'.loc(),
				icon : '/themes/icon/all/lightning.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'restart',
				text: '重启任务服务'.loc(),
				icon: '/themes/icon/database/run_exc.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));

	this.params={};

	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url:"/bin/task/schedule.jcp?",
			method:'GET'
		}),
        reader: new Ext.data.JsonReader({}, [
			{name: 'taskType', mapping: 'taskType'},
			{name: 'schduleName', mapping: 'schduleName'},
			{name: 'monthCheckArr', mapping: 'monthCheckArr'},
			{name: 'weekCheckArr', mapping: 'weekCheckArr'},
			{name: 'dateCheckArr', mapping: 'dateCheckArr'},
			{name: 'dateType', mapping: 'dateType'},
			{name: 'dateTypeArr', mapping: 'dateTypeArr'},
			{name: 'hourArr', mapping: 'hourArr'},
			{name: 'createdate', mapping: 'createdate'},
			{name: 'creater', mapping: 'creater'}
        ]),
        remoteSort: false
    });
	this.titleForm = new Ext.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
        border:false,
		
		frame:false,
		shadow:false,
        collapsible:false,
		region:'north',
		layout:'fit',
        bodyStyle:'padding:20px 0px 0px 0px;height:50px;width:100%;background:#FFFFFF;',
       items: [
	   {
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '执行名称'.loc(),
							name: 'schedule_name',
							width: 280,
							maxLength : 64,
							allowBlank:false,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '执行名称中不应有'.loc()+'&,<,>,\',\",'+'字符'.loc(),
							maxLengthText : '执行名称不能超过{0}个字符!'.loc(),
							blankText:'执行名称必须提供.'.loc()
						})
					 ]}
			]
		}
	]});


	var scheduleArray=[];
	scheduleArray.push('<FORM name="_FORM_UNPOST_TASKDATE__">');
	scheduleArray.push('<fieldset style="padding: 2"><legend>'+'选择月份'.loc()+'</legend><input type="checkbox" name="month" value="0" > '+'一月'.loc()+' <input type="checkbox" name="month" value="1" > '+'二月'.loc()+'<input type="checkbox" name="month" value="2" > '+'三月'.loc()+'<input type="checkbox" name="month" value="3"> '+'四月'.loc()+'<input type="checkbox" name="month" value="4" > '+'五月'.loc()+'<input type="checkbox" name="month" value="5" > '+'六月'.loc()+'<br><input type="checkbox" name="month" value="6" > '+'七月'.loc()+'<input type="checkbox" name="month" value="7" > '+'八月'.loc()+'<input type="checkbox" name="month" value="8" > '+'九月'.loc()+'<input type="checkbox" name="month" value="9" > '+'十月'.loc()+'<input type="checkbox" name="month" value="10" > '+'十一月'.loc()+'<input type="checkbox" name="month" value="11" > '+'十二月'.loc()+'</fieldset>');


	scheduleArray.push('<fieldset style="padding: 2"><legend><input type="radio" value="V1"  name="R1" checked=true onclick="c_dates.style.display=\'\';c_week.style.display=\'none\'">'+'日期'.loc()+' <input type="radio" value="V1" name="R1" onclick="c_dates.style.display=\'none\';c_week.style.display=\'\'">'+'星期'.loc()+' </legend><div id="c_dates">');

	for(var i=1;i<=31;i++){
		scheduleArray.push('<input type=checkbox name="days" value=\"');
		scheduleArray.push(i);
		scheduleArray.push('\">');
		scheduleArray.push(i);
		scheduleArray.push('日'.loc());
		if(i%10==0)
			scheduleArray.push('<br>');
	}
	scheduleArray.push('<input type="checkbox" name="days" value="-1" >'+'最后一天'.loc()+'<input type="checkbox" name="days" value="-2" >'+'倒数第二天'.loc()+'<input type="checkbox" name="days" value="-3" >'+'倒数第三天'.loc()+'</div>');
			     
	scheduleArray.push('<div id="c_week" style="display:none">'+'星期'.loc()+' <select size="6" name="D1" multiple> <option value="1" >'+'第一个'.loc()+'  </option> <option value="2" >'+'第二个'.loc()+'</option> <option value="3" >'+'第三个'.loc()+'</option> <option value="4" >'+'第四个'.loc()+'</option> <option value="-1" >'+'最后一个'.loc()+'</option> </select> <select size="6" name="D2" multiple> <option value="1" >'+'星期一'.loc()+'</option> <option value="2" >'+'星期二'.loc()+'</option> <option value="3" >'+'星期三'.loc()+'</option> <option value="4" >'+'星期四'.loc()+'</option> <option value="5" >'+'星期五'.loc()+'</option> <option value="6" >'+'星期六'.loc()+'</option> <option value="7" >'+'星期日'.loc()+'</option> </select></div></fieldset>');	

	scheduleArray.push('<fieldset style="padding: 2"> <legend>'+'选择时间'.loc()+' </legend> <select style="width:70px" size="4" name="D1" multiple></select><button href="#" onclick="javascript:return delSchedule();">'+'删除'.loc()+'</button><br> <select size="1" name="D2"> <option value="24">0</option> <option value="01">1</option> <option value="02">2</option> <option value="03">3</option> <option value="04">4</option> <option value="05">5</option> <option value="06">6</option> <option value="07">7</option> <option value="08">8</option> <option value="09">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> <option value="13">13</option> <option value="14">14</option> <option value="15">15</option> <option value="16">16</option> <option value="17">17</option> <option value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> </select> 点 <select size="1" name="D3"> <option value="00">0</option> <option value="01">1</option> <option value="02">2</option> <option value="03">3</option> <option value="04">4</option> <option value="05">5</option> <option value="06">6</option> <option value="07">7</option> <option value="08">8</option> <option value="09">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> <option value="13">13</option> <option value="14">14</option> <option value="15">15</option> <option value="16">16</option> <option value="17">17</option> <option value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option> <option value="32">32</option> <option value="33">33</option> <option value="34">34</option> <option value="35">35</option> <option value="36">36</option> <option value="37">37</option> <option value="38">38</option> <option value="39">39</option> <option value="40">40</option> <option value="41">41</option> <option value="42">42</option> <option value="43">43</option> <option value="44">44</option> <option value="45">45</option> <option value="46">46</option> <option value="47">47</option> <option value="48">48</option> <option value="49">49</option> <option value="50">50</option> <option value="51">51</option> <option value="52">52</option> <option value="53">53</option> <option value="54">54</option> <option value="55">55</option> <option value="56">56</option> <option value="57">57</option> <option value="58">58</option> <option value="59">59</option> </select>分 <button href="#" onclick="javascript:return instSchedule();">添加</button> </fieldset>');	
	scheduleArray.push('</fieldset></FORM>');	           
                        
	var scheduleString=scheduleArray.join('');

	this.scheduleDefinePanel = new Ext.Panel({
        frame:false,
        collapsible:false,
		layout:'fit',
		region:'center',
		border:false,
		bodyStyle:'padding:0px 30px 0px 30px;height:100%;width:100%;background:#FFFFFF;',
		html:scheduleString
    });
    this.MainTabPanel = new Ext.Panel({
        layout:'border',
		border:false,
		split:false,
		id:'SchedulePanel',
		cached:true,
        frame:false,
        collapsible:false,
		items:[this.titleForm,this.scheduleDefinePanel],
		tbar:this.ButtonArray
    });
};

bin.task.SchedulePanel.prototype={
	formCreate : function(params){	
		this.frames.get("Task").mainPanel.setStatusValue(['任务执行'.loc()]);
		if(params){
			this.frames.get("Task").mainPanel.setStatusValue(['任务执行'.loc(),params.parent_id,'无'.loc(),'无'.loc()]);
			this.toggleToolBar('create');
			this.params=params;
			var _FORM_UNPOST_TASKDATE__=document.getElementsByName("_FORM_UNPOST_TASKDATE__")[0];
			_FORM_UNPOST_TASKDATE__.reset();
			removeAllTime();
		}else{
			this.hideToolBar();
		}  
		this.titleForm.form.reset();
    },
	formEdit : function(){
		this.toggleToolBar('edit');
    },
	hideToolBar : function(){	
		var  tempToolBar=this.MainTabPanel.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.disable();
		},tempToolBar.items);
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.MainTabPanel.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		},tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },	
	loadTask : function(params){		
		this.params=params;
		var frm=this.titleForm.form;
		this.ds.baseParams = params;
		this.ds.load();
		this.ds.on('load',function(){
				var taskType=this.ds.getAt(0).data.taskType;
				var schduleName=this.ds.getAt(0).data.schduleName;
				var creater=this.ds.getAt(0).data.creater;
				var createdate=this.ds.getAt(0).data.createdate;

				var monthCheckArr=Ext.util.JSON.decode(this.ds.getAt(0).data.monthCheckArr);
				var weekCheckArr=Ext.util.JSON.decode(this.ds.getAt(0).data.weekCheckArr);
				var dateTypeArr=Ext.util.JSON.decode(this.ds.getAt(0).data.dateTypeArr);
				var dateCheckArr=Ext.util.JSON.decode(this.ds.getAt(0).data.dateCheckArr);
				var dateTypeArr=Ext.util.JSON.decode(this.ds.getAt(0).data.dateTypeArr);
				var hourArr=Ext.util.JSON.decode(this.ds.getAt(0).data.hourArr);

				var _FORM_UNPOST_TASKDATE__=document.getElementsByName("_FORM_UNPOST_TASKDATE__")[0];
				_FORM_UNPOST_TASKDATE__.reset();
				removeAllTime();

				var month =Ext.DomQuery.select('input[name=month]',_FORM_UNPOST_TASKDATE__.childNodes[0]);  
				for(var i=0;i<month.length;i++){
					if(monthCheckArr[i]=='checked') month[i].checked=true;
				}
				DayTypeSelect(this.ds.getAt(0).data.dateType);
				if(this.ds.getAt(0).data.dateType=='date'){
					var day =Ext.DomQuery.select('input[name=days]',_FORM_UNPOST_TASKDATE__.childNodes[1]);  
					for(var i=0;i<day.length;i++){
						if(dateCheckArr[i]=='checked') day[i].checked=true;
					}		
					var R1=Ext.DomQuery.select('input[name=R1]',_FORM_UNPOST_TASKDATE__.childNodes[1]);
					R1[0].checked=true;
				}else{
					var R1=Ext.DomQuery.select('input[name=R1]',_FORM_UNPOST_TASKDATE__.childNodes[1]);
					R1[1].checked=true;
					var week =Ext.DomQuery.selectNode('select[name=D1]',_FORM_UNPOST_TASKDATE__.childNodes[1]);   
					var day =Ext.DomQuery.selectNode('select[name=D2]',_FORM_UNPOST_TASKDATE__.childNodes[1]);  
					for(var i=0;i<week.length;i++){
						if(weekCheckArr[i]=='selected') week[i].selected=true;
					}
					for(var i=0;i<day.length;i++){
						if(dateCheckArr[i]=='selected') day[i].selected=true;
					}
				}
				frm.findField('schedule_name').setValue(schduleName);
				addHour(hourArr);
				this.frames.get("Task").mainPanel.setStatusValue(['任务执行'.loc(),params.schedule_id,creater,createdate]);       
		}, this);
    },     
	getTaskDateValue:function(){
			var months = [];
			var weeks = [];
			var days = [];
			var times = [];

			var _FORM_UNPOST_TASKDATE__=document.getElementsByName("_FORM_UNPOST_TASKDATE__")[0];
			var month =Ext.DomQuery.select('input[name=month]',_FORM_UNPOST_TASKDATE__.childNodes[0]);  
			for(var i=0;i<month.length;i++){
				if(month[i].checked)
					months.push(month[i].value);
			}
			var isDate=false;
			var R1=Ext.DomQuery.select('input[name=R1]',_FORM_UNPOST_TASKDATE__.childNodes[1])[0];
			if(R1.checked){
				var day =Ext.DomQuery.select('input[name=days]',_FORM_UNPOST_TASKDATE__.childNodes[1]);  
				for(var i=0;i<day.length;i++){
					if(day[i].checked)
						days.push(day[i].value);
				}
			}else{
				isDate=true;
				var week =Ext.DomQuery.selectNode('select[name=D1]',_FORM_UNPOST_TASKDATE__.childNodes[1]).childNodes;   
				var day =Ext.DomQuery.selectNode('select[name=D2]',_FORM_UNPOST_TASKDATE__.childNodes[1]).childNodes;   
				for(var i=0;i<week.length;i++){
					if(week[i].selected)
						weeks.push(week[i].value);
				}
				for(var i=0;i<day.length;i++){
					if(day[i].selected)
						days.push(day[i].value);
				}
			}
			var time =Ext.DomQuery.selectNode('select[name=D1]',_FORM_UNPOST_TASKDATE__.childNodes[2]).childNodes;   
			for(var i=0;i<time.length;i++){
				times.push(Number(time[i]._hh+"")*60+Number(time[i]._mm+""));
			}
			var tasks = ['<tasktime><mon>'];

			for(var i=0;i<months.length;i++)
				tasks.push('<element value="'+months[i]+'" />');
			tasks.push('</mon><week>');
			for(var i=0;i<weeks.length;i++)
				tasks.push('<element value="'+weeks[i]+'" />');
			tasks.push('</week><day>');
			for(var i=0;i<days.length;i++)
				tasks.push('<element value="'+days[i]+'" />');
			tasks.push('</day><time>');
			for(var i=0;i<times.length;i++)
				tasks.push('<element value="'+times[i]+'" />');
			tasks.push('</time></tasktime>');
			if(months.length==0||days.length==0||(isDate==true&&weeks.length==0)||times.length==0){
				Ext.msg("error",'必须定义完整执行时间!'.loc());
				return false;
			}
			return tasks.join('');
	},
	onButtonClick : function(item){
		Task = this.frames.get("Task");
		if(item.btnId=='save'){
			var frm=this.titleForm.form;
			var saveParams=this.params;
			saveParams['type']='save';
		    if (frm.isValid()) {
				saveParams['schedule_name']=frm.findField('schedule_name').getValue();
				saveParams['content'] = this.getTaskDateValue();
				if(this.getTaskDateValue()){
					Ext.Ajax.request({ 
						url:'/bin/task/schedule.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check)
							if(ajaxResult.success){
								Ext.msg("info",'保存成功'.loc());  
								Task.navPanel.getTree().loadSubNode(ajaxResult.schedule_id,Task.navPanel.clickEvent);
							}else{
								Ext.msg("error",'数据保存失败!,原因:'.loc()+'<br>'+ajaxResult.message);
							}
						}
					}); 
				}
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams=this.params;
						delParams['type']='delete';
						Ext.Ajax.request({ 
							url:'/bin/task/schedule.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(response, options){ 
								var check = response.responseText;
								var ajaxResult=Ext.util.JSON.decode(check)
								if(ajaxResult.success){
									Task.navPanel.getTree().loadParentNode(Task.navPanel.clickEvent);
								}else{
									Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
								}
							}
						}); 
				  } 
               }.createDelegate(this));
		}else if(item.btnId=='updatesave'){
			var frm=this.titleForm.form;
			var saveParams=this.params;
			saveParams['type']='updatesave';
			if (frm.isValid()) {
				saveParams['schedule_name']=frm.findField('schedule_name').getValue();
				saveParams['content'] = this.getTaskDateValue();
				if(this.getTaskDateValue()){
					Ext.Ajax.request({ 
						url:'/bin/task/schedule.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check)
							if(ajaxResult.success){
								Ext.msg("info",'更新成功'.loc());
								Task.navPanel.getTree().loadSelfNode(ajaxResult.schedule_id,Task.navPanel.clickEvent);
							}else{
								Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
							}
						}
					}); 
				}
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='param'){
			using("bin.task.TaskParamsPanel");
			var Task=this.frames.get("Task");
			Task.paramPanel = new bin.task.TaskParamsPanel(this.frames,this.retFn);
			Task.mainPanel.add(Task.paramPanel.paramGrid);
			Task.mainPanel.setActiveTab(Task.paramPanel.paramGrid);
			Task.paramPanel.init(this.params);
		}else if(item.btnId=='restart'){
			var restartParams=this.params;
			restartParams['type']='restart';
			Ext.Ajax.request({ 
				url:'/bin/task/schedule.jcp',
				params:restartParams,
				method: 'post',  
				scope:this,
				success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check)
					if(ajaxResult.success){
						Ext.msg("info",'任务重启成功'.loc());
					}else{
						Ext.msg("error",'任务重启动失败失败!,原因:'.loc()+'<br>'+ajaxResult.message);
					}
				}
			}); 
		}else if (item.btnId == 'run') {
			var runParams = this.params;
			runParams['type'] = 'run';
			runParams['parent_id'] = this.params.parent_id;
			Ext.Ajax.request({
					url:'/bin/task/schedule.jcp',
					params : runParams,
					method : 'POST',
					scope : this,
					success : function(form, action) {
						Ext.msg("info", '执行成功!'.loc());	
					},
					failure : function(form, action) {
						Ext.msg("error", '任务重启动失败失败!,原因:'.loc()+'<br>'+ action.result.message);
					}
			});
		}
    }
};