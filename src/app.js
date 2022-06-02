"use strict";
require(`dotenv`).config();


const scanLibrary = require("./libraryScanner");

const PORT = process.env.PORT;

const PATH_TO_LIBRARY = process.env.LIBRARY_PATH; //"./library"; //WHY

const express = require(`express`);
const app = express();

const db = require(`./db`);
const { connection } = require("./db");

//scan library so we know what to work with
scanLibrary(PATH_TO_LIBRARY);

//routes
//playlist routes?
//playlist item routes?

//json body parser
app.use(express.json());

app.use(`/public`, express.static("./src/public"));
app.use(`/library`, express.static(PATH_TO_LIBRARY));

app.use(`/import`, express.static(`./node_modules`));



app.get(`/`, (req, res)=> {
    //console.log(req);
    //console.log(req.query);
    res.status(200).sendFile(__dirname + `/public/index.html`);
})

//playlist

app.get(`/playlists`, getPlaylists);
//app.get(`/playlists/:id`, getPlaylistById);
app.post(`/playlists`, addPlaylist);
app.delete(`/playlists/:id`, deletePlaylist);

//pl-item

app.get(`/playlist-tracks`, getAllTracks);
app.get(`/playlist-tracks/:playlist_id`, getPlaylistTracksByPlaylistId);
app.post(`/playlist-tracks/:playlist_id`, addTrackToPlaylist);
app.delete(`/playlist-tracks/:playlist_id/:track_id`, deleteTrackFromPlaylist);

////////////////////////////////////////////////////////////

//Lists all the playlists
//id, title, system_rank
async function getPlaylists(req, res) {

    const playlists = await queryDBForPlaylists(res);

    //console.log(playlists);
    //todo : map row to object? 
    //works for now for structure is matching
    res.status(200).json(playlists);

}

// Creates a new playlist
// The only required field is a title property that contains the name of the playlist
// System playlists cannot be created by the client
async function addPlaylist(req, res) {

    const requestedTitle = req.body;
    //console.log(requestedTitle);



    const insertionReport = await queryDBCreatePlaylist(requestedTitle.title, res);
    //console.log(insertionReport);

    const newPlaylist = await queryDBSimple(`playlist`, `id`, insertionReport.insertId, res);
    console.log(newPlaylist);

    res.status(201).json({message: `playlist with id ${newPlaylist[0].id} titled ${newPlaylist[0].title} has been created`});
}

// Deletes the given playlist
// if the id parameter is not present or not a number, return an error in JSON format. You might explain the error briefly.
// If the system_rank field is set to 1, you mustn't delete the playlist
async function deletePlaylist(req, res) {
    const id = req.params.id;
    //console.log(id);

    const condemnedPlaylist = await queryDBSimple(`playlist`, `id`, id, res);
    //console.log(condemnedPlaylist);

    queryDBDeletePlaylist(id, res)
        .then(()=> res.status(200).json({ message: `playlist ${id} has been deleted`}));
}


///////////////////////////////////////////////////////////////

//Without a playlist_id it should return all tracks 
//in the root folder. Subfolders should be explored recursively.
async function getAllTracks(req, res) {

    //searchFolder (return array of songs and/or folders)
        //for each item
        //if folder searchFolder

    const library = await queryDBGetAllTracks(res);

    //console.log(library);

    res.status(200).json(library.map(row=>rowToTrack(row)));

}


//lists all the tracks added to the playlist
//id, title, artist, duration, path
async function getPlaylistTracksByPlaylistId(req, res) {

    const id = req.params.playlist_id;

    const trackList = await queryDBGetTracksByPlaylist(id, res);

    console.log(trackList);

    res.status(200).json(trackList.map(row=>rowToTrack(row)));
    

}


//ists all the tracks added to the playlist
async function addTrackToPlaylist(req, res) {

    console.log(req.body);
    const id = req.params.playlist_id

    //check existence of playlist
    const playlistCheck = await queryDBSimple(`playlist`, `id`, id, res);
    console.log(playlistCheck);

    //check existence of track
    const libraryCheck = await queryDBSimple(`library`, `id`, req.body.id, res);
    console.log(libraryCheck);

    const insertReport = await queryDBAddTrackToPlaylist(req.body.id, id, res);
    console.log(insertReport);

    res.status(200).json({ message: `track ${libraryCheck[0].title} added to ${req.body.playlist_title}`});

}


//Deletes the track with track_id from the playlist with playlist_id
// If one of the id parameters is not present or not a number, 
//return an error in JSON format. You might explain the error briefly.
function deleteTrackFromPlaylist(req, res) {

    res.status(200).json({ message: "track {track} removed from {playlist}"})

}





app.listen(PORT, (error)=> {
    if(error) console.error(error);
    console.log(`listening @ ${PORT}`);
})


/////////////////////////////////////////////////////////////////////////////
// 
/////////////////////////////////////////////////////////////////////////////

function rowToTrack(row) {
    return {
        id: row.id,
        title: row.title,
        artist: row.artist,
        duration: row.duration,
        path: row.song_path
    };
}


async function queryDBSimple(table, field, value, res) {
    
    const selectStatement = `SELECT * FROM ${table} `+ 
                            `WHERE ${field} = ${db.connection.escape(value)}`;
    return db.queryWithErrorResponse(selectStatement, res);
}



//get ALL the playlist from the db
async function queryDBForPlaylists(res) {
    const selectStatement = `SELECT * FROM playlist`;

    return db.queryWithErrorResponse(selectStatement, res);
}

//insert new playlist into the db
async function queryDBCreatePlaylist(title, res) {
    const insertStatement = `INSERT INTO playlist (title) VALUES (${db.connection.escape(title)})`;

    return db.queryWithErrorResponse(insertStatement, res);
}

async function queryDBDeletePlaylist(id, res) {
    const deleteStatement = `DELETE FROM playlist WHERE id = ${db.connection.escape(id)}`
    return db.queryWithErrorResponse(deleteStatement, res);
}

async function queryDBGetAllTracks(res) {
    const selectStatement = `SELECT * FROM library`;
    return db.queryWithErrorResponse(selectStatement, res);
}

async function queryDBGetTracksByPlaylist(id, res) {
    const selectStatement = `SELECT l.id AS id, l.title AS title, artist, duration, song_path `+
	                            `FROM library AS l INNER JOIN playlist_track AS pt ON l.id = pt.track_id `+
                                                  `INNER JOIN playlist AS p ON pt.playlist_id = p.id `+
                                `WHERE p.id = ${db.connection.escape(id)}`;

    return db.queryWithErrorResponse(selectStatement, res);
}

async function queryDBAddTrackToPlaylist(track, playlist, res) {
    const insertStatement = `INSERT INTO playlist_track (playlist_id, track_id, trackOrder) `+
                                    `VALUES (${db.connection.escape(playlist)}, ${db.connection.escape(track)}, ${1})`;

    return db.queryWithErrorResponse(insertStatement, res);
}