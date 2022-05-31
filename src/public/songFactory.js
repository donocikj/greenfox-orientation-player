"use strict"

const songFactory = (mediaElement) => {

    //private variables go here


    return { //things I want object to expose go here

        //call media element and play?
        play: () => {
            mediaElement.play();
        },

        //call media element and stop?
        pause: () => {
            mediaElement.pause();
        },

        //
        loadFile: (path) => {
            mediaElement.setAttribute(`src`, path);
        },

        skipToTime: (newTime) => {
            //check bounds?
            mediaElement.currentTime = newTime;
        },

        setVolume: (newValue) => {
            //check bounds?
            mediaElement.volume = newValue;
        },


    }
}