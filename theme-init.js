;(function () {
    var VALID = ['dark', 'light'];
    var s = localStorage.getItem('oc-theme');
    var p = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = VALID.includes(s) ? s : p;
})();
