build:
	docker build -t gpt-se-tgbot .

run:
	docker run -d -p 3000:3000 --name gpt-se-tgbot --rm gpt-se-tgbot
