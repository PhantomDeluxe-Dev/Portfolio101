// =============================
// WINDOW SYSTEM
// =============================

let zIndex = 60;

const icons = document.querySelectorAll(".icon");
const windows = document.querySelectorAll(".window");
const taskbarApps = document.getElementById("taskbar-apps");

icons.forEach(icon => {

  const windowId = icon.dataset.window;
  const win = document.getElementById(windowId);

  if (!win) return;

  icon.addEventListener("click", () => {

    win.classList.remove("hidden");
    
    // Apply window type from data-type attribute
    const type = icon.dataset.type || "app";
    applyWindowType(win, type);
    
    focusWindow(win);

    createTaskbarIcon(win, icon);

  });

});

function focusWindow(win) {

  zIndex++;
  win.style.zIndex = zIndex;

}

windows.forEach(win => {

  win.addEventListener("mousedown", () => {
    focusWindow(win);
  });

});

// Window state tracking
const windowState = {};


// =============================
// WINDOW CONTROLS
// =============================

/* MINIMIZE */

document.querySelectorAll(".min-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    const win = btn.closest(".window");
    const id = win.id;

    const icon = document.querySelector(`[data-task="${id}"]`);

    if (!icon) return;

    const iconRect = icon.getBoundingClientRect();
    const winRect = win.getBoundingClientRect();

    const dx = iconRect.left - winRect.left;
    const dy = iconRect.top - winRect.top;

    win.classList.add("minimizing");

    win.style.transform = `translate(${dx}px,${dy}px) scale(0.1)`;
    win.style.opacity = "0";

    setTimeout(() => {

      win.classList.add("hidden");

      win.classList.remove("minimizing");

      win.style.transform = "";
      win.style.opacity = "";

      windowState[id] = "minimized";

    }, 350);

  });

});


/* MAXIMIZE */

document.querySelectorAll(".max-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    const win = btn.closest(".window");

    if (win.classList.contains("maximized")) {

      win.classList.remove("maximized");

      win.style.width = win.dataset.w;
      win.style.height = win.dataset.h;
      win.style.left = win.dataset.x;
      win.style.top = win.dataset.y;

    } else {

      win.dataset.w = win.style.width;
      win.dataset.h = win.style.height;
      win.dataset.x = win.style.left;
      win.dataset.y = win.style.top;

      win.style.left = "0";
      win.style.top = "0";
      win.style.width = "100vw";
      win.style.height = "calc(100vh - 50px)";

      win.classList.add("maximized");

    }

  });

});


/* CLOSE */

document.querySelectorAll(".close-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    const win = btn.closest(".window");
    const id = win.id;

    win.classList.add("hidden");

    const icon = document.querySelector(`[data-task="${id}"]`);

    if (icon) icon.remove();

    delete windowState[id];

  });

});


// =============================
// TASKBAR ICON SYSTEM
// =============================

function createTaskbarIcon(win, icon) {

  if (document.querySelector(`[data-task="${win.id}"]`)) return;

  const img = icon.querySelector("img").src;

  const app = document.createElement("img");

  app.src = img;
  app.className = "taskbar-app active";
  app.dataset.task = win.id;

  app.onclick = () => {

    if (win.classList.contains("hidden")) {

      win.classList.remove("hidden");
      focusWindow(win);

    } else {

      win.classList.add("hidden");

    }

  };

  taskbarApps.appendChild(app);

}

function removeTaskbarIcon(id) {

  const app = document.querySelector(`[data-task="${id}"]`);

  if (app) app.remove();

}


// =============================
// DRAG WINDOWS
// =============================

windows.forEach(win => {

  const header = win.querySelector(".window-header");

  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  header.addEventListener("mousedown", (e) => {

    dragging = true;

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

  });

  document.addEventListener("mousemove", (e) => {

    if (!dragging) return;

    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";

  });

  document.addEventListener("mouseup", () => {

    dragging = false;

  });

});


// =============================
// START MENU
// =============================

const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");

startButton.addEventListener("click", (e) => {

  e.stopPropagation();

  startMenu.classList.toggle("open");

});

startMenu.addEventListener("click", (e) => {

  e.stopPropagation();

});

document.addEventListener("click", () => {

  startMenu.classList.remove("open");

});


// =============================
// CLOCK
// =============================

function updateClock() {

  const now = new Date();

  const days = [
    "SUNDAY","MONDAY","TUESDAY",
    "WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"
  ];

  const months = [
    "JANUARY","FEBRUARY","MARCH","APRIL",
    "MAY","JUNE","JULY","AUGUST",
    "SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
  ];

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


// =============================
// SEARCH BAR
// =============================

const wrapper = document.querySelector(".input-wrapper");
const searchIcon = document.querySelector(".search-icon");

if (searchIcon) {

  searchIcon.addEventListener("click", () => {

    wrapper.classList.toggle("active");

  });

}


// =============================
// TERMINAL
// =============================

const cmdInput = document.getElementById("cmd-input");
const cmdOutput = document.getElementById("cmd-output");

function print(text) {
  if (!cmdOutput) return;

  const line = document.createElement("div");
  line.textContent = text;

  cmdOutput.appendChild(line);

  cmdOutput.scrollTop = cmdOutput.scrollHeight;

}

function handleCommand(cmd) {

  const c = cmd.toLowerCase().trim();

  switch (c) {

    case "help":

      print("Available commands:");
      print("  help                    - Show this help message");
      print("  about creator           - About the developer");
      print("  about this project      - About Samurai OS");
      print("  date                    - Show current date");
      print("  time                    - Show current time");
      print("  open github             - Open GitHub in new tab");
      print("  open portfolio          - Open portfolio in new tab");
      print("  clear                   - Clear the terminal");

      break;

    case "about this project":

      print("Samurai OS Terminal");
      print("Built by Andrew");
      print("A fun project to learn JavaScript and create a cool terminal experience!");
      print("Inspired by classic OS and Windows terminals.");

      break;

    case "about creator":

      print("Andrew is a passionate developer and designer.");
      print("Loves creating fun projects and learning new technologies.");
      print("Check out my portfolio for more cool stuff!");

      break;

    case "date":

      print(new Date().toLocaleDateString());

      break;

    case "time":

      print(new Date().toLocaleTimeString());

      break;

    case "open github":

      window.open("https://github.com/andrew-fernando-15", "_blank");
      print("Opening GitHub...");

      break;

    case "open portfolio":

      const portfolioWindow = document.getElementById("portfolio-window");
      if (portfolioWindow) {
        portfolioWindow.classList.remove("hidden");
        applyWindowType(portfolioWindow, "social");
        focusWindow(portfolioWindow);
        const portfolioIcon = document.querySelector('[data-window="portfolio-window"]');
        if (portfolioIcon) {
          createTaskbarIcon(portfolioWindow, portfolioIcon);
        }
      }
      print("Opening portfolio...");

      break;

    case "clear":

      cmdOutput.innerHTML = "";

      break;

    case "help me":

      break;

    default:

      print("Command not found. Type 'help' for available commands.");

  }

}

if (cmdInput) {

  cmdInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

      const command = this.value.trim();

      if (command === "") return;

      const space = document.createElement("div");
      space.innerHTML = "&nbsp;";
      cmdOutput.appendChild(space);

      const cmdLine = document.createElement("div");
      cmdLine.innerHTML = "<span style='color:#0f0'>C:\\></span> " + command;
      cmdOutput.appendChild(cmdLine);

      handleCommand(command);

      this.value = "";

    }

  });

}

if (cmdOutput) {

  print("Samurai OS Terminal");
  print("Type 'help'");

}

// =============================
// TOUCH DRAG SUPPORT
// =============================

windows.forEach(win=>{

let offsetX=0;
let offsetY=0;
let dragging=false;

win.addEventListener("touchstart",(e)=>{

dragging=true;

offsetX=e.touches[0].clientX-win.offsetLeft;
offsetY=e.touches[0].clientY-win.offsetTop;

});

document.addEventListener("touchmove",(e)=>{

if(!dragging) return;

win.style.left=e.touches[0].clientX-offsetX+"px";
win.style.top=e.touches[0].clientY-offsetY+"px";

});

document.addEventListener("touchend",()=>{

dragging=false;

});

});

// =============================
// WALLPAPER ROTATION
// =============================

const wallpapers = [
"../assets/images/img-1.jpg",
"../assets/images/img-2.jpg",
"../assets/images/img-3.jpg",
"../assets/images/img-4.jpg",
"../assets/images/img-5.jpg"
];

let wallpaperIndex = 0;

function changeWallpaper(){

const desktop = document.querySelector(".desktop");

wallpaperIndex++;

if(wallpaperIndex >= wallpapers.length){
wallpaperIndex = 0;
}

desktop.style.backgroundImage =
`url('${wallpapers[wallpaperIndex]}')`;

}

setInterval(changeWallpaper,300000); // Change wallpaper every 30 seconds

// =============================
// DESKTOP CONTEXT MENU
// =============================

const desktop = document.querySelector(".desktop");
const menu = document.getElementById("desktop-menu");

if(desktop && menu){

desktop.addEventListener("contextmenu",(e)=>{

e.preventDefault();

menu.style.display="block";
menu.style.left=e.pageX+"px";
menu.style.top=e.pageY+"px";

});

document.addEventListener("click",()=>{

menu.style.display="none";

});

}

// =============================
// ABOUT SAMURAI OS
// =============================

function openAbout(){

const win=document.getElementById("about-window");

if(!win) return;

win.classList.remove("hidden");

focusWindow(win);

createTaskbarIcon(win,{
querySelector:()=>({src:"icons/about.png"})
});

}

// =============================
// WINDOW SIZE TYPES
// =============================

function applyWindowType(win, type) {
  if (type === "social") {
    win.classList.add("window-social");
    win.classList.remove("window-app");
  } else if (type === "app") {
    win.classList.add("window-app");
    win.classList.remove("window-social");
  }
}

// =============================
// FILE EXPLORER
// =============================

const fileSystemData = {
  "Desktop": { type: "location", items: ["Screenshot.png", "Project Folder"] },
  "Downloads": { type: "location", items: ["Document.pdf", "Image.jpg", "Archive.zip"] },
  "Documents": { type: "location", items: ["Resume.pdf", "Cover Letter.docx", "Notes.txt"] },
  "Pictures": { type: "location", items: ["Wallpaper1.png", "Wallpaper2.png", "Logo.png"] },
  "Music": { type: "location", items: ["Song1.mp3", "Song2.mp3", "Playlist"] },
  "Videos": { type: "location", items: ["Movie.mp4", "Tutorial.mp4"] },
  "ThisPC": { type: "location", items: ["Desktop", "Documents", "Downloads", "Music", "Pictures", "Videos"] },
  "Network": { type: "location", items: [] }
};

let currentFolder = null;
let currentLocation = "ThisPC";
let navigationHistory = [];

function updateBackButton() {
  const backBtn = document.getElementById("explorer-back");
  if (backBtn) {
    backBtn.disabled = navigationHistory.length === 0;
    backBtn.style.opacity = navigationHistory.length === 0 ? "0.5" : "1";
    backBtn.style.cursor = navigationHistory.length === 0 ? "not-allowed" : "pointer";
  }
}

function updateExplorerPath() {
  const breadcrumb = document.getElementById("explorer-breadcrumb");
  if (breadcrumb) {
    if (currentFolder) {
      breadcrumb.textContent = `This PC > ${currentLocation} > ${currentFolder}`;
    } else {
      breadcrumb.textContent = `This PC > ${currentLocation}`;
    }
  }
}

function openFolder(folderName) {
  const container = document.getElementById("file-system");
  
  if (!container) return;
  
  if (!fileSystemData[folderName]) return;
  
  // Save current state to history before navigating
  navigationHistory.push({
    location: currentLocation,
    folder: currentFolder
  });
  updateBackButton();
  
  const folder = fileSystemData[folderName];
  
  container.innerHTML = "";
  currentFolder = folderName;
  updateExplorerPath();
  
  folder.items.forEach(item => {
    const div = document.createElement("div");
    const isFolder = !item.includes(".") || item === "Playlist" || item === "Project Folder";
    
    div.className = isFolder ? "explorer-folder" : "explorer-file";
    div.innerHTML = `
      <div class="explorer-icon">${isFolder ? "📁" : "📄"}</div>
      <div class="explorer-name">${item}</div>
    `;
    div.style.cursor = "pointer";
    div.addEventListener("click", () => {
      if (isFolder) {
        openFolder(item);
      } else {
        alert(`Opening: ${item}`);
      }
    });
    container.appendChild(div);
  });
}

function navigateToLocation(location) {
  const container = document.getElementById("file-system");
  const sidebar = document.querySelectorAll(".sidebar-item");
  
  if (!container) return;
  
  // Only save to history if we're actually changing location/folder
  if (currentLocation !== location || currentFolder !== null) {
    navigationHistory.push({
      location: currentLocation,
      folder: currentFolder
    });
  }
  updateBackButton();
  
  // Update active sidebar item
  sidebar.forEach(item => {
    item.classList.remove("active");
    if (item.dataset.nav === location) {
      item.classList.add("active");
    }
  });
  
  currentLocation = location;
  currentFolder = null;
  
  container.innerHTML = "";
  updateExplorerPath();
  
  if (!fileSystemData[location]) return;
  
  const locationData = fileSystemData[location];
  
  locationData.items.forEach(itemName => {
    const div = document.createElement("div");
    div.className = "explorer-folder";
    div.innerHTML = `
      <div class="explorer-icon">📁</div>
      <div class="explorer-name">${itemName}</div>
    `;
    div.style.cursor = "pointer";
    div.addEventListener("click", () => {
      openFolder(itemName);
    });
    container.appendChild(div);
  });
}

function goBack() {
  if (navigationHistory.length === 0) return;
  
  const previous = navigationHistory.pop();
  updateBackButton();
  
  // Restore previous state without adding to history again
  currentLocation = previous.location;
  currentFolder = previous.folder;
  
  const container = document.getElementById("file-system");
  const sidebar = document.querySelectorAll(".sidebar-item");
  
  if (!container) return;
  
  // Update active sidebar item
  sidebar.forEach(item => {
    item.classList.remove("active");
    if (item.dataset.nav === currentLocation) {
      item.classList.add("active");
    }
  });
  
  container.innerHTML = "";
  updateExplorerPath();
  
  // If we were in a folder, show its contents
  if (currentFolder) {
    const folder = fileSystemData[currentFolder];
    if (folder) {
      folder.items.forEach(item => {
        const div = document.createElement("div");
        const isFolder = !item.includes(".") || item === "Playlist" || item === "Project Folder";
        
        div.className = isFolder ? "explorer-folder" : "explorer-file";
        div.innerHTML = `
          <div class="explorer-icon">${isFolder ? "📁" : "📄"}</div>
          <div class="explorer-name">${item}</div>
        `;
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
          if (isFolder) {
            openFolder(item);
          } else {
            alert(`Opening: ${item}`);
          }
        });
        container.appendChild(div);
      });
    }
  } else {
    // Show the location's folders
    const locationData = fileSystemData[currentLocation];
    if (locationData) {
      locationData.items.forEach(itemName => {
        const div = document.createElement("div");
        div.className = "explorer-folder";
        div.innerHTML = `
          <div class="explorer-icon">📁</div>
          <div class="explorer-name">${itemName}</div>
        `;
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
          openFolder(itemName);
        });
        container.appendChild(div);
      });
    }
  }
}

// Back button handler
const backBtn = document.getElementById("explorer-back");
if (backBtn) {
  backBtn.addEventListener("click", goBack);
}

// Sidebar navigation
const sidebarItems = document.querySelectorAll(".sidebar-item");
sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    const location = item.dataset.nav;
    navigateToLocation(location);
  });
});

// Toolbar buttons (placeholder functionality)
const newBtn = document.getElementById("explorer-new");
const sortBtn = document.getElementById("explorer-sort");
const viewBtn = document.getElementById("explorer-view");

if (newBtn) {
  newBtn.addEventListener("click", () => {
    alert("New Folder/File functionality coming soon");
  });
}

if (sortBtn) {
  sortBtn.addEventListener("click", () => {
    alert("Sort options coming soon");
  });
}

if (viewBtn) {
  viewBtn.addEventListener("click", () => {
    alert("View options coming soon");
  });
}

// Initialize file explorer with This PC
const explorerWindow = document.getElementById("explorer-window");
if (explorerWindow) {
  const fileSystemContainer = document.getElementById("file-system");
  if (fileSystemContainer && fileSystemContainer.children.length === 0) {
    navigateToLocation("ThisPC");
    updateBackButton();
  }
}


// =============================
// CLICK TO GROW FLOWER
// =============================

let flowerClicks = 0;
const flowerStages = ["🌱", "🌿", "🌱", "🌾", "🌻"];

const flowerBtn = document.getElementById("flower-btn");
const flowerDisplay = document.getElementById("flower-display");
const flowerCount = document.getElementById("flower-count");

if (flowerBtn) {
  flowerBtn.addEventListener("click", () => {
    flowerClicks++;
    
    if (flowerDisplay) {
      const stageIndex = Math.min(flowerClicks, flowerStages.length - 1);
      flowerDisplay.textContent = flowerStages[stageIndex];
      flowerDisplay.style.transform = `scale(${1 + (flowerClicks * 0.05)})`;
      flowerDisplay.style.transition = "transform .3s ease";
    }
    
    if (flowerCount) {
      flowerCount.textContent = `Clicks: ${flowerClicks}`;
    }
  });
}

// =============================
// START MENU APP LAUNCH
// =============================

const startMenuIcons = document.querySelectorAll(".start-grid .icon");

startMenuIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const windowId = icon.dataset.window;
    const type = icon.dataset.type || "app";
    const win = document.getElementById(windowId);
    
    if (!win) return;
    
    win.classList.remove("hidden");
    applyWindowType(win, type);
    focusWindow(win);
    
    const iconElement = document.querySelector(`[data-window="${windowId}"]`);
    if (iconElement) {
      createTaskbarIcon(win, iconElement);
    }
    
    startMenu.classList.remove("open");
  });
});

// =============================
// LINKEDIN PROFILE INTERACTIONS
// =============================

const linkedInConnectBtn = document.getElementById("linkedin-connect");
const linkedInMessageBtn = document.getElementById("linkedin-message");
const linkedInPortfolioBtn = document.getElementById("linkedin-portfolio");

if (linkedInConnectBtn) {
  linkedInConnectBtn.addEventListener("click", () => {
    alert("Connection request sent! Andrew will review your request soon.");
  });
}

if (linkedInMessageBtn) {
  linkedInMessageBtn.addEventListener("click", () => {
    alert("📧 Send a message to andrewafdo@gmail.com")
  });
}

if (linkedInPortfolioBtn) {
  linkedInPortfolioBtn.addEventListener("click", () => {
    const portfolioWindow = document.getElementById("portfolio-window");
    if (portfolioWindow) {
      portfolioWindow.classList.remove("hidden");
      applyWindowType(portfolioWindow, "social");
      focusWindow(portfolioWindow);
      
      const portfolioIcon = document.querySelector('[data-window="portfolio-window"]');
      if (portfolioIcon) {
        createTaskbarIcon(portfolioWindow, portfolioIcon);
      }
    }
  });
}


// =============================
// INSTAGRAM PROFILE BUTTONS
// =============================

const instagramViewWorkBtn = document.getElementById("instagram-view-work");
const instagramMessageBtn = document.getElementById("instagram-message");
const instagramOpenBtn = document.getElementById("instagram-open");

if (instagramViewWorkBtn) {
  instagramViewWorkBtn.addEventListener("click", () => {
    const portfolioWin = document.getElementById("portfolio-window");
    if (portfolioWin) {
      portfolioWin.classList.remove("hidden");
      applyWindowType(portfolioWin, "social");
      focusWindow(portfolioWin);
      createTaskbarIcon(portfolioWin, document.querySelector('[data-window="portfolio-window"]'));
    }
  });
}

if (instagramMessageBtn) {
  instagramMessageBtn.addEventListener("click", () => {
    alert("📧 Send a message to andrewafdo@gmail.com");
  });
}

if (instagramOpenBtn) {
  instagramOpenBtn.addEventListener("click", () => {
    window.open("https://instagram.com/andrew__263739", "_blank");
  });
}


// =============================
// GITHUB PROFILE BUTTONS
// =============================

const githubViewProjectsBtn = document.getElementById("github-view-projects");
const githubMessageBtn = document.getElementById("github-message");
const githubOpenBtn = document.getElementById("github-open");

if (githubViewProjectsBtn) {
  githubViewProjectsBtn.addEventListener("click", () => {
    const portfolioWindow = document.getElementById("portfolio-window");
    if (portfolioWindow) {
      portfolioWindow.classList.remove("hidden");
      applyWindowType(portfolioWindow, "social");
      focusWindow(portfolioWindow);
      
      const portfolioIcon = document.querySelector('[data-window="portfolio-window"]');
      if (portfolioIcon) {
        createTaskbarIcon(portfolioWindow, portfolioIcon);
      }
    }
  });
}

if (githubMessageBtn) {
  githubMessageBtn.addEventListener("click", () => {
    alert("📧 Send a message to andrewafdo@gmail.com");
  });
}

if (githubOpenBtn) {
  githubOpenBtn.addEventListener("click", () => {
    window.open("https://github.com/andrew-fernando-15", "_blank");
  });
}


// =============================
// PORTFOLIO PROJECT CARDS
// =============================

const projectCards = document.querySelectorAll(".project-card");

// Category tab filtering
const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

projectCards.forEach(card => {
  const expandedView = card.querySelector(".project-expanded");
  const briefView = card.querySelector(".project-brief");
  
  card.addEventListener("click", () => {
    const isExpanded = expandedView.style.display !== "none";
    
    if (isExpanded) {
      // Collapse
      expandedView.style.display = "none";
      briefView.style.display = "flex";
    } else {
      // Expand
      briefView.style.display = "none";
      expandedView.style.display = "flex";
    }
  });
});

// =============================
// FLIP CARD ANIMATION
// =============================
function flipCard() {
  const card = document.getElementById("aboutCard");
  if (card) {
    card.classList.toggle("flipped");
  }
}
const aboutWindow = document.getElementById("about-window");
if (aboutWindow) {
  // Disable maximize button
  const maxBtn = aboutWindow.querySelector(".max-btn");
  if (maxBtn) maxBtn.style.display = "none";
}

// =============================
// GAMES
// =============================

const gameIcons = {
  "tetris-window":  "../assets/icons/tetris.jfif",
  "snake-window":   "../assets/icons/snake.jpg",
  "connect4-window":"../assets/icons/connect4.jfif",
  "wordattack-window":"../assets/icons/word.png"
};

function openGameWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;
  win.classList.remove("hidden");
  applyWindowType(win, "app");
  focusWindow(win);

  if (!document.querySelector(`[data-task="${windowId}"]`)) {
    const app = document.createElement("img");
    app.src = gameIcons[windowId];
    app.className = "taskbar-app active";
    app.dataset.task = windowId;

    app.onclick = () => {
      if (win.classList.contains("hidden")) {
        win.classList.remove("hidden");
        focusWindow(win);
      } else {
        win.classList.add("hidden");
      }
    };

    taskbarApps.appendChild(app);
  }
}

document.getElementById("launch-tetris")?.addEventListener("click", () => openGameWindow("tetris-window"));
document.getElementById("launch-snake")?.addEventListener("click", () => openGameWindow("snake-window"));
document.getElementById("launch-connect4")?.addEventListener("click", () => openGameWindow("connect4-window"));
document.getElementById("launch-wordattack")?.addEventListener("click", () => openGameWindow("wordattack-window"));