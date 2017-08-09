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

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">tải trong...</div>';

if(Ext.DataView){
   Ext.DataView.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "Chọn OK {0}";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Đóng tab này";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Nhập một giá trị bất hợp pháp";
}

if (Ext.LoadMask) {
    Ext.LoadMask.prototype.msg = "đọc...";
}

Date.monthNames = [
   "tháng một",
   "Tháng Hai",
   "March",
   "Tháng Tư",
   "May",
   "Tháng Sáu",
   "Tháng Bảy",
   "uy nghi",
   "Tháng Chín",
   "Tháng Mười",
   "Tháng mười một",
   "Tháng mười hai"
];

Date.dayNames = [
   "Nhật Bản",
   "A",
   "hai",
   "ba",
   "bốn",
   "năm",
   "sáu"
];

Date.formatCodes.a = "(this.getHours() < 12 'Morning': 'chiều')";
Date.formatCodes.A = "(this.getHours() < 12 'Morning': 'chiều')";

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "Xác định",
      cancel : "Bị hủy bỏ",
      yes    : "Hãy",
      no     : "không"
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
      todayText         : "hôm nay",
      minText           : "Ngày phải lớn hơn ngày cho phép tối thiểu",//update
      maxText           : "Ngày được ít hơn so với ngày cho phép tối đa",//update
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : 'vào tháng tới (Ctrl+Right)',
      prevText          : 'tháng trước (Ctrl+Left)',
      monthYearText     : 'Chọn một tháng (Control + Up / Down để thay đổi năm)',//update
      todayTip          : "{0} (Spacebar để lựa chọn)",
      format            : "d/m/Y",
      okText            : "Xác định",
      cancelText        : "Bị hủy bỏ"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "đầu tiên",//update
      afterPageText  : "{0} trang",//update
      firstText      : "trang đầu tiên",
      prevText       : "Trang trước",//update
      nextText       : "Tiếp theo",
      lastText       : "Last Page",
      refreshText    : "Làm mới",
      displayMsg     : "{0} - {1} {2}",//update
      emptyMsg       : 'không có dữ liệu'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Chiều dài tối thiểu của các mặt hàng đầu vào là {0} ký tự",
      maxLengthText : "Chiều dài tối đa của các mặt hàng đầu vào là {0} ký tự",
      blankText     : "Entry cho mất",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Giá trị tối thiểu của mục nhập là {0}",
      maxText : "Giá trị tối đa của đầu vào là {0}",
      nanText : "{0} không phải là một giá trị hợp lệ"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "vô hiệu hóa",
      disabledDatesText : "vô hiệu hóa",
      minText           : "Ngày nhập cảnh phải sau ngày {0}",
      maxText           : "Ngày nhập cảnh phải trước ngày {0}",
      invalidText       : "{0} Không hợp lệ ngày - phải thực hiện theo định dạng： {1}",
      format            : "d/m/Y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "tải trong...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Nhập cảnh phải được các địa chỉ e-mail định dạng, chẳng hạn như： "user@example.com"',
      urlText      : 'Nhập cảnh phải được định dạng địa chỉ URL, chẳng hạn như： "http:/'+'/www.example.com"',
      alphaText    : 'Các đầu vào phải có chỉ có một nửa chiều rộng của các chữ cái và_',//update
      alphanumText : 'Các mục có thể chứa chỉ có một nửa chiều rộng các chữ cái, số và_'//update
   });
}
//add HTMLEditor's tips by andy_ghg
if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Thêm một siêu liên kết:',
    buttonTips : {
      bold : {
        title: 'Bold (Ctrl + B)',
        text: 'Thiết lập các văn bản đã chọn in đậm',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'nghiêng(Ctrl+I)',
        text: 'Thiết lập các văn bản đã chọn in nghiêng',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'gạch dưới (Ctrl+U)',
        text: 'Các văn bản được lựa chọn nhấn mạnh',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'tăng font chữ',
        text: 'tăng kích thước chữ',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'giảm kích thước chữ',
        text: 'giảm kích thước chữ',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Đánh dấu văn bản trong các màu sắc khác nhau',
        text: 'Làm cho giao diện văn bản như đánh dấu với một cây bút highlighter',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'font màu sắc',
        text: 'Thay đổi màu chữ',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'canh trái',
        text: 'Các văn bản canh lề trái',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'trung tâm',
        text: 'Căn văn bản',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'canh phải',
        text: 'Phải liên kết văn bản',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Bullets',
        text: 'Bắt đầu để tạo ra một danh sách gạch đầu dòng',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'số',
        text: 'Bắt đầu để tạo ra một danh sách số',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Rẽ vào một siêu liên kết',
        text: 'Chuyển đổi văn bản được lựa chọn vào một siêu liên kết',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'View Code',
        text: 'Để hiển thị văn bản mã trong các hình thức',
        cls: 'x-html-editor-tip'
      }
    }
  });
}


if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "tích cực chuỗi",//update
      sortDescText : "đảo ngược",//update
      lockText     : "khóa cột",//update
      unlockText   : "mở khóa",//update
      columnsText  : "Row"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "tên",
      valueText  : "giá trị",
      dateFormat : "d/m/Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Kéo để thay đổi kích thước.",
      collapsibleSplitTip : "Kéo chuột để thay đổi kích thước tăng gấp đôi vào để ẩn."
   });
}