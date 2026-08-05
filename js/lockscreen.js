document.body.addEventListener("click", firstClick);

function firstClick() {
  document.body.removeEventListener("click", firstClick);
  document.getElementById("darkLayer").classList.add("active");
  setTimeout(() => {
    document.getElementById("ui").style.display = "block";
  }, 1200);
}

const logoScreen = document.getElementById("logoScreen");
const passwordArea = document.getElementById("passwordArea");
const passwordInput = document.getElementById("passwordInput");
const messageEl = document.getElementById("message");
const logo = document.getElementById("logo");

const enterBtn = document.getElementById("enterBtn");
const backBtn = document.getElementById("backBtn");

const correctPassword = "1234";

logo.addEventListener("click", () => {
  passwordArea.style.display = "block";
  passwordInput.focus();
});

enterBtn.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", e => {
  if (e.key === "Enter") checkPassword();
});

backBtn.addEventListener("click", () => {
  window.location.href = "lockscreen.html";
});

function checkPassword() {
  const entered = passwordInput.value.trim();
  if (entered === correctPassword) {
    showMessage("✅ Unlocked — Welcome", "success");
    setTimeout(() => {
      window.location.href = "homescreen.html";
    }, 800);
  } else {
    showMessage("❌ Incorrect Password", "fail");
    setTimeout(() => {
      passwordInput.value = "";
      messageEl.textContent = "";
    }, 1300);
  }
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = type || "";
}

/* PETALS */
const petalContainer = document.getElementById("petal-container");
const MAX_PETALS = 50;
let activePetals = 0;

function spawnPetal() {
  if (activePetals >= MAX_PETALS) return;
  activePetals++;

  const petal = document.createElement("div");
  petal.className = "petal";

  const size = Math.random() * 7 + 6;
  petal.style.width = size + "px";
  petal.style.height = size + "px";

  const fromLeft = Math.random() < 0.65;
  let startX, startY;

  if (fromLeft) {
    startX = Math.random() * 30 - 10;
    startY = Math.random() * (window.innerHeight * 0.6);
  } else {
    startX = Math.random() * (window.innerWidth * 0.25);
    startY = Math.random() * 20 - 10;
  }

  petal.style.left = startX + "px";
  petal.style.top = startY + "px";
  petalContainer.appendChild(petal);

  const duration = (Math.random() * 9 + 8) * 1000;
  const startTime = performance.now();

  const endX = window.innerWidth * (0.3 + Math.random() * 0.85);
  const endY = window.innerHeight * (Math.random() * 1.05);

  const wave1Amp = 25 + Math.random() * 35;
  const wave1Freq = 1.5 + Math.random() * 1.5;
  const wave2Amp = 10 + Math.random() * 18;
  const wave2Freq = 3 + Math.random() * 2;
  const wave1Phase = Math.random() * Math.PI * 2;
  const wave2Phase = Math.random() * Math.PI * 2;

  const bobAmp = 12 + Math.random() * 20;
  const bobFreq = 2 + Math.random() * 2;

  const spinSpeed = (Math.random() * 2 - 1) * 0.04;
  let angle = Math.random() * Math.PI * 2;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const progress = easeInOut(t);

    const waveX =
      wave1Amp * Math.sin(t * Math.PI * wave1Freq + wave1Phase) +
      wave2Amp * Math.sin(t * Math.PI * wave2Freq + wave2Phase);

    const waveY = bobAmp * Math.sin(t * Math.PI * bobFreq);

    const x = startX + (endX - startX) * progress + waveX;
    const y = startY + (endY - startY) * progress + waveY;

    let opacity = 0.82;
    if (t < 0.08) opacity = (t / 0.08) * 0.82;
    else if (t > 0.75) opacity = ((1 - t) / 0.25) * 0.82;

    petal.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${angle}rad)`;
    petal.style.opacity = opacity;
    angle += spinSpeed;

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      petal.remove();
      activePetals--;
    }
  }

  requestAnimationFrame(animate);
}

setInterval(spawnPetal, 500);
for (let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 180);

/* CLOCK */
function updateClock() {
  const now = new Date();
  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
                  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

  document.getElementById("day").textContent = days[now.getDay()];
  document.getElementById("date").textContent =
    `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;

  let h = now.getHours();
  let m = now.getMinutes();
  let ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;
  m = m < 10 ? "0" + m : m;

  document.getElementById("time").textContent = `${h}:${m} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock();