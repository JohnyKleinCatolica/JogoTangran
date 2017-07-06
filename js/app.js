'use strict';

function iniciar(){
    resetar();
    document.getElementsByClassName("start-wrapper")[0].classList.add("hide-element");
}

function resetar(){
    document.getElementsByClassName("win-wrapper")[0].classList.add("hide-element");
    fnc.contadorClick(true);
    fnc.timer();
    fnc.resetarStatus();
    game.state.start('FaseGato');       
}

/*===============================================================================================*/

function TangranFuncional(){
    var mrgmDeErro = 5, 
        clicksOtimo = 9, clicksQsOtimo = 11, clicksRegular = 30, clicksQsRegular = 35, clicksBom = 50, clicksQsBom = 60;
    var i, interval, tempo, canvasTangran, difXEncaixe, difYEncaixe, angulos = [];
    var fg0 = 0, fg1 = 0, fg4 = 0, fg5 = 0;
    var sprite, sprite2, sprite3;     
    this.tangran; this.click = 0; this.tempoSeg = 0;
    
    //Coordernadas do molde
    this.xMolde = [];
    this.yMolde = [];

    //Coordernadas à encaixar
    this.xEncaixe = [];
    this.yEncaixe = []; 
    
        //Score
        this.stopDrag = function (currentSprite, endSprite, itemTangramIndex) {
            if (!slapItem(currentSprite, endSprite)) {
                this.tangran[itemTangramIndex].status = false;
            } else {
                this.tangran[itemTangramIndex].status = true;
                if (win()) {                             
                    document.getElementsByClassName("win-wrapper")[0].classList.remove("hide-element");
                    document.getElementById('you-win').classList.add("you-win-enable");
                    document.getElementById("timer").innerText = "Tempo: " + tempo;
                    clearInterval(interval); 
                    scoreStar(this.click);
                    this.resetarStatus();
                    this.click = 0;
                }
              }
            }

        function scoreStar(clicks){
            if(clicks<clicksQsBom && clicks>=clicksBom){
                document.getElementById('first').classList.add("fullStar");
            } else if(clicks<(clicksQsBom+15) && clicks>=clicksQsBom){
                document.getElementById('first').classList.add("halfStar");
            } else if(clicks<clicksQsRegular && clicks>=clicksRegular){
                document.getElementById('first').classList.add("fullStar");
                document.getElementById('middle').classList.add("fullStar");
            } else if(clicks<clicksBom && clicks>=clicksQsRegular){
                document.getElementById('first').classList.add("fullStar");
                document.getElementById('middle').classList.add("halfStar");                
            } else if(clicks<clicksRegular && clicks>=clicksQsOtimo){
                document.getElementById('first').classList.add("fullStar");
                document.getElementById('middle').classList.add("fullStar");
                document.getElementById('tree').classList.add("halfStar");                  
            } else if(clicks<clicksQsOtimo && clicks>=clicksOtimo){
                document.getElementById('first').classList.add("fullStar");
                document.getElementById('middle').classList.add("fullStar");
                document.getElementById('tree').classList.add("fullStar");      
            }
        }
        
        this.resetarStatus = function(){
            for(i=0; i<=6; i++){
                this.tangran[i].status = false;
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
                    fg0 = 0;
                    difXEncaixe = diferenca(currentSprite.body.x, fnc.tangran[1].object.x);
                    difYEncaixe = diferenca(currentSprite.body.y, fnc.tangran[1].object.y);
                        if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                            currentSprite.angle = -180;
                            currentSprite.body.x = fnc.tangran[1].object.x;
                            currentSprite.body.y = fnc.tangran[1].object.y;
                            return true;
                        } else {return false};
                }
                else if(fg1){
                    fg1 = 0;
                    difXEncaixe = diferenca(currentSprite.body.x, fnc.tangran[0].object.x);
                    difYEncaixe = diferenca(currentSprite.body.y, fnc.tangran[0].object.y);
                        if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                            currentSprite.angle = -180;
                            currentSprite.body.x = fnc.tangran[0].object.x;
                            currentSprite.body.y = fnc.tangran[0].object.y;
                            return true;
                        } else {return false};                
                } //OBS: GAMBIARRA PARA VALIDAR FIG4 E FIG5
                else if(fg4){
                    fg4 = 0;
                    var x1 = currentSprite.body.x;
                    var y1 = currentSprite.body.y;                    
                    //var x2 = fnc.tangran[5].object.x;                   
                   // var y2 = fnc.tangran[5].object.y;
                    difXEncaixe = diferenca((currentSprite.body.x - 70), fnc.tangran[5].object.x);
                    difYEncaixe = diferenca((currentSprite.body.y - 6), fnc.tangran[5].object.y);
                        if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                            currentSprite.angle = 45;
                            currentSprite.body.x = fnc.tangran[5].object.x;
                            currentSprite.body.y = fnc.tangran[5].object.y;
                            return true;
                        } else {return false};                
                }
                else if(fg5){
                    fg5 = 0;
                    var x1 = currentSprite.x;        
                    var y1 = currentSprite.body.y;   
                    //var x2 = fnc.tangran[4].object.x;                    
                   // var y2 = fnc.tangran[4].object.y;                    
                    
                    if (x1>(522-mrgmDeErro) && x1<=522  &&  y1>(350-mrgmDeErro) && y1<=350){
                        difXEncaixe = diferenca(currentSprite.x, fnc.tangran[4].object.x);
                        difYEncaixe = diferenca((currentSprite.body.y - 37), fnc.tangran[4].object.y);
                    } else if(x1>(394-(mrgmDeErro+2)) && x1<=394  &&  y1>(442-(mrgmDeErro+2) && y1<=442)){
                        difXEncaixe = diferenca((currentSprite.x + 129), fnc.tangran[4].object.x);
                        difYEncaixe = diferenca((currentSprite.body.y - 129), fnc.tangran[4].object.y);                        
                    } else {
                        difXEncaixe = 100;
                        difYEncaixe = 100;                          
                    }
                    
                    if(difXEncaixe<=mrgmDeErro && difYEncaixe<=mrgmDeErro){
                            currentSprite.angle = -45;
                            currentSprite.body.x = fnc.tangran[4].object.x;
                            currentSprite.body.y = fnc.tangran[4].object.y;
                            return true;
                        } else {return false};               
                }
            }  else { // Se a imagem movida não for igual
                currentSprite.position.copyFrom(currentSprite.position); // Copia para posição na qual já está
                return false;
            }
        }

        function imgIgualOutroAngulo(figuraAtual){
            if(figuraAtual.key == "figura0"  && figuraAtual.angle == -180 ){
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

        this.timer = function (){
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

        this.timer();

        this.contadorClick = function (resetando){
            if (resetando){
                this.click = 0;
            }
            document.querySelector('.contClick').innerHTML = '<h2>' + this.click + '</h2>';
        }
        
        function mathEspecial(min, max){
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        this.anguloAleatório = function(){
            angulos = [45, 0, -45, 45, -45];

            return(angulos[mathEspecial(0,4)]);
        }
        
        function win() {
            return fnc.tangran.reduce((status, currentObj) => status && currentObj.status, true);
        }
}

/*===============================================================================================*/

var Tangran = {};
var fnc = new TangranFuncional();

/*===============================================================================================*/

Tangran.FaseGato = function (game) {
    
    fnc.xMolde = [417, 480, 416, 429, 520, 467, 649];
    fnc.yMolde = [160, 160, 222, 310, 310, 439, 530];

    fnc.xEncaixe = [200, 100, 200, 930, 950, 950, 130];
    fnc.yEncaixe = [520, 250, 360, 350, 100, 480, 150];     

    function tangramItem(figureId, url) {
        this.figureName = "figura" + figureId,
        this.url = "assets/" + url + ".png";
        this.status = false,
        this.object = {},
        this.objectForm = {}
    }

    function setTangran() {
        fnc.tangran = [
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

           
            fnc.tangran.forEach(function (item) {
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

            fnc.tangran.forEach(function (item, i) {
                item.object = game.add.sprite(game.world.centerX, game.world.height, item.figureName);
                //Disposição Molde Encaixe
                    item.object.x = fnc.xMolde[i];
                    item.object.y = fnc.yMolde[i];
                game.physics.arcade.enable(item.object);
                item.object.tint = 0x00beff; //Cor Molde Encaixe   
            });    	

            fnc.tangran.forEach(function (item, i) {            
                item.objectForm = game.add.sprite(game.world.centerX, fnc.yEncaixe[i], item.object.key, item.object.frame);  //Eixo y encaixar
                item.objectForm.x = fnc.xEncaixe[i]; //Eixo x encaixar
                    var spriteAtual = item.objectForm;
                game.physics.arcade.enable(item.objectForm, Phaser.Physics.ARCADE);
                    spriteAtual.body.collideWorldBounds = true;
                    spriteAtual.body.checkCollision = true;
                item.objectForm.inputEnabled = true;
                item.objectForm.input.enableDrag(false, true);
                item.objectForm.tint = Phaser.Color.getRandomColor(20, 255, 255);
                item.objectForm.angle = fnc.anguloAleatório(); //Ângulo Aleatório
                //item.objectForm.input.enableSnap(5, 5, false, true); RECURSO N FUNCIONA BEM COM VALIDACAO
                item.objectForm.events.onDragStop.add(function (currentSprite) {
                    var currentItem = fnc.tangran.filter(function (element) { return element.figureName === currentSprite.key }).shift();
                    fnc.stopDrag(currentSprite, currentItem.object, fnc.tangran.indexOf(currentItem));
                }, this);

                //Rotacionar com Scroll e Contar Clicks
                item.objectForm.events.onInputDown.add(function (currentSprite, pointer) { 
                    if (pointer.middleButton.isDown){
                        currentSprite.angle += 45;
                        currentSprite.anchor.setTo(0.5, 0.5);
                        fnc.click++;
                        fnc.contadorClick(false);
                    }
                    else if (!currentSprite.body.isMoving){
                        fnc.click++;
                        fnc.contadorClick(false);
                    }
                }, this);
            });     
        }   
};

/*===============================================================================================*/


    var game = new Phaser.Game(window.innerWidth, screen.height, Phaser.AUTO, 'tangran');

    game.state.add('FaseGato', Tangran.FaseGato);
    game.state.start('FaseGato');

