Ext.namespace("dev.report");
dev.report.Err =  function() {
	var that = this;
	var _types = {
		INFO : 0,
		WARN : 1,
		ERR : 2
	};
	var _flags = {
		SILENT : 1,
		FATAL : 2
	};
	var _origins = {
		NA : 0,
		UI : 1,
		UI_B : 2,
		CORE : 3,
		RPC : 4
	};
	var _origins_desc = ["General", "Application", "Application Backend",
			"Server", "RPC Backend"];
	var _db = {
		1 : {
			name : "GenericException",
			type : _types.ERR,
			origin : _origins.NA
		},
		100 : {
			name : "RuntimeException",
			type : _types.ERR,
			origin : _origins.UI_B
		},
		101 : {
			name : "ParsingFailedException",
			type : _types.ERR,
			origin : _origins.UI_B
		},
		102 : {
			name : "NotImplementedException",
			type : _types.ERR,
			origin : _origins.UI_B
		},
		103 : {
			name : "InvalidSessionException",
			type : _types.ERR,
			flag : _flags.FATAL,
			origin : _origins.UI_B
		},
		1000 : {
			name : "InsufficientRightsException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1100 : {
			name : "EventHandlerAbortException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1200 : {
			name : "ClipboardInvalidIndexException",
			type : _types.WARN,
			origin : _origins.CORE
		},
		1300 : {
			name : "InvalidNameException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1400 : {
			name : "InterpreterRuntimeError",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1500 : {
			name : "InvalidFormulaException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1600 : {
			name : "CyclicDependencyException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1700 : {
			name : "ArrayException",
			type : _types.WARN,
			origin : _origins.CORE
		},
		1800 : {
			name : "NoWorkbookSelectedException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1801 : {
			name : "NoWorksheetSelectedException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1802 : {
			name : "NoApplicationSelectedException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1900 : {
			name : "LoadApplicationException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1901 : {
			name : "LoadException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		1902 : {
			name : "SaveException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2000 : {
			name : "ConditionalFormatException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2100 : {
			name : "NamedFormulaException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2101 : {
			name : "NamedFormulaDoesNotExistException",
			type : _types.WARN,
			origin : _origins.CORE
		},
		2200 : {
			name : "CopyWorksheetException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2300 : {
			name : "RangeException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2400 : {
			name : "MergedCellException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2500 : {
			name : "AuthenticationException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2600 : {
			name : "CellDimensionException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2700 : {
			name : "SessionException",
			type : _types.ERR,
			flag : _flags.FATAL,
			origin : _origins.CORE
		},
		2800 : {
			name : "InvalidGroupException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		2900 : {
			name : "InvalidUserException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3000 : {
			name : "TranslationTableException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3100 : {
			name : "WorksheetCopyException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3200 : {
			name : "WorkbookCloneException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3300 : {
			name : "ExtensionRegistryException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3400 : {
			name : "ExtensionCallerException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3500 : {
			name : "CyclicArrayException",
			type : _types.WARN,
			origin : _origins.CORE
		},
		3600 : {
			name : "WorksheetElementException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3700 : {
			name : "FormatException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3800 : {
			name : "StyleManagerException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		3900 : {
			name : "BoundedPointException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		4000 : {
			name : "FilterRegistryException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		4100 : {
			name : "ContainerWrapperException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		4200 : {
			name : "SelectionToLargeException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		4300 : {
			name : "ExtensionFailureException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		4400 : {
			name : "PaloConnectorException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		4500 : {
			name : "FatalException",
			type : _types.ERR,
			flag : _flags.FATAL,
			origin : _origins.CORE
		},
		4600 : {
			name : "ArrayFormulaOnMergedCellException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		4700 : {
			name : "ValueConversionException",
			type : _types.ERR,
			origin : _origins.CORE
		},
		R1 : {
			name : "GenericException",
			type : _types.ERR,
			origin : _origins.RPC
		},
		R2 : {
			name : "SystemException",
			type : _types.ERR,
			origin : _origins.RPC
		}
	};
	this.show = function(code, msg, params) {
		if (!(code in _db) || !(code in this.i18n)) {
			code = 1
		}
		var err = _db[code];
		if (err.flag & _flags.SILENT) {
			return
		}
		var icons = [Ext.MessageBox.INFO, Ext.MessageBox.WARNING,
				Ext.MessageBox.ERROR], mb_conf = {
			title : _origins_desc[err.origin].concat(" Error").localize()
					.concat(" ", code),
			icon : icons[err.type],
			buttons : Ext.MessageBox.OK
		}, desc = this.i18n[code];
		if (params instanceof Object) {
			for (var p in params) {
				desc = desc.replace("{".concat(p, "}"), params[p])
			}
		}
		if (typeof msg == "string" && msg.length) {
			desc = desc.concat("<br/><br/><br/>", "Error Data".localize(),
					":<br/>", msg, "<br/>")
		} else {
			desc = desc.concat("<br/>")
		}
		if (err.flag & _flags.FATAL) {
			desc = desc.concat("<br/><b>",
					"This is a fatal error, re-login will be required!"
							.localize(), "</b><br/>");
			mb_conf.fn = dev.report.backend.logout
		}
		mb_conf.msg = desc;
		Ext.MessageBox.show(mb_conf)
	};
	this.scan = function(res) {
		var found = false, el;
		for (var i in res) {
			if ((el = res[i])[0] === false) {
				found = true, that.show(el[1], el[2], el[3])
			}
		}
		return found
	}
	this.i18n = {
		1 : "GenericException Error",
		100 : "RuntimeException Error",
		101 : "ParsingFailedException Error",
		102 : "NotImplementedException Error",
		103 : "InvalidSessionException Error",
		1000 : "InsufficientRightsException Error",
		1100 : "EventHandlerAbortException Error",
		1200 : "ClipboardInvalidIndexException Error",
		1300 : "InvalidNameException Error",
		1400 : "InterpreterRuntimeError Error",
		1500 : "InvalidFormulaException Error",
		1600 : "CyclicDependencyException Error",
		1700 : "ArrayException Error",
		1800 : "NoWorkbookSelectedException Error",
		1801 : "NoWorksheetSelectedException Error",
		1802 : "NoApplicationSelectedException Error",
		1900 : "LoadApplicationException Error",
		1901 : "LoadException Error",
		1902 : "SaveException Error",
		2000 : "ConditionalFormatException Error",
		2100 : "NamedFormulaException Error",
		2101 : "NamedFormulaDoesNotExistException Error",
		2200 : "CopyWorksheetException Error",
		2300 : "RangeException Error",
		2400 : "MergedCellException Error",
		2500 : "AuthenticationException Error",
		2600 : "CellDimensionException Error",
		2700 : "SessionException Error",
		2800 : "InvalidGroupException Error",
		2900 : "InvalidUserException Error",
		3000 : "TranslationTableException Error",
		3100 : "WorksheetCopyException Error",
		3200 : "WorkbookCloneException Error",
		3300 : "ExtensionRegistryException Error",
		3400 : "ExtensionCallerException Error",
		3500 : "CyclicArrayException Error",
		3600 : "WorksheetElementException Error",
		3700 : "FormatException Error",
		3800 : "StyleManagerException Error",
		3900 : "BoundedPointException Error",
		4000 : "FilterRegistryException Error",
		4100 : "ContainerWrapperException Error",
		4200 : "SelectionToLargeException Error",
		4300 : "ExtensionFailureException Error",
		4400 : "PaloConnectorException Error",
		4500 : "FatalException Error",
		4600 : "ArrayFormulaOnMergedCellException Error",
		4700 : "ValueConversionException Error",
		R1 : "GenericException Error",
		R2 : "Error in {FILE} on line {LINE}!",
		P0_0 : "Palo Action failed.",
		P1_0 : "Database name is not correct.",
		P1_1 : "Dimension already exists.",
		P1_2 : "Dimension doesn't exist.",
		P1_3 : "Dimension used by some Cubes.",
		P1_4 : "Element already exists.",
		P1_5 : "Subset not deleted.",
		P1_6 : "Subset not renamed.",
		P1_7 : 'Unable to get list of databases for "{conn_name}" connection.',
		P1_8 : "Subset {ss_name} can't be created.",
		P1_9 : "You don't have enough rights for this action!",
		P1_10 : "Unabe to change connection status.",
		P1_11 : "Unable to get config palo connection.",
		P1_12 : "Bad PALO connection type for connection name: {conn_name}.",
		P1_13 : "Unable to make connection for connection name: {conn_name}.",
		P1_14 : "Unable to get user for connection name: {conn_name}.",
		P1_15 : "Unable to create new database: {db_name}.",
		P1_16 : "Unable to get Paste View config data.",
		P1_17 : "Unable to delete database: {db_name}.",
		P1_18 : "Unable to generate Subset List!"
	};
};
