/** 
 * @desc Application for making a sketch board
 *       Application using vanila JavaScript and DOM manipulation
 *       This application is inspired by The Odin Project
 * @author Phong 
 * date: 2021/01/07
 */

// ===== CONSTANTS and Global variables =====================
const BLACK = '#0b0b0b';
const WHITE = '#faf9f9';

const sketchContainer = document.querySelector('.sketch-grid');
const gridSize = 50;
const clearButton = document.querySelector('#clear-btn');
const eraserButton = document.querySelector('#eraser-btn');
const penButton = document.querySelector('#pen-btn');
const changeGridButton = document.querySelector('#change-size');
const rainbowButton = document.querySelector('#rainbow-btn');
const colorPickerInput = document.getElementById('pick-color');
const colorPickerLabel = document.getElementById('pick-color-label');
const toolButtons = document.querySelectorAll('.tools-btn');
// ======================== Functions =======================
/**
 * 
 * @param {int} gridSize 
 */
function addGridTemplateColumns(gridSize) {
    sketchContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
}

/**
 * @description Generating grid elements and append to the sketch container
 * @param {Int} gridSize 
 */
function generateGridElement(gridSize) {
    const calculatedSize = Math.pow(gridSize, 2);
    addGridTemplateColumns(gridSize);
    for (let i = 0; i < calculatedSize; i++) {
        let gridElement = document.createElement('div');
        gridElement.className = 'grid-item';
        sketchContainer.appendChild(gridElement);
    }
}

/**
 * @description Add draw color for each grid cell when move mouser over a grid cell
 * @param {Array} gridElements 
 * @param {String} color 
 */
function addDrawColor(gridElements, color) {
    gridElements.forEach((element) => element.addEventListener('mouseover', () => {
        element.style.backgroundColor = color;
    }));
}

/**
 * @description setting default background color as clear the grid 
 * @param {Array} gridElements 
 */
function clearSketchBoard(gridElements) {
    gridElements.forEach((element) => {
        element.style.backgroundColor = WHITE;
    });
}

/**
 * @desc Add event listener for clear button when user click
 * @param {Object} tool 
 * @param {Array} gridElements 
 */
function addingClearEvent(tool, gridElements) {
    tool.addEventListener('click', () => {
        clearSketchBoard(gridElements);
    });
}

/**
 * @desc Add event listener for the eraser when user click
 * @param {Object} eraser 
 * @param {Array} gridElements 
 */
function addEraserEvent(eraser, gridElements) {
    eraser.addEventListener('click', () => {
        resetBackGroundButton(eraser);
        gridElements.forEach((element) => element.addEventListener('mouseover', () => {
            element.style.backgroundColor = WHITE;
            element.style.transition = 'background-color 150ms ease-in-out';
        }));
    });
}

/**
 * @desc Add event listener for the pen cursor to get new color
 * @param {Object} button
 * @param {Array} gridElements
 * @param {String} color
 */
function updatePenColorEvent(button, gridElements, color) {
    button.addEventListener('click', () => {
        addDrawColor(gridElements, color);
        resetBackGroundButton(button);
    });
}

/**
 * Add listener to change size button when click
 * calling function to validate user input
 * and reinitialize with new grid size
 */
function addChangeSizeEvent(button) {
    button.addEventListener('click', () => {
        let newGridSize = getUserInput();
        resetBackGroundButton(button);
        removeGridChilds();
        generateGridElement(newGridSize);
        addSingleButtonEvents();
    })
}

/**
 * removing all grid elements from the sketch container
 */
function removeGridChilds() {
    while (sketchContainer.firstChild) {
        sketchContainer.removeChild(sketchContainer.lastChild);
    }
}

/**
 * Getting list of grid elements
 * and call needed functions to add event listener for the tools
 * each function is called for a single button event
 */
function addSingleButtonEvents() {
    const gridElements = sketchContainer.querySelectorAll('.grid-item')
    addDrawColor(gridElements, BLACK);
    addingClearEvent(clearButton, gridElements);
    addEraserEvent(eraserButton, gridElements);
    updatePenColorEvent(penButton, gridElements, BLACK);
    addRainbowButtonEvent(gridElements);
    colorPickerEvent(gridElements);
}

/**
 * Generate random #color
 * @returns #color
 */
function generateRandomRGB() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor;
}

/**
 * Add event for rainbow button to change
 * element background color when click
 * @param {*} gridElements 
 */
function addRainbowButtonEvent(gridElements) {
    rainbowButton.addEventListener('click', () => {
        resetBackGroundButton(rainbowButton);
        gridElements.forEach((element) => element.addEventListener('mouseover', () => {
            let randomRGB = generateRandomRGB();
            element.style.backgroundColor = randomRGB;
        }));
    });
}

/**
 * Add input event for color picker
 * to call addDrawColor after getting input value
 * @param {*} gridElements 
 */
function colorPickerEvent(gridElements) {
    colorPickerInput.addEventListener('input', () => {
        resetBackGroundButton(colorPickerLabel);
        const colorPicked = colorPickerInput.value;
        addDrawColor(gridElements, colorPicked);
    });
}

/** 
 * @description Getting user input and validate inputs
 * @returns newGridSize after it is a valid value
 */
function getUserInput() {
    let isValid = false;
    let promptMessage = 'Please enter your grid size by a number between 1 to 100: ';
    while (!isValid) {
        let newGridSize = prompt(promptMessage);
        if (newGridSize === '') {
            promptMessage = 'Size can not be empty, please try enter again a number from 1 to 100: '
        } else {
            if (newGridSize >= 1 && newGridSize <= 100) {
                isValid = true;
                return newGridSize;
            }
        }
    }
}

/**
 * @desc Clear all buttons background, except for the one is clicked
 * @param {Object} button
 */
function resetBackGroundButton(button) {
    toolButtons.forEach((b) => {
        b.classList.remove('tools-btn-clicked');
    });
    if (button.id == 'change-size') return;
    button.classList.add('tools-btn-clicked');
}

//---------------------------------------------------------
// ********************* STARTING AREA *********************
//----------------------------------------------------------
// Initialize a grid size 16x16 as default
generateGridElement(16);
addChangeSizeEvent(changeGridButton); // things changes once user decide to change grid size
addSingleButtonEvents();