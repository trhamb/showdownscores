document.addEventListener("DOMContentLoaded", () => {
    // Get required elements
    const score_display_left = document.querySelector(
        ".score-left .content-wrapper .scoreboard p"
    );
    const score_display_right = document.querySelector(
        ".score-right .content-wrapper .scoreboard p"
    );
    const goal_button_left = document.querySelector(".score-left #goal-button");
    const foul_button_left = document.querySelector(".score-left #foul-button");
    const goal_button_right = document.querySelector(
        ".score-right #goal-button"
    );
    const foul_button_right = document.querySelector(
        ".score-right #foul-button"
    );
    const clear_button = document.querySelector("#clear");
    const reset_button = document.querySelector("#reset");

    // EVENT LISTENERS!
    // P1 Goal
    goal_button_left.addEventListener("click", () => {
        score_display_left.textContent =
            parseInt(score_display_left.textContent) + 2;
    });

    // P1 Foul
    foul_button_left.addEventListener("click", () => {
        score_display_right.textContent =
            parseInt(score_display_right.textContent) + 1;
    });

    // P2 Goal
    goal_button_right.addEventListener("click", () => {
        score_display_right.textContent =
            parseInt(score_display_right.textContent) + 2;
    });

    // P2 Foul
    foul_button_right.addEventListener("click", () => {
        score_display_left.textContent =
            parseInt(score_display_left.textContent) + 1;
    });
});
