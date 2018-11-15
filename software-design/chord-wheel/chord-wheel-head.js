/* chord-wheel-head.js : Kyle Laviana */

/* second chord sequence added to avoid necessity of circular array structure */
var jsonchordmap = { "1":"C", "2":"G", "3":"D", "4":"A", "5":"E", "6":"B", "7":"F#", "8":"D♭", 
"9":"A♭", "10":"E♭", "11":"B♭", "12":"F", "13":"C", "14":"G", "15":"D", "16":"A", "17":"E", "18":"B", "7":"F#", "8":"D♭", 
"19":"A♭", "20":"E♭", "21":"B♭", "22":"F", "23":"C"};
$(function() {
    $("#chord").change(function() {
        var tokenNumber = this.value;
        var i;
        $(".hide").hide();
        for (i = 1; i <= tokenNumber; i++) {
            $("#" + "token" + i).show();
        }
    }).trigger('change');
    $("#key").change(function() {
        var keyNumber = this.value;
        var selectedClass = 'selected';
        if (keyNumber >= 1) {
            $(".dragover").removeClass(selectedClass);
            $(path_D).addClass(selectedClass);
            $("#key" + keyNumber).addClass(selectedClass);
            $("#key" + (keyNumber-1)).addClass(selectedClass);
            $("#key" + (parseFloat(keyNumber)+1)).addClass(selectedClass);
            /* common chord progressions */
            /* first chord progression: I vi IV V */
            document.getElementById("commonchord1").innerHTML = jsonchordmap[keyNumber] + " ";
            document.getElementById("commonchord1").innerHTML += jsonchordmap[(parseFloat(keyNumber)+3)] + "m ";
            document.getElementById("commonchord1").innerHTML += jsonchordmap[(parseFloat(keyNumber)+11)] + " ";
            document.getElementById("commonchord1").innerHTML += jsonchordmap[(parseFloat(keyNumber)+1)];
            /* second chord progression: ii V I */
            document.getElementById("commonchord2").innerHTML = jsonchordmap[(parseFloat(keyNumber)+2)] + "m ";
            document.getElementById("commonchord2").innerHTML += jsonchordmap[(parseFloat(keyNumber)+1)] + " ";
            document.getElementById("commonchord2").innerHTML += jsonchordmap[keyNumber];
        }
    }).trigger('change');
});