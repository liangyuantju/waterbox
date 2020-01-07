import functools
import json

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from waterbox.db import get_db

bp = Blueprint('login', __name__)

def check_username(username):
    escape_words = [',', "'", '"', ';', '<', '>']
    escape_username = ""
    for item in username:
        if item in escape_words:
            item = '\\'+item
        escape_username += item
    return escape_username
        

@bp.route('/signin', methods=('POST', 'GET'))
def signin():
    if request.method == "POST":
        data = json.loads(request.get_data(as_text=True))
        username = data.get('username')
        if username == None:
            return json.dumps({
                'data':None,
            })
        print('username = %s' % username)
        username = check_username(username)
        print('escapeusername=%s' % username)
        
        ret_json = json.dumps({
            'data':'testing'
        })

        conn = get_db()
        cursor = conn.cursor()
        queryCmd = 'SELECT username, password FROM userinfo_tb WHERE username="%s";' % (str(username))
        print('queryCmd='+queryCmd)
        cursor.execute(queryCmd)
        values = cursor.fetchall()
        cursor.close()
        conn.close() 

        ret_json = json.dumps({
            'data':values,
        })
        
        return ret_json
    return render_template('html/signin.html')

