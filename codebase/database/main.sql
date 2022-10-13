Use test_db;

Create Table user (
    user_id     int(11)          not null auto_increment,
    email       varchar(255)     not null,
    password    varchar(255)     not null,

    Primary Key (user_id),
    Unique Key (email)
);

Go

Create Table post (
    id          int(11)          not null auto_increment,
    user_id     int(11)          not null,
    title       varchar(255)     not null,
    content     text             not null,

    Primary Key (id),
    Foreign Key (user_id) References user(user_id)
);

Go