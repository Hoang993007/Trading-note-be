deploy-dev:
	rsync -avhzL --delete \
		--no-perms --no-owner --no-group \
		--exclude .git \
		--filter=":- .gitignore" \
		. sotatek@172.16.198.33:/home/sotatek/workspace/sui-dnfts
	ssh -t sotatek@172.16.198.33 "cd /home/sotatek/workspace/sui-dnfts ; bash --login"
deploy-stg:
	rsync -avhzL --delete \
		--no-perms --no-owner --no-group \
		--exclude .git \
		--filter=":- .gitignore" \
		. sotatek@172.16.198.33:/home/sotatek/workspace/stg/sui-dnfts
	ssh -t sotatek@172.16.198.33 "cd /home/sotatek/workspace/stg/sui-dnfts ; bash --login"

build-dev:
	make install
	make restart t=dev

build-prod:
	make install
	make restart t=prod

install:
	npm install
	npm run build

restart:
	pm2 restart app.$(t).json
