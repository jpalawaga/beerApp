/** All Javascript is (C) James Palawaga 2016 -- All rights Resrved **/
document.addEventListener('deviceready', init, false);

function init() {
    console.log("Set up and ready to rock!");
    isBrowser = window.cordova.platformId == 'browser';
}

function beginAddBeerFlow() {
    // This will simply get an image from the camera
    opts = {
      quality:100,
      saveToPhotoAlbum: true
    };

    if (!isBrowser) {
    navigator.camera.getPicture(cameraSuccessAddTitle, cameraFailure, opts);
    } else {
      // Browsers don't have cameras: mock.
      cameraSuccessAddTitle({FILE_URI: 'img/sample.png'});
    }
}

function clearField() {
    $("#nameBox").html('');
}

function cameraSuccessAddTitle(image) {
    $('#welcome-screen')[0].style.background = "linear-gradient(rgba(178, 189, 11, 0.45), rgba(178, 189, 11, 0.45)), url('"+image+"')"
    // Hack to avoid stupid soft keyboard resizing.
    $('#welcome-screen')[0].style.backgroundSize = "" +$(window).width() + "px " + $(window).height() + "px";
    $(":mobile-pagecontainer").pagecontainer("change", $("#welcome-screen"));
}

function cameraFailure(error) {
    alert('Failed to grab image :(');
    $(":mobile-pagecontainer").pagecontainer("change", $("#home"));
} 

function resizeText() {
    var textBox = document.getElementById('nameBox');
    var maximumSize = textBox.parentNode.clientWidth;

    while (textBox.clientWidth >= maximumSize) {
        fontSize = window.getComputedStyle(textBox, null).fontSize;
        newSize = parseInt(fontSize.substring(0, fontSize.length - 2)) - 2;
        textBox.setAttribute('style', 'font-size:' + newSize + 'px;');
    }
}

// Rating Widget stuff
function updateStarStates(e) {
  console.log(e.fromElement);
}

$(".star-left").bind('touchstart',  function() { $(this).css('background-color', 'black'); })
$(".star-right").bind('touchstart',  function() { $(this).css('background-color', 'black'); })
