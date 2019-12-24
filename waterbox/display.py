import functools
import json
import random

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

    json_arr = []
    for item in values:
        json_item = {}
        json_item['id'] = item[0]
        json_item['temperature'] = float(item[1])
        json_item['humidity'] = float(item[2])
        json_item['watermeter'] = float(item[3])
        json_item['acidbase'] = float(item[4])
        json_item['waterlevel'] = float(item[5])
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

    json_item = {}
    json_item['id'] = values[0]
    json_item['temperature'] = float(values[1])
    json_item['humidity'] = float(values[2])
    json_item['watermeter'] = float(values[3])
    json_item['acidbase'] = float(values[4])
    json_item['waterlevel'] = float(values[5])
    json_item['waterpump'] = int(values[6])
    json_item['watergate'] = int(values[7])
    json_item['update_time'] = values[8].strftime('%Y-%m-%d %H:%M:%S')
    
    return json.dumps([json_item])


@bp.route('/queryLatestedPathchData', methods=('POST', 'GET'))
def queryLatestedPathchData():
    conn = get_db()
    cursor = conn.cursor()
    queryCmd = 'SELECT * FROM water_tb ORDER BY id DESC LIMIT 10;'
    cursor.execute(queryCmd)
    values = cursor.fetchall()

    json_arr = []
    for item in values:
        json_item = {}
        json_item['id'] = item[0]
        json_item['temperature'] = float(item[1])
        json_item['humidity'] = float(item[2])
        json_item['watermeter'] = float(item[3])
        json_item['acidbase'] = float(item[4])
        json_item['waterlevel'] = float(item[5])
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
    print(values)
    retDic = {
        'code' : 0,
        'dType': dType,
        'data' : [],
        'update_time':[],
    }
    for item in values:
        retDic['data'].append(item[0])
        retDic['update_time'].append(item[1].strftime('%Y-%m-%d %H:%M:%S'))
    # print(retDic)
    return json.dumps([retDic])


# ----------------- alert threshold Set --------------------
@bp.route('/paramThresholdSaved', methods=('POST', 'GET'))
def paramThresholdSaved():
    data = json.loads(request.get_data(as_text=True))
    print("Receive Data From Ajax Is: %s" % str(data))
    print("thresholdDic is %s" % str(thresholdDic))
    dataType = str(data['dataType'])

    print("--------------dataType=%s----------------" % dataType)

    if dataType not in thresholdDic:
        retDic = {
            'code' : -1,
            'info' : 'dataType not in thresDic, dataType is %s' % dataType
        }
        return json.dumps([retDic])
    else:
        try:
            if dataType == "acidbase":
                print(type(data['value']['leftVal']))
                print("++++++++++++++++ thresholdDic ++++++++++++++++++")
                left_val  = float(data['value']['leftVal'])
                right_val = float(data['value']['rightVal'])
                thresholdDic['acidbase']['left_thres'] = left_val
                thresholdDic['acidbase']['right_thres'] = right_val
                print("++++++++++++++++ ############ ++++++++++++++++++")
                print(thresholdDic)
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

    cur_param = {}
    cur_param['id'] = values[0]
    cur_param['temperature'] = float(values[1])
    cur_param['humidity'] = float(values[2])
    cur_param['watermeter'] = float(values[3])
    cur_param['acidbase'] = float(values[4])
    cur_param['waterlevel'] = float(values[5])
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





