"""Server for Wonder Walk app."""
import os

from flask import (Flask, render_template, send_from_directory, request, flash, session, redirect)
from model import connect_to_db, db
from jinja2 import StrictUndefined
import crud

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

KEY = os.environ['MAP_KEY']

@app.route("/")
def index():
    """Show homepage."""

    return render_template('homepage.html')

@app.route("/login")
def log_on():
    """Let user log in."""

    return render_template('login_signup.html')

@app.route("/map/wonderwalk")
def view_basic_map():
    """etc.
    """

    return render_template("map.html", mapkey=KEY)

#ajax request
@app.route('/savewalk', methods=['POST'])
def walk():
    """Save walk to db."""
    
    end_lat = request.json.get('outcome')['lat']
    end_lng = request.json.get('outcome')['lng']
    start_lng = request.json.get('start')['userLng']
    start_lat = request.json.get('start')['userLat']
    distance = request.json.get('distance')
    time = request.json.get('minutes')
    print(end_lat, start_lat, distance, time)
    walk = crud.save_walk(end_lat=end_lat, end_lng=end_lng, start_lat=start_lat, 
                          start_lng=start_lng, distance=distance, time=time)
   
    db.session.add(walk)
    db.session.commit()
    print(walk, 'kkkkkkkkkkkk')
    flash('walk added')
    return {'success': True}


@app.route("/map/static/<path:resource>")
def get_resource(resource):
    return send_from_directory("static", resource)


if __name__ == "__main__":
    cert_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'cert.pem'))
    key_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'key.pem'))

    connect_to_db(app)
    #app.run(host="0.0.0.0", ssl_context=(cert_path, key_path), debug=True)
    app.run(host='0.0.0.0', debug=True)