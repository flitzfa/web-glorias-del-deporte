const tracks = [
  {
    title: "Ailín Pérez",
    image: "images/ailin-perez.png",
    audio: "audio/ailin-perez.mp3",
  },
  {
    title: "El Pato Fillol",
    image: "images/el-pato-fillol.png",
    audio: "audio/el-pato-fillol.mp3",
  },
  {
    title: "Esteban Ribovics",
    image: "images/esteban-ribovics.jpeg",
    audio: "audio/esteban-ribovics.mp3",
  },
  {
    title: "Francisco Prado",
    image: "images/francisco-prado.png",
    audio: "audio/francisco-prado.mp3",
  },
  {
    title: "Gaby Sabatini",
    image: "images/gaby-sabatini.png",
    audio: "audio/gaby-sabatini.mp3",
  },
  {
    title: "Ilia Topuria",
    image: "images/ilia-topuria.png",
    audio: "audio/ilia-topuria.mp3",
  },
  {
    title: "Noche UFC",
    image: "images/noche-ufc.png",
    audio: "audio/noche-ufc.mp3",
  },
  {
    title: "Santiago Ponzinibbio",
    image: "images/santiago-ponzinibbio.png",
    audio: "audio/santiago-ponzinibbio.mp3",
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
        <audio preload="none" src="${track.audio}"></audio>
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
