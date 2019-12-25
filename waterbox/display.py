import functools
import json
import random
import pickle
import os
import requests

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from waterbox.db import get_db

bp = Blueprint('display', __name__)

# --------------------------- Global Param Declaration ---------------------------
featureSet = ['temperature', 'humidity', 'watermeter', 'acidbase', 'waterlevel', 'waterpump', 'watergate']

thresholdDic = {
    'temperature':0,
    'humidity':0,
    'acidbase':{
        'left_thres':0,
        'right_thres':0,
    },
    'waterlevel':0,
}

g_lastedParam = {}

configFile = 'config.txt'

g_init = False

g_alertStatus = {
    "temperature" : 0,
    'humidity' : 0,
    'acidbase' : 0,
    'waterlevel' : 0,
}
# --------------------------- Nav Jump Html ---------------------------
@bp.route('/index', methods=('POST', 'GET'))
def index():
    return render_template('html/index.html')

@bp.route('/header', methods=('POST', 'GET'))
def header():
    return render_template('html/header.html')

@bp.route('/gate_control', methods=('POST', 'GET'))
def gate_control():
    return render_template('html/gate-control.html')

@bp.route('/level_control', methods=('POST', 'GET'))
def level_control():
    return render_template('html/level-control.html')

@bp.route('/ht_setting', methods=('POST', 'GET'))
def ht_setting():
    return render_template('html/ht-setting.html')

@bp.route('/level_setting', methods=('POST', 'GET'))
def level_setting():
    return render_template('html/level-setting.html')

@bp.route('/quality_setting', methods=('POST', 'GET'))
def quality_setting():
    return render_template('html/quality-setting.html')

@bp.route('/his_data', methods=('POST', 'GET'))
def his_data():
    return render_template('html/his-data.html')

@bp.route('/output_data', methods=('POST', 'GET'))
def output_data():
    return render_template('html/output-data.html')

# --------------------------- DB Query Operation ---------------------------
@bp.route('/queryAllData', methods=('POST', 'GET'))
def queryAllData():
    conn = get_db()
    cursor = conn.cursor()

    querycmd = 'SELECT * FROM water_tb;'
    cursor.execute(querycmd)
    values = cursor.fetchall()

    cursor.close()
    conn.close()

    json_arr = []
    for item in values:
        json_item = {}
        json_item['id'] = item[0]
        json_item['temperature'] = float(item[1])/100
        json_item['humidity'] = float(item[2])/100
        json_item['watermeter'] = float(item[3])
        json_item['acidbase'] = float(item[4])/100
        json_item['waterlevel'] = float(item[5])/100
        json_item['waterpump'] = int(item[6])
        json_item['watergate'] = int(item[7])
        json_item['update_time'] = item[8].strftime('%Y-%m-%d %H:%M:%S')
        json_arr.append(json_item)

    return json.dumps(json_arr)

@bp.route('/queryLatestedData', methods=('POST', 'GET'))
def queryLatestedData():
    conn = get_db()
    cursor = conn.cursor()
    queryCmd = 'SELECT * FROM water_tb ORDER BY id DESC LIMIT 1;'
    cursor.execute(queryCmd)
    values = cursor.fetchone()
    cursor.close()
    conn.close()

    json_item = {}
    json_item['id'] = values[0]
    json_item['temperature'] = float(values[1])/100
    json_item['humidity'] = float(values[2])/100
    json_item['watermeter'] = float(values[3])
    json_item['acidbase'] = float(values[4])/100
    json_item['waterlevel'] = float(values[5])/100
    json_item['waterpump'] = int(values[6])
    json_item['watergate'] = int(values[7])
    json_item['update_time'] = values[8].strftime('%Y-%m-%d %H:%M:%S')

    global g_init
    global g_alertStatus
    global thresholdDic

    if g_init == False:
        base_dir = os.path.dirname(__file__)
        filePath = 'config.txt'
        path = os.path.join(base_dir, filePath)
        with open(path, 'rb') as fr:
            thresholdDic = pickle.load(fr)
            g_init = True
            print("####### config.txt Loaded Completed. #######\n %s" % str(g_alertStatus))

    if json_item['temperature'] > thresholdDic['temperature']:
        g_alertStatus['temperature'] = 1
    else:
        g_alertStatus['temperature'] = 0
    
    if json_item['humidity'] > thresholdDic['humidity']:
        g_alertStatus['humidity'] = 1
    else:
        g_alertStatus['humidity'] = 0

    if json_item['waterlevel'] > thresholdDic['waterlevel']:
        g_alertStatus['waterlevel'] = 1
    else:
        g_alertStatus['waterlevel'] = 0

    if json_item['acidbase'] < thresholdDic['acidbase']['left_thres'] or json_item['acidbase'] > thresholdDic['acidbase']['right_thres']:
        g_alertStatus['acidbase'] = 1
    else:
        g_alertStatus['acidbase'] = 0

    return json.dumps([json_item, g_alertStatus])


@bp.route('/queryLatestedPathchData', methods=('POST', 'GET'))
def queryLatestedPathchData():
    conn = get_db()
    cursor = conn.cursor()
    queryCmd = 'SELECT * FROM water_tb ORDER BY id DESC LIMIT 10;'
    cursor.execute(queryCmd)
    values = cursor.fetchall()

    cursor.close()
    conn.close()

    json_arr = []
    for item in values:
        json_item = {}
        json_item['id'] = item[0]
        json_item['temperature'] = float(item[1])/100
        json_item['humidity'] = float(item[2])/100
        json_item['watermeter'] = float(item[3])
        json_item['acidbase'] = float(item[4])/100
        json_item['waterlevel'] = float(item[5])/100
        json_item['waterpump'] = int(item[6])
        json_item['watergate'] = int(item[7])
        json_item['update_time'] = item[8].strftime('%Y-%m-%d %H:%M:%S')
        json_arr.append(json_item)

    return json.dumps(json_arr)

def dataRestructure(originData):
    dArr = originData.strip().split('/')
    if len(dArr) == 3:    
        return dArr[2] + '-' + dArr[0] + '-' + dArr[1]
    else:
        return None

@bp.route('/queryHisDataByDateRange', methods=('POST', 'GET'))
def queryHisDataByDateRange():
    data = json.loads(request.get_data(as_text=True))

    print('data_js: %s' % str(data))

    startDate = data['outputDateStart']
    endDate = data['outputDateEnd']
    dStart  = dataRestructure(startDate)
    dEnd = dataRestructure(endDate)
    dType = str(data['dataType'])
    if (dStart is None) or (dEnd is None) or (dType not in featureSet):
        retArr = [
            {
                'code' : -1,
                'dType': dType,
                'data' : [],
                'update_time':[],
            },
        ]
        return json.dumps(retArr) 
    
    conn = get_db()
    cursor = conn.cursor()
    queryCmd = 'SELECT %s, update_time FROM water_tb WHERE DATE(update_time) >= "%s" AND DATE(update_time) <= "%s";' % (dType, dStart, dEnd)
    print(queryCmd)
    cursor.execute(queryCmd)
    values = cursor.fetchall()

    cursor.close()
    conn.close()

    print(values)
    retDic = {
        'code' : 0,
        'dType': dType,
        'data' : [],
        'update_time':[],
    }

    # If dataType in ['temperature', 'humidity', 'acidbase', 'waterlevel'], value = value/100
    if dType in ['temperature', 'humidity', 'acidbase', 'waterlevel']:
        for item in values:
            retDic['data'].append(float(item[0])/100)
            retDic['update_time'].append(item[1].strftime('%Y-%m-%d %H:%M:%S'))
    else:
        for item in values:
            retDic['data'].append(item[0])
            retDic['update_time'].append(item[1].strftime('%Y-%m-%d %H:%M:%S'))
    
    return json.dumps([retDic])


# ----------------- alert threshold Set --------------------
@bp.route('/paramThresholdSaved', methods=('POST', 'GET'))
def paramThresholdSaved():
    data = json.loads(request.get_data(as_text=True))
    dataType = str(data['dataType'])

    if dataType not in thresholdDic:
        retDic = {
            'code' : -1,
            'info' : 'dataType not in thresDic, dataType is %s' % dataType
        }
        return json.dumps([retDic])
    else:
        try:
            if dataType == "acidbase":
                left_val  = float(data['value']['leftVal'])
                right_val = float(data['value']['rightVal'])
                thresholdDic['acidbase']['left_thres'] = left_val
                thresholdDic['acidbase']['right_thres'] = right_val
            else:
                thresholdDic[dataType] = float(data['value'])
        except:
            return json.dumps([
                {
                    'code' : -1,
                    'info' : 'threshold value not float type, value is %s' % data['value']
                }
            ])
        else:
            print("thresDic has updated to : %s" % str(thresholdDic))
            # Saved ThresHold Into File:[config.txt]
            base_dir = os.path.dirname(__file__)
            filePath = 'config.txt'
            path = os.path.join(base_dir, filePath)
            with open(path, 'wb') as fw:
                pickle.dump(thresholdDic, fw)

            if dataType == "acidbase":
                return json.dumps([
                    {
                        'code' : 0,
                        'info' : 'success, %s threshold has set to (%s - %s)' % (dataType, float(data['value']['leftVal']), float(data['value']['rightVal']))
                    }
                ])
            else:
                return json.dumps([
                    {
                        'code' : 0,
                        'info' : 'success, %s threshold has set to %s' % (dataType, float(data['value']))
                    }
                ])

# @bp.route('/acidThresSaved')
# ----------------- display alert threshold --------------------
@bp.route('/displayThresHold', methods=('POST', 'GET'))
def displayThresHold():
    conn = get_db()
    cursor = conn.cursor()
    queryCmd = 'SELECT * FROM water_tb ORDER BY id DESC LIMIT 1;'
    cursor.execute(queryCmd)
    values = cursor.fetchone()
    cursor.close()
    conn.close()

    cur_param = {}
    cur_param['id'] = values[0]
    cur_param['temperature'] = float(values[1])/100
    cur_param['humidity'] = float(values[2])/100
    cur_param['watermeter'] = float(values[3])
    cur_param['acidbase'] = float(values[4])/100
    cur_param['waterlevel'] = float(values[5])/100
    cur_param['waterpump'] = int(values[6])
    cur_param['watergate'] = int(values[7])
    cur_param['update_time'] = values[8].strftime('%Y-%m-%d %H:%M:%S')

    json_dic = {
        "cur_param":cur_param,
        'cur_thres':thresholdDic,
    }

    # print("----------------------displayThresHold Return Json-------------------")
    # print(json_dic['cur_thres'])

    return json.dumps([json_dic])

# ----------------- control data --------------------
g_controlData = {
    'setpump' : 0,
    'setgate' : 0,
    'setauto'  : 0,
    'setlevel': 0,
}

@bp.route('/controlDataDisplay', methods=('POST', 'GET'))
def controlDataDisplay():
    global g_controlData
    return json.dumps([g_controlData])

# ----------------- call restful api --------------------
@bp.route('/callRestfulApi', methods=('POST', 'GET'))
def callRestfulApi():
    data = json.loads(request.get_data(as_text=True))
    try:
        funcName = str(data['funcName'])
        param    = str(data['param'])
        g_controlData[funcName] = param
        if funcName == "setlevel":
            param = float(param) * 100
            param = str(int(param))    
    except:
        retJson = {
            'code':-1,
            'info':'data No funcName or Param, data is %s' % str(data)
        }
        return json.dumps(retJson)
    else:
        url = "http://10.1.119.73:8888/waterbox"
        data = {
            'funcName' : str(funcName),
            'param': str(param)
        }
        headers = {'Content-type': 'application/json'}
        try:
            data_json = json.dumps(data)
            requests.post(url, data=data_json, headers=headers)
        except:
            retJson = {
                'code':-1,
                'info':"Post GateWay Restful API Failed. [funcName=%s, param=%s]" % (funcName, param)
            }
            return json.dumps(retJson)
        else:
            retJson = {
                'code':0,
                'info':"Post Gateway Restful API succeed. [funcName=%s, param=%s]" % (funcName, param)
            }
            return json.dumps(retJson)