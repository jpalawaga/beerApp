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

var startX = null;
var startStar = null;
// Rating Widget stuff
function updateStarStates(e) {
  // This is going to be very specific T_T.
  var starWidthVW = 5;
  var pixelsPerStar = $(window).width() * (starWidthVW / 100.0);

  var dragDistance = e.clientX - startX;
  var TotalStars = dragDistance/pixelsPerStar;
  var halvesToAdjust = Math.floor(TotalStars);

  updateStars(startStar + halvesToAdjust);

  //console.log(dragDistance + " (or " + TotalStars + " stars)");
}

// Given a star ID, grays everything above it!
// Not the most efficient, since we update all of the stars rather
// than just the necessary ones.
function updateStars(starId) {
  console.log('current Star: ' + starId)
  for (i = 0; i <= 10; i++) {
    if (i > starId) {
      $('#star-' + i).addClass('gray');
    } else {
      $('#star-' + i).removeClass('gray');
    }
  }
}

$(".starbox").bind('vmousedown', mouseHandler);
$(".starbox").bind('vmousedown', mouseHandler);
    
$(".starbox").bind('touchstart', function() { console.log('ooh')});

function mouseHandler(e) {
  startX = e.clientX;
  startStar = parseInt(e.currentTarget.children[0].id.substring(5));
  console.log('star: ' + startStar);
  updateStars(startStar);
  $("body").bind('vmousemove', updateStarStates);

  // Clean up the bindings when done.
  $("body").bind('vmouseup', function() {
    $("body").unbind('vmousemove', updateStarStates);
    $("body").unbind('vmouseup', this);
  });
};
