var textarea = document.getElementById('allowed_urls'),
    update = document.getElementById('update'),
    forbid = document.getElementById('forbid'),
    confirm_btn = document.getElementById('confirm'),
    permit = document.getElementById('permit'),
    behavior = document.getElementById('behavior'),
    botr = document.getElementById('botr'),
    background;
chrome.runtime.getBackgroundPage(function (b) {
  background = b;
  behavior.innerText = background.current_mode;

  for (var i = background.blocked_urls.length - 1; i >= 0; i--) {
    var new_el = document.createElement('div');
    new_el.innerText = background.blocked_urls[i];

    botr.appendChild(new_el);
  }
});

chrome.storage.local.get('allowed_urls', function(data) {
  textarea.value = data['allowed_urls'];
});
textarea.addEventListener('input', function() {
  chrome.storage.local.set({'allowed_urls': textarea.value});
});
forbid.addEventListener('click', function() {
  if (background)
    behavior.innerText = background.current_mode = 'forbid';
});
confirm_btn.addEventListener('click', function() {
  if (background)
    behavior.innerText = background.current_mode = 'confirm';
});
permit.addEventListener('click', function() {
  if (background)
    behavior.innerText = background.current_mode = 'permit';
});
