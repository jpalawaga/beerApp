/** All Javascript is (C) James Palawaga 2016 -- All rights Resrved **/
document.addEventListener('deviceready', function(){
    init();
    isBrowser = window.cordova.platformId == 'browser';
}, false);

function init() {
    console.log("Set up and ready to rock!");
}

function beginAddBeerFlow() {
    // This will simply get an image from the camera
    opts = {
      quality:100,
      saveToPhotoAlumb: true
    };

    if (!isBrowser) {
    navigator.camera.getPicture(cameraSuccessAddTitle, cameraFailure, opts);
    } else {
      cameraSuccessAddTitle({FILE_URI: 'img/sample.jpg'});
    }
}

function cameraSuccessAddTitle(image) {
    $('#add-beer')[0].style.backgroundImage = image.FILE_URI;
    $(":mobile-pagecontainer").pagecontainer("change", $("#welcome-screen"));
}

function cameraFailure(error) {
    alert('Failed to grab image :(');
    $(":mobile-pagecontainer").pagecontainer("change", $("#home"));
}
