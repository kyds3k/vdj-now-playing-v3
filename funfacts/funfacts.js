import '../styles/funfacts.css';
// Ensure you have the correct Supabase client import
import { createClient } from '@supabase/supabase-js';


/* eslint-disable no-undef */
/* eslint-disable no-console */


const supabaseUrl = 'https://iwezigqyfoycwzfbjsuw.supabase.co'; // your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZXppZ3F5Zm95Y3d6ZmJqc3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NTQ1MjYsImV4cCI6MjA0MTUzMDUyNn0.nlC5AQNzRMk0J4Kmf5sLU_B8EDijZGL8l_BIrgBA2Pk'; // your Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);


const loadFacts = document.querySelector('.load-facts');
const scrollText = document.querySelector('.scroll-text');
const scrollContainer = document.querySelector('.scroll-container');

loadFacts.addEventListener('click', (e) => {
  let fadeFinished = false;
  e.preventDefault();
  // make the body opacity 0
  document.body.style.opacity = 0;

  // Listen for the end of the opacity transition
  document.body.addEventListener('transitionend', function() {
    // console.log('transition ended');

    if(!fadeFinished) {
      fetch('../tracklist.txt')
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        scrollText.innerHTML = '';
        let firstBreak = data.lastIndexOf(': ');
        firstBreak +=2;
        let wholeTrack = data.substring(firstBreak);
        console.log('whole track:', wholeTrack);
        let cutoff = wholeTrack.lastIndexOf(' - ');
        let artistTrack = wholeTrack.substring(0, cutoff);
        let artist = artistTrack.substring(0, artistTrack.lastIndexOf(' - '));
        let track = artistTrack.substring(artistTrack.lastIndexOf(' - ') + 3);
        let removals = ['(Clean)', '(Dirty)', '(Extended)','(Single)', '(Official Video)', '(Intro)', '(Official Music Video)', '[Intro]', '(HD Remastered', '(official video)', '(Lyrics)', '(Lyric Video)', 'Official Music Video','Official Video','OFFICIAL VIDEO'];
        removals.forEach(function(key) {
          track = track.replace(key, '');
        });
        track = track.trim();
        console.log('artist - track:', artistTrack);
        console.log('artist:', artist);
        console.log('track:', track);
        infoWrite(artist, track);
      })
      .catch(function(error) {
        console.error('Error:', error);
      });

      waitForElement('.scroll-text .text').then(function() {
        document.body.style.opacity = 1;
        fadeFinished = true;
        void scrollText.offsetWidth;
        restartAnimation();
        let scrollHeight = scrollText.offsetHeight;
        let scrollSpeed = (scrollHeight * 2.0 + window.innerHeight * 2.0) / 100.0;
        scrollText.style.animationDuration = scrollSpeed + 's';
      });
    }
  });
});

// if a div with the class "facts-speed" is clicked, check to see if it has the class "faster". if it does, reduce scrollText's animation duration by 1 second. if not, reduce it by 1 second.
document.addEventListener('click', (e) => {
  e.preventDefault();
  if(e.target.classList.contains('facts-speed')) {
    if(e.target.classList.contains('faster')) {
      let currentSpeed = scrollText.style.animationDuration;
      currentSpeed = currentSpeed.replace('s', '');
      currentSpeed = parseInt(currentSpeed);
      currentSpeed -= 10;
      scrollText.style.animationDuration = currentSpeed + 's';
    } else {
      let currentSpeed = scrollText.style.animationDuration;
      currentSpeed = currentSpeed.replace('s', '');
      currentSpeed = parseInt(currentSpeed);
      currentSpeed += 10;
      scrollText.style.animationDuration = currentSpeed + 's';
    }
  }
});

const waitForElement = ((selector) => new Promise((resolve) => {
  let element = document.querySelector(selector);
  if (element) {
    resolve(element);
    return;
  }
  let observer = new MutationObserver(mutations => {
    mutations.forEach(function (mutation) {
      let nodes = Array.from(mutation.addedNodes);
      for (let node of nodes) {
        if (node.matches && node.matches(selector)) {
          observer.disconnect();
          resolve(node);
          return;
        }
      };
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}));


async function infoWrite(artist, track) {
  let id = '';
  let bandcamp = '';

  // Convert artist name to lowercase for consistent comparison
  const artistKey = artist.toLowerCase();

  // Fetch artist data from Supabase
  const { data, error } = await supabase
    .from('bands')  // Replace 'artists' with the actual name of your table
    .select('id, bandcamp')
    .ilike('name', artistKey);  // Assuming your table has a 'name' column

  if (error) {
    console.error('Error fetching artist data from Supabase:', error);
    return;
  }

  if (data && data.length > 0) {
    // If artist found in Supabase
    id = data[0].id;
    bandcamp = data[0].bandcamp;

    // Remove "https://open.spotify.com/artist/" from the id
    id = id.replace('https://open.spotify.com/artist/', '');
    // Remove everything after and including "?si=" from the id
    id = id.split('?si=')[0];
    console.log('Artist found in Supabase:', id, bandcamp);
  } else {
    // Fallback to external API if artist not found in Supabase
    id = await getArtistId(artist, track);
  }

  // Fetch more artist info from another source (e.g., Spotify, Last.fm, etc.)
  const info = await getArtist(id);
  console.log('Artist info:', info);
  let infoBio = info.biography;
  let infoLinks = info.externalLinks;
  
  const fbLink = infoLinks.find(link => link.name === 'FACEBOOK')?.url;
  const igLink = infoLinks.find(link => link.name === 'INSTAGRAM')?.url;
  const twitterLink = infoLinks.find(link => link.name === 'TWITTER')?.url.split('?')[0];
  const wikiLink = infoLinks.find(link => link.name === 'WIKIPEDIA')?.url;

  console.log('fb:', fbLink);
  console.log('ig:', igLink);
  console.log('twitter:', twitterLink);
  console.log('wiki:', wikiLink);

  if (!infoBio) {
    infoBio = "No artist info found.";
  }

  setTimeout(() => {
    let factContent = `<div class="image"><img src="${info.visuals ? info.visuals.avatar[2].url : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png"}" /></div><div class="text">${infoBio}</div>`;
    document.querySelector('.scroll-text').innerHTML = factContent;

    let hasLinks = (fbLink || igLink || twitterLink || wikiLink || bandcamp);

    if (hasLinks) {
      const fireApi = `http://10.147.17.113:7472/api/v1/effects/preset/cf030fc0-5a19-11ed-a803-ef13be8bbec8?${fbLink ? `facebook=${encodeURI(fbLink)}&` : ''}${igLink ? `instagram=${encodeURI(igLink)}&` : ''}${twitterLink ? `twitter=${encodeURI(twitterLink)}&` : ''}${wikiLink ? `wikipedia=${encodeURI(wikiLink)}&` : ''}${bandcamp ? `bandcamp=${encodeURI(bandcamp)}` : ''}`;
      const kickApi = `https://api.aerokick.app/api/v1/bot/webhook/502c56ba-ff68-449b-b845-3b30433b0115`;
      const kickBody = `Check out this artist at: ${bandcamp ? `Bandcamp: ${encodeURI(bandcamp)}` : ''} ${fbLink ? `Facebook: ${encodeURI(fbLink)}` : ''} ${igLink ? `Instagram: ${encodeURI(igLink)}` : ''} ${twitterLink ? `Twitter: ${encodeURI(twitterLink)}` : ''} ${wikiLink ? `Wikipedia: ${encodeURI(wikiLink)}` : ''}`
      
      fetch(kickApi, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: kickBody
      });

      // Optionally, call fireApi as well
      // fetch(fireApi, { method: 'GET' });
    }
  }, 3000);
}



async function getArtistId(artist, track) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b3c30e1fe1mshdec178456eef372p1c132djsnbd46fe5280cb',
      'X-RapidAPI-Host': 'spotify-scraper.p.rapidapi.com'
    }
  };

  let artistId = '';
  let feature = false;
  let featureText = '';
  let arr = ['ft.', 'feat.', 'featuring']
  for (let i = 0; i < arr.length; i++) {
    if (artist.indexOf(arr[i]) !== -1) {
      featureText = arr[i];
      feature = true;
      break;
    }
  }

  if (feature) {
    const splitted = artist.split(featureText);
    artist = splitted[0];
  }

  const idResponse = await fetch(`https://spotify-scraper.p.rapidapi.com/v1/search?term=${artist}%20${track}&type=track&limit=10`, options)
    .then(response => response.json())
    .catch(err => console.error(err));

    idResponse.tracks.items.forEach((response) => {
      const searchArtist = artist.toLowerCase();
      const searchTrack = track.toLowerCase();
      const searchTrackFeat = searchTrack.replace('ft.', 'feat.');
      const searchTrackFt = searchTrack.replace('feat.', 'ft.');
      const responseArtist = response.artists[0].name.toLowerCase();
      const responseTrack = response.name.toLowerCase();
      // console.log(`search: ${searchTrack} by ${searchArtist}`);
      // console.log(`response: ${responseTrack} by ${responseArtist}`);
      if(searchArtist == responseArtist && searchTrack == responseTrack || searchTrackFeat == responseTrack || searchTrackFt == responseTrack) {
        artistId = response.artists[0].id;
      } else {
        artistId = idResponse.tracks.items[0].artists[0].id;
      }
    });


  // console.log('artist id:', artistId);

  if(artistId == '') {
    return null;
  } else {
    return artistId;
  }
}

async function getArtist(id) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b3c30e1fe1mshdec178456eef372p1c132djsnbd46fe5280cb',
      'X-RapidAPI-Host': 'spotify-scraper.p.rapidapi.com'
    }
  };

  const artist = await fetch(`https://spotify-scraper.p.rapidapi.com/v1/artist/overview?artistId=${id}`, options)
    .then(response => response.json())
    .catch(err => console.error(err));
  console.log(artist);
  return artist;
}

function restartAnimation() {
  let circle = document.querySelector(".scroll-text.animated");

  circle.style.animationName = "none";

  requestAnimationFrame(() => {
    setTimeout(() => {
      circle.style.animationName = ""
    }, 0);
  });
}

// Function to load the data after Supabase is initialized
async function loadData() {
  try {
    const { data, error } = await supabase
      .from('bands')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Data:', data);
      // You can now use the 'data' variable to display or manipulate the fetched rows
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}