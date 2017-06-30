
// + Configuration {{{

var k_soundSource = "index";
// (str)
// One of
//  "pattern"
//  "index"

var k_soundSource_pattern = "nobackup/previews/*.mp3";
// (str)
// Only applicable when k_soundSource == "pattern".
// Template to generate sound URLs. "*" will be replaced with the sound ID.

var k_soundSource_indexUrl = "metadata/freesound_infos_indexed.json";
// (str)
// Only applicable when k_soundSource == "index".
// URL of the index file.

// + }}}


var g_camera;
var g_scene;
var g_renderer;
var g_controls;

var g_raycaster;

// + Generating sequences {{{

Array.prototype.rotate = (function() {
    // save references to array functions to make lookup faster
    var push = Array.prototype.push,
        splice = Array.prototype.splice;

    return function(count) {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

        // convert count to value in range [0, len[
        count = ((count % len) + len) % len;

        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();

function generateSequence(i_length, i_oneEveryNSteps, i_individualHitChance, i_maxJitter, i_offset, i_linearRandomGeneratorFunc)
// Params:
//  i_length:
//   (integer number)
//  i_oneEveryNSteps:
//   (number)
//  i_individualHitChance:
//   (float number)
//  i_maxJitter:
//   (float number)
//  i_offset:
//   (integer number)
//  i_linearRandomGeneratorFunc:
//   Either (function)
//    Function has:
//     Params:
//      -
//     Returns:
//      (float number)
//      In half-open range [0 .. 1)
//   or (null or undefined)
//    Use default of Math.random()
//
// Returns:
//  (array of integer number)
//  The length of the array is i_length, and each element is either a 0 or 1.
{
    // Initialize array of desired length and fill with zeroes
    var sequence = new Array(i_length);
    for (var elementNo = 0; elementNo < sequence.length; ++elementNo)
    {
        sequence[elementNo] = 0;
    }

    //
    if (i_oneEveryNSteps == 0)
        return sequence;

    //
    for (var elementNo = 0; elementNo < sequence.length; elementNo += i_oneEveryNSteps)
    {
        var intElementNo = Math.round(elementNo);

        if (i_linearRandomGeneratorFunc() < i_individualHitChance)
        {
            var jitterAmount = Math.round((i_linearRandomGeneratorFunc() * 2 - 1) * i_maxJitter);

            var jitteredElementNo = dan.clockMod(intElementNo + jitterAmount, sequence.length);

            sequence[jitteredElementNo] = 1;
        }
    }

    //
    sequence = sequence.rotate(-i_offset);

    //
    return sequence;
}

// + }}}

// + Audio {{{

g_audioContext = dan.snd.getAudioContext();

function Sequencer(i_tempo)
// Params:
//  i_tempo:
//   (float number)
//   In beats per minute
{
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

        console.log("sequencer beat: " + this.currentBeatNo.toString());

        var closestSoundSites = this._getClosestSoundSitesByKdTree(g_camera.position, this.closestSiteCount);
        //var closestSoundSites = this._getClosestSoundSitesByBruteSearch(g_camera.position, this.closestSiteCount);

        // For all of the closest sound sites, load samples or trigger sounds
        var closestSites = "";
        for (var closestSoundSiteCount = closestSoundSites.length, closestSoundSiteNo = 0; closestSoundSiteNo < closestSoundSiteCount; ++closestSoundSiteNo)
        {
            var closestSoundSite = closestSoundSites[closestSoundSiteNo];

            var soundSite = closestSoundSite.soundSite;
            var distance = closestSoundSite.distance;

            if (soundSite.sequence[this.currentBeatNo] === 1 || soundSite.sequence[this.currentBeatNo] === true)
            {
                // Choose gain according to distance
                var distance = soundSite.getPosition().distanceTo(g_camera.position);

                var closeness = (k_distanceAtWhichSoundIsSilent - distance) / k_distanceAtWhichSoundIsSilent;
                closeness = Math.max(closeness, 0);

                if (closeness > 0)
                {
                    if (!soundSite.audioBuffer)
                    {
                        soundSite.loadSamplesIfNeeded();
                        // TODO: still trigger the first sound if it loads in time
                    }
                    else
                    {
                        closestSites += soundSite.soundId + ": " + soundSite.soundUrl + ", " + soundSite.sequence.toString() + "\n";
                        playNote(soundSite.audioBuffer, closeness, nextBeatStartTime);
                        soundSite.lastTriggerTime = performance.now() / 1000;
                    }
                }
            }
        }

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
    var soundSiteDistances = closestSoundSites;

    // Convert beats per minute to seconds per beat,
    // then get the start time of the next beat
    var beatPeriod = 60.0/this.tempo;
    var nextBeatStartTime = this.currentBeatStartTime + beatPeriod;

    //
    var notes = [];

    for (var beatNo = 0; beatNo < this.sequenceLength; ++beatNo)
    {
        var closestSites = "";

        // For the closest few [shouldn't the next line be Math.min?...]
        for (var closestSoundSiteCount = closestSoundSites.length, closestSoundSiteNo = 0; closestSoundSiteNo < closestSoundSiteCount; ++closestSoundSiteNo)
        {
            var closestSoundSite = closestSoundSites[closestSoundSiteNo];

            var soundSite = closestSoundSite.soundSite;
            var distance = closestSoundSite.distance;

            if (soundSite.sequence[beatNo] === 1 || soundSite.sequence[beatNo] === true)
            {
                // Choose gain according to distance
                var distance = soundSite.getPosition().distanceTo(g_camera.position);

                var closeness = (k_distanceAtWhichSoundIsSilent - distance) / k_distanceAtWhichSoundIsSilent;
                closeness = Math.max(closeness, 0);

                if (closeness > 0)
                {
                    closestSites += soundSite.soundId + ": " + soundSite.soundUrl + ", " + soundSite.sequence.toString() + "\n";
                    notes.push([beatNo, soundSite.soundId, closeness]);
                }
            }
        }
    }

    return notes;
};

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

// + Audio recording {{{

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

function lowTendingRandom(i_power, i_linearRandomGeneratorFunc)
// Params:
//  i_power:
//   (number)
//  i_linearRandomGeneratorFunc:
//   Either (function)
//    Function has:
//     Params:
//      -
//     Returns:
//      (float number)
//      In half-open range [0 .. 1)
//   or (null or undefined)
//    Use default of Math.random()
//
// FIXME:
//  If i_power is high, 
{
    if (i_linearRandomGeneratorFunc === null || i_linearRandomGeneratorFunc === undefined)
        i_linearRandomGeneratorFunc = Math.random;

    return Math.pow(i_linearRandomGeneratorFunc(), i_power);
}

function highTendingRandom(i_power, i_linearRandomGeneratorFunc)
// Params:
//  i_power:
//   (number)
//  i_linearRandomGeneratorFunc:
//   Either (function)
//    Function has:
//     Params:
//      -
//     Returns:
//      (float number)
//      In half-open range [0 .. 1)
//   or (null or undefined)
//    Use default of Math.random()
{
    return 1 - Number.EPSILON - lowTendingRandom(i_power, i_linearRandomGeneratorFunc);
}

function map01ToRange(i_value,
                      i_toStart, i_toEnd)
// Params:
//  i_value:
//   (number)
//  i_toStart, i_toEnd
//   (number)
//
// Returns:
//  (float number)
//  In half-open range [i_toStart .. i_toEnd)
{
    return (i_value * (i_toEnd - i_toStart)) + i_toStart;
};

// + Sound site {{{

var k_distanceAtWhichSoundIsSilent = 300;
var g_showSoundSiteRanges = false;

function SoundSite(i_audioContext,
                   i_dataPoint,
                   i_url,
                   i_position,
                   i_soundSiteNo)
// Params:
//  i_audioContext:
//   (AudioContext)
//  i_url:
//   (string)
//  i_position:
//   (THREE.Vector3)
//  i_soundSiteNo:
//   (integer number)
{
    this.m_audioContext = i_audioContext;
    this.dataPoint = i_dataPoint;
    this.soundId = i_dataPoint.id;
    this.soundUrl = i_url;
    this.position = i_position;
    this.soundSiteNo = i_soundSiteNo;

    this.lastTriggerTime = 0;

    //
    var localRandom = new Math.seedrandom(this.soundId);

    // Sequence
    //this.sequence = bjorklund(64, 3);
    /*
    this.sequence = [
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false
    ];
    */

    var sequence_oneEveryNSteps = Math.pow(2, Math.floor(map01ToRange(highTendingRandom(3, localRandom), 1, 7)));

    var sequence_individualHitChance = 0.8;

    var sequence_maxJitter = map01ToRange(lowTendingRandom(3, localRandom), 0, 3);

    var sequence_offset = map01ToRange(lowTendingRandom(3, localRandom), 0, 2);

    this.sequence = generateSequence(64, sequence_oneEveryNSteps, sequence_individualHitChance, sequence_maxJitter, sequence_offset, localRandom);

    //// Graphic object
    //this.mesh = new THREE.Mesh(i_geometry, i_material);
    //this.mesh.position.x = positionX;
    //this.mesh.position.y = positionY;
    //this.mesh.position.z = positionZ;

    // [o_... assignments moved away from here]

    //this.rangeSphereGeometry = new THREE.SphereGeometry(k_distanceAtWhichSoundIsSilent, 32, 32);
    //var material = new THREE.MeshBasicMaterial({color: 0xffff88});
    //material.wireframe = true;
    //this.rangeSphereMesh = new THREE.Mesh(this.rangeSphereGeometry, material);
    //this.rangeSphereMesh.position.x = this.mesh.position.x;
    //this.rangeSphereMesh.position.y = this.mesh.position.y;
    //this.rangeSphereMesh.position.z = this.mesh.position.z;
}

SoundSite.prototype.loadSamplesIfNeeded = function (i_onReady)
// Params:
//  i_onReady:
//   Either (function)
//    Called back when the sound file has loaded and is ready to be played.
//   or (null or undefined)
//    Don't get a callback.
{
    if (this.loadSamplesStarted)
        return;
    this.loadSamplesStarted = true;

    console.log("loadSamplesIfNeeded: " + this.soundId);

    //
    var me = this;

    // Load sound from URL
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.soundUrl);
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE)
        {
            g_audioContext.decodeAudioData(xhr.response, function (i_decodedBuffer)
            // Params:
            //  i_decodedBuffer:
            //   (AudioBuffer)
            {
                me.audioBuffer = i_decodedBuffer;

                // Save the sample count for later use maybe
                //me.sampleCount = i_decodedBuffer.length;

                // Make an AudioBufferSourceNode for playing the sound
                me.audioSourceNode = g_audioContext.createBufferSource();  // (AudioBufferSourceNode)
                me.audioSourceNode.buffer = i_decodedBuffer;

                // Make a GainNode for volume control
                me.gainNode = me.m_audioContext.createGain();
                me.audioSourceNode.connect(me.gainNode);

                //
                me.gainNode.connect(me.m_audioContext.destination);

                //
                if (i_onReady)
                    i_onReady();

                //// PROTOTYPE: Start the sound playing in an endless loop (though muted)
                //me.audioSourceNode.loop = true;
                //me.audioSourceNode.loopStart = 0;
                ////console.log(me.sampleCount / i_decodedBuffer.sampleRate);
                ////me.audioSourceNode.loopEnd = me.sampleCount / i_decodedBuffer.sampleRate;
                //me.gainNode.gain.value = 0;
                //me.start();
            });
        }
    };
    xhr.send();
}

function loadSamples2()
{
    me.audioMediaElement = new Audio(i_url);

    // Create a MediaElementAudioSourceNode to draw from the above Audio node
    me.audioSourceNode = g_audioContext.createMediaElementSource(this.audioMediaElement);

    // Make a GainNode for volume control
    me.gainNode = me.m_audioContext.createGain();
    me.audioSourceNode.connect(me.gainNode);

    //
    me.gainNode.connect(me.m_audioContext.destination);

    //
    if (i_onReady)
        i_onReady();

    // PROTOTYPE: Start the sound playing in an endless loop (though muted)
    me.audioSourceNode.loop = true;
    me.audioSourceNode.loopStart = 0;
    //console.log(me.sampleCount / i_decodedBuffer.sampleRate);
    //me.audioSourceNode.loopEnd = me.sampleCount / i_decodedBuffer.sampleRate;
    me.gainNode.gain.value = 0;
    me.start();
}

// + + Sound controls {{{

SoundSite.prototype.start = function ()
{
    if (this.audioSourceNode.constructor === AudioBufferSourceNode)
    {
        this.audioSourceNode.start(0);
    }
    else if (this.audioSourceNode.constructor === MediaElementAudioSourceNode)
    {
        this.audioMediaElement.play();
    }
};

SoundSite.prototype.stop = function ()
{
    this.audioSourceNode.stop();
};

SoundSite.prototype.setGain = function (i_gain)
// Params:
//  i_gain:
//   (float number)
//   Gain in range [0 .. 1]
{
    // Defensive measure to do nothing if this is called before the sound has loaded and the GainNode has been created
    if (!this.gainNode)
        return;

    //
    this.gainNode.gain.value = i_gain;
};

// + + }}}

// + + Graphic object {{{

SoundSite.prototype.getMesh = function ()
// Get the graphic object representation of this SoundSite.
// You should add this to your Three.js scene with scene.add().
//
// Returns:
//  (THREE.Mesh)
{
    return this.mesh;
};

SoundSite.prototype.addGraphicObjectsToScene = function (i_scene)
// Params:
//  i_scene:
//   (THREE.Scene)
//   Three.js scene for this sound site to add graphic objects to.
//
// Returns:
//  -
{
    i_scene.add(this.mesh);
    //i_scene.add(this.rangeSphereMesh);
};

// + + }}}

SoundSite.prototype.getPosition = function ()
// Get the position of this SoundSite.
//
// Returns:
//  (THREE.Vector3)
{
    // Use 'position' in the graphic object as the canonical store of the SoundSite's position for now
    return new THREE.Vector3(
        g_bufferGeometry_positions[this.soundSiteNo*3 + 0],
        g_bufferGeometry_positions[this.soundSiteNo*3 + 1],
        g_bufferGeometry_positions[this.soundSiteNo*3 + 2]
    );
};

// + + SoundSite instances {{{

var g_soundSites = [];
var g_soundSites_flatVertices = null;  // (Float32Array)

function findSoundSitesOwningMeshes(i_meshes)
{
    var soundSites = [];

    for (var meshCount = i_meshes.length, meshNo = 0; meshNo < meshCount; ++meshNo)
    {
        var mesh = i_meshes[meshNo];

        for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
        {
            var soundSite = g_soundSites[soundSiteNo];
            if (soundSite.mesh === mesh)
                soundSites.push(soundSite);
        }
    }

    return soundSites;
}

// + + }}}

// + }}}

// + Scrolling log {{{

// + + Construction {{{

function ScrollingLog()
{
    this.rootDomElement = document.createElement("div");
    this.rootDomElement.setAttribute("id", "scrollingLog");

    this.rootDomElement.style.position = "fixed";
    this.rootDomElement.style.top = "0";
    this.rootDomElement.style.bottom = "0";
    this.rootDomElement.style.left = "0";
    this.rootDomElement.style.right = "0";
    //this.rootDomElement.style.border = "3px solid red";
    this.rootDomElement.style.padding = "4px";
    this.rootDomElement.style.color = "#f00";
    this.rootDomElement.style.textShadow = "1px 1px 1px rgba(0, 0, 0, 0.5)";
    this.rootDomElement.style.fontWeight = "bold";
    this.rootDomElement.style.backgroundColor = "transparent";
    //this.rootDomElement.style.overflowY = "scroll";

    this.rootDomElement.style.pointerEvents = "none";

    // Show first element at bottom
    this.rootDomElement.style.display = "flex";
    this.rootDomElement.style.flexDirection = "column-reverse";

    // Default time in seconds for each log element to remain visible for
    this.timeout = 3;

    //
    this.entries = [];
}

// + + }}}

// + + Root DOM element {{{

ScrollingLog.prototype.getRootDomElement = function ()
{
    return this.rootDomElement;
};

// + + }}}

// + + Add entries {{{

ScrollingLog.prototype.addText = function (i_text, i_timeout)
// Params:
//  i_text:
//   (string)
//  i_timeout:
//   Either (float number)
//    Time in seconds from now after which the log element should be removed (by removeTimedOutEntries()).
//    Infinity: Don't automatically remove.
//   or (null or undefined)
//    Use the default timeout (as set in constructor).
{
    // Apply default arguments
    if (i_timeout === null || i_timeout === undefined)
        i_timeout = this.timeout;

    // Create DOM element, containing text
    var domElement = document.createElement("div");
    domElement.appendChild(document.createTextNode(i_text));

    // Create an entry, with its timeout
    this.entries.push([performance.now() / 1000 + i_timeout, domElement]);

    // Add DOM element
    // and scroll to bottom
    this.rootDomElement.insertBefore(domElement, this.rootDomElement.firstChild);
    this.rootDomElement.scrollTop = this.rootDomElement.scrollHeight;
};

// + + }}}

ScrollingLog.prototype.resetEntryTimeouts = function (i_timeout)
// Params:
//  i_timeout:
//   Either (float number)
//    Time in seconds from now after which all existing log elements should be removed (by removeTimedOutEntries()).
//    Infinity: Don't automatically remove.
//   or (null or undefined)
//    Use the default timeout (as set in constructor).
{
    // Apply default arguments
    if (i_timeout === null || i_timeout === undefined)
        i_timeout = this.timeout;

    //
    for (var entryCount = this.entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
    {
        this.entries[entryNo][0] = performance.now() / 1000 + i_timeout;
    }
};

ScrollingLog.prototype.removeTimedOutEntries = function ()
// Typically to be called from the animation loop.
{
    var currentTime = performance.now() / 1000;
    var entryNo = 0;
    while (entryNo < this.entries.length)
    {
        var entry = this.entries[entryNo];

        if (currentTime >= entry[0])
        {
            this.rootDomElement.removeChild(entry[1]);
            this.entries.splice(entryNo, 1);
        }
        else
        {
            ++entryNo;
        }
    }
};

ScrollingLog.prototype.removeAllEntries = function ()
{
    // Clear entries array
    this.entries.length = 0;

    // Remove log elements from DOM
    while (this.rootDomElement.lastChild)
    {
        this.rootDomElement.removeChild(this.rootDomElement.lastChild);
    }
};

// + }}}

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var g_mousePositionInViewport = [0, 0];
var g_mousePositionInViewport_normalized = [0, 0];
function body_onMouseMove(i_event)
{
    // Get mouse position relative to top-left of g_viewportDiv
    var boundingClientRect = g_viewportDiv.getBoundingClientRect();
    g_mousePositionInViewport = [i_event.clientX - boundingClientRect.left, i_event.clientY - boundingClientRect.top];
    g_mousePositionInViewport_normalized = [g_mousePositionInViewport[0] / boundingClientRect.width * 2 - 1,
                                            g_mousePositionInViewport[1] / boundingClientRect.height * 2 - 1];
}

var g_sequencer;

function init()
{
    g_tagsStr = dan.getParameterValueFromQueryString("tags");
    var tags = g_tagsStr.split("+");

    var tempo = dan.getParameterValueFromQueryString("bpm");
    if (tempo != "")
        tempo = parseInt(tempo);
    else
        tempo = 120;

    g_sequencer = new Sequencer(tempo);

    g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    // Make a scene graph
    g_scene = new THREE.Scene();

    // Add fog
    //g_scene.fog = new THREE.Fog(0xffffff, 0, 750);

    // Load a skybox and apply it to the scene as background
    //var cubeTextureLoader = new THREE.CubeTextureLoader();
    //cubeTextureLoader.setPath('textures/cube/skybox/');
    //var cubeTexture = cubeTextureLoader.load([
    //    'px.jpg', 'nx.jpg',
    //    'py.jpg', 'ny.jpg',
    //    'pz.jpg', 'nz.jpg',
    //]);
    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('textures/cube/MilkyWay/');
    var cubeTexture = cubeTextureLoader.load([
        'dark-s_px.jpg', 'dark-s_nx.jpg',
        'dark-s_py.jpg', 'dark-s_ny.jpg',
        'dark-s_pz.jpg', 'dark-s_nz.jpg',
    ]);
    g_scene.background = cubeTexture;

    //
    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    g_scene.add(light);

    var infoTextDiv = document.createElement("div");
    infoTextDiv.setAttribute("id", "infoText");
    document.body.appendChild(infoTextDiv);

    g_scrollingLog = new ScrollingLog();
    document.body.appendChild(g_scrollingLog.getRootDomElement());
    /*
    var n = 0;
    function addTestLog()
    {
        g_scrollingLog.addText("hello " + n.toString());
        ++n;
        if (n < 50)
            setTimeout(addTestLog, 50);
    }
    addTestLog();
    */

    g_viewportDiv = document.createElement("div");
    document.body.appendChild(g_viewportDiv);
    document.body.addEventListener("mousemove", body_onMouseMove);

    //g_controls = new THREE.PointerLockControls(g_camera);
    g_controls = new THREE.FlyControls(g_camera, g_viewportDiv);
    g_controls.movementSpeed = 1000;
    g_controls.domElement = g_viewportDiv;
    g_controls.rollSpeed = Math.PI / 4;
    g_controls.autoForward = false;
    g_controls.dragToLook = true;
    //g_scene.add(g_controls.getObject());


    var onKeyDown = function (event) {
        switch (event.keyCode)
        {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;

        case 37: // left
        case 65: // a
            moveLeft = true; break;

        case 40: // down
        case 83: // s
            moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            break;

        case 32: // space
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;

        case 71: // g
            g_showSoundSiteRanges = !g_showSoundSiteRanges;
            break;

        case 67: // c
            if (g_audioRecorder === null)
            {
                g_scrollingLog.addText("Starting audio capture. Press C again to stop/save.");
                g_audioRecorder = new AudioRecorder();
                g_audioRecorder.start();
            }
            else
            {
                g_audioRecorder.stop();
                g_audioRecorder = null;
            }
            break;

        case 80: // p
            event.preventDefault();
            dan.gui.html.PopupTextarea(
                [70, 70], "%", "Current sequence:",
                "// This is a JSON array,\n" +
                "// where each element is itself an array with elements:\n" +
                "//  0: (integer number) sequencer pattern step number, in range [0 .. " + (g_sequencer.sequenceLength - 1).toString() + ")\n" +
                "//  1: (string) Freesound sound ID\n" +
                "//  2: (float number) gain of sound, in range [0 .. 1]\n" +
                "\n" +
                JSON.stringify(g_sequencer.save()).replace("[[", "[\n[").replace("]]", "]\n]").replace(/\],\[/g, "], ["),
                [
                    ["OK", function (i_buttonNo, i_value, i_event) {
                        return true;
                    }, [13, 27]],
                ],
                true);
        }
    };

    var onKeyUp = function (event) {
        switch (event.keyCode)
        {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;

        case 37: // left
        case 65: // a
            moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            break;
        }
    };

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    g_raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 1000);
    //g_raycaster = new THREE.Raycaster();

    // PROTOTYPE:
    // Create a box geometry that will be shared by all the sound sites
    g_soundSiteGeometry = new THREE.BoxGeometry(20, 20, 20);
    for (var faceCount = g_soundSiteGeometry.faces.length, faceNo = 0; faceNo < faceCount; ++faceNo)
    {
        var face = g_soundSiteGeometry.faces[faceNo];

        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    }

    //
    continueInit();
}

var g_kdTree = null;

function buildTreeOfSoundSites()
{
    // + k-d tree {{{
    // To make the nearest neighbour search faster

    /* // THREE.TypedArrayUtils.Kdtree implementation

    // Get sound site positions in flat array
    var soundSitePositions = new Float32Array(g_soundSites.length * 3);
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        var soundSitePosition = soundSite.getPosition();
        soundSitePositions[soundSiteNo*3 + 0] = soundSitePosition.x;
        soundSitePositions[soundSiteNo*3 + 1] = soundSitePosition.y;
        soundSitePositions[soundSiteNo*3 + 2] = soundSitePosition.z;
    }

    // Time the tree creation because it takes a while
    var measureStart = new Date().getTime();

    // Create k-d tree over all our world-space points in 3D with an appropriate distance-measuring function
    var distanceFunction = function (a, b)
    // Calculate straight-line distance but don't bother with square root, which isn't needed for comparions
    {
        return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2);
    };
    g_kdTree = new THREE.TypedArrayUtils.Kdtree(soundSitePositions, distanceFunction, 3);

    */

    // Get sound site positions in array of objects
    var soundSitePositions = [];
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        var soundSitePosition = soundSite.getPosition()
        soundSitePositions.push({
            soundSite: soundSite,
            x: soundSitePosition.x,
            y: soundSitePosition.y,
            z: soundSitePosition.z
        });
    }

    // Time the tree creation because it takes a while
    var measureStart = new Date().getTime();

    // Create k-d tree over all our world-space points in 3D with an appropriate distance-measuring function
    var distanceFunction = function (a, b)
    // Calculate straight-line distance but don't bother with square root, which isn't needed for comparions
    {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
    };
    g_kdTree = new kdTree(soundSitePositions, distanceFunction, ["x", "y", "z"]);


    console.log('TIME building kdtree', new Date().getTime() - measureStart);

    // + }}}
}

function continueInit()
{
    //
    g_renderer = new THREE.WebGLRenderer();
    g_renderer.setClearColor(0xffffff);
    g_renderer.setPixelRatio(window.devicePixelRatio);
    g_renderer.setSize(window.innerWidth, window.innerHeight);
    g_viewportDiv.appendChild(g_renderer.domElement);

    //
    window.addEventListener("resize", onWindowResize, false);

    //
    /*
    loadResultsOfFreesoundSearchIntoSoundSites("dogs", function () {
        buildTreeOfSoundSites();

        startMainLoop();
    });
    */

    // + Asset loading {{{

    function loaderLog(i_msg)
    {
        console.log("loaderLog: " + i_msg);
        g_scrollingLog.addText(i_msg);
    }
    //
    var assetEventCount = 0;
    var assetEventDoneCount = 0;

    function loadWithLog(i_loaderObject, i_loadMethod, i_url, i_key)
    {
        ++assetEventCount;

        i_loadMethod.call(i_loaderObject, i_url, i_key).promise.then(function (i_asset, i_url, i_key) {
            ++assetEventDoneCount;
            var assetEventDoneNote = "(" + assetEventDoneCount.toString() + "/" + assetEventCount.toString() + ")";
            //setProgress(assetEventDoneCount / assetEventCount);

            loaderLog(assetEventDoneNote + " Loaded " + i_url);
        },
        function (i_errorDescription, i_url, i_key) {
            ++assetEventDoneCount;
            var assetEventDoneNote = "(" + assetEventDoneCount.toString() + "/" + assetEventCount.toString() + ")";
            //setProgress(assetEventDoneCount / assetEventCount);

            loaderLog(assetEventDoneNote + " FAILED to load " + i_url + ", error description: " + i_errorDescription);
        });
    }

    g_assetLoader = new dan.loaders.AssetLoader();

    g_scrollingLog.addText("Loading...");

    loadWithLog(g_assetLoader, g_assetLoader.loadTexture, "sprites/shapes.png", "shapes");

    loadWithLog(g_assetLoader, g_assetLoader.loadJson, "http://54.215.134.50:5000/tsne?tags=" + g_tagsStr, "points");
    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "http://ec2-54-215-134-50.us-west-1.compute.amazonaws.com:5000/tsne?tags=" + g_tagsStr, "points");
    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/tsne_splash.json", "points");
    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/27k_collection.json", "points");

    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/tag_summary.json", "tag_summary");
    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/tags_to_ids.json", "tags_to_ids");
    loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/freesound_tags_indexed.json", "freesound_tags_indexed");

    if (k_soundSource == "index")
        loadWithLog(g_assetLoader, g_assetLoader.loadJson, k_soundSource_indexUrl, "sound_index");

    g_assetLoader.all().then(assetLoader_onAll);

    // + }}}
}

function assetLoader_onAll()
{
    //g_fullScreenFragmentShader = new FullScreenFragmentShader();

    // + Count data points in loaded JSON {{{

    var dataPointCount;

    // If points loaded and converted from JSON are in format where the top-level of the structure is an array,
    // count them as you do for an array
    if (g_assetLoader.loaded["points"].constructor === Array)
    {
        dataPointCount = g_assetLoader.loaded["points"].length;
    }
    // Else if points loaded and converted from JSON are in format where the top-level of the structure is an object,
    // count them as you do for an object
    else if (g_assetLoader.loaded["points"].constructor === Object)
    {
        dataPointCount = Object.keys(g_assetLoader.loaded["points"]).length;
    }
    // Else if points loaded and converted from JSON are in some other format,
    // abort with error
    else
    {
        g_scrollingLog.addText("Loaded points aren't in either array or object format! Giving up.");
        throw "Loaded points aren't in either array or object format! Giving up.";
    }

    // + }}}

    // + Load data points {{{

    //
    var coordinateExpansionFactor = 20;
    function loadSourcePoint(i_point)
    {
        var soundUrl;
        switch (k_soundSource)
        {
        case "pattern":
            soundUrl = k_soundSource_pattern.replace("*", i_point.id);
            break;
        case "index":
            if (!(i_point.id in g_assetLoader["loaded"]["sound_index"]))
            {
                console.log("Don't have a sound_index entry for " + i_point.id.toString() + " so don't know URL, skipping");
                return;
            }
            soundUrl = g_assetLoader["loaded"]["sound_index"][i_point.id]["url"];
            break;
        }

        //
        var soundSite = new SoundSite(g_audioContext, i_point,
                                      soundUrl,
                                      new THREE.Vector3(i_point.x * coordinateExpansionFactor, i_point.y * coordinateExpansionFactor, i_point.z * coordinateExpansionFactor),
                                      //i_point.r, i_point.g, i_point.b,
                                      //i_point.onset_times?
                                      //i_point.r?
                                      g_soundSites.length);
        g_soundSites.push(soundSite);
    }

    // If points loaded and converted from JSON are in format where the top-level of the structure is an array,
    // iterate them as you do for an array
    if (g_assetLoader.loaded["points"].constructor === Array)
    {
        for (var dataPointNo = 0; dataPointNo < dataPointCount; ++dataPointNo)
        {
            var point = g_assetLoader.loaded["points"][dataPointNo];
            loadSourcePoint(point);
        }
    }
    // Else if points loaded and converted from JSON are in format where the top-level of the structure is an object,
    // iterate them as you do for an object
    else if (g_assetLoader.loaded["points"].constructor === Object)
    {
        for (var dataPointId in g_assetLoader.loaded["points"])
        {
            var point = g_assetLoader.loaded["points"][dataPointId];
            point.id = dataPointId;
            loadSourcePoint(point);
        }
    }

    //if (g_soundSites.length > 20000)
    //    debugger;

    // + + Fill vertex arrays {{{

    g_bufferGeometry_positions = new Float32Array(g_soundSites.length * 3);
    g_bufferGeometry_glows = new Float32Array(g_soundSites.length);
    g_bufferGeometry_colours = new Float32Array(g_soundSites.length * 4);
    g_bufferGeometry_spriteUvs = new Float32Array(g_soundSites.length * 2);

    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        g_bufferGeometry_positions[soundSiteNo*3 + 0] = soundSite.position.x;
        g_bufferGeometry_positions[soundSiteNo*3 + 1] = soundSite.position.y;
        g_bufferGeometry_positions[soundSiteNo*3 + 2] = soundSite.position.z;
        g_bufferGeometry_glows[soundSiteNo] = 0;

        g_bufferGeometry_colours[soundSiteNo*4 + 0] = soundSite.dataPoint.r;
        g_bufferGeometry_colours[soundSiteNo*4 + 1] = soundSite.dataPoint.g;
        g_bufferGeometry_colours[soundSiteNo*4 + 2] = soundSite.dataPoint.b;
        g_bufferGeometry_colours[soundSiteNo*4 + 3] = 1.0;

        var firstFamily = g_assetLoader.loaded["freesound_tags_indexed"][soundSite.soundId]["families"][0];
        switch (firstFamily)
        {
        case "human":
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 0] = 0.0;
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 1] = 0.0;
            break;
        case "objects":
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 0] = 0.5;
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 1] = 0.0;
            break;
        case "scifi":
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 0] = 0.0;
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 1] = 0.5;
            break;
        case "animals":
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 0] = 0.5;
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 1] = 0.5;
            break;
        default:
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 0] = 0.0;
            g_bufferGeometry_spriteUvs[soundSiteNo*2 + 1] = 0.0;
            break;
        }
    }

    // + + }}}

    //
    buildTreeOfSoundSites();

    // + }}}

    // + Create custom shader for points, that draws from crate texture {{{

    //var imagePreviewTexture = g_assetLoader.loadTexture("textures/crate.gif", "crate").asset;
    //var imagePreviewTexture = textureLoader.load("textures/crate.gif");
    var imagePreviewTexture = g_assetLoader.loaded["shapes"];
    imagePreviewTexture.minFilter = THREE.LinearMipMapLinearFilter;
    imagePreviewTexture.magFilter = THREE.LinearFilter;

    var pointShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_texture1: { value: imagePreviewTexture },
            u_zoom: { value: 9.0 }  // not used
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        transparent: true
        //depthTest: false
    });

    // + }}}

    // + Create points in a BufferGeometry {{{

    // Make a THREE.BufferGeometry that contains 'position' and 'alpha' vertex attributes,
    // with the components of those things split and flattened into typed arrays

    g_bufferGeometry = new THREE.BufferGeometry();

    g_bufferGeometry.addAttribute('position', new THREE.BufferAttribute(g_bufferGeometry_positions, 3));
    g_bufferGeometry.addAttribute('a_glow', new THREE.BufferAttribute(g_bufferGeometry_glows, 1));
    g_bufferGeometry.addAttribute('a_colour', new THREE.BufferAttribute(g_bufferGeometry_colours, 4));
    g_bufferGeometry.addAttribute('a_spriteUv', new THREE.BufferAttribute(g_bufferGeometry_spriteUvs, 2));

    // Make a renderable THREE.Points object that uses the above buffer geometry
    var points = new THREE.Points(g_bufferGeometry, pointShaderMaterial);

    // Add point objects to scene
    g_scene.add(points);

    // + }}}

    g_scrollingLog.addText("... ready!");
    g_scrollingLog.resetEntryTimeouts();
    startMainLoop();
}

function startMainLoop()
{
    g_sequencer.start();

    // Explicitly unsuspend AudioContext, required on some browsers eg. OS X Safari
    if (g_audioContext.state != "running")
    {
        console.log("Resuming initially suspended AudioContext");
        g_audioContext.resume();
    }

    // Trigger first frame
    animate();
}

function onWindowResize()
{
    g_camera.aspect = window.innerWidth / window.innerHeight;
    g_camera.updateProjectionMatrix();

    g_renderer.setSize(window.innerWidth, window.innerHeight);
}

function setGainOfSoundSitesByCameraProximity()
{
    // For each sound site, get distance from camera,
    // and if close enough then load/start the sound playing if necessary,
    // and adjust gain based on closeness
    var currentlyPlayingSites = [];

    /*
    // Implementation: find neighbours by brutely iterating through every sound site

    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        var distance = soundSite.getPosition().distanceTo(g_camera.position);

        var closeness = (k_distanceAtWhichSoundIsSilent - distance) / k_distanceAtWhichSoundIsSilent;
        closeness = Math.max(closeness, 0);

        soundSite.setGain(closeness);
        //soundSite.setGain(1.0);
        if (closeness > 0)
        {
            currentlyPlayingSites.push([soundSite.soundId, closeness]);
            soundSite.loadSamplesIfNeeded();
        }
    }
    */

    // Implementation: find neighbours by querying kd tree

    // Get 3 nearest points to g_camera.position
    // 'maxDistance' is squared because we use the manhattan distance and no square root was applied in the distance function
    var nearestNeighbours = g_kdTree.nearest([g_camera.position.x, g_camera.position.y, g_camera.position.z], 5);
    for (var nearestNeighbourCount = nearestNeighbours.length, nearestNeighbourNo = 0; nearestNeighbourNo < nearestNeighbourCount; ++nearestNeighbourNo)
    {
        var nearestNeighbour = nearestNeighbours[nearestNeighbourNo];

        var kdNode = nearestNeighbour[0];

        var soundSite = kdNode.soundSite;
        var distance = soundSite.getPosition().distanceTo(g_camera.position);  // nearestNeighbour[1] seems to be NaN for some reason

        var closeness = (k_distanceAtWhichSoundIsSilent - distance) / k_distanceAtWhichSoundIsSilent;
        closeness = Math.max(closeness, 0);

        soundSite.setGain(closeness);
        //soundSite.setGain(1.0);
        if (closeness > 0)
        {
            currentlyPlayingSites.push([soundSite.soundId, closeness]);
            soundSite.loadSamplesIfNeeded();
        }
    }

    return currentlyPlayingSites;
}

var distances = [];
function animate()
{
    requestAnimationFrame(animate);

    //var currentlyPlayingSites = setGainOfSoundSitesByCameraProximity();

    // + Mouse picking {{{
    /*
    // Reset all cube colours to default,
    // then find which are currently pointed at with the mouse, and colour them red and display textual info
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

		soundSite.mesh.material.color.set(0xffffff);
    }

    g_raycaster.setFromCamera(new THREE.Vector2(g_mousePositionInViewport_normalized[0], -g_mousePositionInViewport_normalized[1]), g_camera);
	var intersections = g_raycaster.intersectObjects(g_scene.children);
    var pointedAtMeshes = [];
	for (var intersectionNo = 0; intersectionNo < intersections.length; ++intersectionNo)
    {
        var intersection = intersections[intersectionNo];

        pointedAtMeshes.push(intersection.object);
	}
    var pointedAtSoundSites = findSoundSitesOwningMeshes(pointedAtMeshes);
    */
    // + }}}

    // + Debug info text {{{
    /*
    var message = "";

    // Which site(s) are playing due to player proximity
    if (currentlyPlayingSites.length > 0)
    {
        message += "Currently playing:\n";
        for (var currentlyPlayingSiteCount = currentlyPlayingSites.length, currentlyPlayingSiteNo = 0; currentlyPlayingSiteNo < currentlyPlayingSiteCount; ++currentlyPlayingSiteNo)
        {
            var currentlyPlayingSite = currentlyPlayingSites[currentlyPlayingSiteNo];

            message += " " + dan.roundToDecimalPlaces(currentlyPlayingSite[1], 3).toString() + ": " + currentlyPlayingSite[0] + "\n";
        }
    }

    // Which site(s) mouse is pointing at
    var mousePointingAtMessage = "";
    for (var pointedAtSoundSiteCount = pointedAtSoundSites.length, pointedAtSoundSiteNo = 0; pointedAtSoundSiteNo < pointedAtSoundSiteCount; ++pointedAtSoundSiteNo)
    {
        var pointedAtSoundSite = pointedAtSoundSites[pointedAtSoundSiteNo];

		pointedAtSoundSite.mesh.material.color.set(0xff0000);
        mousePointingAtMessage += pointedAtSoundSite.soundId + "\n";
    }
    if (mousePointingAtMessage != "")
    {
        message += "Mouse pointing at:\n";
        message += " " + mousePointingAtMessage + "\n";
    }

    //
    document.body.querySelector("#infoText").innerText = message;
    */
    // + }}}

    // Show/hide all range wireframes according to current setting
    /*
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

		soundSite.rangeSphereMesh.visible = g_showSoundSiteRanges;
    }
    */

    //
    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    /*
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    if (moveForward) velocity.z -= 400.0 * delta;
    if (moveBackward) velocity.z += 400.0 * delta;

    if (moveLeft) velocity.x -= 400.0 * delta;
    if (moveRight) velocity.x += 400.0 * delta;

    if (isOnObject === true) {
        velocity.y = Math.max(0, velocity.y);

        canJump = true;
    }

    g_controls.getObject().translateX(velocity.x * delta);
    g_controls.getObject().translateY(velocity.y * delta);
    g_controls.getObject().translateZ(velocity.z * delta);

    if (g_controls.getObject().position.y < 10) {

        velocity.y = 0;
        g_controls.getObject().position.y = 10;

        canJump = true;

    }
    */

    prevTime = time;

	g_controls.movementSpeed = 150;
	g_controls.update(delta);


    // Light up recently played stars
    var timeInSeconds = time / 1000;
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        g_bufferGeometry_glows[soundSiteNo] = 1.0 - dan.clamp(timeInSeconds - soundSite.lastTriggerTime, 0, 1);
    }
    g_bufferGeometry.attributes.a_glow.needsUpdate = true;


    //
    g_renderer.render(g_scene, g_camera);

    g_scrollingLog.removeTimedOutEntries();
}

init();

// + Communication with Freesound {{{

// Working cURL example:
//  curl -H "Authorization: Token 3c5dd7395a593748acfcd7385372df519cdcaeab" 'https://freesound.org/apiv2/search/text/?&page=1&page_size=60&group_by_pack=0&fields=id,previews,namequery=dogs&format=json'
// Example from Freesound Explorer:
//  https://freesound.org/apiv2/search/text/?&page=1&page_size=60&group_by_pack=0&filter=duration:[0%20TO%205]&fields=id,previews,name,analysis,url,username,duration,tags,license&descriptors=lowlevel.mfcc.mean,sfx.tristimulus.mean,tonal.hpcp.mean&query=dogs&format=json

function searchFreesound(i_nameQuery, i_onPage)
// Params:
//  i_nameQuery:
//   (string)
//  i_onPage:
//   (function)
{
    searchFreesound_getPage(i_nameQuery, 1, 5, i_onPage);
    // TODO: repeat till got all pages
}

function searchFreesound_getPage(i_nameQuery, i_pageNo, i_resultsPerPage, i_onPage)
// Params:
//  i_nameQuery:
//   (string)
//  i_pageNo:
//   (integer number)
//  i_resultsPerPage:
//   (integer number)
//  i_onPage:
//   (function)
{
    var queryUrl = 'https://freesound.org/apiv2/search/text/?';
    queryUrl += '&fields=id,name,previews,namequery=' + i_nameQuery;
    queryUrl += '&format=json';
    queryUrl += '&page=' + i_pageNo.toString();
    queryUrl += '&page_size=' + i_resultsPerPage.toString();
    queryUrl += '&group_by_pack=0';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", queryUrl);
    xhr.responseType = "json";
    xhr.setRequestHeader("Authorization", "Token S6iCeqkOguD4uIKGwmgzrxW7XwTznx4PMj6HrPp4");
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE)
        {
            //console.log(xhr.response);

            var results = xhr.response.results;  // TODO: defend against exception on this line if Freesound is inaccessible
            i_onPage(results);
        }
    };
    xhr.send();
}

function fstest2()
{
    var audioMediaElement = new Audio("https://www.freesound.org/data/previews/242/242403_4165591-lq.mp3");

    // Create a MediaElementAudioSourceNode to draw from the above Audio node
    var mediaElementAudioSourceNode = g_audioContext.createMediaElementSource(audioMediaElement);
}

function freesound_getPreviewUrl(i_soundId, i_onDone)
// Get the URL of a Freesound preview in low-quality MP3 format.
//
// Params:
//  i_soundId:
//   (integer number)
//  i_onDone:
//   (function)
//   Function has:
//    Params:
//     i_url:
//      (string)
{
    var queryUrl = 'https://freesound.org/apiv2/sounds/';
    queryUrl += i_soundId.toString() + "/?";
    queryUrl += '&fields=id,previews';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", queryUrl);
    xhr.responseType = "json";
    xhr.setRequestHeader("Authorization", "Token S6iCeqkOguD4uIKGwmgzrxW7XwTznx4PMj6HrPp4");
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE)
        {
            //console.log(xhr.response);

            i_onDone(xhr.response["previews"]["preview-lq-mp3"]);
        }
    };
    xhr.send();
}

// + }}}
