echo "update data and bump version from $1 to $2"

git checkout staging
git pull origin staging

cd data

python generate_data.py --fetch

git add case-counts/*tsv
git commit -m "update case count tsv files"
echo "updated and committed tsv files"

python generate_data.py --output-cases ../src/assets/data/caseCounts.json
cd ..
git add src/assets/data/caseCounts.json
git commit -m "update case count json"
echo "updated and committed json file"

sed -i "s/$1/$2/" package.json

git add package.json
git commit -m "version bump to $2"
echo "bumped version to $2"

git tag $2

git push origin staging
git push origin $2

echo "tagged and pushed to staging"
