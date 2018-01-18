// Whitelist in under 100 lines of code.
var allowed_urls = [];
var blocked_urls = [];
var current_mode = 'forbid';


function get_domain (url) {
  // This regex matches: {protocol}   {username:password@}?{domain}
  var match = url.match(/^https?:\/\/([^:@\/]*:?[^:@\/]*@)?([a-zA-Z0-9-\.]*)/);
  if (match != null) return match[2];
}

function get_allowed_urls (config) {
  config = config.split('\n').map(function(x) {
    return x.trim();
  }).filter(function(x) {
    return x.length > 0 && x[0] != '#';
  });

  return config.map(function(x) {
    if (x[0] == '/') {
      return (function(url) {
        return url.match(new RegExp('^https?:\/\/' + x.slice(1) + '([\?#].*)?$')) != null;
      });
    } else {
      return (function(url) { return get_domain(url) === x; });
    }
  });
}

chrome.storage.local.get('allowed_urls', function (data) {
  allowed_urls = get_allowed_urls(data['allowed_urls']);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'local' && (changes['allowed_urls'] != null))
    allowed_urls = get_allowed_urls(changes['allowed_urls'].newValue);
});

chrome.webRequest.onBeforeRequest.addListener(
  function (info) {
    var is_allowed = (current_mode == 'permit');
    for (var i = 0; i < allowed_urls.length; i++)
      is_allowed = is_allowed || allowed_urls[i](info.url);

    if (current_mode === 'confirm')
      is_allowed = is_allowed || confirm('Send a request to: ' + info.url);

    if (!is_allowed) blocked_urls.push(info.url)

    return {'cancel': !is_allowed}
  },
  {urls: ['http://*/*', 'https://*/*']},
  ['blocking']
);
