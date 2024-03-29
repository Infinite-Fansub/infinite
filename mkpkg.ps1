#! /usr/bin/pwsh

$root = Get-Location

# we need to be where we hold all of the packages
Set-Location .\packages

# get package info
$packageName = Read-Host -Prompt "What do you want to call the new package?"
Write-Output $packageName
$description = Read-Host -Prompt "What should the description of the package be?"

# create and enter
New-Item -Path ".\$packageName" -ItemType Directory
Set-Location ('.\' + $packageName)

# set up source
New-Item -Path '.\src' -ItemType Directory
New-Item -Path '.\src\index.ts' -ItemType File -Value "// Entry point of the project`n"
New-Item -Path '.\src\typings' -ItemType Directory

# set up tests
New-Item -Path '.\tests' -ItemType Directory
New-Item -Path '.\tests\index.ts' -ItemType File -Value "// Main tests here`n"

# ignore files
New-Item -Path '.\.gitignore' -ItemType File -Value "node_modules/`n.DS_Store`ndist/`n"
New-Item -Path '.\.npmignore' -ItemType File -Value "tests/`nsrc/`ndocs/`n.gitignore`ntsconfig.json`n"

# npm files
New-Item -Path '.\package.json' -ItemType File -Value "{
    `"name`": `"@infinite-fansub/$packageName`",
    `"version`": `"1.0.0`",
    `"description`": `"$description`",
    `"author`": `"Infinite`",
    `"license`": `"AGPL-3.0`",
    `"main`": `"dist/index.js`",
    `"types`": `"dist`",
    `"scripts`": {
        `"test`": `"ts-node tests/index.ts`",
        `"lint`": `"eslint src/**/*.ts`",
        `"lint:fix`": `"eslint src/**/*.ts --fix`",
        `"docs`": `"rm -rf docs && typedoc && typedoc --plugin typedoc-plugin-coverage --plugin typedoc-plugin-markdown`",
        `"build`": `"rm -rf dist && tsc`",
        `"build:watch`": `"rm -rf dist && tsc --watch`",
        `"build:test`": `"tsc --noEmit`",
        `"node`": `"node .`",
        `"tsn`": `"ts-node src/index.ts`"
    },
    `"repository`": {
        `"type`": `"git`",
        `"url`": `"https://github.com/Infinite-Fansub/infinite.git`"
    },
    `"homepage`": `"https://github.com/Infinite-Fansub/infinite/tree/main/packages/$packageName`"
}"

# typescript shenanigans
New-Item -Path '.\tsconfig.json' -ItemType File -Value '{
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
}'

npm.cmd i tslib

# go back home
Set-Location $root

npm.cmd i