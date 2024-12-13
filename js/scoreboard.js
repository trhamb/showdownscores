document.addEventListener("DOMContentLoaded", () => {
    p1_score = 0;
    p2_score = 0;
    p1_sets = 0;
    p2_sets = 0;
    p1_name = "Jack";
    p2_name = "Sally";
    let lastAction = null;
    let currentServer = 1;
    let actionsInCurrentServe = 0;
    const p1ServingIndicator = document.querySelector(".p1-serving");
    const p2ServingIndicator = document.querySelector(".p2-serving");

    const left_scoreboard = document.querySelector(".score-left .scoreboard");

    const right_scoreboard = document.querySelector(".score-right .scoreboard");

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

    // Undo last action
    function undoLastAction() {
        try {
            if (!lastAction) return;

            if (lastAction.type === "goal") {
                if (lastAction.player === 1) {
                    p1_score -= 2;
                    score_display_p1.textContent = p1_score;
                    speak(`Undoing last goal for ${p1_name}`);
                } else {
                    p2_score -= 2;
                    score_display_p2.textContent = p2_score;
                    speak(`Undoing last goal for ${p2_name}`);
                }
            } else if (lastAction.type === "foul") {
                if (lastAction.player === 1) {
                    p2_score -= 1;
                    score_display_p2.textContent = p2_score;
                    speak(`Undoing last foul for ${p1_name}`);
                } else {
                    p1_score -= 1;
                    score_display_p1.textContent = p1_score;
                    speak(`Undoing last foul for ${p2_name}`);
                }
            }

            if (history.lastChild) {
                history.removeChild(history.lastChild);
            }

            actionsInCurrentServe = lastAction.serveCount;
            currentServer = lastAction.server;

            const activeBorderColor =
                actionsInCurrentServe === 0 ? "green" : "orange";
            left_scoreboard.style.borderColor =
                currentServer === 1 ? activeBorderColor : "rgb(37, 37, 37)";
            right_scoreboard.style.borderColor =
                currentServer === 2 ? activeBorderColor : "rgb(37, 37, 37)";

            lastAction = null;
        } catch (e) {
            console.error(e);
        }
    }

    // Speak code
    function speak(text) {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.land = "en-GB";
            utterance.rate = 1;
            utterance.pitch = 1;

            window.speechSynthesis.speak(utterance);
        } else {
            console.log("Speech synthesis not supported in this browser.");
        }
    }

    function updateHistory() {
        let historyItem = document.createElement("p");
        historyItem.textContent = `${p1_name} ${p1_score} - ${p2_score} ${p2_name}`;
        history.appendChild(historyItem);
    }

    // Check Set Winner Function
    function checkSetWinner() {
        if (p1_score >= 11 && p1_score - p2_score >= 2) {
            speak(`Set to ${p1_name}`);
            p1_sets += 1;
            set_display_p1.textContent = p1_sets;
            resetScores();
        } else if (p2_score >= 11 && p2_score - p1_score >= 2) {
            speak(`Set to ${p2_name}`);
            p2_sets += 1;
            set_display_p2.textContent = p2_sets;
            resetScores();
        }
    }

    // Add this function to handle serve switching
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

        // If it's first serve use green, if second serve use orange
        const activeBorderColor =
            actionsInCurrentServe === 0 ? firstServeBorder : secondServeBorder;

        left_scoreboard.style.borderColor =
            currentServer === 1 ? activeBorderColor : defaultBorder;
        right_scoreboard.style.borderColor =
            currentServer === 2 ? activeBorderColor : defaultBorder;
    }

    // Check Game Winner

    // Reset scores for a new set
    function resetScores() {
        p1_score = 0;
        p2_score = 0;
        score_display_p1.textContent = p1_score;
        score_display_p2.textContent = p2_score;
    }

    // EVENT LISTENERS!
    // P1 Goal
    goal_button_p1.addEventListener("click", () => {
        p1_score += 2;
        score_display_p1.textContent = p1_score;
        speak(`${p1_name}: ${p1_score}, ${p2_name}: ${p2_score}`);
        lastAction = {
            type: "goal",
            player: 1,
            serveCount: actionsInCurrentServe,
            server: currentServer,
        };
        updateHistory();
        updateServe();
        checkSetWinner();
    });

    // P1 Foul
    foul_button_p1.addEventListener("click", () => {
        p2_score += 1;
        score_display_p2.textContent = p2_score;
        speak(
            `${p1_name} Foul. ${p2_name} Score: ${p2_score}, ${p1_name} score: ${p1_score}`
        );
        lastAction = {
            type: "foul",
            player: 1,
            serveCount: actionsInCurrentServe,
            server: currentServer,
        };
        updateHistory();
        checkSetWinner();
        updateServe();
    });

    // P2 Goal
    goal_button_p2.addEventListener("click", () => {
        p2_score += 2;
        score_display_p2.textContent = p2_score;
        speak(`${p2_name}: ${p2_score}, ${p1_name}: ${p1_score}`);
        lastAction = {
            type: "goal",
            player: 2,
            serveCount: actionsInCurrentServe,
            server: currentServer,
        };
        updateHistory();
        checkSetWinner();
        updateServe();
    });

    // P2 Foul
    foul_button_p2.addEventListener("click", () => {
        p1_score += 1;
        score_display_p1.textContent = p1_score;
        speak(
            `${p2_name} Foul. ${p1_name} Score: ${p1_score}, ${p2_name} score: ${p2_score}`
        );
        lastAction = {
            type: "foul",
            player: 2,
            serveCount: actionsInCurrentServe,
            server: currentServer,
        };
        updateHistory();
        checkSetWinner();
        updateServe();
    });

    // Initialise Serve Display
    left_scoreboard.style.borderColor = "green";
    right_scoreboard.style.borderColor = "rgb(37, 37, 37)";

    // UNDO LAST ACTION
    undo_button.addEventListener("click", () => {
        undoLastAction();
    });
});
