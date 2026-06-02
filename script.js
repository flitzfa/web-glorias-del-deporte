const tracks = [
  {
    title: "Ailín Pérez",
    image: "images/ailin-perez.png",
    audio: "https://www.dropbox.com/scl/fi/ypt6o58hsrr4myketmi6g/TRACK_01_AilinPerez.mp3?rlkey=oq39yqpbzngrso8jttn0ecuyk&st=7g43k5u3&raw=1",
  },
  {
    title: "El Pato Fillol",
    image: "images/el-pato-fillol.png",
    audio: "https://www.dropbox.com/scl/fi/vmig6rxi1q780fsfxoiuw/TRACK_02_PatoFillol.mp3?rlkey=omqnxob5hw23wxmo7dw4pl7cr&st=3wiqyros&raw=1",
  },
  {
    title: "Esteban Ribovics",
    image: "images/esteban-ribovics.jpeg",
    audio: "https://www.dropbox.com/scl/fi/7x3s5arrjt3wzqonc5fad/TRACK_03_EstebanRibovics.mp3?rlkey=7jpcxn6kbiwtav0rue1ygffp3&st=waj4rkgw&raw=1",
  },
  {
    title: "Francisco Prado",
    image: "images/francisco-prado.png",
    audio: "https://www.dropbox.com/scl/fi/l7otsh6dmq1kpecblfd3r/TRACK_04_FranciscoPrado.mp3?rlkey=x20z5hrkwt051pl8srwjtfjjl&st=f9ikkg2t&raw=1",
  },
  {
    title: "Gaby Sabatini",
    image: "images/gaby-sabatini.png",
    audio: "https://www.dropbox.com/scl/fi/m04nktuvsrplsx1cmjkrr/TRACK_05_GabySabatini.mp3?rlkey=s6fa5hh27i5rx6bm3wb9i43jb&st=o07b93n6&raw=1",
  },
  {
    title: "Ilia Topuria",
    image: "images/ilia-topuria.png",
    audio: "https://www.dropbox.com/scl/fi/nl0ywlpz2edowl001bvo0/TRACK_06_IliaTopuria.mp3?rlkey=bnfd3wp2nbci8xy7nndd57hsn&st=0c9bm0g3&raw=1",
  },
  {
    title: "Noche UFC",
    image: "images/noche-ufc.png",
    audio: "https://www.dropbox.com/scl/fi/qi9q2d402goegs3m3rhd5/TRACK_07_NocheUFC.mp3?rlkey=rc15rx079fzqs1dmyyeip6n7n&st=fclebe0t&raw=1",
  },
  {
    title: "Santiago Ponzinibbio",
    image: "images/santiago-ponzinibbio.png",
    audio: "https://www.dropbox.com/scl/fi/iri9v0msr2m65h5r17p4d/TRACK_08_SantiagoPonzinibbio.mp3?rlkey=o8loi9h7b5mgpjww8af9qhz8v&st=hm8fazdg&raw=1",
  },
];

// Carrusel principal: cambia suavemente entre las ocho portadas.
const slides = document.querySelectorAll(".hero-slide");
let activeSlide = 0;

setInterval(() => {
  slides[activeSlide].classList.remove("is-active");
  activeSlide = (activeSlide + 1) % slides.length;
  slides[activeSlide].classList.add("is-active");
}, 4500);

const tracksGrid = document.querySelector("#tracksGrid");

// Convierte segundos del reproductor en formato mm:ss.
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

// Mantiene una sola cancion sonando a la vez.
function pauseOtherTracks(currentAudio) {
  document.querySelectorAll("audio").forEach((audio) => {
    if (audio !== currentAudio) {
      audio.pause();
      audio.closest(".track-card").querySelector(".play-button").textContent = "▶";
    }
  });
}

// Crea cada tarjeta y conecta sus controles de audio sin cargar el MP3 por adelantado.
function createTrackCard(track, index) {
  const card = document.createElement("article");
  card.className = "track-card reveal";

  card.innerHTML = `
    <div class="track-art">
      <img src="${track.image}" alt="Portada de ${track.title}" loading="lazy">
    </div>
    <div class="track-body">
      <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
      <h3>${track.title}</h3>
      <div class="audio-player">
        <button class="play-button" type="button" aria-label="Reproducir ${track.title}">▶</button>
        <div class="progress-wrap">
          <progress class="progress" max="100" value="0" aria-label="Progreso de ${track.title}"></progress>
          <div class="time-row">
            <span class="current-time">0:00</span>
            <span class="duration">0:00</span>
          </div>
        </div>
        <audio preload="auto" src="${track.audio}"></audio>
      </div>
    </div>
  `;

  const audio = card.querySelector("audio");
  const playButton = card.querySelector(".play-button");
  const progress = card.querySelector(".progress");
  const currentTime = card.querySelector(".current-time");
  const duration = card.querySelector(".duration");

  playButton.addEventListener("click", async () => {
    if (audio.paused) {
      pauseOtherTracks(audio);
      await audio.play();
      playButton.textContent = "❚❚";
      playButton.setAttribute("aria-label", `Pausar ${track.title}`);
    } else {
      audio.pause();
      playButton.textContent = "▶";
      playButton.setAttribute("aria-label", `Reproducir ${track.title}`);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const percentage = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progress.value = percentage;
    currentTime.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    playButton.textContent = "▶";
    progress.value = 0;
    currentTime.textContent = "0:00";
  });

  progress.addEventListener("click", (event) => {
    if (!audio.duration) {
      return;
    }

    const rect = progress.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    audio.currentTime = clickPosition * audio.duration;
  });

  return card;
}

tracks.forEach((track, index) => {
  tracksGrid.appendChild(createTrackCard(track, index));
});

// Animaciones discretas al entrar en pantalla.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});
