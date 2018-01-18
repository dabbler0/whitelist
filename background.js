// Whitelist in under 100 lines of code.
var allowed_domains = {};
var domain_blocks = {};
var current_mode = 'forbid';

chrome.storage.local.get('allowed_domains', function (data) {
  var domain_list = JSON.parse(data['allowed_domains']);
  for (var i = 0; i < domain_list.length; i++) allowed_domains[domain_list[i]] = true;
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log(changes, namespace);
  if (namespace !== 'local') return;
  for (var key in changes) {
    if (key === 'allowed_domains') {
      allowed_domains = {};
      var domain_list = JSON.parse(changes[key].newValue);
      for (var i = 0; i < domain_list.length; i++) {
        if (domain_list[i].trim().length > 0 && domain_list[i].trim()[0] !== '#') {
          allowed_domains[domain_list[i]] = true;
        }
      }
    }
  }
});

function get_domain(url) {
  // This regex matches: {protocol}   {username:password@}?{domain}
  var match = url.match(/^https?:\/\/([^:@\/]*:?[^:@\/]*@)?([a-zA-Z0-9-\.]*)/);
  if (match != null) return match[2];
}

chrome.webRequest.onBeforeRequest.addListener(
  function (info) {
    var domain = get_domain(info.url);
    if (!domain) return {'cancel': false};

    var cancel = false;
    if (current_mode === 'forbid') {
      cancel = !allowed_domains[domain];
    } else if (current_mode === 'confirm') {
      cancel = !(allowed_domains[domain] ||
          confirm('Sending a request to: ' + info.url));
    }

    if (cancel) {
      domain_blocks[domain] = domain_blocks[domain] || 0;
      domain_blocks[domain] += 1;
    }

    return {'cancel': cancel}
  },
  {urls: ['http://*/*', 'https://*/*']},
  ['blocking']
);
