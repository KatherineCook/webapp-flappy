// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(800, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var player;
var labelScore;
var pipes = [];
var pipeInterval;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var balloons = [];
var weight = [];
//var addPipeEnd;
//var stars = [];


/*
 * Loads all resources for the game and gives them names.
 */
jQuery("#greeting-form").on("submit", function (event_details) {
//alert("Submitted");
//event_details.preventDefault();
    var greeting = "Hello";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
//alert(greeting_message);
//event_details.preventDefault();
});

function preload() {
    game.load.image("playerImg", "../assets/giraffe.png");
    game.load.image("backgroundImg", "../assets/Grass_Decor_PNG_Clipart.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/pipe.png");
    game.load.image("balloons", "../assets/balloons.png");
    game.load.image("weight", "../assets/weight.png");
    //game.load.image("stars", "..assets/star.png");

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor("#23AFFA");
    game.add.text(530, 0, "I'm a flying giraffe.",
        {font: "25px Arial Black", fill: "#8DFFAA"});

    var background = game.add.image(-50, 300, "backgroundImg");
    background.width = 1000;
    background.height = 110;

    game.input
        .onDown
        .add(clickHandler);
    /*
     game.input
     .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
     .onDown.add(spaceHandler);

     */
    labelScore = game.add.text(700, 40, "0");

    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(100, 200, "playerImg");
    player.anchor.setTo(0.5, 0.5);
    player.anchor.setTo(0, 0);
    player.anchor.setTo(1, 1);
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = -50;
    player.body.gravity.y = 250;


    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    pipeInterval = 1.25;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);

    //generatePipe();


    // set the background colour of the scene
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(1, 4);
    for (var count = 0; count < 8; count++) {
        if (count != gapStart && count != gapStart + 1 && count != gapStart + 2) {
            addPipeBlock(750, count * 50);
        }

    }


    changeScore();

    /*addPipeEnd(width - 5, gapStart - 25);
    for (var y = gapStart - 75; y > -50; y -= 50) {
        addPipeBlock(width, y);
    }

    addStar(width, gapStart + (gapSize / 1) - (starHeight / 1));

    addPipeEnd(width - 5, gapStart + pipeGap);
    for (var y = gapStart + pipeGap + 25; y < height; y += 50) {
        addPipeBlock(width, y);
    }*/
}




function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -400
}

function clickHandler(event) {
    alert("Ouch!");
}
/*
 function spaceHandler(){
 game.sound.play("score");
 }

 */

/*
 * This function updates the scene. It is called for every new frame.
 */
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}


function playerJump() {
    player.body.velocity.y = -100;
}
function update() {
    player.rotation += 1;
    player.rotation = Math.atan(player.body.velocity.y / 200);
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes[index],
            gameOver);
    }

    if (player.body.y < 0 || player.body.y > 400) {
        gameOver();
    }
    /*for (var i = stars.length - 1; i >= 0; i--) {
        game.physics.arcade.overlap(player, stars[i], function () {
            stars[i].destroy();
            stars.splice(i, 1);
            changeScore();

        });
    }*/
}

/*function addStar(x, y) {
    var star = game.add.sprite(x, y, "star");
    stars.push(star);
    game.physics.arcade.enable(star);
    star.body.velocity.x = -gameSpeed;
}*/


function gameOver() {
    //location.reload();
    $("#score").val(score.toString());
    $("#greeting").show();
    game.destroy();
    gameGravity = 200;
    //stars=[];

}

function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}

function generateBalloons(){
    var bonus = game.add.sprite(500, 300, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);

}

function generateWeight() {
    var bonus = game.add.sprite(500, 0, "weight");
    weight.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y =  game.rnd.integerInRange(60,100);
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    } else {
        generatePipe();
    }
}

/*function checkBonus()

for(var i=balloons.length - 1; i >= 0; i--){
    game.physics.arcade.overlap(player, balloons[i], function(){
        changeGravity(-50);
        balloons[i].destroy();
        balloons.splice(i, 1);
    });
}*/