import { getParamFromUrl, cleanUrl } from "./util/url";
import { logout } from "./util/utils";
import {
  validateMeDomainFromUrl,
  fetchToken,
  fetchSyndicationTargets
} from "./background/authentication";

window.browser = (() => window.browser || window.chrome)();

let authTabId = null;
let menuId;

function handleMessage(request, sender, sendResponse) {
  switch (request.action) {
    case "begin-auth":
      handleBeginAuth(request.payload);
      break;
    case "focus-window":
      updateFocusedWindow(
        sender.tab.id,
        sender.url,
        request.payload.selectedEntry
      );
      break;
    case "select-entry":
      selectEntry(request.payload.url);
      break;
    case "clear-entry":
      clearEntry();
  }
}

function handleBeginAuth(payload) {
  localStorage.setItem("domain", payload.domain);
  localStorage.setItem("authEndpoint", payload.metadata.authEndpoint);
  localStorage.setItem("tokenEndpoint", payload.metadata.tokenEndpoint);
  localStorage.setItem("micropubEndpoint", payload.metadata.micropub);
  browser.tabs.create({ url: payload.authUrl }, tab => {
    authTabId = tab.id;
  });
}

function updateFocusedWindow(tabId, url, selectedEntry) {
  localStorage.setItem("pageUrl", cleanUrl(url));
  localStorage.setItem("pageTabId", tabId);
  if (selectedEntry) {
    selectEntry(selectedEntry);
  } else {
    clearEntry();
  }
}

function selectEntry(url) {
  localStorage.setItem("selectedEntry", url);
}

function clearEntry() {
  localStorage.removeItem("selectedEntry");
}

function handleTabChange(tabId, changeInfo, tab) {
  if (tabId !== authTabId || !isAuthRedirect(changeInfo)) {
    return;
  }
  const isValidDomain = validateMeDomainFromUrl(changeInfo.url);
  if (!isValidDomain) {
    return;
  }
  var code = getParamFromUrl("code", changeInfo.url);
  fetchToken(code)
    .then(() => {
      return fetchSyndicationTargets();
    })
    .then(() => {
      browser.tabs.remove(tab.id);
      authTabId = null;
    })
    .catch(err => {
      console.error(err.message, err);
    });
}

function isAuthRedirect(changeInfo) {
  var url = "https://omnibear.com/auth/success";
  return changeInfo.url && changeInfo.url.startsWith(url);
}

browser.runtime.onMessage.addListener(handleMessage);
browser.tabs.onUpdated.addListener(handleTabChange);
menuId = browser.contextMenus.create({
  title: "Reply to entry",
  contexts: ["page", "selection"],
  onclick: function() {
    if (typeof browser === "undefined") {
      // Chrome
      window.open(
        "index.html?reply=true",
        "extension_popup",
        "width=450,height=510,status=no,scrollbars=yes,resizable=no,top=80,left=2000"
      );
    } else {
      // Firefox (and others?)
      browser.windows.create({
        url: "index.html?reply=true",
        width: 450,
        height: 580,
        type: "panel",
        left: 2000
      });
    }
  }
});
