/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Simplified Chinese translation
 * By DavidHu
 * 09 April 2007
 * 
 * update by andy_ghg
 * 2009-10-22 15:00:57
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">تحميل في...</div>';

if(Ext.DataView){
   Ext.DataView.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "حدد موافق {0}";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "أغلق هذا التبويب";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "إدخال قيمة غير قانونية";
}

if (Ext.LoadMask) {
    Ext.LoadMask.prototype.msg = "قراءة...";
}

Date.monthNames = [
   "يناير",
   "فبراير",
   "مسيرة",
   "أبريل",
   "قد",
   "يونيو",
   "يوليو",
   "أغسطس",
   "سبتمبر",
   "تشرين الأول",
   "تشرين الثاني",
   "ديسمبر"
];

Date.dayNames = [
   "اليابان",
   "A",
   "اثنان",
   "ثلاثة",
   "أربعة",
   "خمسة",
   "ستة"
];

Date.formatCodes.a = "(this.getHours() < 12 'صباح': 'بعد الظهر')";
Date.formatCodes.A = "(this.getHours() <12 'صباح': 'بعد الظهر')";

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "تحديد",
      cancel : "ألغيت",
      yes    : "أن تكون",
      no     : "لا"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "d/m/Y");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "اليوم",
      minText           : "يجب أن تكون أكبر من تاريخ تاريخ المسموح به الحد الأدنى",//update
      maxText           : "يجب أن يكون تاريخ أقل من تاريخ الحد الأقصى المسموح به",//update
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : 'الشهر المقبل (Ctrl+Right)',
      prevText          : 'الشهر الماضي (Ctrl+Left)',
      monthYearText     : 'تحديد شهر (Control+Up/Downلتغيير السنة)',//update
      todayTip          : "{0} (المسافة لتحديد)",
      format            : "d/m/Y",
      okText            : "تحديد",
      cancelText        : "ألغيت"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "الأول",//update
      afterPageText  : "صفحة {0} صفحة",//update
      firstText      : "الصفحة الأولى",
      prevText       : "الصفحة الأولى......",//update
      nextText       : "الصفحة الأولى.........",
      lastText       : "الصفحة الأخيرة",
      refreshText    : "التحديث",
      displayMsg     : "{0} - {1} {2}",//update
      emptyMsg       : 'لا توجد بيانات'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "طول الحد الأدنى من البند الإدخال {0} أحرف",
      maxLengthText : "الحد الأقصى لطول العنصر الإدخال {0} أحرف",
      blankText     : "دخول لفقدان",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "قيمة الحد الأدنى لدخول هو {0}",
      maxText : "من قيمة الحد الأقصى للمساهمة هو {0}",
      nanText : "{0} ليست قيمة صالحة"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "تعطيل",
      disabledDatesText : "تعطيل",
      minText           : "يجب أن يكون بعد تاريخ دخول {0}",
      maxText           : "يجب أن يكون تاريخ بدء يكون قبل {0}",
      invalidText       : "{0} هو تاريخ غير صالح - يجب أن يتوافق مع الشكل: {1}",
      format            : "d/m/Y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "تحميل ...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'يجب أن يكون دخول تنسيق عنوان البريد الإلكتروني، مثل： "user@example.com"',
      urlText      : 'يجب أن يكون دخول شكل عنوان URL، مثل： "http:/'+'/www.example.com"',
      alphaText    : 'يجب أن تحتوي على المدخلات فقط بنصف العرض من الحروف و_',//update
      alphanumText : 'ويمكن دخول يحتوي فقط على الحروف بنصف العرض، وأرقام_'//update
   });
}
//add HTMLEditor's tips by andy_ghg
if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'إضافة ارتباط تشعبي:',
    buttonTips : {
      bold : {
        title: 'سميك (Ctrl + B)',
        text: 'ضبط النص المحدد بالخط العريض',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'مائل (Ctrl+I)',
        text: 'ضبط النص المحدد بخط مائل',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'تسطير (Ctrl+U)',
        text: 'على النص المحدد وشدد',
        cls: 'X-HTML-تحرير غيض'
      },
      increasefontsize : {
        title: 'زيادة الخط',
        text: 'زيادة حجم الخط',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'تخفيض حجم الخط',
        text: 'تخفيض حجم الخط',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'تسليط الضوء على النص في ألوان مختلفة',
        text: 'جعل مظهر النص مثل علامة بالقلم هيغليغتر',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'لون الخط',
        text: 'تغيير لون الخط',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'باتجاه اليسار',
        text: 'النص باتجاه اليسار',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'مركز',
        text: 'محاذاة النص',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'باتجاه اليمين',
        text: 'النص باتجاه اليمين',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'الرصاص',
        text: 'بدأ إنشاء قائمة نقطية',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'عدد',
        text: 'وبدأت لإنشاء قائمة مرقمة',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'يتحول إلى ارتباط تشعبي',
        text: 'تحويل النص المحدد إلى ارتباط تشعبي',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'رمز الشخصي',
        text: 'لإظهار النص إلى رمز في شكل',
        cls: 'x-html-editor-tip'
      }
    }
  });
}


if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "تسلسل إيجابي",//update
      sortDescText : "عكس",//update
      lockText     : "قفل عمود",//update
      unlockText   : "فتح",//update
      columnsText  : "صف"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "اسم",
      valueText  : "قيمة",
      dateFormat : "d/m/Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "اسحب لتغيير حجم.",
      collapsibleSplitTip : "اسحب لتغيير حجم لنقرا مزدوجا فوق لإخفاء."
   });
}