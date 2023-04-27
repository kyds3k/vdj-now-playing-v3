console.log('yo yo yo check');

let tracklist = 'ArtistTitle.txt';

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
          $(".result").html(`${artist} - ${track}`);
          $('.result').removeClass('animate__fadeOutDown').addClass('animate__fadeInDown');
        }, 1500);
    });
    return false;
  });

  const loadcta = document.querySelector('.load-left');
  loadcta.addEventListener('click', () => {
    console.log('shall we go vanilla?');
  })