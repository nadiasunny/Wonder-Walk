"""
Capstone part 1: SQLAlchemy

Part 1: Define Model Classes
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """Data model for user"""

    __tablename__ = 'users'

    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    username = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    streak = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    user_walks = db.relationship('User_Walk', back_populates='user')
    avatar = db.relationship('Avatar', uselist=False, back_populates='user_avatar')
    
    def __repr__(self):
        """Show info about user."""

        return f'<User id={self.id} email={self.email}>'
    


class Walk(db.Model):
    """Data model for walk"""

    __tablename__ = 'walks'

    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    start_lat = db.Column(db.Float)
    start_lng = db.Column(db.Float)
    end_lat = db.Column(db.Float)
    end_lng = db.Column(db.Float)
    distance = db.Column(db.Integer)
    time = db.Column(db.Integer)

    user_walks = db.relationship('User_Walk', back_populates='walk')
     
    def __repr__(self):
        """Show info about walk."""

        return f'<Walk id={self.id}>'    

    

class User_Walk(db.Model):
    """Data model for user walks"""

    __tablename__ = 'user_walks'

    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    walk_id = db.Column(db.Integer, db.ForeignKey('walks.id'), nullable=False)
    repeated = db.Column(db.Integer, nullable = False)
    rating = db.Column(db.Integer)
    comments = db.Column(db.Text)
    images = db.Column(db.String)
    created_at = db.Column(db.DateTime, nullable=False)

    user = db.relationship('User', back_populates='user_walks')
    walk = db.relationship('Walk', back_populates='user_walks')

     
    def __repr__(self):
        """Show info about user's walk."""

        return f'<User_Walk id={self.id} user_id={self.user_id} walk_id = {self.walk_id}>'
    


class Avatar(db.Model):
    """Data model for user avatar"""

    __tablename__ = 'avatar'
    
    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    img_path = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.TIMESTAMP)

    user_avatar = db.relationship('User', uselist=False, back_populates='avatar')

    def __repr__(self):
        """Show info about avatar."""

        return f'<Avatar id={self.id} user_id={self.user_id}>'
    

def connect_to_db(flask_app, db_uri="postgresql:///wonder", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
