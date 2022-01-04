let fishes = [];

function preload() {
    fishes[0] = createSprite(600, 350);
    fishes[0].addImage(loadImage('images/clown-fish.png'));

    fishes[1] = createSprite(100, 400);
    fishes[1].addImage(loadImage('images/fish1.png'));

    fishes[2] = createSprite(300, 450);
    fishes[2].addImage(loadImage('images/fish2.png'));

    fishes[3] = createSprite(450, 100);
    fishes[3].addImage(loadImage('images/fish3.png'));

    fishes[4] = createSprite(200, 200);
    fishes[4].addImage(loadImage('images/fish4.png'));

    fishes[5] = createSprite(210, 100);
    fishes[5].addImage(loadImage('images/fish5.png'));

    fishes[6] = createSprite(320, 120);
    fishes[6].addImage(loadImage('images/fish.png'));

    fishes[7] = createSprite(900, 160);
    fishes[7].addImage(loadImage('images/clown-fish.png'));

    fishes[8] = createSprite(800, 210);
    fishes[8].addImage(loadImage('images/fish1.png'));

    fishes[9] = createSprite(700, 140);
    fishes[9].addImage(loadImage('images/fish2.png'));

    fishes[10] = createSprite(600, 405);
    fishes[10].addImage(loadImage('images/fish3.png'));

    fishes[11] = createSprite(500, 90);
    fishes[11].addImage(loadImage('images/fish4.png'));

    fishes[12] = createSprite(300, 205);
    fishes[12].addImage(loadImage('images/fish5.png'));

    fishes[13] = createSprite(400, 250);
    fishes[13].addImage(loadImage('images/fish.png'));
}


function setup() {
    let cnv = createCanvas(1140, 500);
    cnv.position(180, 100, 'fixed');
    for (let i = 0; i < fishes.length; i++) {
        fishes[i].scale = 0.25;
        console.log(i + "號魚出生")
    };
    fishes[0].setVelocity(-0.6, 0);
    fishes[1].setVelocity(-0.1, 0);
    fishes[2].setVelocity(-1.4, 0);
    fishes[3].setVelocity(1.8, 0);
    fishes[4].setVelocity(1.2, 0);
    fishes[5].setVelocity(1.1, 0);
    fishes[6].setVelocity(-0.6, 0);
    fishes[7].setVelocity(-0.6, 0);
    fishes[8].setVelocity(-0.1, 0);
    fishes[9].setVelocity(-1.4, 0);
    fishes[10].setVelocity(1.8, 0);
    fishes[11].setVelocity(1.2, 0);
    fishes[12].setVelocity(1.1, 0);
    fishes[13].setVelocity(-0.6, 0);


}

function draw() {
    //background('#04A5AF');
    clear();

    for (let i = 0; i < fishes.length; i++) {
        console.log(i + "號魚出生")
    };
    for (let i = 0; i < fishes.length; i++) {
        // Step 5: add code here to detect (add adjust) the mountains positions
        if (fishes[i].position.x <= 0) {
            fishes[i].position.x = 1140;
        }
    }

    drawSprites();
}