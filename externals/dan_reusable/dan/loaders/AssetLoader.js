
// This namespace
// #require "loaders.js"

// jQuery
//// #require <jquery-1.8.2.min.js>

// Dan reusable
// #require <dan/snd/snd.js>


dan.loaders.AssetLoader = function ()
{
    this.loading = {};
    // Assets that are currently loading.
    //
    // Keys:
    //  (string)
    //  A short name used to refer to the asset, provided by user when initiating a load.
    // Values:
    //  (Promise)
    //  A work object representing the load.

    this.failed = {};
    // Assets that failed to load.
    //
    // Keys:
    //  (string)
    //  A short name used to refer to the asset, provided by user when initiating a load.
    // Values:
    //  (string)
    //  A description of the error that occurred.

    this.loaded = {};
    // Assets that have successfully finished loading.
    //
    // Keys:
    //  (string)
    //  A short name used to refer to the asset, provided by user when initiating a load.
    // Values:
    //  The fully loaded asset. The actual type depends on the type of asset.
    //  eg. if an image, this will be an HTMLImageElement,
    //  if text, this will be a string,
    //  or if a Three.js texture, this will be a THREE.Texture.
    //  See the relevant loadXXX() function comments for details in each case.
};

dan.loaders.AssetLoader.prototype._generateUniqueKey = function ()
{
    var no = 0;
    while (true)
    {
        newKey = "_anon" + no.toString();
        if (!this.loading.hasOwnProperty(newKey) &&
            !this.failed.hasOwnProperty(newKey) &&
            !this.loaded.hasOwnProperty(newKey))
        {
            return newKey;
        }
        ++no;
    }
};

dan.loaders.AssetLoader.prototype.all = function ()
// Returns:
//  (Promise)
//  Resolves when all the currently loading promises resolve, or rejects when one of the currently loading promises is rejected.
{
    return Promise.all(Object.values(this.loading));
};


dan.loaders.AssetLoader.prototype.loadImage = function (i_url, i_key)
// Load an image into an HTMLImageElement.
//
// Params:
//  i_url:
//   (string)
//   Path to load image from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the asset by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     asset:
//      (HTMLImageElement)
//      The loaded text.
//     url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//  Else if it fails, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     errorDescription:
//      (string)
//      A description of the error.
//     url:
//      (string)
//      As for the fulfilled handler.
//     key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Create promise and store it in this.loading
    var self = this;
    this.loading[i_key] = new Promise(function (i_resolve, i_reject) {

        var imageElement = new Image();

        imageElement.onload = function (i_event) {
            // Remove promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = imageElement;

            // Resolve the promise
            i_resolve({
                key: i_key,
                url: i_url,
                asset: imageElement
            });
        };

        imageElement.onerror = function (i_event) {
            var errorDescription = "";

            // Remove promise from this.loading, put error description in this.failed
            delete self.loading[i_key];
            self.failed[i_key] = errorDescription;

            // Reject the promise
            i_reject({
                key: i_key,
                url: i_url,
                errorDescription: errorDescription
            });
        };

        // Start the load
        imageElement.src = i_url;
    });

    // Return the promise
    return this.loading[i_key];
};

dan.loaders.AssetLoader.prototype.loadAudioElement = function (i_url, i_key)
// Load audio into an HTMLAudioElement.
//
// Params:
//  i_url:
//   (string)
//   Path to load audio from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the audio by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     asset:
//      (HTMLAudioElement)
//      The new audio element.
//     url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//  Else if it fails, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     errorDescription:
//      (string)
//      An empty string (unfortunately don't know how to get an error description in this case).
//     url:
//      (string)
//      As for the fulfilled handler.
//     key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Create promise and store it in this.loading
    var self = this;
    this.loading[i_key] = new Promise(function (i_resolve, i_reject) {

        var audioElement = new Audio();

        // 'oncanplaythrough': http://stackoverflow.com/a/8059487
        audioElement.oncanplaythrough = function (i_event) {
            // Remove promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = audioElement;

            // Resolve the promise
            i_resolve({
                key: i_key,
                url: i_url,
                asset: audioElement
            });
        };

        audioElement.onerror = function (i_event) {
            var errorDescription = "";

            // Remove promise from this.loading, put error description in this.failed
            delete self.loading[i_key];
            self.failed[i_key] = errorDescription;

            // Reject the promise
            i_reject({
                key: i_key,
                url: i_url,
                errorDescription: errorDescription
            });
        };

        // Start the load
        audioElement.src = i_url;
    });

    // Return the promise
    return this.loading[i_key];
};

dan.loaders.AssetLoader.prototype.loadAudioBuffer = function (i_url, i_key)
// Load audio and decode into a Web Audio API AudioBuffer.
//
// Params:
//  i_url:
//   (string)
//   Path to load audio from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the audio by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     asset:
//      (AudioBuffer)
//      The audio, decoded.
//     url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//  Else if it fails, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     errorDescription:
//      (string)
//      A description of the error.
//     url:
//      (string)
//      As for the fulfilled handler.
//     key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Create promise and store it in this.loading
    var self = this;
    this.loading[i_key] = new Promise(function (i_resolve, i_reject) {

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
                            // Remove promise from this.loading, put asset in this.loaded
                            delete self.loading[i_key];
                            self.loaded[i_key] = i_decodedData;

                            // Resolve the promise
                            i_resolve({
                                key: i_key,
                                url: i_url,
                                asset: i_decodedData
                            });
                        },
                        function onDecodeError() {
                            var errorDescription = "AudioContext.decodeAudioData() failed";

                            // Remove promise from this.loading, put error description in this.failed
                            delete self.loading[i_key];
                            self.failed[i_key] = errorDescription;

                            // Reject the promise
                            i_reject({
                                key: i_key,
                                url: i_url,
                                errorDescription: errorDescription
                            });
                        }
                    );
                }
                // Else if failed
                else
                {
                    var errorDescription = xhr.status + " " + xhr.statusText;

                    // Remove promise from this.loading, put error description in this.failed
                    delete self.loading[i_key];
                    self.failed[i_key] = errorDescription;

                    // Reject the promise
                    i_reject({
                        key: i_key,
                        url: i_url,
                        errorDescription: errorDescription
                    });
                }
            }
        };

        // Start asynchronous request
        xhr.send(null);
    });

    // Return the promise
    return this.loading[i_key];
};

dan.loaders.AssetLoader.prototype.loadText = function (i_url, i_key)
// Params:
//  i_url:
//   (string)
//   Path to load text from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the asset by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     asset:
//      (string)
//      The loaded text.
//     url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//  Else if it fails, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     errorDescription:
//      (string)
//      A description of the error.
//     url:
//      (string)
//      As for the fulfilled handler.
//     key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Create promise and store it in this.loading
    var self = this;
    this.loading[i_key] = new Promise(function (i_resolve, i_reject) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", i_url, true);
        xhr.responseType = "text";
        xhr.onreadystatechange = function ()
        {
            // If done
            if (xhr.readyState == 4)
            {
                // If successful
                if (xhr.status == 200)
                {
                    // Remove promise from this.loading, put asset in this.loaded
                    delete self.loading[i_key];
                    self.loaded[i_key] = xhr.responseText;

                    // Resolve the promise
                    i_resolve({
                        key: i_key,
                        url: i_url,
                        asset: xhr.responseText
                    });
                }
                // Else if failed
                else
                {
                    var errorDescription = xhr.status + " " + xhr.statusText;

                    // Remove promise from this.loading, save error description in this.failed
                    delete self.loading[i_key];
                    self.failed[i_key] = errorDescription;

                    // Reject the promise
                    i_reject({
                        key: i_key,
                        url: i_url,
                        errorDescription: errorDescription
                    });
                }
            }
        };

        // Start asynchronous request
        xhr.send(null);
    });

    // Return the promise
    return this.loading[i_key];
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

dan.loaders.AssetLoader.prototype.loadJson = function (i_url, i_key)
// Params:
//  i_url:
//   (string)
//   Path to load json from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the asset by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     asset:
//      (object)
//      The loaded and parsed json.
//     url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//  Else if it fails, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     errorDescription:
//      (string)
//      A description of the error.
//     url:
//      (string)
//      As for the fulfilled handler.
//     key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Call loadJson(),
    // augment the resulting promise with our own cleanup behaviour,
    // store augmented promise in this.loading
    var self = this;
    this.loading[i_key] = dan.loaders.loadJson2(i_url).then(
        function onResolved(i_json) 
        {
            // Remove augmented promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_json;

            // Resolve augmented promise with this returned value
            return {
                key: i_key,
                url: i_url,
                asset: self.loaded[i_key]
            };
        },
        function onRejected(i_errorDescription) 
        {
            // Remove promise from this.loading, save error description in this.failed
            delete self.loading[i_key];
            self.failed[i_key] = i_errorDescription;

            // Reject augmented promise with this thrown value
            throw {
                key: i_key,
                url: i_url,
                errorDescription: i_errorDescription
            };
        }
    );

    // Return the promise
    return this.loading[i_key];
};

dan.loaders.loadJson2 = function (i_url)
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
//    Object has properties:
//     asset:
//      (object)
//      The loaded and parsed json.
//     url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//  Else if it fails, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     errorDescription:
//      (string)
//      A description of the error.
//     url:
//      (string)
//      As for the fulfilled handler.
//     key:
//      (string)
//      As for the fulfilled handler.
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

dan.loaders.AssetLoader.prototype.loadXml = function (i_url, i_key)
// Load an XML file from a URL, into an XML document.
//
// Params:
//  i_url:
//   (string)
//   Path to load XML from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the XML document by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     asset:
//      (object)
//      The loaded document.
//     url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//  Else if it fails, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     errorDescription:
//      (string)
//      A description of the error.
//     url:
//      (string)
//      As for the fulfilled handler.
//     key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Create promise and store it in this.loading
    var self = this;
    this.loading[i_key] = new Promise(function (i_resolve, i_reject) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", i_url, true);
        xhr.responseType = "xml";
        xhr.onreadystatechange = function ()
        {
            // If done
            if (xhr.readyState == 4)
            {
                // If successful
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

                    // Remove promise from this.loading, put asset in this.loaded
                    delete self.loading[i_key];
                    self.loaded[i_key] = responseXml;

                    // Resolve the promise
                    i_resolve({
                        key: i_key,
                        url: i_url,
                        asset: responseXml
                    });
                }
                // Else if failed
                else
                {
                    var errorDescription = xhr.status + " " + xhr.statusText;

                    // Remove promise from this.loading, save error description in this.failed
                    delete self.loading[i_key];
                    self.failed[i_key] = errorDescription;

                    // Reject the promise
                    i_reject({
                        key: i_key,
                        url: i_url,
                        errorDescription: errorDescription
                    });
                }
            }
        };

        // Start asynchronous request
        xhr.send(null);
    });

    // Return the promise
    return this.loading[i_key];
};


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
