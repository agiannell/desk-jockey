insert into room (
    room_name,
    password,
    room_pic,
    is_private,
    is_collaborative,
    genre,
    created_by
)
values (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
)
RETURNING room_id;