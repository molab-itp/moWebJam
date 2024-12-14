#!/bin/bash

cd ${0%/*}

cd ../node

URL="https://www.youtube.com/live/zJxFKxA5lT0?si=OmL3Q6I0hE-Z59B9&t=758"

# https://poets.org/poem/let-america-be-america-again
# npm run start -- --ddebug --width_trim 0.40 --full
# npm run start -- --group s0 --full 0 --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"
npm run start -- --restart_period 2:30:0 --full 0 --portrait 0.90 --screen 1 --root "$URL" --preload "."

