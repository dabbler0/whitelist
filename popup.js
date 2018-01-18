var textarea = document.getElementById('allowed_domains'),
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

  var blocked_domains = [];
  for (var key in background.domain_blocks) blocked_domains.push(key);
  blocked_domains.sort(function(a, b) {
    return background.domain_blocks[b] - background.domain_blocks[a];
  });
  for (var i = 0; i < blocked_domains.length; i += 1) {
    var new_el = document.createElement('div');
    new_el.innerText = blocked_domains[i] + ': ' + background.domain_blocks[blocked_domains[i]];

    botr.appendChild(new_el);
  }
});

chrome.storage.local.get('allowed_domains', function(data) {
  textarea.value = JSON.parse(data['allowed_domains']).join('\n');
});
textarea.addEventListener('input', function() {
  chrome.storage.local.set({'allowed_domains': JSON.stringify(textarea.value.split('\n'))});
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
