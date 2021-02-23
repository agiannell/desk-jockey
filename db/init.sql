drop TABLE if exists room_junction, users, room;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    profile_pic TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    playlist_uri text,
    UNIQUE (email)
);

CREATE TABLE room(
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(55) NOT NULL,
    room_pic TEXT,
    password VARCHAR(255),
    is_private boolean NOT NULL DEFAULT false,
    is_collaborative boolean NOT NULL DEFAULT false,
    genre varchar(55),
    description VARCHAR(255),
    created_by int references users(user_id) on delete cascade
);

create table room_junction (
    junction_id SERIAL PRIMARY KEY,
    room_id int references room(room_id) on delete cascade,
    user_id int references users(user_id) on delete cascade
);