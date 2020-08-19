run:
	npm start

init:
	npm i	

send:
	curl -X POST -H "Content-type: application/json" -d @./testPush.json http://localhost:8080/send

topic:
	curl -X POST -H "Content-type: application/json" -d @./testPushToTopic.json http://localhost:8080/send

topprod:
	curl --insecure -X POST -H "Content-type: application/json" -d @./testPushToTopicProd.json https://push.kubteh.ru/send

migrate:
	npm run migrate
