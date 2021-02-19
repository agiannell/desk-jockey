insert into users (
    display_name, 
    email, 
    profile_pic
)
values (
    $1, 
    $2, 
    $3
)
returning display_name, email, profile_pic;