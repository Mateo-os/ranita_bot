# ranita bot

## How to Run

First you need to install dependencies by doing

```npm install```

Then you must set up you mysql database and create a file called .env with the following data:
```
DBPASSWORD= Yor database password
DBNAME= Your databse name
DBUSER= Your database user
PORT= Database port
TOKEN= Discord bot token
``` 

If everything is set up correctly, you should run the migrations, by doing:

```npx sequelize-cli db:migrate```

## How to make new migrations

After a changes to the models is done, by either creating a new model or altering existing ones. You must run 

```npx sequelize-mig migration:make --name <migration_name>```

This will create a new migration called timestamp_migration_name.js 