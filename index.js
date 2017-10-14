
// Dan reusable
//// #require <dan/loaders/AssetLoader.js>
//// #require <dan/loaders/AssetLoader_threeTexture.js>
//// #require <dan/urls.js>

// This program
// #require "ScrollingLog.js"
// #require "space.js"

var g_scrollingLog;

//var g_assetLoader;


function main()
{
    g_scrollingLog = new ScrollingLog();
    document.body.appendChild(g_scrollingLog.getRootDomElement());
    /*
    var n = 0;
    function addTestLog()
    {
        g_scrollingLog.addText("hello " + n.toString());
        ++n;
        if (n < 50)
            setTimeout(addTestLog, 50);
    }
    addTestLog();
    */
    setInterval(function () {
        g_scrollingLog.removeTimedOutEntries();
    }, 200);

    missionControl_construct();
    missionControl_show();
    space_construct();
}

main();