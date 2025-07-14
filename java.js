async function getSongs() {
    return [
        "songs/03- Gopala.mp3",
        "songs/05- Shyamasundar Radhe .mp3", // removed extra space
        "songs/6 - Hymn.mp3",
        "songs/Meditation of the heart - Yasoda-Nandana 4 .mp3" // removed extra space
    ];
}

async function main() {
    const songs = await getSongs();
    const library = document.getElementById("library");
    const audio = new Audio();
    const seekbar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");
    const songInfo = document.querySelector(".songInfo");
    const playBtn = document.querySelector('.songButtons img:nth-child(2)');
    const prevBtn = document.querySelector('.songButtons img:nth-child(1)');
    const nextBtn = document.querySelector('.songButtons img:nth-child(3)');
    const currentTimeEl = document.querySelector('.songTime .current');
    const durationEl = document.querySelector('.songTime .duration');


    let currentSongIndex = -1;

    // Update seekbar as song plays
    audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        circle.style.left = `${progress}%`;

        // Update current time
        currentTimeEl.textContent = formatTime(audio.currentTime);

        // Update duration once it's available
        durationEl.textContent = formatTime(audio.duration);
    }
});

    // Click to seek
    seekbar.addEventListener("click", (e) => {
        const width = seekbar.clientWidth;
        const offset = e.offsetX;
        const percent = offset / width;
        audio.currentTime = percent * audio.duration;
    });

    // Function to play a song by index
    function playSong(index) {
        if (index >= 0 && index < songs.length) {
            const name = songs[index].split("/").pop().replace(".mp3", "");
            audio.src = songs[index];
            audio.currentTime = 0;
            audio.play();
            currentSongIndex = index;
            songInfo.innerText = `${name} - Unknown Artist`;
            playBtn.src = "pause.svg"; // update icon to pause
        }
    }

    // Play/Pause toggle button
    playBtn.addEventListener("click", () => {
        if (currentSongIndex === -1) {
            playSong(0); // Play first song if none selected
        } else if (audio.paused) {
            audio.play();
            playBtn.src = "pause.svg";
        } else {
            audio.pause();
            playBtn.src = "play.svg";
        }
    });

    // When song ends, switch icon back to play
    audio.addEventListener("ended", () => {
        playBtn.src = "play.svg";
    });

    // Previous button
    prevBtn.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        }
    });

    // Next button
    nextBtn.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            playSong(currentSongIndex + 1);
        }
    });

    // Create song cards dynamically
    songs.forEach((song, index) => {
        const name = song.split("/").pop().replace(".mp3", "");
        const artist = "Unknown Artist";

        const card = document.createElement("div");
        card.classList.add("song-card");

        card.innerHTML = `
            <h3>${name}</h3>
            <p>${artist}</p>
            <button class="play-btn">Play Now</button>
        `;

        card.querySelector(".play-btn").addEventListener("click", () => {
            playSong(index);
        });

        library.appendChild(card);
    });

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value);
    audio.volume=parseInt(e.target.value)/100;
});

}
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}


main();
