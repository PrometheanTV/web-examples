(function () {
  window.getQueryParams = function () {
    var searchArr = window.location.search.substring(1).split('&');
    var obj = {};

    for (var i = 0, len = searchArr.length; i < len; i++) {
      var param = searchArr[i];
      var arr = param.split('=');
      if (arr[0] !== '') obj[arr[0]] = decodeURIComponent(arr[1]);
    }

    return obj;
  };

  window.loadScript = function (src, callback) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => callback(script);

    document.head.append(script);
  };
})();
