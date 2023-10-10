import '../styles/funfacts.css';


/* eslint-disable no-undef */
/* eslint-disable no-console */

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
    console.log('transition ended');

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
        var cutoff = wholeTrack.indexOf(' - ');
        var artist = wholeTrack.substring(0, cutoff);
        cutoff += 3;
        var track = wholeTrack.substring(cutoff);
        var removals = ['(Clean)', '(Dirty)', '(Extended)','(Single)', '(Official Video)', '(Intro)', '(Official Music Video)', '[Intro]', '(HD Remastered', '(official video)', '(Lyrics)', '(Lyric Video)', 'Official Music Video','Official Video','OFFICIAL VIDEO'];
        removals.forEach(function(key) {
          track = track.replace(key, '');
        });
        track = track.trim();
        console.log(artist);
        console.log(track);
        infoWrite(artist, track);
      })
      .catch(function(error) {
        console.error('Error:', error);
      });

      waitForElement('.scroll-text .text').then(function() {
        console.log('text is here!');
        document.body.style.opacity = 1;
        fadeFinished = true;
        void scrollText.offsetWidth;
        restartAnimation();
        var scrollHeight = scrollText.offsetHeight;
        console.log('scrollHeight is', scrollHeight);
        let scrollSpeed = (scrollHeight * 2.0 + window.innerHeight * 2.0) / 100.0;
        // var scrollSpeed = scrollHeight / 40;
        // if (scrollSpeed < 10) {
        //   scrollSpeed = 10  ;
        // }
        //scrollspeed = 1000;
        scrollText.style.animationDuration = scrollSpeed + 's';
        console.log('scrollspeed is', scrollSpeed + 's');
      });
    }
  });
});

// if a div with the class "facts-speed" is clicked, check to see if it has the class "faster". if it does, reduce scrollText's animation duration by 1 second. if not, reduce it by 1 second.
document.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('speed change');
  if(e.target.classList.contains('facts-speed')) {
    if(e.target.classList.contains('faster')) {
      let currentSpeed = scrollText.style.animationDuration;
      currentSpeed = currentSpeed.replace('s', '');
      currentSpeed = parseInt(currentSpeed);
      currentSpeed -= 10;
      scrollText.style.animationDuration = currentSpeed + 's';
      console.log('current speed is', currentSpeed);
    } else {
      let currentSpeed = scrollText.style.animationDuration;
      currentSpeed = currentSpeed.replace('s', '');
      currentSpeed = parseInt(currentSpeed);
      currentSpeed += 10;
      scrollText.style.animationDuration = currentSpeed + 's';
      console.log('current speed is', currentSpeed);
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
  /* manually declare an array of artist names with their respective ids*/
  
  let id = '';
  
  const customArtists = {
    'actors': '2Gs4t6zBT69DSluLvaEBWK',
    'siouxsie and the banshees': '1n65zfwYIj5kKEtNgxUlWb',
    'clan of xymox': '1wHmR7I0UlF58WFQexCPha',
    'torul': '56EBe1vvPPsv7Pk5rAaSck',
    'black box': '6tsRo8ErXzpHk3tQeH6GBW',
    'xeno & oaklander': '3pMGuYgBWUDurP8HzPrKoI',
    'showbiz & ag': '1U0EFT6jsUpEXAaWesmxAz',
    'showbiz & a.g.': '1U0EFT6jsUpEXAaWesmxAz',
    'echo & the bunnymen': '0fgYKF9Avljex0L9Wt5b8Z',
    'echo and the bunnymen': '0fgYKF9Avljex0L9Wt5b8Z',
    'cause & effect': '6yVCJmap0wrEq1d7TNAGJc',
    'pure obsessions & red nights': '6m9fysdVTyH0KxNhG3DDaT',
    'bronski beat': '2wpWOzQE5TpA0dVnh5YD08',
    'madonna': '6tbjWDEIzxoDsBA1FuhfPW',
    'hante.': '5PhSiNjHZevtfAj9zmvVkU',
    'void vison': '4PJ7jtAtcsjZItnD91XrMU',
    'the bolshoi': '30m0NFP0tHVmxcsUCvEN3K',
    'kate bush': '1aSxMhuvixZ8h9dK9jIDwL',
    'shriekback': '5zdhsKuFI263xttcgdoW3c',
    'deus ex lumina': '5DbzvrfeTWRy2XP39CmmTS',
    'reconverb': '0m9yUg4SwtHC2YHtCuunJQ',
    'blutengel': '2SRu9oxCg91Omb2yMFzttR?si=64013c1267ef4556',
    'curve': '6WYkr1SJofUO79alKPjop0',
    'vnv nation': 'https://open.spotify.com/artist/4KlYg0F5KG9QNDFKaeTNAy?si=40a26f8dfd87490b',
    'tr⧸st': 'https://open.spotify.com/artist/64NhyHqRKYhV0IZylrElWu?si=9ab775e12bcc4399',
    'void vision': 'https://open.spotify.com/artist/4PJ7jtAtcsjZItnD91XrMU?si=de54e8d1a2544ad9',
    'm.a.r.r.s.': 'https://open.spotify.com/artist/13jRo2FyagCX9wrKIpOt46?si=809e3cf51a374836',
    'howard jones': 'https://open.spotify.com/artist/6loBF9iQdE11WSX29fNKqY?si=6c3098537b3c45a2',
    'jane child': 'https://open.spotify.com/artist/5JBif5ahOKFFVuEpHhrp8Y?si=209c71f73a5b4172',
    'fee lion': 'https://open.spotify.com/artist/6GxyGOB90ojRbOdtOvGNcc?si=51d7500031ae46d6',
    'adam & the ants': 'https://open.spotify.com/artist/2DppeCnNtvrLfEobq9Pw5r?si=c22dba7d27574f35',
    'oingo boingo': 'https://open.spotify.com/artist/5LXEAEGrpKQtpyCu2sZuWu?si=3bcec038cc1e43d5',
    'the mission': 'https://open.spotify.com/artist/4SAdMucvHyws4QTeAUsPtE?si=640bc0fd56064bc4',
    'nox novacula': 'https://open.spotify.com/artist/7kNH9Eo1oB8yI9lEwekRvp?si=2c12c32a27aa4662',
    'fluid ghost': 'https://open.spotify.com/artist/4UGeMNcR04aMfdDVgtBdQQ?si=e589686d83724d37',
    'nnhmn': 'https://open.spotify.com/artist/3PFLYlaguMd2AXu1i3UAKt?si=u5RpuQK3QjW9L2K2L_V-fg',
    'sextile': 'https://open.spotify.com/artist/4ReoJ2faKfdjI0plizlL56?si=3d3f63df7dd7462d',
    'vacío eterno': 'https://open.spotify.com/artist/2QwzE5qu8KLZcfpuoweZrB?si=YaDcxy0pQ-G0hRuWklTBJw',
    'spoek mathambo': 'https://open.spotify.com/artist/3qw0OXlLhqI78xEWw9Ys8O?si=ace68e0ea58843e8',
    'wham!': 'https://open.spotify.com/artist/5lpH0xAS4fVfLkACg9DAuM?si=b3ad38706c134c53',
    'duran duran': 'https://open.spotify.com/artist/0lZoBs4Pzo7R89JM9lxwoT?si=c65bbc7459644624',
    'esses': 'https://open.spotify.com/artist/7HBg0SjUKvVd3IW9v1bf4T?si=1MMYC2GESBGwXi2e5U8ZRg',
    'riddlis': 'https://open.spotify.com/artist/4jIJyUhoYwPE24WKiuHNCq?si=2cab9dac61c24fd3',
    's y z y g y x': 'https://open.spotify.com/artist/4WSJtJKAMPDSzGfamNOmAa?si=H7esd5IXS_uXtgxijBE6eA',
    'boy harsher': 'https://open.spotify.com/artist/4iom7VVRU6AHRIu1JUXpLG?si=8w2-ECUfTJmtntMWLtzBCw',
    'nine inch nails': 'https://open.spotify.com/artist/0X380XXQSNBYuleKzav5UO?si=6025060991a348bf',
    'positive k': 'https://open.spotify.com/artist/5NtJpNZgRqBvRCq6OE08ZU?si=e9de2729d59247bd'
  }

  //if artist is in customArtists, use the id from there
  if (customArtists[artist.toLowerCase()]) {
    id = customArtists[artist.toLowerCase()];
    // remove "https://open.spotify.com/artist/" from the id
    id = id.replace('https://open.spotify.com/artist/', '');
    // remove everything after and including "?si=" from the id
    id = id.split('?si=')[0];
    console.log('custom artist!');
  } else {
    id = await getArtistId(artist, track);
  }

  const info = await getArtist(id);
  let infoBio = info.biography;
  if (infoBio == "null" || infoBio == null) {
    infoBio = "No artist info found.";
  }
  setTimeout(() => {
    let factContent = `<div class="image"><img src="${info.visuals ? info.visuals.avatar[0].url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png"}" /></div><div class="text">${infoBio}</div>`;
    console.log('fact content:', factContent);
    document.querySelector('.scroll-text').innerHTML = factContent;
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
      console.log(`search: ${searchTrack} by ${searchArtist}`);
      console.log(`response: ${responseTrack} by ${responseArtist}`);
      if(searchArtist == responseArtist && searchTrack == responseTrack || searchTrackFeat == responseTrack || searchTrackFt == responseTrack) {  
        artistId = response.artists[0].id;
      } else {
        artistId = idResponse.tracks.items[0].artists[0].id;
      }
    });


  console.log('artist id:', artistId);

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