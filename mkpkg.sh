#! /usr/bin/bash

cd packages

echo "What do you want to call the new package?"
read packageName
echo "What should the description of the package be?"
read description

mkdir "$packageName"
cd "$packageName"

# set up source
mkdir src && echo '// Entry point of the project' > src/index.ts
mkdir src/typings

# set up tests
mkdir tests && echo '// Main tests here' > tests/index.ts

# ignore files
echo $'node_modules/\n.DS_Store\ndist/' > .gitignore
echo $'tests/\nsrc/\ndocs/\n.gitignore\ntsconfig.json' > .npmignore

# npm files
echo "{
    \"name\": \"@infinite-fansub/$packageName\",
    \"version\": \"1.0.0\",
    \"description\": \"$description\",
    \"author\": \"Infinite\",
    \"license\": \"AGPL-3.0\",
    \"main\": \"dist/index.js\",
    \"types\": \"dist\",
    \"scripts\": {
        \"test\": \"ts-node tests/index.ts\",
        \"lint\": \"eslint src/**/*.ts\",
        \"lint:fix\": \"eslint src/**/*.ts --fix\",
        \"docs\": \"rm -rf docs && typedoc && typedoc --plugin typedoc-plugin-coverage --plugin typedoc-plugin-markdown\",
        \"build\": \"rm -rf dist && tsc\",
        \"build:watch\": \"rm -rf dist && tsc --watch\",
        \"build:test\": \"tsc --noEmit\",
        \"node\": \"node .\",
        \"tsn\": \"ts-node src/index.ts\"
    },
    \"repository\": {
        \"type\": \"git\",
        \"url\": \"https://github.com/Infinite-Fansub/infinite.git\"
    },
    \"homepage\": \"https://github.com/Infinite-Fansub/infinite/tree/main/packages/$packageName\"
}" > package.json

# typescript shenanigans
echo '{
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "rootDir": "src",
        "outDir": "dist",
        "baseUrl": "."
    },
    "typedocOptions": {
        "entryPoints": [
            "./src/index.ts"
        ],
        "entryPointStrategy": "expand",
        "plugin": [
            "typedoc-theme-hierarchy",
            "typedoc-plugin-coverage"
        ],
        "theme": "hierarchy"
    },
    "include": [
        "src/**/*"
    ]
}' > tsconfig.json

npm i tslib

cd ../..

npm i