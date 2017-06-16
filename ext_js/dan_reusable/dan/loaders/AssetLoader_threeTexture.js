
// This namespace
// #require "AssetLoader.js"
//
// Three.js
// #require <three.js/Three_main.js>


dan.loaders.AssetLoader.prototype.loadTexture = function (i_url, i_key, i_mapping)
// Params:
//  i_url:
//   (string)
//   Path to load texture image from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the image by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//  i_mapping:
//   Either (object)
//    a mapping mode instance from Three.js
//   or (null or undefined)
//    Default to THREE.UVMapping()
//
// Returns:
//  (object)
//  Key-value pairs:
//   asset:
//    (THREE.Texture)
//    The new texture, with its image not yet loaded.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (THREE.Texture)
//      The new texture, now with its image loaded.
//    Failed handler:
//     i_errorDescription:
//      (string)
//      An empty string (unfortunately don't know how to get an error description in this case).
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Start loading texture, get partially loaded Texture object
    var self = this;
    var partiallyLoadedTexture = dan.loaders.AssetLoader.fixed_THREE_ImageUtils_loadTexture(i_url, i_mapping,
        // i_onLoad
        function (i_texture) {
            // Get the deferred for resolving later
            var deferred = self.loading[i_key].deferred;

            // Remove entry from this.loading, create entry in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_texture;

            // Finally resolve the promise
            deferred.resolve(i_texture);
        },
        // i_onError
        function (i_texture) {
            // Get the deferred for rejecting later
            var deferred = self.loading[i_key].deferred;

            // Remove entry from this.loading, create entry in this.failed
            delete self.loading[i_key];
            self.failed[i_key] = { asset: i_texture,
                                   deferred: deferred,
                                   status: "" };

            // Finally reject the promise
            deferred.reject("");
        });

    // Make entry in this.loading
    this.loading[i_key] = { asset: partiallyLoadedTexture,
                            deferred: new $.Deferred() };

    // Return partially loaded Texture object,
    // and the promise that will return the result of the load
    return { asset: partiallyLoadedTexture,
             promise: this.loading[i_key].deferred.promise() };
}


// + Three.js patches {{{

dan.loaders.AssetLoader.fixed_THREE_ImageUtils_loadTexture = function (i_url, i_mapping, i_onLoad, i_onError)
// Improved version of THREE.ImageUtils.loadTexture() which heeds the i_onError parameter.
//
// Load an image from a URL, using a THREE.ImageLoader, into a THREE.Texture.
//
// Params:
//  i_url:
//   (string)
//  i_mapping:
//   Either (object)
//    a mapping mode instance from Three.js
//   or (null or undefined)
//    Default to THREE.UVMapping()
//  i_onLoad:
//   (function)
//   Params:
//    i_texture:
//     (THREE.Texture)
//     The texture, now with image fully loaded.
//  i_onError:
//   (function)
//   Params:
//    i_errorEvent:
//     ...
//
// Returns:
//  (THREE.Texture)
//  Note that the texture image is loaded asynchronously so it will initially contain a
//  default Image(), later to be replaced by the real thing.
{
    // Create Texture object now (with default image) so we can return it straight away
    // rather than wait for ImageLoader callback
    var image = new Image();
    var texture = new THREE.Texture(image, i_mapping);

    // Start ImageLoader which when loaded will replace the image in the Texture
    var loader = new THREE.ImageLoader();
    loader.crossOrigin = this.crossOrigin;
    loader.load(i_url, 
                // i_onLoad
                function (i_image) {
                    texture.image = i_image;
                    texture.needsUpdate = true;

                    if (i_onLoad)
                        i_onLoad(texture);
                },
                // i_onProgress
                null,
                // i_onError
                function (i_errorEvent) {
                    texture.image = null;

                    if (i_onError)
                        i_onError(texture);
                });

    texture.sourceFile = i_url;

    return texture;
};

// + }}}
