function removeSchedule(db, key) {
    db.ref("agenda").child(key).remove();
}
