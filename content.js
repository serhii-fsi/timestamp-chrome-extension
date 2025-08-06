chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "insertTimestamp") {
    const activeElement = document.activeElement;
    
    if (activeElement.isContentEditable || activeElement.nodeName.toLowerCase() === 'textarea' || activeElement.nodeName.toLowerCase() === 'input') {
      // Insert the timestamp
      if (typeof activeElement.setRangeText === 'function') {
        // This works for inputs, textareas, and contenteditable in Chrome
        const start = activeElement.selectionStart;
        activeElement.setRangeText(request.timestamp, start, activeElement.selectionEnd, 'end');
      } else {
        // Fallback for contenteditable elements that don't support setRangeText
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(request.timestamp));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Dispatch events after content change
      activeElement.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      }));

      activeElement.dispatchEvent(new Event('change', {
        bubbles: true,
        cancelable: true,
      }));
    }
  }
});