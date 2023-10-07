# CTF

## What is this?

A CTF platform I designed specifically for videos. It is intended to be small and simple, and there are most likely much better alternatives out there. I do not recommend using it. Maybe some of you will find vulnerabilities in it lol. Be aware that it is still under development.

## Setup

Under `scripts/` you will find `start.sh`. On execution it runs the docker compose script and create the containers fro the Postgres DB, the API and the web aka next js app. The script does not automatically setup the tables of the database so you'll have to run the contents of the `setup-db.sql` file yourself. In order to create users, you will need to send a POST request to `/v1/auth/signup` of the API along with the `SECRET_KEY` which you set in the `.env` file of the API, the name of the user and its desired password.