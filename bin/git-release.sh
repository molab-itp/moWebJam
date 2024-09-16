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


# Increatement build number
NUMFILE="gen/build_ver.txt"
if [[ -f "$NUMFILE" ]]; then
  current_value=$(<"$NUMFILE")
else
  current_value=0
fi
new_value=$((current_value + 1))
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

