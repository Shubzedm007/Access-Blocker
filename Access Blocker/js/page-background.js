if (window.localStorage.getItem('flag-password_function') === null) {
    ls.set('flag-block_function',     !ls.get('blocked_disabled'));
    ls.set('flag-timegroup_function', !ls.get('time_limit_disabled'));
    ls.set('flag-option_page_link',   !ls.get('option_page_link_disabled'));
    ls.set('flag-password_function',  false);
    ls.rm('blocked_disabled');
    ls.rm('time_limit_disabled');
    ls.rm('option_page_link_disabled');
    ls.rm('__wb_1_regular_visitor');
}

if (!ls.get('_installed')) {
    ls.set('days_of_week', [0,1,2,3,4,5,6]);
    ls.set('_installed', true);
}

var afterFunction = null;
var WB = new WebsiteBlocker();

chrome.tabs.onCreated.addListener(function(tab) {
    WB.run(tab);
});

chrome.tabs.onActivated.addListener(function(info) {
    chrome.tabs.get(info.tabId, function(tab) {
        WB.run(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        WB.run(tab);
        return;
    }
});

function getUrl(callback) {
    chrome.tabs.getSelected(null, function(tab) {
        if (tab.url) {
            afterFunction = callback;
            try {
                chrome.tabs.executeScript(null, { file: 'js/injection.js' });
            } catch (e) {}
        } else {
            callback(null);
        }
    });
};

function checkCurrentTab() {
    chrome.tabs.getSelected(null, function(tab) {
        WB.run(tab);
    });
};

chrome.extension.onRequest.addListener(function(tab) {
    afterFunction(tab);
});

