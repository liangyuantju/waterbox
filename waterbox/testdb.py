#-*- coding=utf8 -*-
import mysql.connector
import random

def addRandomData(num):
    conn = mysql.connector.connect(user='root', password='zjusec', database='waterbox', use_unicode=True)
    cursor = conn.cursor()

    for i in range(num):
        temperature = random.randint(2000, 2500)
        humidity    = random.randint(2000, 2500)
        waterlevel  = random.randint(50, 200)
        watermeter  = (random.randint(1, 10))/10
        acidbase    = random.randint(100, 1400)
        watergate   = 0
        waterpump   = 1
        cmd = 'INSERT INTO water_tb (temperature, humidity, waterlevel, watermeter, acidbase, watergate, waterpump) '\
              'VALUES (%s, %s, %s, %s, %s, %s, %s);' % (temperature, humidity, waterlevel, watermeter, acidbase, watergate, waterpump)
        cursor.execute(cmd)
    
    conn.commit()
    cursor.close()
    conn.close()

def generate_simulate_date():
    """
    Func:
        使用随机数生成数据库数据
    """
    conn = mysql.connector.connect(user='root', password='zjusec', database='waterbox', use_unicode=True)
    cursor = conn.cursor()
    
    for _ in range(1000):
        cargo_type = random.randint(0, 1)
        day    = random.randint(13, 19)
        hour   = random.randint(0, 23)
        minute = random.randint(0, 59)
        sec    = random.randint(0, 59)
        cmd = "INSERT INTO robotic_arm (cargo_type, update_time) VALUES (%d, \"2020-01-%d %d:%d:%d\");" % (cargo_type, day, hour, minute, sec)
        cursor.execute(cmd)

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    generate_simulate_date()
            
