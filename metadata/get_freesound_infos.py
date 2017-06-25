#!/bin/python2

# Script used to go through a bulk list of Freesound sounds specified by their IDs,
# and get/save basic information including username, license, and preview URLs.


# Example Freesound API request URL
#  http://freesound.org/apiv2/search/text/?filter=id:(1234+OR+1235+OR+1236)&fields=id,previews,username,license,name,url


# Python std
import urllib
import urllib2
import json
import time


def getInfoForFreesoundSoundsWithIds(i_ids):
    """
    Params:
     i_ids:
      (sequence of str)
      Note that Freesound may only return info for up to 15 of these in one call.

    Returns:
     (list)
    """
    #request = urllib2.Request("http://freesound.org/apiv2/search/text/?fields=id,previews,username,license,name,url",
    query = {
        "fields": "id,previews,username,license,name,url",
        "filter": "id:(" + " OR ".join(i_ids) + ")"
    }
    request = urllib2.Request("http://freesound.org/apiv2/search/text/?" + urllib.urlencode(query),
                              headers={"Authorization": "Token S6iCeqkOguD4uIKGwmgzrxW7XwTznx4PMj6HrPp4"})
    requestFile = urllib2.urlopen(request)
    response = json.loads(requestFile.read())
    return response

def getInfoForFreesoundSoundsWithIds_multipleRequests(i_ids):
    """
    Params:
     i_ids:
      (sequence of str)

    Returns:
     (list)
    """
    # Get info in batches
    combinedResults = []
    requestBatchSize = 15
    soundNo = 0
    while soundNo < len(soundIdStrs):
        print "soundNo: " + str(soundNo)
        batchResults = getInfoForFreesoundSoundsWithIds(soundIdStrs[soundNo : soundNo+requestBatchSize])
        combinedResults.extend(batchResults["results"])

        time.sleep(1)
        soundNo += requestBatchSize

    return combinedResults


#soundFilenames = os.listdir("../nobackup/previews")
#soundIdStrs = [filename.replace(".mp3", "")  for filename in soundFilenames]
#soundInfos = getInfoForFreesoundSoundsWithIds_multipleRequests(soundIdStrs)
#open("freesound_infos.json", "w").write(json.dumps(soundInfos))

soundInfos = json.loads(open("freesound_infos.json", "r").read())

def indexSoundInfosById(i_soundInfos):
    """
    Params:
     i_soundInfos:
      (list)

    Returns:
     (dict)
    """
    return {
        soundInfo["id"]: { "name": soundInfo["name"],
                           "username": soundInfo["username"],
                           "license": soundInfo["license"],
                           "web-url": soundInfo["url"],
                           "url": soundInfo["previews"]["preview-lq-mp3"]
        }
        for soundInfo in i_soundInfos
    }

soundInfosIndexed = indexSoundInfosById(soundInfos)
open("freesound_infos_indexed.json", "w").write(json.dumps(soundInfosIndexed))
