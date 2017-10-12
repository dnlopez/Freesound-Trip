#!python

import os
import fabricate
import fabricate_helpers
import fabricate_dependencies
from glob import *


def getConfig(i_configurationName):
    cfg = fabricate_helpers.FabConfiguration()
    cfg.name = i_configurationName

    cfg.baseBuildDir = 'build'
    cfg.buildDir = cfg.baseBuildDir + '/' + cfg.name


    #

    cfg.htmlSrcFile = 'index_src.html'

    cfg.includeDirs = []
    cfg.includeDirs += ["/home/daniel/docs/code/js/reusable/checkout"]
    # Using dan_reusable commit: 05648ce
    cfg.includeDirs += ["/home/daniel/docs/code/js/refactored"]
    cfg.includeDirs += [("externals", None)]

    #import platform
    #if platform.system() == 'Linux' and platform.node().upper() == 'ENO':
    #    generalProgDir = "/mnt/ve/prog"
    #elif platform.system() == 'Windows' and platform.node().upper() == 'BYRNE':
    #    generalProgDir = "E:/prog"
    #cfg.includeDirs += [generalProgDir + "/js"]

    return cfg


def makeDanReusableScriptTagsLocal(i_htmlFilePath):
    import shutil
    if os.path.exists("externals/dan_reusable"):
        shutil.rmtree("externals/dan_reusable")

    import re

    outputLines = []
    fileHandle = open(i_htmlFilePath, "r")
    for inputLine in fileHandle:
        matchObject = re.match(r'^( *<script [^>]*src=")([^"]+)("[^>]*></script>\n)', inputLine)
        if matchObject != None:
            preamble = matchObject.groups()[0]
            srcPath = matchObject.groups()[1]
            postamble = matchObject.groups()[2]

            if srcPath.startswith("/home/daniel/docs/code/js/reusable/checkout/dan/"):
                newSrcPath = "externals/dan_reusable/dan/" + srcPath[len("/home/daniel/docs/code/js/reusable/checkout/dan/"):]
                fabricate_helpers.createTree(os.path.split(newSrcPath)[0])
                shutil.copyfile(srcPath, newSrcPath)
                outputLines.append(preamble + newSrcPath + postamble)
            else:
                outputLines.append(inputLine)
        else:
            outputLines.append(inputLine)
    fileHandle.close()

    with open(i_htmlFilePath, "w") as handle:
        handle.write("".join(outputLines))

def build():
    cfg = getConfig(fabricate_helpers.getCurrentBuildConfigurationName())
    print("build: " + cfg.name)

    fabricate.run("jsprep.py",
                  cfg.htmlSrcFile, "link", cfg.htmlSrcFile.replace("_src.html", ".html"),
                  [fabricate_helpers.includeDir_to_jsprepArgs(includeDir)  for includeDir in cfg.includeDirs])
    makeDanReusableScriptTagsLocal(cfg.htmlSrcFile.replace("_src.html", ".html"))


def package():
    cfg = getConfig(fabricate_helpers.getCurrentBuildConfigurationName())
    print("package: " + cfg.name)

    fabricate.run("jsprep.py",
                  cfg.htmlSrcFile, "combine-and-link", cfg.htmlSrcFile.replace("_src.html", ".html"), "all.js",
                  [fabricate_helpers.includeDir_to_jsprepArgs(includeDir)  for includeDir in cfg.includeDirs])


def run():
    cfg = getConfig(fabricate_helpers.getCurrentBuildConfigurationName())
    print("run")

    import platform
    if platform.system() == 'Linux':
        url = "http://localhost:8080" + os.path.splitdrive(os.getcwd())[1].replace("\\", "/") + "/" + cfg.htmlSrcFile.replace("_src.html", ".html")
        fabricate_helpers.directStartArgs("chromium", "--remote-debugging-port=9222", url)
    elif platform.system() == 'Windows' and platform.node().upper() == 'BYRNE':
        url = "http://localhost:8080" + os.path.splitdrive(os.getcwd())[1].replace("\\", "/") + "/" + cfg.htmlSrcFile.replace("_src.html", ".html")
        fabricate_helpers.shellRunArgs("chrome", url)

    if platform.system() == 'Linux':
        os.chdir("/")
        fabricate_helpers.directRunArgs("http-server")
    elif platform.system() == 'Windows' and platform.node().upper() == 'BYRNE':
        os.chdir("/")  #("E:/")
        fabricate_helpers.shellRunArgs("start", "http-server")



fabricate.main(depsname=fabricate_helpers.depsFileName())
