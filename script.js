var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new SpeechRecognition();

var language1 = document.getElementById("from-language").value;
console.log("from-language == ", language1);

var language2 = document.getElementById("to-language").value;
console.log("to-language == ", language2);

recognition.continuous = false;
// recognition.lang = 'vi-VN';
recognition.lang = language1;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var youSpeak = document.querySelector('.you-speak');
var newTranslation = document.querySelector('.translation');
var newVoice = document.querySelector('.voice');

/*
document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}
*/

document.getElementById("from-language").addEventListener("change", function(event) {
    language1 = event.target.value;
    document.querySelector('.translate-1').textContent = language1;
    console.log('from-language == ', language1, language2);
    // runCode(recognition, language1, language2);
});

document.getElementById("to-language").addEventListener("change", function(event) {
    language2 = event.target.value;
    document.querySelector('.translate-2').textContent = language2;
    console.log('to-language', language1, language2);
    // runCode(recognition, language1, language2);
});

document.querySelector('.start').addEventListener('click', () => {
    // code xử lý sự kiện khi nhấn vào nút "Bắt đầu" ở đây
    console.log('Đã nhấn vào nút "Bắt đầu"');
    runCode(recognition, language1, language2);
    recognition.start();
});

document.querySelector('.end').addEventListener('click', () => {
    console.log('Đã nhấn vào nút "Kết thúc"');
    recognition.stop();
});

// Conversation
document.querySelector('.translate-1').addEventListener('click', () => {
    console.log('Translate 1 đã ấn');

    runCode(recognition, language1, language2);
    recognition.start();
});

// Conversation
document.querySelector('.translate-2').addEventListener('click', () => {
    console.log('Translate 2 đã ấn');

    runCode(recognition, language2, language1);
    recognition.start();
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
        youSpeak.textContent = 'Bạn nói (' + lang1 + ') : ' + text + '.';
        const inputText = text;

        translateText(inputText, lang1, lang2)
            .then(translatedText => {
                console.log(translatedText);
                newTranslation.textContent = 'Dịch sang tiếng (' + lang2 + ') : ' + translatedText + '.';
                const msg = new SpeechSynthesisUtterance();
                msg.text = translatedText;
                // msg.lang = "en-US";
                // msg.lang = "ja-JP";
                msg.lang = lang2;
				msg.pitch = 0.5; // Tốc độ phát âm
				msg.rate = 0.7; // Tốc độ đọc
				msg.volume = 1; // Âm lượng
                window.speechSynthesis.speak(msg);
            })
            .catch(error => {
                console.error(error);
                newVoice.textContent = 'Đã xảy ra lỗi khi dịch hoặc đọc';
            });
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
  return data[0][0][0];
  // const translatedText = data[0][0][0];
  // return translatedText;
};

runCode(recognition, language1, language2);