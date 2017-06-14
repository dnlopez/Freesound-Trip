/*
wavetables = [];

function Wavetable(i_samples, i_sampleRate)
{
    this.samples = i_samples;
    this.sampleRate = i_sampleRate;
}

loadWavetable = function (i_sampleId, i_url, i_onLoad)
// Params:
//  i_sampleId:
//   (string)
//  i_url:
//   (string)
//  i_onLoad:
//   Either (function)
//   or (null or undefined)
{
    // Load sound at i_url, get response as an ArrayBuffer, run asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", i_url, true);
    request.responseType = "arraybuffer";

    var me = this;
    request.onload = function () {
        // (request.response is an ArrayBuffer)

        //me.wavetables.push(new Wavetable(new Int16Array(request.response)));

        audioContext.decodeAudioData(request.response, function (i_decodedBuffer)
        // Params:
        //  i_decodedBuffer:
        //   (AudioBuffer)
        //   Has been converted to the sample rate of the audio context.
        {
            // Mix channels down to mono

            // Add them together
            var mixedSamples = new Float32Array(i_decodedBuffer.length);
            for (var channelNo = 0; channelNo < i_decodedBuffer.numberOfChannels; ++channelNo)
            {
                var channel = i_decodedBuffer.getChannelData(channelNo);
                for (var sampleNo = 0; sampleNo < i_decodedBuffer.length; ++sampleNo)
                {
                    mixedSamples[sampleNo] += channel[sampleNo];
                }
            }

            // Divide total by number of channels
            var scale = 1 / i_decodedBuffer.numberOfChannels;
            for (var sampleNo = 0; sampleNo < i_decodedBuffer.length; ++sampleNo)
            {
                mixedSamples[sampleNo] *= scale;
            }

            //
            wavetables[i_sampleId] = new Wavetable(mixedSamples, audioContext.sampleRate);

            //
            if (i_onLoad)
                i_onLoad();
        });
    }

    request.send();
};
//loadWavetable("melody1", "/home/daniel/docs/hackspace/sic/3d_space/SOUNDS/melody1.mp3", function () {
//    wavetablePlayer = new Float32ArrayWavetablePlayerWithGain(audioContext, wavetables["melody1"].sampleRate);
//    wavetablePlayer.play(wavetables["melody1"].samples, 1);
//});
*/
