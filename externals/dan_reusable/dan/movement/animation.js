
// This namespace
// #require "movement.js"


// TODO:
//  make shortcuts like 'fadeIn())'
//   these can have onDone callbacks and easing parameters
//  add some examples/tests that work with easing functions in existing reusable movement.js


dan.movement.animate = function (i_durationInSeconds, i_onStep)
// Fixed length animation
// ie. for a fixed length of time, run a callback on every frame
//
// Params:
//  i_durationInSeconds:
//   (number)
//  i_onStep:
//   (function)
//   Function has:
//    Params:
//     i_progress:
//      In range [0..1]
//      This will always be exactly 0 the first time it is called,
//      and (if not cancelled) always exactly 1 the last time it is called.
//    Returns:
//     (boolean)
//     false:
//      Cancel animation; don't call the callback again.
{
    var startedAt;
    var progress = null;

    function step()
    {
        // If haven't started yet
        if (progress === null)
        {
            startedAt = performance.now() / 1000;
            progress = 0;
        }
        else
        {
            progress = (performance.now() / 1000 - startedAt) / i_durationInSeconds;
            if (progress > 1)
                progress = 1;
        }

        var callbackWantsToCancel = (i_onStep(progress) === false);

        // If we're not totally finished yet,
        // call this function again on the next frame
        if (!callbackWantsToCancel && progress < 1)
            requestAnimationFrame(step);
    }

    step();
};

dan.movement.animate_delayedStart = function (i_startInSeconds, i_durationInSeconds, i_onStep)
// Fixed length animation
// ie. for a fixed length of time, run a callback on every frame,
// with delay before start
//
// Params:
//  i_startInSeconds:
//   (number)
//  i_durationInSeconds:
//   (number)
//  i_onStep:
//   (function)
//   Function has:
//    Params:
//     i_progress:
//      In range [0..1]
//      This will always be exactly 0 the first time it is called,
//      and (if not cancelled) always exactly 1 the last time it is called.
//    Returns:
//     (boolean)
//     false:
//      Cancel animation; don't call the callback again.
{
    var scheduledAt = performance.now() / 1000;
    var startedAt = null;
    var progress = 0;  // TODO: replace 0 with null for consistency with danAnimate()

    function step()
    {
        // If haven't started yet
        var callbackWantsToCancel;
        if (startedAt === null)
        {
            // If time since scheduled is greater than or equal to the specified initial delay,
            // start now
            var now = performance.now() / 1000;
            if (now - scheduledAt >= i_startInSeconds)
            {
                startedAt = now;
                progress = 0;
                callbackWantsToCancel = (i_onStep(progress) === false);
            }
        }
        else
        {
            progress = (performance.now() / 1000 - startedAt) / i_durationInSeconds;
            if (progress > 1)
                progress = 1;

            callbackWantsToCancel = (i_onStep(progress) === false);
        }

        // If we're not totally finished yet,
        // call this function again on the next frame
        if (!callbackWantsToCancel && progress < 1)
            requestAnimationFrame(step);
    }

    step();
};

dan.movement.fadeIn = function (i_element, i_durationInSeconds, i_onDone, i_easingFunction)
// Params:
//  i_element:
//   (Element)
//  i_durationInSeconds:
//   (number)
//  i_onDone:
//   Either (function)
//    Params:
//     -
//    Returns:
//     -
//   or (null or undefined)
//    Don't use a callback.
{
    dan.movement.animate(i_durationInSeconds, function (i_progress) {
        if (i_easingFunction)
            i_progress = i_easingFunction(i_progress);

        //
        i_element.style.opacity = i_progress;

        // If finished and a callback was passed then call it
        if (i_progress == 1 && i_onDone)
            i_onDone();
    });
};
