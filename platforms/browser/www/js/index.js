/** All Javascript is (C) James Palawaga 2016 -- All rights Resrved **/

/* This function adjust the size of the textbox
    on the welcome screen for a nice presentation */
function adjustWelcomeBox() {
    var sizeBox = document.getElementById('width-calc');
    var realBox = document.getElementById('nameBox');
    sizeBox.textContent = realBox.value;

    // Set a minimum size
    maximumSize = realBox.parentNode.clientWidth;
    sz = sizeBox.clientWidth;
    if (sz < 100) {
        sz = 100;
    }

    
    // Adjust the box to be sized based on the text length
    if (realBox.value.length == realBox.maxLength) {
        sizeBox.textContent = sizeBox.textContent + "D"
        if (sizeBox.clientWidth + 50 < maximumSize) {
            realBox.maxLength += 1;
        }
    }
    
    if (realBox.clientWidth + 50 > maximumSize) {
        realBox.value = realBox.value.substring(0, realBox.value.length - 1)
    }
    realBox.setAttribute('style', 'width:' + sz + 'px;');
    /*while (tempBox.clientWidth > tempBox.parentNode.clientWidth) {
        fontSize = window.getComputedStyle(tempBox, null).fontSize;
        newSize = parseInt(fontSize.substring(0, fontSize.length - 2)) - 10;
        box.setAttribute('style', 'font-size:' + newSize + 'px;');
        tempBox.setAttribute('style', 'font-size:' + newSize + 'px;');
        console.log("Resizing");
    }*/
}

$('#nameBox').keypress(function(event) {
  if (event.keyCode == '13') {
     $(location).attr('href', '#pagetwo')
   }
});

var Timer = {
    lapTimes: [],
    stopTime: null,
    _interval: null,
    _lapElem: null,
    _totalElem: null,
    init: function(lapElem, totalElem) {
        this._lapElem = lapElem;
        this._totalElem = totalElem;
    },
    start: function() {
        this.lapTimes.push(new Date());
        this._interval = setInterval(function(that) {
            var t = new Date();
            that._lapElem.html(formatTime(t - that.lapTimes[that.lapTimes.length - 1]));
            that._totalElem.html(formatTime(t - that.lapTimes[0]));
        }, 10, this);
        console.log("started!");
    },
    lap: function() {
        var lapTime = new Date()
        var lastTime = this.lapTimes.slice(-1)[0];
        this.lapTimes.push(lapTime)
        var diff = lapTime - lastTime;
        console.log("Lap time:" + formatTime(diff))
    },
    stop: function () {
        this.stopTime = new Date();
        this.lapTimes.push(this.stopTime);
        clearInterval(this._interval);
        console.log("stop!");
    },
    reset: function () {
        this.lapTimes = [];
        this._stopTime = null;
        this._lapElem.html('00:00.00');
        this._totalElem.html('00:00.00');
    }
}

var timer = Object.create(Timer);
timer.init($('#timer'), $('#elapsed'));

function formatTime(time) {
    var timeString = '.' + pad(Math.round(time % 1000 / 10))
    var seconds = Math.floor(time / 1000);
    var minutes = 0;
    
    if (seconds > 60) {
        minutes = Math.floor(seconds / 60);
    }
    
    timeString = pad(minutes) + ":" + pad(seconds % 60) + timeString;
    
    return timeString;
}

function pad(time) {
    var str = '000000' + time;
    return str.substr(str.length - 2, 2);
}

var LapButton = {
    _elem: null,
    _backElem: null,
    _heldTime: null,
    _interval: null,
    _intervalTime: 1000,
    _pop: false,
    _popFunc: null,
    activate: function() {
        this._backElem.stop();
        this._heldTime = new Date();
        this._interval = setInterval(function(that) {
            timeDiff = (that._heldTime - new Date()) + that._intervalTime;
            percent = ((1000 - timeDiff) / 1000) * 100;
            if (percent > 99) {
                percent = 100;
                that._pop = true;
                clearInterval(that._interval);
                that._backElem.fadeOut(200).fadeIn(200);
            }
            that._backElem.width(percent + '%');
            
        }, 10, this)
    },
    deactivate: function() {
        clearInterval(this._interval);
        this._backElem.stop().animate({ width: '0%'}, 200);
        if (this._pop) {
            this.pop();
            this._pop = false;
        }        
    },
    pop: function() {
        this._popFunc();

        console.log('Popped!');
    },
    init: function(elem, cb) {
        this._elem = elem;
        this._backElem = elem.find('.background');
        this._popFunc = cb;
        elem.bind( "vmousedown", this.activate.bind(this) );
        elem.bind( "vmouseup", this.deactivate.bind(this) );
    }
}

// Setup our fancy-buttons
$('#lapButton').toggle()
$('#stopButton').toggle()
var lapButton = Object.create(LapButton);
lapButton.init($('#lapButton'), function(){timer.lap()});

var stopButton = Object.create(LapButton);
stopButton.init($('#stopButton'), function(){
    timer.stop()
    $('#stopButton').slideUp();
    $('#startButton').toggle();
    $('#lapButton').toggle();
    
    // Prepare the summary & display it.
    var name = $('#nameBox').val();
    $('#name').html(" " + name);
    $('#laps').html(timer.lapTimes.length - 1);
    var timeDiff = timer.stopTime - timer.lapTimes[0];
    $('#time').html(formatTime(timeDiff));
    var lapHtml = '';
    var max = timer.lapTimes.length
    timer.lapTimes.forEach(function(elem, iter) {
        if (iter < max - 1) {
            lapHtml += '<li>' + formatTime(timer.lapTimes[iter+1] - timer.lapTimes[iter]) + '</li>'    
        }
    });
    $('#lapTimes').html(lapHtml);
    $('#summary').panel('open');
    timer.reset();
});

var startButton = Object.create(LapButton);
startButton.init($('#startButton'), function(){ 
    $('#startButton').toggle();
    $('#lapButton').toggle();
    $('#stopButton').slideDown();
    timer.start();
});

document.addEventListener('deviceready', function(){
    adjustWelcomeBox();
}, false);
