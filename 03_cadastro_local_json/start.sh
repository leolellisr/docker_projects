docker network create ea202
./node.sh
docker exec -it node.js npm install
docker exec -it node.js npm start

