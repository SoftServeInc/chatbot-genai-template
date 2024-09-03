function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri && uri !== '/') {
    var lastPeriod = uri.lastIndexOf('.');

    // if the requested file has an extension, return the request as-is
    if (lastPeriod !== -1 && lastPeriod > uri.lastIndexOf('/')) {
      return request
    }
  }

  // otherwise return the request for the index page
  request.uri = '/index.html'

  return request
}
