
// This namespace
// #require "AssetLoader.js"
//
// Pixi.js
// #require <pixi.js/src/pixi_main.js>


dan.loaders.AssetLoader.prototype.loadPixiBaseTexture = function (i_url, i_key)
// Params:
//  i_url:
//   (string)
//   Path to load texture image from.
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
//    (PIXI.BaseTexture)
//    The new texture, possibly with its image not yet loaded.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (PIXI.BaseTexture)
//      The new texture, now with its image loaded.
//    Failed handler:
//     Not currently implemented.
{
    // If the caller didn't choose a key then generate a unique one
    if (!i_key)
        i_key = this._generateUniqueKey();

    // Start loading texture, get BaseTexture object
    var baseTexture = PIXI.BaseTexture.fromImage(i_url, false);  // TODO: i_crossorigin

    // If base texture has already loaded (was already in Pixi's cache)
    if (baseTexture.hasLoaded)
    {
        // Create entry in this.loaded
        this.loaded[i_key] = baseTexture;

        // Return loaded BaseTexture object,
        // with a dummy already-resolved promise
        var immediatelyResolvedPromise = new $.Deferred();
        immediatelyResolvedPromise.resolve(baseTexture);

        return { asset: baseTexture,
                 promise: immediatelyResolvedPromise.promise() };
    }

    // Else wait for loaded event from base texture
    var self = this;
    baseTexture.addEventListener("loaded",
        function (i_baseTexture) {
            // Get the deferred for resolving later
            var deferred = self.loading[i_key].deferred;

            // Remove entry from this.loading, create entry in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = i_baseTexture.content;

            // Finally resolve the promise
            deferred.resolve(i_baseTexture);
        });

    // Make entry in this.loading
    this.loading[i_key] = { asset: baseTexture,
                            deferred: new $.Deferred() };

    // Return partially loaded BaseTexture object,
    // and the promise that will return the result of the load
    return { asset: baseTexture,
             promise: this.loading[i_key].deferred.promise() };
};
