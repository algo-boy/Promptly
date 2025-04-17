const textarea = document.getElementById('prompt-textarea');
const chatWrapper = document.querySelector('.chat-wrapper');
const button = document.getElementById('send-button');

let initialTop = null;

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
  
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer KEY_GOES_HERE"
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      input: prompt
    })
  });
  
  const data = await response.json();
  
  if (data.output_text) {
    textarea.value = data.output_text;
  } else {
    textarea.value = "Something went wrong: " + JSON.stringify(data);
  }
});
