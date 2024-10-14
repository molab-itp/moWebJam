#!/bin/bash

cd ${0%/*}

cd ../node

# https://poets.org/poem/let-america-be-america-again
# npm run start -- --ddebug --width_trim 0.40 --full
npm run start -- --group s0 --room m0-america --app mo-america-be --full 0 --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"
# npm run start -- --group s1 --full 0 --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"

# my.mo_app
# 'mo-america-be'