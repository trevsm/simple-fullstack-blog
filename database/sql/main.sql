Use test_db; -- Change this to your MYSQL_DATABASE name

Create Table User (
    user_id     int(11)          not null auto_increment,
    email       varchar(255)     not null,
    password    varchar(255)     not null,

    first_name  varchar(255)     not null,
    last_name   varchar(255)     not null,

    email_optin     tinyint(1)   not null default 0,
    email_verified  tinyint(1)   not null default 0,

    t_created   datetime,
    t_updated   datetime,

    Primary Key (user_id),
    Unique Key (email)
);

Go

-- When a user is created, set the t_created and t_updated fields to the current time

Create Trigger user_created
    Before Insert On User
    For Each Row
    Set New.t_created = Now();
    Set New.t_updated = Now();

Go

-- Each time a user is updated, set the t_updated field to the current time

Create Trigger user_updated
    Before Update On User
    For Each Row
    Set New.t_updated = Now();

Go