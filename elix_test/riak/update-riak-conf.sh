docker exec -it <CONTAINER_ID> rm -rf /etc/riak/riak.conf
docker cp ./riak.conf <CONTAINER_ID>:/etc/riak/