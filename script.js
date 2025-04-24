const promptContainer = document.getElementById('prompt-container');
const composerForm = document.getElementById('composer');
const button = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');

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
    const rect = composerForm.getBoundingClientRect();
    initialTop = rect.top;
    composerForm.style.top = initialTop + 'px';
  }
}

function adjustHeight() {
  setInitialPosition();
  promptContainer.style.height = 'auto';
  promptContainer.style.height = `${promptContainer.scrollHeight}px`;
}

promptContainer.addEventListener('input', adjustHeight);

window.addEventListener('resize', function() {
  initialTop = null;
  setInitialPosition();
  adjustHeight();
});

window.addEventListener('load', function() {
  setInitialPosition();
  adjustHeight();
});

promptContainer.addEventListener('focus', adjustHeight);

setInitialPosition();
adjustHeight();

composerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const prompt = promptContainer.value;
  
  promptContainer.style.color = 'rgba(0, 0, 0, 0)';
  promptContainer.setAttribute('spellcheck', 'false');
  
  buttonIcon.classList.add('fa-beat-fade');
  button.disabled = true;
  
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=AIzaSyBLMWpQSvLXMjDdk9OLSH0njxPlVHOq1DA", {
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
      promptContainer.value = data.candidates[0].content.parts[0].text;
    } else {
      promptContainer.value = "Error: Unexpected response format.";
    }
    adjustHeight();
  } catch (error) {
    promptContainer.value = "Error occurred: " + error.message;
    
    adjustHeight();
  } finally {
    promptContainer.style.color = 'rgba(0, 0, 0, 1)';
    promptContainer.setAttribute('spellcheck', 'true');
    
    buttonIcon.classList.remove('fa-beat-fade');
    button.disabled = false;
  }
});
