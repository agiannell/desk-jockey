SELECT r.room_id, r.room_name, r.room_pic, r.is_private, u.display_name, r.created_by FROM room r
JOIN room_junction rj ON rj.room_id = r.room_id
JOIN users u ON u.user_id = rj.user_id
WHERE rj.user_id = $1;