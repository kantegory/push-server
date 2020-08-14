run:
	npm start

send:
	curl -X POST -H "Content-type: application/json" -d @./testPush.json http://localhost:8080/send
migrate:
	npm run migrate
