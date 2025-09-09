#!/bin/bash

cd ${0%/*}

cd ../node

URL="https://molab-itp.github.io/moSalon/src/vote-no-fascism/?v=56&scroll=1"

# https://poets.org/poem/let-america-be-america-again
# npm run start -- --ddebug --width_trim 0.40 --full
# npm run start -- --group s0 --full 0 --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"

PERIOD=12:00:0
# PERIOD=2:30:0
# PERIOD=1:0
npm run start -- --restart_period $PERIOD --full 1 --portrait 0.90 --screen 1 --root "$URL"

