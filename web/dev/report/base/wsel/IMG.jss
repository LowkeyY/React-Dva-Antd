
Ext.namespace("dev.report.base.wsel");
using("dev.report.base.wsel.Picture");
dev.report.base.wsel.IMG =  function() {
	this.moveTo = function(imgId, pos, offsets) {
		var img = dev.report.base.wsel.wselRegistry.get(dev.report.base.app.activeBook,
				dev.report.base.app.activeSheet._uid, imgId), tlOffsetXY = img._sheet._aPane
				.getPixelsByCoords(pos[0], pos[1]), newX = tlOffsetXY[0]
				+ offsets[0], newY = tlOffsetXY[1] + offsets[1];
		for (var i = img.wrapper.length - 1, wrpEl; i >= 0; i--) {
			(img.isUserMode ? img.wrapper[i].getEl() : img.wrapperEl[i])
					.setLeftTop("".concat(newX, "px"), "".concat(newY, "px"))
		}
	};
	this.showAlert = function(title, msg) {
		Ext.Msg.alert(title.localize(), msg.localize())
	};
	this.loadAll = function(sheet) {
		function _load(res) {
			if (!(res instanceof Array) || res[0] !== true) {
				return
			}
			res = res[1];
			sheet.setInitReg("img", res.length);
			var jwwsel = dev.report.base.wsel, activePane = sheet._aPane;
			for (var imgData, i = res.length - 1, rng, tlXY; i >= 0; --i) {
				imgData = res[i];
				rng = jwwsel.getRngFromNLoc(imgData.n_location);
				tlXY = activePane.getPixelsByCoords(rng[0], rng[1]);
				this.createImg([sheet, sheet.updInitReg, "img"], imgData.e_id,
						tlXY[1] + imgData.pos_offsets[1], tlXY[0]
								+ imgData.pos_offsets[0], imgData.size[0],
						imgData.size[1], false, imgData.zindex, imgData.locked);
			}
		}
		var table=dev.report.model.report.tabMap;
		var imgs=table.getPictureObject();
		var res=[];
		res.push(true);
		var res1=[];
		for(var i in imgs){
			var img=imgs[i]
			var hbdata = {
				e_id : img.id,
				n_location : img.location,
				pos_offsets : img.offset,
				zindex : img.zindex,
				size : img.size,
				locked : img.locked
			};
			res1.push(hbdata);
		}
		res.push(res1);
		_load.call(this,res);
	};
	this.remove = function(imgId) {
		var img = dev.report.base.wsel.wselRegistry.get(dev.report.base.app.activeBook,
				dev.report.base.app.activeSheet._uid, imgId);
		if (img) {
			img.remove(true)
		}
	};
	this.createImg = function(cb, imgId, elTop, elLeft, elWidth, elHeight,
			setLoc, zindex, locked, hldata, name) {
		
		dev.report.base.wsel.wselRegistry.add(new dev.report.base.wsel.Picture(cb, imgId,
				elTop, elLeft, elWidth, elHeight, setLoc, zindex, locked))
	}
};