var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new SpeechRecognition();

const selectElement1 = document.getElementById("from-language");
const selectedValue1 = selectElement1.value;
console.log(selectedValue1);
var language1 = selectedValue1;
var lang21=language1;

const selectElement2 = document.getElementById("to-language");
const selectedValue2 = selectElement2.value;
console.log(selectedValue2);
var language2 = selectedValue2;
var lang12=language2;

recognition.continuous = false;
// recognition.lang = 'vi-VN';
recognition.lang = language1;

recognition.interimResults = false;
recognition.maxAlternatives = 1;

var youSpeak = document.querySelector('.you-speak');
var newTranslation = document.querySelector('.translation');

/*
document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}
*/

document.getElementById("from-language").addEventListener("change", function(event) {
    const lang11 = event.target.value;
    lang12 = document.getElementById("to-language").value;
    console.log('from-language', lang11, lang12);
    runCode(recognition, lang11, lang12);
});

document.getElementById("to-language").addEventListener("change", function(event) {
    lang21 = document.getElementById("from-language").value;
    const lang22 = event.target.value;
    console.log('to-language', lang21, lang22);
    runCode(recognition, lang21, lang22);
});

const startButton = document.querySelector('.start');
startButton.addEventListener('click', () => {
    // code xử lý sự kiện khi nhấn vào nút "Bắt đầu" ở đây
    console.log('Đã nhấn vào nút "Bắt đầu"');
    recognition.start();
});

const endButton = document.querySelector('.end');
endButton.addEventListener('click', () => {
    console.log('Đã nhấn vào nút "Kết thúc"');
    recognition.stop();
});

function runCode(Object1, lang1, lang2) {
    Object1.lang = lang1;
    Object1.onresult = function(event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.

        const text = event.results[0][0].transcript;
        console.log('Bạn nói:', text);
        youSpeak.textContent = 'Bạn nói ' + lang1 + ' : ' + text + '.';
        const inputText = text;
        translateText(inputText, lang1, lang2)
            .then(translatedText => {
                console.log(translatedText);
                newTranslation.textContent = 'Dịch sang tiếng ' + lang2 + ' : ' + translatedText + '.';
                const msg = new SpeechSynthesisUtterance();
                msg.text = translatedText;
                // msg.lang = "en-US";
                // msg.lang = "ja-JP";
                msg.lang = lang2;
                window.speechSynthesis.speak(msg);
            })
            .catch(error => console.error(error));
    }

    Object1.onspeechend = function() {
        Object1.stop();
    }

    Object1.onnomatch = function(event) {
        youSpeak.textContent = "Tôi không nghe được tiếng nói của bạn.";
    }

    Object1.onerror = function(event) {
        youSpeak.textContent = 'Error occurred in recognition: ' + event.error;
    }
}

// translate text
const translateText = async (text, fromLang, toLang) => {
  const encodedText = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodedText}`;
  const response = await fetch(url);
  const data = await response.json();
  const translatedText = data[0][0][0];
  return translatedText;
};

runCode(recognition, language1, language2);