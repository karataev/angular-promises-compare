
angular.module('app', ['angular-loading-bar'])

  .controller('AppCtrl', ['ChuckQuotes', function (ChuckQuotes) {
    var vm = this;

    vm.jokesToFetch = ChuckQuotes.amount;

    vm.changeAmount = function (value) {
      ChuckQuotes.amount = vm.jokesToFetch;
    }
  }])

  .controller('QueueCtrl', ['ChuckQuotes', '$q', function (ChuckQuotes, $q) {
    var vm = this;

    vm.jokes = [];

    var startTime;
    var endTime;

    function start() {
      startTime = Date.now();
      return $q.resolve();
    }

    function theEnd() {
      endTime = Date.now();
      vm.delta = endTime - startTime;
    }

    vm.startFetchProcess = function () {
      startTime = Date.now();
      var sequence = start();
      for (var i = 0; i < ChuckQuotes.amount; i++) {
        sequence = sequence
          .then(ChuckQuotes.fetchRandom)
          .then(function (response) {
            vm.jokes.push(response.data.value);
          })
      }
      sequence.then(theEnd);
    };

  }])

  .controller('BundleCtrl', ['ChuckQuotes', '$q', function (ChuckQuotes, $q) {
    var vm = this;

    vm.jokes = [];

    var startTime;
    var endTime;

    function start() {
      startTime = Date.now();
      return $q.resolve();
    }

    function theEnd() {
      endTime = Date.now();
      vm.delta = endTime - startTime;
    }

    vm.startFetchProcess = function () {
      var promises = [];
      for (var i = 0; i < ChuckQuotes.amount; i++) {
        promises.push(ChuckQuotes.fetchRandom());
      }
      start()
        .then(function () {
          return $q.all(promises)
        })
        .then(function (response) {
          vm.jokes = response.map(function (x) {
            return x.data.value;
          })
        })
        .then(theEnd);
    };
  }])

  .factory('ChuckQuotes', ['$http', function ($http) {

    function fetchRandom() {
      return $http.get('http://api.icndb.com/jokes/random');
    }

    return {
      amount: 10,
      fetchRandom: fetchRandom
    }
  }])
