#[path = "./functions.rs"]
mod functions;

#[macro_export]
macro_rules! read_terminal_line {
    ($txt: ident) => {
        std::io::stdin().read_line(&mut $txt).expect("Failed reading the terminal")
    };
}

#[macro_export]
macro_rules! create {
    ($path: ident, $path_string: tt, $content: path) => {
        functions::create_file($path, $path_string, $content.to_string())
    };
}