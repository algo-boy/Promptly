const textarea = document.getElementById('prompt-textarea');
const chatWrapper = document.querySelector('.chat-wrapper');
const button = document.querySelector('.chat-wrapper button');
const buttonIcon = button.querySelector('i');

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
  
  textarea.style.color = 'rgba(0, 0, 0, 0)';
  textarea.setAttribute('spellcheck', 'false');
  
  buttonIcon.classList.add('fa-beat-fade');
  button.disabled = true;
  
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer KEY-GOES-HERE"
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
      // textarea.value = "Something went wrong: " + JSON.stringify(data);
      textarea.value = `You are a world-class academic essay writer with expertise in global economics and international relations. Your goal is to educate university students on complex topics in a clear, engaging, and well-organized way.
      
Write a comprehensive essay on globalization. Begin by defining the term and explaining its historical development. Discuss the key forces driving globalization, such as technological advancement, international trade, and human migration. Explore both the positive and negative effects on economies, cultures, and the environment, using relevant real-world examples. Finally, provide a thoughtful conclusion that analyzes whether globalization is ultimately beneficial or detrimental in the modern era.`
      
      adjustHeight();
    }
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
