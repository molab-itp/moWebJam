#!/bin/bash
cd ${0%/*}
cd ../node

URL="https://molab-itp.github.io/moSalon/src/vote-no-fascism?scroll=1"
SCR="--screen 1"
RS="--restart_period 1:0"
npm run start -- $RS $SCR --root "$URL" --group s0 --room m0-no-facism --app mo-no-facism  --full 0 --portrait 1.0  --preload "."

