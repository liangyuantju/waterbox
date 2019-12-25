# -*- coding=utf8 -*-

"""
author: YuanL
date  : 2019-12-25 12:56
func  : initial config.txt, don't use it, unless reformat display system
"""

import pickle

if __name__ == "__main__":
    thresholdDic = {
        'temperature':0,
        'humidity':0,
        'acidbase':{
            'left_thres':0,
            'right_thres':0,
        },
        'waterlevel':0,
    }

    filePath = "config.txt"
    with open(filePath, 'wb') as fw:
        pickle.dump(thresholdDic, fw)
        print("Initial config.txt Completed!")
