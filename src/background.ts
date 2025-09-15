// Background script to handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel when the extension icon is clicked
  try {
    if (tab.id && tab.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

// Set up the side panel to be available on all tabs
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});