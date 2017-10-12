
// + Playback {{{

g_audioContext = dan.snd.getAudioContext();

var g_showSequence = false;

function Sequencer(i_tempo)
// Params:
//  i_tempo:
//   Either (float number)
//    In beats per minute
//   or (null or undefined)
//    Use default of 120.
{
    // Apply default arguments
    if (i_tempo === null || i_tempo === undefined)
        i_tempo = 120;

    //
    this.playing = false;
    // (boolean)

    this.sequenceLength = 64;

    this.tempo = i_tempo;
    // (float number)
    // In beats per minute

    this.contextBufferTime = 0.1;
    // (float number)
    // Delay to add to the start time of scheduled sounds before sending them to the AudioContext.
    // If just trigger notes immediately from the JavaScript (set this to 0) then the timing is
    // audibly irregular.

    this.currentBeatNo = 0;
    // (integer number)

    this.currentBeatStartedAtTime;
    // The AudioContext currentTime at the time the current beat is/was instructed to
    // start playing (includes delay for browser jitter compensation)

    //
    this.tick = this.tick.bind(this);

    //
    this.closestSiteCount = 376;
}

Sequencer.prototype.setTempo = function (i_tempo)
// Params:
//  i_tempo:
//   (float number)
//   In beats per minute
{
    this.tempo = i_tempo;
};

// + + Transport {{{

Sequencer.prototype.start = function ()
// Start playing
{
    // Flag that we're playing
    this.playing = true;

    // Set transport position to the start and get a logical time for it
    this.currentBeatNo = 0;
    this.currentBeatStartTime = g_audioContext.currentTime + this.contextBufferTime;

    //
    this.tick();
};

Sequencer.prototype.stop = function ()
{
    this.playing = false;
};

Sequencer.prototype.togglePlay = function ()
{
    if (this.playing)
        this.stop();
    else
        this.start();
};

// + + }}}

// + + Query sound sites {{{

Sequencer.prototype._getClosestSoundSitesByKdTree = function (i_position, i_closestSiteCount)
{
    var nearestNeighbours = g_kdTree.nearest(i_position, i_closestSiteCount);

    //
    var closestSoundSites = [];
    for (var nearestNeighbourCount = nearestNeighbours.length, nearestNeighbourNo = 0; nearestNeighbourNo < nearestNeighbourCount; ++nearestNeighbourNo)
    {
        var nearestNeighbour = nearestNeighbours[nearestNeighbourNo];

        closestSoundSites.push({
            distance: nearestNeighbour[1],
            soundSite: nearestNeighbour[0].soundSite
        });
    }

    /*
    closestSoundSites = closestSoundSites.sort(function (i_a, i_b) {
        if (i_a.distance < i_b.distance)
            return -1;
        else if (i_a.distance > i_b.distance)
            return 1;
        else
            return 0;
    });
    */

    return closestSoundSites;
};

Sequencer.prototype._getClosestSoundSitesByBruteSearch = function (i_position, i_closestSiteCount)
{
    if (i_closestSiteCount > g_soundSites.length)
        i_closestSiteCount = g_soundSites.length;

    // For each sound site [TODO: that is currently playing or newly close]
    var closestSoundSites = [];
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        var d = soundSite.getPosition().distanceTo(i_position);
        // HACK
        if (d === undefined || d == 0)
            continue;

        closestSoundSites.push({
            soundSite: soundSite,
            distance: soundSite.getPosition().distanceTo(i_position)
        });
    }

    // Sort the above
    closestSoundSites = closestSoundSites.sort(function (i_a, i_b) {
        if (i_a.distance < i_b.distance)
            return -1;
        else if (i_a.distance > i_b.distance)
            return 1;
        else
            return 0;
    });

    // Truncate to the closest number we asked for
    closestSoundSites.length = i_closestSiteCount;

    //
    return closestSoundSites;
};

Sequencer.prototype.k_distanceAtWhichSoundIsSilent = 300;

Sequencer.prototype.distanceToGain = function (i_distance)
// Params:
//  i_distance:
//   (float number)
//
// Returns:
//  (float number)
{
    var closeness = (this.k_distanceAtWhichSoundIsSilent - i_distance) / this.k_distanceAtWhichSoundIsSilent;
    closeness = Math.max(closeness, 0);
    return closeness;
};

Sequencer.prototype.requery = function ()
{
    //var closestSoundSites = this._getClosestSoundSitesByBruteSearch(g_camera.position, this.closestSiteCount);
    var closestSoundSites = this._getClosestSoundSitesByKdTree(g_camera.position, this.closestSiteCount);

    // Sort in ascending distance order
    closestSoundSites = closestSoundSites.sort(function (i_a, i_b) {
        if (i_a.distance < i_b.distance)
            return -1;
        else if (i_a.distance > i_b.distance)
            return 1;
        else
            return 0;
    });

    // Calculate and save gains until they're far enough to be silent
    var audibleSoundSiteCount = closestSoundSites.length;
    for (var closestSoundSiteCount = closestSoundSites.length, closestSoundSiteNo = 0; closestSoundSiteNo < closestSoundSiteCount; ++closestSoundSiteNo)
    {
        var closestSoundSite = closestSoundSites[closestSoundSiteNo];

        var soundSite = closestSoundSite.soundSite;
        var distance = closestSoundSite.distance;

        // Choose gain according to distance,
        // and save it in the soundSite object
        soundSite.gain = this.distanceToGain(distance);
        if (soundSite.gain <= 0)
        {
            audibleSoundSiteCount = closestSoundSiteNo;
            break;
        }
    }

    // Truncate array to just the audible ones
    closestSoundSites.length = audibleSoundSiteCount;
    this.audibleSoundSites = closestSoundSites;
};

// + + }}}

Sequencer.prototype.tick = function ()
{
    if (!this.playing)
        return;

    // Convert beats per minute to seconds per beat,
    // then get the start time of the next beat
    var beatPeriod = 60.0/this.tempo;
    var nextBeatStartTime = this.currentBeatStartTime + beatPeriod;

    // If the time for the next beat has nearly arrived
    if (g_audioContext.currentTime + this.contextBufferTime >= nextBeatStartTime)
    {
        // Advance the overall beat counter
        ++this.currentBeatNo;
        if (this.currentBeatNo >= this.sequenceLength)
            this.currentBeatNo = 0;

        //console.log("sequencer beat: " + this.currentBeatNo.toString());

        // TODO: use 'audibleSoundSites' from the last call to requery() instead of requerying here

        var closestSoundSites = this._getClosestSoundSitesByKdTree(g_camera.position, this.closestSiteCount);
        //var closestSoundSites = this._getClosestSoundSitesByBruteSearch(g_camera.position, this.closestSiteCount);

        // For all of the closest sound sites, load samples or trigger sounds
        var closestSites = "";
        for (var closestSoundSiteCount = closestSoundSites.length, closestSoundSiteNo = 0; closestSoundSiteNo < closestSoundSiteCount; ++closestSoundSiteNo)
        {
            var closestSoundSite = closestSoundSites[closestSoundSiteNo];

            var soundSite = closestSoundSite.soundSite;
            var distance = closestSoundSite.distance;

            // Choose gain according to distance
            //var distance = soundSite.getPosition().distanceTo(g_camera.position);
            var gain = this.distanceToGain(distance);
            if (gain > 0)
            {
                if (!soundSite.audioBuffer)
                {
                    var k_lookaheadSteps = Math.ceil(this.tempo / 120 * 4);
                    for (var lookaheadStep = 0; lookaheadStep < k_lookaheadSteps; ++lookaheadStep)
                    {
                        var lookaheadBeatNo = (this.currentBeatNo + lookaheadStep) % this.sequenceLength;
                        if (soundSite.sequence[lookaheadBeatNo] === 1 || soundSite.sequence[lookaheadBeatNo] === true)
                            soundSite.loadSamplesIfNeeded();
                    }
                }
                else
                {
                    if (soundSite.sequence[this.currentBeatNo] === 1 || soundSite.sequence[this.currentBeatNo] === true)
                    {
                        closestSites += soundSite.soundId + ": " + soundSite.soundUrl + ", " + soundSite.sequence.toString() + "\n";
                        playNote(soundSite.audioBuffer, gain, nextBeatStartTime);
                        soundSite.lastTriggerTime = performance.now() / 1000;
                    }
                }
            }
        }

        //// Save for possible UI drawing
        //this.closestSoundSites = closestSoundSites;
        //document.body.querySelector("#infoText").innerText = closestSites;

        // For each part, advance its beat cursor
        /*
        var parts = g_song.parts;
        for (var partNo = 0; partNo < parts.length; ++partNo)
        {
            var part = parts[partNo];

            var wrapped = part.currentBeat.advanceToNextBeat();

            // This commented line...
            //part.linearCurrentBeat.advanceToNextBeat();
            // ... replaced with this equivalent for efficiency
            if (wrapped)
                part.linearCurrentBeat.beatNo = 0;
            else
                ++part.linearCurrentBeat.beatNo;

            //
            part.currentNote = -1;
        }
        */

        // Take on the next beat start time as current
        this.currentBeatStartTime = nextBeatStartTime;
    }

    // Do this again ASAP
    setTimeout(this.tick, 0);
};

Sequencer.prototype.save = function ()
{
    //var closestSoundSites = this._getClosestSoundSitesByBruteSearch(g_camera.position, this.closestSiteCount);
    var closestSoundSites = this._getClosestSoundSitesByKdTree(g_camera.position, this.closestSiteCount);

    //
    var notes = [];

    for (var beatNo = 0; beatNo < this.sequenceLength; ++beatNo)
    {
        var closestSites = "";

        for (var closestSoundSiteCount = closestSoundSites.length, closestSoundSiteNo = 0; closestSoundSiteNo < closestSoundSiteCount; ++closestSoundSiteNo)
        {
            var closestSoundSite = closestSoundSites[closestSoundSiteNo];

            var soundSite = closestSoundSite.soundSite;
            var distance = closestSoundSite.distance;

            if (soundSite.sequence[beatNo] === 1 || soundSite.sequence[beatNo] === true)
            {
                // Choose gain according to distance
                var gain = this.distanceToGain(distance);
                if (gain > 0)
                {
                    closestSites += soundSite.soundId + ": " + soundSite.soundUrl + ", " + soundSite.sequence.toString() + "\n";
                    notes.push([beatNo, soundSite.soundId, gain]);
                }
            }
        }
    }

    return notes;
};

// + + UI {{{

Sequencer.prototype.relayout = function ()
{
    // Config
    var margin = 10;
    var padding = 4;

    var idColumn_width = 60;
    var gainColumn_leftPadding = 8;
    var gainColumn_width = 40;

    //
    this.layout = {};

    //
    this.layout.gridSquareHeight = 20;
    this.layout.gridSquareWidth = (window.innerWidth - margin*2 - padding*2 - idColumn_width - (gainColumn_leftPadding+gainColumn_width)) / this.sequenceLength;
    if (this.layout.gridSquareWidth > 20)
        this.layout.gridSquareWidth = 20;

    //
    this.layout.backgroundRect = dan.math.Rect2.fromXYWH(margin, margin,
                                                         padding + idColumn_width + this.layout.gridSquareWidth * this.sequenceLength + gainColumn_leftPadding+gainColumn_width + padding,
                                                         padding + (this.audibleSoundSites.length + 1) * this.layout.gridSquareHeight + padding);

    if (window.innerWidth > this.layout.backgroundRect.width())
        this.layout.backgroundRect.moveByLeftTop([Math.floor((window.innerWidth - this.layout.backgroundRect.width()) / 2), 0]);

    // Sound ID column, width 60px
    this.layout.soundIdsHeaderRect = dan.math.Rect2.fromSS(dan.math.Vector2.add(this.layout.backgroundRect.leftTop(), [padding, padding]),
                                                           [idColumn_width, this.layout.gridSquareHeight]);
    this.layout.soundIdsRect = dan.math.Rect2.fromSS(this.layout.soundIdsHeaderRect.leftBottom(),
                                                     [idColumn_width, this.audibleSoundSites.length * this.layout.gridSquareHeight]);

    // Grid
    this.layout.gridHeaderRect = dan.math.Rect2.fromSS(this.layout.soundIdsHeaderRect.rightTop(),
                                                       [this.sequenceLength * this.layout.gridSquareWidth, this.layout.gridSquareHeight]);
    this.layout.gridRect = dan.math.Rect2.fromSS(this.layout.gridHeaderRect.leftBottom(),
                                                 [this.sequenceLength * this.layout.gridSquareWidth, this.audibleSoundSites.length * this.layout.gridSquareHeight]);

    // Gain column, width 80px
    this.layout.gainHeaderRect = dan.math.Rect2.fromSS(dan.math.Vector2.add(this.layout.gridHeaderRect.rightTop(), [gainColumn_leftPadding, 0]),
                                                       [gainColumn_width, this.layout.gridSquareHeight]);
    this.layout.gainRect = dan.math.Rect2.fromSS(this.layout.gainHeaderRect.leftBottom(),
                                                 [gainColumn_width, this.audibleSoundSites.length * this.layout.gridSquareHeight]);
};

Sequencer.prototype.draw = function ()
{
    var this_layout = this.layout;

    //
    var droidSansMono14TextureFont_xHeight = 8;
    var droidSansMono14TextureFont_yOffsetToAlignWithGridSquare = (this_layout.gridSquareHeight + droidSansMono14TextureFont_xHeight) / 2;

    //
    g_danCanvas.drawRectFill(this_layout.backgroundRect.leftTop(), this_layout.backgroundRect.size(), new dan.gfx.ColourRGBA(0, 0, 0, 0.5));

    // Headings
    g_danCanvas.drawTextT(g_droidSansMono14TextureFont, "ID", new dan.gfx.ColourRGBA(1, 1, 0, 1),
                          dan.math.Vector2.add(this_layout.soundIdsHeaderRect.leftTop(), [0, droidSansMono14TextureFont_yOffsetToAlignWithGridSquare]));
    g_danCanvas.drawTextT(g_droidSansMono14TextureFont, "Pattern", new dan.gfx.ColourRGBA(1, 1, 0, 1),
                          dan.math.Vector2.add(this_layout.gridHeaderRect.leftTop(), [0, droidSansMono14TextureFont_yOffsetToAlignWithGridSquare]));
    g_danCanvas.drawTextT(g_droidSansMono14TextureFont, "Gain", new dan.gfx.ColourRGBA(1, 1, 0, 1),
                          dan.math.Vector2.add(this_layout.gainHeaderRect.leftTop(), [0, droidSansMono14TextureFont_yOffsetToAlignWithGridSquare]));

    //
    for (var audibleSoundSiteCount = this.audibleSoundSites.length, audibleSoundSiteNo = 0; audibleSoundSiteNo < audibleSoundSiteCount; ++audibleSoundSiteNo)
    {
        var audibleSoundSite = this.audibleSoundSites[audibleSoundSiteNo];

        var soundSite = audibleSoundSite.soundSite;
        var distance = audibleSoundSite.distance;

        //
        var colour;
        if (soundSite.audioBuffer)
            colour = new dan.gfx.ColourRGBA(1, 1, 0, 1);
        else
            colour = new dan.gfx.ColourRGBA(1, 1, 0, 0.3);

        // For each beat
        for (var beatNo = 0; beatNo < this.sequenceLength; ++beatNo)
        {
            if (soundSite.sequence[beatNo] === 1 || soundSite.sequence[beatNo] === true)
            {
                g_danCanvas.drawCircleFill(dan.math.Vector2.add(this_layout.gridRect.leftTop(), [(beatNo + 0.5) * this_layout.gridSquareWidth, (audibleSoundSiteNo + 0.5) * this_layout.gridSquareHeight]),
                                           this_layout.gridSquareWidth / 2 - 2,
                                           colour);
            }
        }

        // ID
        g_danCanvas.drawTextT(g_droidSansMono14TextureFont, soundSite.soundId.toString(), new dan.gfx.ColourRGBA(1, 0, 1, 1),
                              dan.math.Vector2.add(this_layout.soundIdsRect.leftTop(), [0, audibleSoundSiteNo * this_layout.gridSquareHeight + droidSansMono14TextureFont_yOffsetToAlignWithGridSquare]));

        // Gain
        g_danCanvas.drawTextT(g_droidSansMono14TextureFont, soundSite.gain.toString().substr(0, 5), new dan.gfx.ColourRGBA(1, 0, 1, 1),
                              dan.math.Vector2.add(this_layout.gainRect.leftTop(), [0, audibleSoundSiteNo * this_layout.gridSquareHeight + this_layout.gridSquareHeight - 5]));
    }

    // Draw grid horizontal lines
    for (var audibleSoundSiteCount = this.audibleSoundSites.length, audibleSoundSiteNo = 0; audibleSoundSiteNo <= audibleSoundSiteCount; ++audibleSoundSiteNo)
    {
        g_danCanvas.drawLineStroke(dan.math.Vector2.add(this_layout.gridRect.leftTop(), [0, audibleSoundSiteNo * this_layout.gridSquareHeight]),
                                   dan.math.Vector2.add(this_layout.gridRect.leftTop(), [this.sequenceLength * this_layout.gridSquareWidth, audibleSoundSiteNo * this_layout.gridSquareHeight]),
                                   1, 0, new dan.gfx.ColourRGBA(1, 1, 0, 0.5));
    }
    // Draw grid vertical lines
    for (var beatNo = 0; beatNo <= this.sequenceLength; ++beatNo)
    {
        g_danCanvas.drawLineStroke(dan.math.Vector2.add(this_layout.gridRect.leftTop(), [beatNo * this_layout.gridSquareWidth, 0]),
                                   dan.math.Vector2.add(this_layout.gridRect.leftTop(), [beatNo * this_layout.gridSquareWidth, audibleSoundSiteCount * this_layout.gridSquareHeight]),
                                   1, 0, new dan.gfx.ColourRGBA(1, 1, 0, 0.5));
    }

    // Highlight column for current beat
    if (this.playing)
    {
        g_danCanvas.drawRectFill(dan.math.Vector2.add(this_layout.gridRect.leftTop(), [this.currentBeatNo * this_layout.gridSquareWidth, 0]),
                                 [this_layout.gridSquareWidth, audibleSoundSiteCount * this_layout.gridSquareHeight],
                                 new dan.gfx.ColourRGBA(0, 1, 1, 0.5));
    }

    //g_danCanvas.drawCircleFill([(beatNo + 0.5) * this_layout.gridSquareSize, (audibleSoundSiteNo + 0.5) * this_layout.gridSquareSize],
    //                           this_layout.gridSquareSize / 2, new dan.gfx.ColourRGBA(1, 1, 0, 1));
};

Sequencer.prototype.onMouseDown = function (i_event)
{
    var this_layout = this.layout;

    var mousePos = dan.math.Vector2.fromXY(i_event.pageX, i_event.pageY);

    if (this_layout.soundIdsRect.contains(mousePos))
    {
        var positionInSoundIdsRect = dan.math.Vector2.sub(mousePos, this_layout.soundIdsRect.leftTop());

        var audibleSoundSiteNo = Math.floor(positionInSoundIdsRect[1] / this_layout.gridSquareHeight);
        //g_scrollingLog.addText(this.audibleSoundSites[audibleSoundSiteNo].soundSite.soundId);
        g_autoFlyToSoundSite = this.audibleSoundSites[audibleSoundSiteNo].soundSite;

        g_showSequence = false;
    }
};

// + + }}}

function playNote(i_buffer,
                  //i_pan, i_panPositionX, i_panPositionY, i_panPositionZ,
                  //i_sendGain,
                  i_mainGain,
                  //i_cutoff, i_resonance,
                  i_startTime)
// Params:
//  i_buffer:
//   (AudioBuffer)
//  i_pan:
//   (bool)
//  i_panPositionX, i_panPositionY, i_panPositionZ:
//   (float number)
//   Coordinates in 3D space
//  i_sendGain:
//   (float number)
//   Gain for wet mix (including reverb)
//  i_mainGain:
//   (float number)
//   Gain for dry mix (skipping reverb)
//  i_cutoff:
//   (float number)
//   Filter cutoff frequency
//  i_resonance:
//   (float number)
//   Filter Q value
//  i_startTime:
//   (float number)
//   Time at which to start note, in seconds, relative to now.
{
    // Create the note
    var voice = g_audioContext.createBufferSource();  // (AudioBufferSourceNode)
    voice.buffer = i_buffer;

    //

    /*
    // Connect to filter
    //var hasBiquadFilter = g_audioContext.createBiquadFilter;
    //var filter = hasBiquadFilter ? g_audioContext.createBiquadFilter() : g_audioContext.createLowPass2Filter();
    var filter;
    if (g_audioContext.createBiquadFilter) {
        filter = g_audioContext.createBiquadFilter();
        filter.frequency.value = i_cutoff;
        filter.Q.value = i_resonance; // this is actually resonance in dB
    }
    else {
        filter = g_audioContext.createLowPass2Filter();
        filter.cutoff.value = i_cutoff;
        filter.resonance.value = i_resonance;
    }
    voice.connect(filter);

    // Optionally, connect to a panner
    var finalNode;
    if (i_pan) {
        var panner = g_audioContext.createPanner();
        panner.panningModel = "HRTF";
        panner.setPosition(i_panPositionX, i_panPositionY, i_panPositionZ);
        filter.connect(panner);
        finalNode = panner;
    }
    else {
        finalNode = filter;
    }
    */

    // Connect to dry mix
    var dryGainNode = g_audioContext.createGain();
    dryGainNode.gain.value = i_mainGain;
    voice.connect(dryGainNode);
    dryGainNode.connect(g_audioContext.destination);

    if (g_audioRecorder !== null)
        dryGainNode.connect(g_audioRecorder.mediaStreamDestination);
    /*
    // Connect to wet mix
    var wetGainNode = g_audioContext.createGain();
    wetGainNode.gain.value = i_sendGain;
    finalNode.connect(wetGainNode);
    wetGainNode.connect(g_convolver);
    */

    voice.start(i_startTime);
}

// + }}}

// + Recording {{{

function AudioRecorder()
{
    this.mediaStreamDestination = g_audioContext.createMediaStreamDestination();
    this.blobs = [];
}

AudioRecorder.prototype.start = function ()
{
    this.mediaRecorder = new MediaRecorder(this.mediaStreamDestination.stream);

    var me = this;
    this.mediaRecorder.ondataavailable = function (i_event) {
        me.blobs.push(i_event.data);
    };

    this.mediaRecorder.start();
}

AudioRecorder.prototype.stop = function ()
{
    var me = this;
    this.mediaRecorder.onstop = function (i_event) {
        var blob = new Blob(me.blobs, { "type": "audio/ogg; codecs=opus" });
        var url = URL.createObjectURL(blob);

        debugger;

        //var audioElement = new Audio();
        //audioElement.src = URL.createObjectURL(blob);

        var aElement = document.createElement("a");
        document.body.appendChild(aElement);
        //aElement.style = "display: none";
        aElement.href = url;
        aElement.download = "recording.opus";
        aElement.click();
        URL.revokeObjectURL(url);
    };

    this.mediaRecorder.stop();
}

var g_audioRecorder = null;

// + }}}
