var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new SpeechRecognition();

const selectElement1 = document.getElementById("from-language");
const selectedValue1 = selectElement1.value;
console.log(selectedValue1);
var language1 = selectedValue1;

const selectElement2 = document.getElementById("to-language");
const selectedValue2 = selectElement2.value;
console.log(selectedValue2);
var language2 = selectedValue2;

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

document.getElementById("from-language").addEventListener("change", function() {
    // Thực hiện hành động tại đây
});

document.getElementById("to-language").addEventListener("change", function() {
    // Thực hiện hành động tại đây
});

function runCode(Object1, lang1, lang2) {

}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.

    const text = event.results[0][0].transcript;
	console.log('Bạn nói:', text);
	youSpeak.textContent = 'Bạn nói:' + text + '.';
	const inputText = text;
	translateText(inputText, 'vi', 'ja')
	.then(translatedText => {
		console.log(translatedText);
		newTranslation.textContent = 'Dịch sang tiếng :' + translatedText + '.';
		const msg = new SpeechSynthesisUtterance();
		msg.text = translatedText;
		// msg.lang = "en-US";
        // msg.lang = "ja-JP";
        msg.lang = language2;
		window.speechSynthesis.speak(msg);
	})
	.catch(error => console.error(error));
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  youSpeak.textContent = "Tôi không nghe được tiếng nói của bạn.";
}

recognition.onerror = function(event) {
  youSpeak.textContent = 'Error occurred in recognition: ' + event.error;
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
