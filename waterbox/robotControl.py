# -*-coding=utf8-*-
import functools
import json
import datetime
import random
import requests

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from waterbox.db import get_db

bp = Blueprint('robot', __name__)

g_status = False
g_cargo_weight = 0.0

@bp.route('/robot', methods=(['POST', 'GET']))
def rotbot():
    return render_template('html/robotic-arm.html')

@bp.route('/robotic_arm_status', methods=(['POST']))
def robotic_arm_status():
    """
    Func:
        提供API给网关上传机械臂实时运行状态
    """
    global g_status
    data = json.loads(request.get_data(as_text=True))
    g_status = data.get('status')
    print("[robotic_arm_status]-[g_status = %s]" % g_status)
    return json.dumps({
        'info' : 'succeed',
        'code' : 200,
    })

@bp.route('/display_arm_status', methods=(['GET']))
def display_arm_status():
    """
    Func:
        提供API给前端JS调用，实时展示机械臂运行状态
    """
    return json.dumps({
        'status' : g_status,
    })

@bp.route('/cur_cargo_weight', methods=(['POST']))
def cur_cargo_weight():
    """
    Func:
        提供API给网关，上传当前货物重量，类型float
    """
    global g_cargo_weight
    data = json.loads(request.get_data(as_text=True))
    try:
        weight = float(data['cargo_weight'])
    except:
        g_cargo_weight = 0.0
        print("[cur_cargo_weight]-[trans data error]-[data:%s]" % (data))
        return json.dumps({
            'info' : 'failed',
            'code' : 500,
        })
    else:
        g_cargo_weight = weight
        print("[cur_cargo_weight]-[g_cargo_weight = %s]" % g_cargo_weight)
        return json.dumps({
            'info' : 'succeed',
            'code' : 200,
        })

@bp.route('/display_cargo_weight', methods=(['GET']))
def display_cargo_weight():
    """
    Func:
        提供API给前端JS，用于展示实时货物重量
    """
    return json.dumps({
        'value' : g_cargo_weight,
    })

def count_cargo_by_hour(cursor):
    """
    Func:
        按照小时为维度，查询当天00：00 - 23：59分的小质量货物数量、大质量货物数量、货物总数
    Args:
        cursor: 数据库句柄，通过该参数避免多次链接数据库
    Return:
        count_light_cargo_by_hour : 当天每小时的小质量货物统计
        count_heavy_cargo_by_hour : 当天每小时的大质量货物统计
        count_total_cargo_by_hour : 当天每小时的所有货物统计
    """
    date = datetime.datetime.now()
    date = date.strftime("%Y-%m-%d")
    year,month,day = date.split('-')
    count_light_cargo_by_hour = []
    count_heavy_cargo_by_hour = []
    count_total_cargo_by_hour = []
    for idx in range(24):
        cmd1 = "SELECT COUNT(*) FROM robotic_arm WHERE update_time > \"%s-%s-%s %s:00:00\" and update_time < \"%s-%s-%s %s:00:00\" and cargo_type = 0" % (year, month, day, idx, year, month, day, idx+1)
        cursor.execute(cmd1)
        light_values = cursor.fetchone()[0]
        cmd2 = "SELECT COUNT(*) FROM robotic_arm WHERE update_time > \"%s-%s-%s %s:00:00\" and update_time < \"%s-%s-%s %s:00:00\" and cargo_type = 1" % (year, month, day, idx, year, month, day, idx+1)
        cursor.execute(cmd2)
        heavy_values = cursor.fetchone()[0]
        total_values = int(light_values) + int(heavy_values)
        
        count_light_cargo_by_hour.append(light_values)
        count_heavy_cargo_by_hour.append(heavy_values)
        count_total_cargo_by_hour.append(total_values)
    
    return (count_light_cargo_by_hour,  count_heavy_cargo_by_hour, count_total_cargo_by_hour)

def obtain_week_days():
    """
    Func:
        获取本周内的所有日期
    Returns:
        week_date: 排序之后的日期列表[2020-01-13, 2020-01-14, ..., 2020-01-19]
    """
    today = datetime.date.today()
    day_forward  = today
    day_backward = today 
    oneday_delta = datetime.timedelta(days=1)
    week_date = list()
    while day_forward.weekday() != 6:
        day_forward += oneday_delta
        week_date.append(day_forward.strftime("%Y-%m-%d"))
    while day_backward.weekday() != 0:
        day_backward -= oneday_delta
        week_date.append(day_backward.strftime("%Y-%m-%d"))
    week_date.append(today.strftime("%Y-%m-%d"))
    return sorted(week_date)

def count_cargo_by_day(cursor):
    """
    Func:
        按照天为维度，查询本周的轻质量货物数量、重质量货物数量、货物总数
    Args:
        cursor: 数据库句柄，通过该参数避免多次链接数据库
    Return:
        count_light_cargo_by_day : 当周每天的小质量货物统计
        count_heavy_cargo_by_day : 当周每天的大质量货物统计
        count_total_cargo_by_day : 当周每天的所有货物统计
    """
    week_date = obtain_week_days()
    count_light_cargo_by_day = []
    count_heavy_cargo_by_day = []
    count_total_cargo_by_day = []
    for date in week_date:
        cmd1 = "SELECT COUNT(*) FROM robotic_arm WHERE DATE(update_time) = \"%s\" and cargo_type = 0" % date
        cursor.execute(cmd1)
        light_counts = cursor.fetchone()[0]
        cmd2 = "SELECT COUNT(*) FROM robotic_arm WHERE DATE(update_time) = \"%s\" and cargo_type = 1" % date
        cursor.execute(cmd2)
        heavy_counts = cursor.fetchone()[0]
        total_counts = int(light_counts) + int(heavy_counts)

        count_light_cargo_by_day.append(light_counts)
        count_heavy_cargo_by_day.append(heavy_counts)
        count_total_cargo_by_day.append(total_counts)
    return (count_light_cargo_by_day, count_heavy_cargo_by_day, count_total_cargo_by_day)

@bp.route('/query_cargo_count', methods=(['GET']))
def query_cargo_count():
    """
    Func:
        查询当天与当周的货物总数，分为轻、重、总数
    """
    conn = get_db()
    cursor = conn.cursor()
    count_light_cargo_by_hour,  count_heavy_cargo_by_hour, count_total_cargo_by_hour = count_cargo_by_hour(cursor)
    count_light_cargo_by_day, count_heavy_cargo_by_day, count_total_cargo_by_day = count_cargo_by_day(cursor)
    cursor.close()
    conn.close()

    json_dic = {
        'count_light_by_hour' : count_light_cargo_by_hour,
        'count_heavy_by_hour' : count_heavy_cargo_by_hour,
        'count_total_by_hour' : count_total_cargo_by_hour,
        'count_light_by_day'  : count_light_cargo_by_day,
        'count_heavy_by_day'  : count_heavy_cargo_by_day,
        'count_total_by_day'  : count_total_cargo_by_day,
    }

    return json.dumps(json_dic)

@bp.route('/set_robotic_arm', methods=(['POST']))
def set_robotic_arm():
    """
    Func:
        通过调用网关的API接口, 从云端控制机械臂
    """
    data = json.loads(request.get_data(as_text=True))
    try:
        funcName = str(data['funcName'])
        param    = str(data['param'])  
    except:
        retJson = {
            'code':-1,
            'info':'data No funcName or Param, data is %s' % str(data)
        }
        return json.dumps(retJson)
    else:
        url = "http://10.1.119.231:8889/mecharm"
        data = {
            'funcName' : funcName,
            'param'    : param,
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

def generate_simulate_date():
    """
    Func:
        使用随机数生成数据库数据
    """
    conn = get_db()
    cursor = conn.cursor()
    
    for _ in range(2000):
        cargo_type = random.randint(0, 1)
        day    = random.randint(13, 19)
        hour   = random.randint(0, 23)
        minute = random.randint(0, 59)
        sec    = random.randint(0, 59)
        cmd = "INSERT INTO robotic_arm (cargo_type, update_time) VALUES (%d, \"2020-01-%d %d:%d:%d\");" % (cargo_type, day, hour, minute, sec)
        cursor.execute(cmd)

    cursor.close()
    conn.close()
