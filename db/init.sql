DROP TABLE IF EXISTS room_junction, users, room;

CREATE TABLE users (
    user_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    display_name text NOT NULL,
    email text NOT NULL,
    profile_pic text NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    playlist_uri text,
    UNIQUE (email)
);

CREATE TABLE room(
    room_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    room_name text NOT NULL,
    room_pic text,
    password text,
    is_private boolean NOT NULL DEFAULT false,
    is_collaborative boolean NOT NULL DEFAULT false,
    genre text,
    description text,
    created_by int REFERENCES users(user_id) on delete cascade
);

alter table room_junction add constraint room_junction_uq unique (room_id,user_id);

create table room_junction (
    junction_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id int REFERENCES room(room_id) on delete cascade,
    user_id int REFERENCES users(user_id) on delete cascade
);

create table chat (
    chat_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content text,
    room_id int REFERENCES room(room_id) on delete cascade
);