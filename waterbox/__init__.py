import os

from flask import Flask, render_template

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY = 'dev',
        # DATABASE = os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    # if test_config is None:
    #     #load the instance config, if it exits, when not testing
    #     app.config.from_pyfile('config.py', silent=True)
    # else:
    #     #load the test config if passed in 
    #     app.config.from_mapping(test_config)
    
    # ensure the instance folder exists
    # try:
    #     os.makedirs(app.instance_path)
    # except OSError:
    #     pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'hello, world!'

    from . import db
    db.init_app(app)

    @app.route('/testdb')
    def testdb():
        conn = db.get_db()
        cursor = conn.cursor()
        cursor.execute('select watermeter from water_tb where id = %s', ('1',))
        values = cursor.fetchall()
        return str(values[0])

    from . import login
    app.register_blueprint(login.bp)

    from . import display
    app.register_blueprint(display.bp)

    from . import robotControl
    app.register_blueprint(robotControl.bp)
    
    return app