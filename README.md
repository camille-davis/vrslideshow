## VR Slideshow

Make sure Docker Desktop is installed then start containers:
```
./vendor/bin/sail up
```

Migrate database if starting for the first time:
```
./vendor/bin/sail artisan migrate
```

### Enable Xdebug

Add to .env (change ```idekey``` as needed):
```
SAIL_XDEBUG_MODE=develop,debug,coverage
SAIL_XDEBUG_CONFIG="client_host=host.docker.internal start_with_request=yes discover_client_host=true"
```

#### VSCode

In .env append ```idekey="VSCODE"``` to ```SAIL_XDEBUG_CONFIG```.

Create .vscode/launch.json and add:
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
          "/var/www/html": "${workspaceFolder}"
      },
      "hostname": "0.0.0.0"
    }
  ]
}
```
