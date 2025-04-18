window.addEventListener('load', () => {
  const textarea = document.getElementById('prompt-textarea');
  const button = document.querySelector('button');
  const icon = button.querySelector('i');
  
  function adjustHeight() {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  
  textarea.addEventListener('input', adjustHeight);
  adjustHeight();
  
  button.addEventListener('click', async () => {
    const prompt = textarea.value;
    
    icon.classList.add('fa-beat-fade');
    button.disabled = true;
    
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer KEY-GOES-HERE"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          input: prompt
        })
      });
      
      const data = await response.json();
      
      if (data.output_text) {
        textarea.value = data.output_text;
      } else {
        textarea.value = "Something went wrong: " + JSON.stringify(data);
      }
      
      adjustHeight();
    } catch (error) {
      textarea.value = "Request failed: " + error.message;
      adjustHeight();
    }
    
    icon.classList.remove('fa-beat-fade');
    button.disabled = false;
  });
});
