insert into room (
    room_name,
    password,
    is_private,
    is_collaborative,
    genre,
    description,
    created_by
)
values (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
)