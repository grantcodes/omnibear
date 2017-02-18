document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('#login > form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputs = form.querySelectorAll('input[name]');
    var values = Array.prototype.map.call(inputs, i => `${i.name}=${encodeURIComponent(i.value)}`);
    var url = `${form.action}?${values.join('&')}`;
    chrome.tabs.create({url: url}, function (tab) {
      chrome.runtime.sendMessage({
        action: 'begin-auth',
        payload: { tabId: tab.id }
      });
    });
  });
});