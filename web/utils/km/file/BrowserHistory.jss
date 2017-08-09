/// <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('utils.km.file'); 

////////////////////////////////////////////////utils.km.file.BrowserHistory
//
/////////////////////////////////////////////////////////////////// 
utils.km.file.BrowserHistory = function() {
    this._position = -1;
    this._length = 0;
    this._addNewEntry = true;
    this._history = new Array();
};

utils.km.file.BrowserHistory.prototype = {

    getPosition: function() {
        return this._position;
    },
    
    setPosition: function(val) {
        this._position = val;
    },
    
    getCurrentEntry: function() {
        return this._history[this._position];  
    },

    addEntry: function(folderId) {
        if (this._addNewEntry && this.getCurrentEntry() != folderId) {
            this._position += 1;
            this._history[this._position] = folderId;
            this._length = this._position + 1;
        } else {
            this._addNewEntry = true;
        }
    },
    
    canGoBack: function() {
        if (this._position > 0)
            return true;
        else
            return false;
    },
    
    goBack: function() {
        if (this.canGoBack()) {
            this._position -= 1;
            this._addNewEntry = false;
            return true;
        }
        return false;
    },   
    
    canGoForward: function() {
        if (this._position < this._length - 1)
            return true;
        else
            return false;
    },
    
    goForward: function() {
        if (this.canGoForward()) {
            this._position += 1;
            this._addNewEntry = false;
            return true;
        }
        return false;
    }
};