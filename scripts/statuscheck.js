import '../styles/status.css';

const statusbox = document.querySelector('.statusbox');
let firstTime = localStorage.getItem('currentSong') === null;
let delay = 3000; // Default delay of 3000ms
let isDifferentSong = false; // Flag to track if the song is different

console.log('statuscheck.js loaded');

// Initialize currentSong from localStorage or set to an empty string
let currentSong = firstTime ? '' : localStorage.getItem('currentSong');

// Helper function to parse the artist from tracklist data
function getArtistFromTrack(data) {
  const firstBreak = data.lastIndexOf(': ') + 2;
  const wholeTrack = data.substring(firstBreak);
  const cutoff = wholeTrack.lastIndexOf(' - ');
  return wholeTrack.substring(0, cutoff);
}

// Helper function to clean the track string
function cleanTrack(track) {
  return track.replace('(Clean)', '')
              .replace('(Extended)', '')
              .slice(0, -3);
}

// Function to update the current song and UI if the song has changed
function updateSong(artist) {
  if (firstTime) {
    localStorage.setItem('currentSong', artist);
    firstTime = false;
    console.log('first time');
  } else if (currentSong !== artist) {
    console.log('new song');
    currentSong = artist;
    localStorage.setItem('currentSong', artist);
    statusbox.classList.add('leggo');
    delay = 20000; // Increase delay to 20000ms for one iteration
    isDifferentSong = true;
  } else {
    console.log('same song');
    statusbox.classList.remove('leggo');
    delay = 3000; // Reset delay to 3000ms if song is the same
    isDifferentSong = false;
  }
}

// Main function to fetch the tracklist and handle updates
function fetchTracklist() {
  fetch('../tracklist.txt')
    .then(response => response.text())
    .then(data => {
      const artist = getArtistFromTrack(data);
      updateSong(artist);
    })
    .catch(error => console.error(error))
    .finally(() => {
      setTimeout(fetchTracklist, delay);
      if (isDifferentSong) delay = 3000; // Reset delay to 3000ms after one iteration
    });
}

// Start the first fetch
fetchTracklist();
