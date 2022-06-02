CREATE DATABASE music_player;

USE music_player;

CREATE TABLE library (
	id INT UNSIGNED NOT NULL auto_increment,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) DEFAULT "",
    duration FLOAT NOT NULL,
    song_path VARCHAR(255) NOT NULL,
    PRIMARY KEY(id));
    
CREATE TABLE playlist (
	id INT UNSIGNED NOT NULL auto_increment,
    title VARCHAR(255) NOT NULL,
    system_rank TINYINT DEFAULT 0,
    PRIMARY KEY(id));
    
CREATE TABLE playlist_track (
 	playlist_id INT UNSIGNED NOT NULL,
     track_id INT UNSIGNED NOT NULL,
     trackOrder INT UNSIGNED,
     PRIMARY KEY(playlist_id, track_id),
     FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE,
     FOREIGN KEY (track_id) REFERENCES library(id) ON DELETE CASCADE);
     



CREATE USER gary_disco@localhost IDENTIFIED WITH mysql_native_password BY "password" ;
GRANT ALL ON music_player.* to gary_disco@localhost;