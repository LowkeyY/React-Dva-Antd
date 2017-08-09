/*
 * ! Ext JS Library 3.3.1 Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com http://www.sencha.com/license
 */
/*
 * Traditional Chinese translation By hata1234 09 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">קריאה...</div>';

if (Ext.View) {
	Ext.View.prototype.emptyText = "";
}

if (Ext.grid.GridPanel) {
	Ext.grid.GridPanel.prototype.ddText = "בחר את {0} אישור";
}

if (Ext.TabPanelItem) {
	Ext.TabPanelItem.prototype.closeText = "לסגור את הכרטיסייה";
}

if (Ext.form.Field) {
	Ext.form.Field.prototype.invalidText = "הערך אינו עונה על הוראות בתחום";
}

if (Ext.LoadMask) {
	Ext.LoadMask.prototype.msg = "קריאה...";
}

Date.monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי",
		"אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

Date.dayNames = ["יפן", " ", "שני", "שלוש", "ארבע", "חמש", "שש"];

if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "לקבוע",
		cancel : "בוטלה",
		yes : "להיות",
		no : "לא"
	};
}

if (Ext.util.Format) {
	Ext.util.Format.date = function(v, format) {
		if (!v)
			return "";
		if (!(v instanceof Date))
			v = new Date(Date.parse(v));
		return v.dateFormat(format || "Y/m/d");
	};
}

if (Ext.DatePicker) {
	Ext.apply(Ext.DatePicker.prototype, {
		todayText : "היום",
		minText : "תאריך חייב להיות גדול מ תאריך המינימלית המותרת",
		maxText : "תאריך לא יעלה על תאריך המרבי המותר",
		disabledDaysText : "",
		disabledDatesText : "",
		monthNames : Date.monthNames,
		dayNames : Date.dayNames,
		nextText : "בחודש הבא (Ctrl + מקשי החצים הנכונים)",
		prevText : "בחודש הבא (Ctrl + מקשי החצים הנכונים)",
		monthYearText : "בחר חודש (Ctrl + למעלה / למטה במקשי החצים כדי לבחור את השנה)",
		todayTip : "{0} (מקש הרווח)",
		format : "y/m/d",
		okText : "לקבוע",
		cancelText : "בוטלה"
	});
}

if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
				beforePageText : "ראשון",
				afterPageText : "{0} דף",
				firstText : "העמוד הראשון",
				prevText : "קודם",
				nextText : "הבא",
				lastText : "עמוד אחרון",
				refreshText : "לרענן",
				displayMsg : "מציג {0} - {1} {2} עט T",
				emptyMsg : 'אין מידע'
			});
}

if (Ext.form.TextField) {
	Ext.apply(Ext.form.TextField.prototype, {
				minLengthText : "שדה זה לפחות להיכנס {0} תווים",
				maxLengthText : "הזן עד {0} תווים בתחום זה",
				blankText : "שדה זה נדרש",
				regexText : "",
				emptyText : null
			});
}

if (Ext.form.NumberField) {
	Ext.apply(Ext.form.NumberField.prototype, {
				minText : "שדה בעל ערך חייב להיות גדול מ {0}",
				maxText : "שדה בעל ערך לא יעלה על {0}",
				nanText : "{0} אינו מספר חוקי"
			});
}

if (Ext.form.DateField) {
	Ext.apply(Ext.form.DateField.prototype, {
		disabledDaysText : "לא ניתן להשתמש",
		disabledDatesText : "לא ניתן להשתמש",
		minText : "תאריך בשדה זה חייב להיות אחרי {0}",
		maxText : "תאריך בשדה זה חייב להיות לפני {0}",
		invalidText : "{0} היא לא תבנית התאריך הנכון - חייב להיות כמו {1} כזה בפורמט",
		format : "d/m/Y"
	});
}

if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
				loadingText : "קריאה ...",
				valueNotFoundText : undefined
			});
}

if (Ext.form.VTypes) {
	Ext.apply(Ext.form.VTypes, {
		emailText : 'שדה זה חייב להיות פורמטים קלט כמו דואר אלקטרוני "user@example.com"',
		urlText : 'תבנית URL של תחום זה יש להזין כמו "http:/ '
				+ ' / www.example.com"',
		alphaText : 'שדה זה יכול רק להזין את בחצי רוחב אותיות באנגלית, ואת קו תחתון (_) סמל',
		alphanumText : 'שדה זה יכול רק להזין את בחצי רוחב אותיות באנגלית, מספרים וקו תחתי (_) סמל'
	});
}

if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
				sortAscText : "חיובי מיון",
				sortDescText : "הפוך את כיוון",
				lockText : "נעל שדה",
				unlockText : "להתיר את נעילת השדה",
				columnsText : "שדה"
			});
}

if (Ext.grid.PropertyColumnModel) {
	Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
				nameText : "שם",
				valueText : "ערך",
				dateFormat : "d/m/Y"
			});
}

if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
	Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
				splitTip : "גרור את גודל הזום.",
				collapsibleSplitTip : "גרור את הזום. פעמיים על הסתר עכבר."
			});
}
