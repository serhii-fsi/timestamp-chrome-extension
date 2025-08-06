function getCurrentTimestamp() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function insertTimestamp() {
  const timestamp = getCurrentTimestamp();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "insertTimestamp", timestamp: timestamp});
  });
}

chrome.contextMenus.create({
  id: "insertTimestamp",
  title: "Insert Timestamp",
  contexts: ["editable"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "insertTimestamp") {
    insertTimestamp();
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "insert-timestamp") {
    insertTimestamp();
  }
});