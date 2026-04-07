#!/bin/bash

cd ${0%/*}

cd ../node

PERIOD=05:00
npm run start -- --restart_period $PERIOD --full 1 --screen 1 --playlist ru-play.json

