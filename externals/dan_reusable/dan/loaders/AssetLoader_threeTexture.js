
// This namespace
// #require "AssetLoader.js"
//
// Three.js
//// #require <three.js/Three_main.js>


dan.loaders.AssetLoader.prototype.loadTexture = function (i_url, i_key, i_mapping)
// Params:
//  i_url:
//   (string)
//   Path to load texture image from.
//  i_key:
//   Either (string)
//    Short name to use to refer to the asset by in future
//   or (null or undefined)
//    No particular short name (A unique name is auto-generated for internal purposes).
//  i_mapping:
//   Either (object)
//    a mapping mode instance from Three.js
//   or (null or undefined)
//    Default to THREE.UVMapping()
//
// Returns:
//  (Promise)
//  A promise to deliver the result of the load.
//  If it resolves, handlers watching for that state have params:
//   i_result:
//    (object)
//    Object has properties:
//     asset:
//      (THREE.Texture)
//      The new texture, now with its image loaded.
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

        // Start loading texture, get partially loaded Texture object
        var partiallyLoadedTexture = dan.loaders.AssetLoader.fixed_THREE_ImageUtils_loadTexture(i_url, i_mapping,
            // i_onLoad
            function (i_texture) {
                // Remove entry from this.loading, put asset in this.loaded
                delete self.loading[i_key];
                self.loaded[i_key] = i_texture;

                // Resolve the promise
                i_resolve({
                    key: i_key,
                    url: i_url,
                    asset: i_texture
                });
            },
            // i_onError
            function (i_texture) {
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
            }
        );

    });

    // Return the promise
    return this.loading[i_key];
};


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
