'use strict';
    
var tangran, interval, tempo, canvasTangran, click = 0, difXEncaixe, difYEncaixe, mrgmDeErro = 5;
var sprite, sprite2, sprite3; 

function startGame() {
    document.getElementsByClassName("start-wrapper")[0].classList.add("hide-element");

    //Coordernadas do molde
    var xMolde = [417, 480, 416, 429, 520, 467, 649];
    var yMolde = [160, 160, 222, 310, 310, 439, 530];

    //Coordernadas à encaixar
    var xEncaixe = [200, 100, 200, 930, 950, 950, 100];
    var yEncaixe = [520, 250, 360, 350, 100, 480, 80];

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
    }

    setTangran();

    var game = new Phaser.Game(window.innerWidth, screen.height, Phaser.AUTO, 'tangran', { preload: preload, create: create });

    function preload() {

        game.load.image('folha', 'img/folha.png');
        game.load.image('canetaAzul', 'img/canetaAzul.png');
        game.load.image('cafe', 'img/cafe.png');
        game.load.image('smartphone', 'img/smartphone.png');    

        tangran.forEach(function (item) {
            game.load.image(item.figureName, item.url);
        });
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = "#999999";
        game.add.sprite(400, 100, 'folha');
        game.add.sprite(780 , 70, 'canetaAzul');
        game.add.sprite(1110 , 320, 'cafe');
        game.add.sprite(30 , 450, 'smartphone');  

        tangran.forEach(function (item, i) {
            item.object = game.add.sprite(game.world.centerX, game.world.height, item.figureName);
            //Disposição Molde Encaixe
                item.object.x = xMolde[i];
                item.object.y = yMolde[i];
            game.physics.arcade.enable(item.object);
            item.object.tint = 0x00beff; //Cor Molde Encaixe   
        });    	

        tangran.forEach(function (item, i) {            
            item.objectForm = game.add.sprite(game.world.centerX, yEncaixe[i], item.object.key, item.object.frame);  //Eixo y encaixar
            item.objectForm.x = xEncaixe[i]; //Eixo x encaixar
                var spriteAtual = item.objectForm;
            game.physics.arcade.enable(item.objectForm, Phaser.Physics.ARCADE);
                spriteAtual.body.collideWorldBounds = true;
                spriteAtual.body.checkCollision = true;
            item.objectForm.inputEnabled = true;
            item.objectForm.input.enableDrag(false, true);
            item.objectForm.tint = Phaser.Color.getRandomColor(20, 255, 255);
            item.objectForm.input.enableSnap(5, 5, false, true);
            item.objectForm.events.onDragStop.add(function (currentSprite) {
                var currentItem = tangran.filter(function (element) { return element.figureName === currentSprite.key }).shift();
                stopDrag(currentSprite, currentItem.object, tangran.indexOf(currentItem));
            }, this);
            
            //Rotacionar com Scroll e Contar Clicks
            item.objectForm.events.onInputDown.add(function (currentSprite, pointer) { 
                if (pointer.middleButton.isDown){
                    currentSprite.angle += 45;
                    currentSprite.anchor.setTo(0.5, 0.5);
                    click++;
                    contadorClick();
                }
                else if (!currentSprite.body.isMoving){
                    click++;
                    contadorClick();
                }
            }, this);
        });     
    }

	function win() {
		return tangran.reduce((status, currentObj) => status && currentObj.status, true);
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

        function diferenca(valorA, valorB) {
            var diferenca = valorA - valorB;
            if (diferenca < 0) {
              diferenca = diferenca * -1;
            }
            return diferenca;
        }    

        //Verificando diferença do encaixe com a peça molde.  
        difXEncaixe = diferenca(currentSprite.body.x, endSprite.body.x);
        difYEncaixe = diferenca(endSprite.body.y, currentSprite.body.y);

        if (difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
            currentSprite.position.copyFrom(endSprite.position); // Copia posição do molde 
            currentSprite.anchor.setTo(endSprite.anchor.x, endSprite.anchor.y); //Seta aonde dar um Stop
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
            document.querySelector('.current-timer').innerHTML = '<p>' + tempo + '</p>';
        }, 1000);
    }

    timer();
    
    function contadorClick(){
        document.querySelector('.contClick').innerHTML = '<p>' + click + '</p>';
    }    

    
    function reset() {
        timer();
        //setTangran();
    }
}