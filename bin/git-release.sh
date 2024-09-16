#!/bin/bash
cd ${0%/*}

# Produce a release build to main branch

cd ..
quiet=--quiet

# deploy to github pages
#
# merge branch next in to branch main
# switch back to branch next
#

# ./p5moLibrary/bin/build.sh --src ./ --files src,README.md --prod $quiet


# File where the value is stored
NUMFILE="gen/build_ver.txt"
if [[ -f "$NUMFILE" ]]; then
  current_value=$(<"$NUMFILE")
else
  echo "NUMFILE does not exist. Initializing value to 0."
  current_value=0
fi
# Increment the value
new_value=$((current_value + 1))
# Write the new value back to the NUMFILE
echo "$new_value" > "$NUMFILE"

git add . 
git commit $quiet -m "`cat $NUMFILE`"
git push $quiet

# in main
git checkout main $quiet
git merge next $quiet -m "`cat $NUMFILE`"
git push $quiet

# in next
git checkout next $quiet

echo
echo "build `cat gen/build_ver.txt`"

