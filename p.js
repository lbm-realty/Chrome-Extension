const formatTime = (x)=>{
    let hours = Math.floor(x / 3600);
    let minutes = Math.floor((x % 3600) / 60);
    let seconds = (x % 3600) % 60


    hours = hours < 10 ? ("0"+hours) : hours;
    minutes = minutes < 10 ? ("0"+minutes) : minutes;
    seconds = seconds < 10 ? ("0"+seconds) : seconds;

    return [hours, minutes, seconds].join(":");
}

console.log(formatTime(4100))

// let array = ["labeeb", "labeeb2", "nice", 2, 3, 6, "labeeb3", "wow"];
// let myName = JSON
// console.log(typeof(myName));

// let me = "LabeebDelete"
// me = me.slice(6);
// console.log(me);

// var notes = [];
// notes.push({ "name":"labeeb", "age": 20 });
// notes.push({ "name":"omar", "age": 21 });
// console.log(notes);

// let currentVideoNotes = [];

// console.log(JSON.stringify([...currentVideoNotes]));
