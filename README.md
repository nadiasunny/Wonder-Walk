# Wonder Walk

## Table of Contents

* [Summary](#summary)
* [Tech Stack](#tech-stack)
* [Features](#features)
* [Setup](#setup)
* [Developer](#developer)

## <a name="summary"></a>Summary
**WonderWalk** is a self improvement app to help people live better. Emphasis on small steps to create habits. User's can go on random walks and create reflections.

See the <a href="https://www.youtube.com/watch?v=nHU7M8jQVxk">Demo Reel.</a>

## <a name="tech-stack"></a>Tech Stack
__Front End:__ HTML5, Jinja2, CSS, JavaScript, AJAX, jQuery, Bootstrap<br/>
__Back End:__ Python, Flask, PostgreSQL, SQLAlchemy <br/>
__API's:__ Google Maps API 

## <a name="features"></a>Features

Create and Log in to an account.
Choose to input address(geocoding) or click the pan to the current location button(HTML5 geolocation). 
Enter desired length of walk and have a random walk generated.
Save a walk.
View and edit walk entries.

## <a name="set Up"></a>Tech Stack
1. Make a copy of the repo.
2. Activate and set up virtual environment. 
    - Make sure to pip install -r requirements.txt
3. Create a Google Maps API Key: 
    - Making sure to use your IP Address as the host and allowing the JavaScript Maps API.
3. Create a secrets.sh file:
    - Inside secrets.sh export 'Map_Key' where map key is your Google Maps API Key.
5. Source secrets.sh.
6. Run seed_database.py.
7. Run server.py and go to localhost:5000 and take the first step.
 

## <a name="Developer"></a>Tech Stack

Nadia Hina is a curious engineer excited by the opportunities around her.