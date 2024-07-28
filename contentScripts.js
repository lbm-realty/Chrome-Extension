(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoNotes = [];

  const fetchNotes = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  const addNewNoteEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newNote = {
      time: currentTime,
      desc: "Note at " + getTime(currentTime),
    };

    currentVideoNotes = await fetchNotes();

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify([...currentVideoNotes, newNote].sort((a, b) => a.time - b.time))
      
    });
    console.log(JSON.stringify([currentVideoNotes]))
    console.log(JSON.stringify([...currentVideoNotes]))
  };

  const newVideoLoaded = async () => {
    const noteBtnExists = document.getElementsByClassName("note-btn")[0];

    currentVideoNotes = await fetchNotes();

    if (!noteBtnExists) {
      const noteBtn = document.createElement("img");

      noteBtn.src = chrome.runtime.getURL("assets/notes.png");
      noteBtn.className = "ytp-button " + "note-btn";
      noteBtn.title = "Click to add note";

      youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName('video-stream')[0];

      youtubeLeftControls.appendChild(noteBtn);
      noteBtn.addEventListener("click", addNewNoteEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    }
  });

  newVideoLoaded();
})();

const getTime = (x)=>{
    let hours = Math.floor(x / 3600);
    let minutes = Math.floor((x % 3600) / 60);
    let seconds = (x % 3600) % 60

    hours = hours < 10 ? ("0"+hours) : hours;
    minutes = minutes < 10 ? ("0"+minutes) : minutes;
    seconds = seconds < 10 ? ("0"+seconds) : seconds;

    return [hours, minutes, seconds].join(":");
}
