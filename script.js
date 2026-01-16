document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const letter = document.getElementById("letter");
  const photos = document.getElementById("photos");

  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let revealed = false;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;

    candleCountDisplay.textContent = activeCandles;

    // 🎉 Reveal photos + letter when all candles are out
    if (activeCandles === 0 && candles.length > 0 && !revealed) {
      revealed = true;

      setTimeout(() => {
        photos.style.display = "block";
        letter.style.display = "block";
        letter.scrollIntoView({ behavior: "smooth" });
      }, 800);
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

  // 🖱️ Click cake to add candles
  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }

    let average = sum / bufferLength;
    return average > 40; // blowing sensitivity
  }

  function blowOutCandles() {
    if (!analyser) return;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
        }
      });
      updateCandleCount();
    }
  }

  // 🎤 Microphone access
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Microphone access denied:", err);
      });
  } else {
    console.log("getUserMedia not supported in this browser");
  }
});

