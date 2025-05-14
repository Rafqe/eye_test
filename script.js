let currentRotation = 0;
let currentAttempt = 0;
let currentEye = "right";
let currentTest = "acuity";
let attempts = 0;
let correctAnswers = 0;
let letterSize = 200;
let rightEyeResults = { correct: 0, incorrect: 0 };
let leftEyeResults = { correct: 0, incorrect: 0 };
let previousRotation = null;
let astigmatismResults = {
  right: { correct: 0, incorrect: 0 },
  left: { correct: 0, incorrect: 0 },
};
let currentAstigmatismImage = 1;

// Acuity test variables
let currentSizeLevel = 0;
let sizeLevels = [200, 160, 100, 50, 32, 20, 10];
let attemptsAtCurrentSize = 0;
let correctAtCurrentSize = 0;
let totalAttempts = 0;
let additionalAttempts = 0;
const MAX_TOTAL_ATTEMPTS = 16;
const MAX_ADDITIONAL_ATTEMPTS = 2;

// Size calibration variables
let currentSize = 1;
let calibrationSettings = {
  size: 1,
};

// Add Landolt C test variables
let landoltResults = {
  right: { correct: 0, incorrect: 0 },
  left: { correct: 0, incorrect: 0 },
};
let currentLandoltRotation = 0;
let landoltContrast = 100;
let landoltAttempts = 0;

// Contrast Test Variables
let currentContrast = 100;
let contrastTestResults = {
  rightEye: { correct: 0, incorrect: 0, lowestVisible: 100, attempts: 0 },
  leftEye: { correct: 0, incorrect: 0, lowestVisible: 100, attempts: 0 },
};
let isRightEyeContrast = true;
let currentContrastRotation = 0;
let previousContrastRotation = null;
let currentContrastSize = 200; // Starting size in pixels
const CONTRAST_ATTEMPTS_PER_EYE = 10;

const letterE = document.getElementById("letterE");
const result = document.getElementById("result");
const attemptsCount = document.getElementById("attemptsCount");
const progressBar = document.querySelector(".progress");
const steps = document.querySelectorAll(".step");
const astigmatismImage = document.getElementById("astigmatismImage");

// Function to show a specific screen
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
  });
  document.getElementById(screenId).classList.remove("hidden");
}

// Function to update the letter size
function updateLetterSize() {
  const baseSize = 200;
  const sizeReduction = Math.floor(attempts / 2) * 45;
  const newSize = Math.max(20, baseSize - sizeReduction);

  letterE.style.width = `${newSize}px`;
  letterE.style.height = `${newSize}px`;
}

// Function to update attempts count
function updateAttemptsCount() {
  attemptsCount.textContent = currentAttempt;
}

// Function to rotate the letter E
function rotateLetter() {
  const rotations = [0, 90, 180, 270];
  let newRotation;

  do {
    newRotation = rotations[Math.floor(Math.random() * rotations.length)];
  } while (newRotation === previousRotation);

  currentRotation = newRotation;
  previousRotation = newRotation;
  letterE.style.transform = `rotate(${currentRotation}deg)`;
}

// Function to check the answer
function checkAnswer(direction) {
  let correctDirection;

  switch (currentRotation) {
    case 0:
      correctDirection = "right";
      break;
    case 90:
      correctDirection = "down";
      break;
    case 180:
      correctDirection = "left";
      break;
    case 270:
      correctDirection = "up";
      break;
  }

  const isCorrect = direction === correctDirection;
  attemptsAtCurrentSize++;
  totalAttempts++;

  if (isCorrect) {
    correctAtCurrentSize++;
    if (currentEye === "right") {
      rightEyeResults.correct++;
    } else {
      leftEyeResults.correct++;
    }
  } else {
    if (currentEye === "right") {
      rightEyeResults.incorrect++;
    } else {
      leftEyeResults.incorrect++;
    }
  }

  console.log(
    `Attempt ${attemptsAtCurrentSize} at size ${sizeLevels[currentSizeLevel]}, Correct: ${correctAtCurrentSize}, Total attempts: ${totalAttempts}`
  );

  // Check if we've reached maximum attempts
  if (totalAttempts >= MAX_TOTAL_ATTEMPTS) {
    console.log("Reached maximum attempts, moving to next eye or test");
    if (currentEye === "right") {
      currentEye = "left";
      currentSizeLevel = 0;
      attemptsAtCurrentSize = 0;
      correctAtCurrentSize = 0;
      totalAttempts = 0;
      additionalAttempts = 0;
      showScreen("leftEyeInstructions");
      return;
    } else {
      currentTest = "astigmatism";
      showScreen("astigmatismInstructions");
      return;
    }
  }

  // Logic for size progression
  if (attemptsAtCurrentSize >= 2) {
    console.log(
      `Completed 2 attempts at size ${sizeLevels[currentSizeLevel]}, Correct: ${correctAtCurrentSize}`
    );

    if (correctAtCurrentSize === 2) {
      // All correct, move to next size
      console.log(
        `All correct at size ${sizeLevels[currentSizeLevel]}, moving to next level`
      );
      currentSizeLevel++;
      attemptsAtCurrentSize = 0;
      correctAtCurrentSize = 0;
      additionalAttempts = 0;
    } else {
      // Less than 2 correct, give additional attempts
      if (additionalAttempts < MAX_ADDITIONAL_ATTEMPTS) {
        console.log(
          `Less than 2 correct, giving additional attempt ${
            additionalAttempts + 1
          }`
        );
        additionalAttempts++;
        attemptsAtCurrentSize = 0;
        correctAtCurrentSize = 0;
      } else {
        // Failed additional attempts, stop at current level
        console.log(
          `Failed additional attempts at size ${sizeLevels[currentSizeLevel]}, stopping test`
        );
        if (currentEye === "right") {
          currentEye = "left";
          currentSizeLevel = 0;
          attemptsAtCurrentSize = 0;
          correctAtCurrentSize = 0;
          totalAttempts = 0;
          additionalAttempts = 0;
          showScreen("leftEyeInstructions");
          return;
        } else {
          currentTest = "astigmatism";
          showScreen("astigmatismInstructions");
          return;
        }
      }
    }
  }

  // Update letter size
  letterSize = sizeLevels[currentSizeLevel];
  console.log(`Setting new letter size: ${letterSize}`);
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;
  letterE.style.fontSize = `${letterSize}px`;

  rotateLetter();
  updateProgress();
}

// Function to show results
function showResults() {
  // Update basic results first
  document.getElementById("rightEyeCorrect").textContent =
    rightEyeResults.correct;
  document.getElementById("rightEyeIncorrect").textContent =
    rightEyeResults.incorrect;
  document.getElementById("leftEyeCorrect").textContent =
    leftEyeResults.correct;
  document.getElementById("leftEyeIncorrect").textContent =
    leftEyeResults.incorrect;

  // Update with Snellen fractions
  const rightEyeAcuity = calculateSnellenFraction(rightEyeResults.correct);
  const leftEyeAcuity = calculateSnellenFraction(leftEyeResults.correct);

  document.getElementById("rightEyeAcuity").textContent = rightEyeAcuity;
  document.getElementById("leftEyeAcuity").textContent = leftEyeAcuity;

  document.getElementById("rightEyeAstigmatism").textContent =
    astigmatismResults.right.correct >= 1 ? "Normal" : "Possible Astigmatism";
  document.getElementById("leftEyeAstigmatism").textContent =
    astigmatismResults.left.correct >= 1 ? "Normal" : "Possible Astigmatism";

  // Update contrast results
  const rightEyeContrastScore = contrastTestResults.rightEye.correct;
  const leftEyeContrastScore = contrastTestResults.leftEye.correct;

  const rightEyeContrast = Math.min(100, rightEyeContrastScore * 10);
  const leftEyeContrast = Math.min(100, leftEyeContrastScore * 10);

  document.getElementById("rightEyeContrastCorrect").textContent =
    contrastTestResults.rightEye.correct;
  document.getElementById("rightEyeContrastIncorrect").textContent =
    contrastTestResults.rightEye.incorrect;
  document.getElementById(
    "rightEyeContrast"
  ).textContent = `${rightEyeContrast}%`;

  document.getElementById("leftEyeContrastCorrect").textContent =
    contrastTestResults.leftEye.correct;
  document.getElementById("leftEyeContrastIncorrect").textContent =
    contrastTestResults.leftEye.incorrect;
  document.getElementById(
    "leftEyeContrast"
  ).textContent = `${leftEyeContrast}%`;

  // Create and show summary view
  const resultsContainer = document.querySelector(".results-container");
  resultsContainer.innerHTML = `
    <div class="results-summary">
      <h2>Test Results Summary</h2>
      <div class="summary-content">
        <div class="summary-section">
          <h3>Visual Acuity</h3>
          <p>Right Eye: ${rightEyeAcuity}</p>
          <p>Left Eye: ${leftEyeAcuity}</p>
        </div>
        <div class="summary-section">
          <h3>Astigmatism</h3>
          <p>Right Eye: ${
            astigmatismResults.right.correct >= 1
              ? "Normal"
              : "Possible Astigmatism"
          }</p>
          <p>Left Eye: ${
            astigmatismResults.left.correct >= 1
              ? "Normal"
              : "Possible Astigmatism"
          }</p>
        </div>
        <div class="summary-section">
          <h3>Contrast Sensitivity</h3>
          <p>Right Eye: ${rightEyeContrast}%</p>
          <p>Left Eye: ${leftEyeContrast}%</p>
        </div>
        <button onclick="showDetailedResults()" class="more-info-btn">More Information</button>
      </div>
    </div>
  `;

  showScreen("resultsScreen");
  updateProgress();
}

function showDetailedResults() {
  const detailedResultsPage = document.createElement("div");
  detailedResultsPage.className = "detailed-results-page";
  detailedResultsPage.innerHTML = `
    <div class="detailed-results-container">
      <h1>Test Results Analysis</h1>
      
      <div class="results-section">
        <h2>Your Results</h2>
        <div class="results-grid">
          <div class="result-card">
            <h3>Visual Acuity</h3>
            <div class="result-details">
              <p><strong>Right Eye:</strong> ${calculateSnellenFraction(
                rightEyeResults.correct
              )}</p>
              <p><strong>Left Eye:</strong> ${calculateSnellenFraction(
                leftEyeResults.correct
              )}</p>
            </div>
          </div>
          
          <div class="result-card">
            <h3>Astigmatism</h3>
            <div class="result-details">
              <p><strong>Right Eye:</strong> ${
                astigmatismResults.right.correct >= 1
                  ? "Normal"
                  : "Possible Astigmatism"
              }</p>
              <p><strong>Left Eye:</strong> ${
                astigmatismResults.left.correct >= 1
                  ? "Normal"
                  : "Possible Astigmatism"
              }</p>
            </div>
          </div>
          
          <div class="result-card">
            <h3>Contrast Sensitivity</h3>
            <div class="result-details">
              <p><strong>Right Eye:</strong> ${Math.min(
                100,
                contrastTestResults.rightEye.correct * 10
              )}%</p>
              <p><strong>Left Eye:</strong> ${Math.min(
                100,
                contrastTestResults.leftEye.correct * 10
              )}%</p>
            </div>
          </div>
        </div>
      </div>

      <div class="health-section">
        <h2>Understanding Your Results</h2>
        
        <div class="health-card">
          <h3>Visual Acuity</h3>
          <div class="health-content">
            <div class="result-interpretation">
              <h4>Your Results:</h4>
              <ul>
                ${getAcuityHealthInfo(rightEyeResults.correct, "Right")}
                ${getAcuityHealthInfo(leftEyeResults.correct, "Left")}
              </ul>
            </div>
            
            <div class="health-info">
              <h4>What This Means:</h4>
              <ul>
                <li>20/20: Normal vision - You can see at 20 feet what a person with normal vision sees at 20 feet</li>
                <li>20/40: You can see at 20 feet what a person with normal vision sees at 40 feet</li>
                <li>20/200: Legal blindness - You can see at 20 feet what a person with normal vision sees at 200 feet</li>
              </ul>
            </div>
            
            <div class="warning-signs">
              <h4>When to See a Doctor:</h4>
              <ul>
                <li>Vision worse than 20/40</li>
                <li>Significant difference between eyes</li>
                <li>Frequent headaches or eye strain</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="health-card">
          <h3>Astigmatism</h3>
          <div class="health-content">
            <div class="result-interpretation">
              <h4>Your Results:</h4>
              <ul>
                ${getAstigmatismHealthInfo(
                  astigmatismResults.right.correct,
                  "Right"
                )}
                ${getAstigmatismHealthInfo(
                  astigmatismResults.left.correct,
                  "Left"
                )}
              </ul>
            </div>
            
            <div class="health-info">
              <h4>What This Means:</h4>
              <p>Astigmatism is a common condition where the cornea or lens has an irregular shape, causing blurred vision at all distances.</p>
            </div>
            
            <div class="warning-signs">
              <h4>When to See a Doctor:</h4>
              <ul>
                <li>Blurred vision at any distance</li>
                <li>Eye strain or headaches</li>
                <li>Difficulty seeing at night</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="health-card">
          <h3>Contrast Sensitivity</h3>
          <div class="health-content">
            <div class="result-interpretation">
              <h4>Your Results:</h4>
              <ul>
                ${getContrastHealthInfo(
                  contrastTestResults.rightEye.correct * 10,
                  "Right"
                )}
                ${getContrastHealthInfo(
                  contrastTestResults.leftEye.correct * 10,
                  "Left"
                )}
              </ul>
            </div>
            
            <div class="health-info">
              <h4>What This Means:</h4>
              <p>Contrast sensitivity measures your ability to distinguish objects from their background. It's crucial for:</p>
              <ul>
                <li>Night driving</li>
                <li>Reading in low light</li>
                <li>Recognizing faces</li>
              </ul>
            </div>
            
            <div class="warning-signs">
              <h4>When to See a Doctor:</h4>
              <ul>
                <li>Contrast sensitivity below 60%</li>
                <li>Difficulty seeing in low light</li>
                <li>Problems with night driving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="disclaimer">
        <p><strong>Note:</strong> This test is not a substitute for a professional eye examination. Regular eye exams are essential for maintaining eye health.</p>
      </div>

      <button onclick="returnToSummary()" class="back-btn">Back to Summary</button>
    </div>
  `;

  const resultsContainer = document.querySelector(".results-container");
  resultsContainer.innerHTML = "";
  resultsContainer.appendChild(detailedResultsPage);
}

function returnToSummary() {
  showResults();
}

function getAcuityHealthInfo(correctAnswers, eye) {
  const snellenFraction = calculateSnellenFraction(correctAnswers);
  let healthStatus = "";

  if (correctAnswers >= 14) {
    healthStatus = `<li><strong>${eye} Eye:</strong> Excellent vision (${snellenFraction}). Your visual acuity is very good.</li>`;
  } else if (correctAnswers >= 10) {
    healthStatus = `<li><strong>${eye} Eye:</strong> Good vision (${snellenFraction}). Your visual acuity is above average.</li>`;
  } else if (correctAnswers >= 6) {
    healthStatus = `<li><strong>${eye} Eye:</strong> Moderate vision (${snellenFraction}). You may benefit from a comprehensive eye exam.</li>`;
  } else {
    healthStatus = `<li><strong>${eye} Eye:</strong> Reduced vision (${snellenFraction}). Consider consulting an eye care professional.</li>`;
  }
  return healthStatus;
}

function getAstigmatismHealthInfo(correctAnswers, eye) {
  let healthStatus = "";
  if (correctAnswers >= 1) {
    healthStatus = `<li><strong>${eye} Eye:</strong> Normal astigmatism test results. No significant astigmatism detected.</li>`;
  } else {
    healthStatus = `<li><strong>${eye} Eye:</strong> Possible astigmatism detected. Consider a comprehensive eye exam.</li>`;
  }
  return healthStatus;
}

function getContrastHealthInfo(score, eye) {
  let healthStatus = "";
  if (score >= 90) {
    healthStatus = `<li><strong>${eye} Eye:</strong> Excellent contrast sensitivity (${score}%). Your ability to distinguish objects from their background is very good.</li>`;
  } else if (score >= 70) {
    healthStatus = `<li><strong>${eye} Eye:</strong> Good contrast sensitivity (${score}%). Your vision in low-contrast situations is above average.</li>`;
  } else if (score >= 50) {
    healthStatus = `<li><strong>${eye} Eye:</strong> Moderate contrast sensitivity (${score}%). You may experience some difficulty in low-light conditions.</li>`;
  } else {
    healthStatus = `<li><strong>${eye} Eye:</strong> Reduced contrast sensitivity (${score}%). Consider consulting an eye care professional for a comprehensive evaluation.</li>`;
  }
  return healthStatus;
}

// Function to restart the test
function restartTest() {
  // Reset all test variables
  currentEye = "right";
  currentTest = "acuity";
  currentSizeLevel = 0;
  attemptsAtCurrentSize = 0;
  correctAtCurrentSize = 0;
  totalAttempts = 0;
  additionalAttempts = 0;
  letterSize = sizeLevels[0];

  rightEyeResults = { correct: 0, incorrect: 0 };
  leftEyeResults = { correct: 0, incorrect: 0 };
  astigmatismResults = {
    right: { correct: 0, incorrect: 0 },
    left: { correct: 0, incorrect: 0 },
  };
  landoltResults = {
    right: { correct: 0, incorrect: 0 },
    left: { correct: 0, incorrect: 0 },
  };
  landoltContrast = 100;
  landoltAttempts = 0;

  // Reset calibration
  currentSize = 1;
  document.getElementById("sizeValue").textContent = "100%";
  document.getElementById("cardReference").style.transform = "scale(1)";
  document.getElementById("sizeSlider").value = 100;

  // Reset letter size
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;

  // Reset contrast test variables
  currentContrast = 100;
  currentContrastSize = 200;
  contrastTestResults = {
    rightEye: { correct: 0, incorrect: 0, lowestVisible: 100, attempts: 0 },
    leftEye: { correct: 0, incorrect: 0, lowestVisible: 100, attempts: 0 },
  };
  isRightEyeContrast = true;

  // Reset contrast image
  document.documentElement.style.setProperty("--contrast", "100%");

  // Show welcome screen
  showScreen("welcomeScreen");
  updateProgress();
}

// Update progress bar
function updateProgress() {
  const acuityStep = document.getElementById("acuityStep");
  const astigmatismStep = document.getElementById("astigmatismStep");
  const contrastStep = document.getElementById("contrastStep");

  // Reset all steps
  [acuityStep, astigmatismStep, contrastStep].forEach((step) => {
    step.classList.remove("current", "completed");
  });

  if (currentTest === "acuity") {
    acuityStep.classList.add("current");
  } else if (currentTest === "astigmatism") {
    acuityStep.classList.add("completed");
    astigmatismStep.classList.add("current");
  } else if (currentTest === "contrast") {
    acuityStep.classList.add("completed");
    astigmatismStep.classList.add("completed");
    contrastStep.classList.add("current");
  }
}

// Function to start the test
function startTest() {
  console.log("Starting test for right eye");
  currentEye = "right";
  currentTest = "acuity";
  currentSizeLevel = 0;
  attemptsAtCurrentSize = 0;
  correctAtCurrentSize = 0;
  totalAttempts = 0;
  additionalAttempts = 0;
  letterSize = sizeLevels[0];

  showScreen("testScreen");
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;
  rotateLetter();
  updateProgress();
}

// Function to start left eye test
function startLeftEyeTest() {
  console.log("Starting test for left eye");
  currentEye = "left";
  currentTest = "acuity";
  currentSizeLevel = 0;
  attemptsAtCurrentSize = 0;
  correctAtCurrentSize = 0;
  totalAttempts = 0;
  additionalAttempts = 0;
  letterSize = sizeLevels[0];

  showScreen("testScreen");
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;
  rotateLetter();
  updateProgress();
}

// Handle astigmatism test
function startAstigmatismTest() {
  console.log("Starting astigmatism test for right eye");
  currentTest = "astigmatism";
  currentEye = "right";
  attempts = 0;
  correctAnswers = 0;
  showAstigmatismImage();
  showScreen("astigmatismTest");
  updateProgress();
}

// Start left eye astigmatism test
function startLeftEyeAstigmatismTest() {
  console.log("Starting astigmatism test for left eye");
  currentEye = "left";
  currentTest = "astigmatism";
  attempts = 0;
  correctAnswers = 0;
  showAstigmatismImage();
  showScreen("astigmatismTest");
  updateProgress();
}

// Show random astigmatism test image
function showAstigmatismImage() {
  currentAstigmatismImage = Math.floor(Math.random() * 3) + 1; // Random number 1-3
  astigmatismImage.src = `assets/astigmatism${currentAstigmatismImage}.png`;
  console.log("Showing astigmatism image:", currentAstigmatismImage);
}

// Handle astigmatism answer
function handleAstigmatismAnswer(isCorrect) {
  console.log("Handling astigmatism answer:", {
    isCorrect,
    currentEye,
    attempts,
    currentAstigmatismImage,
  });

  // For image 1, "Yes" is correct (all lines are equal)
  // For images 2 and 3, "No" is correct (lines are different)
  const correctAnswer = currentAstigmatismImage === 1 ? true : false;

  if (isCorrect === correctAnswer) {
    correctAnswers++;
    astigmatismResults[currentEye].correct++;
  } else {
    astigmatismResults[currentEye].incorrect++;
  }

  attempts++;

  if (attempts >= 3) {
    console.log("Reached 3 astigmatism attempts");
    if (currentEye === "right") {
      console.log("Switching to left eye for astigmatism");
      currentEye = "left";
      attempts = 0;
      correctAnswers = 0;
      showScreen("leftEyeAstigmatismInstructions");
    } else {
      console.log("Moving to contrast test");
      showScreen("rightEyeContrastInstructions");
    }
  } else {
    showAstigmatismImage();
  }
  updateProgress();
}

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  // Hide all screens except welcome
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
  });
  document.getElementById("welcomeScreen").classList.remove("hidden");

  // Initialize size slider
  const sizeSlider = document.getElementById("sizeSlider");
  sizeSlider.addEventListener("input", function () {
    currentSize = this.value / 100;
    document.getElementById("sizeValue").textContent = `${this.value}%`;
    document.getElementById(
      "cardReference"
    ).style.transform = `scale(${currentSize})`;
  });
});

function adjustSize(direction) {
  const sizeSlider = document.getElementById("sizeSlider");
  const currentValue = parseInt(sizeSlider.value);

  if (direction === "larger") {
    sizeSlider.value = Math.min(200, currentValue + 1);
  } else {
    sizeSlider.value = Math.max(50, currentValue - 1);
  }

  // Trigger the input event to update the display
  sizeSlider.dispatchEvent(new Event("input"));
}

// Function to calculate Snellen fraction
function calculateSnellenFraction(correctAnswers) {
  // Convert correct answers to Snellen fraction based on size levels
  // sizeLevels = [200, 160, 100, 50, 32, 20, 10]
  const snellenValues = {
    16: "20/20", // Perfect vision
    15: "20/25",
    14: "20/32",
    13: "20/40",
    12: "20/50",
    11: "20/63",
    10: "20/80",
    9: "20/100",
    8: "20/125",
    7: "20/160",
    6: "20/200", // Worst possible result
    5: "20/200",
    4: "20/200",
    3: "20/200",
    2: "20/200",
    1: "20/200",
    0: "20/200",
  };

  // Ensure we don't exceed the maximum possible correct answers
  const adjustedAnswers = Math.min(correctAnswers, 16);
  return snellenValues[adjustedAnswers] || "20/200";
}

// Start the calibration
function startCalibration() {
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("calibrationScreen").classList.remove("hidden");
}

function updateContrast() {
  const contrastSlider = document.getElementById("contrastSlider");
  const contrastPreview = document.getElementById("contrastPreview");
  currentContrast = contrastSlider.value;

  // Convert contrast value to gray level
  const grayLevel = Math.round((currentContrast / 100) * 255);
  const grayColor = `rgb(${grayLevel}, ${grayLevel}, ${grayLevel})`;

  // Update preview with current gray level
  contrastPreview.style.backgroundColor = grayColor;
  contrastPreview.textContent = `${currentContrast}%`;
}

function finishCalibration() {
  // Save calibration settings
  calibrationSettings = {
    size: currentSize,
  };

  // Apply settings to the test
  document.documentElement.style.setProperty("--test-size", `${currentSize}`);

  // Start the test
  document.getElementById("calibrationScreen").classList.add("hidden");
  document.getElementById("rightEyeInstructions").classList.remove("hidden");
  startTest();
}

// Initialize the test
showScreen("rightEyeInstructions");

document.addEventListener("DOMContentLoaded", () => {
  updateProgress();
});

// Add Landolt C test functions
function startLandoltTest() {
  currentTest = "landolt";
  currentEye = "right";
  landoltAttempts = 0;
  landoltContrast = 100;
  showScreen("landoltTest");
  rotateLandoltC();
  updateProgress();
}

function startLeftEyeLandoltTest() {
  currentTest = "landolt";
  currentEye = "left";
  landoltAttempts = 0;
  landoltContrast = 100;
  showScreen("landoltTest");
  rotateLandoltC();
  updateProgress();
}

function rotateLandoltC() {
  const rotations = [0, 90, 180, 270];
  let newRotation;

  do {
    newRotation = rotations[Math.floor(Math.random() * rotations.length)];
  } while (newRotation === previousRotation);

  currentLandoltRotation = newRotation;
  previousRotation = newRotation;

  // Calculate size reduction
  const sizeReduction = (landoltAttempts / 10) * 0.5;
  const currentSize = 1 - sizeReduction;

  // Calculate contrast reduction (from 100% to 2%)
  landoltContrast = Math.max(2, 100 - landoltAttempts * 9.8);

  const landoltC = document.getElementById("landoltC");
  landoltC.style.transform = `rotate(${currentLandoltRotation}deg) scale(${currentSize})`;
  landoltC.style.opacity = `${landoltContrast / 100}`;
}

function checkLandoltAnswer(direction) {
  let correctDirection;

  switch (currentLandoltRotation) {
    case 0:
      correctDirection = "right";
      break;
    case 90:
      correctDirection = "down";
      break;
    case 180:
      correctDirection = "left";
      break;
    case 270:
      correctDirection = "up";
      break;
  }

  if (direction === correctDirection) {
    landoltResults[currentEye].correct++;
  } else {
    landoltResults[currentEye].incorrect++;
  }

  landoltAttempts++;

  if (landoltAttempts >= 10) {
    if (currentEye === "right") {
      currentEye = "left";
      landoltAttempts = 0;
      showScreen("leftEyeLandoltInstructions");
    } else {
      showResults();
    }
  } else {
    rotateLandoltC();
  }
  updateProgress();
}

function startContrastTest() {
  isRightEyeContrast = true;
  currentContrast = 100;
  currentContrastSize = 200;
  contrastTestResults.rightEye.attempts = 0;
  document
    .getElementById("rightEyeContrastInstructions")
    .classList.add("hidden");
  document.getElementById("contrastTest").classList.remove("hidden");
  document.getElementById("contrastImage").src = "assets/C.png";
  rotateContrastC();
  updateContrastImage();
}

function startLeftEyeContrastTest() {
  isRightEyeContrast = false;
  currentContrast = 100;
  currentContrastSize = 200;
  contrastTestResults.leftEye.attempts = 0;
  document
    .getElementById("leftEyeContrastInstructions")
    .classList.add("hidden");
  document.getElementById("contrastTest").classList.remove("hidden");
  document.getElementById("contrastImage").src = "assets/C.png";
  rotateContrastC();
  updateContrastImage();
}

function rotateContrastC() {
  const rotations = [0, 90, 180, 270];
  let newRotation;

  do {
    newRotation = rotations[Math.floor(Math.random() * rotations.length)];
  } while (newRotation === previousContrastRotation);

  currentContrastRotation = newRotation;
  previousContrastRotation = newRotation;
  document.getElementById(
    "contrastImage"
  ).style.transform = `rotate(${currentContrastRotation}deg)`;
}

function handleContrastAnswer(direction) {
  const eye = isRightEyeContrast ? "rightEye" : "leftEye";
  let correctDirection;

  switch (currentContrastRotation) {
    case 0:
      correctDirection = "right";
      break;
    case 90:
      correctDirection = "down";
      break;
    case 180:
      correctDirection = "left";
      break;
    case 270:
      correctDirection = "up";
      break;
  }

  const isCorrect = direction === correctDirection;
  contrastTestResults[eye].attempts++;

  if (isCorrect) {
    contrastTestResults[eye].correct++;
    // Calculate contrast based on number of correct answers (100% is best)
    const newContrast = Math.min(100, contrastTestResults[eye].correct * 10);
    contrastTestResults[eye].lowestVisible = newContrast;
    currentContrast = 100 - newContrast; // Invert for display
    currentContrastSize = Math.max(20, currentContrastSize - 18); // Reduce size by 18px each time
  } else {
    contrastTestResults[eye].incorrect++;
  }

  if (contrastTestResults[eye].attempts >= CONTRAST_ATTEMPTS_PER_EYE) {
    finishContrastTest();
    return;
  }

  updateContrastImage();
  rotateContrastC();
}

function updateContrastImage() {
  document.documentElement.style.setProperty(
    "--contrast",
    `${currentContrast}%`
  );
  const contrastImage = document.getElementById("contrastImage");
  contrastImage.style.width = `${currentContrastSize}px`;
  contrastImage.style.height = `${currentContrastSize}px`;
}

function finishContrastTest() {
  document.getElementById("contrastTest").classList.add("hidden");

  if (isRightEyeContrast) {
    document
      .getElementById("leftEyeContrastInstructions")
      .classList.remove("hidden");
  } else {
    showResults();
  }
}

// Update the HTML for contrast test
document.getElementById("contrastTest").innerHTML = `
  <h1>Contrast Sensitivity Test 👁️</h1>
  <div class="test-area">
    <div class="contrast-container">
      <img src="assets/C.png" alt="Contrast Test" id="contrastImage" />
    </div>
    <div class="controls">
      <p class="question">Which way is the C pointing? 🤔</p>
      <div class="buttons">
        <button onclick="handleContrastAnswer('up')" class="direction-btn">⬆️</button>
        <button onclick="handleContrastAnswer('right')" class="direction-btn">➡️</button>
        <button onclick="handleContrastAnswer('down')" class="direction-btn">⬇️</button>
        <button onclick="handleContrastAnswer('left')" class="direction-btn">⬅️</button>
      </div>
    </div>
  </div>
`;
