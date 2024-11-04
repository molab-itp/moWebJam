#!/bin/bash

cd ${0%/*}

cd ../node

URL="https://molab-itp.github.io/moSalon/src/vote-no-fascism?scroll=1"

# npm run start -- --full --restart_time 23:59:59 --screen 1 --s 0-color-line-1900
# npm run start -- --ddebug --restart_period 1:00 --screen 1 --root https://www.blackfacts.com
# npm run start -- --ddebug --width_trim 0.40 --full
# npm run start -- --group s0 --full 0 --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"
# --restart_period 6:0:0
SCR="--screen 2"
RS="--restart_period 8:0:0"
npm run start -- $RS $SCR --root "$URL" --group s0 --room m0-no-facism --app mo-no-facism  --full 1 --portrait 1.0  --preload "."

