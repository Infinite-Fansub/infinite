use std::path::Path;

#[allow(dead_code)]
pub fn npm_content(pkg_name: String, description: String) -> String {
    return String::from(format!("{{
        \"name\": \"@infinite-fansub/{}\",
        \"version\": \"1.0.0\",
        \"description\": \"{}\",
        \"author\": \"Infinite\",
        \"license\": \"AGPL-3.0\",
        \"main\": \"dist/index.js\",
        \"types\": \"dist\",
        \"scripts\": {{
            \"test\": \"ts-node tests/index.ts\",
            \"eslint\": \"eslint\",
            \"eslint:fix\": \"eslint --fix\",
            \"buildrm -rf dist && tsc\",
            \"build:watch\": \"rm -rf dist && tsc --watch\",
            \"build:test\": \"tsc --noEmit\",
            \"node\": \"node .\",
            \"tsn\": \"ts-node src/index.ts\"
        }},
        \"repository\": {{
            \"type\": \"git\",
            \"url\": \"https://github.com/Infinite-Fansub/infinite.git\"
        }},
        \"homepage\": \"https://github.com/Infinite-Fansub/infinite/tree/main/packages/$packageName\"
    }}", pkg_name, description))
}

#[allow(dead_code)]
pub fn create_project(path: &Path) {
    std::fs::create_dir_all(&path.join("src/typings")).unwrap(); 
    std::fs::create_dir(&path.join("tests")).unwrap();
}

#[allow(dead_code)]
pub fn create_file(path: &Path, path_string: &str, content: String) {
    std::fs::write(&path.join(&path_string), content).unwrap();
}