pub const SRC_INDEX_CONTENT: &str = "export class Main {
    public test(log: string): string {
        return log;
    }
}

new Main().test(\"Hello World!\");";

pub const TESTS_INDEX_CONTENT: &str = "import { Main } from \"../src\";
import assert from \"node:assert\";

assert.deepStrictEqual(new Main().test(\"Hello World!\"), \"Hello World!\");";

pub const GITIGNORE: &str = "node_modules/
.DS_Store
dist/";

pub const NPMIGNORE: &str = "tests/
src/
.gitignore
tsconfig.json";