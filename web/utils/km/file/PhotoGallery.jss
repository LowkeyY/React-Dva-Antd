Ext.namespace('utils.km.file');


utils.km.file.PhotoGallery = function(element, thumbWidth, thumbHeight, folders, fn, scope) {
    this._thumbWidth = thumbWidth;
    this._thumbHeight = thumbHeight;
    this._folders = folders;
    this._galleryElement = element;
    this._fn = fn;
    this._scope = scope;
}

utils.km.file.PhotoGallery.prototype = {

    getThumbnailWidth: function() {
        return this._thumbWidth;
    },

    getThumbnailHeight: function() {
        return this._thumbHeight;
    },
    
    init : function() {
        this.createAlbums();     
    },

    createAlbums: function() {
        var itemIndex = 0;
        var folderItem = null;
        while(folderItem = this._folders[itemIndex]) {
            var albumContainer = document.createElement('div');
            var albumThumbnailDiv = document.createElement('div');
            var albumDescriptionDiv = document.createElement('div');
            
            albumContainer.className = 'albumContainert';
            albumContainer.title = folderItem.Description;
            albumContainer.style.width = this._thumbWidth + 'px';
            albumThumbnailDiv.style.height = this._thumbHeight + 'px';
            albumThumbnailDiv.style.overflow = 'hidden';
            albumThumbnailDiv.className = 'albumThumbnail';
            albumDescriptionDiv.className = 'albumDescription';
            
            var thumbnail = document.createElement('img');
            thumbnail.src = "/utils/km/file/download.jcp?FolderID=" + folderItem.ID + "&thumbnail=true"
            albumThumbnailDiv.appendChild(thumbnail);      
            albumThumbnailDiv.onclick = this.createMethodReference(this, "showAlbum",folderItem.ID);
            
            albumDescriptionDiv.innerHTML = "<strong>" + folderItem.Name + "</strong><span>" + folderItem.CreateDate + "</span>";
            
            this._galleryElement.appendChild(albumContainer);
            albumContainer.appendChild(albumThumbnailDiv);
            albumContainer.appendChild(albumDescriptionDiv);
            
            itemIndex++;
        }
    },
    
    resize: function(width, height) {
        this._galleryElement.style.width = width + 'px';
        this._galleryElement.style.height = height + 'px';
    },

    showAlbum: function(albumId) {
        this._fn.call(this._scope, albumId);
    },
    
    createMethodReference: function(object, methodName, at) {
        return function () {
            object[methodName](at);
        };
    }        
    
};