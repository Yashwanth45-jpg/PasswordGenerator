// const inputSlider = document.querySelector('#slider');
//or //
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-password_display]");
const copyBtn = document.querySelector("[data-copy-button]");
const copyMsg = document.querySelector("[data-copy-message]");
const UpperCaseCheck = document.querySelector('#uppercase');
const LowerCaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#Numbers');
const SymbolsCheck = document.querySelector('#Characters');
const indicator = document.querySelector('[data-Indicator]');
const generateBtn = document.querySelector('.generate');
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const Symbols = "\"`~!@#$%^&*(){}[]:\"_+=-+<>?/|''";

let passwordLength = 10;
let password = "";
let checkCount = 0;
handleSlider();
setIndicator("#ccc")


function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const max = inputSlider.max;
    const min = inputSlider.min;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    
}

function getRndInteger(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min; // (giving the range it is floating point then we rounded off to integer)
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateRandomUpperCharacter() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateRandomLowerCharacter() {
    return String.fromCharCode(getRndInteger(97, 122));
}

function generateSymbol() {
    return Symbols.charAt(getRndInteger(0, Symbols.length-1));
}

function StrengthIndicator() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(UpperCaseCheck.checked) hasUpper = true;
    if(LowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(SymbolsCheck.checked) hasSymbol = true;

    if(hasLower && hasUpper && (hasSymbol || hasNumber) && passwordLength>=8){
        setIndicator('#0f0');
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength>=6) {
        setIndicator('#ff0');
    }
    else{
        setIndicator('#ff0');
    }

}

async function copyContent() {
    try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "Copied";
    } catch (err) {
      copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
      copyMsg.classList.remove("active");
    }, 2000);
  }
  
  
  function handleCheckBoxChange(){
      checkCount = 0;
      allCheckBox.forEach(function(checkbox) {
          if(checkbox.checked) {
              checkCount++;
            }
        })
        //special condition
        if(passwordLength<checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    }
    
    function Suffle(str) {
        let arr = str.split("");
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join("");
    }
    
    
    allCheckBox.forEach(function(checkbox){
        checkbox.addEventListener('change', handleCheckBoxChange);
    })
    
    
    inputSlider.addEventListener('input', (event)=>{
        passwordLength = event.target.value;
        handleSlider();
    })
    
copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener('click', function() {
    if (checkCount === 0) return;
    if (checkCount > passwordLength) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];
    if (UpperCaseCheck.checked) funcArr.push(generateRandomUpperCharacter);
    if (LowerCaseCheck.checked) funcArr.push(generateRandomLowerCharacter);
    if (SymbolsCheck.checked) funcArr.push(generateSymbol);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);

    // Ensure at least one of each selected character type is added
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();  // Correctly call function
    }

    // Filling remaining characters
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRndInteger(0, funcArr.length - 1);
        password += funcArr[randomIndex]();
    }

    password = Suffle(password); // Fix shuffling issue
    passwordDisplay.value = password;
    StrengthIndicator();
});
