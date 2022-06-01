"use strict";

console.log(`script loaded`);

//const definitions


const searchBar = document.querySelector('#searchBar');
const volSlider = document.querySelector('#volumeBar');

//media element
const mediaElement = document.querySelector(`audio`);
//console.log(mediaElement);
console.log(mediaElement.volume);

//song library
const library = {};

//favourites
const favourites = [];

//playlists
const playlists = [];
let currentPlaylist = [];

const selectedElements = {playlist: null, track: null};

// one at a time...
let updatePending = false;

let muted = false;


////////////////////////////////////////////////////////////////////////////
//event registration ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// 

//on pageload 
        document.addEventListener(`DOMContentLoaded`, initializeAllTheThings)
        console.log(`listening to the DOMContentLoaded...`);
   

        // play button
        document.querySelector(`#playPause`).addEventListener(`click`, playbackToggle)
        console.log(`Listening at the play/pause button...`)

        // rewind
        document.querySelector(`#previous`).addEventListener(`click`, playbackRewind)
        console.log(`Listening at the rewind button...`);
            

        // next
        document.querySelector(`#next`).addEventListener(`click`, playbackNext)
        console.log(`Listening at the next/ffw button...`);
            

        // searchbar
        searchBar.addEventListener(`input`, seekInTrack);
        console.log(`Listening to searchbar's 'input'...`);

        //progress
        mediaElement.addEventListener(`progress`, updateProgress);
        console.log(`Listening to media 'progress'...`);

        mediaElement.addEventListener(`timeupdate`, updateTime);
        console.log(`Listening to media 'timeupdate'...`);

        //add playlist
        document.querySelector(`#createPlaylist`).addEventListener(`click`, createPlaylist);
        console.log(`Listening at the create playlist button...`);
        
        //add to playlist
        document.querySelector(`#addToPlaylist`).addEventListener(`click`, addToPlaylist);
        console.log(`Listening at the add to playlist button...`);
        
        //favourite
        document.querySelector(`#makeFavourite`).addEventListener(`click`, toggleFavourite);
        console.log(`Listening at the favourite toggle...`);

        //mute
        document.querySelector(`#mute`).addEventListener(`click`, muteToggle);
        console.log(`Listening at the mute toggle button...`);

        //volume
        document.querySelector(`#volumeBar`).addEventListener(`input`, setVolume);
        console.log(`Listening for input at the volume slider...`);



    //selecting a playlist (clicking the playlist pane)
    document.querySelector(`#playlists`).addEventListener(`click`, playlistClicked)
    console.log(`listening to clicks on the playlist pane...`);
    
    
    //selecting a song (clicking the track pane)
    document.querySelector(`#currentPlaylist`).addEventListener(`click`, trackClicked)
    console.log(`listening to clicks on the track pane...`);


//////////////////////////////////////////////////////////////////////
// event handlers ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

async function initializeAllTheThings(e) {

    //GET library information
    getLibraryData()
        .then(()=> getPlaylists()) 
        .then(()=> setPlaylist(0))  //alternative - local storage playlist id?
        //select first song
        .then(() => selectSong(21))// placeholder - remove, replace
        .catch(error=> console.error(error));

}

//play/pause switch and update the icon
function playbackToggle() {

    if(mediaElement.paused || mediaElement.ended) {
        mediaElement.play();
    } else {
        mediaElement.pause();
    }

    PlayPauseIconSwitch();
}


//if media is past 0
//return to start
//else select previous title in playlist
function playbackRewind() {
    if(mediaElement.currentTime !== 0) {
        mediaElement.currentTime = 0;
        searchBar.value = 0;
    } else {
        //retrieve position of song in playlist
        //get id of the next one
        //select it
    }
}

//select next title in playlist
function playbackNext() {
    //retrieve position of song in playlist
    //get id of the next one
    //select it
}


//seeker bar has been manipulated
function seekInTrack(e) {
    mediaElement.currentTime = e.target.value;
}


//respond to changes in progress (downloading the file)
async function updateProgress(e) {
    // searchBar.rangeSlider.update({
    //     buffer : 70
    // }, triggerEvents);
}


//respond to playback moving the time along
async function updateTime(e) {

    updatePending = await attemptUpdate();
    
}

//ask for name and then request creation of new playlist at the back end
function createPlaylist(e) {

    console.log(`requesting creation of new playlist, expected id: ${playlists.length} .... NOT YET IMPLEMENTED`)
    //grab up to date information on playlists?

    // //instantiate empty
    // let newListData = {
    //     title: promptInput()
    // }

    // requestPlaylistCreation(newListData);

}

//add song
//ask to which playlist
function addToPlaylist(e) {
    console.log(`adding song ${library[mediaElement.getAttribute(`data-id`)].title} to playlist... wait, which one?`);

    //refesh playlist and library data?
    
    //ask for selection of playlist

    // requestPlaylistUpdate(data)

}


//favourite / unfavourite song
//add / remove favourite flag
//update favourites playlist
function toggleFavourite(e) {
    console.log(`toggling favourite status of the song ${library[mediaElement.getAttribute(`data-id`)].title}}`);

    //there's probably going to be a dedicated endpoint for this

}

//mute
function muteToggle(e) {
    if(muted) {
        mediaElement.muted = false;
        muted = false;
    } else {
        mediaElement.muted = true;
        muted = true;
    }
}

//volume set
function setVolume(e) {
    mediaElement.volume = e.target.value;
}


function playlistClicked(e) {
    console.log(e);
    //console.log(e.target.closest(`li`).getAttribute(`data-id`));
    //console.log(e.target.parent(`div`));
    const listItem = e.target.closest(`li`);
    if (listItem === null) return;

    const id = listItem.getAttribute(`data-id`);

    //delete playlist?
    if (e.target.classList.contains(`deletePlaylist`)) {
        console.log(`playlist ${id} selected for deletion`);
        //call the delete endpoint
    } else {
        console.log(`selected playlist ${id}: ${playlists[id].title}`);
        //select playlist for display in track pane
        getLibraryData();
        //refresh library?
        //call the get playlist by id endpoint
        //assemble list from library
        //display list in track pane
        setPlaylist(id);
        //select first song?
    }
}

function trackClicked(e) {
    //console.log(e)
    const listItem = e.target.closest(`li`);
    if (listItem === null) return;
    const id = listItem.getAttribute(`data-id`);

    console.log(`track "${library[id].title}" selected`);
    selectSong(id);
    console.log(`track "${library[id].title}" loaded into the media element`);


}



///////////////////////////////////////////////////////////////////////
//helper functions ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

//retrieves all the tracks from the library and refreshes player's map accordingly.
async function getLibraryData() {

    return fetch(`/playlist-tracks`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            playlists[0] = {
                id: 0,
                title: `All Tracks`,
                system_rank: 1
            };
            //playlists.push(data);
            mapClear(library);
            data.forEach(song => {
                library[song.id]=song;
            })
        });

}

//sets selected playlist as active and populates the track pane with its members
function setPlaylist(playlist_id) {
    //console.log(`currently selected: `);
    //console.log(mediaElement);
    
    console.log(`selecting playlist ${playlist_id}`);

    //highlight the selected playlist
    if(playlist_id === "0") { //the parameter comes in as a string
        getLibraryData()
            .then(()=> populateTracklist(Object.values(library))); // "All Tracks, i.e. library, is a special case..."
    } else {
        getPlaylistById(playlist_id);
    }

    //no need to affect playback yet...
}

//request list of playlists and populates the playlist pane with its members
async function getPlaylists() {
    console.log(`requesting list of playlists from server...`)
    
    fetch(`/playlists`, {
        method: `GET`
    })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            data.forEach(playlist => playlists.push(playlist));
        // })
        // .then(() => {
            //console.log(playlists); 
            populatePlaylists();
        })
        .catch(error => console.error(error))
        .finally(console.log(playlists));
}

//retrieves a playlist by given id from the server
async function getPlaylistById(id) {
    //fetch

    fetch(`/playlist-tracks/${id}`, {
        method: `GET`
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            currentPlaylist = [];
            data.forEach(track => currentPlaylist.push(track));
            populateTracklist(currentPlaylist);
        })
        .catch(error => console.error(error))
        .finally(console.log(currentPlaylist));
}
 

function populatePlaylists() {
    populateList(
        document.querySelector(`#playlists ul`),
        `{{#playlists}} ${document.querySelector(`#playlistTemplate`).innerHTML} {{/playlists}}`,
        { playlists: playlists.map((playlist) => {
            return {
                id: playlist.id,
                title: playlist.title,
                deletable: (playlist.system_rank === 1)? false : true
            }})
        }
    );
}

function populateTracklist(tracks) {
    populateList(
        document.querySelector(`#currentPlaylist`),
        `{{#tracks}} ${document.querySelector(`#trackTemplate`).innerHTML} {{/tracks}}`,
        { tracks: tracks.map((song, i) => {
            return {
                id: song.id,
                order: (i+1) + ".",
                title: song.title,
                duration: minutify(song.duration)
            }})
        } 
    );
}

//uses mustache template engine to populate a list given li template, views and parent html element
function populateList(parent, template, view) {
    parent.innerHTML = mustache.render(template, view);
}


//turns seconds into a (hh:)mm:ss string
function minutify(seconds) {
    const hours = Math.floor(seconds/3600);
    let rest = seconds - hours * 3600;
    const minutes = Math.floor(seconds/60);
    rest = Math.round(seconds - minutes * 60);

    return `${(hours>0)? (hours + ":"): ""}${(minutes > 10)? minutes : (minutes >= 0) ? "0" + minutes : "00"}:${(rest >= 10) ? rest : "0" + rest}`;
}

//selects song from the library by its unique id and inserts it into the <audio> element
function selectSong(id) {
    console.log(`selecting song with id ${id}`);

    //set audio element src
    mediaElement.setAttribute(`src`, library[id].path);
    mediaElement.setAttribute(`data-id`, id);
    //update currentPlayback elements:

    //currentTitle
    document.querySelector(`#currentTitle`).textContent = library[id].title;
    //currentTitleArtist
    document.querySelector(`#currentTitleArtist`).textContent = library[id].artist;

    document.querySelector(`#elapsed`).textContent = 0;
    document.querySelector(`#total`).textContent = minutify(library[id].duration);

    searchBar.value = 0;
    searchBar.setAttribute(`max`, library[id].duration)

    PlayPauseIconSwitch();

    //ensure logic is linked: add to playlist, set-unset favourite
    //update search bar parameters:
    //
    // searchBar.rangeSlider.update({
    //     //min : 0,
    //     // max : 20, 
    //     //value : 1.5,
    // }, triggerEvents);
    
}

//returns promise of updating the search bar... maybe in time I will find a way to make it work with the custom one.
async function attemptUpdate() {
    let mark = mediaElement.currentTime;
    return new Promise((resolve, reject)=> {
        if(updatePending) reject(true);
        else {
            updatePending=true;
            document.querySelector(`#elapsed`).textContent = minutify(mark)
            searchBar.value = mark;
            /*
            searchBar.rangeSlider.update({
                value : mediaElement.currentTime,
            }, false);
            // update time elapsed/total
            */
            resolve(false);
        }
    });
}

//clears out a constant object so it can be loaded with up to date information
function mapClear(object) {
    for(let item in object) delete object[item];
}


//sets the icon of play button accordingly to paused state of the media
function PlayPauseIconSwitch() {

    if (mediaElement.paused)
        document.querySelector(`#playPause img`).setAttribute(`src`, `/public/assets/play.svg`);
    else 
        document.querySelector(`#playPause img`).setAttribute(`src`, `/public/assets/pause.svg`);

}














//// cafe of broken dreams ////

//slider setup
// Initialize a new plugin instance for one element or NodeList of elements.
/*
rangeSlider.create(searchBar, {
    polyfill: true,     // Boolean, if true, custom markup will be created
    root: document,
    rangeClass: 'rangeSlider',
    disabledClass: 'rangeSlider--disabled',
    fillClass: 'rangeSlider__fill',
    bufferClass: 'rangeSlider__buffer',
    handleClass: 'rangeSlider__handle',
    startEvent: ['mousedown', 'touchstart', 'pointerdown'],
    moveEvent: ['mousemove', 'touchmove', 'pointermove'],
    endEvent: ['mouseup', 'touchend', 'pointerup'],
    vertical: false,    // Boolean, if true slider will be displayed in vertical orientation
    min: 0,          // Number, 0
    max: 100,          // Number, 100
    step: 0.1,         // Number, 1
    value: 0,        // Number, center of slider
    buffer: 0,       // Number, in percent, 0 by default
    //stick: null,        // [Number stickTo, Number stickRadius] : use it if handle should stick to ${stickTo}-th value in ${stickRadius}
    borderRadius: 10,   // Number, if you're using buffer + border-radius in css
    onInit: function () {
        console.info('onInit')
        // console.log(this);
    },
    onSlideStart: function (position, value) {
        console.info('onSlideStart', 'position: ' + position, 'value: ' + value);
    },
    onSlide: function (position, value) {
        console.log('onSlide', 'position: ' + position, 'value: ' + value);
    },
    onSlideEnd: function (position, value) {
        console.warn('onSlideEnd', 'position: ' + position, 'value: ' + value);
    }
});
*/
// update position
//const triggerEvents = true; // or false
// searchBar.rangeSlider.update({
//     min : 0,
//     max : 20, 
//     step : 0.5,
//     value : 1.5,
//     buffer : 70
// }, triggerEvents);