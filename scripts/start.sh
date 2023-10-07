#!/bin/bash

# TODO LATER: 
# - Add script to auto setup db

docker compose --env-file ../api/.env up --build --detach
sleep 3
./init-db.sh