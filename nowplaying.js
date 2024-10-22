let tracklist = 'ArtistTitle.txt';

function utf8ToHex(str) {
  return Array.from(str).map(c => 
    c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : 
    encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
  ).join('');
}

$('.load-left').click(function () {
    $.get(tracklist, function (data) {
      console.log('data is', data);
      $('.result').removeClass('animate__fadeInDown').addClass('animate__fadeOutDown');
        setTimeout(() => {
          let firstBreak = data.lastIndexOf(': ');
          firstBreak +=2;
          let wholeTrack = data.substring(firstBreak);
          let cutoff = wholeTrack.lastIndexOf(' - ');
          let artist = wholeTrack.substring(0, cutoff);
          cutoff +=3;
          let track = wholeTrack.substring(cutoff);
          // remove "(Clean)" and "(Extended)" from track name
          track = track.replace('(Clean)', '');
          track = track.replace('(Extended)', '');
          // remove everything after the last " - "
          let lastDash = track.lastIndexOf(' - ');
          track = track.substring(0, lastDash);
          console.log('track is', track);
          $(".result").html(`${artist} - ${track}`);
          $('.result').removeClass('animate__fadeOutDown').addClass('animate__fadeInDown');
        }, 1500);

        console.log(utf8ToHex(data));
    });
    return false;
  });

  const loadcta = document.querySelector('.load-left');
  loadcta.addEventListener('click', () => {
    console.log('shall we go vanilla?');
  })