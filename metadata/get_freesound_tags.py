#!/bin/python2

# Script used to go through a bulk list of Freesound sounds specified by their IDs,
# and get/save their tags


# Python std
import urllib
import urllib2
import json
import time


def getTagsForFreesoundSoundsWithIds(i_ids):
    """
    Params:
     i_ids:
      (sequence of str)
      Note that Freesound may only return tags for up to 15 of these in one call.

    Returns:
     (list)
    """
    #request = urllib2.Request("http://freesound.org/apiv2/search/text/?fields=id,tags",
    query = {
        "fields": "id,tags",
        "filter": "id:(" + " OR ".join(i_ids) + ")"
    }
    request = urllib2.Request("http://freesound.org/apiv2/search/text/?" + urllib.urlencode(query),
                              headers={"Authorization": "Token S6iCeqkOguD4uIKGwmgzrxW7XwTznx4PMj6HrPp4"})
    requestFile = urllib2.urlopen(request)
    response = json.loads(requestFile.read())
    return response

def getTagsForFreesoundSoundsWithIds_multipleRequests(i_ids):
    """
    Params:
     i_ids:
      (sequence of str)

    Returns:
     (list)
    """
    # Get tags in batches
    combinedResults = []
    inc = open("freesound_tags_incremental.json", "w")
    requestBatchSize = 15
    soundNo = 0
    while soundNo < len(soundIdStrs):
        print "soundNo: " + str(soundNo)
        batchResults = getTagsForFreesoundSoundsWithIds(soundIdStrs[soundNo : soundNo+requestBatchSize])
        for result in batchResults["results"]:
            inc.write('"' + str(result["id"]) + '": ' +  json.dumps({"tags": result["tags"]}) + ",\n")
        combinedResults.extend(batchResults["results"])

        time.sleep(2)
        soundNo += requestBatchSize

    inc.close()
    return combinedResults


#soundFilenames = os.listdir("../nobackup/previews")
#soundIdStrs = [filename.replace(".mp3", "")  for filename in soundFilenames]
#soundTagInfos = getTagsForFreesoundSoundsWithIds_multipleRequests(soundIdStrs)
#open("freesound_tags.json", "w").write(json.dumps(soundTagInfos))


soundTagInfos = json.loads(open("freesound_tags.json", "r").read())

def indexSoundTagInfosByIdAndAddFamilies(io_soundTagInfos):
    tagSummary = json.loads(open("tag_summary.json", "r").read())
    indexedTagSummary = { t["tag"]: { "number": t["number"],
                                      "family": t["family"] }
                          for t in tagSummary }

    #
    for soundTagInfo in io_soundTagInfos.itervalues():
        families = set()
        for tag in soundTagInfo["tags"]:
            if tag in indexedTagSummary:
                families.add(indexedTagSummary[tag]["family"])
        soundTagInfo["families"] = list(families)

indexSoundTagInfosByIdAndAddFamilies(soundTagInfos)
open("freesound_tags_indexed.json", "w").write(json.dumps(soundTagInfos))
