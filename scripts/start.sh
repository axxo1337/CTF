#!/bin/bash

# TODO LATER: 
# - Add script to auto setup db

docker compose --env-file ../api/.env up --detach
sleep 3
./init-db.sh