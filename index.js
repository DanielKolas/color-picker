const btnPick = document.querySelector("#btn-pick");
const btnClear = document.querySelector("#clear-btn");
const colorList = document.querySelector(".all-colors");

// taking the colors from the local storage 
let pickedColors = JSON.parse(localStorage.getItem("list-of-colors")) || [];
let currentPopUp = null;

// copying color - text !
const copyToClipboard = async(text,element) => {
    try{
        await navigator.clipboard.writeText(text);
        element.innerText = "Copied!";
        setTimeout(() =>{
            element.innerText = text;
        },1000);
    }
    catch(err){
        alert("Failed to copy text!")
    }
}

const createColorPopup = (color) => {
    const popup = document.createElement("div");
    popup.classList.add("color-popup");
    popup.innerHTML = `
        <div class="color-popup-content">
            <span class="close-popup">x</span>
            <div class="color-info">
                <div class="color-preview" style="background: ${color};"></div>
                    <div class="color-details">
                        <div class="color-value">
                            <span class="label">Hex:</span>
                            <span class="value hex" data-color="${color}">${color}</span>
                        </div>
                        <div class="color-value">
                            <span class="label">RGB:</span>
                            <span class="value rgb" data-color="${color}">${hexToRgb(color)}</span>
                        </div>
                </div>
            </div>
        </div>
    `;

    // Close button inside the popup
    const closePopup = popup.querySelector(".close-popup");
    closePopup.addEventListener('click', () => {
        document.body.removeChild(popup);
        currentPopUp = null;
    });

    // Event listeners to copy color values to clipboard
    const colorValues = popup.querySelectorAll(".value");
    colorValues.forEach((value) => {
        value.addEventListener('click', (e) => {
            const text = e.currentTarget.innerText;
            copyToClipboard(text, e.currentTarget);
        });
    });

    return popup;
};

// ttuaj na dół wrzucic ladne pokazanie 
const showColors = () => {
    colorList.innerHTML = pickedColors.map((color) =>
        `
            <li class="color">
                <span class="rect" style="background: ${color}; border: 1px solid ${color === "#ffffff" ? "#ccc" : color}"></span>
                <span class="value hex" data-color="${color}">${color}</span>
            </li>
        `
    ).join("");

    const colorElements = document.querySelectorAll(".color");
    colorElements.forEach((li) => {
        const colorHex = li.querySelector(".value.hex");
        colorHex.addEventListener('click', (e) => {
            const color = e.currentTarget.dataset.color;
            if (currentPopUp) {
                document.body.removeChild(currentPopUp);
            }
            const popup = createColorPopup(color);
            document.body.appendChild(popup);
            currentPopUp = popup;
        });
    });

    const pickedColorsContainer = document.querySelector(".color-list");
    pickedColorsContainer.classList.toggle("hide", pickedColors.length === 0);
};


// how it works 
const hexToRgb = (hex) =>{
    const bigInt = parseInt(hex.slice(1),16);
    const r = (bigInt >> 16 ) & 255;
    const g = (bigInt >> 8) & 255;
    const b = bigInt & 255;
    return `rgb(${r}, ${g}, ${b})`;
}
// DONE 
const activateEyeDropper = async () => {
    document.body.style.display = "none";
    try {
        const { sRGBHex } = await new EyeDropper().open();

        if (!pickedColors.includes(sRGBHex)) {
            pickedColors.push(sRGBHex);
            localStorage.setItem("list-of-colors", JSON.stringify(pickedColors));
        }
        showColors();
    } catch (error) {
        alert(error);
    } finally {
        document.body.style.display = "block";
    }
};

const clearAll = () => {
    pickedColors = [];
    localStorage.removeItem("list-of-colors");
    showColors();
}

btnPick.addEventListener('click', activateEyeDropper);
btnClear.addEventListener('click', clearAll);

showColors();