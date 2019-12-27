# -*- coding=utf8 -*-
import math

# 当数据量过大，显示不完全时，需要对数据进行抽样
def data_sample(dList, targetNum):
    if len(dList) < targetNum:
        return dList
    
    step = float(len(dList)) / targetNum
    step = int(round(step))

    retList = []
    idx = 1
    for item in dList:
        if idx == 1:
            retList.append(item)
        if idx == step:
            idx = 1
        else:
            idx += 1
    
    return retList

if __name__ == "__main__":
    dList = [1,2,3,4,5,6,7,8,9,10]
    print(data_sample(dList, 6))
        

