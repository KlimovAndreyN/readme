# Как работать над проектом
```bash
# перейти в папку с проектом
cd ~/readme/project

# установить зависимости
npm install

# Скопировать .env-example -> .env:
cp apps/account/.env-example apps/account/.env
cp apps/api/.env-example apps/api/.env
cp apps/blog/.env-example apps/blog/.env
cp apps/file-storage/.env-example apps/file-storage/.env
cp apps/notify/.env-example apps/notify/.env

# добавить docker-compose
docker compose --file ./apps/account/docker-compose.dev.yml --project-name "readme-account" --env-file ./apps/account/.env up -d
docker compose --file ./apps/blog/docker-compose.dev.yml --project-name "readme-blog" --env-file ./apps/blog/.env up -d
docker compose --file ./apps/file-storage/docker-compose.dev.yml --project-name "file-storage" --env-file ./apps/file-storage/.env up -d
docker compose --file ./apps/notify/docker-compose.dev.yml --project-name "notify" --env-file ./apps/notify/.env up -d

# сформировать PrismaClient
npx nx run blog:db:generate

# инициализировать БД postgres - blog
npx nx run blog:db:migrate

# наполнение тестовыми данными
npx nx run account:db:seed
npx nx run blog:db:seed

# запуск сервисов
npx nx run account:serve
npx nx run blog:serve
npx nx run file-storage:serve
npx nx run notify:serve
npx nx run api:serve

#запуск рассылки - уведомление о новых публикациях
curl http://localhost:4100/api/run-news-letter
```
