"""Server for Wonder Walk app."""
import os

from flask import Flask, render_template, jsonify, send_from_directory
from model import connect_to_db, db
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

KEY = os.environ['MAP_KEY']

@app.route("/")
def index():
    """Show homepage."""

    return render_template('homepage.html')

@app.route("/map/wonderwalk")
def view_basic_map():
    """Demo of basic map-related code.

    - Programmatically adding markers, info windows, and event handlers to a
      Google Map
    - Showing polylines, directions, etc.
    """

    return render_template("map.html", mapkey=KEY)

# @app.route("/map/more")
# def view_more_demos():
#     """Demo of basic map-related code.
#     """

#     return render_template("playmap.html")

@app.route("/map/static/<path:resource>")
def get_resource(resource):
    return send_from_directory("static", resource)


if __name__ == "__main__":
    app.debug = True
    connect_to_db(app)

    app.run(host="0.0.0.0")