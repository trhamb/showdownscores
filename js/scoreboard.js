document.addEventListener("DOMContentLoaded", () => {
    p1_score = 0;
    p2_score = 0;
    p1_sets = 0;
    p2_sets = 0;

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
    const clear_button = document.querySelector("#clear");
    const reset_button = document.querySelector("#reset");

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

    // Check Set Winner Function
    function checkSetWinner() {
        if (p1_score >= 11 && p1_score - p2_score >= 2) {
            speak("Set to Player One");
            p1_sets += 1;
            set_display_p1.textContent = p1_sets;
            resetScores();
        } else if (p2_score >= 11 && p2_score - p1_score >= 2) {
            speak("Set to Player Two");
            p2_sets += 1;
            set_display_p2.textContent = p2_sets;
            resetScores();
        }
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
        speak(`Player One: ${p1_score}`);
        checkSetWinner();
    });

    // P1 Foul
    foul_button_p1.addEventListener("click", () => {
        p2_score += 1;
        score_display_p2.textContent = p2_score;
        speak(`Player One Foul. Player Two Score: ${p2_score}`);
        checkSetWinner();
    });

    // P2 Goal
    goal_button_p2.addEventListener("click", () => {
        p2_score += 2;
        score_display_p2.textContent = p2_score;
        speak(`Player Two: ${p2_score}`);
        checkSetWinner();
    });

    // P2 Foul
    foul_button_p2.addEventListener("click", () => {
        p1_score += 1;
        score_display_p1.textContent = p1_score;
        speak(`Player Two Foul. Player One Score: ${p1_score}`);
        checkSetWinner();
    });
});
