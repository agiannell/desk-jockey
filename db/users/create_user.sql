insert into users (
    display_name, 
    email, 
    profile_pic,
    playlist_uri
)
values (
    $1, 
    $2, 
    $3,
    $4
)
returning *;