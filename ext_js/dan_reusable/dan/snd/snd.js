
// Parent namespace
// #require <dan/dan.js>

if (typeof(dan.snd) === "undefined")
    dan.snd = {};


dan.snd.getAudioContext = function ()
// Returns:
//  Either (AudioContext)
//  or (null)
{
    var context = null;
    try {
        context = new AudioContext();
    }
    catch (e) {
        try {
            context = new webkitAudioContext();
        }
        catch (e) {
        }
    }

    return context;
};

dan.snd.getSingletonAudioContext = function ()
// Returns:
//  Either (AudioContext)
//  or (null)
{
    if (!dan.snd.singletonAudioContext)
        dan.snd.singletonAudioContext = dan.snd.getAudioContext();

    return dan.snd.singletonAudioContext;
};
