import { getActiveTabURL } from "./utils.js";

const takeNote = (notes, note) => {
  const noteDescription = document.createElement("input");
  const noteTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newNoteElement = document.createElement("div");

  noteTitleElement.textContent = "New Note: ";
  noteTitleElement.className = "note-title";
  controlsElement.className = "note-controls";

  noteDescription.placeholder = "Add new note...";
  noteDescription.className = "note-description";
  noteDescription.id = "note-desc-" + ytUniqueId;

  setNoteAttributes("save", onSave, controlsElement);
  setNoteAttributes("cancel", onRemove, controlsElement);

  newNoteElement.id = "note-" + note.time;
  newNoteElement.className = "note";
  newNoteElement.setAttribute("timestamp", note.time);

  newNoteElement.appendChild(noteTitleElement);
  newNoteElement.appendChild(noteDescription);
  newNoteElement.appendChild(controlsElement);
  notes.appendChild(newNoteElement);
};

let allVideoNotes = [];
let ytUniqueId;
let noteGlobal;

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");
  ytUniqueId = currentVideo;

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    const btn = document.getElementById("btn");
    btn.addEventListener("click", displayNotes)
    chrome.storage.sync.get([currentVideo], (data) => {      
      const currentVideoNotes = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
      allVideoNotes = currentVideoNotes;
      viewNotes(currentVideoNotes); 
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      '<div class="title">This is not a youtube video page.</div>';
  }
});

const viewNotes = (currentNotes = []) => {
  const notesElement = document.getElementById("notes");
  notesElement.innerHTML = "";

  if (currentNotes.length > 0) {
    for (let i = 0; i < currentNotes.length; i++) {
      const note = currentNotes[i];
      noteGlobal = note;
      takeNote(notesElement, note);
    }
  } else {
    notesElement.innerHTML = '<i class="row">Take a new note</i>';
  }
  return;
};

let newNote;

const saveValue = () => {
    const input = document.getElementById("note-desc-" + ytUniqueId);
    const inputValue = input.value;
    newNote = inputValue;
    chrome.storage.local.get({ notes: [] }, function (result) {
      var notes = result.notes;
      notes.push({ inputKey: inputValue, videoId: ytUniqueId });
      chrome.storage.local.set({ notes: notes });
    });
};

const onSave= (e) => {
  const saveElement = e.target.id;
  const noteElement = document.getElementById(saveElement);
  noteElement.addEventListener("click", saveValue());
};

const onRemove = async (e) => {
  const activeTab = await getActiveTabURL();
  const noteTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const removeElement = document.getElementById("note-" + noteTime);

  allVideoNotes = allVideoNotes.filter((b) => b.time != noteTime);
  chrome.storage.sync.set({ [ytUniqueId]: JSON.stringify(allVideoNotes) });

  removeElement.remove();
};

const setNoteAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");
  controlElement.id = src;
  controlElement.className = src;

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;

  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

const displayNotes = (e) => {
  const container = document.getElementById("container");
  
  chrome.storage.local.get("notes").then((result) => {
    for (let i = 0; i < result.notes.length; i++) {
      if (result.notes[i].videoId == ytUniqueId) {

        const displayDiv = document.createElement("div");
        const deleteButton = document.createElement("img")

        deleteButton.src = "assets/delete.png"
        deleteButton.className = "delete-btn";
        displayDiv.className = "note-display";
        displayDiv.id = `note-${result.notes[i].inputKey}`
        deleteButton.textContent = "Delete";
        displayDiv.textContent = result.notes[i].inputKey;

        deleteButton.addEventListener("click", deleteNote);

        displayDiv.appendChild(deleteButton);
        container.appendChild(displayDiv);
      }
    }
  });
};

const deleteNote = (e) => {

  const display = e.target.parentNode.id;
  const displayText = display.slice(5);
  const displayId = document.getElementById(display);

  chrome.storage.local.get("notes").then((result) => {
    result.notes = result.notes.filter((note) => note.inputKey != displayText)
    console.log(result.notes);
    chrome.storage.local.set({ notes: result.notes });
  })

  displayId.remove();
}