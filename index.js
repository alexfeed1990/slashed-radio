let songArray = [];
let playHistory = [];
let audioPlayer;

let albumCoverElement;
let songNameElement;
let albumNameElement;
let volumeSlider;
let playButton;
let pause = true;

function playAudio(obj, add) {
    audioPlayer = new Audio(obj.path);
    if (add) playHistory.push(obj);

    songNameElement.textContent = obj.name;
    albumNameElement.textContent = obj.album;
    albumCoverElement.src = `songs/${obj.albumCover}`;
    audioPlayer.volume = volumeSlider.value/100;
    audioPlayer.addEventListener("ended", e => {
        skipSong();
    })

    audioPlayer.play();
}

function playButtonFunc() {
    if (pause) {
        pause = !pause;
        document.querySelector(".play").classList.add("hidden");
        document.querySelector(".pause").classList.remove("hidden");
        if (!audioPlayer) {
            playAudio(getRandomSong(songArray), true);
        } else {
            audioPlayer.play();
        }
    } else {
        pause = !pause;
        audioPlayer.pause();
        document.querySelector(".play").classList.remove("hidden");
        document.querySelector(".pause").classList.add("hidden");
    }
}

function skipSong() {
    if (pause) {
        pause = !pause;
        document.querySelector(".play").classList.add("hidden");
        document.querySelector(".pause").classList.remove("hidden");
        if (!audioPlayer) {
            playAudio(getRandomSong(songArray), true);
        } else {
            audioPlayer.pause();
            playAudio(getRandomSong(songArray), true)
        }
    } else {
        audioPlayer.pause();
        playAudio(getRandomSong(songArray), true)
    }
}

function goBack() {

    if (pause) {
        pause = !pause;
        document.querySelector(".play").classList.add("hidden");
        document.querySelector(".pause").classList.remove("hidden");
        if (!audioPlayer) {
            playAudio(getRandomSong(songArray), true);
        } else {
            audioPlayer.pause();
            playAudio(playHistory[(playHistory.length - 2)], false)
        }
    } else {
        audioPlayer.pause();
        if (playHistory[(playHistory.length - 2)]) playAudio(playHistory[(playHistory.length - 2)], false)
    }
}

function getRandomSong(array) {
    let index = Math.floor(Math.random() * array.length);
    return array[index];
}

function getAlbum(songs) {
    
}

document.addEventListener("DOMContentLoaded", () => {
    albumCoverElement = document.getElementById("albumCover");
    songNameElement = document.getElementById("songName");
    albumNameElement = document.getElementById("albumName");
    volumeSlider = document.getElementById("volume");
    volumeSlider.addEventListener("input", (e) => { audioPlayer.volume = e.target.value/100; })
    playButton = document.getElementById("playButton");
    
    fetch(`${document.location.origin + document.location.pathname}/songs/songs.json`)
        .then((response) => response.json())
        .then((songs) => {
            if(songs == null) console.error("Songs.json not found in songs/ folder.")
            for(let albumName of Object.keys(songs)) {
                const album = songs[albumName];
                // {song: NAME, album: NAME, albumCover: PATH, path: PATH}
                for(let songName of Object.keys(album.songs)) {
                    songArray.push({ "name": songName, "album": albumName, "albumCover": album.cover, path: `songs/${album.songs[songName].path}`});
                }
            }
        })
});