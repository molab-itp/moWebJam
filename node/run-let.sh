#!/bin/bash

cd ${0%/*}

cd ../node

# https://poets.org/poem/let-america-be-america-again
# npm run start -- --ddebug --width_trim 0.40 --full
npm run start -- --group s1 --full 1 --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"
