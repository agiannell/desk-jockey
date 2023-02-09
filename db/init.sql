DROP TABLE IF EXISTS room_junction, users, room;

CREATE TABLE users (
    user_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    display_name text NOT NULL,
    email text NOT NULL,
    profile_pic text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    playlist_uri text,
    UNIQUE (email)
);

CREATE TABLE room(
    room_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    room_name text NOT NULL,
    room_pic text,
    password text,
    is_private boolean DEFAULT false NOT NULL,
    is_collaborative boolean DEFAULT false NOT NULL,
    genre text,
    description text,
    created_by uuid REFERENCES users(user_id) on delete cascade
);

ALTER TABLE room_junction add constraint room_junction_uq unique (room_id,user_id);

CREATE TABLE room_junction (
    junction_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id uuid REFERENCES room(room_id) on delete cascade,
    user_id uuid REFERENCES users(user_id) on delete cascade
);

CREATE TABLE chat (
    chat_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content text,
    room_id uuid REFERENCES room(room_id) on delete cascade
);