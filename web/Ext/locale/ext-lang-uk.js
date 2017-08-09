/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
﻿/*
 * Traditional Chinese translation
 * By hata1234
 * 09 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Читання...</div>';

if(Ext.View){
    Ext.View.prototype.emptyText = "";
} 

if(Ext.grid.GridPanel){
    Ext.grid.GridPanel.prototype.ddText = "Виберіть {0} OK";
}

if(Ext.TabPanelItem){
    Ext.TabPanelItem.prototype.closeText = "Закрити вкладку";
}

if(Ext.form.Field){
    Ext.form.Field.prototype.invalidText = "Значення не відповідає положенням області";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Читання...";
}

Date.monthNames = [
    "січень",
    "лютий",
    "Березень",
    "Квітень",
    "травень",
    "Червень",
    "Липень",
    "Серпень",
    "вересень",
    "Жовтень",
    "листопаді",
    "грудень"
];

Date.dayNames = [
    "Японія",
    "",
    "два",
    "три",
    "чотири",
    "п'ять",
    "шість"
];

if(Ext.MessageBox){
    Ext.MessageBox.buttonText = {
        ok : "визначати",
        cancel : "скасовано",
        yes : "бути",
        no : "немає"
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
       todayText         : "сьогодні",
       minText           : "Дата повинна бути більше, ніж мінімальна допустима дата",
       maxText           : "Дата повинна бути менше, ніж максимально допустима дата",
       disabledDaysText  : "",
       disabledDatesText : "",
       monthNames        : Date.monthNames,
       dayNames          : Date.dayNames,
       nextText          : "В наступному місяці (Ctrl + Вправо)",
       prevText          : "В минулому місяці (Ctrl + ліва стрілка)",
       monthYearText     : "Виберіть місяць (Ctrl + стрілки вгору / вниз для вибору року)",
       todayTip          : "{0} (Пробіл)",
       format            : "d/m/Y",
       okText            : "визначати",
       cancelText        : "скасовано"
    });
}

if(Ext.PagingToolbar){
    Ext.apply(Ext.PagingToolbar.prototype, {
       beforePageText : "перший",
       afterPageText  : "Сторінка {0} сторінки",
       firstText      : "на першій сторінці",
       prevText       : "попередній",
       nextText       : "наступний",
       lastText       : "Остання сторінка",
       refreshText    : "оновлення",
       displayMsg     : "Показані {0} - {1} пера {2} T",
       emptyMsg       : 'Немає інформації'
    });
}

if(Ext.form.TextField){
    Ext.apply(Ext.form.TextField.prototype, {
       minLengthText : "Це поле по крайней мере, ввести {0} символів",
       maxLengthText : "Введіть до {0} символів у цій області",
       blankText     : "Це поле є обов'язковим для заповнення",
       regexText     : "",
       emptyText     : null
    });
}

if(Ext.form.NumberField){
    Ext.apply(Ext.form.NumberField.prototype, {
       minText : "У цьому полі значення має бути більше {0}",
       maxText : "У цьому полі значення має бути більше {0}}",
       nanText : "{0} не є допустимим числом"
    });
}

if(Ext.form.DateField){
    Ext.apply(Ext.form.DateField.prototype, {
       disabledDaysText  : "Не може бути використана",
       disabledDatesText : "Не може бути використана",
       minText           : "Дата цьому полі повинна бути після {0}",
       maxText           : "Дата цьому полі повинна бути менше {0}",
       invalidText       : "{0} не правильний формат дати - повинно бути, як {1} такого формату",
       format            : "d/m/Y"
    });
}

if(Ext.form.ComboBox){
    Ext.apply(Ext.form.ComboBox.prototype, {
       loadingText       : "Читання ...",
       valueNotFoundText : undefined
    });
}

if(Ext.form.VTypes){
    Ext.apply(Ext.form.VTypes, {
       emailText    : 'Це поле повинно бути введені формати, такі як "user@example.com" E-Mail',
       urlText      : 'URL Формат цього поля повинен бути введений як "http:/ '+' / www.example.com"',
       alphaText    : 'У цьому полі можна ввести тільки половину ширини англійські букви, і підкреслення (_) символ',
       alphanumText : 'У цьому полі можна ввести тільки половину ширини англійські букви, цифри і символ підкреслення (_) символ'
    });
}

if(Ext.grid.GridView){
    Ext.apply(Ext.grid.GridView.prototype, {
       sortAscText  : "позитивні сортування",
       sortDescText : "останній візит",
       lockText     : "Блокування поля",
       unlockText   : "Розв'яжіть поле замок",
       columnsText  : "поле"
    });
}

if(Ext.grid.PropertyColumnModel){
    Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
       nameText   : "ім'я",
       valueText  : "значення",
       dateFormat : "d/m/Y"
    });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
    Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
       splitTip            : "Перетягніть збільшення розміру.",
       collapsibleSplitTip : "Перетягніть зумом. Миші двічі клацніть Приховати."
    });
}
