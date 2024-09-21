#!/bin/bash
cd ${0%/*}

# clone moWebJam

cd ..

# moLib
# check for destination moLib to ../moLib
destName=moLib
dest=../$destName
if [ ! -e "$dest" ]; then
  git clone https://github.com/molab-itp/$destName.git $dest
fi
if [ ! -e "$dest" ]; then
  echo "fail to clone to $dest"
  exit
fi

cd node/lib
if [ ! -e "lib" ]; then
  ln -s ../../../moLib/src/lib
fi
