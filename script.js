const textarea = document.getElementById('prompt-textarea');
const chatWrapper = document.querySelector('.chat-wrapper');
const button = document.querySelector('.chat-wrapper button');
const buttonIcon = button.querySelector('i');

let initialTop = null;

const metaPrompt = `
You are a world-class AI prompt engineer.

Rewrite the following prompt using advanced prompt engineering principles. Your improved prompt must include the following:

- A clearly defined role or persona for the AI (e.g., "You are a professional chef...")
- Context or background information needed to complete the task effectively
- A specific, structured instruction that clearly defines what the AI should do
- An expected format or style for the output, if applicable

Do NOT simply reword or expand the original. Apply deliberate priming to elevate prompt quality. Do NOT include any explanations, notes, or formatting symbols (like asterisks or markdown). Only output the fully rewritten and improved prompt text.

Original Prompt:
`;

function setInitialPosition() {
  if (!initialTop) {
    const rect = chatWrapper.getBoundingClientRect();
    initialTop = rect.top;
    chatWrapper.style.top = initialTop + 'px';
    chatWrapper.style.transform = 'translateX(-50%)';
  }
}

function adjustHeight() {
  setInitialPosition();
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

textarea.addEventListener('input', adjustHeight);
window.addEventListener('resize', function() {
  initialTop = null;
  setInitialPosition();
  adjustHeight();
});
window.addEventListener('load', function() {
  setInitialPosition();
  adjustHeight();
});
textarea.addEventListener('focus', adjustHeight);
setInitialPosition();
adjustHeight();

button.addEventListener('click', async () => {
  const prompt = textarea.value;
  
  textarea.style.color = 'rgba(0, 0, 0, 0)';
  textarea.setAttribute('spellcheck', 'false');
  
  buttonIcon.classList.add('fa-beat-fade');
  button.disabled = true;
  
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=KEY_GOES_HERE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: metaPrompt + prompt }]
          }
        ]
      })
    });
    
    const data = await response.json();
    
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0 &&
      data.candidates[0].content.parts[0].text
    ) {
      textarea.value = data.candidates[0].content.parts[0].text;
    } else {
      textarea.value = "Error: Unexpected response format.";
    }
    adjustHeight();
  } catch (error) {
    textarea.value = "Error occurred: " + error.message;
    
    adjustHeight();
  } finally {
    textarea.style.color = 'rgba(0, 0, 0, 1)';
    textarea.setAttribute('spellcheck', 'true');
    
    buttonIcon.classList.remove('fa-beat-fade');
    button.disabled = false;
  }
});
