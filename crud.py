"""CRUD operations."""

from model import db, User, Walk, User_Walk, connect_to_db


def save_walk(end_lat, end_lng, start_lat, start_lng, distance_in_km, time):
    """save and return a new walk."""

    walk = Walk(end_lat=end_lat, end_lng=end_lng, start_lat=start_lat, start_lng=start_lng, distance_in_km=distance_in_km, time=time)
   
    return walk


def get_user_by_email(user_email):
    """Return user by use"""
    return User.query.filter(User.email == user_email).all()

def create_user(username, email, password, streak, created_at):
    """Create and return a new user."""

    user = User(username=username, email=email, password=password, streak=streak, created_at=created_at)

    return user

def return_user():
    user = User.get()
    return user

def return_walk(end_lat, end_lng, start_lat, start_lng):
    check_for_walk = Walk.query.filter(Walk.end_lat==end_lat, Walk.end_lng==end_lng, Walk.start_lat==start_lat,
                                        Walk.start_lng==start_lng).one_or_none()
    return check_for_walk

def create_user_walk(user_id, walk_id, created_at):
    """Create and return a new user."""

    user_walk = User_Walk(user_id=user_id, walk_id=walk_id, created_at=created_at)

    return user_walk

def return_users_walks(user_id):
    walks = User_Walk.query.filter(User_Walk.user_id == user_id).all()
    return walks

if __name__ == '__main__':
    from server import app
    connect_to_db(app)