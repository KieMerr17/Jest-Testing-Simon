/**
 * @jest-environment jsdom
 */

const { TestScheduler } = require("jest");
const { hasUncaughtExceptionCaptureCallback } = require("process");
const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game");

jest.spyOn(window, "alert").mockImplementation(() => {

})

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html","utf-8");
    document.open();
    document.write(fileContents);
    document.close();
})

describe("game object contains correct keys", () => {
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    })
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });
    test("choices contain corrects ids", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"])
    });
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true)
    });
});


describe("new game works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.currentGame = ["button1", "button2"];
        game.playerMoves = ["button1", "button2"];
        game.turnNumber = 42;
        document.getElementById("score").innerText = "42";
        newGame();
    });
    test("set the game score to 0", () => {
        expect(game.score).toEqual(0);
    })
    test("should be one element in the computers array", () => {
        expect(game.currentGame.length).toBe(1);
    })
    test("set the playerMoves to be empty", () => {
        expect(game.playerMoves.length).toBe(0);
    })
    test("should display 0 for element with id of score", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    })
    test("set the turnNumber to 0", () => {
        expect(game.turnNumber).toEqual(0);
    })
    test("Data-listener when clicked is set to true", () => {
        let elements = document.getElementsByClassName("circle")
        for(let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true")
        }
    })
    test("lastButton key exists", () => {
        expect("lastButton" in game).toBe(true)
    })
    test("turnInProgress key exists", () => {
        expect("turnInProgress" in game).toBe(true)
    })
    test("turnInProgress key to be false", () => {
        expect("turnInProgres" in game).toBe(false)
    })
});

describe("gameplay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    })
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    })
    test("addTurn adds a new turn to the game", () => {
        addTurn()
        expect(game.currentGame.length).toBe(2);
    })
    test("should add correct class to button to light it up", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    })

    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0)
    })
    test("should incriment the score if the turn is correct", () => {
        game.playerMoves.push(game.currentGame[0])
        playerTurn()
        expect(game.score).toBe(1)
    })
    test("should call alert if the move is incorrect", () => {
        game.playerMoves.push("wrong")
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong Move!")
    })
    test("should toggle turnInProgress to True", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true)
    })
    test("clicking during computer turn should fail", () => {
        showTurns()
        game.lastButton = "";
        document.getElementById("button2").click()
        expect(game.lastButton).toEqual("")
    })

})