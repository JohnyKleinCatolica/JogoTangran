'use strict';

//Coordernadas do molde
var xMolde = [415, 480, 415, 429, 520, 468, 650];
var yMolde = [160, 160, 222, 310, 310, 439, 530];

//Coordernadas à encaixar
var xEncaixe = [200, 200, 200, 200, 200, 200, 200];
var yEncaixe = [2, 2, 2, 2, 2, 2, 2];

var tangran, interval, tempo, diferencaX, diferencaY, margemDeErroEncaixe = 5;
var sprite, sprite2, sprite3; 

function tangramItem(figureId, url) {
	this.figureName = "figura" + figureId,
		this.url = "assets/" + url + ".png";
	this.status = false,
		this.object = {},
		this.objectForm = {}
}

function setTangran() {
	tangran = [
		new tangramItem('0', "trian1"),
		new tangramItem('1', "trian2"),
		new tangramItem('2', "quadrado"),
		new tangramItem('3', "trian3"),
		new tangramItem('4', "trian4"),
		new tangramItem('5', "trian5"),
		new tangramItem('6', "paralelograma"),
	];
};

setTangran();

var game = new Phaser.Game(window.innerWidth, screen.height, Phaser.AUTO, 'tangran', { preload: preload, create: create });

function preload() {

    var n = tangran[0].object;
    
    //game.load.image('quad', 'assets/gato/quad1.png');
    
    game.load.image('folha', 'img/folha.png');
    game.load.image('canetaAzul', 'img/canetaAzul.png');
    game.load.image('canetas', 'img/canetas.png');
    game.load.image('cafe', 'img/cafe.png');
    game.load.image('smartphone', 'img/smartphone.png');    
    
    game.load.image('gato', 'assets/gato/gato.png')
    
	tangran.forEach(function (item) {
		game.load.image(item.figureName, item.url);
	});
}

function create() {
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(390, 100, 'folha');
    game.add.sprite(280 , 100, 'canetaAzul');
    game.add.sprite(1250 , 280, 'canetas');
    game.add.sprite(30 , 420, 'cafe');
    game.add.sprite(1230 , 550, 'smartphone');  
    
    game.add.sprite(415, 160, 'gato');
    
    //game.add.sprite(450, 60, 'quad');
    
    
	tangran.forEach(function (item, i) {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		item.object = game.add.sprite(game.world.centerX, game.world.height, item.figureName);
        //Disposição Molde Encaixe
            item.object.x = xMolde[i];
            item.object.y = yMolde[i];
		game.physics.arcade.enable(item.object);
		//item.object.tint = 0x00beff; //Cor Molde Encaixe   
        item.object.tint = Phaser.Color.getRandomColor(1, 255, 255);
    });    
    
	sprite = game.add.sprite(380, 30, 'canetaAzul');
	game.physics.enable(sprite, Phaser.Physics.ARCADE);
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.up = false;
	sprite.body.checkCollision.down = false;
	sprite.body.immovable = true;

	sprite2 = game.add.sprite(350, 400, 'cafe', 2);

	game.physics.enable(sprite2, Phaser.Physics.ARCADE);
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);
	

	tangran.forEach(function (item, i) {
       
		item.objectForm = game.add.sprite(game.world.centerX, yEncaixe[i], item.object.key, item.object.frame);  //Eixo y encaixar
		//Eixo x encaixar
        item.objectForm.x = xEncaixe[i];
        
		game.physics.arcade.enable(item.objectForm);
		item.objectForm.inputEnabled = true;
		item.objectForm.input.enableDrag(false, true);
		item.objectForm.tint = Phaser.Color.getRandomColor(50, 255, 255);
		item.objectForm.input.enableSnap(15, 15, false, true);
		item.objectForm.events.onDragStop.add(function (currentSprite) {
			var currentItem = tangran.filter(function (element) { return element.figureName === currentSprite.key }).shift();
			stopDrag(currentSprite, currentItem.object, tangran.indexOf(currentItem));
		}, this);
		item.objectForm.events.onInputDown.add(function (currentSprite, pointer) {
			if (!currentSprite.body.isMoving && pointer.middleButton.isDown) {
				currentSprite.anchor.setTo(0.5, 0.5);
				currentSprite.angle += 45;
			}

		}, this);
	});

}

function win() {
	var youWon = true
	tangran.forEach(function (item) {
		if (item.status === false) {
			youWon = false;
		}
	});
	return youWon;
}

function stopDrag(currentSprite, endSprite, itemTangramIndex) {
	if (!slapItem(currentSprite, endSprite)) {
		tangran[itemTangramIndex].status = false;
	} else {
		tangran[itemTangramIndex].status = true;
		if (win()) {
			document.getElementsByClassName("win-wrapper")[0].classList.remove("hide-element");
			document.getElementById('you-win').classList.add("you-win-enable");
			document.getElementById("timer").innerText = "Tempo: " + tempo;
			clearInterval(interval);
		}
	}
}

function slapItem(currentSprite, endSprite) {
	diferencaX = currentSprite.body.x - endSprite.body.x;
	diferencaY = endSprite.body.y - currentSprite.body.y;

	if (diferencaX < 0) {
		diferencaX = diferencaX * -1;
	}
	if (diferencaY < 0) {
		diferencaY = diferencaY * -1;
	}

	if (diferencaX <= margemDeErroEncaixe && diferencaY <= margemDeErroEncaixe) {
		currentSprite.position.copyFrom(endSprite.position); // Copia posição do molde 
		currentSprite.anchor.setTo(endSprite.anchor.x, endSprite.anchor.y); //Seta aonde dar um Stop
		//currentSprite.input.draggable = false;
		return true;
	} else {
		currentSprite.position.copyFrom(currentSprite.position); // Copia para posição na qual já está
		return false;
	}
}

function timer() {
	var start = new Date();
	start.setHours(0, 0, 0, 0);
	if (interval !== undefined) {
		clearInterval(interval);
	}
	interval = setInterval(function () {
		tempo = (start.getMinutes() < 10 ? '0' : '') + start.getMinutes() + " : " + (start.getSeconds() < 10 ? '0' : '') + start.getSeconds();
		start.setSeconds(start.getSeconds() + 1);
		document.querySelector('.teste').innerHTML = '<p>' + tempo + '</p>';
	}, 1000);
};

timer();

function reset() {
	timer();
	//setTangran();
};
