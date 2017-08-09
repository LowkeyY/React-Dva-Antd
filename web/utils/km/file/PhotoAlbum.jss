Ext.namespace('utils.km.file'); 

utils.km.file.PhotoAlbum = function(element, thumbWidth, thumbHeight, files) {
    this._thumbWidth = thumbWidth;
    this._thumbHeight = thumbHeight;
    this._previewWidth = 500;
    this._previewHeight = 340;
    this._files = files;
    this._totalImages = 0;
    this._currentImage = 0;
    this._previewLoaded = false;
    this._listStep = 0;
    this._timeID = null;
    this._slideShowTimeID = null;
    this._scrolling = false;
    this._galleryElement = element;
}

utils.km.file.PhotoAlbum.prototype = {

    getThumbnailWidth: function() {
        return this._thumbWidth;
    },

    getThumbnailHeight: function() {
        return this._thumbHeight;
    },
    
    init : function(albumId) {
        this.createThumnailView();  
        this.createPreview();  
        this.createNav();     
    },
    
    dispose: function() {
        alert('bye ' + this.getFileName());
    },

    createThumnailView: function() {

        var galleryinstance = this;
        var divThumbnailContainer = document.createElement('div'); 
        divThumbnailContainer.id = "thumbnailsContainer";
        
        var tableElement = document.createElement('table'); 
        var tableBody = document.createElement('tbody');   
        var tableRow = document.createElement('tr');             
            
        tableElement.id = "thumbnailsHolder";
        tableElement.cellPadding = "0";
        tableElement.cellSpacing = "0";
        
        this._galleryElement.appendChild(divThumbnailContainer);
        divThumbnailContainer.appendChild(tableElement);
        tableElement.appendChild(tableBody);
        tableBody.appendChild(tableRow);    
                
        var itemIndex = 0;
        var fileItem = null;
        while(fileItem = this._files[itemIndex]) {
            // create the cells
            var tableCell = document.createElement('td');
            tableCell.id = "imagecell_" + itemIndex;
            tableCell.onclick = this.createMethodReference(this, "displayImage",itemIndex);
            tableRow.appendChild(tableCell);
            
            var thumbDiv = document.createElement('div');
            thumbDiv.style.height = this._thumbHeight + 'px';
            thumbDiv.style.width = this._thumbWidth + 'px';
            thumbDiv.style.overflow = 'hidden';
            thumbDiv.style.textAlign = 'center';
            thumbDiv.title = (fileItem.Description == null) ? "" : fileItem.Description;
            
            var thumbnail = document.createElement('img');
            thumbnail.src = (fileItem.dwpath ? fileItem.dwpath : "/utils/km/file/download.jcp?FileID=" + fileItem.ID) + "&thumbnail=true"
			thumbDiv.appendChild(thumbnail);
            tableCell.appendChild(thumbDiv);
                        
            //tableCell.innerHTML = fileItem._fileName;
            itemIndex++;
        }
        
        this._totalImages = itemIndex;
        //tableElement.style.width = (itemIndex * this._thumbWidth) + 'px';
    },

    createNav: function() {
        var galleryinstance = this;
        var divNavContainer = document.createElement('div');
        divNavContainer.id = "navContainer";
        
        var btnLeft = document.createElement('input');
        btnLeft.type = 'button';
        btnLeft.value = '\u00ab';
        btnLeft.className = 'scrollLeft'
        btnLeft.onmouseover = function() {galleryinstance.scrollThumbnailsLeft(); }
        btnLeft.onmouseout = function() {galleryinstance.scrollThumbnailsStop(); }
        
        var btnBack = document.createElement('input');
        btnBack.type = 'button';
        btnBack.value = '上一个';
        btnBack.onclick = function() {galleryinstance.previousImage(); }
        
        var btnPlay = document.createElement('input');
        btnPlay.type = 'button';
        btnPlay.id = 'btnStartSlideShow';
        btnPlay.value = '播放';
        btnPlay.onclick = function() {galleryinstance.StartSlideShow(); }
        
        var btnNext = document.createElement('input');
        btnNext.type = 'button';
        btnNext.value = '下一个';
        btnNext.onclick = function() {galleryinstance.nextImage(); }
        
        var btnRight = document.createElement('input');
        btnRight.type = 'button';
        btnRight.value = '\u00bb';
        btnRight.className = 'scrollRight';
        btnRight.onmouseover = function() {galleryinstance.scrollThumbnailsRight(); }
        btnRight.onmouseout = function() {galleryinstance.scrollThumbnailsStop(); }
        
        var btnSlideShow = document.createElement('input');
        btnSlideShow.type = 'button';
        btnSlideShow.value = '自动播放';
        btnSlideShow.onclick = function() {
            var ss = new utils.km.file.SlideShow(galleryinstance._files);
            ss.Init();      
        } 
        
        var btnDownload = document.createElement('input');
        btnDownload.type = 'button';
        btnDownload.value = '下载';
        btnDownload.onclick = function() {galleryinstance.downloadImage(); }         
        
        this._galleryElement.appendChild(divNavContainer);    
        divNavContainer.appendChild(btnLeft);
        divNavContainer.appendChild(btnBack);
        divNavContainer.appendChild(btnPlay);
        divNavContainer.appendChild(btnNext);
        divNavContainer.appendChild(btnRight);
        divNavContainer.appendChild(btnDownload);
        divNavContainer.appendChild(btnSlideShow);        
    },

    createPreview: function() {
        var divPreview = document.createElement('div');
        divPreview.id = 'previewContainer';
        divPreview.style.width = this._previewWidth + 'px';
        divPreview.style.height = this._previewHeight + 'px';
        
        var imgPreview = document.createElement('img');
        imgPreview.id = "previewHolder";
       // imgPreview.style.width=this._previewWidth + 'px';
		//imgPreview.style.height=this._previewHeight + 'px';

        this._galleryElement.appendChild(divPreview); 
        divPreview.appendChild(imgPreview);
    },

    resize: function(width, height) {
        this._galleryElement.style.width = width + 'px';
        this._galleryElement.style.height = height + 'px';
        
        var divThumbs = document.getElementById("thumbnailsContainer");
        var divPreview = document.getElementById("previewContainer");
        var divNav = document.getElementById("navContainer");
        
        this._previewHeight = height - (divThumbs.offsetHeight + divNav.offsetHeight);
        this._previewWidth = width;

        divPreview.style.width = this._previewWidth + 'px';
        divPreview.style.height = this._previewHeight + 'px'; 

		var imgPreview = document.getElementById("previewHolder");
		imgPreview.style.height=this._previewHeight + 'px';
    },

    displayImage: function(index) {
        
        if (index >= this._totalImages)
            return;

        var divThumbs = document.getElementById("thumbnailsContainer");
        var tblThumbs = document.getElementById("thumbnailsHolder");    
        var celThumb = document.getElementById("imagecell_" + index);
        var divThumbsWidth = divThumbs.offsetWidth;
        var tblThumbsLeft = tblThumbs.offsetLeft;
        var celThumbLeft = celThumb.offsetLeft;
        
        var scrollAmount = 0;
        if ((tblThumbsLeft + celThumbLeft) < 0)
            scrollAmount = (-1 * (tblThumbsLeft + celThumbLeft));
            
        var offset = celThumbLeft + tblThumbsLeft + celThumb.offsetWidth - divThumbsWidth;
        if (offset > 0)
            scrollAmount = -1 * offset;
            
        //alert(scrollAmount);
        var galleryInstance = this;
        if (this._scrolling === false) {            
            this._timerID = setInterval(function(){galleryInstance.ScrollThumbnails(tblThumbsLeft, scrollAmount);},10);
            this._scrolling = true;
        }
        
        // display current images
        var prevCell = document.getElementById("imagecell_" + this._currentImage);
        prevCell.className = '';
        this._currentImage = index;
        celThumb.className = 'selected';
        
        // disply full image
        this._previewLoaded = false;
        var preview = document.getElementById('previewHolder');
        var thumbnail = new Image();

        thumbnail.src = (this._files[index].dwpath ? this._files[index].dwpath : "/utils/km/file/download.jcp?FileID=" + this._files[index].ID) + "&width=" + this._previewWidth + "&height=" + this._previewHeight;
        preview.onload = function() {galleryInstance._previewLoaded = true; }
        preview.src = thumbnail.src+'&viewType=album';
    },

    previousImage: function() {
        if (this._currentImage == 0 || this._listStep > 0)
            return;
        this.displayImage(this._currentImage - 1);
    },

    nextImage : function() {
        if (this._currentImage == this._totalImages - 1 || this._listStep < 0)
            return;
        this.displayImage(this._currentImage + 1);
    },
    
    downloadImage : function() {
        var index = this._currentImage;
        var path = this._files[index].dwpath;
        window.location = (path) ? path : ('/utils/km/file/download.jcp?FileID=' + this._files[index].ID + '&att=1');
    },

    scrollThumbnailsLeft : function() {
        var tblThumbs = document.getElementById("thumbnailsHolder"); 
        var tblThumbsLeft = tblThumbs.offsetLeft;     
        
        if (tblThumbsLeft < 0 && this._scrolling === false) {
            var galleryInstance = this;
            this._timerID = setInterval(function(){galleryInstance.ScrollThumbnails(tblThumbsLeft, Math.abs(tblThumbsLeft));},20);
            this._scrolling = true;
        }    
    },

    scrollThumbnailsRight : function() {
        var divThumbs = document.getElementById("thumbnailsContainer");
        var tblThumbs = document.getElementById("thumbnailsHolder"); 
        var tblThumbsLeft = tblThumbs.offsetLeft;
        var tblThumbsLeft = tblThumbs.offsetLeft;     
        var scrollAmount = (tblThumbs.offsetWidth - divThumbs.offsetWidth) + tblThumbsLeft;
        
        if (scrollAmount > 0 && this._scrolling === false) {
            var galleryInstance = this;
            this._timerID = setInterval(function(){galleryInstance.ScrollThumbnails(tblThumbsLeft, (-1 * scrollAmount));},20);
            this._scrolling = true;
        }   
    },

    scrollThumbnailsStop : function() {
        clearInterval(this._timerID);
        this._listStep = 0;    
        this._scrolling = false;
    },

    ScrollThumbnails : function(ofst, amount) {                
        if(amount < 0)
            this._listStep -= 5;
        else
            this._listStep += 5;
            
        if (Math.abs(this._listStep) > Math.abs(amount))
            this._listStep = amount;
                
        var tblThumbs = document.getElementById("thumbnailsHolder");
        tblThumbs.style.left = (ofst + this._listStep) + 'px';
                
        if(Math.abs(this._listStep) == Math.abs(amount)) {
            clearInterval(this._timerID);
            this._listStep = 0;
            this._scrolling = false;
        }                       
    },

    StartSlideShow : function() {
        var galleryInstance = this;
        this._slideShowTimerID = setInterval(function(){galleryInstance.SlideShow();}, 4000);
        
        var btnPlay = document.getElementById('btnStartSlideShow');
        btnPlay.value = '停止';
        btnPlay.onclick = function() {galleryInstance.StopSlideShow(); }
    },

    StopSlideShow : function() {
        var galleryInstance = this;
        clearInterval(this._slideShowTimerID);
        
        var btnPlay = document.getElementById('btnStartSlideShow');
        btnPlay.value = '播放';
        btnPlay.onclick = function() {galleryInstance.StartSlideShow(); }
    },

    SlideShow : function() {
        if (!this._previewLoaded)
            return;
            
        if (this._currentImage == this._totalImages - 1) {
            this.displayImage(0);
            return;
        }        
        this.nextImage();
    },
    
    createMethodReference: function(object, methodName, at) {
        return function () {
            object[methodName](at);
        };
    }      
};