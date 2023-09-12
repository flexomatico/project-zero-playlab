/* eslint-disable no-undef, no-unused-vars */
let buttons = [];
let math = [""];
let result;
let input;
let button0;
let buttonEquals;
let moodDisplay;
let likedDisplay;
let dislikedDisplay;
const DEBUG = false;
let badColor;
let goodColor;

let hasBlockedInput = false;
let counter = 0;
let secondInMilliseconds = 1000;

let allAttributes = ["7", "8", "9", "/",
                     "4", "5", "6", "*",
                     "1", "2", "3", "-", 
                     "0", ".", "+"];

let likedAttributes = [];
let dislikedAttributes = [];

let mood = 100;
let restEffect = 1;
let preferenceEffect = 10;

let notAnnoyedThreshold = 95;
let slightlyAnnoyedThreshold = 75;
let prettyAnnoyedThreshold = 40;
let superAnnoyedThreshold = 10;

let recoveryPeriod = 1;
let recoveryCounter = 0;

function setup() {
  let calcName = prompt("Please name your calculator", "");
  if (calcName == null || calcName == "") {
    calcName = "Anonymous Calculator";
  }

  document.getElementById("name").innerHTML = calcName;

  badColor = color(237, 56, 43);
  goodColor = color(43, 134, 237);
  let index = floor(random(0, allAttributes.length - 1));
  likedAttributes.push(allAttributes[index]);
  allAttributes.slice(index, index);
  index = floor(random(0, allAttributes.length - 1));
  dislikedAttributes.push(allAttributes[index]);

  noCanvas();
  // Put setup code here
  result = createP("&nbsp;").parent("content");
  input = createInput("").parent("content");
  buttons.push(result); // buttons = [result]
  buttons.push(input); // buttons = [result, input]
  createElement("br").parent("content"); // br = break
  buttons.push(createButton("7").parent("content")); // buttons = [result, input, 7]
  buttons.push(createButton("8").parent("content")); // buttons = [result, input, 7, 8]
  buttons.push(createButton("9").parent("content")); // buttons = [result, input, 7, 8, 9]
  buttons.push(createButton("/").parent("content")); // buttons = [result, input, 7, 8, 9, /]
  createElement("br").parent("content");
  buttons.push(createButton("4").parent("content")); // buttons = [result, input, 7, 8, 9, /, 4]
  buttons.push(createButton("5").parent("content")); // buttons = [result, input, 7, 8, 9, /, 4, 5]
  buttons.push(createButton("6").parent("content")); // buttons = [result, input, 7, 8, 9, /, 4, 5, 6]
  buttons.push(createButton("*").parent("content"));
  createElement("br").parent("content");
  buttons.push(createButton("1").parent("content"));
  buttons.push(createButton("2").parent("content"));
  buttons.push(createButton("3").parent("content")); //              0       1    2  3  4  5  6  7  8  9 10 11 12 13
  buttons.push(createButton("-").parent("content")); // buttons = [result, input, 7, 8, 9, /, 4, 5, 6, *, 1, 2, 3, -]
  createElement("br").parent("content");
  button0 = createButton("0").parent("content");
  buttons.push(button0);
  buttons.push(createButton(".").parent("content"));
  buttons.push(createButton("+").parent("content"));
  createElement("br").parent("content");
  buttonEquals = createButton("=").parent("content");
  buttons.push(buttonEquals);

  // buttons.forEach(button => {
  //   button.parent("content");
  // });
  
  moodDisplay = createP("&nbsp;");
  likedDisplay = createP("&nbsp;");
  dislikedDisplay = createP("&nbsp;");

  for (let index = 0; index < buttons.length; index += 1) {
    // get () item of list
    buttons[index]
      .style("padding", "10px 40px")
      .style("width", "120px")
      .style("box-sizing", "border-box")
      .style("font-size", "2.5em")
      .style("background-color", "rgb(0, 28, 60)")
      .style("color", "rgb(255, 255, 255)")
      .style("border-style", "solid")
      .style("border-color", "rgb(255, 255, 255)")
      .style("cursor", "pointer")
      .style("outline", "none")
      .style("margin", "0")
      .mousePressed(OnButtonClicked);
  }

  button0.style("width", "240px");
  buttonEquals.style("width", "480px");

  input
    .style("font-size", "1.9em")
    .style("cursor", "default")
    .style("width", "480px")
    .style("passing-left", "10px")
    .style("passing-right", "10px");

  result
    .style("width", "481px")
    .style("background-color", "rgb(0, 120, 255)")
    .style("text-align", "right")
    .style("font-size", "5em");

    if (DEBUG) {
      likedDisplay.html(likedAttributes.join(" "));
      dislikedDisplay.html(dislikedAttributes.join(" "));
    }
}

function OnButtonClicked() {
  
  if (hasBlockedInput) return;

  let value = this.html();

  EvaluateValue(value);

  if (value === "+") {
    math.push(value);
    math.push("");
  } else if (value === "-") {
    math.push(value);
    math.push("");
  } else if (value === "*") {
    math.push(value);
    math.push("");
  } else if (value === "/") {
    math.push(value);
    math.push("");
  } else if (value === "=") {
    // Do the math
    for (let index = 0; index < math.length; index++) {
      if (math[index] === "*") {
        math.splice(index - 1, 3, math[index - 1] * math[index + 1]);
        index--;
      }
      if (math[index] === "/") {
        math.splice(index - 1, 3, math[index - 1] / math[index + 1]);
        index--;
      }
    }
    for (let index = 0; index < math.length; index++) {
      if (math[index] === "+") {
        math.splice(
          index - 1,
          3,
          parseFloat(math[index - 1]) + parseFloat(math[index + 1])
        );
        index--;
      }
      if (math[index] === "-") {
        math.splice(index - 1, 3, math[index - 1] - math[index + 1]);
        index--;
      }
    }
    SetResult();
  } else {
    math[math.length - 1] += value;
  }

  input.value(math.join(" "));
}

function SetResult() {
  let endResult = math[0];
  
  if (random(0, 100) > mood) {
    endResult = AddChaos(endResult);
  }

  result.html(endResult);
  math.length = 0;
  math.push("");
}

function AddChaos(correctResult) {
  let chaoticResult = correctResult + floor(random(mood - 100, 100 - mood));

  return chaoticResult;
}

function EvaluateValue(value) {
  if (dislikedAttributes.includes(value)) {
    mood -= preferenceEffect;
  } else if (likedAttributes.includes(value)) {
    mood += preferenceEffect;
  }

  mood -= restEffect;
  recoveryCounter = 0; 
}

function clampMood() {
  mood = constrain(mood, 0, 100);
}

function OutputString(string) {
  result.html(string);
}

function SetInputBlocked(state) {
  hasBlockedInput = state;
}

function draw() {
  clampMood();

  let r = lerpColor(badColor, goodColor, map(mood, 0, 100, 0, 1));
  result
    .style("background-color", r);

  if (DEBUG) {
    moodDisplay.html(mood);
    moodDisplay.html(r);
  }
  recoveryCounter += deltaTime;

  if (recoveryCounter > recoveryPeriod * 1000) {
    mood += restEffect;
    recoveryCounter = 0;
  }

  // if (counter > 3 * secondInMilliseconds) {
  //   OutputString(":(");
  //   counter = -100 * secondInMilliseconds;
  //   SetInputBlocked(true);
  //   setTimeout(SetInputBlocked, 10.0 * secondInMilliseconds, false);
  // }
}