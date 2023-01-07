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

-- Verification code: 6 digit code that is sent to the user's email address
-- A user can have multiple verification codes. Each expire within 30 minutes

Create Table VerificationCode (
    code_id     int(11)          not null auto_increment,
    user_id     int(11)          not null,
    code_value  int(6)           not null,

    t_created   datetime,

    Primary Key (code_id),
    Foreign Key (user_id) References User(user_id)
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

-- When a verification code is created, set the t_created field to the current time

Create Trigger verification_code_created
    Before Insert On VerificationCode
    For Each Row
    Set New.t_created = Now();

Go
