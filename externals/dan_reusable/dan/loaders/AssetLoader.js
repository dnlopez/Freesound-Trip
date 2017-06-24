
// This namespace
// #require "loaders.js"

// jQuery
// #require <jquery-1.8.2.min.js>

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
    //  (object)
    //  Key-value pairs:
    //   asset:
    //    A partially loaded asset or an object that otherwise represents it.
    //    The actual type depends on the type of asset being loaded.
    //    eg. if loading an image, this will be an HTMLImageElement whose 'src' has not,
    //    yet finished loading; if loading text, this will be a (empty at this point) string;
    //    or if loading a Three.js texture, this will be a THREE.Texture.
    //    See the relevant loadXXX() function comments for details in each case.
    //   deferred:
    //    (jQuery.Deferred)
    //    An as yet unfulfilled work object representing the load.

    this.failed = {};
    // Assets that failed to load.
    //
    // Keys:
    //  (string)
    //  A short name used to refer to the asset, provided by user when initiating a load.
    // Values:
    //  (object)
    //  Key-value pairs:
    //   asset:
    //    The partially loaded asset or object that otherwise represents it,
    //    or perhaps null if it would be too expensive to keep the partial object around.
    //    The actual type depends on the type of asset being loaded.
    //    See the relevant loadXXX() function comments for details in each case.
    //   deferred:
    //    (jQuery.Deferred)
    //    A now rejected work object that represented the load.
    //   status:
    //    (string)
    //    A description of the error that occurred.

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
//  (jQuery.Promise)
//  Resolves when all the current deferreds resolve, or rejects when one of the current deferreds is rejected.
{
    var deferreds = [];
    for (var key in this.loading)
    {
        var d = this.loading[key].deferred;
        //console.log(d.state());
        deferreds.push(d);
    }
    return $.when.apply($, deferreds);
    // [If just "return $.when(deferreds)" then promise will resolve too early.
    //  Why is apply needed for this to work, again?]
};


dan.loaders.AssetLoader.prototype.loadImage = function (i_url, i_key)
// Params:
//  i_url:
//   (string)
//   Path to load image from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the image by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (object)
//  Key-value pairs:
//   asset:
//    (HTMLImageElement)
//    The new image element, with its src not yet loaded.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (HTMLImageElement)
//      The new image, now with its src loaded.
//     i_url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     i_key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//    Failed handler:
//     i_errorDescription:
//      (string)
//      An empty string (unfortunately don't know how to get an error description in this case).
//     i_url:
//      (string)
//      As for the fulfilled handler.
//     i_key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Start loading image, get partially loaded HTMLImageElement object
    var self = this;
    var partiallyLoadedImage = new Image();

    partiallyLoadedImage.onload = function (i_event) {
        // Get the deferred for resolving later
        var deferred = self.loading[i_key].deferred;

        // Remove entry from this.loading, create entry in this.loaded
        delete self.loading[i_key];
        self.loaded[i_key] = partiallyLoadedImage;

        // Finally resolve the promise
        deferred.resolve(partiallyLoadedImage, i_url, i_key);
    };

    partiallyLoadedImage.onerror = function (i_event) {
        // Get the deferred for rejecting later
        var deferred = self.loading[i_key].deferred;

        // Remove entry from this.loading, create entry in this.failed
        delete self.loading[i_key];
        self.failed[i_key] = { asset: partiallyLoadedImage,
                               deferred: deferred,
                               status: "" };

        // Finally reject the promise
        deferred.reject("", i_url, i_key);
    };


    // Start the load
    partiallyLoadedImage.src = i_url;

    // Make entry in this.loading
    this.loading[i_key] = { asset: partiallyLoadedImage,
                            deferred: new $.Deferred() };

    // Return partially loaded HTMLImageElement object,
    // and the promise that will return the result of the load
    return { asset: partiallyLoadedImage,
             promise: this.loading[i_key].deferred.promise() };
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
//  (object)
//  Key-value pairs:
//   asset:
//    (HTMLAudioElement)
//    The new audio element, with its src not yet loaded.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (HTMLAudioElement)
//      The new audio, now with its src loaded.
//     i_url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     i_key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//    Failed handler:
//     i_errorDescription:
//      (string)
//      An empty string (unfortunately don't know how to get an error description in this case).
//     i_url:
//      (string)
//      As for the fulfilled handler.
//     i_key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Start loading audio, get partially loaded HTMLAudioElement object
    var self = this;
    var partiallyLoadedAudio = new Audio();

    // 'oncanplaythrough': http://stackoverflow.com/a/8059487
    partiallyLoadedAudio.oncanplaythrough = function (i_event) {
        // Get the deferred for resolving later
        var deferred = self.loading[i_key].deferred;

        // Remove entry from this.loading, create entry in this.loaded
        delete self.loading[i_key];
        self.loaded[i_key] = partiallyLoadedAudio;

        // Finally resolve the promise
        deferred.resolve(partiallyLoadedAudio, i_url, i_key);
    };

    partiallyLoadedAudio.onerror = function (i_event) {
        // Get the deferred for rejecting later
        var deferred = self.loading[i_key].deferred;

        // Remove entry from this.loading, create entry in this.failed
        delete self.loading[i_key];
        self.failed[i_key] = { asset: partiallyLoadedAudio,
                               deferred: deferred,
                               status: "" };

        // Finally reject the promise
        deferred.reject("", i_url, i_key);
    };


    // Start the load
    partiallyLoadedAudio.src = i_url;

    // Make entry in this.loading
    this.loading[i_key] = { asset: partiallyLoadedAudio,
                            deferred: new $.Deferred() };

    // Return partially loaded HTMLAudioElement object,
    // and the promise that will return the result of the load
    return { asset: partiallyLoadedAudio,
             promise: this.loading[i_key].deferred.promise() };
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
//  (object)
//  Key-value pairs:
//   asset:
//    (null)
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (AudioBuffer)
//      The audio, decoded.
//     i_url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     i_key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//    Failed handler:
//     i_errorDescription:
//      (string)
//      An empty string (unfortunately don't know how to get an error description in this case).
//     i_url:
//      (string)
//      As for the fulfilled handler.
//     i_key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    //
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, true);
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function ()
    {
        // If done
        if (xhr.readyState == 4)
        {
            // Get the deferred for resolving or rejecting later
            var deferred = self.loading[i_key].deferred;

            // If successful
            if (xhr.status == 200)
            {
                // Use an audio context to decode the audio data into an AudioBuffer
                var audioContext = dan.snd.getSingletonAudioContext();
                audioContext.decodeAudioData(
                    xhr.response,
                    function onDecodeSuccess(i_decodedData) {
                        // Remove entry from this.loading, create entry in this.loaded
                        delete self.loading[i_key];
                        self.loaded[i_key] = i_decodedData;

                        // Finally resolve the promise
                        deferred.resolve(i_decodedData, i_url, i_key);
                    },
                    function onDecodeError() {
                        // Remove entry from this.loading, create entry in this.failed
                        delete self.loading[i_key];
                        self.failed[i_key] = { asset: "",
                                               deferred: deferred,
                                               status: "AudioContext.decodeAudioData() failed" };
                        
                        // Finally reject the promise
                        deferred.reject("AudioContext.decodeAudioData() failed", i_url, i_key);
                    }
                );
            }
            // Else if failed
            else
            {
                // Remove entry from this.loading, create entry in this.failed
                delete self.loading[i_key];
                self.failed[i_key] = { asset: "",
                                       deferred: deferred,
                                       status: xhr.status + " " + xhr.statusText };

                // Finally reject the promise
                deferred.reject(xhr.status + " " + xhr.statusText, i_url, i_key);
            }
        }
    };

    // Make entry in this.loading
    this.loading[i_key] = { asset: null,
                            deferred: new $.Deferred() };

    // Start asynchronous request
    xhr.send(null);

    // Return null,
    // and the promise that will eventually return the result of the load
    return { asset: null,
             promise: this.loading[i_key].deferred.promise() };
};

dan.loaders.AssetLoader.prototype.loadText = function (i_url, i_key)
// Params:
//  i_url:
//   (string)
//   Path to load text from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the image by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (object)
//  Key-value pairs:
//   asset:
//    (string)
//    An empty string.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (string)
//      The loaded text.
//     i_url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     i_key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//    Failed handler:
//     i_errorDescription:
//      (string)
//      A description of the error.
//     i_url:
//      (string)
//      As for the fulfilled handler.
//     i_key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    //
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, true);
    xhr.responseType = "text";
    xhr.onreadystatechange = function ()
    {
        // If done
        if (xhr.readyState == 4)
        {
            // Get the deferred for resolving or rejecting later
            var deferred = self.loading[i_key].deferred;

            // If successful
            if (xhr.status == 200)
            {
                // Remove entry from this.loading, create entry in this.loaded
                delete self.loading[i_key];
                self.loaded[i_key] = xhr.responseText;

                // Finally resolve the promise
                deferred.resolve(xhr.responseText, i_url, i_key);
            }
            // Else if failed
            else
            {
                // Remove entry from this.loading, create entry in this.failed
                delete self.loading[i_key];
                self.failed[i_key] = { asset: "",
                                       deferred: deferred,
                                       status: xhr.status + " " + xhr.statusText };

                // Finally reject the promise
                deferred.reject(xhr.status + " " + xhr.statusText, i_url, i_key);
            }
        }
    };

    // Make entry in this.loading
    this.loading[i_key] = { asset: "",
                            deferred: new $.Deferred() };

    // Start asynchronous request
    xhr.send(null);

    // Return empty string,
    // and the promise that will eventually return the result of the load
    return { asset: "",
             promise: this.loading[i_key].deferred.promise() };
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
//    Short name to use to refer to the json by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//
// Returns:
//  (object)
//  Key-value pairs:
//   asset:
//    (string)
//    An empty string.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (object)
//      The loaded and parsed json.
//     i_url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     i_key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//    Failed handler:
//     i_errorDescription:
//      (string)
//      A description of the error.
//     i_url:
//      (string)
//      As for the fulfilled handler.
//     i_key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    //
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, true);
    xhr.responseType = "text";
    xhr.onreadystatechange = function ()
    {
        // If done
        if (xhr.readyState == 4)
        {
            // Get the deferred for resolving or rejecting later
            if (!(i_key in self.loading))  // HACK
                return;
            var deferred = self.loading[i_key].deferred;

            // If successful
            if (xhr.status == 200)
            {
                // Remove entry from this.loading, create entry in this.loaded
                delete self.loading[i_key];
                self.loaded[i_key] = JSON.parse(xhr.responseText);

                // Finally resolve the promise
                deferred.resolve(xhr.responseText, i_url, i_key);
            }
            // Else if failed
            else
            {
                // Remove entry from this.loading, create entry in this.failed
                delete self.loading[i_key];
                self.failed[i_key] = { asset: "",
                                       deferred: deferred,
                                       status: xhr.status + " " + xhr.statusText };

                // Finally reject the promise
                deferred.reject(xhr.status + " " + xhr.statusText, i_url, i_key);
            }
        }
    };

    // Make entry in this.loading
    this.loading[i_key] = { asset: "",
                            deferred: new $.Deferred() };

    // Start asynchronous request
    xhr.send(null);

    // Return empty string,
    // and the promise that will eventually return the result of the load
    return { asset: "",
             promise: this.loading[i_key].deferred.promise() };
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
//  (object)
//  Key-value pairs:
//   asset:
//    (string)
//    An empty string.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (string)
//      The loaded document.
//     i_url:
//      (string)
//      The i_url argument that was originally passed in to load this asset.
//     i_key:
//      (string)
//      The short name for the asset (whether originally passed in as the i_key argument
//      or auto-generated).
//    Failed handler:
//     i_errorDescription:
//      (string)
//      A description of the error.
//     i_url:
//      (string)
//      As for the fulfilled handler.
//     i_key:
//      (string)
//      As for the fulfilled handler.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    //
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, true);
    xhr.responseType = "xml";
    xhr.onreadystatechange = function ()
    {
        // If done
        if (xhr.readyState == 4)
        {
            // Get the deferred for resolving or rejecting later
            var deferred = self.loading[i_key].deferred;

            // If successful
            if (xhr.status == 200)
            {
                var responseXml;

                // If response came down as XML,
                // simply save the reference to it
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

                // Remove entry from this.loading, create entry in this.loaded
                delete self.loading[i_key];
                self.loaded[i_key] = responseXml;

                // Finally resolve the promise
                deferred.resolve(responseXml, i_url, i_key);
            }
            // Else if failed
            else
            {
                // Remove entry from this.loading, create entry in this.failed
                delete self.loading[i_key];
                self.failed[i_key] = { asset: "",
                                       deferred: deferred,
                                       status: xhr.status + " " + xhr.statusText };

                // Finally reject the promise
                deferred.reject(xhr.status + " " + xhr.statusText, i_url, i_key);
            }
        }
    };

    // Make entry in this.loading
    this.loading[i_key] = { asset: "",
                            deferred: new $.Deferred() };

    // Start asynchronous request
    xhr.send(null);

    // Return empty string,
    // and the promise that will eventually return the result of the load
    return { asset: "",
             promise: this.loading[i_key].deferred.promise() };
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
