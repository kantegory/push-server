# Push-server (WIP)

Simple nodejs push-server, using FCM + PG

## Deployment

Clone the repository:

```bash
$ git clone https://github.com/kantegory/push-server.git
```

Install requirements:

```bash
$ make init
```

Configure server:

```bash
$ cd config
$ cp config.ini.sample config.ini
$ nano config.ini
```

Generate the Service Account Credentials. You should follow the [instruction](https://www.techotopia.com/index.php/Sending_Firebase_Cloud_Messages_from_a_Node.js_Server#Generating_the_Service_Account_Credentials). Then move credentials to `config/push-server.json`.

Create database:

```bash
$ createdb pushdb
```

Make migrations:

```bash
$ make migrate
```

Put your sender id to client scripts. If you don't know how you can get it, follow the [instruction](https://dev.tapjoy.com/faq/how-to-find-sender-id-and-api-key-for-gcm/).

Then configure service-file at `deploy/push-server.service` and move this file to `/etc/systemd/system/`. Well, also you should move `deploy/push-server.conf` to `/etc/nginx/sites-available/` and create a symlink:

```bash
$ ln -s /etc/nginx/sites-available/push-server.conf /etc/nginx/sites-enabled/push-server.conf
```

OK. Restart nginx:

```bash
$ systemctl restart nginx
```

Start push-server:

```bash
$ systemctl start push-server
```

That's all. All of endpoints of push-server available now at http://yourdomain.name/push/.

## REST API Endpoints

Description in progress.
