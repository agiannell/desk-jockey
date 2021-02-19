drop TABLE users if exists
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE room(
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(55),
    password VARCHAR(255) NOT NULL,
    is_private boolean NOT NULL DEFAULT false,
    is_collabarative boolean NOT NULL DEFAULT false,
    genre varchar(55),
    description VARCHAR(255),
    created_by int references users(user_id) on delete cascade
);

create table room_junction (
    junction_id SERIAL PRIMARY KEY,
    room_id int references room(room_id) on delete cascade,
    user_id int references users(user_id) on delete cascade
);


