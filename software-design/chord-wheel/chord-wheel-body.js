/* chord-wheel-body.js : Kyle Laviana */

var token1chord; var token2chord; var token3chord; var token4chord; var token5chord;
//var jsontokenmap = { "token1":token1chord, "token2":token2chord, "token3":token3chord, "token4":token4chord, "token5":token5chord};

var s = Snap("#mysvg")
var CX = 50, CY = 50;
/* create SVG path pie slices of the circle */
function createCircularSegment(r1, r2, a1, a2, color, text) {
    var width = r2-r1,
        radius = r1 + (width / 2),
        start_x = CX + (radius * Math.cos(a1)),
        end_x = CX + (radius * Math.cos(a2)),
        start_y = CY - (radius * Math.sin(a1)),
        end_y = CY - (radius * Math.sin(a2));
    var path = null;
    /* position path so text faces up on both top and bottom halves of circle */
    if (a1 >= 12*Math.PI/12+Math.PI/24 && a2 <= 23*Math.PI/12+Math.PI/24) {
        path = s.path(
            " M " + start_x + " " + start_y +
            " A " + radius + " " + radius + " 0 0 0 " + end_x + " " + end_y);	
    } else {
        path = s.path( 
            " M " + end_x + " " + end_y +
            " A " + radius + " " + radius + " 0 0 1 " + start_x + " " + start_y);
    }
    path.attr({stroke: color,
                strokeWidth: width,
                strokeLinecap: "butt",
                fill: "none" });
    return path;
}
/* create text within pie slices of the circle */
function createText(inputPath, inputText, baselineAlignment, whichCircle) {
    var text = s.text(0, 0, inputText);
    text.attr({
        fill: 'white',
        fontFamily: 'Raleway, Verdana, sans-serif',
        fontWeight: 'bolder',
        fontSize: '4px',
        textpath: inputPath});
    text.textPath.attr({
            textAnchor: 'middle',
            alignmentBaseline: baselineAlignment,
            startOffset: '50%'});
    /* adjust extra-spacing around flat & sharp characters */
    if (inputText.charAt(1) == "♭" || inputText.charAt(2) == "♭") {
        text.attr({letterSpacing: '-1px'});
    }
    if (whichCircle == "inner" && baselineAlignment == "baseline") {
        text.attr({dy: '-5px'});
    } else if (whichCircle == "inner") {
        text.attr({dy: '5px'});
    }
    return text;
    /* bottom flipped text: https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html */
}
/* create group of SVG path and text and enable dragover */
function createGroup(r1, r2, a1, a2, color, inputText, baselineAlignment, whichCircle, pathId) {
    var path = createCircularSegment(r1,r2,a1,a2,color);
    var text = createText(path, inputText, baselineAlignment, whichCircle);
    var group = s.g(path, text);
    path.value = inputText;
    path.id = pathId;
    path.addClass('dragover');
}
/* create group for token circle and token text */
function createToken(tokenNumber, xPosition) {
    var circle = s.circle(xPosition, 20, 4).attr({
                                                fill: 'rgb(199, 222, 243)',
                                                stroke: 'black',
                                                strokeWidth: '.3',
                                            })
    var text = s.text(xPosition, 22.5, tokenNumber).attr({
                                                fontFamily: 'Raleway, Verdana, sans-serif',
                                                fontSize: '8',
                                                textAnchor: 'middle'
                                            })
    var group = s.g(circle, text).attr({id: 'token'+tokenNumber, value: 'token'+tokenNumber});
    group.addClass('hide');
    group.dragOver( function() { this.attr({ opacity: 0.3 }), 
                                                document.getElementById("currentchords"+tokenNumber).innerHTML = this.value,
                                                window['token'+tokenNumber+'chord'] = this.value },
                    function() { this.attr({ opacity: 1 }), 
                                                document.getElementById("currentchords"+tokenNumber).innerHTML = "",
                                                window['token'+tokenNumber+'chord'] = null });         
}
/* create circle enclosing play/pause button */
function createButtonContainer() {
    var circle = s.circle(50, 50, 10).attr({
        fill: 'blanchedalmond',
        stroke: 'black',
        strokeWidth: '.3',
    })     
}
/* play/pause button actions */
var flip = false,
    pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
    play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
    $animation = $('#animation');
$(".ytp-play-button").on('click', function() {
    flip = !flip;
    $animation.attr({
        "from": flip ? pause : play,
        "to": flip ? play : pause
    }).get(0).beginElement();
});

/* set up Web Audio var */
var audioCtx;

$("#playButton").on('click', function() {
    currentValue = document.getElementById('playButton').value;
    if(currentValue == "Off" || currentValue == ""){
        document.getElementById("playButton").value="On";
        audioCtx = new (window.AudioContext || window.webkitAudioContext);
        var volume = audioCtx.createGain();
        volume.gain.value=0.1;
        volume.connect(audioCtx.destination);
        var chordLooperCounter = 0;
        var i;
        for (i = 0; i < 30; i++) {
            setTimeout(function(){ ChordLooper(audioCtx, volume, chordLooperCounter); }, chordLooperCounter);
            chordLooperCounter = checkHowMany(chordLooperCounter);
            //ChordLooper(audioCtx, volume);
        }
    } else {
        document.getElementById("playButton").value="Off";
        audioCtx.close();
    }
});

function checkHowMany(chordLooperCounter) {
    if (token1chord != null) chordLooperCounter += 1000;
    if (token2chord != null) chordLooperCounter += 1000;
    if (token3chord != null) chordLooperCounter += 1000;
    if (token4chord != null) chordLooperCounter += 1000;
    if (token5chord != null) chordLooperCounter += 1000;
    return chordLooperCounter;
}

function ChordLooper(audioCtx, volume, chordLooperCounter) {
    var timeOutCounter = 0;
    if (token1chord != null) {
        Chordenator(token1chord, audioCtx, volume);
        timeOutCounter += 1000;
        chordLooperCounter += 1000;
    }
    if (token2chord != null) {
        setTimeout(function(){ Chordenator(token2chord, audioCtx, volume); }, timeOutCounter);
        timeOutCounter += 1000;
        chordLooperCounter += 1000;
    }
    if (token3chord != null) {
        setTimeout(function(){ Chordenator(token3chord, audioCtx, volume); }, timeOutCounter);
        timeOutCounter += 1000;
        chordLooperCounter += 1000;
    }
    if (token4chord != null) {
        setTimeout(function(){ Chordenator(token4chord, audioCtx, volume); }, timeOutCounter);
        timeOutCounter += 1000;
        chordLooperCounter += 1000;
    }
    if (token5chord != null) {
        setTimeout(function(){ Chordenator(token5chord, audioCtx, volume); }, timeOutCounter);
        timeOutCounter += 1000;
        chordLooperCounter += 1000;
    }
    return chordLooperCounter;
}

function Chordenator(tokenWhichChord, audioCtx, volume) {
    var note1 = audioCtx.createOscillator();
    var note2 = audioCtx.createOscillator();
    var note3 = audioCtx.createOscillator();
    // determine root midi number
    var midiRoot;
    if (tokenWhichChord.charAt(0) == 'C') {
        if (tokenWhichChord.charAt(1) == '♯') { midiRoot = 61 } else { midiRoot = 60; }
    }
    if (tokenWhichChord.charAt(0) == 'D') {
        if (tokenWhichChord.charAt(1) == '♭') { midiRoot = 61 } else { midiRoot = 62; }
    }
    if (tokenWhichChord.charAt(0) == 'E') {
        if (tokenWhichChord.charAt(1) == '♭') { midiRoot = 63 } else { midiRoot = 64; }
    }
    if (tokenWhichChord.charAt(0) == 'F') {
        if (tokenWhichChord.charAt(1) == '♯') { midiRoot = 66 } else { midiRoot = 65; }
    }
    if (tokenWhichChord.charAt(0) == 'G') {
        if (tokenWhichChord.charAt(1) == '♯') { midiRoot = 68 } else { midiRoot = 67; }
    }
    if (tokenWhichChord.charAt(0) == 'A') {
        if (tokenWhichChord.charAt(1) == '♭') { midiRoot = 68 } else { midiRoot = 69; }
    }
    if (tokenWhichChord.charAt(0) == 'B') {
        if (tokenWhichChord.charAt(1) == '♭') { midiRoot = 70 } else { midiRoot = 71; }
    }
    //determine if minor, else major
    if (tokenWhichChord.charAt(1) == 'm' || tokenWhichChord.charAt(2) == 'm') {
        createNote(note1, volume, midiRoot);
        createNote(note2, volume, midiRoot+3);
        createNote(note3, volume, midiRoot+7);
    } else {
        createNote(note1, volume, midiRoot);
        createNote(note2, volume, midiRoot+4);
        createNote(note3, volume, midiRoot+7);
    }
    note1.start();
    note2.start();
    note3.start();
    note1.stop(audioCtx.currentTime + 1);
    note2.stop(audioCtx.currentTime + 1);
    note3.stop(audioCtx.currentTime + 1);
}

function createNote(noteName, volume, midiNote) {
    noteName.type = "triangle";
    noteName.connect(volume);
    noteName.frequency.value = midiNoteToFrequency(midiNote);
}

function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
}

/* handle drag & drop */
Snap.plugin( function( Snap, Element, Paper, global ) {
    Element.prototype.getTransformedBB = function( outerSvgOption ) {       //whi
                var bb = this.getBBox(1);
                var m = Snap.matrix( this.node.getScreenCTM() )
                return { 
                    x:  m.x( bb.x, bb.y ),
                    y:  m.y( bb.x, bb.y ),
                    x2: m.x( bb.x2, bb.y2 ),
                    y2: m.y( bb.x2, bb.y2 ),
                    cx: m.x( bb.cx, bb.cy ), 
                    cy: m.y( bb.cx, bb.cy ) 
                };
    };
    Element.prototype.checkUnder = function() {
        var bb = this.getTransformedBB();
        var points = [[bb.cx, bb.cy],[bb.x, bb.y],[bb.x2,bb.y2],[bb.x,bb.y2],[bb.x2,bb.y]];
        var prevPointer = this.node.style.pointerEvents;
        this.node.style.pointerEvents = 'none'; 
        var isOver = 0;
        for( var c=0; c<points.length;c++) {
            var elUnder = document.elementFromPoint(points[c][0],points[c][1]);
            if( elUnder && elUnder.farthestViewportElement ) {
                var snapElUnder = Snap(elUnder);
                if( snapElUnder.hasClass('dragover') ) isOver = 1;
            }
        }
        if( isOver && snapElUnder ) {
            if( typeof this.data('isOver') === 'undefined' ) {
                if( this.data('overCallback') ) this.data('overCallback').call( snapElUnder )
                this.data('isOver', snapElUnder) 
            } else {
                if (this.data('isOver') !== snapElUnder) {
                    if (this.data('afterCallback')) this.data('afterCallback').call(this.data('isOver'));
                    if( this.data('overCallback') ) this.data('overCallback').call( snapElUnder )
                    this.data('isOver', snapElUnder)
                }
            }
        } else {
            if( typeof this.data('isOver') !== 'undefined' ) {
                if( this.data('overCallback') ) this.data('afterCallback').call( this.data('isOver') )
                this.removeData('isOver')
            }
        }
        this.node.style.pointerEvents = prevPointer;
    }        
    Element.prototype.dragOver = function( overCallback, afterCallback ) {
        this.drag( dragMove, dragStart, dragEnd );
        this.data('overCallback',  overCallback);
        this.data('afterCallback', afterCallback)
        return this;
    }
    var dragStart = function ( x,y,ev ) {
            this.data('ot', this.transform().local ); 
    }	
    var dragMove = function(dx, dy, e, x, y) {
            var snapInvMatrix = this.transform().diffMatrix.invert();
            snapInvMatrix.e = snapInvMatrix.f = 0;
            tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
            this.transform( "t" + [ tdx, tdy ] + this.data('ot')  );
            this.checkUnder();  
    }
    var dragEnd = function() {
    }
});
/* create inner circle */
var path_D = createGroup(0, 30, 0*Math.PI/6+Math.PI/12, 1*Math.PI/6+Math.PI/12, "#ff8080", 'D', 'baseline', 'inner', 'key1');
var path_G = createGroup(0, 30, 1*Math.PI/6+Math.PI/12, 2*Math.PI/6+Math.PI/12, "#ff4d4d", 'G', 'baseline', 'inner', 'key2');
var path_C = createGroup(0, 30, 2*Math.PI/6+Math.PI/12, 3*Math.PI/6+Math.PI/12, "#ff8080", 'C', 'baseline', 'inner', 'key3');
var path_F = createGroup(0, 30, 3*Math.PI/6+Math.PI/12, 4*Math.PI/6+Math.PI/12, "#ff4d4d", 'F', 'baseline', 'inner', 'key4');
var path_Bflat = createGroup(0, 30, 4*Math.PI/6+Math.PI/12, 5*Math.PI/6+Math.PI/12, "#ff8080", 'B♭', 'baseline', 'inner', 'key5');
var path_Eflat = createGroup(0, 30, 5*Math.PI/6+Math.PI/12, 6*Math.PI/6+Math.PI/12, "#ff4d4d", 'E♭', 'baseline', 'inner', 'key6');
var path_Aflat = createGroup(0, 30, 6*Math.PI/6+Math.PI/12, 7*Math.PI/6+Math.PI/12, "#ff8080", 'A♭', 'hanging', 'inner', 'key7');
var path_Dflat = createGroup(0, 30, 7*Math.PI/6+Math.PI/12, 8*Math.PI/6+Math.PI/12, "#ff4d4d", 'D♭', 'hanging', 'inner', 'key8');
var path_Fsharp = createGroup(0, 30, 8*Math.PI/6+Math.PI/12, 9*Math.PI/6+Math.PI/12, "#ff8080", 'F♯', 'hanging', 'inner', 'key9');
var path_B = createGroup(0, 30, 9*Math.PI/6+Math.PI/12, 10*Math.PI/6+Math.PI/12, "#ff4d4d", 'B', 'hanging', 'inner', 'key10');
var path_E = createGroup(0, 30, 10*Math.PI/6+Math.PI/12, 11*Math.PI/6+Math.PI/12, "#ff8080", 'E', 'hanging', 'inner', 'key11');
var path_A = createGroup(0, 30, 11*Math.PI/6+Math.PI/12, 12*Math.PI/6+Math.PI/12, "#ff4d4d", 'A', 'baseline', 'inner', 'key12');
/* create outer circle */
var path_Bm1 = createGroup(30, 50, 0*Math.PI/12+Math.PI/24, 1*Math.PI/12+Math.PI/24, "#80aaff", 'Bm', 'baseline', 'outer');
var path_Fsharpm1 = createGroup(30, 50, 1*Math.PI/12+Math.PI/24, 2*Math.PI/12+Math.PI/24, "#4d88ff", 'F♯m', 'baseline', 'outer');
var path_Em1 = createGroup(30, 50, 2*Math.PI/12+Math.PI/24, 3*Math.PI/12+Math.PI/24, "#80aaff", 'Em', 'baseline', 'outer');
var path_Bm2 = createGroup(30, 50, 3*Math.PI/12+Math.PI/24, 4*Math.PI/12+Math.PI/24, "#4d88ff", 'Bm', 'baseline', 'outer');
var path_Am1 = createGroup(30, 50, 4*Math.PI/12+Math.PI/24, 5*Math.PI/12+Math.PI/24, "#80aaff", 'Am', 'baseline', 'outer');
var path_Em2 = createGroup(30, 50, 5*Math.PI/12+Math.PI/24, 6*Math.PI/12+Math.PI/24, "#4d88ff", 'Em', 'baseline', 'outer');
var path_Dm1 = createGroup(30, 50, 6*Math.PI/12+Math.PI/24, 7*Math.PI/12+Math.PI/24, "#80aaff", 'Dm', 'baseline', 'outer');
var path_Am2 = createGroup(30, 50, 7*Math.PI/12+Math.PI/24, 8*Math.PI/12+Math.PI/24, "#4d88ff", 'Am', 'baseline', 'outer');
var path_Gm1 = createGroup(30, 50, 8*Math.PI/12+Math.PI/24, 9*Math.PI/12+Math.PI/24, "#80aaff", 'Gm', 'baseline', 'outer');
var path_Dm2 = createGroup(30, 50, 9*Math.PI/12+Math.PI/24, 10*Math.PI/12+Math.PI/24, "#4d88ff", 'Dm', 'baseline', 'outer');
var path_Cm1 = createGroup(30, 50, 10*Math.PI/12+Math.PI/24, 11*Math.PI/12+Math.PI/24, "#80aaff", 'Cm', 'baseline', 'outer');
var path_Gm2 = createGroup(30, 50, 11*Math.PI/12+Math.PI/24, 12*Math.PI/12+Math.PI/24, "#4d88ff", 'Gm', 'baseline', 'outer');
var path_Fm1 = createGroup(30, 50, 12*Math.PI/12+Math.PI/24, 13*Math.PI/12+Math.PI/24, "#80aaff", 'Fm', 'hanging', 'outer');
var path_Cm2 = createGroup(30, 50, 13*Math.PI/12+Math.PI/24, 14*Math.PI/12+Math.PI/24, "#4d88ff", 'Cm', 'hanging', 'outer');
var path_Bflatm1 = createGroup(30, 50, 14*Math.PI/12+Math.PI/24, 15*Math.PI/12+Math.PI/24, "#80aaff", 'B♭m', 'hanging', 'outer');
var path_Fm2 = createGroup(30, 50, 15*Math.PI/12+Math.PI/24, 16*Math.PI/12+Math.PI/24, "#4d88ff", 'Fm', 'hanging', 'outer');
var path_Eflatm1 = createGroup(30, 50, 16*Math.PI/12+Math.PI/24, 17*Math.PI/12+Math.PI/24, "#80aaff", 'E♭m', 'hanging', 'outer');
var path_Bflatm2 = createGroup(30, 50, 17*Math.PI/12+Math.PI/24, 18*Math.PI/12+Math.PI/24, "#4d88ff", 'B♭m', 'hanging', 'outer');
var path_Aflatm1 = createGroup(30, 50, 18*Math.PI/12+Math.PI/24, 19*Math.PI/12+Math.PI/24, "#80aaff", 'A♭m', 'hanging', 'outer');
var path_Eflatm2 = createGroup(30, 50, 19*Math.PI/12+Math.PI/24, 20*Math.PI/12+Math.PI/24, "#4d88ff", 'E♭m', 'hanging', 'outer');
var path_Dflatm2 = createGroup(30, 50, 20*Math.PI/12+Math.PI/24, 21*Math.PI/12+Math.PI/24, "#80aaff", 'D♭m', 'hanging', 'outer');
var path_Gsharpm1 = createGroup(30, 50, 21*Math.PI/12+Math.PI/24, 22*Math.PI/12+Math.PI/24, "#4d88ff", 'G♯m', 'hanging', 'outer');
var path_Fsharpm2 = createGroup(30, 50, 22*Math.PI/12+Math.PI/24, 23*Math.PI/12+Math.PI/24, "#80aaff", 'F♯m', 'hanging', 'outer');
var path_Csharpm2 = createGroup(30, 50, 23*Math.PI/12+Math.PI/24, 24*Math.PI/12+Math.PI/24, "#4d88ff", 'C♯m', 'baseline', 'outer');
/* create center button */
var button = createButtonContainer();
/* create tokens */
var token1 = createToken('1', -75);
var token2 = createToken('2', -60);
var token3 = createToken('3', -45);
var token4 = createToken('4', -30);
var token5 = createToken('5', -15);