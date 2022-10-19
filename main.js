// --------- initialisation de la balise html canvas 

// retrouver l'id dans le html
const canvas = document.getElementById('screen');
// definir un context en 2D pour l'utilisation du canvas 
const context = canvas.getContext("2d");
// taille  de l'écran de jeu
const WIDTH = 300;
const HEIGHT = 200;
const HALF_WIDTH = 150;
const HALF_HEIGHT = 100;

// --------- Image par secondes  / FPS

// 60 images par seconde 
const FPS = 60;
// valeur utilisé pour le setTimeout d'un cycle de la gameLoop 
let cycleDelay = Math.floor(1000 / FPS);
// valeur utilisé pour trouver le temps entre deux cycles de la gameLoop
let oldCycleTime = 0;
// calculer les FPS seulement une fois par secondes
let cycleCount = 0;
// performance en jeux du nombre de FPS
let fps_rate = 'calculating...';

// --------- valeurs de la Carte 

// taille de la carte 
const MAP_SIZE = 20;
// echelle de la carte 
const MAP_SCALE = 20;
// echelle de la diffusion de la carte 
const MAP_RANGE = MAP_SCALE * MAP_SIZE;
// vitese de deplacement sur la map 
const MAP_SPEED = (MAP_SCALE / 2) / 10;
// array representant la map 
let map = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
]

// --------- joueur 

// axe x du joueur 
let playerX = MAP_SCALE + 20;
// axe y du joueur
let playerY = MAP_SCALE + 20;
// angle de vue de la camera
let playerAngle = Math.PI / 3;
// valeur de base pour les deplacement du joueur
let playerMoveX = 0;
let playerMoveY = 0;
let playerMoveAngle = 0;

// constantes pour la camera du joueur
const DOUBLE_PI = Math.PI * 2;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const STEP_ANGLE = FOV / WIDTH;

// --------- Commandes de jeu

// evenements touches enfoncées
document.onkeydown = (e) => {
    switch (e.key) {
        case 's':
            playerMoveX = -1;
            playerMoveY = -1;
            break;
        case 'z':
            playerMoveX = 1;
            playerMoveY = 1;
            break;
        case 'q':
            playerMoveAngle = 1;
            break;
        case 'd':
            playerMoveAngle = -1;
            break;
    }
}
// evenements touches relachées
document.onkeyup = (e) => {
    switch (e.key) {
        case 's':
            playerMoveX = 0;
            playerMoveY = 0;
            break;
        case 'z':
            playerMoveX = 0;
            playerMoveY = 0;
            break;
        case 'q':
            playerMoveAngle = 0;
            break;
        case 'd':
            playerMoveAngle = 0;
            break;
    }
}

// --------- GameLoop boucle de jeux afin de pouvoir percevoir une continuité des evenements

// fonction callbaack
const gameLoop = () => {
    // --------- calcule FPS

    // demarrer le compteur des FPS
    cycleCount++;
    // redemarrer le compteur des FPS si il est supérieur ou egale a 60 
    if (cycleCount >= 60) cycleCount = 0;
    // repere chronologique du compteur FPS
    let startTime = Date.now();
    // calcule d'un cycle pour le compteur FPS nouvelle date moins l'ancienne 
    let cycleTime = startTime - oldCycleTime;
    // redefinition de la valeur de l'ancien cycle pour un nouveau cycle 
    oldCycleTime = startTime;
    // nombre de fps en jeux par secondes (date.now valeur en millisecondes )
    if (cycleCount % 60 == 0) fps_rate = Math.floor(1000 / cycleTime);

    // --------- initialisation de la taille de l'ecran 

    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;

    // --------- mise a jour de l'ecran et du fond  

    context.fillStyle = 'White';
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'Black';
    context.fillRect(canvas.width / 2 - HALF_WIDTH, canvas.height / 2 - HALF_HEIGHT, WIDTH, HEIGHT)

    // --------- initialisation de la carte 

    // variables des limites sur axes x et y de la carte
    let mapOffSetX = Math.floor(canvas.width / 2 - MAP_RANGE / 2);
    let mapOffSetY = Math.floor(canvas.height / 2 - MAP_RANGE / 2);

    // -------- Positionnement du joueur et deplacements du Joueur

    // variables mise à jour position 
    let playerOffsetX = Math.sin(playerAngle) * MAP_SPEED;
    let playerOffsetY = Math.cos(playerAngle) * MAP_SPEED;

    // Limites Joueur et carte
    let mapTargetX = Math.floor(playerY / MAP_SCALE) * MAP_SIZE + Math.floor((playerX + playerOffsetX * playerMoveX) / MAP_SCALE);
    let mapTargetY = Math.floor((playerY + playerOffsetY * playerMoveY) / MAP_SCALE) * MAP_SIZE + Math.floor(playerX / MAP_SCALE);
    let playerMapX = playerX + mapOffSetX;
    let playerMapY = playerY + mapOffSetY;

    // deplacement axe x
    if (playerMoveX && map[mapTargetX] == 0) playerX += playerOffsetX * playerMoveX;
    // deplacement axe y
    if (playerMoveY && map[mapTargetY] == 0) playerY += playerOffsetY * playerMoveY;
    // deplacement angle camera 
    if (playerMoveAngle) playerAngle += 0.03 * playerMoveAngle;

    // iteration pour les axes x de l'array map
    for (let row = 0; row < MAP_SIZE; row++) {
        // iteration pour les axes y de l'array map
        for (let col = 0; col < MAP_SIZE; col++) {
            // variable qui crée la valeur d'un bloc de la carte 
            let square = row * MAP_SIZE + col;
            // si les blocs ne sont pas égaux à 0 dans l'array map 
            if (map[square] != 0) {
                // on leurs donne une couleur
                context.fillStyle = '#555';
                // placement du groupe de blocs sur le canvas
                context.fillRect(
                    mapOffSetX + col * MAP_SCALE,
                    mapOffSetY + row * MAP_SCALE,
                    MAP_SCALE,
                    MAP_SCALE)
            }
            // si les blocs sont égaux à 0 dans l'array map 
            else {
                // on leurs donne une autre couleur
                context.fillStyle = '#aaa'
                // placement du groupe de blocs sur le canvas
                context.fillRect(
                    mapOffSetX + col * MAP_SCALE,
                    mapOffSetY + row * MAP_SCALE,
                    MAP_SCALE,
                    MAP_SCALE)
            }
        }
    }

    // --------- Faire apparaitre le Joueur

    // corps du joueur 
    context.fillStyle = 'Red';
    context.beginPath();
    context.arc(playerMapX, playerMapY, 2, 0, DOUBLE_PI)
    context.fill();

    // direction du joueur 
    context.strokeStyle = 'Red';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(playerMapX, playerMapY);
    context.lineTo(playerMapX + Math.sin(playerAngle) * 5, playerMapY + Math.cos(playerAngle) * 5);
    context.stroke()


    // --------- Raycasting pour le champs de vision 
    // variables pour le point de depart du FOV
    let currentAngle = playerAngle + HALF_FOV;
    let rayStartX = Math.floor(playerX / MAP_SCALE) * MAP_SCALE;
    let rayStartY = Math.floor(playerY / MAP_SCALE) * MAP_SCALE;

    for (let ray = 0; ray < WIDTH; ray++) {
        // valeur de base des sinus et cosinus pour les colisions du FOV
        let currentSin = Math.sin(currentAngle);
        currentSin ? currentSin : 0.000001;

        let currentCos = Math.cos(currentAngle);
        currentCos ? currentCos : 0.000001;

        let rayEndX, rayEndY, rayDirectionX, verticalDepth, rayDirectionY, horizontalDepth;


        //intersections des lignes verticales de la map pour le FOV 
        if (currentSin > 0) {
            rayEndX = rayStartX + MAP_SCALE;
            rayDirectionX = 1;
        } else {
            rayEndX = rayStartX;
            rayDirectionX = -1;
        }
        for (let offset = 0; offset < MAP_RANGE; offset += MAP_SCALE) {
            verticalDepth = (rayEndX - playerX) / currentSin;
            rayEndY = playerY + verticalDepth * currentCos;
            let mapTargetX = Math.floor(rayEndX / MAP_SCALE);
            let mapTargetY = Math.floor(rayEndY / MAP_SCALE);

            if (currentSin <= 0) mapTargetX += rayDirectionX;
            var targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
            if (targetSquare < 0 || targetSquare > map.lenght - 1) break;
            if (map[targetSquare] != 0) break;

            rayEndX += rayDirectionX * MAP_SCALE;
        }

        let tempX = rayEndX;
        let tempY = rayEndY;

        //intersections des lignes horizontale de la map pour le FOV 
        if (currentCos > 0) {
            rayEndY = rayStartY + MAP_SCALE;
            rayDirectionY = 1;
        } else {
            rayEndY = rayStartY;
            rayDirectionY = -1;
        }
        for (let offset = 0; offset < MAP_RANGE; offset += MAP_SCALE) {
            horizontalDepth = (rayEndY - playerY) / currentCos;
            rayEndX = playerX + horizontalDepth * currentSin;
            let mapTargetX = Math.floor(rayEndX / MAP_SCALE);
            let mapTargetY = Math.floor(rayEndY / MAP_SCALE);

            if (currentCos <= 0) mapTargetY += rayDirectionY;
            let targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
            if (targetSquare < 0 || targetSquare > map.length - 1) break;
            if (map[targetSquare] != 0) break;

            rayEndY += rayDirectionY * MAP_SCALE;
        }


        let endX = verticalDepth < horizontalDepth ? tempX : rayEndX;
        let endY = verticalDepth < horizontalDepth ? tempY : rayEndY;

        context.strokeStyle = 'Purple';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(endX + mapOffSetX, endY + mapOffSetY);
        context.stroke()

        currentAngle -= STEP_ANGLE;
    }



    // --------- Initialisation de la gameLoop

    setTimeout(gameLoop, cycleDelay);

    // --------- rendu ecran du compteur FPS 

    context.fillStyle = 'Black';
    context.font = '10px Monospace';
    context.fillText('FPS :' + fps_rate, 0, 20);

};

// --------- utilisation de la Gameloop au chargement de la fenetre 

window.addEventListener('load', () => {
    gameLoop();
})

