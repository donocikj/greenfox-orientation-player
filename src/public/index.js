"use strict";

console.log(`script loaded`);

//const definitions




const searchBar = document.querySelector('#searchBar');
const volSlider = document.querySelector('#volumeBar');


//media element
const mediaElement = document.querySelector(`audio`);
//console.log(mediaElement);

//song library
const library = [];

//favourites
const favourites = [];

//playlists
const playlists = [];


////////////////////////////////////////////////////////////////////////////
//event registration ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// 

//slider setup
// Initialize a new plugin instance for one element or NodeList of elements.

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

// update position
const triggerEvents = true; // or false
// searchBar.rangeSlider.update({
//     min : 0,
//     max : 20, 
//     step : 0.5,
//     value : 1.5,
//     buffer : 70
// }, triggerEvents);

//on pageload 
document.addEventListener(`DOMContentLoaded`, initializeAllTheThings)
console.log(`listening to the DOMContentLoaded...`);
   

        // play button
            //if paused
            //media.play
            //change icon to pause


            //else
            //media.pause
            //change icon to play

        // rewind
            //if media is past 0
            //return to start

            //else select previous title in playlist

        // next
            //select next title in playlist

        // searchbar
        searchBar.addEventListener(`input`, (e)=> {
            // console.log(e);
            console.log(e.target.value);
            // console.log(searchBar)
        })
        console.log(`Listening to searchbar 'input'...`);

        //progress
        mediaElement.addEventListener(`progress`, (e)=> {
            console.log(e);
        });
        console.log(`Listening to media 'progress'...`);

        mediaElement.addEventListener(`timeupdate`, (e)=> {
            console.log(e);
        });
        console.log(`Listening to media 'timeupdate'...`);

        //add playlist
            //prompt for name
            //instantiate empty

        //add song
            //ask to which playlist

        //favourite / unfavourite song
            //add / remove favourite flag
            //update favourites playlist

        //mute

        //volume



    //selecting a playlist (clicking the playlist pane)


    //selecting a song (clicking the track pane)


//////////////////////////////////////////////////////////////////////
// event handlers ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function initializeAllTheThings(e) {

    //GET library information
    getLibraryData();

    //select "all tracks" list
    // and populate list of songs
    setPlaylist(0);

    //select the first

    //link it to the media element

    //GET list of playlists
    //populate playlist list

}



///////////////////////////////////////////////////////////////////////
//helper functions ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

async function getLibraryData() {

    fetch(`/playlist-tracks`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            playlists.push(data);
            data.forEach(song => {
                library.push(song);
            })
        })
        .catch(error => console.error(error))
        .finally(console.log(library));

}

//sets selected playlist as active and populates the track pane with its members
function setPlaylist(playlist_id) {
    console.log(`currently selected: `);
    console.log(mediaElement);
    console.log(`selecting playlist ${playlist_id}`);
    //highlight the selected playlist

    //populate the track pane

    //no need to affect playback yet...
}



 
