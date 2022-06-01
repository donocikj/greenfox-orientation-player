"use strict";

require(`dotenv`).config();
const PORT = process.env.PORT;

const PATH_TO_LIBRARY = "./library"; //WHY

const express = require(`express`);
const app = express();

//routes
//playlist routes?
//playlist item routes?

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
function getPlaylists(req, res) {
    res.status(200).json(
        [
            {id: 1, title: "Favourites", system_rank:1},
            {id: 2, title: "other list", system_rank:0},
            {id: 3, title: "yet another", system_rank:0},
        ]
    );
}

// Creates a new playlist
// The only required field is a title property that contains the name of the playlist
// System playlists cannot be created by the client
function addPlaylist(req, res) {
    res.status(200).json({message: `playlist {id} has been created`});
}

// Deletes the given playlist
// if the id parameter is not present or not a number, return an error in JSON format. You might explain the error briefly.
// If the system_rank field is set to 1, you mustn't delete the playlist
function deletePlaylist(req, res) {
    res.status(200).json({message: `playlist {id} has been deleted`});
}


///////////////////////////////////////////////////////////////

//Without a playlist_id it should return all tracks 
//in the root folder. Subfolders should be explored recursively.
function getAllTracks(req, res) {

    //searchFolder (return array of songs and/or folders)
        //for each item
        //if folder searchFolder

    res.status(200).json(
    [
        {
            id: 21,
            title: "Never Give Up",
            artist: "Ars Sonor",
            duration: 135,
            path: "/library/Ars_Sonor_-_02_-_Never_Give_Up.mp3"
        },
        {
            id: 412,
            title: "Purple Drift",
            artist: "Organoid",
            duration: 208,
            path: "/library/Organoid_-_09_-_Purple_Drift.mp3"
        }
    ]);

}


//lists all the tracks added to the playlist
//id, title, artist, duration, path
function getPlaylistTracksByPlaylistId(req, res) {

    res.status(200).json( [{
        id: 21,
        title: "Never Give Up",
        artist: "Ars Sonor",
        duration: 135,
        path: "/library/Ars_Sonor_-_02_-_Never_Give_Up.mp3"
    }]);



}


//ists all the tracks added to the playlist
function addTrackToPlaylist(req, res) {

    res.status(200).json({ message: "track added to {playlist}"});

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
