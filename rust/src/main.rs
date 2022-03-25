// import standard modules needed
use std::path::Path;

// import the file contents from the constants.rs file
mod functions;

// import the custom macros to reduce redundancy
mod macros;

// import the file contents
mod constants;

fn main() {
    println!("What do you want to call the new package?");

    // Create empty String
    let mut package_name = String::new();

    // Append the user return to the new String
    read_terminal_line!(package_name);

    // Remove the new line created at the end
    package_name = package_name.replace("\n", "");

    // Put the path to the package together
    let path = format!("packages/{}", package_name).to_string();
    let path = Path::new(&path);

    // Check if there exists a package with this name already
    if path.exists() {
        panic!("\"{}\" Already exists", package_name);
    }

    println!("What should the description of the package be?");

    // Create empty String
    let mut package_description = String::new();

    // Append the user return to the new String
    read_terminal_line!(package_description);

    // Remove the new line created at the end
    package_description = package_description.replace("\n", "");

    // Create the project structure
    functions::create_project(path);

    // Get the values for the package.json file
    let content = functions::npm_content(package_name, package_description);

    // Create the package.json file
    create!(path, "package.json", content);

    // Create the project entry point
    create!(path, "src/index.ts", constants::SRC_INDEX_CONTENT);

    // Create tests entry point
    create!(path, "tests/index.ts", constants::TESTS_INDEX_CONTENT);

    // Create dot files
    create!(path, ".gitignore", constants::GITIGNORE);
    create!(path, ".npmignore", constants::NPMIGNORE);
}