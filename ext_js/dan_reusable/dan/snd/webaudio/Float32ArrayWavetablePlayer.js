
// This namespace
// #require "webaudio.js"


// + Construction {{{

dan.snd.webaudio.Float32ArrayWavetablePlayer = function (i_audioContext, i_userSampleRate)
// Plays Float32Array wavetables.
//
// Params:
//  i_audioContext:
//   (AudioContext)
//  i_userSampleRate:
//   Either (integer number)
//    The sample rate that the arrays that will be later supplied should be played at.
//   or (null or undefined)
//    use default of i_audioContext.sampleRate.
{
    // Apply default arguments
    if (!i_userSampleRate)
        i_userSampleRate = i_audioContext.sampleRate;

    //
    this.m_audioContext = i_audioContext;
    // m_audioContext
    //  (AudioContext)

    this.m_userSampleRate = i_userSampleRate;
    // m_userSampleRate
    //  (integer number)

    this.m_useBufferPool = true;
    // m_useBufferPool
    //  (boolean)
    //  Whether to reuse AudioBuffer objects.
    this.m_freeBuffers = [];
    // m_freeBuffers
    //  (array of AudioBuffer)
    //  Audio buffers which were previously used to play a Float32Array which has now finished playing.
    //  They are kept for possible reuse with subsequent Float32Arrays.
};

// + }}}

// + Settings {{{

dan.snd.webaudio.Float32ArrayWavetablePlayer.prototype.setUserSampleRate = function (i_sampleRate)
{
    // Save value
    this.m_userSampleRate = i_sampleRate;

    // Make new array for AudioBuffer objects
    // (existing ones can't be reused if the sample rate has changed)
    this.m_freeBuffers = [];

    //this._updateUserBuffers(this.m_userSampleRate, this.m_noteLengthInSeconds);
    //// Re-prerender the formula into all the new buffers
    //this.setUserCode(this.m_userCode);
};

dan.snd.webaudio.Float32ArrayWavetablePlayer.prototype.getUserSampleRate = function ()
{
    return this.m_userSampleRate;
};

dan.snd.webaudio.Float32ArrayWavetablePlayer.prototype.useBufferPool = function (i_usePool)
// Params:
//  i_usePool:
//   (boolean)
{
    this.m_useBufferPool = i_usePool;
};

// + }}}

// + Playing {{{

dan.snd.webaudio.Float32ArrayWavetablePlayer.prototype._getFreeAudioBuffer = function (i_sampleCount)
// Returns:
//  (AudioBuffer)
{
    // If using the buffer pool and
    // if there is a previously used buffer that is big enough,
    // remove it from the free list and return it
    if (this.m_useBufferPool)
    {
        for (var bufferNo = 0; bufferNo < this.m_freeBuffers.length; ++bufferNo)
        {
            if (this.m_freeBuffers[bufferNo].length >= i_sampleCount)
            {
                return this.m_freeBuffers.splice(bufferNo, 1)[0];
            }
        }
    }

    // Otherwise just create a new buffer and return it
    return this.m_audioContext.createBuffer(1, i_sampleCount, this.m_userSampleRate);
};

dan.snd.webaudio.Float32ArrayWavetablePlayer.prototype.play = function (i_srcSamples)
// Params:
//  i_srcSamples:
//   (Float32Array)
//
// Returns:
//  (AudioBufferSourceNode)
//  You can call .stop() on this if you want to stop the sound early.
{
    // Get AudioBuffer
    var audioBuffer = this._getFreeAudioBuffer(i_srcSamples.length);

    // Copy sound from input Float32Array to AudioBuffer
    if (audioBuffer.copyToChannel)
    {
        audioBuffer.copyToChannel(i_srcSamples, 0, 0);
    }
    else
    {
        var channel = audioBuffer.getChannelData(0);
        for (var sampleNo = 0, end = i_srcSamples.length; sampleNo < end; ++sampleNo)
        {
            channel[sampleNo] = i_srcSamples[sampleNo];
        }
    }

    // Zero out any excess capacity in the buffer
    if (i_srcSamples.length < audioBuffer.length)
    {
        var channel = audioBuffer.getChannelData(0);
        for (var sampleNo = i_srcSamples.length, end = audioBuffer.length; sampleNo < end; ++sampleNo)
        {
            channel[sampleNo] = 0;
        }
    }

    // Play the first i_srcSamples of the AudioBuffer once
    var node = this.m_audioContext.createBufferSource();
    node.buffer = audioBuffer;
    //node.gain.value = 0.5 * this.m_volume/100.0;
    node.connect(this.m_audioContext.destination);

    // If using the buffer pool then reclaim the buffer when it finishes playing
    if (this.m_useBufferPool)
    {
        var me = this;
        node.onended = function (i_event) {
            me.m_freeBuffers.push(audioBuffer);
        };
    }

    //
    node.start(0, 0, i_srcSamples.length / this.m_userSampleRate);

    //
    return node;
};

// + }}}

/*
dan.snd.webaudio.Float32ArrayWavetablePlayer.prototype._destroyFloat32ArrayWavetablePlayer = function ()
{
    this._destroyNonRealtimeBuffers();
}
*/

/*
dan.snd.webaudio.Float32ArrayWavetablePlayer.prototype._destroyNonRealtimeBuffers = function ()
{
    this.m_freeBuffers = null;
};
*/
