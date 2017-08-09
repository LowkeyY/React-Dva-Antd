
Ext.namespace("dev.report.base");
dev.report.base.Style =  function() {
	var that = this, _conn = dev.report.backend, _re_textAlign = /text-align: *(left|right|center);/i;
	this.mapJStoCSS = {
		fontWeight : "style-weight",
		fontStyle : "style-style",
		textDecoration : "text-decoration",
		textAlign : "text-align",
		textIndent : "text-indent",
		fontSize : "style-size",
		fontFamily : "style-family",
		background : "background",
		backgroundColor : "background-color",
		backgroundImage : "background-image",
		color : "color",
		border : "border",
		borderTop : "border-top",
		borderLeft : "border-left",
		borderRight : "border-right",
		borderBottom : "border-bottom",
		whiteSpace : "white-space",
		verticalAlign : "vertical-align",
		direction : "direction"
	};
	this.mapCSStoJS = {
		"style-weight" : "fontWeight",
		"style-style" : "fontStyle",
		"text-decoration" : "textDecoration",
		"text-align" : "textAlign",
		"text-indent" : "textIndent",
		"style-size" : "fontSize",
		"style-family" : "fontFamily",
		background : "background",
		"background-color" : "backgroundColor",
		"background-image" : "backgroundImage",
		color : "color",
		border : "border",
		"border-top" : "borderTop",
		"border-left" : "borderLeft",
		"border-right" : "borderRight",
		"border-bottom" : "borderBottom",
		"white-space" : "whiteSpace",
		"vertical-align" : "verticalAlign",
		direction : "direction"
	};
	this.fonts = [['宋体', '宋体'],
			['黑体', '黑体'],
			['隶书', '隶书'],
			['楷体', '楷体'],
			["Arial", "Arial,sans-serif"],
			["Arial Black", "Arial Black,sans-serif"],
			["Comic Sans MS", "Comic Sans MS,cursive"],
			["Courier New", "Courier New,monospace"],
			["Garamond", "Garamond,serif"], ["Georgia", "Georgia,serif"],
			["Lucida Console", "Lucida Console,monospace"],
			["Lucida Sans", "Lucida Sans,monospace"],
			["Palantino Linotype", "Palantino Linotype,serif"],
			["Tahoma", "Tahoma,sans-serif"],
			["Times New Roman", "Times New Roman,serif"],
			["Trebuchet MS", "Trebuchet MS,sans-serif"],
			["Verdana", "Verdana,sans-serif"]];
	this.fontCSSMap = {
		"宋体" : 0,
		"黑体" : 1,
		"隶书" : 2,
		"楷体" : 3,
		"Arial,sans-serif" : 4,
		"Arial Black,sans-serif" : 5,
		"Comic Sans MS,cursive" : 6,
		"Courier New,monospace" : 7,
		"Garamond,serif" : 8,
		"Georgia,serif" : 9,
		"Lucida Console,monospace" : 10,
		"Lucida Sans,monospace" : 11,
		"Palantino Linotype,serif" : 12,
		"Tahoma,sans-serif" : 13,
		"Times New Roman,serif" : 14,
		"Trebuchet MS,sans-serif" : 15,
		"Verdana,sans-serif" : 16
	};
	this.fontSizes = [["8"], ["9"], ["10"], ["11"], ["12"], ["14"], ["16"],
			["18"], ["20"], ["22"], ["24"], ["26"], ["28"], ["36"], ["48"],
			["72"]];

	this.colorPalettes = {
		main : ["FFFFFF", "000000", "EEECE1", "1F497D", "4F81BD", "C0504D",
				"9BBB59", "8064A2", "4BACC6", "F79646", "F2F2F2", "7F7F7F",
				"DDD9C3", "6CD9F0", "DBE5E1", "F2DCDB", "EBF1DD", "E5E0EC",
				"DBEEF3", "FDEADA", "D8D8D8", "595959", "C4BD97", "8DB3E2",
				"B8CCE4", "E5B9B7", "D7E3BC", "CCC1D9", "B7DDE8", "FBD5B5",
				"BFBFBF", "3F3F3F", "938953", "548DD4", "95B3D7", "D99694",
				"C3D69B", "B2A2C7", "92CDDC", "FAC08F", "A5A5A5", "262626",
				"494429", "17365D", "366092", "953734", "76923C", "5F497A",
				"31859B", "E36C09", "7F7F7F", "0C0C0C", "1D1B10", "0F243E",
				"244061", "632423", "4F6128", "3F3151", "205867", "974806",
				"C00000", "FF0000", "FFC000", "FFFF00", "92D050", "00B050",
				"00B0F0", "0070C0", "002060", "7030A0"],
		extjs : ["000000", "993300", "333300", "003300", "003366", "000080",
				"333399", "333333", "800000", "FF6600", "808000", "008000",
				"008080", "0000FF", "666699", "808080", "FF0000", "FF9900",
				"99CC00", "339966", "33CCCC", "3366FF", "800080", "969696",
				"FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF",
				"993366", "C0C0C0", "FF99CC", "FFCC99", "FFFF99", "CCFFCC",
				"CCFFFF", "99CCFF", "CC99FF", "FFFFFF"]
	};
	this.defTextAlign = {
		e : "",
		n : "",
		s : "left",
		b : "center",
		h : "left"
	};
	this.borderType = {
		NONE : 0,
		TOP : 1,
		BOTTOM : 2,
		LEFT : 4,
		RIGHT : 8,
		OUT : 1 | 2 | 4 | 8,
		INS_HORIZ : 16,
		INS_VERT : 32,
		INS : 16 | 32,
		ALL : 1 | 2 | 4 | 8 | 16 | 32
	};
	this.hyperlinkStyle = "text-decoration:underline;color:#0000ff;style-style:normal;";
	this.delHyperlinkStyle = "text-decoration:none;color:#000000;";
	this.convJStoCSS = function(style) {
		if (!(style instanceof Object) || "length" in style) {
			return ""
		}
		var attr, attrCSS, styleCSS = "";
		for (attr in style) {
			if ((attrCSS = that.mapJStoCSS[attr]) !== undefined) {
				styleCSS = styleCSS.concat(attrCSS, ":", style[attr], ";")
			}
		}
		return styleCSS
	};
	this.convCSStoJS = function(style) {
		if (style === "") {
			return null
		}
		var pair, attrJS, styleJS = {}, i = -1;
		style = style.split(";");
		while ((pair = style[++i]) !== undefined) {
			pair = pair.split(":");
			if ((attrJS = that.mapCSStoJS[pair[0]]) !== undefined) {
				styleJS[attrJS] = pair[1]
			}
		}
		return styleJS
	};
	this.set = function(style) {
		var env = dev.report.base.app.environment, activeSheet = dev.report.base.app.activeSheet, activePane = activeSheet._aPane, cellCoords = env.selectedCellCoords, defSel = env.defaultSelection, styleCSS = that
				.convJStoCSS(style), cmdData = [], contentHeight;
		if (styleCSS == "") {
			return
		}
		//_conn.ccmdBuffer();
		if (defSel.isSingleCell()) {
			var mi = activePane.getMergeInfo(cellCoords[0], cellCoords[1]);
			if (mi && mi[0]) {
				var rangeCoords = [cellCoords[0], cellCoords[1],
						cellCoords[0] + mi[1] - 1, cellCoords[1] + mi[2] - 1];
				activeSheet.setRangeStyle(rangeCoords, style);
				cmdData.push([rangeCoords[0], rangeCoords[1], rangeCoords[2],
						rangeCoords[3], {
							s : styleCSS
						}])
			} else {
				activeSheet.setCellStyle(cellCoords[0], cellCoords[1], style);
				cmdData.push([cellCoords[0], cellCoords[1], cellCoords[0],
						cellCoords[1], {
							s : styleCSS
						}]);
				if (contentHeight = style.fontSize || style.fontFamily ? that
						.getContentHeight(env.selectedCell) : 0) {
					activeSheet.adjustRowHeights(cellCoords[1], cellCoords[1],
							contentHeight)
				}
			}
		} else {
			for (var corners, rangeCoords, areas = defSel.getRanges(), i = areas.length
					- 1; i >= 0; --i) {
				corners = areas[i].getRealCorners();
				rangeCoords = [corners[0].getX(), corners[0].getY(),
						corners[1].getX(), corners[1].getY()];
				activeSheet.setRangeStyle(rangeCoords, style);
				cmdData.push([rangeCoords[0], rangeCoords[1], rangeCoords[2],
						rangeCoords[3], {
							s : styleCSS
						}]);
				if (contentHeight
						|| (contentHeight == undefined && (contentHeight = style.fontSize
								|| style.fontFamily ? that
								.getContentHeight(env.selectedCell) : 0))) {
					activeSheet.adjustRowHeights(rangeCoords[1],
							rangeCoords[3], contentHeight)
				}
			}
		}

		var rang=[];
		var cmdArray=cmdData[0];
		rang.push(cmdArray[0]);
		rang.push(cmdArray[1]);
		rang.push(cmdArray[2]);
		rang.push(cmdArray[3]);
		var table=dev.report.model.report.tabMap;

		for(var i=rang[1];i<rang[3]+1;i++){
			var row= table.getRow(i);
			if(row==null){
				row=new dev.report.model.XRow(i);
				row.height=table.defaultRowHeight;
			}else{
				if(row.height==0) row.height=table.defaultRowHeight;
			}
			table.addRow(row);
		for(var j=rang[0];j<rang[2]+1;j++){
				var cell=table.getCell(j,i);
				if(cell!=null){
					if(cell.styleID!=''){
						var styleNum=table.getCellStyles(cell.styleID);
						var tempStyle=dev.report.model.report.getStyle(cell.styleID);
						if(styleNum>1){
							style=tempStyle.clone();
						}else{
							style=tempStyle;
						}
					}else{
						style=new dev.report.model.XStyle();
					}
					var styleString=cmdArray[4].s;
					styleString=styleString.substring(0,styleString.length-1);
					var stylePair=styleString.split(":");

					if(stylePair[0].trim()=='style-family')  
						style.fontName=stylePair[1];
					if(stylePair[0].trim()=='style-size')
						style.fontSize=stylePair[1];
					if(stylePair[0].trim()=='style-weight'){
						if(stylePair[1].indexOf('bold')!=-1){
							style.isBold=true;
						}else{
							style.isBold=false;
						}
					}
					if(stylePair[0].trim()=='style-style'){
						if(stylePair[1].trim()=='italic'){
							style.isItalic=true;
						}else{
							style.isItalic=false;
						}
					}
					if(stylePair[0].trim()=='text-decoration'){
						if(stylePair[1].trim()=='underline')
							style.isUnderline=true;
						if(stylePair[1].trim()=='line-through')
							style.isStrikeThrough=true;
					}
					if(stylePair[0].trim()=='color')
						style.forecolor=stylePair[1];

					if(stylePair[0].trim()=='background-color')
						style.backcolor=stylePair[1];
					
					if(stylePair[0].trim()=='text-align'){
						style.hAlign=stylePair[1];
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
				}
			}
		}
		if(table.expandedRowCount<rang[3]) table.expandedRowCount=rang[3];
		if(table.expandedColumnCount<rang[2]) table.expandedColumnCount=rang[2];

		activeSheet.clearPaneCache();
		activeSheet.reSaveRange();
	};
	this.setFromBar = function(code, val) {
		var env = dev.report.base.app.environment, activePane = dev.report.base.app.activePane, cellStyle = env.selectedCell.style, cellCoords = env.selectedCellCoords, setDefTextAlign = false, style = {}, textAlign;
		if (code >= 4 && code <= 6) {
			textAlign = (textAlign = activePane.getCellStyle(cellCoords[0],
					cellCoords[1])) != undefined
					&& (textAlign = textAlign.match(_re_textAlign)) != null
					? textAlign[1]
					: ""
		}
		switch (code) {
			case 1 :
				style.fontWeight = cellStyle.fontWeight != "bold" ? "bold" : "";
				break;
			case 2 :
				style.fontStyle = cellStyle.fontStyle != "italic"
						? "italic"
						: "";
				break;
			case 3 :
				style.textDecoration = cellStyle.textDecoration != "underline"
						? "underline"
						: "";
				break;
			case 4 :
				style.textAlign = textAlign != "Left"
						? "Left"
						: (setDefTextAlign = "");
				dev.report.base.app.performItemToggle = false;
				dev.report.base.app.toolbar.alignCenter.toggle(false);
				dev.report.base.app.toolbar.alignRight.toggle(false);
				dev.report.base.app.performItemToggle = true;
				break;
			case 5 :
				style.textAlign = textAlign != "Center"
						? "Center"
						: (setDefTextAlign = "");
				dev.report.base.app.performItemToggle = false;
				dev.report.base.app.toolbar.alignLeft.toggle(false);
				dev.report.base.app.toolbar.alignRight.toggle(false);
				dev.report.base.app.performItemToggle = true;
				break;
			case 6 :
				style.textAlign = textAlign != "Right"
						? "Right"
						: (setDefTextAlign = "");
				dev.report.base.app.performItemToggle = false;
				dev.report.base.app.toolbar.alignLeft.toggle(false);
				dev.report.base.app.toolbar.alignCenter.toggle(false);
				dev.report.base.app.performItemToggle = true;
				break;
			case 7 :
				style.fontSize = val.concat("pt");
				break;
			case 8 :
				style.fontFamily = val;
				break;
			case 9 :
				style.backgroundColor = val == "transparent" ? "" : "#"
						.concat(val);
				break;
			case 10 :
				style.color = "#".concat(val);
				break;
			default :
				return
		}
		that.set(style);
		if (setDefTextAlign === "") {
			env.selectedCell.style.textAlign = that.defTextAlign[activePane
					.getCellType(cellCoords[0], cellCoords[1])]
		}
		dev.report.base.app.activeSheet._defaultSelection.getCursorField()
				.cloneStyle();
		dev.report.base.hb.setAllNormal(null, true)
	};
	this.syncBar = function() {
		var env = dev.report.base.app.environment;
		if (env.viewMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		var app = dev.report.base.app, activePane = app.activePane, fTbar = app.toolbar, cellStyle = env.selectedCell.style, fontSize = cellStyle.fontSize
				.split("pt"), cellCoords = env.selectedCellCoords, textAlign, cellLocked, fontId;
		if (activePane != undefined) {
			if ((textAlign = activePane.getCellStyle(cellCoords[0],
					cellCoords[1])) != undefined) {
				textAlign = textAlign.match(_re_textAlign);
				if (textAlign != null) {
					textAlign = textAlign[1]
				}
			}
			cellLocked = activePane.isCellLocked(cellCoords[0], cellCoords[1])
		} else {
			textAlign = cellStyle.textAlign, cellLocked = true
		}
		app.performItemToggle = false;
		fTbar.bold.toggle(cellStyle.fontWeight == "bold", true);
		fTbar.italic.toggle(cellStyle.fontStyle == "italic", true);
		fTbar.underline.toggle(cellStyle.textDecoration == "underline", true);
		fTbar.alignLeft.toggle(textAlign == "left", true);
		fTbar.alignCenter.toggle(textAlign == "center", true);
		fTbar.alignRight.toggle(textAlign == "right", true);
		fTbar.lock.toggle(cellLocked, true);
		app.performItemToggle = true;
		fTbar.fontSizes.setValue(fontSize.length == 2
				? fontSize[0]
				: app.cnfDefaultFontSize);
		var fontFamily = cellStyle.fontFamily.replace(/, /g, ",").replace(/'/g,
				"");
		fTbar.fonts
				.setValue((fontId = that.fontCSSMap[fontFamily]) != undefined
						? that.fonts[fontId][0]
						: app.cnfDefaultFont)
	};
	this.cellTransfer = function(dstCell, srcCell) {
		var env = dev.report.base.app.environment;
		if (!env) {
			return
		}
		var srcCellCoords = env.selectedCellCoords;
		if (!srcCell) {
			srcCell = env.selectedCell
					? env.selectedCell
					: dev.report.base.app.activePane.getCellByCoords(
							srcCellCoords[0], srcCellCoords[1])
		}
		if (!srcCell || !srcCell.style) {
			return
		}
		dstCell.style.fontWeight = srcCell.style.fontWeight;
		dstCell.style.fontStyle = srcCell.style.fontStyle;
		dstCell.style.fontSize = srcCell.style.fontSize;
		dstCell.style.fontFamily = srcCell.style.fontFamily;
		dstCell.style.textDecoration = srcCell.style.textDecoration;
		dstCell.style.color = srcCell.style.color;
		dstCell.style.whiteSpace = srcCell.style.whiteSpace;
		dstCell.style.textIndent = srcCell.style.textIndent;
		dstCell.style.textAlign = srcCell.style.textAlign;
		dstCell.style.verticalAlign = srcCell.style.verticalAlign;
		dstCell.style.direction = srcCell.style.direction;
		dstCell.style.backgroundColor = srcCell.style.backgroundColor;
		dstCell.style.backgroundImage = srcCell.style.backgroundImage
	};
	this.borderStyle2CSS = function(edata) {
		if (!(edata instanceof Object) || "length" in edata
				|| edata.type == "none") {
			return ""
		}
		var css = ("width" in edata ? edata.width : "thin").concat(" ",
				("type" in edata ? edata.type : "Solid"), " ",
				("color" in edata ? edata.color : "#000000"));
		return css.replace(/ /g, "") != "" ? css : ""
	};
	this.setBorder = function(bdata) {
		var activeBook = dev.report.base.app.activeBook, ranges = dev.report.base.app.environment.defaultSelection
				.getRanges();
		var activeSheet = dev.report.base.app.activeSheet;
		for (var mi, range, i = ranges.length - 1; i >= 0; --i) {
			range = ranges[i].getCoords();
			if (range[0] == range[2]
					&& range[1] == range[3]
					&& (mi = activeBook._aPane.getMergeInfo(range[0], range[1]))
					&& mi[0]) {
				range[2] += mi[1] - 1, range[3] += mi[2] - 1
			}
			var table=dev.report.model.report.tabMap;

			if ("all" in bdata) {
				var res=table.setBorder(that.borderType.ALL,range,that.borderStyle2CSS(bdata.all));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("out" in bdata) {
				var res=table.setBorder(that.borderType.OUT,range,that.borderStyle2CSS(bdata.out));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("top" in bdata) {
				var res=table.setBorder(that.borderType.TOP,range,that.borderStyle2CSS(bdata.top));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("bottom" in bdata) {
				var res=table.setBorder(that.borderType.BOTTOM,range,that.borderStyle2CSS(bdata.bottom));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("left" in bdata) {
				var res=table.setBorder(that.borderType.LEFT,range,that.borderStyle2CSS(bdata.left));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("right" in bdata) {
				var res=table.setBorder(that.borderType.RIGHT,range,that.borderStyle2CSS(bdata.right));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("ins" in bdata) {
				var res=table.setBorder(that.borderType.INS,range,that.borderStyle2CSS(bdata.ins));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("ins_horiz" in bdata) {
				var res=table.setBorder(that.borderType.INS_HORIZ,range,that.borderStyle2CSS(bdata.ins_horiz));
				dev.report.base.ccmd.mexec(res[0]);
			}
			if ("ins_vert" in bdata) {
				var res=table.setBorder(that.borderType.INS_VERT,range,that.borderStyle2CSS(bdata.ins_vert));
				dev.report.base.ccmd.mexec(res[0]);		
			}				
		}
		activeSheet.reSaveRange();
	};
	this.getBorder = function() {
		var ranges = dev.report.base.app.environment.defaultSelection.getRanges(), types = [
				"top", "bottom", "left", "right", "ins_horiz", "ins_vert"], indices = {
			0 : true,
			1 : true,
			2 : true,
			3 : true,
			4 : true,
			5 : true
		}, bdata = {}, ccmd = [], css, type;
		
		for (var i = ranges.length - 1; i >= 0; --i) {
			ccmd.unshift(ranges[i].getCoords());
		}
		var table=dev.report.model.report.tabMap;
		var res = table.getBorder(ccmd);
		
		//(new dev.report.backend.CCmdSyncRqst(ccmd)).send();
	//	var res = (new dev.report.backend.CCmdSyncRqst(ccmd)).send();
			
		var fres = res[0][1], cres;
		if (!fres.length) {
			return {}
		}
		for (var i = res.length - 1; i >= 1; --i) {
			cres = res[i][1];
			if (!cres.length) {
				return {}
			}
			for (var idx in indices) {
				if (cres[idx] != fres[idx]) {
					fres[idx] = "mixed"
				}
			}
		}
		for (var idx in indices) {
			if ((css = fres[idx]) == "") {
				continue
			}
			type = types[idx];
			if (css == "mixed") {
				bdata[type] = {
					mixed : true
				}
			} else {
				if ((css = css.split(" ")).length == 3) {
					bdata[type] = {
						width : css[0],
						type : css[1],
						color : css[2]
					}
				}
			}
		}
		return bdata
	};
	this.getContentHeight = function(div) {
		var old_height = div.style.height, empty_div = false;
		if (div.innerHTML == "") {
			empty_div = true, div.innerHTML = "_"
		}
		div.style.height = "auto";
		var height = div.offsetHeight - 2;
		div.style.height = old_height;
		if (empty_div) {
			div.innerHTML = ""
		}
		return height
	};
	this.toggleLock = function() {
		var app = dev.report.base.app, env = app.environment, startCoord = env.lastRangeStartCoord, endCoord = env.lastRangeEndCoord;
		if (app.performItemToggle) {
			app.activeSheet
					.setRangeLock([startCoord[0], startCoord[1], endCoord[0],
									endCoord[1]], app.toolbar.lock.pressed)
		}
	}
};