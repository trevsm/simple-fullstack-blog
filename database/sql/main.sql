Use test_db; -- Change this to your MYSQL_DATABASE name

Create Table user (
    id          int(11)          not null auto_increment,
    email       varchar(255)     not null,
    password    varchar(255)     not null,

    Primary Key (id),
    Unique Key (email)
);

Go

Create Table post (
    id          int(11)          not null auto_increment,
    user_id     int(11)          not null,
    title       varchar(255)     not null,
    content     text             not null,

    Primary Key (id),
    Foreign Key (user_id) References user(id)
);

Go