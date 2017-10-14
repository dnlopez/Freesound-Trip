
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

    // Call loadImage(),
    // augment the resulting promise with our own cleanup behaviour,
    // store augmented promise in this.loading
    var self = this;
    this.loading[i_key] = dan.loaders.loadImage(i_url).then(
        function onResolved(i_image)
        {
            // Remove augmented promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_image;

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

    // Return the augmented promise
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

    // Call loadAudioElement(),
    // augment the resulting promise with our own cleanup behaviour,
    // store augmented promise in this.loading
    var self = this;
    this.loading[i_key] = dan.loaders.loadAudioElement(i_url).then(
        function onResolved(i_audioElement)
        {
            // Remove augmented promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_audioElement;

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

    // Return the augmented promise
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

    // Call loadAudioBuffer(),
    // augment the resulting promise with our own cleanup behaviour,
    // store augmented promise in this.loading
    var self = this;
    this.loading[i_key] = dan.loaders.loadAudioBuffer(i_url).then(
        function onResolved(i_audioBuffer)
        {
            // Remove augmented promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_audioBuffer;

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

    // Return the augmented promise
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

    // Call loadText(),
    // augment the resulting promise with our own cleanup behaviour,
    // store augmented promise in this.loading
    var self = this;
    this.loading[i_key] = dan.loaders.loadText(i_url).then(
        function onResolved(i_text)
        {
            // Remove augmented promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_text;

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

    // Return the augmented promise
    return this.loading[i_key];
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
    this.loading[i_key] = dan.loaders.loadJson(i_url).then(
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

    // Return the augmented promise
    return this.loading[i_key];
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

    // Call loadXml(),
    // augment the resulting promise with our own cleanup behaviour,
    // store augmented promise in this.loading
    var self = this;
    this.loading[i_key] = dan.loaders.loadXml(i_url).then(
        function onResolved(i_document)
        {
            // Remove augmented promise from this.loading, put asset in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_document;

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

    // Return the augmented promise
    return this.loading[i_key];
};
