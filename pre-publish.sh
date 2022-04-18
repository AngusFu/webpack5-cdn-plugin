set -e

DIR=webpack-cdn-plugin-5

rm -rf $DIR && mkdir -p $DIR
npm run build
cp -R dist $DIR/
cp .npmrc $DIR/
cp README.md $DIR/

cd $DIR
sed -i "" "s/webpack5-cdn-plugin/webpack-cdn-plugin-5/" README.md
cat ../package.json | jq '.name="webpack-cdn-plugin-5" | del(.scripts.prepublish)' >package.json
npm publish
cd ..
rm -rf $DIR
