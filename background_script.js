async function getSelectedTabs() {
  return browser.tabs.query({
    highlighted: true,
    currentWindow: true,
  });
}

function tabsToText(tabs, options) {
  function setMissingOptionsToDefault(options) {
    const defaultOptions = {
      includeTitle: true,
      titleUrlSeparator: ", ",
      tabStringSeparator: "\n",
    };
    return Object.assign({}, defaultOptions, options);
  }
  options = setMissingOptionsToDefault(options);
  return tabs
    .map((tab) => tabToString(tab, options))
    .join(options.tabStringSeparator);
}

function tabToString(tab, options) {
  let result = "";
  if (options.includeTitle) {
    result += tab.title;
    result += options.titleUrlSeparator;
  }
  result += tab.url;
  return result;
}

function tabsToMarkdown(tabs, returnAsList = false, separator = " ") {
  return tabs
    .map((tab) => `${returnAsList ? "* " : ""}[${tab.title}](${tab.url})`)
    .join(separator);
}

async function copyUrlOnly() {
  const tabUrlsString = tabsToText(await getSelectedTabs(), {
    includeTitle: false,
  });
  navigator.clipboard.writeText(tabUrlsString);
}

async function copyTitleAndUrl() {
  const titlesAndUrlsString = tabsToText(await getSelectedTabs());
  navigator.clipboard.writeText(titlesAndUrlsString);
}

async function copyMarkdown() {
  const markdown = tabsToMarkdown(await getSelectedTabs());
  navigator.clipboard.writeText(markdown);
}

async function copyMarkdownList() {
  const markdown = tabsToMarkdown(await getSelectedTabs(), true, "\n");
  navigator.clipboard.writeText(markdown);
}

browser.browserAction.onClicked.addListener(copyUrlOnly);

const copyUrlOnlyMenuID = "copy-url-only";
browser.contextMenus.create({
  id: copyUrlOnlyMenuID,
  title: "Copy URLs of the selected tabs",
  contexts: ["tab"],
});

const copyTitleAndUrlsMenuId = "copy-selected-tab-info";
browser.contextMenus.create({
  id: copyTitleAndUrlsMenuId,
  title: "Copy titles and URLs of selected tabs",
  contexts: ["tab"],
});

const copyAsMarkdownMenuID = "copy-markdown";
browser.contextMenus.create({
  id: copyAsMarkdownMenuID,
  title: "Copy URLs and titles as markdown links",
  contexts: ["tab"],
});

const copyAsMarkdownListMenuID = "copy-markdown-list";
browser.contextMenus.create({
  id: copyAsMarkdownListMenuID,
  title: "Copy URLs and titles as markdown list of markdown links",
  contexts: ["tab"],
});

// eslint-disable-next-line no-unused-vars
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case copyTitleAndUrlsMenuId:
      copyTitleAndUrl();
      break;
    case copyUrlOnlyMenuID:
      copyUrlOnly();
      break;
    case copyAsMarkdownMenuID:
      copyMarkdown();
      break;
    case copyAsMarkdownListMenuID:
      copyMarkdownList();
      break;
  }
});
