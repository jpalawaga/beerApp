/** All Javascript is (C) James Palawaga 2016 -- All rights Resrved **/
document.addEventListener('deviceready', init, false);

function init() {
    console.log("Set up and ready to rock!");
    isBrowser = window.cordova.platformId == 'browser';
}

// FULLY aware of brokeness that might arise at scale with this
// but we're using fucking store.js so who cares.
function listBeers() {
    beers = [];
    store.forEach(function(item) {
      beers.push(store.get(item))
    });
    
    function dateComp(a, b) {
      return new Date(b.date) - new Date(a.date);
    }

    function ratingComp(a, b) {
      aRating = a.rating * 10000000000 + (new Date(a.date).getTime() / 1000)
      bRating = b.rating * 10000000000 + (new Date(b.date).getTime() / 1000)
      return bRating - aRating;
    }

    beers.sort(ratingComp);

    // Just display it now
    beers.forEach(function(i, idx) {
      console.log(idx + ': ' + i.title);
    });

}

function beginAddBeerFlow() {
    // This will simply get an image from the camera
    opts = {
      quality:100,
      saveToPhotoAlbum: true
    };

    if (!isBrowser) {
      navigator.camera.getPicture(cameraSuccessAnnotate, cameraFailure, opts);
    } else {
      // Browsers don't have cameras: mock.
      cameraSuccessAnnotate('img/sample.png');
    }
}

function clearField(ctx) {
    ctx.style.fontStyle = 'normal';
    ctx.innerHTML = '';
}

var entryData = {
  image: null,
  loc: null,
  title: null,
  rating: null,
  notes: null,
  date: null,
};

function cameraSuccessAnnotate(image) {
    entryData.image = image;
    $('#welcome-screen')[0].style.background = "linear-gradient(rgba(178, 189, 11, 0.45), rgba(178, 189, 11, 0.45)), url('"+image+"')"
    // Hack to avoid stupid soft keyboard resizing.
    $('#welcome-screen')[0].style.backgroundSize = "" +$(window).width() + "px " + $(window).height() + "px";
    $(":mobile-pagecontainer").pagecontainer("change", $("#welcome-screen"));
    navigator.geolocation.getCurrentPosition(recordCoords, function(){});
}

function recordCoords(geo) {
    loc = {
       lat: geo.coords.latitude,
       lon: geo.coords.longitude,
    }
    entryData.loc = loc;
}

function cameraFailure(error) {
    alert('Failed to grab image :(');
    $(":mobile-pagecontainer").pagecontainer("change", $("#home"));
} 

function completeEntry() {
    entryData.title = $('#nameBox').html();
    entryData.notes = $('#tastingNotes').val();
    entryData.rating = parseInt($('#rating').val());
    entryData.date = new Date();
    store.set(uuid(), entryData);
    console.log(entryData); 
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
  if (starId > 10) {
    starId = 10;
  } else if (starId < 0) {
    starId = 0;
  }

  $('#rating').val(starId);

  for (i = 0; i <= 10; i++) {
    if (i > starId) {
      $('#star-' + i).addClass('gray');
    } else {
      $('#star-' + i).removeClass('gray');
    }
  }
}

$(".starbox").bind('vmousedown', starTouchBindingHandler);
    
function starTouchBindingHandler(e) {
  startX = e.clientX;
  startStar = parseInt(e.currentTarget.children[0].id.substring(5));
  updateStars(startStar);
  $("body").bind('vmousemove', updateStarStates);

  // Clean up the bindings when done.
  $("body").bind('vmouseup', function() {
    $("body").unbind('vmousemove', updateStarStates);
    $("body").unbind('vmouseup', this);
  });
};

// Generate uuid. I could use anything to store the entries
// but WHY NOT?
// http://stackoverflow.com/a/2117523
function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
