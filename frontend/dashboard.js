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
let activeModalNoteId = null;

let notes = JSON.parse(localStorage.getItem("inkspireNotes")) || [];
let tasks = JSON.parse(localStorage.getItem("inkspireTasks")) || [];

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

function saveNotes() {
    localStorage.setItem("inkspireNotes", JSON.stringify(notes));
}

function saveTasks() {
    localStorage.setItem("inkspireTasks", JSON.stringify(tasks));
}

notes = notes.map(function (note) {
    return {
        id: note.id || Date.now() + Math.random(),
        title: note.title || "Untitled Note",
        content: note.content || "",
        category: cleanCategory(note.category),
        color: note.color || "#fffaf4",
        favorite: note.favorite || false,
        pinned: note.pinned || false,
        date: note.date || formatDate()
    };
});

tasks = tasks.map(function (task) {
    return {
        id: task.id || Date.now() + Math.random(),
        text: task.text || "",
        reminder: task.reminder || "",
        completed: task.completed || false
    };
});

saveNotes();
saveTasks();

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

logoutBtn.addEventListener("click", function () {
    if (confirm("Logout from Inkspire?")) {
        window.location.href = "index.html";
    }
});

/* DARK MODE */

darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
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
            note.title + " " +
            note.content + " " +
            note.category + " " +
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
        preview.innerText = note.content.slice(0, 55) || cleanCategory(note.category);

        suggestion.appendChild(title);
        suggestion.appendChild(preview);

        suggestion.addEventListener("click", function () {
            searchSuggestions.style.display = "none";
            searchInput.value = "";
            openNoteModal(note.id);
        });

        searchSuggestions.appendChild(suggestion);
    });

    searchSuggestions.style.display = "block";
}

/* NOTES */

saveNoteBtn.addEventListener("click", function () {
    const titleText = noteTitle.value.trim();
    const contentText = noteInput.value.trim();

    if (titleText === "" && contentText === "") {
        return;
    }

    if (editingNoteId !== null) {
        const note = notes.find(function (item) {
            return item.id === editingNoteId;
        });

        if (note) {
            note.title = titleText === "" ? "Untitled Note" : titleText;
            note.content = contentText;
            note.category = cleanCategory(categoryFilter.value);
            note.color = selectedColor;
            note.date = formatDate();
        }

        editingNoteId = null;
        saveNoteBtn.innerText = "save";
    } else {
        notes.unshift({
            id: Date.now(),
            title: titleText === "" ? "Untitled Note" : titleText,
            content: contentText,
            category: cleanCategory(categoryFilter.value),
            color: selectedColor,
            favorite: false,
            pinned: false,
            date: formatDate()
        });
    }

    noteTitle.value = "";
    noteInput.value = "";
    categoryFilter.value = "Study";
    selectedColor = "#fffaf4";

    colorButtons.forEach(function (btn) {
        btn.classList.remove("active");
    });

    saveNotes();
    renderEverything();
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
        preview.innerText = note.content.slice(0, 45) || cleanCategory(note.category);

        item.appendChild(title);
        item.appendChild(preview);

        item.addEventListener("click", function () {
            closeSidebar();
            openNoteModal(note.id);
        });

        container.appendChild(item);
    });
}

/* MODAL */

function openNoteModal(noteId) {
    const note = notes.find(function (item) {
        return item.id === noteId;
    });

    if (!note) return;

    activeModalNoteId = note.id;

    modalHeartBtn.innerText = note.favorite ? "❤️" : "🤍";
    modalTitle.innerText = note.title;
    modalDate.innerText = note.date;
    modalCategory.innerText = getCategoryEmoji(cleanCategory(note.category)) + " " + cleanCategory(note.category);
    modalContent.innerText = note.content === "" ? "No content written." : note.content;
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

modalHeartBtn.addEventListener("click", function () {
    if (activeModalNoteId === null) return;

    const note = notes.find(function (item) {
        return item.id === activeModalNoteId;
    });

    if (!note) return;

    note.favorite = !note.favorite;

    saveNotes();
    renderEverything();
    openNoteModal(note.id);
});

modalPinBtn.addEventListener("click", function () {
    if (activeModalNoteId === null) return;

    const note = notes.find(function (item) {
        return item.id === activeModalNoteId;
    });

    if (!note) return;

    note.pinned = !note.pinned;

    saveNotes();
    renderEverything();
    openNoteModal(note.id);
});

modalEditBtn.addEventListener("click", function () {
    if (activeModalNoteId === null) return;

    const note = notes.find(function (item) {
        return item.id === activeModalNoteId;
    });

    if (!note) return;

    noteTitle.value = note.title === "Untitled Note" ? "" : note.title;
    noteInput.value = note.content;
    categoryFilter.value = cleanCategory(note.category);
    selectedColor = note.color;
    editingNoteId = note.id;
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
        block: "start"
    });
});

modalDeleteBtn.addEventListener("click", function () {
    if (activeModalNoteId === null) return;

    if (!confirm("Delete this note?")) return;

    notes = notes.filter(function (note) {
        return note.id !== activeModalNoteId;
    });

    saveNotes();
    closeModal();
    renderEverything();
});

/* TASKS */

addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text: taskText,
        reminder: taskTime.value,
        completed: false
    });

    taskInput.value = "";
    taskTime.value = "";

    saveTasks();
    renderEverything();
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

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderEverything();
        });

        editBtn.addEventListener("click", function () {
            taskInput.value = task.text;
            taskTime.value = task.reminder;

            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderEverything();
        });

        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderEverything();
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
    if (dateTimeValue === "") {
        return "No reminder";
    }

    const date = new Date(dateTimeValue);

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
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