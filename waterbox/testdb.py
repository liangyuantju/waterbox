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

if __name__ == "__main__":
    addRandomData(100000)
            
