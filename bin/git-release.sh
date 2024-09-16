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

./p5moLibrary/bin/build.sh --src ./ --files src,README.md --prod $quiet

git add . 
git commit $quiet -m "`cat gen/build_ver.txt`"
git push $quiet

# in main
git checkout main $quiet
git merge next $quiet -m "`cat gen/build_ver.txt`"
git push $quiet

# in next
git checkout next $quiet

echo
echo "build `cat gen/build_ver.txt`"

