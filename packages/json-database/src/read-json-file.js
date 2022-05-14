// @ts-check
const fsPromise = require('node:fs/promises');
const fs = require('node:fs');

/*
 * IDEA
 * 
 * Check if a specific directory exists or not
 * if it doesnt exist create it
 * if it exists see if there are any files inside
 * if there are files save them to a map with the file names as the key (without the .db.json)
 */
/**
 * @typedef {Object} DatabaseData
 * @property {string} fileName
 * @property {Buffer} fileContent
 */

/**
 * @param {string} dir The directory to read
 * @returns {Promise<Array<DatabaseData> | void>}
 */
async function initJsonDatabaseDir(dir) {
    try {
        await fsPromise.access(dir, fs.constants.F_OK); // checks whether the file exists
        await fsPromise.access(dir, fs.constants.R_OK | fs.constants.W_OK) // checks whether the file can be read and written
            .catch(_ => { throw new Error("JSON database folder exists but can't be read or written"); });

        const stats = await fsPromise.stat(dir);
        if (!stats.isDirectory()) throw new Error("The path to the JSON database is not a directory!");

        const children = await fsPromise.readdir(dir, { withFileTypes: true });
        return await Promise.all(
            children.filter((dirent) => !dirent.isDirectory() && dirent.name.endsWith(".db.json"))
                .map(async (dirent) => ({
                    fileName: dirent.name,
                    fileContent: await fsPromise.readFile(`${dir}/${dirent.name}`),
                }))
        );
    } catch (_) {
        await fsPromise.mkdir(dir).catch(e => { throw new Error(`An error occurred while creating the JSON database directory!\n${e}`); });
    }
}

// module.exports = readJsonFile;