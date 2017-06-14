var g_camera;
var g_scene;
var g_renderer;
var g_controls;

var g_raycaster;

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
/*
var blocker = document.getElementById("blocker");
var instructions = document.getElementById("instructions");

var havePointerLock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
if (havePointerLock)
{
    var element = document.body;

    var pointerlockchange = function (event)
    {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
        {
            g_controlsEnabled = true;
            g_controls.enabled = true;

            blocker.style.display = "none";
        }
        else
        {
            g_controls.enabled = false;

            blocker.style.display = "-webkit-box";
            blocker.style.display = "-moz-box";
            blocker.style.display = "box";

            instructions.style.display = "";

        }

    };

    var pointerlockerror = function (event) {

        instructions.style.display = "";

    };

    // Hook pointer lock state change events
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

    document.addEventListener("pointerlockerror", pointerlockerror, false);
    document.addEventListener("mozpointerlockerror", pointerlockerror, false);
    document.addEventListener("webkitpointerlockerror", pointerlockerror, false);

    instructions.addEventListener("click", function (event) {

        instructions.style.display = "none";

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

    }, false);

} else {

    instructions.innerHTML = "Your browser doesn\"t seem to support Pointer Lock API";

}
*/

// + Audio {{{

g_audioContext = dan.snd.getAudioContext();

// + }}}

// + Sound site {{{

var k_distanceAtWhichSoundIsSilent = 200;
var g_showSoundSiteRanges = false;

function SoundSite(i_audioContext, i_soundId, i_url,
                   i_position, i_geometry, i_material)
// Params:
//  i_audioContext:
//   (AudioContext)
//  i_soundId:
//   (string)
//  i_url:
//   (string)
//  i_position:
//   (THREE.Vector3)
//  i_geometry:
//   (THREE.Geometry)
//  i_material:
//   (THREE.Material)
{
    this.m_audioContext = i_audioContext;
    this.soundId = i_soundId;
    this.soundUrl = i_url;

    // Graphic object
    this.mesh = new THREE.Mesh(i_geometry, i_material);
    this.mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    this.mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    this.mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;

    this.rangeSphereGeometry = new THREE.SphereGeometry(k_distanceAtWhichSoundIsSilent, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: 0xffff88});
    material.wireframe = true;
    this.rangeSphereMesh = new THREE.Mesh(this.rangeSphereGeometry, material);
    this.rangeSphereMesh.position.x = this.mesh.position.x;
    this.rangeSphereMesh.position.y = this.mesh.position.y;
    this.rangeSphereMesh.position.z = this.mesh.position.z;
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

                // PROTOTYPE: Start the sound playing in an endless loop (though muted)
                me.audioSourceNode.loop = true;
                me.audioSourceNode.loopStart = 0;
                //console.log(me.sampleCount / i_decodedBuffer.sampleRate);
                //me.audioSourceNode.loopEnd = me.sampleCount / i_decodedBuffer.sampleRate;
                me.gainNode.gain.value = 0;
                me.start();
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
    i_scene.add(this.rangeSphereMesh);
};

// + + }}}

SoundSite.prototype.getPosition = function ()
// Get the position of this SoundSite.
//
// Returns:
//  (THREE.Vector3)
{
    // Use 'position' in the graphic object as the canonical store of the SoundSite's position for now
    return this.mesh.position;
};

// + + SoundSite instances {{{

var g_soundSites = [];

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

function init()
{
    g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    g_scene = new THREE.Scene();
    g_scene.fog = new THREE.Fog(0xffffff, 0, 750);

    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    g_scene.add(light);

    var infoTextDiv = document.createElement("div");
    infoTextDiv.setAttribute("id", "infoText");
    document.body.appendChild(infoTextDiv);

    g_viewportDiv = document.createElement("div");
    document.body.appendChild(g_viewportDiv);
    document.body.addEventListener("mousemove", body_onMouseMove);

    //g_controls = new THREE.PointerLockControls(g_camera);
    g_controls = new THREE.FlyControls(g_camera);
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

    // Floor
    var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    for (var vertexCount = floorGeometry.vertices.length, vertexNo = 0; vertexNo < vertexCount; ++vertexNo)
    {
        var vertex = floorGeometry.vertices[vertexNo];
        vertex.x += Math.random() * 20 - 10;
        vertex.y = -5;
        vertex.z += Math.random() * 20 - 10;
    }

    for (var faceCount = floorGeometry.faces.length, faceNo = 0; faceNo < faceCount; ++faceNo)
    {
        var face = floorGeometry.faces[faceNo];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    }

    var floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

    var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    g_scene.add(floorMesh);

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

function loadSoundAndAddSoundSite(i_soundSiteName, i_url, i_position,
                                  i_onReady)
// Params:
//  i_soundSiteName:
//   (string)
//  i_url:
//   (string)
//  i_position:
//   (THREE.Vector3)
//  i_onReady:
//   Either (function)
//    Called back when the sound file has loaded and is ready to be played.
//   or (null or undefined)
//    Don't get a callback.
{
    // PROTOTYPE:
    // Create a material to be used by the next sound site, with random colour
    var soundSiteMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
    soundSiteMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

    //
    var soundSite = new SoundSite(g_audioContext, i_soundSiteName, i_url, i_position,
                                  g_soundSiteGeometry, soundSiteMaterial,
                                  true,
                                  i_onReady);
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

    // Trigger first frame
    animate();

    //
    loadResultsOfFreesoundSearchIntoSoundSites("dogs");
}

function onWindowResize()
{
    g_camera.aspect = window.innerWidth / window.innerHeight;
    g_camera.updateProjectionMatrix();

    g_renderer.setSize(window.innerWidth, window.innerHeight);
}

var distances = [];
function animate()
{
    requestAnimationFrame(animate);

    // For each sound site, get distance from camera,
    // and if close enough then load/start the sound playing if necessary,
    // and adjust gain based on closeness
    distances.length = 0;
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

        var distance = soundSite.getPosition().distanceTo(g_camera.position);

        var closeness = (k_distanceAtWhichSoundIsSilent - distance) / k_distanceAtWhichSoundIsSilent;
        closeness = Math.max(closeness, 0);

        distances.push(closeness);  // for debugging
        soundSite.setGain(closeness);
        //soundSite.setGain(1.0);
        if (closeness > 0)
        {
            soundSite.loadSamplesIfNeededAndStartPlaying();
        }
    }
    //console.log(distances);

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

    var message = "";
    for (var pointedAtSoundSiteCount = pointedAtSoundSites.length, pointedAtSoundSiteNo = 0; pointedAtSoundSiteNo < pointedAtSoundSiteCount; ++pointedAtSoundSiteNo)
    {
        var pointedAtSoundSite = pointedAtSoundSites[pointedAtSoundSiteNo];

		pointedAtSoundSite.mesh.material.color.set(0xff0000);
        message += pointedAtSoundSite.soundId + "\n";
    }
    document.body.querySelector("#infoText").innerText = message;

    // Show/hide all range wireframes according to current setting
    for (var soundSiteCount = g_soundSites.length, soundSiteNo = 0; soundSiteNo < soundSiteCount; ++soundSiteNo)
    {
        var soundSite = g_soundSites[soundSiteNo];

		soundSite.rangeSphereMesh.visible = g_showSoundSiteRanges;
    }

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

	g_controls.movementSpeed = 300;
	g_controls.update(delta);

    g_renderer.render(g_scene, g_camera);
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

function loadResultsOfFreesoundSearchIntoSoundSites(i_nameQuery)
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
    });
}

function fstest2()
{
    var audioMediaElement = new Audio("https://www.freesound.org/data/previews/242/242403_4165591-lq.mp3");

    // Create a MediaElementAudioSourceNode to draw from the above Audio node
    var mediaElementAudioSourceNode = g_audioContext.createMediaElementSource(audioMediaElement);
}

// + }}}
