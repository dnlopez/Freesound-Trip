
// + Communication with Freesound {{{

// Working cURL example:
//  curl -H "Authorization: Token 3c5dd7395a593748acfcd7385372df519cdcaeab" 'https://freesound.org/apiv2/search/text/?&page=1&page_size=60&group_by_pack=0&fields=id,previews,namequery=dogs&format=json'
// Example from Freesound Explorer:
//  https://freesound.org/apiv2/search/text/?&page=1&page_size=60&group_by_pack=0&filter=duration:[0%20TO%205]&fields=id,previews,name,analysis,url,username,duration,tags,license&descriptors=lowlevel.mfcc.mean,sfx.tristimulus.mean,tonal.hpcp.mean&query=dogs&format=json

function searchFreesound(i_nameQuery, i_onPage)
// Params:
//  i_nameQuery:
//   (string)
//  i_onPage:
//   (function)
{
    searchFreesound_getPage(i_nameQuery, 1, 5, i_onPage);
    // TODO: repeat till got all pages
}

function searchFreesound_getPage(i_nameQuery, i_pageNo, i_resultsPerPage, i_onPage)
// Params:
//  i_nameQuery:
//   (string)
//  i_pageNo:
//   (integer number)
//  i_resultsPerPage:
//   (integer number)
//  i_onPage:
//   (function)
{
    var queryUrl = 'https://freesound.org/apiv2/search/text/?';
    queryUrl += '&fields=id,name,previews,namequery=' + i_nameQuery;
    queryUrl += '&format=json';
    queryUrl += '&page=' + i_pageNo.toString();
    queryUrl += '&page_size=' + i_resultsPerPage.toString();
    queryUrl += '&group_by_pack=0';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", queryUrl);
    xhr.responseType = "json";
    xhr.setRequestHeader("Authorization", "Token S6iCeqkOguD4uIKGwmgzrxW7XwTznx4PMj6HrPp4");
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE)
        {
            //console.log(xhr.response);

            var results = xhr.response.results;  // TODO: defend against exception on this line if Freesound is inaccessible
            i_onPage(results);
        }
    };
    xhr.send();
}

function fstest2()
{
    var audioMediaElement = new Audio("https://www.freesound.org/data/previews/242/242403_4165591-lq.mp3");

    // Create a MediaElementAudioSourceNode to draw from the above Audio node
    var mediaElementAudioSourceNode = g_audioContext.createMediaElementSource(audioMediaElement);
}

function freesound_getPreviewUrl(i_soundId, i_onDone)
// Get the URL of a Freesound preview in low-quality MP3 format.
//
// Params:
//  i_soundId:
//   (integer number)
//  i_onDone:
//   (function)
//   Function has:
//    Params:
//     i_url:
//      (string)
{
    var queryUrl = 'https://freesound.org/apiv2/sounds/';
    queryUrl += i_soundId.toString() + "/?";
    queryUrl += '&fields=id,previews';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", queryUrl);
    xhr.responseType = "json";
    xhr.setRequestHeader("Authorization", "Token S6iCeqkOguD4uIKGwmgzrxW7XwTznx4PMj6HrPp4");
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE)
        {
            //console.log(xhr.response);

            i_onDone(xhr.response["previews"]["preview-lq-mp3"]);
        }
    };
    xhr.send();
}

// + }}}
