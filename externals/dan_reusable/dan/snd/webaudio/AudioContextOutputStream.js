
// This namespace
// #require "webaudio.js"


// + Construction {{{

dan.snd.webaudio.AudioContextOutputStream = function (i_audioContext, i_bufferSampleCount, i_onRenderSamples)
// Class that connects to a Web Audio AudioContext,
// then calls a user function repeatedly in realtime to get bufferfuls of samples
// to send to the AudioContext's "destination", ie. the speakers, to be heard.

// Class that given a Web Audio AudioContext and stream buffer size,
// calls a user function repeatedly in realtime to get bufferfuls of new samples
// and send them to the AudioContext's "destination", ie. the speakers, to be heard.
//
// Params:
//  i_audioContext:
//   (AudioContext)
//  i_bufferSampleCount:
//   Either (integer number)
//    Size of stream buffer in sample frames.
//    Either one of: 256, 512, 1024, 2048, 4096, 8192, 16384
//    or 0: let the implementation choose the best buffer size for the given environment
//   or (null or undefined)
//    Use default of 0
//  i_onRenderSamples:
//   Either (function)
//    Function, that after the stream is started, will be called repeatedly to get bufferfuls of new samples.
//    See the parameter of bindRenderSamples() for details.
//   or (null or undefined)
//    Construct without a render function.
//    In this case, you must call bindRenderSamples() to set one before calling startStream().
{
    // Apply default arguments
    if (i_bufferSampleCount === null || i_bufferSampleCount === undefined)
        i_bufferSampleCount = 0;
    if (i_onRenderSamples === null || i_onRenderSamples === undefined)
        i_onRenderSamples = null;

    //

    this.m_audioContext = i_audioContext;
    // m_audioContext:
    //  (AudioContext)

    this.m_bufferSampleCount = i_bufferSampleCount;
    // m_bufferSampleCount
    //  (integer number)

    this.m_onRenderSamples = i_onRenderSamples;
    // m_onRenderSamples
    //  (function)

    this.m_preZeroStreamBuffer = false;
    // m_preZeroStreamBuffer:
    //  (boolean)
}

// + }}}

// + Configuration {{{

dan.snd.webaudio.AudioContextOutputStream.prototype.getSampleRate = function ()
// Returns:
//  (float number)
{
    return this.m_audioContext.sampleRate;
};

dan.snd.webaudio.AudioContextOutputStream.prototype.setBufferSampleCount = function (i_sampleCount)
// Params:
//  i_sampleCount:
//   (integer number)
{
    // Save value
    this.m_bufferSampleCount = i_sampleCount;

    // If stream is already running (already have a ScriptProcessorNode)
    // and the buffer size is being changed,
    // stop and start the stream (to create a new ScriptProcessorNode with the new buffer size)
    if (this.m_scriptProcessorNode &&
        this.m_bufferSampleCount != this.m_scriptProcessorNode.bufferSize)
    {
        this.stopStream();
        this.startStream();
    }
};

dan.snd.webaudio.AudioContextOutputStream.prototype.getBufferSampleCount = function ()
// Returns:
//  (integer number)
{
    return this.m_bufferSampleCount;
};

dan.snd.webaudio.AudioContextOutputStream.prototype.preZeroStreamBuffer = function (i_preZero)
// Params:
//  i_preZero:
//   (boolean)
//   true:
//    Before passing the stream buffer to the user callback, initialize it all to zeroes.
//   false:
//    Before passing the stream buffer to the user callback, don't bother initializing it to zeroes.
//    This is the default behaviour.
{
    this.m_preZeroStreamBuffer = i_preZero;
};

dan.snd.webaudio.AudioContextOutputStream.prototype.bindRenderSamples = function (i_onRenderSamples)
// Params:
//  i_onRenderSamples:
//   (function)
//   Function, that after the stream is started, will be called repeatedly to get bufferfuls of new samples.
//   Function has:
//    Params:
//     o_samples:
//      (Float32Array)
//      Buffer into which to write output samples.
//      Samples are IEEE 32-bit linear PCM with a nominal range of [-1 .. +1].
//     i_sampleCount:
//      (integer number)
//      The number of output samples wanted. This number of samples should be written into o_samples.
//      This will generally be constant between calls, as configured by the buffer sample count.
//    Returns:
//     -
{
    this.m_onRenderSamples = i_onRenderSamples;
};

// + }}}

// + Start and stop {{{

dan.snd.webaudio.AudioContextOutputStream.prototype.startStream = function ()
// Start repeatedly calling the user function to get new samples,
// and start outputting them to the AudioContext.
{
    //
    var me = this;

    // Create ScriptProcessorNode
    try {
        this.m_scriptProcessorNode = this.m_audioContext.createScriptProcessor(this.m_bufferSampleCount, 0, 1);
    }
    catch (e) {
        alert('audioContext.createScriptProcessor() failed to create stream buffer node with this size (note Web Audio spec: the buffer size "must be one of the following values: 256, 512, 1024, 2048, 4096, 8192, 16384"');
    }

    //
    this.m_scriptProcessorNode.onaudioprocess = function (i_event)
    {
        // Get destination sample buffer
        var outputBuffer = i_event.outputBuffer.getChannelData(0);

        // If desired, fill buffer with zeroes
        if (me.m_preZeroStreamBuffer)
        {
            for (var sampleNo = 0; sampleNo < me.m_scriptProcessorNode.bufferSize; ++sampleNo)
            {
                outputBuffer[sampleNo] = 0;
            }
        }

        // Ask user to fill it with their samples
        me.m_onRenderSamples(outputBuffer, me.m_scriptProcessorNode.bufferSize);
    };

    this.m_scriptProcessorNode.connect(this.m_audioContext.destination);
};

dan.snd.webaudio.AudioContextOutputStream.prototype.stopStream = function ()
// Stop repeatedly calling the user function to get new samples,
// and stop outputting them to the AudioContext.
{
    if (this.m_scriptProcessorNode)
        this.m_scriptProcessorNode.disconnect();
    this.m_scriptProcessorNode = null;
};

// + }}}
