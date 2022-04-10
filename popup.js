// Initialize button with user's preferred color
let button = document.getElementById('scrape');

// When the button is clicked, inject setPageBackgroundColor into current page
button.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(' I was clicked');

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scraper.js'],
  });
});
