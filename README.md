# VRSlideshow

## Development

Make sure Docker Desktop is installed then start containers:
```
./vendor/bin/sail up
```

To build css/js:
```
npm run build
```

### Initial dev setup

Open .env and set variables.

Generate app key:
```
./vendor/bin/sail artisan key:generate
```

Migrate DB:
```
./vendor/bin/sail artisan migrate
```

Install packages:
```
npm install
```

## Updating Prod

Get files:
```
git pull origin main
```

Then, lock down permissions:
```
~/scripts/setPermissions.sh vrslideshow
```

### Initial prod setup

Install packages:
```
sudo composer install
sudo npm install
```

Open .env and set variables:
* `APP_NAME` and `ASSET_URL` should be set to `https://vrslideshow.com`
* `DB_HOST=127.0.0.1`
* Set `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` of your choice.

Generate app key:
```
sudo php artisan key:generate
```

Create DB and user:
```
sudo mysql
create database NAME_OF_DATABASE;
create user 'NAME_OF_DATABASE_USER'@'localhost' identified by 'PASSWORD_GOES_HERE';
grant all on NAME_OF_DATABASE.* to 'NAME_OF_DATABASE_USER'@'localhost';
```

Migrate DB:
```
sudo php artisan migrate
```

Install packages:
```
sudo npm install
```

Lock down permissions:
```
~/scripts/setPermissions.sh vrslideshow
```

Create nginx and php-fpm config files (TODO: create templates).
