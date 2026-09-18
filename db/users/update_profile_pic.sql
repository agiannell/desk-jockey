update users
set profile_pic = $2
where user_id = $1
returning *;
