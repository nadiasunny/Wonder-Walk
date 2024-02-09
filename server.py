"""Server for Wonder Walk app."""
import os

from flask import (Flask, render_template, send_from_directory, request, flash, session, redirect)
from model import connect_to_db, db
from datetime import datetime
from jinja2 import StrictUndefined
import crud

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

KEY = os.environ['MAP_KEY']


@app.route("/login")
def log_on():
    """Let user log in."""

    return render_template('login_signup.html')
#there should only be the first one and all other instances of /map/wonderwalk --> /
@app.route('/')
def homepage():
    return render_template("map.html", mapkey=KEY)

@app.route("/map/wonderwalk")
def view_basic_map():
    """etc.
    """

    return render_template("map.html", mapkey=KEY)

@app.route('/users', methods=['POST'])
def create_acc():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    num_of_users = len(crud.get_user_by_email(email))
    created_on = datetime.now()
    if (num_of_users == 0):
        current_user = crud.create_user(username=username, email=email, password=password,
                                        streak=1, created_at=created_on)
        db.session.add(current_user)
        db.session.commit()
        flash('You have created an account!')
    elif(num_of_users == 1):
        flash('Account already exists')

    return redirect('/')

@app.route('/login', methods=['POST'])
def login():
    user_email = request.form.get('email')
    user_password = request.form.get('password')
    our_user = crud.get_user_by_email(user_email)[0]
    if (our_user.password == user_password):
        session['user'] = our_user.id
        print(session['user'])
        flash('Logged In!')

    return redirect('/map/wonderwalk')

@app.route('/logout')
def logout():
        
        print(session.clear())
        flash('Logged Out!')

        return redirect('/map/wonderwalk')



#ajax request
@app.route('/savewalk', methods=['POST'])
def walk():
    """Save walk to db and connect to user."""
    
    end_lat = request.json.get('outcome')['lat']
    end_lng = request.json.get('outcome')['lng']
    start_lng = request.json.get('start')['userLng']
    start_lat = request.json.get('start')['userLat']
    distance = request.json.get('distance')
    time = request.json.get('minutes')
    now = datetime.now()
    walk_already = crud.return_walk(end_lat=end_lat, end_lng=end_lng, start_lat=start_lat, start_lng=start_lng)
    
    if(walk_already):
        flash('walk already saved')
    else:
        walk = crud.save_walk(end_lat=end_lat, end_lng=end_lng, start_lat=start_lat, 
                          start_lng=start_lng, distance_in_km=distance, time=time)
        db.session.add(walk)
        db.session.commit()
        user_walk = crud.create_user_walk(user_id=session['user'], walk_id=walk.id, created_at=now)
        db.session.add(user_walk)
        db.session.commit()
        flash('walk added')
   
    return {'success': True}

@app.route('/savedwalks')                  # JUST LINES 103-107 are rendering 
def display_walks():
    walks = crud.return_users_walks(session['user']) 
    return render_template('/display_walks.html', walks=walks)

@app.route('/updateUserWalk', methods=['POST'])
def update_user_walk():

    comments = request.json.get('comments')
    rating = int(request.json.get('rating'))
    # img = request.json.get('img')
    walk_index = int(request.json.get('walkIndex'))
    
    #run the function, make the print statement separate
    #make sure you're using the correct UserWalk id
    print(type(comments), type(rating), type(img), type(walk_index), 'aaaaaaaaaaaaaaaaa')
    updated_walk = crud.update_user_walk(user_id=session['user'], user_walk_id=walk_index, comments=comments, rating=rating)
    print(updated_walk)
    db.session.execute(updated_walk)
    db.session.commit()
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