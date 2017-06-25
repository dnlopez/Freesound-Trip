
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

function generateSequence(i_length, i_oneEveryNSteps, i_individualHitChance, i_maxJitter, i_offset)
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

        if (Math.random() < i_individualHitChance)
        {
            var jitterAmount = Math.round((Math.random() * 2 - 1) * i_maxJitter);

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

Sequencer.prototype.tick = function ()
{
    if (!this.playing)
        return;

    if (g_soundSites.length > 20000)
        debugger;

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

        var closestSites = "";

        /*
        // Get nearest points to g_camera.position
        var nearestNeighbours = g_kdTree.nearest([g_camera.position.x, g_camera.position.y, g_camera.position.z], 1);
        for (var nearestNeighbourCount = nearestNeighbours.length, nearestNeighbourNo = 0; nearestNeighbourNo < nearestNeighbourCount; ++nearestNeighbourNo)
        {
            var nearestNeighbour = nearestNeighbours[nearestNeighbourNo];

            var kdNode = nearestNeighbour[0];

            var soundSite = kdNode.soundSite;
            var distance = soundSite.getPosition().distanceTo(g_camera.position);  // nearestNeighbour[1] seems to be NaN for some reason

            // Choose gain according to distance
            var closeness = (k_distanceAtWhichSoundIsSilent - distance) / k_distanceAtWhichSoundIsSilent;

            closeness = Math.max(closeness, 0);

            soundSite.setGain(closeness);
            //soundSite.setGain(1.0);
            if (closeness > 0)
            {
                if (!soundSite.audioBuffer)
                {
                    soundSite.loadSamplesIfNeededAndStartPlaying();  // TODO: "AndStartPlaying" is no longer applicable
                    // TODO: still trigger the first sound if it loads in time
                }
                else
                {
                    closestSites += soundSite.soundId + ": " + soundSite.soundUrl + "\n";
                    playNote(soundSite.audioBuffer, closeness, nextBeatStartTime);
                }
            }
        }

        */

        // For each sound site [TODO: that is currently playing or newly close]
        var soundSiteDistances = [];
        for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
        {
            var soundSite = g_soundSites[soundSiteNo];

            var d = soundSite.getPosition().distanceTo(g_camera.position);
            // HACK
            if (d === undefined || d == 0)
                continue;

            soundSiteDistances.push({
                soundSite: soundSite,
                distance: soundSite.getPosition().distanceTo(g_camera.position)
            });
        }

        // Sort the above
        soundSiteDistances = soundSiteDistances.sort(function (i_a, i_b) {
            if (i_a.distance < i_b.distance)
                return -1;
            else if (i_a.distance > i_b.distance)
                return 1;
            else
                return 0;
        });

        // For the closest few
        for (var soundSiteDistanceCount = Math.max(soundSiteDistances.length, 5), soundSiteDistanceNo = 0; soundSiteDistanceNo < soundSiteDistanceCount; ++soundSiteDistanceNo)
        {
            var soundSiteDistance = soundSiteDistances[soundSiteDistanceNo];

            var soundSite = soundSiteDistance.soundSite;
            var distance = soundSiteDistance.distance;

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
                        soundSite.loadSamplesIfNeededAndStartPlaying();  // TODO: "AndStartPlaying" is no longer applicable
                        // TODO: still trigger the first sound if it loads in time
                    }
                    else
                    {
                        closestSites += soundSite.soundId + ": " + soundSite.soundUrl + ", " + soundSite.sequence.toString() + "\n";
                        playNote(soundSite.audioBuffer, closeness, nextBeatStartTime);
                    }
                }
            }
        }

        //document.body.querySelector("#infoText").innerText = closestSites;
        /*
        // For each sound site [TODO: that is currently playing or newly close]
        for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
        {
            var soundSite = g_soundSites[soundSiteNo];

            if (soundSite.sequence[this.currentBeatNo] === true)
            {
                // Choose gain according to distance
                var distance = soundSite.getPosition().distanceTo(g_camera.position);

                var closeness = (k_distanceAtWhichSoundIsSilent - distance) / k_distanceAtWhichSoundIsSilent;
                closeness = Math.max(closeness, 0);

                if (closeness > 0)
                {
                    if (!soundSite.audioBuffer)
                    {
                        soundSite.loadSamplesIfNeededAndStartPlaying();  // TODO: "AndStartPlaying" is no longer applicable
                        // TODO: still trigger the first sound if it loads in time
                    }
                    else
                    {
                        playNote(soundSite.audioBuffer, closeness, nextBeatStartTime);
                    }
                }
            }
        }
        */

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
    var notes = [];

    // Convert beats per minute to seconds per beat,
    // then get the start time of the next beat
    var beatPeriod = 60.0/this.tempo;
    var nextBeatStartTime = this.currentBeatStartTime + beatPeriod;

    for (var beatNo = 0; beatNo < this.sequenceLength; ++beatNo)
    {
        var closestSites = "";

        // For each sound site [TODO: that is currently playing or newly close]
        var soundSiteDistances = [];
        for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
        {
            var soundSite = g_soundSites[soundSiteNo];

            var d = soundSite.getPosition().distanceTo(g_camera.position);
            // HACK
            if (d === undefined || d == 0)
                continue;

            soundSiteDistances.push({
                soundSite: soundSite,
                distance: soundSite.getPosition().distanceTo(g_camera.position)
            });
        }

        // Sort the above
        soundSiteDistances = soundSiteDistances.sort(function (i_a, i_b) {
            if (i_a.distance < i_b.distance)
                return -1;
            else if (i_a.distance > i_b.distance)
                return 1;
            else
                return 0;
        });

        // For the closest few [shouldn't the next line be Math.min?...]
        for (var soundSiteDistanceCount = Math.max(soundSiteDistances.length, 5), soundSiteDistanceNo = 0; soundSiteDistanceNo < soundSiteDistanceCount; ++soundSiteDistanceNo)
        {
            var soundSiteDistance = soundSiteDistances[soundSiteDistanceNo];

            var soundSite = soundSiteDistance.soundSite;
            var distance = soundSiteDistance.distance;

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
//   (function)
//   Function has:
//    Params:
//     -
//    Returns:
//     (float number)
//     In half-open range [0 .. 1)
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
//   (function)
//   Function has:
//    Params:
//     -
//    Returns:
//     (float number)
//     In half-open range [0 .. 1)
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

function SoundSite(i_audioContext, i_sound,
                   i_soundSiteNo, i_url,
                   i_position,
                   i_soundSiteNo, o_vertexAttribute_positions, o_vertexAttribute_alphas, o_vertexAttribute_colours, o_vertexAttribute_spriteUvs)
// Params:
//  i_audioContext:
//   (AudioContext)
//  i_soundSiteNo:
//   (string)
//  i_url:
//   (string)
//  i_position:
//   (THREE.Vector3)
//  i_soundSiteNo:
//   (integer number)
//  o_vertexAttribute_positions:
//   (array of float number)
//  o_vertexAttribute_alphas:
//   (array of float number)
{
    this.m_audioContext = i_audioContext;
    this.soundId = i_sound.id;
    this.soundUrl = i_url;
    this.soundSiteNo = i_soundSiteNo;

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

    this.sequence = generateSequence(64, sequence_oneEveryNSteps, sequence_individualHitChance, sequence_maxJitter, sequence_offset);

    //// Graphic object
    //this.mesh = new THREE.Mesh(i_geometry, i_material);
    //this.mesh.position.x = positionX;
    //this.mesh.position.y = positionY;
    //this.mesh.position.z = positionZ;

    o_vertexAttribute_positions[i_soundSiteNo*3 + 0] = i_position.x;
    o_vertexAttribute_positions[i_soundSiteNo*3 + 1] = i_position.y;
    o_vertexAttribute_positions[i_soundSiteNo*3 + 2] = i_position.z;
    o_vertexAttribute_alphas[i_soundSiteNo] = 1.0;

    o_vertexAttribute_colours[i_soundSiteNo*4 + 0] = i_sound.r;
    o_vertexAttribute_colours[i_soundSiteNo*4 + 1] = i_sound.g;
    o_vertexAttribute_colours[i_soundSiteNo*4 + 2] = i_sound.b;
    o_vertexAttribute_colours[i_soundSiteNo*4 + 3] = 1.0;

    o_vertexAttribute_spriteUvs[i_soundSiteNo*2 + 0] = 0.0;
    o_vertexAttribute_spriteUvs[i_soundSiteNo*2 + 1] = 0.0;
    //this.rangeSphereGeometry = new THREE.SphereGeometry(k_distanceAtWhichSoundIsSilent, 32, 32);
    //var material = new THREE.MeshBasicMaterial({color: 0xffff88});
    //material.wireframe = true;
    //this.rangeSphereMesh = new THREE.Mesh(this.rangeSphereGeometry, material);
    //this.rangeSphereMesh.position.x = this.mesh.position.x;
    //this.rangeSphereMesh.position.y = this.mesh.position.y;
    //this.rangeSphereMesh.position.z = this.mesh.position.z;
}

SoundSite.prototype.loadSamplesIfNeededAndStartPlaying = function (i_onReady)
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

    console.log("loadSamplesIfNeededAndStartPlaying: " + this.soundId);

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
var g_soundSites_alphas = null;  // (Float32Array)

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

    g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    // Make a scene graph
    g_scene = new THREE.Scene();

    // Add fog
    g_scene.fog = new THREE.Fog(0xffffff, 0, 750);

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
    /*
    // + k-d tree {{{
    // To make the nearest neighbour search faster

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

    console.log('TIME building kdtree', new Date().getTime() - measureStart);

    // + }}}
    */

    // + k-d tree {{{
    // To make the nearest neighbour search faster

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
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
    };
    g_kdTree = new kdTree(soundSitePositions, distanceFunction, ["x", "y", "z"]);

    console.log('TIME building kdtree', new Date().getTime() - measureStart);

    // + }}}
}

function test_loadLocalSounds()
{
    // Create sound sites
    var k_soundSiteCount = 8;
    var readyCount = 0;
    function soundSite_onReady()
    {
        ++readyCount;
        if (readyCount == k_soundSiteCount)
        {
        }
    }
    for (var soundSiteNo = 0; soundSiteNo < k_soundSiteCount; ++soundSiteNo)
    {
        var soundSiteName = "melody" + (soundSiteNo + 1).toString();
        loadSoundAndAddSoundSite(soundSiteName,
                                 "/home/daniel/docs/hackspace/sic/3d_space/SOUNDS/" + soundSiteName + ".mp3", 
                                 new THREE.Vector3(
                                     Math.floor(Math.random() * 20 - 10) * 20,
                                     Math.floor(Math.random() * 20) * 20 + 10,
                                     Math.floor(Math.random() * 20 - 10) * 20)
                                );
    }
}

function test_loadFreesoundSound()
{
    loadSoundAndAddSoundSite("freesound 242403_4165591",
                             "https://www.freesound.org/data/previews/242/242403_4165591-lq.mp3",
                             new THREE.Vector3(
                                 Math.floor(Math.random() * 20 - 10) * 20,
                                 Math.floor(Math.random() * 20) * 20 + 10,
                                 Math.floor(Math.random() * 20 - 10) * 20),
                            );
}

function loadSoundAndAddSoundSite(i_soundSiteName, i_url, i_position)
// Add a sound site, given a URL and position.
//
// Params:
//  i_soundSiteName:
//   (string)
//  i_url:
//   (string)
//  i_position:
//   (THREE.Vector3)
{
    // PROTOTYPE:
    // Create a material to be used by the next sound site, with random colour
    var soundSiteMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
    soundSiteMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

    //
    var soundSite = new SoundSite(g_audioContext, i_soundSiteName, i_url, i_position,
                                  g_soundSites.length, g_bufferGeometry_positions, g_bufferGeometry_alphas);
    g_soundSites.push(soundSite);

    //
    //g_scene.add(soundSite.getMesh());
    soundSite.addGraphicObjectsToScene(g_scene);
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
    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/27k_collection.json", "points");
    loadWithLog(g_assetLoader, g_assetLoader.loadJson, "http://54.215.134.50:5000/tsne?tags=" + g_tagsStr, "points");
    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/tsne_splash.json", "points");
    //loadWithLog(g_assetLoader, g_assetLoader.loadJson, "http://ec2-54-215-134-50.us-west-1.compute.amazonaws.com:5000/tsne?tags=" + g_tagsStr, "points");
    loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/tag_summary.json", "tag_summary");
    loadWithLog(g_assetLoader, g_assetLoader.loadJson, "metadata/tags_to_ids.json", "tags_to_ids");
    if (k_soundSource == "index")
        loadWithLog(g_assetLoader, g_assetLoader.loadJson, k_soundSource_indexUrl, "sound_index");

    g_assetLoader.all().then(assetLoader_onAll);

    // + }}}
}

function assetLoader_onAll()
{
    // + Load sounds {{{

    var particleCount = Object.keys(g_assetLoader.loaded["points"]).length;

    g_bufferGeometry_positions = new Float32Array(particleCount * 3);
    g_bufferGeometry_alphas = new Float32Array(particleCount);
    g_bufferGeometry_colours = new Float32Array(particleCount * 4);
    g_bufferGeometry_spriteUvs = new Float32Array(particleCount * 2);

    //
    var coordinateExpansionFactor = 20;
    for (var pointCount = g_assetLoader.loaded["points"].length, pointNo = 0; pointNo < pointCount; ++pointNo)
    {
        var point = g_assetLoader.loaded["points"][pointNo];

        //
        var soundUrl;
        switch (k_soundSource)
        {
        case "pattern":
            soundUrl = k_soundSource_pattern.replace("*", point.id);
            break;
        case "index":
            soundUrl = g_assetLoader["loaded"]["sound_index"][point.id]["url"];
            break;
        }

        //
        var soundSite = new SoundSite(g_audioContext, point,
                                      pointNo.toString(), soundUrl,
                                      new THREE.Vector3(point.x * coordinateExpansionFactor, point.y * coordinateExpansionFactor, point.z * coordinateExpansionFactor),
                                      //point.r, point.g, point.b,
                                      //point.onset_times?
                                      //point.r?
                                      g_soundSites.length, g_bufferGeometry_positions, g_bufferGeometry_alphas, g_bufferGeometry_colours, g_bufferGeometry_spriteUvs);
        g_soundSites.push(soundSite);
    }


    if (g_soundSites.length > 20000)
        debugger;


    //
    buildTreeOfSoundSites();



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
    });

    // + }}}

    // + Create points in a BufferGeometry {{{

    // Make a THREE.BufferGeometry that contains 'position' and 'alpha' vertex attributes,
    // with the components of those things split and flattened into typed arrays

    g_bufferGeometry = new THREE.BufferGeometry();

    g_bufferGeometry.addAttribute('position', new THREE.BufferAttribute(g_bufferGeometry_positions, 3));
    g_bufferGeometry.addAttribute('alpha', new THREE.BufferAttribute(g_bufferGeometry_alphas, 1));
    g_bufferGeometry.addAttribute('a_colour', new THREE.BufferAttribute(g_bufferGeometry_colours, 4));
    g_bufferGeometry.addAttribute('a_spriteUv', new THREE.BufferAttribute(g_bufferGeometry_spriteUvs, 2));

    // Make a renderable THREE.Points object that uses the above buffer geometry
    var points = new THREE.Points(g_bufferGeometry, pointShaderMaterial);

    /*
    // Fill attributes with random or default values
    for (var pointNo = 0; pointNo < particleCount; ++pointNo)
    {
        g_bufferGeometry_positions[pointNo * 3 + 0] = Math.random() * 1000;
        g_bufferGeometry_positions[pointNo * 3 + 1] = Math.random() * 1000;
        g_bufferGeometry_positions[pointNo * 3 + 2] = Math.random() * 1000;

        g_bufferGeometry_alphas[pointNo] = 1.0;
    }
    */

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
            soundSite.loadSamplesIfNeededAndStartPlaying();
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
            soundSite.loadSamplesIfNeededAndStartPlaying();
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

function loadResultsOfFreesoundSearchIntoSoundSites(i_nameQuery, i_onDone)
{
    searchFreesound(i_nameQuery, function (i_results) {
        for (var resultCount = i_results.length, resultNo = 0; resultNo < resultCount; ++resultNo)
        {
            var result = i_results[resultNo];

            var url = result.previews["preview-lq-ogg"];
            //console.log(url);

            var soundSiteName = url + ', "' + result.name + '"';
            loadSoundAndAddSoundSite(soundSiteName,
                                     url,
                                     new THREE.Vector3(
                                         Math.floor(Math.random() * 20 - 10) * 20,
                                         Math.floor(Math.random() * 20) * 20 + 10,
                                         Math.floor(Math.random() * 20 - 10) * 20)
                                    );
        }

        //
        if (i_onDone)
            i_onDone();
    });
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
