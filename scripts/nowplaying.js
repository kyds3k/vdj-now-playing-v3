  const loadcta = document.querySelector('.load-left');
  const result = document.querySelector('.result');

  loadcta.addEventListener('click', (e) => {
    console.log('click clack');
    e.preventDefault();
    fetch('tracklist.txt')
    //fetch('ArtistTitle.txt')11
    .then(response => response.text())
    .then(data => {
      console.log('data is', data);
      result.classList.remove('animate__fadeInDown');
      result.classList.add('animate__fadeOutDown');
      setTimeout(() => {
        let firstBreak = data.lastIndexOf(': ');
        firstBreak +=2;
        let wholeTrack = data.substring(firstBreak);
        //let wholeTrack = data;
        let cutoff = wholeTrack.lastIndexOf(' - ');
        let artist = wholeTrack.substring(0, cutoff);
        cutoff +=3;
        let track = wholeTrack.substring(cutoff);
        result.innerHTML = (`${artist} - ${track}`);
        result.classList.remove('animate__fadeOutDown');
        result.classList.add('animate__fadeInDown');
      }, 1500);      
    })
    .catch(error => {
      console.error(error);
    });
 
  })