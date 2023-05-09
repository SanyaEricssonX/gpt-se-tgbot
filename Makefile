build:
	docker build -t gpt-se-tgbot .

build-dev:
	docker build -t gpt-se-tgbot-dev .

run:
	docker run -d -p 3000:3000 -v logs:/app/data/logs -e NODE_ENV=production --rm --name gpt-se-tgbot gpt-se-tgbot

run-dev:
	docker run -d -p 3000:3000 -v logs:/app/data/logs -e NODE_ENV=development --rm --name gpt-se-tgbot-dev gpt-se-tgbot-dev

stop:
	docker stop gpt-se-tgbot
	docker rmi gpt-se-tgbot

stop-dev:
	docker stop gpt-se-tgbot-dev
	docker rmi gpt-se-tgbot-dev
