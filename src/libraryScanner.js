`use strict`

const fs = require(`fs`);
const db = require(`./db`);


//reads content of directory and for each member either adds the entry to the list or recursively calls a subdirectory
function scanFolderForSongs(path) {

    return fs.readdirSync(path).reduce((library, dirItem) => {
        if(fs.statSync(path + '/' + dirItem).isDirectory())
            return library.concat(scanFolderForSongs(path + '/' + dirItem))
        else {
            if(dirItem.slice(-4)===".mp3") {
                return library.concat(path + '/' + dirItem);
            } else {
                return library;
            }
        }
    },[]);
}


function initLibrary(path) {
    const library = scanFolderForSongs(path);

    insertData(library);
}



function insertData(library) {

    //todo: library to list of song objects
    //const truncateStatement = `TRUNCATE TABLE library`; doesn't work bc foreign keys
    const deleteStatement = `DELETE FROM library`; //however this clears out the playlists as well
                                                    //todo: add some sort of reconciliation

    const insertStatement = `INSERT INTO library (title, artist, duration, song_path) VALUES ` +
                                library.map(item => {
                                    return `( ${db.connection.escape(item.match(/[^\/]*$/)[0])}, ${db.connection.escape("various")}, ${120}, ${db.connection.escape(item)} )`
                                }).join(`, `);

    //console.log(insertStatement);
    db.queryPromise(deleteStatement)
        //.then(result => console.log(result))
        .then(() => db.queryPromise(insertStatement))
        //.then(result => console.log(result))
        .catch(error => console.error(error));

        

}



module.exports = initLibrary;