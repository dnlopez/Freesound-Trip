// #require <dan/dan.js>

if (typeof(dan.loaders) === "undefined")
    dan.loaders = {};


// + Static {{{

dan.loaders.loadDelay = function (i_loadTime)
// Simulate a load that takes some period of time.
// Nothing is actually loaded; this is just for debug purposes.
//
// Params:
//  i_loadTime:
//   (float number)
//   Time in seconds to pretend to load for.
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  When it resolves, handlers watching for that state have params:
//   -
//  Else if it fails (which should never happen), handlers watching for that state have params:
//   -
{
    // Create promise and return it
    return new Promise(function (i_resolve, i_reject) {

        setTimeout(function () {
            // When finished waiting,
            // resolve the promise
            i_resolve();
        }, i_loadTime * 1000.0);

    });
};

dan.loaders.loadImage = function (i_url)
// Load an image into an HTMLImageElement.
//
// Params:
//  i_url:
//   (string)
//   Path to load image from.
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (HTMLImageElement)
//    The loaded image.
//  Else if it fails, handlers watching for that state have params:
//   i_errorDescription:
//    (string)
//    A description of the error.
{
    // Create promise and return it
    return new Promise(function (i_resolve, i_reject) {

        var imageElement = new Image();

        imageElement.onload = function (i_event) {
            // If successful,
            // resolve the promise with the image element
            i_resolve(imageElement);
        };

        imageElement.onerror = function (i_event) {
            // Else if failed,
            // reject the promise with an error description [don't actually have one though]
            i_reject("");
        };

        // Start the load
        imageElement.src = i_url;
    });
};

dan.loaders.loadAudioElement = function (i_url)
// Load audio into an HTMLAudioElement.
//
// Params:
//  i_url:
//   (string)
//   Path to load audio from.
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (HTMLAudioElement)
//    The new audio element, which is now ready to play through.
//  Else if it fails, handlers watching for that state have params:
//   i_errorDescription:
//    (string)
//    An empty string (unfortunately don't know how to get an error description in this case).
{
    // Create promise and return it
    return new Promise(function (i_resolve, i_reject) {

        var audioElement = new Audio();

        // 'oncanplaythrough': http://stackoverflow.com/a/8059487
        audioElement.oncanplaythrough = function (i_event) {
            // If successful,
            // resolve the promise with the audio element
            i_resolve(audioElement);
        };

        audioElement.onerror = function (i_event) {
            // Else if failed,
            // reject the promise with an error description [don't actually have one though]
            i_reject("");
        };

        // Start the load
        audioElement.src = i_url;
    });
};

dan.loaders.loadAudioBuffer = function (i_url)
// Load audio and decode into a Web Audio API AudioBuffer.
//
// Params:
//  i_url:
//   (string)
//   Path to load audio from.
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (AudioBuffer)
//    The audio, decoded.
//  Else if it fails, handlers watching for that state have params:
//   i_errorDescription:
//    (string)
//    A description of the error.
{
    // Create promise and return it
    return new Promise(function (i_resolve, i_reject) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", i_url, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function ()
        {
            // If done
            if (xhr.readyState == 4)
            {
                // If successful
                if (xhr.status == 200)
                {
                    // Use an audio context to decode the audio data into an AudioBuffer
                    var audioContext = dan.snd.getSingletonAudioContext();
                    audioContext.decodeAudioData(
                        xhr.response,
                        function onDecodeSuccess(i_decodedData) {
                            // If successful,
                            // resolve the promise with the decoded data
                            i_resolve(i_decodedData);
                        },
                        function onDecodeError() {
                            // Else if failed,
                            // reject the promise with an error description
                            i_reject("AudioContext.decodeAudioData() failed");
                        }
                    );
                }
                // Else if failed,
                // reject the promise with an error description
                else
                {
                    i_reject(xhr.status + " " + xhr.statusText);
                }
            }
        };

        // Start asynchronous request
        xhr.send(null);
    });
};

dan.loaders.loadText = function (i_url)
// Params:
//  i_url:
//   (string)
//   Path to load text from.
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (string)
//    The loaded text.
//  Else if it fails, handlers watching for that state have params:
//   i_errorDescription:
//    (string)
//    A description of the error.
{
    // Create promise and return it
    return new Promise(function (i_resolve, i_reject) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", i_url, true);
        xhr.responseType = "text";
        xhr.onreadystatechange = function ()
        {
            // If done
            if (xhr.readyState == 4)
            {
                // If successful,
                // resolve the promise with the loaded text
                if (xhr.status == 200)
                {
                    i_resolve(xhr.responseText);
                }
                // Else if failed,
                // reject the promise with an error description
                else
                {
                    i_reject(xhr.status + " " + xhr.statusText);
                }
            }
        };

        // Start asynchronous request
        xhr.send(null);
    });
};

dan.loaders.loadJson = function (i_url)
// Params:
//  i_url:
//   (string)
//   Path to load json from.
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    The loaded and parsed json.
//  Else if it fails, handlers watching for that state have params:
//   i_errorDescription:
//    (string)
//    A description of the error.
{
    // Create promise and return it
    return new Promise(function (i_resolve, i_reject) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", i_url, true);
        xhr.responseType = "text";
        xhr.onreadystatechange = function ()
        {
            // If done
            if (xhr.readyState == 4)
            {
                // If successful,
                // resolve the promise with the JSON parsed into an object
                if (xhr.status == 200)
                {
                    i_resolve(JSON.parse(xhr.responseText));
                }
                // Else if failed,
                // reject the promise with an error description
                else
                {
                    i_reject(xhr.status + " " + xhr.statusText);
                }
            }
        };

        // Start asynchronous request
        xhr.send(null);
    });
};

dan.loaders.loadXml = function (i_url)
// Load an XML file from a URL, into an XML document.
//
// Params:
//  i_url:
//   (string)
//   Path to load XML from.
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (XMLDocument[?...])
//    The loaded document.
//  Else if it fails, handlers watching for that state have params:
//   i_errorDescription:
//    (string)
//    A description of the error.
{
    // Create promise and return it
    return new Promise(function (i_resolve, i_reject) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", i_url, true);
        xhr.responseType = "xml";
        xhr.onreadystatechange = function ()
        {
            // If done
            if (xhr.readyState == 4)
            {
                // If successful,
                // resolve the promise with the XML parsed into a document
                if (xhr.status == 200)
                {
                    // If response came down as XML,
                    // simply save the reference to it
                    var responseXml;
                    if (xhr.responseXML)
                    {
                        responseXml = xhr.responseXML;
                    }
                    // Else if response came down as text,
                    // use a DOMParser to parse it to an XML document
                    else if (xhr.responseText)
                    {
                        var xmlParser = new DOMParser();
                        responseXml = xmlParser.parseFromString(xhr.responseText, "application/xml");
                    }

                    // Resolve the promise
                    i_resolve(responseXml);
                }
                // Else if failed,
                // reject the promise with an error description
                else
                {
                    i_reject(xhr.status + " " + xhr.statusText);
                }
            }
        };

        // Start asynchronous request
        xhr.send(null);
    });
};

dan.loaders.loadTextSynchronously = function (i_url)
// Params:
//  i_url:
//   (string)
//   Path to load text from.
//
// Returns:
//  Either (string)
//   The loaded text
//  or (thrown string)
//   A description of the error that occurred.
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, false);
    //xhr.responseType = "text";  // [Apparently this can't be changed on synchronous requests?]

    // Start synchronous request
    xhr.send(null);

    // If successful
    if (xhr.status == 200)
    {
        return xhr.responseText;
    }
    // Else if failed
    else
    {
        throw xhr.status + " " + xhr.statusText;
    }
};

dan.loaders.loadJsonSynchronously = function (i_url)
// Params:
//  i_url:
//   (string)
//   Path to load json from.
//
// Returns:
//  Either (object)
//   The loaded, parsed json
//  or (thrown string)
//   A description of the error that occurred.
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, false);
    //xhr.responseType = "text";  // [Apparently this can't be changed on synchronous requests?]

    // Start synchronous request
    xhr.send(null);

    // If successful
    if (xhr.status == 200)
    {
        return JSON.parse(xhr.responseText);
    }
    // Else if failed
    else
    {
        throw xhr.status + " " + xhr.statusText;
    }
};

// + }}}

/*
// + Static helpers {{{

dan.loaders.AssetLoader.loadXml(i_url, i_onDone, i_onError, i_onProgress)
// Load an XML file from a URL, into an XML document.
//
// Params:
//  i_url:
//   (string)
//   URL to load from.
//  i_onDone:
//   Either (null)
//    Take no further action when the file has loaded successfully,
//   or (function)
//    Call this function when the file loads successfully
//    Params:
//     i_url:
//      (string)
//      The URL being loaded, as originally passed in at the beginning.
//     i_xml:
//      (XML document)
//      The loaded and parsed document.
//  i_onError:
//   Either (null)
//    Take no further action if an error occurs,
//   or (function)
//    Call this function if an error occurs
//    Params:
//     i_url:
//      (string)
//      The URL being loaded, as originally passed in at the beginning.
//     i_errorDescription:
//      (string)
//      A description of the error.
//  i_onProgress:
//   Either (null)
//    Don't call a function to indicate progress,
//   or (function)
//    Call this function to indicate progress
//    Params:
//     i_url:
//      (string)
//      The URL being loaded, as originally passed in at the beginning.
//     i_totalContentLength:
//      (integer number)
//      Total expected number of bytes.
//     i_loadedLength:
//      (integer number)
//      Number of bytes loaded so far.
//
// Returns:
//  (THREE.Texture)
//  Note that the texture image is loaded asynchronously so it will initially contain a
//  default Image(), later to be replaced by the real thing.
{
    // If don't have XML parsing capability then don't even start
    if (!(document.implementation && document.implementation.createDocument))
    {
        if (i_onError)
            i_onError(i_url, "Don't know how to parse XML!");
        return;
    }

    //
    var contentLength = 0;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function ()
    {
        // If progressing, call progress callback if there is one
        if (request.readyState == 3)
        {
            if (i_onProgress)
            {
                if (contentLength == 0)
                    contentLength = request.getResponseHeader("Content-Length");

                i_onProgress(i_url, contentLength, request.responseText.length);
            }
        }
        // Else if done
        else if (request.readyState == 4)
        {
            if (request.status == 0 || request.status == 200)
            {
                // If response came down as XML,
                // pass the XML document to the parse() function
                if (request.responseXML)
                {
                    i_onDone(i_url, request.responseXML);
                }
                // Else if response came down as text,
                // use a DOMParser to parse it to an XML document then
                // pass the XML document to the parse() function
                else if (request.responseText)
                {
                    var xmlParser = new DOMParser();
                    var responseXML = xmlParser.parseFromString(request.responseText, "application/xml");
                    i_onDone(i_url, responseXML);
                }
                // Else if we have no response, log an error
                else
                {
                    i_onError(i_url, "Empty or non-existing file (" + i_url + ")");
                }
            }
        }
    }

    request.open("GET", i_url, true);
    request.send(null);
};

// + }}}
*/
