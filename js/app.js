'use strict';
/*              FUNCIONAL DO JOGO           */
    
var tangran, interval, tempo, canvasTangran, click = 0, difXEncaixe, difYEncaixe, mrgmDeErro = 5;
var fg0 = 0, fg1 = 0, fg4 = 0, fg5 = 0;
var sprite, sprite2, sprite3;     

//Coordernadas do molde
var xMolde = [];
var yMolde = [];

//Coordernadas à encaixar
var xEncaixe = [];
var yEncaixe = []; 

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

    function diferenca(valorA, valorB) {
        var diferenca = valorA - valorB;
        if (diferenca < 0) {
            diferenca = diferenca * -1;
        }
            return diferenca;
        }     

    function slapItem(currentSprite, endSprite) {
        //Verificando diferença do encaixe com a peça molde.  
        difXEncaixe = diferenca(currentSprite.body.x, endSprite.body.x);
        difYEncaixe = diferenca(endSprite.body.y, currentSprite.body.y);

        if (difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro) { //Verifica se img original é igual
            currentSprite.body.x = endSprite.body.x;
            currentSprite.body.y = endSprite.body.y;
            return true;
        } 
        else if(imgIgualOutroAngulo(currentSprite)){  //Verifica se uma outra img rotacionada é igual
            if(fg0){
                difXEncaixe = diferenca(currentSprite.body.x, tangran[1].object.x);
                difYEncaixe = diferenca(currentSprite.body.y, tangran[1].object.y);
                    if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                        currentSprite.angle = -180;
                        currentSprite.body.x = tangran[1].object.x;
                        currentSprite.body.y = tangran[1].object.y;
                        return true;
                    }
            }
            if(fg1){
                difXEncaixe = diferenca(currentSprite.body.x, tangran[0].object.x);
                difYEncaixe = diferenca(currentSprite.body.y, tangran[0].object.y);
                    if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                        currentSprite.angle = -180;
                        currentSprite.body.x = tangran[0].object.x;
                        currentSprite.body.y = tangran[0].object.y;
                        return true;
                    }                
            }
            if(fg4){
                difXEncaixe = diferenca((currentSprite.body.x - 70), tangran[5].object.x);
                difYEncaixe = diferenca((currentSprite.body.y - 3), tangran[5].object.y);
                    if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                        currentSprite.angle = 45;
                        currentSprite.body.x = tangran[5].object.x;
                        currentSprite.body.y = tangran[5].object.y;
                        return true;
                    }                
            }
            if(fg5){
                difXEncaixe = diferenca((currentSprite.body.x + 88), tangran[4].object.x);
                difYEncaixe = diferenca((currentSprite.body.y - 37), tangran[4].object.y);
                    if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                        currentSprite.angle = -45;
                        currentSprite.body.x = tangran[4].object.x;
                        currentSprite.body.y = tangran[4].object.y;
                        return true;
                    }                
            }
        }  else { // Se a imagem movida não for igual
            currentSprite.position.copyFrom(currentSprite.position); // Copia para posição na qual já está
            return false;
        }
    }

    function imgIgualOutroAngulo(figuraAtual){
        if(figuraAtual.key == "figura0"  && figuraAtual.angle == -180){
            fg0 = 1;
            return true;
        } else if(figuraAtual.key == "figura1" && figuraAtual.angle == -180){
            fg1 = 1;
            return true;
        } else if(figuraAtual.key == "figura4" && figuraAtual.angle == 45){
            fg4 = 1;
            return true;
        } else if(figuraAtual.key == "figura5"  && figuraAtual.angle == -45){
            fg5 = 1;
            return true;
        } else {
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

    function contadorClick(resetando){
        if (resetando){
            click = 0;
        }
        document.querySelector('.contClick').innerHTML = '<h2>' + click + '</h2>';
    }

    function resetar(){
        contadorClick(true);
        timer();
        game.state.start('FaseGato');       
    }

/*              FIM FUNCIONAL DO JOGO           */

var Tangran = {};

Tangran.FaseGato = function (game) {
    
xMolde = [417, 480, 416, 429, 520, 467, 649];
yMolde = [160, 160, 222, 310, 310, 439, 530];

xEncaixe = [200, 100, 200, 930, 950, 950, 100];
yEncaixe = [520, 250, 360, 350, 100, 480, 80];     
    
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
      
}
    
Tangran.FaseGato.prototype = {

        preload: function() {
            game.load.image('folha', 'img/folha.png');
            game.load.image('canetaAzul', 'img/canetaAzul.png');
            game.load.image('cafe', 'img/cafe.png');
            game.load.image('smartphone', 'img/smartphone.png');    

            tangran.forEach(function (item) {
                game.load.image(item.figureName, item.url);
            });
        },

        create: function() {
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
                //item.objectForm.input.enableSnap(5, 5, false, true); RECURSO N FUNCIONA BEM COM VALIDACAO
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
                        contadorClick(false);
                    }
                    else if (!currentSprite.body.isMoving){
                        click++;
                        contadorClick(false);
                    }
                }, this);
            });     
        }   
};

    
    var game = new Phaser.Game(window.innerWidth, screen.height, Phaser.AUTO, 'tangran');

    game.state.add('FaseGato', Tangran.FaseGato);

    game.state.start('FaseGato');

