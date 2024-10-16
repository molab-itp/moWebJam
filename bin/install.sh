#!/bin/bash
# start in outer directory
cd ${0%/*}
cd ..

# clone moWebJam

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

libTarget=node/lib/moLib
if [ ! -e "$libTarget" ]; then
  cp -r $dest/src/lib $libTarget
fi
