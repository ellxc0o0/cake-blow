document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    const letter = document.getElementById("letter");
    const photos = document.getElementById("photos");
    const blowButton = document.getElementById("blowButton");

    let candles = [];
    let revealed = false;

    function updateCandleCount() {
        const activeCandles = candles.filter(
            (candle) => !candle.classList.contains("out")
        ).length;

        candleCountDisplay.textContent = activeCandles;

        // Reveal photos + letter when all candles are out
        if (activeCandles === 0 && candles.length > 0 && !revealed) {
            revealed = true;

            setTimeout(() => {
                photos.style.display = "block";
                letter.style.display = "block";
                letter.scrollIntoView({ behavior: "smooth" });
            }, 500);
        }
    }

    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = left + "px";
        candle.style.top = top + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        cake.appendChild(candle);
        candles.push(candle);
        updateCandleCount();
    }

    // Click cake to add candles
    cake.addEventListener("click", function (event) {
        const rect = cake.getBoundingClientRect();
        const left = event.clientX - rect.left;
        const top = event.clientY - rect.top;
        addCandle(left, top);
    });

    // Click button to blow all candles
    blowButton.addEventListener("click", function () {
        candles.forEach(candle => candle.classList.add("out"));
        updateCandleCount();
    });
});
