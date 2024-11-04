#!/bin/bash
cd ${0%/*}
cd ../node

URL="https://molab-itp.github.io/moSalon/src/vote-no-fascism?scroll=1"
SCR="--screen 2"
RS="--restart_period 8:0:0"
npm run start -- $RS $SCR --root "$URL" --group s1 --room m1-no-facism --app mo-no-facism  --full 1 --portrait 1.0  --preload "."

