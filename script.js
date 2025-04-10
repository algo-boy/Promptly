const textarea = document.getElementById('prompt-textarea');
const chatWrapper = document.querySelector('.chat-wrapper');

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