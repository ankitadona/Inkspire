async function checkUserAuthentication() {
  try {
    const res = await fetch(`${API_URL}/api/auth/user`, {
      credentials: "include",
    });

    if (!res.ok) {
      window.location.replace("index.html");
      return;
    }

    document.getElementById("loading").style.display = "none";
    document.getElementsByClassName("dashboard")[0].style.display = "block";

    const user = await res.json();

    const userNameElement = document.getElementById("userName");
    if (userNameElement) {
      userNameElement.innerText = "Welcome, " + user.name;
    }
  } catch (err) {
    window.location.replace("index.html");
  }
}
checkUserAuthentication();



async function loadNotes() {
  try {
    const res = await fetch(`${API_URL}/api/notes`, {
      credentials: "include",
    });

    console.log("Status:", res.status);

    const data = await res.json();


    notes = data;

    renderEverything();

  } catch (err) {
    console.log(err);
  }
}

loadNotes();


async function loadTasks() {

  try {

    const res = await fetch(`${API_URL}/api/tasks`, {
      credentials: "include"
    });

    tasks = await res.json();

    renderEverything();

  } catch (err) {
    console.log(err);
  }

}

loadTasks();


const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const logoutBtn = document.getElementById("logoutBtn");

const allMenuBtn = document.getElementById("allMenuBtn");
const favMenuBtn = document.getElementById("favMenuBtn");
const pinMenuBtn = document.getElementById("pinMenuBtn");

const allNotesMenu = document.getElementById("allNotesMenu");
const favNotesMenu = document.getElementById("favNotesMenu");
const pinNotesMenu = document.getElementById("pinNotesMenu");

const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

const categoryFilter = document.getElementById("categoryFilter");
const noteTitle = document.getElementById("noteTitle");
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const notesEditor = document.getElementById("notesEditor");

const totalNotesCount = document.getElementById("totalNotesCount");
const totalTasksCount = document.getElementById("totalTasksCount");
const favoriteCount = document.getElementById("favoriteCount");
const pinnedCount = document.getElementById("pinnedCount");

const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");

const darkModeBtn = document.getElementById("darkModeBtn");
const modeLabel = document.querySelector(".mode-label");
const modeIcon = document.querySelector(".mode-icon");

const colorButtons = document.querySelectorAll(".color-btn");

const noteModal = document.getElementById("noteModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalHeartBtn = document.getElementById("modalHeartBtn");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalCategory = document.getElementById("modalCategory");
const modalContent = document.getElementById("modalContent");
const modalPinBtn = document.getElementById("modalPinBtn");
const modalEditBtn = document.getElementById("modalEditBtn");
const modalDeleteBtn = document.getElementById("modalDeleteBtn");

let selectedColor = "#fffaf4";
let editingNoteId = null;
let editingTaskId = null;
let activeModalNoteId = null;

let notes = [];
let tasks = [];



function cleanCategory(category) {
  if (!category) return "Study";

  if (category.includes("Study")) return "Study";
  if (category.includes("Personal")) return "Personal";
  if (category.includes("Work")) return "Work";
  if (category.includes("Ideas")) return "Ideas";

  return "Study";
}

function getCategoryEmoji(category) {
  if (category === "Study") return "📚";
  if (category === "Personal") return "🏠";
  if (category === "Work") return "💼";
  if (category === "Ideas") return "💡";
  return "🏷️";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN");
}






/* SIDEBAR */

menuBtn.addEventListener("click", function () {
  sidebar.classList.add("show-sidebar");
  overlay.classList.add("show-overlay");
});

overlay.addEventListener("click", function () {
  closeSidebar();
  closeModal();
});

function closeSidebar() {
  sidebar.classList.remove("show-sidebar");
  overlay.classList.remove("show-overlay");
}

allMenuBtn.addEventListener("click", function () {
  allNotesMenu.classList.toggle("show-menu-list");
});

favMenuBtn.addEventListener("click", function () {
  favNotesMenu.classList.toggle("show-menu-list");
});

pinMenuBtn.addEventListener("click", function () {
  pinNotesMenu.classList.toggle("show-menu-list");
});

logoutBtn.addEventListener("click", async function () {
  if (confirm("Logout from Inkspire?")) {
    const res = await fetch(`${API_URL}api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    alert(data.message);
    window.location.replace("index.html");
  }
});

/* DARK MODE */

function applyTheme() {
  const isDark = localStorage.getItem("darkMode") === "true";

  if (isDark) {
    document.body.classList.add("dark-mode");
    modeLabel.innerText = "NIGHT MODE";
    modeIcon.innerText = "🌙";
  } else {
    document.body.classList.remove("dark-mode");
    modeLabel.innerText = "DAY MODE";
    modeIcon.innerText = "☀️";
  }
}

// Apply theme immediately when page loads
applyTheme();

darkModeBtn.addEventListener("click", function () {
  const isDark = document.body.classList.toggle("dark-mode");

  localStorage.setItem("darkMode", isDark);

  if (isDark) {
    modeLabel.innerText = "NIGHT MODE";
    modeIcon.innerText = "🌙";
  } else {
    modeLabel.innerText = "DAY MODE";
    modeIcon.innerText = "☀️";
  }
});

/* COLORS */

colorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    colorButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    selectedColor = button.dataset.color;
  });
});

/* STATS */

function updateStats() {
  totalNotesCount.innerText = notes.length;
  totalTasksCount.innerText = tasks.length;
  favoriteCount.innerText = notes.filter(function (note) {
    return note.favorite;
  }).length;
  pinnedCount.innerText = notes.filter(function (note) {
    return note.pinned;
  }).length;
}

/* SEARCH */

searchInput.addEventListener("input", function () {
  renderSearchSuggestions();
});

function renderSearchSuggestions() {
  searchSuggestions.innerHTML = "";

  const searchText = searchInput.value.trim().toLowerCase();

  if (searchText === "") {
    searchSuggestions.style.display = "none";
    return;
  }

  const matchedNotes = notes.filter(function (note) {
    const text = (
      note.title +
      " " +
      note.content +
      " " +
      note.category +
      " " +
      note.date
    ).toLowerCase();

    return text.includes(searchText);
  });

  if (matchedNotes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "suggestion-empty";
    empty.innerText = "No notes found";
    searchSuggestions.appendChild(empty);
    searchSuggestions.style.display = "block";
    return;
  }

  matchedNotes.forEach(function (note) {
    const suggestion = document.createElement("button");
    suggestion.className = "suggestion-item";

    const title = document.createElement("strong");
    title.innerText = note.title;

    const preview = document.createElement("small");
    preview.innerText =
      note.content.slice(0, 55) || cleanCategory(note.category);

    suggestion.appendChild(title);
    suggestion.appendChild(preview);

    suggestion.addEventListener("click", function () {
      searchSuggestions.style.display = "none";
      searchInput.value = "";
      openNoteModal(note._id);
    });

    searchSuggestions.appendChild(suggestion);
  });

  searchSuggestions.style.display = "block";
}

/* NOTES */

saveNoteBtn.addEventListener("click", async function () {
  const titleText = noteTitle.value.trim();
  const contentText = noteInput.value.trim();

  if (titleText === "" || contentText === "") {
    return;
  }

  if (editingNoteId !== null) {
    await fetch(`${API_URL}/api/notes/${editingNoteId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleText === "" ? "Untitled Note" : titleText,
        content: contentText,
        category: cleanCategory(categoryFilter.value),
        color: selectedColor,
      }),
    });

    editingNoteId = null;
    saveNoteBtn.innerText = "save";

    await loadNotes();
  } else {
    const res = await fetch(`${API_URL}/api/notes`, {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: titleText === "" ? "Untitled Note" : titleText,
        content: contentText,
        category: cleanCategory(categoryFilter.value),
        color: selectedColor,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }
  }

  noteTitle.value = "";
  noteInput.value = "";
  categoryFilter.value = "Study";
  selectedColor = "#fffaf4";

  colorButtons.forEach(function (btn) {
    btn.classList.remove("active");
  });

  await loadNotes();
});
function renderSidebarLists() {

  allNotesMenu.innerHTML = "";
  favNotesMenu.innerHTML = "";
  pinNotesMenu.innerHTML = "";

  renderMenuList(allNotesMenu, notes, "No notes yet");

  const favouriteNotes = notes.filter(function (note) {
    return note.favorite;
  });

  const pinnedNotes = notes.filter(function (note) {
    return note.pinned;
  });

  renderMenuList(favNotesMenu, favouriteNotes, "No favourite notes yet");
  renderMenuList(pinNotesMenu, pinnedNotes, "No pinned notes yet");
}

function renderMenuList(container, noteList, emptyText) {
  if (noteList.length === 0) {
    const empty = document.createElement("p");
    empty.className = "menu-empty";
    empty.innerText = emptyText;
    container.appendChild(empty);
    return;
  }

  noteList.forEach(function (note) {
    const item = document.createElement("button");
    item.className = "menu-note-item";

    const title = document.createElement("strong");
    title.innerText = note.title;

    const preview = document.createElement("small");
    preview.innerText =
      note.content.slice(0, 45) || cleanCategory(note.category);

    item.appendChild(title);
    item.appendChild(preview);

    item.addEventListener("click", function () {
      closeSidebar();
      openNoteModal(note._id);
    });

    container.appendChild(item);
  });
}

/* MODAL */

function openNoteModal(noteId) {
  const note = notes.find(function (item) {
    return item._id === noteId;
  });

  if (!note) return;

  activeModalNoteId = note._id;

  modalHeartBtn.innerText = note.favorite ? "❤️" : "🤍";
  modalTitle.innerText = note.title;
  modalDate.innerText = new Date(note.createdAt).toLocaleDateString("en-IN");
  modalCategory.innerText =
    getCategoryEmoji(cleanCategory(note.category)) +
    " " +
    cleanCategory(note.category);
  modalContent.innerText =
    note.content === "" ? "No content written." : note.content;
  modalPinBtn.innerText = note.pinned ? "Unpin" : "Pin";

  document.querySelector(".modal-card").style.background = note.color;
  noteModal.classList.add("show-modal");
  overlay.classList.add("show-overlay");
}

function closeModal() {
  noteModal.classList.remove("show-modal");
  activeModalNoteId = null;

  if (!sidebar.classList.contains("show-sidebar")) {
    overlay.classList.remove("show-overlay");
  }
}

closeModalBtn.addEventListener("click", function () {
  closeModal();
});

modalHeartBtn.addEventListener("click", async function () {
  if (activeModalNoteId === null) return;

  const note = notes.find(function (item) {
    return item._id === activeModalNoteId;
  });

  if (!note) return;

  await fetch(
    `${API_URL}/api/notes/${note._id}`,

    {
      method: "PUT",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        favorite: !note.favorite,
      }),
    },
  );

  await loadNotes();

  openNoteModal(note._id);
});

modalPinBtn.addEventListener("click", async function () {
  if (activeModalNoteId === null) return;

  const note = notes.find(function (item) {
    return item._id === activeModalNoteId;
  });

  if (!note) return;

  await fetch(`${API_URL}/api/notes/${note._id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinned: !note.pinned,
    }),
  });

  await loadNotes();

  openNoteModal(note._id);
});

modalEditBtn.addEventListener("click", function () {
  if (activeModalNoteId === null) return;

  const note = notes.find(function (item) {
    return item._id === activeModalNoteId;
  });

  if (!note) return;

  noteTitle.value = note.title === "Untitled Note" ? "" : note.title;
  noteInput.value = note.content;
  categoryFilter.value = cleanCategory(note.category);
  selectedColor = note.color;
  editingNoteId = note._id;
  saveNoteBtn.innerText = "update";

  colorButtons.forEach(function (btn) {
    btn.classList.remove("active");

    if (btn.dataset.color === selectedColor) {
      btn.classList.add("active");
    }
  });

  closeModal();

  notesEditor.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

modalDeleteBtn.addEventListener("click", async function () {
  if (activeModalNoteId === null) return;

  if (!confirm("Delete this note?")) return;

  await fetch(
    `${API_URL}/api/notes/${activeModalNoteId}`,

    {
      method: "DELETE",

      credentials: "include",
    },
  );

  await loadNotes();
  closeModal();

});

/* TASKS */

addTaskBtn.addEventListener("click", async function () {

  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  if (editingTaskId) {

    // UPDATE EXISTING TASK
    await fetch(`${API_URL}/api/tasks/${editingTaskId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: taskText,
        reminder: taskTime.value
      })
    });

    editingTaskId = null;
    addTaskBtn.innerText = "Add Task";

  } else {

    // CREATE NEW TASK
    await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: taskText,
        reminder: taskTime.value
      })
    });

  }

  taskInput.value = "";
  taskTime.value = "";

  await loadTasks();

});

function renderTasks() {
  taskContainer.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.innerText = "No tasks yet";
    taskContainer.appendChild(empty);
    return;
  }

  tasks.forEach(function (task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "saved-note task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskLabel = document.createElement("span");
    taskLabel.innerText = task.text;

    if (task.completed) {
      taskLabel.style.textDecoration = "line-through";
      taskLabel.style.opacity = "0.6";
    }

    const reminder = document.createElement("small");
    reminder.innerText = "Reminder: " + formatReminder(task.reminder);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";

    checkbox.addEventListener("change", async function () {
      await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: checkbox.checked
        })
      });

      await loadTasks();
    });

    editBtn.addEventListener("click", function () {

      taskInput.value = task.text;
      taskTime.value = task.reminder
        ? new Date(task.reminder).toISOString().slice(0, 16)
        : "";

      editingTaskId = task._id;

      addTaskBtn.innerText = "Update Task";
    });

    deleteBtn.addEventListener("click", async function () {

      await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: "DELETE",
        credentials: "include"
      });

      await loadTasks();

    });

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskLabel);
    taskDiv.appendChild(document.createElement("br"));
    taskDiv.appendChild(reminder);
    taskDiv.appendChild(document.createElement("br"));
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(deleteBtn);

    taskContainer.appendChild(taskDiv);
  });
}

function formatReminder(dateTimeValue) {
  if (!dateTimeValue) {
    return "No reminder";
  }
  const date = new Date(dateTimeValue);

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* FINAL RENDER */

function renderEverything() {
  updateStats();
  renderSidebarLists();
  renderSearchSuggestions();
  renderTasks();
}

renderEverything();
