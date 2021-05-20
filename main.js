let audio = document.querySelector('.quranPlayer'),
    surahContainer = document.querySelector('.surahs'),
    ayah = document.querySelector('.ayah'),
    next = document.querySelector('.next'),
    prev = document.querySelector('.prev'),
    play = document.querySelector('.play');

function getSurahs() {
    // fetch to get surahs data
    fetch("https://api.quran.sutanlab.id/surah")
        .then(Response => Response.json())
        .then(data => {
            for (let surah in data.data) {

                surahContainer.innerHTML += 
                `
                <div>
                <p>${data.data[surah].name.long}</p>
                <p>${data.data[surah].name.transliteration.en}</p>
                </div>
                `
            }
            // select all surahs
            let allSurahs = document.querySelectorAll('.surahs div'),
            AyahsAudios,
            AyahsText;
            allSurahs.forEach((surah, index)=>{
                surah.addEventListener("click", () => {
                    fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
                    .then(Response => Response.json())
                    .then(data => {
                        let verses = data.data.verses;
                        AyahsAudios = [];
                        AyahsText = [];
                        verses.forEach(verse => {
                            AyahsAudios.push(verse.audio.primary)
                            AyahsText.push(verse.text.arab)
                        })
                        let ayahIndex = 0;
                        changeAyah(ayahIndex);
                        audio.addEventListener("ended", () => {
                            ayahIndex++;
                            if (ayahIndex < AyahsAudios.length) {
                                changeAyah(ayahIndex);
                            } else {
                                ayahIndex = 0;
                                changeAyah(ayahIndex);
                                audio.pause()
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Surah has been ended',
                                    showConfirmButton: false,
                                    timer: 1500
                                  })
                                  isPlaying = true;
                                  togglePlay();
                            }
                        })
                        // handle next and prev
                        next.addEventListener("click", ()=> {
                            ayahIndex < AyahsAudios.length -1 ? ayahIndex++ : ayahIndex = 0;
                            changeAyah(ayahIndex);
                        })
                        prev.addEventListener("click", ()=> {
                            ayahIndex == 0 ? ayahIndex = AyahsAudios.length -1 : ayahIndex --;
                            changeAyah(ayahIndex);
                        })
                        // handle play and pause audio
                        let isPlaying = false;
                        togglePlay();
                        function togglePlay() {
                            if (isPlaying) {
                                audio.pause();
                                play.innerHTML = `<i class="fa fa-play"></i>`;
                                isPlaying = false;
                            } else {
                                audio.play();
                                play.innerHTML = `<i class="fa fa-pause"></i>`;
                                isPlaying = true;
                            }
                        }
                        play.addEventListener("click", togglePlay)
                        function changeAyah(index) {
                            audio.src = AyahsAudios[index];
                            ayah.innerHTML = AyahsText[index];
                        }
                        function changeAyah(index) {
                            audio.src = AyahsAudios[index];
                            ayah.innerHTML = AyahsText[index];
                        }
                    })
                })
            })
        })
}
getSurahs();


scrollBtn =  document.querySelector('.scroll-btn');
window.addEventListener("scroll", function() {
    if (window.scrollY > 500) {
        scrollBtn.classList.add('active');
    } else {
        scrollBtn.classList.remove('active');
    }
});
scrollBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});
