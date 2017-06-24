
// This namespace
// #require "AssetLoader.js"
//
// Three.js
// #require <three.js/Three_main.js>
// #require <three.js/examples/js/loaders/ColladaLoader.js>


dan.loaders.AssetLoader.prototype.loadCollada = function (i_url, i_key)
// Params:
//  i_url:
//   (string)
//   Path to load Collada from.
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
//    (null)
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (Collada)
//      The new Collada.
//    Failed handler:
//     i_errorDescription:
//      (string)
//      A description of the error.
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
                // Use THREE.ColladaLoader to convert the XML into THREE objects.
                var loader = THREE.ColladaLoader();
                var parsedCollada;
                try {
                    parsedCollada = loader.parse(xhr.responseXML, null, i_url);
                }
                catch (e) {
                    // Remove entry from this.loading, create entry in this.failed
                    delete self.loading[i_key];
                    self.failed[i_key] = { asset: null,
                                           deferred: deferred,
                                           status: e.toString() };

                    // Finally reject the promise
                    deferred.reject(e.toString());

                    //
                    return;
                }

                // Remove entry from this.loading, create entry in this.loaded
                delete self.loading[i_key];
                self.loaded[i_key] = parsedCollada;

                // Finally resolve the promise
                deferred.resolve(parsedCollada);
            }
            // Else if failed
            else
            {
                // Remove entry from this.loading, create entry in this.failed
                delete self.loading[i_key];
                self.failed[i_key] = { asset: null,
                                       deferred: deferred,
                                       status: xhr.status + " " + xhr.statusText };

                // Finally reject the promise
                deferred.reject(xhr.status + " " + xhr.statusText);
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
}

dan.loaders.loadColladaSynchronously = function (i_url)
// Params:
//  i_url:
//   (string)
//   Path to load Collada from.
//
// Returns:
//  Either (Collada)
//   The new Collada
//  or (thrown string)
//   A description of the error that occurred.
{
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, false);
    xhr.responseType = "xml";

    // Start synchronous request
    xhr.send(null);

    // If successful
    if (xhr.status == 200)
    {
        // Use THREE.ColladaLoader to convert the XML into THREE objects.
        var loader = THREE.ColladaLoader();
        var parsedCollada = loader.parse(xhr.responseXML, null, i_url);
        return parsedCollada;
    }
    // Else if failed
    else
    {
        throw xhr.status + " " + xhr.statusText;
    };
}


/*
dan.loaders.AssetLoader.prototype.loadCollada = function (i_key, i_url)
// Params:
//  i_key:
//   (string)
//   Short name to use to refer to the parsed Collada by in future.
//  i_url:
//   (string)
//   Path to load Collada from.
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
//      (Collada)
//      The new Collada.
//    Failed handler params:
//     i_errorDescription:
//      (string)
{
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, true);
    xhr.responseType = "xml";
    xhr.onreadystatechange = function ()
    {
        // If done
        if (request.readyState == 4)
        {
            // Get the deferred for resolving or rejecting later
            var deferred = self.loading[i_key].deferred;

            if (request.status == 200)
            {
                // Use THREE.ColladaLoader to convert the XML into THREE objects.
                // If there's an error during processing then redirect to that callback instead
                var loader = THREE.ColladaLoader();
                var parsedCollada;
                try {
                    parsedCollada = loader.parse(xhr.responseXML, null, i_url);
                }
                catch (e) {
                    // Remove entry from this.loading, create entry in this.failed
                    delete self.loading[i_key];
                    self.failed[i_key] = null;

                    // Finally reject the promise
                    deferred.reject(e.name + ": " + e.message);

                    //
                    return;
                }

                // Remove entry from this.loading, create entry in this.loaded
                delete self.loading[i_key];
                self.loaded[i_key] = parsedCollada;

                // Finally resolve the promise
                deferred.resolve(parsedCollada);
            }
            else
            {
                // Remove entry from this.loading, create entry in this.failed
                delete self.loading[i_key];
                self.failed[i_key] = null;

                // Finally reject the promise
                deferred.reject(null);
            }
        }
    };

    // Make entry in this.loading
    this.loading[i_key] = { asset: "",
                            deferred: new $.Deferred() };

    // Start asynchronous request
    request.send(null);

    // Return null,
    // and the promise that will return the result of the load
    return { asset: null,
             promise: this.loading[i_key].deferred.promise() };
}
*/
/*
dan.loaders.AssetLoader.prototype.loadColladaSynchronously = function (i_key, i_url)
// Params:
//  i_key:
//   (string)
//   Short name to use to refer to the parsed Collada by in future.
//  i_url:
//   (string)
//   Path to load Collada from.
//
// Returns:
//  Either (Collada)
//   The new Collada
//  or (null)
//   The load failed.
{
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", i_url, false);  // synchronous
    xhr.responseType = "xml";

    // Start synchronous request
    request.send(null);

    //
    if (request.readyState == 4)
    {
        if (request.status == 200)
        {
            // Use THREE.ColladaLoader to convert the XML into THREE objects.
            // If there's an error during processing then redirect to that callback instead
            var loader = THREE.ColladaLoader();
            var parsedCollada;
            try {
                parsedCollada = loader.parse(xhr.responseXML, null, i_url);
            }
            catch (e) {
                this.error(, i_textStatus, e.name + ": " + e.message);
                return;
            }

                // Remove entry from this.loading, create entry in this.loaded
                delete self.loading[i_key];
                self.loaded[i_key] = parsedCollada;

                // Finally resolve the promise
                deferred.resolve(parsedCollada);
            }
            else
            {
                // Remove entry from this.loading, create entry in this.failed
                delete self.loading[i_key];
                self.failed[i_key] = null;

                // Finally reject the promise
                deferred.reject(null);
            }
        }
    };

    // Make entry in this.loading
    this.loading[i_key] = { asset: "",
                            deferred: new $.Deferred() };


    // Return null,
    // and the promise that will return the result of the load
    return { asset: null,
             promise: this.loading[i_key].deferred.promise() };
}
*/

/*
dan.loaders.AssetLoader.prototype.loadCollada = function (i_key, i_url)
// Params:
//  i_key:
//   (string)
//   Short name to use to refer to the Collada by in future.
//  i_url:
//   (string)
//   Path to load Collada from.
//
// Returns:
//  (object)
//  Key-value pairs:
//   asset:
//    (Collada)
//    The new Collada, with its image not yet loaded.
//   promise:
//    (jQuery.Promise)
//    A promise to deliver the result of the load.
//    Fulfilled handler params:
//     i_asset:
//      (Collada)
//      The new Collada.
//    Failed handler params:
//     i_asset:
//      (null)
{
    var self = this;

    // Start the load
    $.ajax({
        url: i_url,
        dataType: "xml",
        success: function (i_data, i_textStatus, i_jqXHR) {
            //console.log("success: " + i_url);

            // Get the deferred for resolving later
            var deferred = self.loading[i_key].deferred;

            // Use THREE.ColladaLoader to convert the XML into THREE objects.
            // If there's an error during processing then redirect to that callback instead
            var loader = THREE.ColladaLoader();
            var parsedCollada;
            try {
                parsedCollada = loader.parse(i_data, null, i_url);
            }
            catch (e) {
                this.error(i_jqXHR, i_textStatus, e.name + ": " + e.message);
                return;
            }

            // Remove entry from this.loading, create entry in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = parsedCollada;

            // Finally resolve the promise
            deferred.resolve(parsedCollada);
        },
        error: function (i_jqXHR, i_textStatus, i_errorThrown) {
            //console.log("error: " + i_url);

            // Get the deferred for rejecting later
            var deferred = self.loading[i_key].deferred;

            // Remove entry from this.loading, create entry in this.failed
            delete self.loading[i_key];
            self.failed[i_key] = null;

            // Finally reject the promise
            deferred.reject(null);
        }
    });

    // Make entry in this.loading
    this.loading[i_key] = { asset: "",
                            deferred: new $.Deferred() };

    // Return empty string,
    // and the promise that will return the result of the load
    return { asset: "",
             promise: this.loading[i_key].deferred.promise() };
}
*/

/*
dan.loaders.AssetLoader.prototype.loadColladaSynchronously = function (i_key, i_url)
// Params:
//  i_key:
//   (string)
//   Short name to use to refer to the Collada by in future.
//  i_url:
//   (string)
//   Path to load Collada from.
//
// Returns:
//  Either (Collada)
//   The new Collada.
//  or (null)
//   The load failed.
{
    var self = this;

    // Start the load
    $.ajax({
        url: i_url,
        async: false,
        dataType: "xml",
        success: function (i_data, i_textStatus, i_jqXHR) {
            //console.log("success: " + i_url);

            // Get the deferred for resolving later
            var deferred = self.loading[i_key].deferred;

            // Use THREE.ColladaLoader to convert the XML into THREE objects.
            // If there's an error during processing then redirect to that callback instead
            var loader = THREE.ColladaLoader();
            var parsedCollada;
            try {
                parsedCollada = loader.parse(i_data, null, i_url);
            }
            catch (e) {
                this.error(i_jqXHR, i_textStatus, e.name + ": " + e.message);
                return;
            }

            // Remove entry from this.loading, create entry in this.loaded
            delete self.loading[i_key];
            self.loaded[i_key] = parsedCollada;

            // Finally resolve the promise
            deferred.resolve(parsedCollada);
        },
        error: function (i_jqXHR, i_textStatus, i_errorThrown) {
            //console.log("error: " + i_url);

            // Get the deferred for rejecting later
            var deferred = self.loading[i_key].deferred;

            // Remove entry from this.loading, create entry in this.failed
            delete self.loading[i_key];
            self.failed[i_key] = null;

            // Finally reject the promise
            deferred.reject(null);
        }
    });

    // Make entry in this.loading
    this.loading[i_key] = { asset: "",
                            deferred: new $.Deferred() };

    // Return empty string,
    // and the promise that will return the result of the load
    return { asset: "",
             promise: this.loading[i_key].deferred.promise() };
}
*/
