#/usr/bin/sh

set -a; source ../.env; set +a

npx sequelize-auto -l ts -h localhost -d $MYSQL_DATABASE -u $MYSQL_USER -x $MYSQL_PASSWORD -p $MYSQL_PORT --dialect mysql -o ./models