function selectTag(i_label, i_include)
{
    var spanElement = document.createElement("span");

    if (i_include)
    {
        $(spanElement).addClass("wanted");
    }
    else
    {
        $(spanElement).addClass("unwanted");
    }

    spanElement.appendChild(document.createTextNode(i_label));

    document.getElementById("selectedTags").appendChild(spanElement);

    spanElement.addEventListener("click", function (i_event) {
        $(spanElement).remove();
    });
}



$(document).ready(function () {
    dan.disableUserSelection(document.body);
    dan.disableContextMenu(document.body);

    $(document).bind("mousemove", function (i_event) {
        document.body.style.backgroundPositionX = (-i_event.pageX / 64).toString() + "px";
        document.body.style.backgroundPositionY = (-i_event.pageY / 64).toString() + "px";
    });

    // + Dialogs {{{

    var viewportDimmer = new ViewportDimmer();

    $(".helpButton").bind("click", function (i_event) {
        viewportDimmer.dim();

        var openerButtonClientRect = i_event.target.getBoundingClientRect();
        popUpElement($(".helpDialog")[0], openerButtonClientRect.right + 10, openerButtonClientRect.top);
    });

    $(".creditsButton").bind("click", function (i_event) {
        var openerButtonClientRect = i_event.target.getBoundingClientRect();
        popUpElement($(".creditsDialog")[0], openerButtonClientRect.right + 10, openerButtonClientRect.top);
    });

    function closeDialogs(i_event)
    {
        viewportDimmer.undim();
        $(".popupDialog").css("visibility", "hidden");
    }
    $(".closeButton").bind("click", closeDialogs);
    viewportDimmer.bindClick(closeDialogs);

    // + }}}

    //
    var bpmSliderValue = 120;
    var bpmSliderHandle = $("#bpmControl .handle");

    $("#bpmControl .slider").slider({
        orientation: "vertical",
        min: 60,
        max: 600,

        create: function () {
            $(this).slider("value", bpmSliderValue);
            bpmSliderHandle.text(bpmSliderValue);
        },
        slide: function (event, ui) {
            bpmSliderHandle.text(ui.value);
            bpmSliderValue = ui.value;
        }
    });

    $("#go").bind("mouseover", function (i_event) {
        $("#go").find("path")[0].setAttribute("fill", "#88f");
    });
    $("#go").bind("mouseout", function (i_event) {
        $("#go").find("path")[0].setAttribute("fill", "#fff");
    });

    // If click go button, go to space
    $("#go").click(function () {
        var wantedTags = [];
        var unwantedTags = [];
        $("#selectedTags span").each(function () {
            if ($(this).hasClass("wanted"))
                wantedTags.push($(this).text());
            else
                unwantedTags.push($(this).text());
        });

        var params = [];

        if (wantedTags.length > 0)
            params.push("tags=" + wantedTags.join("+"));

        if (unwantedTags.length > 0)
            params.push("unwantedTags=" + unwantedTags.join("+"));

        params.push("bpm=" + bpmSliderValue);

        window.location = "space.html?" + params.join("&");
    });


    // [subfamily is not used]
    var entries = [
        { subfamily: "explosion", label: "gunshot", number: 118, family: "objects" },
        { subfamily: "locomotion", label: "footstep", number: 208, family: "human" },
        { subfamily: "hands", label: "hands", number: 91, family: "human" },
        { subfamily: "misc_objects", label: "amplifier", number: 50, family: "objects" },
        { subfamily: "domestic", label: "silverware", number: 43, family: "objects" },
        { subfamily: "scifi", label: "alien", number: 717, family: "scifi" },
        { subfamily: "domestic", label: "dish", number: 48, family: "objects" },
        { subfamily: "farm", label: "chicken", number: 34, family: "animals" },
        { subfamily: "vehicle", label: "police", number: 59, family: "objects" },
        { subfamily: "liquid", label: "pump", number: 42, family: "objects" },
        { subfamily: "wood", label: "wood", number: 2045, family: "objects" },
        { subfamily: "digestion", label: "chewing", number: 28, family: "human" },
        { subfamily: "wood", label: "crack", number: 540, family: "objects" },
        { subfamily: "hands", label: "snap", number: 627, family: "human" },
        { subfamily: "explosion", label: "boom", number: 525, family: "objects" },
        { subfamily: "respiration", label: "breathing", number: 93, family: "human" },
        { subfamily: "scifi", label: "sci-fi", number: 1417, family: "scifi" },
        { subfamily: "scifi", label: "horror", number: 907, family: "scifi" },
        { subfamily: "bell", label: "doorbell", number: 33, family: "objects" },
        { subfamily: "scifi", label: "dark", number: 353, family: "scifi" },
        { subfamily: "domestic", label: "dryer", number: 32, family: "objects" },
        { subfamily: "domestic", label: "velcro", number: 44, family: "objects" },
        { subfamily: "domestic", label: "knock", number: 272, family: "objects" },
        { subfamily: "scifi", label: "thrill", number: 28, family: "scifi" },
        { subfamily: "voice", label: "cry", number: 64, family: "human" },
        { subfamily: "vehicle", label: "subway", number: 33, family: "objects" },
        { subfamily: "hands", label: "clap", number: 650, family: "human" },
        { subfamily: "bell", label: "buzzer", number: 21, family: "objects" },
        { subfamily: "bell", label: "bicycle", number: 57, family: "objects" },
        { subfamily: "group", label: "crowd", number: 76, family: "human" },
        { subfamily: "explosion", label: "burst", number: 121, family: "objects" },
        { subfamily: "voice", label: "sigh", number: 74, family: "human" },
        { subfamily: "misc_objects", label: "bounce", number: 391, family: "objects" },
        { subfamily: "vehicle", label: "horn", number: 114, family: "objects" },
        { subfamily: "domestic", label: "flush", number: 36, family: "objects" },
        { subfamily: "explosion", label: "explosion", number: 701, family: "objects" },
        { subfamily: "pets", label: "bark", number: 237, family: "animals" },
        { subfamily: "tools", label: "hammer", number: 265, family: "objects" },
        { subfamily: "scifi", label: "fear", number: 129, family: "scifi" },
        { subfamily: "machines", label: "machines", number: 49, family: "objects" },
        { subfamily: "telephone", label: "dial", number: 61, family: "objects" },
        { subfamily: "scifi", label: "space", number: 1217, family: "scifi" },
        { subfamily: "hands", label: "fingers", number: 64, family: "human" },
        { subfamily: "domestic", label: "microwave", number: 68, family: "objects" },
        { subfamily: "domestic", label: "keys", number: 362, family: "objects" },
        { subfamily: "pets", label: "hiss", number: 105, family: "animals" },
        { subfamily: "wild", label: "bird", number: 359, family: "animals" },
        { subfamily: "locomotion", label: "run", number: 99, family: "human" },
        { subfamily: "scifi", label: "monster", number: 678, family: "scifi" },
        { subfamily: "scifi", label: "ufo", number: 81, family: "scifi" },
        { subfamily: "liquid", label: "water", number: 1140, family: "objects" },
        { subfamily: "misc_objects", label: "basketball", number: 69, family: "objects" },
        { subfamily: "bell", label: "cowbell", number: 196, family: "objects" },
        { subfamily: "respiration", label: "cough", number: 149, family: "human" },
        { subfamily: "domestic", label: "zipper", number: 125, family: "objects" },
        { subfamily: "farm", label: "quack", number: 21, family: "animals" },
        { subfamily: "scifi", label: "zombie", number: 201, family: "scifi" },
        { subfamily: "domestic", label: "faucet", number: 80, family: "objects" },
        { subfamily: "domestic", label: "bathtub", number: 24, family: "objects" },
        { subfamily: "respiration", label: "sniff", number: 45, family: "human" },
        { subfamily: "digestion", label: "fart", number: 570, family: "human" },
        { subfamily: "pets", label: "meow", number: 193, family: "animals" },
        { subfamily: "scifi", label: "sinister", number: 47, family: "scifi" },
        { subfamily: "domestic", label: "chop", number: 84, family: "objects" },
        { subfamily: "voice", label: "conversation", number: 48, family: "human" },
        { subfamily: "wild", label: "wolf", number: 127, family: "animals" },
        { subfamily: "domestic", label: "sink", number: 108, family: "objects" },
        { subfamily: "locomotion", label: "shuffle", number: 80, family: "human" },
        { subfamily: "bell", label: "bell", number: 588, family: "objects" },
        { subfamily: "domestic", label: "duct", number: 24, family: "objects" },
        { subfamily: "scifi", label: "spooky", number: 109, family: "scifi" },
        { subfamily: "domestic", label: "pot", number: 174, family: "objects" },
        { subfamily: "locomotion", label: "walk", number: 151, family: "human" },
        { subfamily: "vehicle", label: "motor", number: 158, family: "objects" },
        { subfamily: "voice", label: "babbling", number: 53, family: "human" },
        { subfamily: "domestic", label: "scissors", number: 35, family: "objects" },
        { subfamily: "telephone", label: "ring", number: 517, family: "objects" },
        { subfamily: "vehicle", label: "boat", number: 36, family: "objects" },
        { subfamily: "farm", label: "sheep", number: 31, family: "animals" },
        { subfamily: "voice", label: "moan", number: 104, family: "human" },
        { subfamily: "farm", label: "horse", number: 28, family: "animals" },
        { subfamily: "bell", label: "chime", number: 192, family: "objects" },
        { subfamily: "voice", label: "shout", number: 311, family: "human" },
        { subfamily: "wild", label: "frog", number: 90, family: "animals" },
        { subfamily: "digestion", label: "burp", number: 266, family: "human" },
        { subfamily: "liquid", label: "splash", number: 445, family: "objects" },
        { subfamily: "bell", label: "jingle", number: 196, family: "objects" },
        { subfamily: "scifi", label: "spaceship", number: 230, family: "scifi" },
        { subfamily: "vehicle", label: "engine", number: 386, family: "objects" },
        { subfamily: "domestic", label: "door", number: 1556, family: "objects" },
        { subfamily: "scifi", label: "scary", number: 414, family: "scifi" },
        { subfamily: "vehicle", label: "bus", number: 24, family: "objects" },
        { subfamily: "tools", label: "tool", number: 193, family: "objects" },
        { subfamily: "explosion", label: "fireworks", number: 94, family: "objects" },
        { subfamily: "scifi", label: "terror", number: 85, family: "scifi" },
        { subfamily: "vehicle", label: "train", number: 64, family: "objects" },
        { subfamily: "voice", label: "grunt", number: 75, family: "human" },
        { subfamily: "group", label: "chatter", number: 22, family: "human" },
        { subfamily: "liquid", label: "squish", number: 151, family: "objects" },
        { subfamily: "vehicle", label: "car", number: 477, family: "objects" },
        { subfamily: "liquid", label: "pour", number: 146, family: "objects" },
        { subfamily: "pets", label: "cat", number: 200, family: "animals" },
        { subfamily: "machines", label: "ratchet", number: 41, family: "objects" },
        { subfamily: "voice", label: "voice", number: 7131, family: "human" },
        { subfamily: "voice", label: "laughter", number: 224, family: "human" },
        { subfamily: "explosion", label: "gunfire", number: 27, family: "objects" },
        { subfamily: "heart", label: "heart", number: 27, family: "human" },
        { subfamily: "farm", label: "duck", number: 61, family: "animals" },
        { subfamily: "domestic", label: "tap", number: 563, family: "objects" },
        { subfamily: "voice", label: "whisper", number: 386, family: "human" },
        { subfamily: "telephone", label: "telephone", number: 206, family: "objects" },
        { subfamily: "farm", label: "pig", number: 55, family: "animals" },
        { subfamily: "domestic", label: "drawer", number: 99, family: "objects" },
        { subfamily: "wild", label: "rat", number: 42, family: "animals" },
        { subfamily: "domestic", label: "slam", number: 264, family: "objects" },
        { subfamily: "scifi", label: "creepy", number: 298, family: "scifi" },
        { subfamily: "vehicle", label: "ship", number: 124, family: "objects" },
        { subfamily: "domestic", label: "cutlery", number: 125, family: "objects" },
        { subfamily: "tools", label: "saw", number: 393, family: "objects" },
        { subfamily: "vehicle", label: "airplane", number: 25, family: "objects" },
        { subfamily: "pets", label: "purr", number: 29, family: "animals" },
        { subfamily: "vehicle", label: "siren", number: 96, family: "objects" },
        { subfamily: "voice", label: "speech", number: 1627, family: "human" },
        { subfamily: "voice", label: "chuckle", number: 40, family: "human" },
        { subfamily: "glass", label: "clink", number: 142, family: "objects" },
        { subfamily: "farm", label: "goat", number: 23, family: "animals" },
        { subfamily: "domestic", label: "pan", number: 214, family: "objects" },
        { subfamily: "scifi", label: "cyborg", number: 134, family: "scifi" },
        { subfamily: "machines", label: "printer", number: 77, family: "objects" },
        { subfamily: "domestic", label: "cupboard", number: 84, family: "objects" },
        { subfamily: "vehicle", label: "track", number: 21, family: "objects" },
        { subfamily: "machines", label: "camera", number: 217, family: "objects" },
        { subfamily: "domestic", label: "squeak", number: 511, family: "objects" },
        { subfamily: "domestic", label: "coin", number: 464, family: "objects" },
        { subfamily: "respiration", label: "sneeze", number: 100, family: "human" },
        { subfamily: "group", label: "applause", number: 22, family: "human" },
        { subfamily: "liquid", label: "liquid", number: 278, family: "objects" },
        { subfamily: "telephone", label: "alarm", number: 248, family: "objects" },
        { subfamily: "pets", label: "dog", number: 343, family: "animals" },
        { subfamily: "liquid", label: "drip", number: 353, family: "objects" },
        { subfamily: "voice", label: "yell", number: 236, family: "human" },
        { subfamily: "voice", label: "giggle", number: 115, family: "human" },
        { subfamily: "voice", label: "scream", number: 635, family: "human" },
        { subfamily: "pets", label: "howl", number: 187, family: "animals" }
    ];

    for (var entryCount = entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
    {
        var entry = entries[entryNo];

        //
        if (entry.family == "animals")
        {
            entry.fontColor = "#c7a82c";
        }
        else if(entry.family == "human")
        {
            entry.fontColor = "#274caa";
        }
        else if(entry.family == "objects")
        {
            entry.fontColor = "#c72c45";
        }
        else if(entry.family == "scifi")
        {
            entry.fontColor = "#75a727";
        }

        //
        if (entry.number < 100)
        {
            entry.fontSize = 10;
        }
        else if (entry.number < 300)
        {
            entry.fontSize = 15;
        }
        else if (entry.number < 500)
        {
            entry.fontSize = 20;
        }
        else // if (entry.number > 500)
        {
            entry.fontSize = 32;
        }

        entry.fontSize *= 1.25;

        //
        entry.onMousedown = function (i_event) {
            selectTag(this.label, i_event.button == 0 && !i_event.shiftKey);
        };
    }

    var settings = {
        entries: entries,
        width: "100%",
        height: "100%",
        radius: "70%",
        radiusMin: 75,
        bgDraw: true,
        bgColor: "transparent",
        opacityOver: 1.00,
        opacityOut: 0.8,
        opacitySpeed: 6,
        fov: 800,
        speed: 0.2,
        fontFamily: "Oswald, Arial, sans-serif",
        fontSize: "15",
        fontColor: "#fff",
        fontWeight: "normal", //bold
        fontStyle: "normal", //italic
        fontStretch: "normal", //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        fontToUpperCase: true
    };

    g_svg3DTagCloud = new Svg3dTagCloud(document.getElementById("tagCloud"), settings);
    /*
    document.body.onblur = function (i_event) {
        console.log('lama');
    } 
    svgElement.addEventListener('mouseout', function (i_event) {
        self.stopRotation();
    });

    document.addEventListener("visibilitychange", function (i_event) {
        console.log("chg: " + document.visibilityState);
    });
    */
} );
