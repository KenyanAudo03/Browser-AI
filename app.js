document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector(".talk");
  const content = document.querySelector(".content");

  let cooldown = false;
  let micOn = true; // Variable to keep track of microphone state
  const openedTabs = {};  // Object to store references to opened tabs

  function speak(text) {
      const textSpeak = new SpeechSynthesisUtterance(text);
      textSpeak.rate = 1;
      textSpeak.volume = 1;
      textSpeak.pitch = 1;
      textSpeak.onstart = () => console.log(`Speaking: ${text}`);
      textSpeak.onend = () => console.log("Speech synthesis finished.");
      window.speechSynthesis.speak(textSpeak);
  }

  function wishMe() {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 12) {
          speak("Good Morning Boss...");
      } else if (hour >= 12 && hour < 17) {
          speak("Good Afternoon Master...");
      } else {
          speak("Good Evening Sir...");
      }
  }

  function initializeVictor() {
      speak("Initializing VICTOR...");
      wishMe();
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalTranscript = '';

  recognition.onstart = () => {
      content.textContent = "Listening...";
  };

  recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript.toLowerCase();
          } else {
              interimTranscript += event.results[i][0].transcript.toLowerCase();
          }
      }
      content.textContent = interimTranscript || finalTranscript;

      if (finalTranscript.includes("victor")) {
          const command = finalTranscript.split("victor")[1].trim();
          if (command) {
              handleCommand(command);
              finalTranscript = ''; // Clear transcript after handling command
          } else if (!cooldown) {
              speak("Hello Sir, How May I Help You?");
              cooldown = true;
              setTimeout(() => cooldown = false, 5000); // 5-second cooldown
          }
      }
  };

  recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      content.textContent = "Error occurred. Please try again.";
  };

  recognition.onend = () => {
      content.textContent = "Click to Speak";
      if (micOn) {
          recognition.start();  // Restart recognition if the mic is still on
      }
  };

  btn.addEventListener("click", () => {
      if (micOn) {
          recognition.start();
      } else {
          speak("Microphone is off. Please turn it on to use voice commands.");
      }
  });

  function handleCommand(message) {
      console.log(`Received command: ${message}`);
      switch (true) {
          case /turn off mike|turn off microphone/.test(message):
              if (micOn) {
                  recognition.stop();
                  micOn = false;
                  speak("Microphone is turned off.");
              } else {
                  speak("Microphone is already off.");
              }
              break;
          case /turn on mike|turn on microphone/.test(message):
              if (!micOn) {
                  recognition.start();
                  micOn = true;
                  speak("Microphone is turned on.");
              } else {
                  speak("Microphone is already on.");
              }
              break;
          case /hey|hello/.test(message):
              speak("Hello Sir, How May I Help You?");
              break;
          case /open google/.test(message):
              openedTabs.google = window.open("https://google.com", "_blank");
              speak("Opening Google...");
              break;
          case /open chatgpt/.test(message):
              openedTabs.chatgpt = window.open("https://chat.openai.com", "_blank");
              speak("Opening ChatGPT...");
              break;
          case /open whatsapp/.test(message):
              openedTabs.whatsapp = window.open("https://web.whatsapp.com/", "_blank");
              speak("Opening WhatsApp...");
              break;
          case /open youtube/.test(message):
              openedTabs.youtube = window.open("https://youtube.com", "_blank");
              speak("Opening Youtube...");
              break;
          case /open facebook/.test(message):
              openedTabs.facebook = window.open("https://facebook.com", "_blank");
              speak("Opening Facebook...");
              break;
          case /close google/.test(message):
              if (openedTabs.google) {
                  openedTabs.google.close();
                  speak("Closing Google...");
                  delete openedTabs.google;
              } else {
                  speak("Google is not open.");
              }
              break;
          case /close chatgpt/.test(message):
              if (openedTabs.chatgpt) {
                  openedTabs.chatgpt.close();
                  speak("Closing ChatGPT...");
                  delete openedTabs.chatgpt;
              } else {
                  speak("ChatGPT is not open.");
              }
              break;
          case /close whatsapp/.test(message):
              if (openedTabs.whatsapp) {
                  openedTabs.whatsapp.close();
                  speak("Closing WhatsApp...");
                  delete openedTabs.whatsapp;
              } else {
                  speak("WhatsApp is not open.");
              }
              break;
          case /close youtube/.test(message):
              if (openedTabs.youtube) {
                  openedTabs.youtube.close();
                  speak("Closing Youtube...");
                  delete openedTabs.youtube;
              } else {
                  speak("Youtube is not open.");
              }
              break;
          case /close facebook/.test(message):
              if (openedTabs.facebook) {
                  openedTabs.facebook.close();
                  speak("Closing Facebook...");
                  delete openedTabs.facebook;
              } else {
                  speak("Facebook is not open.");
              }
              break;
          case /what is|who is|what are/.test(message):
              window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
              speak("This is what I found on the internet regarding " + message);
              break;
          case /wikipedia/.test(message):
              window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
              speak("This is what I found on Wikipedia regarding " + message);
              break;
          case /time/.test(message):
              const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
              speak("The current time is " + time);
              break;
          case /date/.test(message):
              const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
              speak("Today's date is " + date);
              break;
          case /calculator/.test(message):
              window.open("Calculator:///");
              speak("Opening Calculator");
              break;
          default:
              window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
              speak("I found some information for " + message + " on Google");
              break;
      }
  }

  initializeVictor();
});
