#!/bin/bash

#Leave if the build come from a Pull request
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]
  then
    echo "The build is for a pull request, master and gh-pages will not be updated"
    exit 0
fi

# Backup the dist directory, will be paste in the master and in the gh-pages
cp -R dist ..

echo "# Content of the backup of dist"
ls -ltra ../dist
# Copy the travis config, the default config file and the documentation
cp .travis.yml ../dist
cp src/hubpress/config.default.json ../dist/hubpress/
cp docs/README* ../dist
cp docs/LICENSE ../dist
cp docs/CHANGELOG.adoc ../dist
cp docs/CONTRIBUTING.adoc ../dist
cp docs/Administration.adoc ../dist
cp docs/Writers_Guide.adoc ../dist

cd ..
echo "# Content of the file dist/hubpress/config.default.json"
cat dist/hubpress/config.default.json

# Update the default configuration with the value of the owner and the repository
sed "s/your-username/$OWNER/g" dist/hubpress/config.default.json > dist/hubpress/config.default.json.replace
mv dist/hubpress/config.default.json.replace dist/hubpress/config.default.json
sed "s/your-repository/$REPOSITORY/g" dist/hubpress/config.default.json > dist/hubpress/config.default.json.replace
mv dist/hubpress/config.default.json.replace dist/hubpress/config.default.json
echo "# Content of the file dist/hubpress/config.default.json after modification"
cat dist/hubpress/config.default.json

# Clone the repository to update branches master and gh-pages
echo "# Clone the repository $GH_REPO_URL"
git clone $GH_REPO_URL repository
cd repository
# Specify the user configuration
git config user.name "Travis CI"
git config user.email "email@local"

#########################################################
# Build master
#########################################################
echo "# Checkout master"
git checkout master

# rm old unecessary files
rm -Rf hubpress/scripts/vendors 2> /dev/null
rm -Rf hubpress/scripts/app.js 2> /dev/null
rm -Rf hubpress/scripts/app.js.map 2> /dev/null
rm -Rf hubpress/styles 2> /dev/null
rm -Rf hubpress/static 2> /dev/null

# Copy files
cp -R ../dist/* .
cp ../dist/.* .
cp ../dist/.travis.yml .

# Set the branch to master in the config file
sed "s/your-branch/master/g" hubpress/config.default.json > hubpress/config.json
echo "# Content of the file hubpress/config.json"
cat hubpress/config.json
rm hubpress/config.default.json

# Show informations about the git status
echo "# git remote -v"
git remote -v
echo "# git status"
git status

# Commit and push
echo "# Commit and push"
git add -u .
git add .
git commit -m "Travis - Build from ${TRAVIS_BRANCH} with the commit ${TRAVIS_COMMIT}"
git push $GH_PUSH_URL master > /dev/null 2>&1


#########################################################
# Build master
#########################################################
echo "# Checkout gh-pages"
git checkout gh-pages
git clean -f

# rm old unecessary files
rm -Rf hubpress/scripts/vendors 2> /dev/null
rm -Rf hubpress/scripts/app.js 2> /dev/null
rm -Rf hubpress/scripts/app.js.map 2> /dev/null
rm -Rf hubpress/styles 2> /dev/null
rm -Rf hubpress/static 2> /dev/null

# Copy files
cp -R ../dist/* .
cp ../dist/.* .
cp ../dist/.travis.yml .

# Set the branch to gh-pages in the config file
sed "s/your-branch/gh-pages/g" hubpress/config.default.json > hubpress/config.json
echo "# Content of the file hubpress/config.json"
cat hubpress/config.json
rm hubpress/config.default.json


# Show informations about the git status
echo "# git status"
git status

# Commit and push
echo "# Commit and push"
git add -u .
git add .
git commit -m "Travis - Build from ${TRAVIS_BRANCH} with the commit ${TRAVIS_COMMIT}"
git push $GH_PUSH_URL gh-pages > /dev/null 2>&1
