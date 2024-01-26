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
    """etc.
    """

    return render_template("map.html", mapkey=KEY)


@app.route("/map/static/<path:resource>")
def get_resource(resource):
    return send_from_directory("static", resource)


if __name__ == "__main__":
    cert_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'cert.pem'))
    key_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'key.pem'))

    connect_to_db(app)
    #app.run(host="0.0.0.0", ssl_context=(cert_path, key_path), debug=True)
    app.run(host='0.0.0.0', debug=True)