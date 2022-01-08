let sounds = {}

function preload() {
    sounds.btn = createAudio('click_btn.mp3');
}

function setup() {

    sounds.btn.play();
}