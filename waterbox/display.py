import functools
import json
import random

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from waterbox.db import get_db

bp = Blueprint('display', __name__)

featureSet = ['temperature', 'humidity', 'watermeter', 'acidbase', 'waterlevel', 'waterpump', 'watergate']

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

@bp.route('/queryHisDataByDateRange', methods=('POST', ))
def queryHisDataByDateRange():
    data = json.loads(request.get_data(as_text=True))
    startDate = data['outputDateStart']
    endDate = data['outputDateEnd']
    dStart  = dataRestructure(startDate)
    dEnd = dataRestructure(endDate)
    dType = str(data['dType'])
    if (dStart is None) or (dEnd is None) or (dType not in featureSet):
        retArr = [
            {
                'code' : -1,
                'dType': dType,
                'data' : []
            },
        ]
        return json.dumps(retArr) 
    
    conn = get_db()
    cursor = conn.cursor()
    queryCmd = 'SELECT %s FROM water_tb WHERE DATE(update_time) >= "%s" AND DATE(update_time) <= "%s"' % (dType, dStart, dEnd)
    print(queryCmd)
    cursor.execute(queryCmd)
    values = cursor.fetchall()
    retDic = {
        'code' : 0,
        'dType': dType,
        'data' : []
    }
    for item in values:
        retDic['data'].append(item)

    return json.dumps([retDic])

    




