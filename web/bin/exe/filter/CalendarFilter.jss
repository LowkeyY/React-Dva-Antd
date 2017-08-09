
using('lib.Calendar.Calendar');
Ext.grid.filter.CalendarFilter = Ext.extend(Ext.grid.filter.Filter, {
	updateBuffer: 500,
	init: function() {
		var updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
		this.editor.comboConfig={
			listClass:'x-menu x-menu-combo-list',
			listeners:{
				select:function(){
					updateTask.delay(1000);
				},
				expand:function(){
					updateTask.cancel();
				}
			}
		};
		var editor=Ext.ComponentMgr.create(this.editor,{xtype:'textfield'});
		var value = this.value = new Ext.menu.EditableItem({
			editor:editor
		});
		value.on('keyup', this.onKeyUp, this);
		this.menu.add(value);
	},
	
	onKeyUp: function(event) {
		if(event.getKey() == event.ENTER){
			this.menu.hide(true);
			return;
		}
	},
	
	isActivatable: function() {
		return this.value.getValue().length > 0;
	},
	
	fireUpdate: function() {		
		if(this.active) {
			this.fireEvent("update", this);
		}
		this.setActive(this.isActivatable());
	},
	
	setValue: function(value) {
		this.value.setValue(value);
		this.fireEvent("update", this);
	},
	
	getValue: function() {
		return this.value.getValue();
	},
	
	serialize: function() {
		var args = {type: 'string', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record) {
		var val = record.get(this.dataIndex);
		if(typeof val != "string") {
			return this.getValue().length == 0;
		 }
		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});
