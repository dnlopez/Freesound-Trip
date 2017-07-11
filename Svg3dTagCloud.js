/*
Copyright (c) 2016 Niklas Knaack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


function Svg3dTagCloud(i_container, i_params)
// Params:
//  i_container:
//   (HTMLElement)
//   Container into which to insert the SVG tag cloud
//  i_params:
//   (object)
//
// Returns:
//  false: Failed to initialize because i_params didn't have a non-empty 'entries' array
{
    // + Validate / apply default arguments {{{

    // Default settings
    var settings = {
        entries: [],
        width: 480,
        height: 480,
        radius: '70%',
        radiusMin: 75,

        // Background
        bgDraw: true,
        bgColor: '#000',

        //
        opacityOver: 1.00,
        opacityOut: 0.05,
        opacitySpeed: 6,
        fov: 800,
        speed: 2,
        fontFamily: 'Arial, sans-serif',
        fontSize: '15',
        fontColor: '#fff',
        fontWeight: 'normal',  // normal, bold
        fontStyle: 'normal',  // normal, italic
        fontStretch: 'normal',  // normal, wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        fontToUpperCase: false
    };

    // Copy valid arguments from 'i_params' to 'settings'
    if (i_params !== undefined)
    {
        for (var paramName in i_params)
        {
            if (i_params.hasOwnProperty(paramName) && settings.hasOwnProperty(paramName))
                settings[paramName] = i_params[paramName];
        }
    }

    // If there are no entries then bail out with failure code
    if (!settings.entries.length)
        return false;

    // + }}}

    var radius;
    var diameter;

    var mouseReact = true;

    // + Base elements {{{

    var backgroundRectElement;
    var svgElement;

    // + }}}

    // + Mouse {{{

    var mousePos = { x: 0, y: 0 };

    function getMousePos(i_svgElement, event)
    {
        var rect = i_svgElement.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    function svgElement_onMouseMove(i_event)
    {
        mousePos = getMousePos(svgElement, i_event);
    };

    // + }}}

    var center2D;
    var center3D = { x: 0, y: 0, z: 0 };

    var svgNamespaceUri = 'http://www.w3.org/2000/svg';

    //---

    function init()
    {
        // Create SVG element and add as child of container element
        svgElement = document.createElementNS(svgNamespaceUri, 'svg');
        i_container.appendChild(svgElement);

        //
        svgElement.addEventListener('mousemove', svgElement_onMouseMove);

        // If want to clear the background, create a covering child rect with a fill colour to do this
        if (settings.bgDraw)
        {
            backgroundRectElement = document.createElementNS(svgNamespaceUri, 'rect');
            backgroundRectElement.setAttribute('x', 0);
            backgroundRectElement.setAttribute('y', 0);
            backgroundRectElement.setAttribute('fill', settings.bgColor);

            svgElement.appendChild(backgroundRectElement);
        }

        //---

        addEntries();
        reInit();
        animloop();

        //---

        window.addEventListener('resize', window_onResize);
    };

    var speed = { x: 0, y: 0 };

    function reInit()
    {
        var svgWidth;
        var svgHeight;
        if (settings.width.toString().indexOf('%') > 0 || settings.height.toString().indexOf('%') > 0)
        {
            svgWidth = Math.round(i_container.offsetWidth / 100 * parseInt(settings.width));
            svgHeight = Math.round(svgWidth / 100 * parseInt(settings.height));
        }
        else
        {
            svgWidth = parseInt(settings.width);
            svgHeight = parseInt(settings.height);
        }

        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (svgWidth >= windowWidth)
            svgWidth = windowWidth;
        if (svgHeight >= windowHeight)
            svgHeight = windowHeight;

        //---

        center2D = { x: svgWidth / 2, y: svgHeight / 2 };

        speed.x = settings.speed / center2D.x;
        speed.y = settings.speed / center2D.y;

        if (svgWidth >= svgHeight)
            diameter = svgHeight / 100 * parseInt(settings.radius);
        else
            diameter = svgWidth / 100 * parseInt(settings.radius);

        if (diameter < 1)
            diameter = 1;

        radius = diameter / 2;

        if (radius < settings.radiusMin)
        {
            radius = settings.radiusMin;
            diameter = radius * 2;
        }

        //---

        svgElement.setAttribute('width', svgWidth);
        svgElement.setAttribute('height', svgHeight);

        if (settings.bgDraw)
        {
            backgroundRectElement.setAttribute('width', svgWidth);
            backgroundRectElement.setAttribute('height', svgHeight);
        }

        //---

        setEntryPositions(radius);
    };

    //---

    var entries = [];

    function setEntryPositions(i_radius)
    {
        for (var entryCount = entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
        {
            setEntryPosition(entries[entryNo], i_radius);
        }
    };

    function setEntryPosition(i_entry, i_radius)
    {
        var dx = i_entry.vectorPosition.x - center3D.x;
        var dy = i_entry.vectorPosition.y - center3D.y;
        var dz = i_entry.vectorPosition.z - center3D.z;
        var length = Math.sqrt(dx*dx + dy*dy + dz*dz);

        i_entry.vectorPosition.x /= length;
        i_entry.vectorPosition.y /= length;
        i_entry.vectorPosition.z /= length;

        i_entry.vectorPosition.x *= i_radius;
        i_entry.vectorPosition.y *= i_radius;
        i_entry.vectorPosition.z *= i_radius;
    };
    /*
    function setEntryPosition(i_entry, i_radius)
    {
        i_entry.vectorPosition.x -= center3D.x;
        i_entry.vectorPosition.y -= center3D.y;
        i_entry.vectorPosition.z -= center3D.z;

        var dx = i_entry.vectorPosition.x;
        var dy = i_entry.vectorPosition.y;
        var dz = i_entry.vectorPosition.z;
        var length = Math.sqrt(dx*dx + dy*dy + dz*dz);

        i_entry.vectorPosition.x /= length;
        i_entry.vectorPosition.y /= length;
        i_entry.vectorPosition.z /= length;

        i_entry.vectorPosition.x *= i_radius;
        i_entry.vectorPosition.y *= i_radius;
        i_entry.vectorPosition.z *= i_radius;

        i_entry.vectorPosition.x += center3D.x;
        i_entry.vectorPosition.y += center3D.y;
        i_entry.vectorPosition.z += center3D.z;
    };
    */

    function createEntry(i_index, i_entryObj, i_x, i_y, i_z)
    {
        var entry = {};

        entry.element = document.createElementNS(svgNamespaceUri, 'text');
        entry.element.setAttribute('x', 0);
        entry.element.setAttribute('y', 0);
        if (i_entryObj.hasOwnProperty("fontColor"))
            entry.element.setAttribute('fill', i_entryObj.fontColor);
        else
            entry.element.setAttribute('fill', settings.fontColor);
        entry.element.setAttribute('font-family', settings.fontFamily);
        entry.element.setAttribute('font-size', settings.fontSize);
        if (i_entryObj.hasOwnProperty("fontSize"))
            entry.element.setAttribute('font-size', i_entryObj.fontSize);
        else
            entry.element.setAttribute('font-size', settings.fontSize);
        entry.element.setAttribute('font-weight', settings.fontWeight);
        entry.element.setAttribute('font-style', settings.fontStyle);
        entry.element.setAttribute('font-stretch', settings.fontStretch);
        entry.element.setAttribute('text-anchor', 'middle');
        entry.element.textContent = settings.fontToUpperCase ? i_entryObj.label.toUpperCase() : i_entryObj.label;

        entry.link = document.createElementNS(svgNamespaceUri, 'a');

        if (i_entryObj.hasOwnProperty("url"))
            entry.link.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', i_entryObj.url);
        if (i_entryObj.hasOwnProperty("target"))
            entry.link.setAttribute('target', i_entryObj.target);

        entry.link.addEventListener('mouseover', mouseOverHandler, true);
        entry.link.addEventListener('mouseout', mouseOutHandler, true);
        entry.link.appendChild(entry.element);

        entry.index = i_index;
        entry.mouseOver = false;

        entry.vectorPosition = { x: i_x, y: i_y, z: i_z };
        entry.vector2D = { x: 0, y: 0 };

        svgElement.appendChild(entry.link);

        return entry;
    };

    /*
    function addEntries()
    {
        // For each entry (using 1-based indexes)
        for (var entryCount = settings.entries.length + 1, entryNo = 1; entryNo < entryCount; ++entryNo)
        {
            var phi = Math.acos(-1 + (2 * entryNo - 1) / entryCount);
            var theta = Math.sqrt(entryCount * Math.PI) * phi;

            var x = Math.cos(theta) * Math.sin(phi);
            var y = Math.sin(theta) * Math.sin(phi);
            var z = Math.cos(phi);

            entries.push(createEntry(entryNo - 1, settings.entries[entryNo - 1], x, y, z));
        }
    };
    */
    function addEntries()
    {
        // Spiral from front to back, anti-clockwise

        // For each entry
        for (var entryCount = settings.entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
        {
            // Argument to Math.acos() ranges from [-1 .. 1)
            // 'phi' ranges from [PI .. 0)
            var phi = Math.acos(-1 + (2 * entryNo) / entryCount);
            //var phi = Math.PI - (entryNo / entryCount * Math.PI);

            var theta = Math.sqrt((entryCount + 1) * Math.PI) * phi;

            var x = Math.cos(theta) * Math.sin(phi);
            var y = Math.sin(theta) * Math.sin(phi);
            var z = Math.cos(phi);

            entries.push(createEntry(entryNo, settings.entries[entryNo], x, y, z));
        }
    };

    function getEntryByElement(i_element)
    {
        for (var entryCount = entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
        {
            var entry = entries[entryNo];

            // If 'x' and 'y' attributes are the same, assume it's the same element
            if (entry.element.getAttribute('x') === i_element.getAttribute('x') &&
                entry.element.getAttribute('y') === i_element.getAttribute('y'))
            {
                return entry;
            }
        }
    };

    function highlightEntry(i_elementToHighlight)
    {
        var entryToHighlight = getEntryByElement(i_elementToHighlight);

        for (var entryCount = entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
        {
            var entry = entries[entryNo];

            if (entry.index === entryToHighlight.index)
                entry.mouseOver = true;
            else
                entry.mouseOver = false;
        }
    };

    // + Update and render {{{

    var k_piDividedBy180 = Math.PI / 180;

    function render()
    {
        // Get angles to rotate by in degrees
        var rotation_x = -(mousePos.y - center2D.y) * speed.y;
        var rotation_y = (mousePos.x - center2D.x) * speed.x;

        // Convert degrees to radians
        rotation_x *= k_piDividedBy180;
        rotation_y *= k_piDividedBy180;

        //
        var sin_rotation_x = Math.sin(rotation_x);
        var cos_rotation_x = Math.cos(rotation_x);
        var sin_rotation_y = Math.sin(rotation_y);
        var cos_rotation_y = Math.cos(rotation_y);

        //
        for (var entryCount = entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
        {
            var entry = entries[entryNo];

            //
            if (mouseReact)
            {
                // Rotate around Y axis [right-handed rotation]
                var posX = entry.vectorPosition.x;
                var posZ = entry.vectorPosition.z;
                entry.vectorPosition.x = posX*cos_rotation_y + posZ*sin_rotation_y;
                entry.vectorPosition.z = posZ*cos_rotation_y - posX*sin_rotation_y;

                // Rotate around X axis [right-handed rotation]
                var posY = entry.vectorPosition.y;
                var posZ = entry.vectorPosition.z;
                entry.vectorPosition.y = posY*cos_rotation_x - posZ*sin_rotation_x;
                entry.vectorPosition.z = posZ*cos_rotation_x + posY*sin_rotation_x;
            }

            // Project
            var scale = settings.fov / (settings.fov + entry.vectorPosition.z);
            entry.vector2D.x = entry.vectorPosition.x * scale + center2D.x;
            entry.vector2D.y = entry.vectorPosition.y * scale + center2D.y;

            //
            entry.element.setAttribute('x', entry.vector2D.x);
            entry.element.setAttribute('y', entry.vector2D.y);

            //
            var opacity;
            if (mouseReact)
            {
                opacity = (radius - entry.vectorPosition.z) / diameter;

                if (opacity < settings.opacityOut)
                    opacity = settings.opacityOut;
            }
            else
            {
                opacity = parseFloat(entry.element.getAttribute('opacity'));

                if (entry.mouseOver)
                    opacity += (settings.opacityOver - opacity) / settings.opacitySpeed;
                else
                    opacity += (settings.opacityOut - opacity) / settings.opacitySpeed;
            }

            entry.element.setAttribute('opacity', opacity);
        }

        // Sort in order of descending Z
        // (far to near)
        //entries = entries.sort(function (a, b) {
        //    return (b.vectorPosition.z - a.vectorPosition.z);
        //});
    };

    //---

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function animloop()
    {
        render();
        requestAnimFrame(animloop);
    };

    // + }}}

    function mouseOverHandler(event)
    {
        mouseReact = false;

        highlightEntry(event.target);
    };

    function mouseOutHandler(event)
    {
        mouseReact = true;
    };

    //---

    function window_onResize(event)
    {
        reInit();
    };

    //---

    init();
};