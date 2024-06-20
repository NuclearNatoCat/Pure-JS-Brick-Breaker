// get canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// helper funcions in canvas
canvas.clear = ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// objects for easier code reading
const game = {
    screen: "title",
    perks: [],
    money: 0,
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 0,
    mouseX: 0,
    mouseY: 0,
    progressToNextLevel: 0,
    requirementForNextLevel: 10,
    timeSinceHpLost: 0,
    timeSinceXpGained: 0,
    timeSinceMoneyGained: 0,
    justSaved: false,
    loseHp: ()=>{
        if (game.timeSinceHpLost > 10) {
            game.hp--;
            game.timeSinceHpLost = 0;
        } else {
            ball.y = canvas.height - 20;
        }
        if(game.hp <= 0) {
            game.lose();
        }
    },
    gainXp: ()=>{
        if(game.timeSinceXpGained > 20) {
            game.xp++;
            game.progressToNextLevel = (game.xp / game.requirementForNextLevel);
            game.timeSinceXpGained = 0;
            if(game.xp >= game.requirementForNextLevel) {
                game.levelUp();
            }
        }
    },
    levelUp: ()=>{
        game.xp = 0;
        game.level++;
        game.requirementForNextLevel *= 1.15;
        game.requirementForNextLevel = Math.ceil(game.requirementForNextLevel);
        game.progressToNextLevel = 0;
        game.decreaseDifficulty();
    },
    gainMoney: ()=>{
        game.money++;
    },
    levelCompleteBonus: ()=>{
        game.money += Math.round(Math.random() * bricks.columns * bricks.rows);
        game.increaseDifficulty();
    },
    lastScreen: "title",
    setScreen: screen=>{
        game.lastScreen = game.screen;
        
        game.screen = screen;
        
        if (screen === "title") {
            canvas.addEventListener("pointerdown", titleScreenButtons.pointerDownHandler);
            canvas.removeEventListener("pointerdown", exitButton.pointerDownHandler);
        } else {
            canvas.removeEventListener("pointerdown", titleScreenButtons.pointerDownHandler);
            canvas.addEventListener("pointerdown", exitButton.pointerDownHandler);
        }
        if (screen === "options") {
            canvas.addEventListener("pointerdown", optionsMenu.pointerDownHandler);
        } else {
            canvas.removeEventListener("pointerdown", optionsMenu.pointerDownHandler);
        }
        if (screen === "dead") {
            canvas.addEventListener("pointerdown", deadButtons.pointerDownHandler);
            canvas.removeEventListener("pointerdown", exitButton.pointerDownHandler);
        } else {
            canvas.removeEventListener("pointerdown", deadButtons.pointerDownHandler);
        }
    },
    pointerMoveHandler: e=>{
        game.mouseX = e.clientX - 10;
        game.mouseY = e.clientY - 10;
    },
    pointerDownHandler: e=>{
        game.mouseX = e.clientX - 10;
        game.mouseY = e.clientY - 10;
    },
    reset: ()=>{
        if(confirm("Do you really want to reset Pure JS Brick Breaker? This will delete your save!")) {
            // clear save data to prevent it getting loaded back
            localStorage.clear();

            // reset game by reloading
            location.reload();
        }
    },
    save: ()=>{
        // create obj that turn into json and go into local storage
        const ballSaveData = {
            vX: ball.vX,
            vY: ball.vY,
            radius: ball.radius
        };
        const paddleSaveData = {
            x: paddle.x,
            y: paddle.y,
            vX: paddle.vX,
            vY: paddle.vY,
            moveSpeed: paddle.moveSpeed,
            height: paddle.height,
            width: paddle.width,
            radius: paddle.radius
        };
        const gameSaveData = {
            perks: game.perks,
            money: game.money,
            hp: game.hp,
            maxHp: game.maxHp,
            xp: game.xp,
            level: game.level,
            progressToNextLevel: game.progressToNextLevel,
            requirementForNextLevel: game.requirementForNextLevel,
            timeSinceHpLost: game.timeSinceHpLost,
            timeSinceXpGained: game.timeSinceXpGained,
            timeSinceMoneyGained: game.timeSinceMoneyGained,
        };
        const brickSaveData = {
            rows: bricks.rows,
            columns: bricks.columns,
            height: bricks.height,
            hp: bricks.hp
        };
        const optionsSaveData = options;

        // turn obj into json and put into local storage
        localStorage.ballSaveData = JSON.stringify(ballSaveData);
        localStorage.paddleSaveData = JSON.stringify(paddleSaveData);
        localStorage.gameSaveData = JSON.stringify(gameSaveData);
        localStorage.optionsSaveData = JSON.stringify(optionsSaveData);
        localStorage.brickSaveData = JSON.stringify(brickSaveData);

        localStorage.gameSaved = "yes";

        // show save dialog
        game.justSaved = true;

        setTimeout(()=>{
            game.justSaved = false;
        }, 1000);
        
    },
    load: ()=>{
        if (localStorage.gameSaved === "yes") {
            // take json from local storage and assign it to objects
            const ballSaveData = JSON.parse(localStorage.ballSaveData);
            const paddleSaveData = JSON.parse(localStorage.paddleSaveData);
            const gameSaveData = JSON.parse(localStorage.gameSaveData);
            const optionsSaveData = JSON.parse(localStorage.optionsSaveData);
            const brickSaveData = JSON.parse(localStorage.brickSaveData);

            // ball
            ball.x = canvas.width / 2;
            ball.y = 150;
            ball.vX = ballSaveData.vX;
            ball.vY = ballSaveData.vY;
            ball.radius = ballSaveData.radius;

            // paddle
            paddle.x = paddleSaveData.x;
            paddle.y = paddleSaveData.y;
            paddle.vX = paddleSaveData.vX;
            paddle.vY = paddleSaveData.vY;
            paddle.moveSpeed = paddleSaveData.moveSpeed;
            paddle.height = paddleSaveData.height;
            paddle.width = paddleSaveData.width;
            paddle.radius = paddleSaveData.radius;

            // game
            game.perks = gameSaveData.perks;
            game.money = gameSaveData.money;
            game.hp = gameSaveData.hp;
            game.maxHp = gameSaveData.maxHp;
            game.xp = gameSaveData.xp;
            game.level = gameSaveData.level;
            game.progressToNextLevel = gameSaveData.progressToNextLevel;
            game.requirementForNextLevel = gameSaveData.requirementForNextLevel;
            game.timeSinceHpLost = gameSaveData.timeSinceHpLost;
            game.timeSinceXpGained = gameSaveData.timeSinceXpGained;
            game.timeSinceMoneyGained = gameSaveData.timeSinceMoneyGained;

            // bricks
            bricks.rows = brickSaveData.rows;
            bricks.columns = brickSaveData.columns;
            bricks.height = brickSaveData.height;
            bricks.hp = brickSaveData.hp;

            // change bricks
            bricks.update();

            // options
            options = optionsSaveData;

            // make options actually work
            for (let checkboxName of optionsMenuCheckboxes.names) {
                optionsMenuCheckboxes[checkboxName].checked = options[checkboxName];
            }
            if(mouseControls.active != options.mouseControls) {
                mouseControls.toggle();
            }
        }
    },
    quit: ()=>{
        const urls = [
            "https://youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtube.com/watch?v=mImFz8mkaHo"
        ];
        const index = Math.floor(Math.random() * urls.length);
        const url = urls[index];
        
        window.location = url;
    },
    website: ()=>{
        open("https://nuclear-nc.x10.mx/projects");
    },
    lose: ()=>{
        // change screen to title as placeholder; will make lose screen
        game.setScreen("dead");

        // revert game to default(no reset so options stay)
        game.setToDefault();
    },
    setToDefault: ()=>{
        // ball
        ball.x = canvas.width / 2;
        ball.y = 180;
        ball.vX = defaultBall.vX;
        ball.vY = defaultBall.vY;
        ball.radius = defaultBall.radius;

        // paddle
        paddle.x = defaultPaddle.x;
        paddle.y = defaultPaddle.y;
        paddle.vX = defaultPaddle.vX;
        paddle.vY = defaultPaddle.vY;
        paddle.moveSpeed = defaultPaddle.moveSpeed;
        paddle.height = defaultPaddle.height;
        paddle.width = defaultPaddle.width;
        paddle.radius = defaultPaddle.radius;

        // game
        game.perks = defaultGame.perks;
        game.money = defaultGame.money;
        game.hp = defaultGame.hp;
        game.maxHp = defaultGame.maxHp;
        game.xp = defaultGame.xp;
        game.level = defaultGame.level;
        game.progressToNextLevel = defaultGame.progressToNextLevel;
        game.requirementForNextLevel = defaultGame.requirementForNextLevel;
        game.timeSinceHpLost = defaultGame.timeSinceHpLost;
        game.timeSinceXpGained = defaultGame.timeSinceXpGained;
        game.timeSinceMoneyGained = defaultGame.timeSinceMoneyGained;

        // bricks
        bricks.rows = defaultBricks.rows;
        bricks.columns = defaultBricks.columns;
        bricks.height = defaultBricks.height;
        bricks.hp = defaultBricks.hp;

        // change bricks
        bricks.update();
    },
    increaseDifficulty: ()=>{
        const rng = Math.floor(Math.random() * 10);
        switch(rng) {
            case 1: 
            {
                bricks.columns++;
                console.log("Added brick column");
                break;
            }
            case 2: 
            {
                ball.vY > 0 ? ball.vY += 2 : ball.vY -= 2;
                console.log("Ball is faster in the Y direction");
                break;
            }
            case 3: 
            case 4:
            {
                ball.vX > 0 ? ball.vX += 2 : ball.vX -= 2;
                console.log("Ball is faster in the X direction");
                break;
            }
            case 0:
            {
                bricks.rows++;
                console.log("Added brick row");
                break;
            }
            case 5: 
            case 6:
            {
                paddle.width -= 7;
                console.log("Paddle is thinner");
                break;
            }
            case 7:
            {
                paddle.moveSpeed -= .5;
                console.log("Paddle moves slower");
                break;
            }
            case 8:
            {
                ball.radius -= .5;
                console.log("Ball is smaller");
                break;
            }
            case 9:
            {
                bricks.hp++;
                console.log("Bricks have more hp");
                break;
            }
        }
    },
    decreaseDifficulty: ()=>{
        const rng = Math.floor(Math.random() * 5);
        switch(rng) {
            case 0:
            {
                paddle.moveSpeed += .5;
                console.log("Paddle moves faster");
                break;
            }
            case 1:
            {
                ball.vY > 0 ? ball.vY-- : ball.vY++;
                console.log("Ball is slower in the Y direction");
                break;
            }
            case 2:
            {
                paddle.width += 5;
                console.log("Paddle is thicker");
                break;
            }
            case 3:
            {
                ball.radius += .25;
                console.log("Ball is larger");
                break;
            }
            case 4: 
            {
                ball.vX > 0 ? ball.vX-- : ball.vX++;
                console.log("Ball is slower in the X direction");
                break;
            }
        }
    }
};

const colors = {
    // important stuff
    background: "rgb(240 248 255)",
    backgroundGrid: "rgb(230 230 255)",

    // title screen and common colors
    main: "rgb(100 100 255)",
    subtitle: "rgb(150 150 255)",
    buttonHover: "rgb(175 175 255)",
    buttonNotHovering: "rgb(200 200 255)",

    // game colors
    bricks: "rgb(120 120 255)",
    buttonOutline: "rgb(120 120 255)",
    exitAndCheckboxHover: "rgb(160 160 255)",
    exitAndCheckboxNotHovering: "rgb(180 180 255)",

    // game ui
    uiText: "rgb(0 0 50)",
    levelBarText: "rgb(150 150 150)",
    levelBarBackground: "rgb(220 220 220)",
    levelBarFilling: "rgb(200 200 200)",
    levelBarOutline: "rgb(150 150 150)",

    // back button(the door icon)
    exitDoorBackground: "rgb(130, 130, 255)",
    exitDoorOutlines: "rgb(80 80 255)",
    exitDoorknob: "rgb(160, 160, 255)"
};

const ball = {
    x: canvas.width / 2,
    y: 180,
    vX: Math.random() > 0.5 ? -7 : 7,
    vY: 7,
    radius: 10,
    draw: ()=>{
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.main;
        ctx.fill();
        ctx.closePath();
    },
    move: ()=>{
        // top and bottom border collision
        if (ball.y + ball.vY < ball.radius || ball.y + ball.vY > canvas.height - ball.radius) {
            if (ball.y + ball.vY > canvas.height - ball.radius)
                game.loseHp();
            ball.vY = -ball.vY;
        }

        // left and right border collision
        if (ball.x + ball.vX < ball.radius || ball.x + ball.vX > canvas.width - ball.radius) {
            ball.vX = -ball.vX;
        }

        // paddle collision
        ball.checkCollision("paddle");

        // change coords
        ball.x += ball.vX;
        ball.y += ball.vY;
    },
    checkCollision: (str,specBrick)=>{
        if (str === "paddle") {
            if (ball.y + ball.vY > paddle.y - ball.radius && ball.isInPaddleColumn && ball.isAbovePaddle) {
                ball.vY = -ball.vY;
                game.gainXp();
            } else if (ball.y + ball.vY < paddle.y + paddle.height + ball.radius && ball.isInPaddleColumn && ball.isBelowPaddle) {
                ball.vY = -ball.vY;
            } else if (ball.x + ball.vX > (paddle.x - ball.radius) && ball.isInPaddleRow && ball.isLeftOfPaddle) {
                ball.vX = -ball.vX;
            } else if (ball.x + ball.vX < (paddle.x + paddle.width) + ball.radius && ball.isInPaddleRow && ball.isRightOfPaddle) {
                ball.vX = -ball.vX;
            }
        } else if (str === "bricks") {
            const brick = bricks.currentBricks[specBrick];
            if (ball.y + ball.vY > brick.y - ball.radius && ball.isInBrickColumn(brick) && ball.isAboveBrick(brick)) {
                ball.vY = -ball.vY;
                bricks.hit(brick, "top");
            } else if (ball.y + ball.vY < brick.y + bricks.height + ball.radius && ball.isInBrickColumn(brick) && ball.isBelowBrick(brick)) {
                ball.vY = -ball.vY;
                bricks.hit(brick, "bottom");
            } else if (ball.x + ball.vX > (brick.x - ball.radius) && ball.isInBrickRow(brick) && ball.isLeftOfBrick(brick)) {
                ball.vX = -ball.vX;
                bricks.hit(brick, "left");
            } else if (ball.x + ball.vX < (brick.x + bricks.width) + ball.radius && ball.isInBrickRow(brick) && ball.isRightOfBrick(brick)) {
                ball.vX = -ball.vX;
                bricks.hit(brick, "right");
            }
        }
    },
    get isInPaddleColumn() {
        return ball.x > paddle.x && ball.x < paddle.x + paddle.width;
    },
    get isInPaddleRow() {
        return !(ball.isAbovePaddle || ball.isBelowPaddle);
    },
    get isBelowPaddle() {
        return ball.y + ball.vY > paddle.y + paddle.height - ball.radius;
    },
    get isAbovePaddle() {
        return ball.y + ball.vY < paddle.y + ball.radius;
    },
    get isLeftOfPaddle() {
        return ball.x < paddle.x + paddle.width;
    },
    get isRightOfPaddle() {
        return ball.x > paddle.x + paddle.width;
    },
    isInBrickColumn: brick=>{
        return ball.x > brick.x && ball.x < brick.x + bricks.width;
    },
    isInBrickRow: brick=>{
        return !(ball.isAboveBrick(brick) || ball.isBelowBrick(brick));
    },
    isBelowBrick: brick=>{
        return ball.y + ball.vY > brick.y + bricks.height - ball.radius;
    },
    isAboveBrick: brick=>{
        return ball.y + ball.vY < brick.y + ball.radius;
    },
    isLeftOfBrick: brick=>{
        return ball.x < brick.x + bricks.width;
    },
    isRightOfBrick: brick=>{
        return ball.x > brick.x + bricks.width;
    }
};

const paddle = {
    x: canvas.width / 2 - 125 / 2,
    y: canvas.height - 15,
    vX: 0,
    vY: 0,
    moveSpeed: 7,
    height: 15,
    width: 125,
    radius: 5,
    draw: ()=>{
        ctx.beginPath();
        ctx.fillStyle = colors.main;
        ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.radius);
        ctx.fill();
        ctx.closePath();
    },
    move: ()=>{
        if (keysPressed.right) {
            paddle.vX = canvas.width - paddle.x - paddle.width > 0 ? paddle.moveSpeed : 0;
        } else if (keysPressed.left) {
            paddle.vX = paddle.x > 0 ? -paddle.moveSpeed : 0;
        } else if (!mouseControls.active) {
            paddle.vX = 0;
        }
        // change coords
        paddle.x += paddle.vX;
        paddle.y += paddle.vY;
    }
};

const bricks = {
    rows: 3,
    columns: 3,
    height: 25,
    width: 0,
    padding: 22,
    margin: 20,
    offsetTop: 20,
    hp: 1,
    radius: 5,
    respawning: false,
    currentBricks: {},
    draw: ()=>{
        // loop over all the bricks and draw them
        for (const brick in bricks.currentBricks) {
            const brickHp = bricks.currentBricks[brick].hp;
            const brickStatus = bricks.currentBricks[brick].status;
            const brickX = bricks.currentBricks[brick].x;
            const brickY = bricks.currentBricks[brick].y;

            if (brickStatus) {
                ctx.beginPath();
                ctx.fillStyle = colors.bricks;
                ctx.strokeStyle = colors.main;
                ctx.roundRect(brickX, brickY, bricks.width, bricks.height, bricks.radius);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }
    },
    update: ()=>{
        // clear old brick data
        bricks.currentBricks = {};

        // calculate width and height
        bricks.width = (canvas.width - bricks.margin * 2 - bricks.padding * (bricks.columns - 1)) / bricks.columns;

        let currentBrickNum = 0;

        for (let c = 0; c < bricks.columns; c++) {
            for (let r = 0; r < bricks.rows; r++) {
                const brickX = c * (bricks.width + bricks.padding) + bricks.margin;
                const brickY = r * (bricks.height + bricks.padding) + bricks.offsetTop;

                // add bricks to list
                bricks.addToCurrentBrickList(brickX, brickY, currentBrickNum);

                currentBrickNum++;
            }
        }

        bricks.respawning = false;
    },
    addToCurrentBrickList: (brickX,brickY,currentBrickNum)=>{
        bricks.currentBricks[`brick ${currentBrickNum}`] = {
            x: brickX,
            y: brickY,
            hp: bricks.hp,
            status: 1
        };
    },
    checkCollision: ()=>{
        for (const brick in bricks.currentBricks) {
            const brickStatus = bricks.currentBricks[brick].status;
            if (brickStatus) {
                ball.checkCollision("bricks", brick);
            }
        }
    },
    hit: (brick,dir)=>{
        brick.hp--;
        if (brick.hp <= 0) {
            // destroy brick and get money
            brick.status = 0;
            game.gainMoney();

            // check if all bricks are gone, than respawn bricks if so
            if (!bricks.currentAmountOfBricks) {
                bricks.respawn();
            }
        }
    },
    respawn: ()=>{
        bricks.respawning = true;
        game.levelCompleteBonus();
        setTimeout(bricks.update, 500);
    },
    get currentAmountOfBricks() {
        let numOfBricks = 0;
        for (const brick in bricks.currentBricks) {
            if (bricks.currentBricks[brick].status)
                numOfBricks++;
        }
        return numOfBricks;
    }
};

// update bricks at start
bricks.update();

const keysPressed = {
    right: false,
    left: false,
    esc: false,
    keyDownHandler: e=>{
        switch (e.key) {
        case "Right":
        case "ArrowRight":
        case "d":
        case "l":
            {
                keysPressed.right = true;
                break;
            }
        case "Left":
        case "ArrowLeft":
        case "a":
        case "j":
            {
                keysPressed.left = true;
                break;
            }
        case "Escape":
            {
                if (options.esc) {
                    keysPressed.esc = true;
                }
                break;
            }
        }
    },
    keyUpHandler: e=>{
        switch (e.key) {
        case "Right":
        case "ArrowRight":
        case "d":
        case "l":
            {
                keysPressed.right = false;
                break;
            }
        case "Left":
        case "ArrowLeft":
        case "a":
        case "j":
            {
                keysPressed.left = false;
                break;
            }
        case "Escape":
            {
                if (options.esc) {
                    keysPressed.esc = false;
                    if (game.screen !== "title") {
                        game.setScreen("title");
                    }
                }
                break;
            }
        }
    }
};

const mouseControls = {
    active: false,
    interval: null,
    movePaddle: ()=>{
        if (game.screen === "game") {
            if (paddle.x > (game.mouseX - paddle.width / 2) + paddle.moveSpeed) {
                // mouse to the left of paddle
                paddle.vX = paddle.x > 0 ? -paddle.moveSpeed : 0;
            } else if (paddle.x < (game.mouseX - paddle.width / 2) - paddle.moveSpeed) {
                // mouse to the right of paddle
                paddle.vX = canvas.width - paddle.x - paddle.width > 0 ? paddle.moveSpeed : 0;
            } else {
                // mouse on center of paddle
                paddle.vX = 0;
            }
        }
    },
    toggle: ()=>{
        if (!mouseControls.active) {
            mouseControls.interval = setInterval(mouseControls.movePaddle, 10);
            mouseControls.active = true;
        } else {
            clearInterval(mouseControls.interval);
            mouseControls.active = false;
        }
    }
};

const ui = {
    moneyText: `Money: $0`,
    moneyX: 10,
    moneyY: 90,
    hpText: `Health: 100`,
    hpX: 10,
    hpY: 60,
    levelText: `Level: 0`,
    levelBarText: `0/10`,
    levelX: 10,
    levelY: 30,
    levelTextLength: 10,
    draw: ()=>{
        // main stuff
        ctx.textAlign = "left";
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = colors.uiText;
        ctx.fillText(ui.moneyText, ui.moneyX, ui.moneyY);
        ctx.fillText(ui.hpText, ui.hpX, ui.hpY);
        ctx.fillText(ui.levelText, ui.levelX, ui.levelY);

        // level bar
        ctx.fillStyle = colors.levelBarText;
        ctx.textAlign = "center";
        ctx.fillText(ui.levelBarText, ui.levelX + ui.levelTextLength + (canvas.width - ui.levelTextLength - 58) / 2, ui.levelY);
    },
    drawLevelBar: ()=>{
        ctx.beginPath();
        ctx.fillStyle = colors.levelBarBackground;
        ctx.fillRect(ui.levelX + ui.levelTextLength, ui.levelY - 16, canvas.width - ui.levelTextLength - 58, 20)
        ctx.fillStyle = colors.levelBarFilling;
        ctx.strokeStyle = colors.levelBarOutline;
        ctx.fillRect(ui.levelX + ui.levelTextLength, ui.levelY - 16, (canvas.width - ui.levelTextLength - 58) * game.progressToNextLevel, 20);
        ctx.strokeRect(ui.levelX + ui.levelTextLength, ui.levelY - 16, canvas.width - ui.levelTextLength - 58, 20)
        ctx.closePath();
    },
    update: ()=>{
        ui.moneyText = `Money: $${game.money}`;
        ui.hpText = `Health: ${game.hp}/${game.maxHp}`;
        ui.levelText = `Level: ${game.level}`;
        ui.levelTextLength = ui.levelText.length * 13;
        ui.levelBarText = `${game.xp}/${game.requirementForNextLevel}`;
    }
};

const exitButton = {
    x: canvas.width - 35 - 6,
    y: 6,
    width: 35,
    height: 35,
    radius: 7,
    hovered: false,
    onClick: ()=>{
        if(game.screen === "game") {
            game.setScreen("title");
        } else {
            game.setScreen(game.lastScreen);
        }
    },
    draw: ()=>{
        ctx.beginPath();
        ctx.strokeStyle = colors.buttonOutline;
        ctx.fillStyle = exitButton.hovered || keysPressed.esc ? colors.exitAndCheckboxHover : colors.exitAndCheckboxNotHovering;
        ctx.roundRect(exitButton.x, exitButton.y, exitButton.width, exitButton.height, exitButton.radius);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    drawDoor: ()=>{
        // door bg
        ctx.beginPath();
        ctx.strokeStyle = colors.exitDoorOutlines;
        ctx.fillStyle = colors.exitDoorBackground;
        ctx.roundRect(exitButton.x + 9, exitButton.y + 4, exitButton.width / 2, exitButton.height / 1.3, 1);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        // doorknob
        ctx.beginPath();
        ctx.fillStyle = colors.exitDoorknob;
        ctx.stokeStyle = colors.exitDoorOutlines;
        ctx.arc(exitButton.x + 22, exitButton.y + 16, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    updateColor: ()=>{
        const button = exitButton;
        if (game.mouseX > button.x - button.width / 2 && game.mouseX < button.x + button.width && game.mouseY > button.y && game.mouseY < button.y + button.height) {
            button.hovered = true;
        } else {
            button.hovered = false;
        }
    },
    pointerDownHandler: e=>{
        // update pointer positions
        game.pointerDownHandler(e);
        exitButton.updateColor();
        
        if (exitButton.hovered) {
            exitButton.onClick();
        }
    }
};

const title = {
    text: "Pure JS Brick Breaker",
    x: canvas.width / 2,
    y: 60,
    draw: ()=>{
        ctx.beginPath();
        ctx.fillStyle = colors.main;
        ctx.font = "bold 55px monospace";
        ctx.textAlign = "center";
        ctx.fillText(title.text, title.x, title.y);
        ctx.closePath();
    }
};

const subtitle = {
    text: "Made using pure JavaScript and the HTML Canvas API",
    x: canvas.width / 2,
    y: 90,
    draw: ()=>{
        ctx.beginPath();
        ctx.fillStyle = colors.subtitle;
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(subtitle.text, subtitle.x, subtitle.y);
        ctx.closePath();
    }
};

const version = {
    text: "Pure JavaScript Brick Breaker v1.1.0",
    x: 3,
    y: canvas.height - 3,
    fontSize: 14,
    draw: ()=>{
        ctx.beginPath();
        ctx.fillStyle = "rgb(170 170 255)";
        ctx.font = `bold ${version.fontSize}px monospace`;
        ctx.textAlign = "left";
        ctx.fillText(version.text, version.x, version.y);
        ctx.closePath();
    }
};

const titleScreenButtons = {
    play: {
        get text() {
            return localStorage.gameSaved || ball.y != 180 ? "Continue" : "Play";
        },
        x: canvas.width / 2,
        y: 150,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.setScreen("game");
        }
    },
    options: {
        text: "Options",
        x: canvas.width / 2,
        y: 220,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.setScreen("options");
        }
    },
    quit: {
        text: "Quit",
        x: canvas.width / 2,
        y: 290,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.quit();
        }
    },
    website: {
        text: "Other projects",
        x: canvas.width / 2,
        y: 360,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.website();
        }
    },
    names: ["play", "options", "quit", "website"],
    draw: ()=>{
        for (let name of titleScreenButtons.names) {
            const button = titleScreenButtons[name];
            // background
            ctx.beginPath();
            ctx.fillStyle = button.hovered ? "rgb(175 175 255)" : "rgb(200 200 255)";
            ctx.strokeStyle = colors.main;
            ctx.roundRect(button.x - button.width / 2, button.y, button.width, button.height, button.radius);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // text
            ctx.fillStyle = colors.main;
            ctx.textAlign = "center";
            ctx.font = `bold ${button.fontSize}px monospace`;
            ctx.fillText(button.text, button.x, button.y + button.height / 2 + button.fontSize / 3);
        }
    },
    updateColor: ()=>{
        for (let name of titleScreenButtons.names) {
            const button = titleScreenButtons[name];
            if (game.mouseX > button.x - button.width / 2 && game.mouseX < button.x + button.width / 2 && game.mouseY > button.y && game.mouseY < button.y + button.height) {
                button.hovered = true;
            } else {
                button.hovered = false;
            }
        }
    },
    pointerDownHandler: e=>{
        // update pointer positions
        game.pointerDownHandler(e);
        titleScreenButtons.updateColor();
        
        for (let name of titleScreenButtons.names) {
            const button = titleScreenButtons[name];
            if (button.hovered) {
                button.onClick();
            }
        }
    }
};

const optionsMenuCheckboxes = {
    mouseControls: {
        x: canvas.width / 2 - 75,
        y: 130,
        size: 25,
        radius: 5,
        hovered: false,
        checked: false,
        onClick: ()=>{
            // make checkbox show as checked
            optionsMenuCheckboxes.mouseControls.checked = !optionsMenuCheckboxes.mouseControls.checked;

            // toggle mouse controls
            mouseControls.toggle();

            options.mouseControls = !options.mouseControls;
        }
    },
    esc: {
        x: canvas.width / 2 - 75,
        y: 180,
        size: 25,
        radius: 5,
        hovered: false,
        checked: true,
        onClick: ()=>{
            // make checkbox show as checked
            optionsMenuCheckboxes.esc.checked = !optionsMenuCheckboxes.esc.checked;

            options.esc = !options.esc;
        }
    },
    version: {
        x: canvas.width / 2 - 75,
        y: 230,
        size: 25,
        radius: 5,
        hovered: false,
        checked: true,
        onClick: ()=>{
            // make checkbox show as checked
            optionsMenuCheckboxes.version.checked = !optionsMenuCheckboxes.version.checked;

            options.version = !options.version;
        }
    },
    autosave: {
        x: canvas.width / 2 - 75,
        y: 280,
        size: 25,
        radius: 5,
        hovered: false,
        checked: true,
        onClick: ()=>{
            // make checkbox show as checked
            optionsMenuCheckboxes.autosave.checked = !optionsMenuCheckboxes.autosave.checked;

            options.autosave = !options.autosave;
        }
    },
    gridRotate: {
        x: canvas.width / 2 - 75,
        y: 330,
        size: 25,
        radius: 5,
        hovered: false,
        checked: true,
        onClick: ()=>{
            // make checkbox show as checked
            optionsMenuCheckboxes.gridRotate.checked = !optionsMenuCheckboxes.gridRotate.checked;

            options.gridRotate = !options.gridRotate;
        }
    },
    save: {
        x: canvas.width / 2 - 75,
        y: 380,
        size: 25,
        radius: 5,
        hovered: false,
        checked: false,
        onClick: ()=>{
            // save the game
            game.save();
        }
    },
    reset: {
        x: canvas.width / 2 - 75,
        y: 430,
        size: 25,
        radius: 5,
        hovered: false,
        checked: false,
        onClick: ()=>{
            // reset the game
            game.reset();
        }
    },
    names: ["mouseControls", "esc", "version", "autosave", "gridRotate", "save", "reset"],
    draw: ()=>{
        for (let checkboxName of optionsMenuCheckboxes.names) {
            const checkbox = optionsMenuCheckboxes[checkboxName];
            ctx.beginPath();
            ctx.strokeStyle = colors.buttonOutline;
            ctx.fillStyle = checkbox.hovered ? colors.exitAndCheckboxHover : colors.exitAndCheckboxNotHovering;
            ctx.roundRect(checkbox.x, checkbox.y, checkbox.size, checkbox.size, checkbox.radius);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // draw checkmark if checkbox is checked
            if (checkbox.checked) {
                ctx.beginPath();
                ctx.strokeStyle = colors.main;
                ctx.moveTo(checkbox.x + 5, checkbox.y + 15);
                ctx.lineTo(checkbox.x + 10, checkbox.y + 20);
                ctx.lineTo(checkbox.x + 20, checkbox.y + 5)
                ctx.stroke();
                ctx.closePath();
            }
        }
    },
    updateColor: ()=>{
        for (let checkboxName of optionsMenuCheckboxes.names) {
            const checkbox = optionsMenuCheckboxes[checkboxName];
            if (game.mouseX > checkbox.x - checkbox.size / 2 && game.mouseX < checkbox.x + checkbox.size && game.mouseY > checkbox.y && game.mouseY < checkbox.y + checkbox.size) {
                checkbox.hovered = true;
            } else {
                checkbox.hovered = false;
            }
        }
    }
};

const optionsMenu = {
    x: canvas.width / 2,
    y: 105,
    height: canvas.height - 130,
    radius: 10,
    width: 700,
    fontSize: 25,
    controls: {
        text: "Mouse controls:",
        x: canvas.width / 2 + 30,
        y: 150
    },
    esc: {
        text: "Esc key:",
        x: canvas.width / 2 + 30,
        y: 200
    },
    ver: {
        text: "Show version:",
        x: canvas.width / 2 + 30,
        y: 250,
    },
    save: {
        text: "Autosave game:",
        x: canvas.width / 2 + 30,
        y: 300,
    },
    rotate: {
        text: "Bg rotation:",
        x: canvas.width / 2 + 30,
        y: 350,
    },
    manualSave: {
        text: "Manual save:",
        x: canvas.width / 2 + 30,
        y: 400,
    },
    reset: {
        text: "Reset game:",
        x: canvas.width / 2 + 30,
        y: 450,
    },
    textNames: ["controls", "esc", "ver", "save", "rotate", "manualSave", "reset"],
    draw: ()=>{
        ctx.beginPath();
        ctx.fillStyle = "rgb(220 220 255)";
        ctx.strokeStyle = colors.main;
        ctx.roundRect(optionsMenu.x - optionsMenu.width / 2, optionsMenu.y, optionsMenu.width, optionsMenu.height, optionsMenu.radius);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    drawText: ()=>{
        for (let name of optionsMenu.textNames) {
            const text = optionsMenu[name];
            ctx.beginPath();
            ctx.fillStyle = colors.main;
            ctx.font = `bold ${optionsMenu.fontSize}px monospace`;
            ctx.textAlign = "left";
            ctx.fillText(text.text, text.x - optionsMenu.width / 2, text.y);
            ctx.closePath();
        }
    },
    pointerDownHandler: e=>{
        // update pointer positions
        game.pointerDownHandler(e);
        optionsMenuCheckboxes.updateColor();
        
        for (let checkboxName of optionsMenuCheckboxes.names) {
            const checkbox = optionsMenuCheckboxes[checkboxName];
            if (checkbox.hovered) {
                checkbox.onClick();
            }
        }
    }
};

const optionsSubtitle = {
    text: "Customize Pure JS Brick Breaker",
    x: canvas.width / 2,
    y: 90,
    draw: ()=>{
        ctx.beginPath();
        ctx.fillStyle = "rgb(150 150 255)";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(optionsSubtitle.text, optionsSubtitle.x, optionsSubtitle.y);
        ctx.closePath();
    }
};

const saveDialog = {
    text: "Game saved",
    x: canvas.width - 3,
    y: canvas.height - 3,
    fontSize: 14,
    draw: ()=>{
        ctx.textAlign = "right";
        ctx.fillStyle = "rgb(170 170 255)";
        ctx.font = `bold ${saveDialog.fontSize}px monospace`;
        ctx.fillText(saveDialog.text, saveDialog.x, saveDialog.y);
    }
};

// uses let so save data can directly replace the object
let options = {
    mouseControls: false,
    esc: true,
    version: true,
    autosave: true,
    gridRotate: true
};

const autosave = {
    interval: null,
    save: ()=>{
        if(options.autosave) {
            game.save();
        }
    },
    load: ()=>{
        autosave.interval = setInterval(autosave.save, 30000);
    }
};

const background = {
    grid: {
        lineWidth: 10,
        deg: 0,
        rotateSpeed: 1 / 6,
        rotate: ()=>{
            if(background.grid.deg >= 360) {
                background.grid.deg = 0;
            }
            background.grid.deg += background.grid.rotateSpeed;
        }
    },
    pattern: null,
    draw: ()=>{
        // center grid
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // rotate grid
        ctx.rotate((background.grid.deg * Math.PI) / 180);

        // make background fill canvas
        ctx.fillStyle = background.pattern;
        ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);

        // remove rotation
        ctx.resetTransform();
    },
    generatePattern: ()=>{
        background.pattern = ctx.createPattern(bgCanvas, "repeat");
    }
};

const deadSubtitle = {
    text: "You died...",
    x: canvas.width / 2,
    y: 120,
    draw: ()=>{
        ctx.beginPath();
        ctx.fillStyle = "rgb(150 150 255)";
        ctx.font = "bold 50px monospace";
        ctx.textAlign = "center";
        ctx.fillText(deadSubtitle.text, deadSubtitle.x, deadSubtitle.y);
        ctx.closePath();
    }
};

const deadButtons = {
    retry: {
        text: "Retry",
        x: canvas.width / 2,
        y: 150,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.setScreen("game");
        }
    },
    options: {
        text: "Options",
        x: canvas.width / 2,
        y: 220,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.setScreen("options");
        }
    },
    title: {
        text: "Back to title",
        x: canvas.width / 2,
        y: 290,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.setScreen("title");
        }
    },
    website: {
        text: "Other projects",
        x: canvas.width / 2,
        y: 360,
        width: 300,
        height: 40,
        fontSize: 25,
        radius: 5,
        hovered: false,
        onClick: ()=>{
            game.website();
        }
    },
    names: ["retry", "options", "title", "website"],
    draw: ()=>{
        for (let name of deadButtons.names) {
            const button = deadButtons[name];
            // background
            ctx.beginPath();
            ctx.fillStyle = button.hovered ? colors.buttonHover : colors.buttonNotHovering;
            ctx.strokeStyle = colors.main;
            ctx.roundRect(button.x - button.width / 2, button.y, button.width, button.height, button.radius);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // text
            ctx.fillStyle = colors.main;
            ctx.textAlign = "center";
            ctx.font = `bold ${button.fontSize}px monospace`;
            ctx.fillText(button.text, button.x, button.y + button.height / 2 + button.fontSize / 3);
        }
    },
    updateColor: ()=>{
        for (let name of deadButtons.names) {
            const button = deadButtons[name];
            if (game.mouseX > button.x - button.width / 2 && game.mouseX < button.x + button.width / 2 && game.mouseY > button.y && game.mouseY < button.y + button.height) {
                button.hovered = true;
            } else {
                button.hovered = false;
            }
        }
    },
    pointerDownHandler: e=>{
        // update pointer positions
        game.pointerDownHandler(e);
        deadButtons.updateColor();
        
        for (let name of deadButtons.names) {
            const button = deadButtons[name];
            if (button.hovered) {
                button.onClick();
            }
        }
    }
};

// defaults
const defaultBall = {
    vX: Math.random() > 0.5 ? -7 : 7,
    vY: 7,
    radius: 10
};

const defaultPaddle = {
    x: canvas.width / 2 - 125 / 2,
    y: canvas.height - 15,
    vX: 0,
    vY: 0,
    moveSpeed: 7,
    height: 15,
    width: 125,
    radius: 5
};

const defaultBricks = {
    rows: 3,
    columns: 3,
    height: 25,
    hp: 1
};

const defaultGame = {
    perks: [],
    money: 0,
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 0,
    progressToNextLevel: 0,
    requirementForNextLevel: 10,
    timeSinceHpLost: 0,
    timeSinceXpGained: 0,
    timeSinceMoneyGained: 0
};

// begin autosaving
autosave.load();

// start listening for all things that need mouse
canvas.addEventListener("pointermove", game.pointerMoveHandler);

// fix bug if you start game while not on title screen
canvas.addEventListener("pointerdown", exitButton.pointerDownHandler);

// title screen startup
canvas.addEventListener("pointerdown", titleScreenButtons.pointerDownHandler);

// controls
document.addEventListener("keydown", keysPressed.keyDownHandler);
document.addEventListener("keyup", keysPressed.keyUpHandler);

function draw() {
    // clear canvas for next frame
    canvas.clear();

    // draws the background before anything else
    background.draw();
    if(options.gridRotate) {
        background.grid.rotate();
    }

    // version
    if(options.version) {
        version.draw();
    }

    switch (game.screen) {
    case "game":
        {
            // ball
            ball.draw();
            ball.move();

            // paddle
            paddle.draw();
            paddle.move();

            // bricks
            bricks.draw();
            bricks.checkCollision();

            // ui
            ui.drawLevelBar();
            ui.draw();
            ui.update();

            // exit button
            exitButton.draw();
            exitButton.drawDoor();
            exitButton.updateColor();

            break;
        }
    case "title":
        {
            // title
            title.draw();

            // subtitle
            subtitle.draw();

            // buttons
            titleScreenButtons.draw();
            titleScreenButtons.updateColor();

            break;
        }
    case "options":
        {
            // title
            title.draw();

            // subtitle
            optionsSubtitle.draw();

            // menu itself
            optionsMenu.draw();

            // text
            optionsMenu.drawText();

            // checkboxes
            optionsMenuCheckboxes.draw();
            optionsMenuCheckboxes.updateColor();

            // exit button
            exitButton.draw();
            exitButton.drawDoor();
            exitButton.updateColor();

            break;
        }
    case "dead":
        {
            // title
            title.draw();

            // subtitle
            deadSubtitle.draw();

            // buttons
            deadButtons.draw();
            deadButtons.updateColor();
            
            break;
        }
    }

    // save dialog
    if(game.justSaved) {
        saveDialog.draw();
    }

    // loop
    requestAnimationFrame(draw);
}

// timed stuff
function tick() {
    game.timeSinceHpLost++;
    game.timeSinceXpGained++;
    game.timeSinceMoneyGained++;
}

// set interval for tick
setInterval(tick, 10);

// create background
const bgCanvas = document.getElementById("background-canvas");
const bgCtx = bgCanvas.getContext("2d");

function bgDraw() {
    bgCtx.beginPath();

    // setup
    bgCtx.strokeStyle = colors.backgroundGrid;
    bgCtx.moveTo(0, 0);
    bgCtx.lineWidth = background.grid.lineWidth / 2;

    // grid
    bgCtx.lineTo(bgCanvas.width, 0);
    bgCtx.lineTo(bgCanvas.width, bgCanvas.height);
    bgCtx.lineTo(0, bgCanvas.height);
    bgCtx.lineTo(0, 0);

    // ending
    bgCtx.stroke();
    bgCtx.closePath();
}

// draw bg on bg canvas
bgDraw();
background.generatePattern();

// load game from save
game.load();

// run game
draw();