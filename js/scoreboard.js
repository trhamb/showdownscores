document.addEventListener("DOMContentLoaded", () => {
    p1_score = 0;
    p2_score = 0;
    p1_sets = 0;
    p2_sets = 0;
    p1_name = "";
    p2_name = "";
    let actionHistory = [];
    const MAX_HISTORY = 5;
    let currentServer = 1;
    let actionsInCurrentServe = 0;
    const p1ServingIndicator = document.querySelector(".p1-serving");
    const p2ServingIndicator = document.querySelector(".p2-serving");

    const left_scoreboard = document.querySelector(".score-left .scoreboard");
    const right_scoreboard = document.querySelector(".score-right .scoreboard");

    let speechQueue = [];
    let isSpeaking = false;

    let gameStarted = false;

    // Get required elements
    const score_display_p1 = document.querySelector(
        ".score-left .content-wrapper .scoreboard p"
    );
    const score_display_p2 = document.querySelector(
        ".score-right .content-wrapper .scoreboard p"
    );
    const set_display_p1 = document.querySelector("#p1-sets");
    const set_display_p2 = document.querySelector("#p2-sets");
    const goal_button_p1 = document.querySelector(".score-left #goal-button");
    const foul_button_p1 = document.querySelector(".score-left #foul-button");
    const goal_button_p2 = document.querySelector(".score-right #goal-button");
    const foul_button_p2 = document.querySelector(".score-right #foul-button");
    const history = document.querySelector("#game-history");
    const undo_button = document.querySelector("#undo");
    const reset_button = document.querySelector("#reset");
    const playerSetup = document.querySelector("#player-setup");
    const startGameButton = document.querySelector("#start-game");
    const p1NameInput = document.querySelector("#p1-name");
    const p2NameInput = document.querySelector("#p2-name");

    // Add keyboard controls
    document.addEventListener("keydown", (event) => {
        if (!gameStarted) return;

        switch (event.key.toLowerCase()) {
            case "q":
                goal_button_p1.click();
                break;
            case "a":
                foul_button_p1.click();
                break;
            case "w":
                undo_button.click();
                break;
            case "s":
                reset_button.click();
                break;
            case "e":
                goal_button_p2.click();
                break;
            case "d":
                foul_button_p2.click();
                break;
        }
    });

    function startGame() {
        gameStarted = true;
        // Get player names from inputs
        p1_name = p1NameInput.value.trim() || "Player 1";
        p2_name = p2NameInput.value.trim() || "Player 2";

        // Update the h2 elements with player names
        document.querySelector(".p1").textContent = p1_name;
        document.querySelector(".p2").textContent = p2_name;

        // Perform coin toss
        const coinToss = Math.random() >= 0.5;
        currentServer = coinToss ? 1 : 2;

        // Update border colors based on coin toss result
        left_scoreboard.style.borderColor =
            currentServer === 1 ? "green" : "rgb(37, 37, 37)";
        right_scoreboard.style.borderColor =
            currentServer === 2 ? "green" : "rgb(37, 37, 37)";

        // Hide the setup overlay
        playerSetup.style.display = "none";

        // Update History
        updateHistory("Game Started");

        // Announce game start and serve
        const firstServer = currentServer === 1 ? p1_name : p2_name;
        speak(
            `Game starting. ${p1_name} versus ${p2_name}. Coin toss result: ${firstServer} to serve first`
        );
    }

    function recordAction(type, player) {
        const action = {
            type: type,
            player: player,
            serveCount: actionsInCurrentServe,
            server: currentServer,
            p1Score: p1_score,
            p2Score: p2_score,
        };

        actionHistory.push(action);
        if (actionHistory.length > MAX_HISTORY) {
            actionHistory.shift();
        }
    }

    function undoLastAction() {
        try {
            const lastAction = actionHistory.pop();
            if (!lastAction) return;

            // Restore previous scores
            p1_score = lastAction.p1Score;
            p2_score = lastAction.p2Score;
            score_display_p1.textContent = p1_score;
            score_display_p2.textContent = p2_score;

            // Restore serve state
            actionsInCurrentServe = lastAction.serveCount;
            currentServer = lastAction.server;

            // Update visual indicators
            const activeBorderColor =
                actionsInCurrentServe === 0 ? "green" : "orange";
            left_scoreboard.style.borderColor =
                currentServer === 1 ? activeBorderColor : "rgb(37, 37, 37)";
            right_scoreboard.style.borderColor =
                currentServer === 2 ? activeBorderColor : "rgb(37, 37, 37)";

            // Remove last history entry
            if (history.lastChild) {
                history.removeChild(history.lastChild);
            }

            // Announce undo
            speak(
                `Undoing last ${lastAction.type} for ${
                    lastAction.player === 1 ? p1_name : p2_name
                }`
            );
        } catch (e) {
            console.error(e);
        }
    }

    // Speech and Queueing
    function speak(text) {
        if (!responsiveVoice) {
            console.error(
                "RespionsiveVoice not loaded. Text-to-speech may be unavailable."
            );
            return;
        }

        speechQueue.push(text);

        if (!isSpeaking) {
            processSpeechQueue();
        }
    }

    function processSpeechQueue() {
        if (speechQueue.length === 0) {
            isSpeaking = false;
            return;
        }

        isSpeaking = true;
        const textToSpeak = speechQueue.shift();

        try {
            responsiveVoice.speak(textToSpeak, "UK English Male", {
                pitch: 1,
                rate: 1,
                volume: 1,
                onend: processSpeechQueue,
                onerror: (e) => {
                    console.error("Speech error:", e);
                    isSpeaking = false;
                    processSpeechQueue(); // Continue with next item
                },
            });
        } catch (e) {
            console.error("Speech processing error:", e);
            isSpeaking = false;
            processSpeechQueue();
        }
    }

    function updateHistory(customMessage = null) {
        let historyItem = document.createElement("p");

        if (customMessage) {
            historyItem.textContent = customMessage;
        } else {
            historyItem.textContent = `${p1_name} ${p1_score} - ${p2_score} ${p2_name}`;
        }

        history.appendChild(historyItem);

        history.scrollTop = history.scrollHeight;
    }

    function checkSetWinner() {
        if (p1_score >= 11 && p1_score - p2_score >= 2) {
            speak(`Set to ${p1_name}`);
            speak(`New set`);
            updateHistory(`${p1_name} wins the set`);
            p1_sets += 1;
            set_display_p1.textContent = p1_sets;
            currentServer = 2;
            actionsInCurrentServe = 0;
            resetScores();
            // Announce next server based on currentServer value
            speak(`${currentServer === 1 ? p1_name : p2_name} to serve`);
            return true;
        } else if (p2_score >= 11 && p2_score - p1_score >= 2) {
            speak(`Set to ${p2_name}`);
            speak(`New set`);
            updateHistory(`${p2_name} wins the set`);
            p2_sets += 1;
            set_display_p2.textContent = p2_sets;
            currentServer = 1;
            actionsInCurrentServe = 0;
            resetScores();
            // Announce next server based on currentServer value
            speak(`${currentServer === 1 ? p1_name : p2_name} to serve`);
            return true;
        }
        return false;
    }

    function updateServe() {
        actionsInCurrentServe++;

        const firstServeBorder = "green";
        const secondServeBorder = "orange";
        const defaultBorder = "rgb(37, 37, 37)";

        if (actionsInCurrentServe === 1) {
            speak("Second Serve");
        }

        if (actionsInCurrentServe >= 2) {
            currentServer = currentServer === 1 ? 2 : 1;
            actionsInCurrentServe = 0;
            if (currentServer === 1) {
                speak(`${p1_name} to serve.`);
            } else {
                speak(`${p2_name} to serve.`);
            }
        }

        const activeBorderColor =
            actionsInCurrentServe === 0 ? firstServeBorder : secondServeBorder;

        left_scoreboard.style.borderColor =
            currentServer === 1 ? activeBorderColor : defaultBorder;
        right_scoreboard.style.borderColor =
            currentServer === 2 ? activeBorderColor : defaultBorder;
    }

    function resetScores() {
        p1_score = 0;
        p2_score = 0;
        score_display_p1.textContent = p1_score;
        score_display_p2.textContent = p2_score;

        // Switch server at the start of new set
        currentServer = currentServer === 1 ? 2 : 1;
        actionsInCurrentServe = 0;

        // Reset border colors for new set
        const firstServeBorder = "green";
        const defaultBorder = "rgb(37, 37, 37)";

        left_scoreboard.style.borderColor =
            currentServer === 1 ? firstServeBorder : defaultBorder;
        right_scoreboard.style.borderColor =
            currentServer === 2 ? firstServeBorder : defaultBorder;
    }

    goal_button_p1.addEventListener("click", () => {
        p1_score += 2;
        score_display_p1.textContent = p1_score;
        speak(
            `${p1_name} Goal. ${p1_name}: ${p1_score}, ${p2_name}: ${p2_score}`
        );
        recordAction("goal", 1);
        updateHistory();
        const setWon = checkSetWinner();
        if (!setWon) {
            updateServe();
        }
    });

    foul_button_p1.addEventListener("click", () => {
        p2_score += 1;
        score_display_p2.textContent = p2_score;
        speak(
            `${p1_name} Foul. ${p2_name} Score: ${p2_score}, ${p1_name} score: ${p1_score}`
        );
        recordAction("foul", 1);
        updateHistory();
        const setWon = checkSetWinner();
        if (!setWon) {
            updateServe();
        }
    });

    goal_button_p2.addEventListener("click", () => {
        p2_score += 2;
        score_display_p2.textContent = p2_score;
        speak(
            `${p2_name} Goal. ${p2_name}: ${p2_score}, ${p1_name}: ${p1_score}`
        );
        recordAction("goal", 2);
        updateHistory();
        const setWon = checkSetWinner();
        if (!setWon) {
            updateServe();
        }
    });

    foul_button_p2.addEventListener("click", () => {
        p1_score += 1;
        score_display_p1.textContent = p1_score;
        speak(
            `${p2_name} Foul. ${p1_name} Score: ${p1_score}, ${p2_name} score: ${p2_score}`
        );
        recordAction("foul", 2);
        updateHistory();
        const setWon = checkSetWinner();
        if (!setWon) {
            updateServe();
        }
    });

    left_scoreboard.style.borderColor = "green";
    right_scoreboard.style.borderColor = "rgb(37, 37, 37)";

    startGameButton.addEventListener("click", () => {
        console.log("Start button clicked");
        startGame();
    });

    undo_button.addEventListener("click", () => {
        undoLastAction();
    });

    reset_button.addEventListener("click", () => {
        window.location.reload();
    });
});
