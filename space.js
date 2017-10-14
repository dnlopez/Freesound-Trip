
// jQuery
// #require "externals/jquery-1.8.2.min.js"

//
// #require "externals/kdTree.js"

// Three
// #require "externals/three.js/three.js"

// Dan reusable
// #require <dan/urls.js>
// #require <dan/numeric_helpers.js>
// #require <dan/gui/html/PopupTextarea.js>
// #require <dan/snd/webaudio/AudioContextOutputStream.js>
// #require <dan/snd/webaudio/Float32ArrayWavetablePlayer.js>
// #require <dan/loaders/AssetLoader.js>
// #require <dan/loaders/AssetLoader_threeTexture.js>
// #require <dan/gfx/canvas/ToGl.js>
// #require <dan/gfx/canvas3d/ToGl.js>
// #require <dan/gfx/gl/Context.js>
// #require <dan/gfx/gl/BufferObject.js>
// #require <dan/gfx/gl/Framebuffer.js>
// #require <dan/gfx/gl/Program.js>
// #require <dan/gfx/gl/SpriteBatch.js>
// #require <dan/text/FontDetector.js>
// #require <dan/text/CanvasFontFace.js>
// #require <dan/text/GlTextureFontFace.js>

// This program
// #require "mission_control.js"
// #require "common.js"
// #require "audio.js"
// #require "externals/freesound.js"
// #require "externals/seedrandom.js"
// #require "Float32ArrayWavetablePlayerWithGain.js"
// #require "source_sounds.js"
// #require "FlyControls.js"
// #require "numeric_helpers.js"
// #require "three_helpers.js"


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

// + Sound site {{{

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

    var loadTimeStart = performance.now() / 1000;

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
                me.loadTime = performance.now() / 1000 - loadTimeStart;

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

function findSoundSiteNoById(i_soundId)
// Params:
//  i_soundId:
//   (integer number)
//
// Returns:
//  Either (integer number)
//  or (null)
{
    var soundIdStr = i_soundId.toString();
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        if (soundSite.soundId == soundIdStr)
            return soundSiteNo;
    }

    return null;
}

// + + }}}

// + }}}

//var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();

var g_mousePositionInViewport = [0, 0];
var g_mousePositionInViewport_normalized = [0, 0];
function space_body_onMouseMove(i_event)
{
    // Get mouse position relative to top-left of g_space_viewportDiv
    var boundingClientRect = g_space_viewportDiv.getBoundingClientRect();
    g_mousePositionInViewport = [i_event.clientX - boundingClientRect.left, i_event.clientY - boundingClientRect.top];
    g_mousePositionInViewport_normalized = [g_mousePositionInViewport[0] / boundingClientRect.width * 2 - 1,
                                            g_mousePositionInViewport[1] / boundingClientRect.height * 2 - 1];
}

var g_sequencer;

var g_autoFlyToSoundSite = null;

function getSpaceParamsFromQueryString()
{
    var wantedTagsStr = dan.getParameterValueFromQueryString("tags");
    if (wantedTagsStr == "")
    {
        g_spaceParam_wantedTags = [];
    }
    else
    {
        g_spaceParam_wantedTags = wantedTagsStr.split("+");
        // Split wantedTagsStr at '+' or '-' chars,
        // using lookahead so those chars are not themselves included in the regex match and are included in the return array
        //g_spaceParam_wantedTags = wantedTagsStr.split(/(?=[+-])/);
    }

    var unwantedTagsStr = dan.getParameterValueFromQueryString("unwantedTags");
    if (unwantedTagsStr == "")
    {
        g_spaceParam_unwantedTags = [];
    }
    else
    {
        g_spaceParam_unwantedTags = g_unwantedTagsStr.split("+");
    }

    var bpmStr = dan.getParameterValueFromQueryString("bpm");
    if (bpmStr != "")
    {
        g_spaceParam_bpm = parseInt(bpmStr);
    }
    else
    {
        g_spaceParam_bpm = 120;
    }
}

function space_viewportDiv_onMouseDown(i_event)
{
    if (g_showSequence)
    {
        g_sequencer.onMouseDown(i_event);
    }
    else
    {
        // If pressed the right mouse button
        if (i_event.button == 2)
        {
            var pointedAtSoundSites = getSoundSitesAtViewportPosition(new THREE.Vector2(g_mousePositionInViewport_normalized[0], -g_mousePositionInViewport_normalized[1]));
            if (pointedAtSoundSites.length > 0)
            {
                var webUrl = g_parsed_sound_index[pointedAtSoundSites[0].soundId]["web-url"];
                g_scrollingLog.addText(webUrl);
                window.open(webUrl, "_blank");
                //
                i_event.stopPropagation();
                i_event.stopImmediatePropagation();
                g_controls.resetInputs();
            }
        }
    }
}

function space_document_onKeyDown(event)
{
    //console.log(event.keyCode);

    switch (event.keyCode)
    {
    case 38: // up
    case 87: // w
        moveForward = true;
        break;

    case 37: // left
    case 65: // a
        moveLeft = true;
        break;

    case 40: // down
    case 83: // s
        moveBackward = true;
        break;

    case 39: // right
    case 68: // d
        moveRight = true;
        break;

    //case 71: // g
    //    g_showSoundSiteRanges = !g_showSoundSiteRanges;
    //    break;

    case 71: // g
        g_showSequence = !g_showSequence;
        break;

    case 73: // i
        if (!g_showSoundSiteIdsOnMouseover)
        {
            g_scrollingLog.addText("Freesound ID inspection ON (put mouse on a star).");
            g_showSoundSiteIdsOnMouseover = true;
        }
        else
        {
            g_scrollingLog.addText("Freesound ID inspection OFF.");
            g_showSoundSiteIdsOnMouseover = false;
        }
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

    case 77: // m
        missionControl_toggle();
        break;

    case 78: // n
        space_toggle();
        break;

    case 27: // Escape
        missionControl_show();
        space_hide();
        space_uninstallEventHandlers();
        space_exit();
        g_sequencer.stop();
        g_scrollingLog.addText("Sequencer stopped.");
        break;

    case 32: // space
        g_sequencer.togglePlay();
        if (g_sequencer.playing)
            g_scrollingLog.addText("Sequencer started.");
        else
            g_scrollingLog.addText("Sequencer stopped.");
        break;

    case 49: // 0
    case 50: // 1
    case 51: // 2
    case 52: // 3
    case 53: // 4
    case 54: // 5
    case 55: // 6
    case 56: // 7
    case 57: // 8
    case 58: // 9
        g_controls.movementSpeed = 150 + (event.keyCode - 53) * 20;
        //g_scrollingLog.addText("Set movement speed to " + g_controls.movementSpeed.toString()  + ".");
        break;
    }
}

function space_document_onKeyUp(event)
{
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
}

function space_installEventHandlers()
{
    // Mouse actions on main viewport
    document.body.addEventListener("mousemove", space_body_onMouseMove);
    g_space_viewportDiv.addEventListener("mousedown", space_viewportDiv_onMouseDown);

    //
    document.addEventListener("keydown", space_document_onKeyDown, false);
    document.addEventListener("keyup", space_document_onKeyUp, false);
}

function space_uninstallEventHandlers()
{
    // Mouse actions on main viewport
    document.body.removeEventListener("mousemove", space_body_onMouseMove);
    g_space_viewportDiv.removeEventListener("mousedown", space_viewportDiv_onMouseDown);

    //
    document.removeEventListener("keydown", space_document_onKeyDown, false);
    document.removeEventListener("keyup", space_document_onKeyUp, false);
}

// + space_construct() {{{

function space_construct()
{
    g_space_controlsDialogElement = dan.htmlToDom(dan.hereDoc(function () {/*!
<div class="popupDialog controlsDialog">
  <div class="column">
    <h2>Move</h2>
    <ul>
      <li><span class="keyboardControl">W</span> <span class="keyboardControl">S</span> <span class="keyboardControl">A</span> <span class="keyboardControl">D</span> : forward / backward / leftward / rightward</li>
      <li><span class="keyboardControl">R</span> <span class="keyboardControl">F</span> : up / down</li>
    </ul>
    <h2>Rotate</h2>
    <ul>
      <li><span class="keyboardControl">arrow keys</span> or <span class="mouseControl">click+drag</span></li>
    </ul>
    <h2>Roll</h2>
    <ul>
      <li><span class="keyboardControl">Q</span> <span class="keyboardControl">E</span></li>
    </ul>
  </div>
  <div class="column">
    <h2>Audio</h2>
    <ul>
      <li><span class="keyboardControl">Space</span> : stop/restart sequencer playback</li>
      <li><span class="keyboardControl">G</span> : show the current sequence, on a grid
      <li><span class="keyboardControl">P</span> : show the current sequence, in exportable text form
      <li><span class="keyboardControl">C</span> : record audio</li>
    </ul>
    <h2>Freesound</h2>
    <ul>
      <li><span class="keyboardControl">I</span> : show Freesound IDs for stars underneath mouse pointer</li>
      <li><span class="mouseControl">right-click</span> star : visit sound's page on freesound.org</li>
    </ul>
    <h2>Session</h2>
    <ul>
      <li><span class="keyboardControl">Esc</span> : return to mission control</li>
    </ul>
  </div>
  <p class="dialogButtons" style="clear: both; padding-top: 1.5em;">
    <button class="dialogButton closeButton">BACK</button>
  </p>
</div>
*/}));
    //$(g_space_controlsDialogElement).hide();
    document.body.appendChild(g_space_controlsDialogElement);


    g_sequencer = new Sequencer();

    // Create div to contain the space viewport
    g_space_viewportDiv = document.createElement("div");
    document.body.appendChild(g_space_viewportDiv);

    // Create canvas element
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    var contextAttributes = { stencil: true };
    var ctx = canvas.getContext("webgl", contextAttributes) || canvas.getContext("experimental-webgl", contextAttributes);
    if (ctx === null)
    {
        throw "Error creating WebGL context";
    }

    // Create THREE renderer using above context,
    // add canvas element to viewport
    g_renderer = new THREE.WebGLRenderer(ctx);
    g_renderer.setClearColor(0xffffff);
    g_renderer.setPixelRatio(window.devicePixelRatio);
    //g_renderer.setSize(window.innerWidth, window.innerHeight);
    g_space_viewportDiv.appendChild(g_renderer.domElement);

    //
    GL = new dan.gfx.gl.Context(g_renderer.context);
    g_danCanvas = new dan.gfx.canvas.ToGl();

    //
    g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    //g_camera.rotation.order = "ZYX";

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
    //var cubeTextureLoader = new THREE.CubeTextureLoader();
    //cubeTextureLoader.setPath('textures/cube/diagnostic_skybox/');
    //var cubeTexture = cubeTextureLoader.load([
    //    'px.png', 'nx.png',
    //    'py.png', 'ny.png',
    //    'pz.png', 'nz.png',
    //]);
    g_scene.background = cubeTexture;

    //
    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    g_scene.add(light);

    var infoTextDiv = document.createElement("div");
    infoTextDiv.setAttribute("id", "infoText");
    document.body.appendChild(infoTextDiv);

    // + Dialogs {{{

    g_space_controlsButton = $('<div class="controlsButton">CONTROLS</div>')[0];
    g_space_controlsButton.style.position = "fixed";
    g_space_controlsButton.style.top = "16px";
    g_space_controlsButton.style.left = "16px";
    $(g_space_controlsButton).hide();
    document.body.appendChild(g_space_controlsButton);

    var viewportDimmer = new ViewportDimmer();

    $(".controlsButton").bind("click", function (i_event) {
        viewportDimmer.dim();

        var openerButtonClientRect = i_event.target.getBoundingClientRect();
        popUpElement($(".controlsDialog")[0], openerButtonClientRect.right + 10, openerButtonClientRect.top);
    });

    function closeDialogs(i_event)
    {
        viewportDimmer.undim();
        $(".controlsDialog").css("visibility", "hidden");
    }
    $(".closeButton").bind("click", closeDialogs);
    viewportDimmer.bindClick(closeDialogs);

    // + }}}

    //g_controls = new THREE.PointerLockControls(g_camera);
    g_controls = new THREE_FlyControls(g_camera, g_space_viewportDiv);
    g_controls.movementSpeed = 1000;
    g_controls.domElement = g_space_viewportDiv;
    g_controls.rollSpeed = Math.PI / 4;
    g_controls.mouse_mustHoldButtonToLook = true;
    //g_scene.add(g_controls.getObject());


    g_raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 1000);

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
    space_construct_continue();
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

function space_onWindowResize()
{
    g_camera.aspect = window.innerWidth / window.innerHeight;
    g_camera.updateProjectionMatrix();

    g_renderer.setSize(window.innerWidth, window.innerHeight);

    g_danCanvas.setProjectionMatrix(dan.math.Matrix4.orthoMatrix(0, window.innerWidth, window.innerHeight, 0, -1, 1));
    GL.setViewport(0, 0, window.innerWidth, window.innerHeight);
}

function space_construct_continue()
{
    //
    g_scrollingLog.addText("Loading fonts...");
    dan.text.loadFont("fonts/DroidSansMono-Regular.ttf", "DroidSansMono").then(space_construct_onFontsLoaded);
}

var g_space_assetLoader;
var g_space_assetsLoaded = false;

function space_construct_onFontsLoaded()
{
    //
    var droidSansMono14CanvasFont = dan.text.CanvasFontFace.fromSystemFont("Droid Sans Mono", "normal", "normal", 14, [[32, 126], 176]);
    g_droidSansMono14TextureFont = dan.text.GlTextureFontFace.fromCanvasFont(droidSansMono14CanvasFont);

    //
    window.addEventListener("resize", space_onWindowResize, false);
    space_onWindowResize();

    //
    /*
    loadResultsOfFreesoundSearchIntoSoundSites("dogs", function () {
        buildTreeOfSoundSites();

        space_startMainLoop();
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

        i_loadMethod.call(i_loaderObject, i_url, i_key).then(function (i_result) {
            ++assetEventDoneCount;
            var assetEventDoneNote = "(" + assetEventDoneCount.toString() + "/" + assetEventCount.toString() + ")";
            //setProgress(assetEventDoneCount / assetEventCount);

            loaderLog(assetEventDoneNote + " Loaded " + i_result.url);
        },
        function (i_result) {
            ++assetEventDoneCount;
            var assetEventDoneNote = "(" + assetEventDoneCount.toString() + "/" + assetEventCount.toString() + ")";
            //setProgress(assetEventDoneCount / assetEventCount);

            loaderLog(assetEventDoneNote + " FAILED to load " + i_result.url + ", error description: " + i_result.errorDescription);
        });
    }

    g_space_assetLoader = new dan.loaders.AssetLoader();

    g_scrollingLog.addText("Loading data and graphics...");

    loadWithLog(g_space_assetLoader, g_space_assetLoader.loadTexture, "sprites/shapes.png", "shapes");

    // Load asset "points"
    if (dan.getParameterValueFromQueryString("datasource") == "dynamic")
    {
        loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, "http://54.215.134.50:5000/tsne?tags=" + g_tagsStr, "points");
        //loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, "http://ec2-54-215-134-50.us-west-1.compute.amazonaws.com:5000/tsne?tags=" + g_tagsStr, "points");
        g_soundsAlreadyFiltered = true;
    }
    else if (dan.getParameterValueFromQueryString("datasource") == "test_splash")
    {
        loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, "metadata/tsne_splash.json", "points");
        g_soundsAlreadyFiltered = true;
    }
    else
    {
        loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, "metadata/27k_collection.json", "points");
        g_soundsAlreadyFiltered = false;
    }

    //loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, "metadata/tag_summary.json", "tag_summary");
    //loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, "metadata/tags_to_ids.json", "tags_to_ids");
    // Load asset "freesound_tags_indexed"
    loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, "metadata/freesound_tags_indexed.json", "freesound_tags_indexed");

    if (k_soundSource == "index")
        // Load asset "sound_index"
        loadWithLog(g_space_assetLoader, g_space_assetLoader.loadText, k_soundSource_indexUrl, "sound_index");

    g_space_assetLoader.all().then(function () {
        // + Create custom shader for sound sites, that draws from crate texture {{{

        var vertexShaderSource = `
//uniform float u_zoom;

attribute float a_glow;
attribute vec2 a_spriteUv;
attribute vec4 a_colour;

varying float v_glow;
varying vec2 v_spriteUv;
varying vec4 v_colour;

void main()
{
    v_glow = a_glow;
    v_spriteUv = a_spriteUv;
    v_colour = a_colour;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 16.0 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

        var fragmentShaderSource = `
varying float v_glow;

varying vec2 v_spriteUv;
varying vec4 v_colour;

uniform sampler2D u_texture1;

void main()
{
    vec2 textureCoords = gl_PointCoord / 2.0;
    textureCoords += v_spriteUv;

    gl_FragColor = texture2D(u_texture1, textureCoords) * v_colour;
    //gl_FragColor.r = (1.0 - gl_FragColor.r) * v_alpha + gl_FragColor.r;
    gl_FragColor.rgb = gl_FragColor.rgb * (1.0 - v_glow) + vec3(v_glow);
    //gl_FragColor = gl_FragColor * (1.0);
}
`;

        //var imagePreviewTexture = g_space_assetLoader.loadTexture("textures/crate.gif", "crate").asset;
        //var imagePreviewTexture = textureLoader.load("textures/crate.gif");
        var imagePreviewTexture = g_space_assetLoader.loaded["shapes"];
        imagePreviewTexture.minFilter = THREE.LinearMipMapLinearFilter;
        imagePreviewTexture.magFilter = THREE.LinearFilter;

        g_pointShaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_texture1: { value: imagePreviewTexture },
                u_zoom: { value: 9.0 }  // not used
            },
            vertexShader: vertexShaderSource,
            fragmentShader: fragmentShaderSource,
            transparent: true,
            depthTest: false
        });

        // + }}}

        g_space_assetsLoaded = true;
    });

    // + }}}
}

// + }}}

function enterSpaceWhenAssetsReady()
{
    if (!g_space_assetsLoaded)
    {
        g_space_assetLoader.all().then(function () {
            space_installEventHandlers();
            space_enter();
        });
    }
    else
    {
        space_installEventHandlers();
        space_enter();
    }
}

var g_space_visible = false;

function space_show()
{
    $(g_space_viewportDiv).show();
    $(g_space_controlsButton).show();

    g_scrollingLog.setHeight(null);
    g_scrollingLog.setOpacity(1);

    g_space_visible = true;
}

function space_hide()
{
    $(g_space_viewportDiv).hide();
    $(g_space_controlsButton).hide();

    g_space_visible = false;
}

function space_toggle()
{
    if (g_space_visible)
        space_hide();
    else
        space_show();
}

var g_parsed_points = null;
var g_parsed_freesound_tags_indexed = null;
var g_parsed_sound_index = null;

function space_enter()
// Params:
//  g_spaceParam_wantedTags:
//   (array of string)
//  g_spaceParam_unwantedTags:
//   (array of string)
//  g_spaceParam_bpm:
//   (number)
{
    g_sequencer.setTempo(g_spaceParam_bpm);

    // Reset camera to default position and orientation
    g_camera.position.set(0, 0, 0);
    g_camera.rotation.setFromVector3(new THREE.Vector3(0,0,0));

    //g_fullScreenFragmentShader = new FullScreenFragmentShader();

    // If not done already, convert loaded JSON texts to objects
    // (this may cause jank)
    if (g_parsed_points === null)
        g_parsed_points = JSON.parse(g_space_assetLoader.loaded["points"]);
    if (g_parsed_freesound_tags_indexed === null)
        g_parsed_freesound_tags_indexed = JSON.parse(g_space_assetLoader.loaded["freesound_tags_indexed"]);
    if (g_parsed_sound_index === null)
        g_parsed_sound_index = JSON.parse(g_space_assetLoader.loaded["sound_index"]);

    // + Count total data points in loaded JSON {{{

    var dataPointCount;

    // If points loaded and converted from JSON are in format where the top-level of the structure is an array,
    // count them as you do for an array
    if (g_parsed_points.constructor === Array)
    {
        dataPointCount = g_parsed_points.length;
    }
    // Else if points loaded and converted from JSON are in format where the top-level of the structure is an object,
    // count them as you do for an object
    else if (g_parsed_points.constructor === Object)
    {
        dataPointCount = Object.keys(g_parsed_points).length;
    }
    // Else if points loaded and converted from JSON are in some other format,
    // abort with error
    else
    {
        g_scrollingLog.addText("Loaded points aren't in either array or object format! Giving up.");
        throw "Loaded points aren't in either array or object format! Giving up.";
    }

    // + }}}

    // + Select which data points of loaded JSON to use {{{

    // + + Select points, determine sound URLs {{{

    var selectedPointInfos = [];

    function soundHasTag(i_soundId, i_tagName)
    // Check whether a Freesound sound has a particular tag.
    //
    // Params:
    //  i_soundId:
    //
    //  i_tagName:
    //   (string)
    //
    // Returns:
    //  (boolean)
    {
        var tagInfo = g_parsed_freesound_tags_indexed[i_soundId];
        if (!tagInfo)
            return false;
        if (tagInfo["tags"].indexOf(i_tagName) == -1)
            return false;
        return true;
    }

    function soundHasTagFromList(i_soundId, i_tagNames)
    // Check whether a Freesound sound has any one of a list of tags.
    //
    // Params:
    //  i_soundId:
    //
    //  i_tagName:
    //   (array of string)
    //
    // Returns:
    //  (boolean)
    {
        for (var tagNameCount = i_tagNames.length, tagNameNo = 0; tagNameNo < tagNameCount; ++tagNameNo)
        {
            var tagName = i_tagNames[tagNameNo];

            if (soundHasTag(i_soundId, tagName))
                return true;
        }

        return false;
    }

    //
    function selectSourcePoint(i_point)
    {
        if (!g_soundsAlreadyFiltered)
        {
            // If any particular tags were asked for,
            // then if the current point sound doesn't have any of those tags, bail out from this function to exclude it
            // (but if no particular tags were asked for, do nothing to let everything through)
            if (g_spaceParam_wantedTags.length > 0)
            {
                if (!soundHasTagFromList(i_point.id, g_spaceParam_wantedTags))
                    return;
            }

            // If the current point sound has any tags that were specifically chosen as unwanted,
            // bail out from this function to exclude it
            if (soundHasTagFromList(i_point.id, g_spaceParam_unwantedTags))
                return;
        }

        // Determine sound URL
        var soundUrl;
        switch (k_soundSource)
        {
        case "pattern":
            soundUrl = k_soundSource_pattern.replace("*", i_point.id);
            break;
        case "index":
            if (!(i_point.id in g_parsed_sound_index))
            {
                console.log("Don't have a sound_index entry for " + i_point.id.toString() + " so don't know URL, skipping");
                return;
            }
            soundUrl = g_parsed_sound_index[i_point.id]["url"];
            break;
        }
        //  Convert it from http to https if it isn't already
        if (soundUrl.substr(0, 7) == "http://")
            soundUrl = "https://" + soundUrl.substr(7);

        //
        selectedPointInfos.push([i_point, soundUrl]);
    }

    // If points loaded and converted from JSON are in format where the top-level of the structure is an array,
    // iterate them as you do for an array
    if (g_parsed_points.constructor === Array)
    {
        for (var dataPointNo = 0; dataPointNo < dataPointCount; ++dataPointNo)
        {
            var point = g_parsed_points[dataPointNo];
            selectSourcePoint(point);
        }
    }
    // Else if points loaded and converted from JSON are in format where the top-level of the structure is an object,
    // iterate them as you do for an object
    else if (g_parsed_points.constructor === Object)
    {
        for (var dataPointId in g_parsed_points)
        {
            var point = g_parsed_points[dataPointId];
            point.id = dataPointId;
            selectSourcePoint(point);
        }
    }

    // + + }}}

    // + + Show info about selected points {{{

    var selectedPoints_minPositions = {
        x: Infinity,
        y: Infinity,
        z: Infinity
    };
    var selectedPoints_maxPositions = {
        x: -Infinity,
        y: -Infinity,
        z: -Infinity
    };
    for (var selectedPointInfoCount = selectedPointInfos.length, selectedPointInfoNo = 0; selectedPointInfoNo < selectedPointInfoCount; ++selectedPointInfoNo)
    {
        var selectedPointInfo = selectedPointInfos[selectedPointInfoNo];

        if (selectedPointInfo[0].x < selectedPoints_minPositions.x)
            selectedPoints_minPositions.x = selectedPointInfo[0].x;
        if (selectedPointInfo[0].y < selectedPoints_minPositions.y)
            selectedPoints_minPositions.y = selectedPointInfo[0].y;
        if (selectedPointInfo[0].z < selectedPoints_minPositions.z)
            selectedPoints_minPositions.z = selectedPointInfo[0].z;

        if (selectedPointInfo[0].x > selectedPoints_maxPositions.x)
            selectedPoints_maxPositions.x = selectedPointInfo[0].x;
        if (selectedPointInfo[0].y > selectedPoints_maxPositions.y)
            selectedPoints_maxPositions.y = selectedPointInfo[0].y;
        if (selectedPointInfo[0].z > selectedPoints_maxPositions.z)
            selectedPoints_maxPositions.z = selectedPointInfo[0].z;
    }

    var boundingBoxVolume =
        (selectedPoints_maxPositions.x - selectedPoints_minPositions.x) *
        (selectedPoints_maxPositions.y - selectedPoints_minPositions.y) *
        (selectedPoints_maxPositions.z - selectedPoints_minPositions.z);

    var selectedPointSummary = "Selected " + selectedPointInfos.length.toString() + " points" +
        ", bounding box: [" + selectedPoints_minPositions.x.toString() + ", " + selectedPoints_minPositions.y.toString() + ", " + selectedPoints_minPositions.z.toString() + "]" +
        " .. [" + selectedPoints_maxPositions.x.toString() + ", " + selectedPoints_maxPositions.y.toString() + ", " + selectedPoints_maxPositions.z.toString() + "]" +
        ", volume: " + boundingBoxVolume.toString();
    g_scrollingLog.addText(selectedPointSummary);
    console.log(selectedPointSummary);

    // + + }}}

    // + }}}

    // + Load data points, creating space-specific structures {{{

    g_soundSites.length = 0;

    // + + Create sound sites {{{

    var volumePerSound = dan.getParameterValueFromQueryString("volumePerSound");
    if (volumePerSound == "")
        volumePerSound = 4191178.822507101;
    else
        volumePerSound = parseFloat(volumePerSound);
    // was (reverse calculated using point count of tsne_splash.json of 376): 4191178.822507101

    var targetVolume = dan.getParameterValueFromQueryString("targetVolume");
    if (targetVolume == "")
        targetVolume = volumePerSound * selectedPointInfos.length;
    else
        targetVolume = parseFloat(targetVolume);
    // was (reverse calculated using bounding box volume of tsne_splash.json of 196985.40465783377): 1575883237.26267016

    var volumeExpansionFactor = dan.getParameterValueFromQueryString("volumeExpansionFactor");
    if (volumeExpansionFactor == "")
        volumeExpansionFactor = targetVolume / boundingBoxVolume;
    else
        volumeExpansionFactor = parseFloat(volumeExpansionFactor);
    // was: 8000

    var coordinateExpansionFactor = dan.getParameterValueFromQueryString("coordinateExpansionFactor");
    if (coordinateExpansionFactor == "")
        coordinateExpansionFactor = Math.pow(volumeExpansionFactor, 1/3);
    else
        coordinateExpansionFactor = parseFloat(coordinateExpansionFactor);
    // was: 20

    for (var selectedPointInfoCount = selectedPointInfos.length, selectedPointInfoNo = 0; selectedPointInfoNo < selectedPointInfoCount; ++selectedPointInfoNo)
    {
        var selectedPointInfo = selectedPointInfos[selectedPointInfoNo];

        // Create sound site
        var soundSite = new SoundSite(g_audioContext, selectedPointInfo[0],
                                      selectedPointInfo[1],
                                      new THREE.Vector3(selectedPointInfo[0].x * coordinateExpansionFactor,
                                                        selectedPointInfo[0].y * coordinateExpansionFactor,
                                                        selectedPointInfo[0].z * coordinateExpansionFactor),
                                      g_soundSites.length);
        g_soundSites.push(soundSite);
    }

    // + }}}

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

        var firstFamily = g_parsed_freesound_tags_indexed[soundSite.soundId]["families"][0];
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

    // + Create points in a BufferGeometry {{{

    // Make a THREE.BufferGeometry that contains 'position' and 'alpha' vertex attributes,
    // with the components of those things split and flattened into typed arrays

    g_bufferGeometry = new THREE.BufferGeometry();

    g_bufferGeometry.addAttribute('position', new THREE.BufferAttribute(g_bufferGeometry_positions, 3));
    g_bufferGeometry.addAttribute('a_glow', new THREE.BufferAttribute(g_bufferGeometry_glows, 1));
    g_bufferGeometry.addAttribute('a_colour', new THREE.BufferAttribute(g_bufferGeometry_colours, 4));
    g_bufferGeometry.addAttribute('a_spriteUv', new THREE.BufferAttribute(g_bufferGeometry_spriteUvs, 2));

    // Make a renderable THREE.Points object that uses the above buffer geometry
    g_space_scenePoints = new THREE.Points(g_bufferGeometry, g_pointShaderMaterial);

    // Add point objects to scene
    g_scene.add(g_space_scenePoints);

    // + }}}

    g_scrollingLog.addText("... ready!");
    g_scrollingLog.resetEntryTimeouts();
    space_startMainLoop();
}

function space_exit()
{
    g_scene.remove(g_space_scenePoints);
}

function space_startMainLoop()
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

function getSoundSitesAtViewportPosition(i_position)
// Params:
//  i_position:
//   (THREE.Vector2)
//
// Returns:
//  (array of SoundSite)
{
	g_raycaster.params.Points.threshold = 5;
    g_raycaster.setFromCamera(i_position, g_camera);
	var intersections = g_raycaster.intersectObjects(g_scene.children);
    //var pointedAtMeshes = [];
    var pointedAtSoundSites = [];
	for (var intersectionNo = 0; intersectionNo < intersections.length; ++intersectionNo)
    {
        var intersection = intersections[intersectionNo];

        if (intersection.object.constructor === THREE.Points)
        {
            //pointedAtMeshes.push(intersection.object);
            pointedAtSoundSites.push(g_soundSites[intersection.index]);
        }
	}

    return pointedAtSoundSites;
}

function flyTowardsPoint(i_point)
// Params:
//  i_point:
//   (THREE.Vector3)
//
// Returns:
//  (boolean)
{
    var k_stopAtDistance = 10;

    var cameraDirection = g_camera.getWorldDirection();
    var cameraToTarget = i_point.clone().sub(g_camera.position);
    cameraToTarget_length = cameraToTarget.length();
    cameraToTarget.divideScalar(cameraToTarget_length);

    // Rotate
    var rotationAxis = cameraDirection.clone().cross(cameraToTarget);
    var rotationAngle = Math.asin(rotationAxis.length());
    if (rotationAngle != 0)
    {
        rotationAngle /= 10;
        rotationAxis.normalize();

        var rotationInWorldSpace = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAngle);
        g_camera.quaternion.multiplyQuaternions(rotationInWorldSpace, g_camera.quaternion);
    }

    // Move forward
    if (cameraToTarget_length > k_stopAtDistance)
    {
        //g_camera.translateZ(-i_movementStep);
        g_camera.translateZ(-cameraToTarget_length / 20);
    }

    //
    return cameraToTarget_length > k_stopAtDistance || rotationAngle > 0.0001;
}

var g_showSoundSiteIdsOnMouseover = false;

function animate()
{
    requestAnimationFrame(animate);

    //
    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    if (g_autoFlyToSoundSite)
    {
        if (!flyTowardsPoint(g_autoFlyToSoundSite.position))  //, g_controls.movementSpeed * delta))
            g_autoFlyToSoundSite = null;
    }

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

	g_controls.update(delta);

    // Show current position
    //g_scrollingLog.addText(threeVector3ToString(new THREE.Vector3().setFromMatrixPosition(g_camera.matrix)));

    // Light up recently played stars
    var timeInSeconds = time / 1000;
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        g_bufferGeometry_glows[soundSiteNo] = 1.0 - dan.clamp(timeInSeconds - soundSite.lastTriggerTime, 0, 1);
    }
    g_bufferGeometry.attributes.a_glow.needsUpdate = true;


    // Show/hide all range wireframes according to current setting
    /*
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

		soundSite.rangeSphereMesh.visible = g_showSoundSiteRanges;
    }
    */

    //
    g_renderer.autoClear = false;
    g_renderer.resetGLState();
    g_renderer.render(g_scene, g_camera);

    GL.resetToGlState();
    GL.setCull({ enabled: false });

    // + Mouse picking {{{

    if (g_showSoundSiteIdsOnMouseover)
    {
        var pointedAtSoundSites = getSoundSitesAtViewportPosition(new THREE.Vector2(g_mousePositionInViewport_normalized[0], -g_mousePositionInViewport_normalized[1]));

        for (var pointedAtSoundSiteCount = pointedAtSoundSites.length, pointedAtSoundSiteNo = 0; pointedAtSoundSiteNo < pointedAtSoundSiteCount; ++pointedAtSoundSiteNo)
        {
            var pointedAtSoundSite = pointedAtSoundSites[pointedAtSoundSiteNo];

            var positionInClipSpace = pointedAtSoundSite.position.clone().applyMatrix4(g_camera.matrixWorldInverse).applyMatrix4(g_camera.projectionMatrix);
            //g_scrollingLog.addText("pointing at: " + pointedAtSoundSite.soundId + ", " + Vector3_toString(p) + ", " + Vector3_toString(positionInClipSpace));

            var boundingClientRect = g_space_viewportDiv.getBoundingClientRect();
            var positionInViewport = new dan.math.Vector2.fromXY((positionInClipSpace.x + 1) / 2 * boundingClientRect.width,
                                                                 (-positionInClipSpace.y + 1) / 2 * boundingClientRect.height);
            //positionInViewport[0] -= 12;
            //g_scrollingLog.addText("pointing at: " + pointedAtSoundSite.soundId + ", " + Vector2_toString(positionInViewport));
            g_danCanvas.drawTextT(g_droidSansMono14TextureFont, pointedAtSoundSite.soundId.toString(), new dan.gfx.ColourRGBA(0, 0, 0, 1), dan.math.Vector2.add(positionInViewport, [1, 1]));
            g_danCanvas.drawTextT(g_droidSansMono14TextureFont, pointedAtSoundSite.soundId.toString(), new dan.gfx.ColourRGBA(1, 1, 1, 1), positionInViewport);
        }
    }

    // + }}}

    if (g_showSequence)
    {
        g_sequencer.requery();
        g_sequencer.relayout();
        g_sequencer.draw();
    }

    g_danCanvas.flush();

    g_scrollingLog.removeTimedOutEntries();
}
