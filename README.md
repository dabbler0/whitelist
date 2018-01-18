# Whitelist
Minimalistic whitelist extension for Chrome. This should allow you to make requests only to certain domains. This can be used for various purposes, e.g for productivity or for increasing the performance of pages that make too many requests.

Some extensions like this exist already, but this kind of extension asks for a lot of permissions (intercept every http request!), so I thought it would be best for an extension like this to be open-source and as small as possible, so that if you are wondering what it does you can just read it in a few minutes. I'd like to try to keep the entirety of the source under maybe 200 lines and have no dependencies other than Chrome.

# TODO
 - "Domains" is not really the right level of coarseness for whitelisting. I think maybe instead of a whitelist of domains you want a whitelist of url regexes. I need to come up with a good syntax for specifying these so you don't have to write uninterpretable regexes every time you want to add something to the whitelist, but also so that the syntax can be parsed with a <= 30 line parser.
  - List blocked requests in reverse chronological order with full URL, rather than domain blockage count
  - Style the popup a little better, within reason keeping the stylesheet small
  - Possibly allow whitelisting based on the requester, e.g. whitelist "google.com and everything that a google.com page requests". Don't do this if it requires too much code.
