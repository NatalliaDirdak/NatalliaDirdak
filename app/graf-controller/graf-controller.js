/**
 * Created by NATALI on 29.08.2016.
 */
/*var model = {
    data: [],
    xField: "time",
    yFiela: "qantity"
}*/
angular.module('angularSVG', []).controller('GrafController', ['$scope', 'nbrbDataSource', function ($scope, nbrbDataSource) {
    this.grapf = {'width': 500, 'height': 500};
    $scope.selectData = {
        source : '',
        index : '',
        time : ''
    }
    this.selectSource = function(setTab) {
        $scope.selectData.source = setTab;
        console.log($scope.selectData.source);
    }
    this.selectIndex = function(setTab) {
        $scope.selectData.index = setTab;
        console.log($scope.selectData.index);
    }
    this.selectTime = function(setTab) {
        $scope.selectData.time = setTab;
        console.log($scope.selectData.time);
    }
    $scope.convertTime = function(time) {
        var startDate = new Date();
        switch (time) {
            case "oneweek":
                var endDate = new Date(startDate.getfullyear(), startDate.getmonth(), startDate.getDate() - 7);
                break;
            case "onemonth":
                var endDate = new Date(startDate.getfullyear(), startDate.getmonth() - 1, startDate.getDate());
                if (startDate.getDate() != endDate.getDate()) endDate.setDate(0);
                break;
            case "sixmonth":
                var endDate = new Date(startDate.getfullyear(), startDate.getmonth() - 6, startDate.getDate());
                if (startDate.getDate() != endDate.getDate()) endDate.setDate(0);
                break;
            case "oneyear":
                var endDate = new Date(startDate.getfullyear() - 1, startDate.getmonth(), startDate.getDate());
                break;
                return {
                    startDate: startDate,
                    endDate: endDate
                }
        }
    }
    this.buildGraf = function () {
       if ($scope.selectData.source != '' & $scope.selectData.index != '' & $scope.selectData.time != '') {
        nbrbDataSource(145, new Date(2016, 7, 1), new Date(2016, 8, 1)).then(function (response) {
            $scope.content = response.data;
            console.log($scope.content);

            //debugger; //тут будет  сохранение данные в модель
        });
        this.checkInterval = function(arr) {
            var minPoint = Math.min.apply(null, arr);
            var maxPoint = Math.max.apply(null, arr);
            var Interval = (maxPoint - minPoint) / 10; // цена деления в первом приближении
            var x = Math.floor(Math.log10(Interval)); // степень возведения 10
            var firstNum = Interval / Math.pow(10, x); // первая цифра
            var scaleDivision;
            switch(true) {
                case firstNum >= 0 && firstNum < 1.5:
                    scaleDivision = 1;
                    break;
                case firstNum >= 1.5 && firstNum < 3:
                    scaleDivision = 2;
                    break;
                case firstNum >= 3 && firstNum < 6.5:
                    scaleDivision = 5;
                    break;
                case firstNum >= 6.5:
                    scaleDivision = 10;
                    break;
            }
            var division = scaleDivision *  Math.pow(10, x);
            var startPoint = Math.trunc(minPoint / Math.pow(10, (x + 1))) * Math.pow(10, (x + 1));
            var scalePoints = [];
            var point = startPoint;
            do {
                scalePoints.push(point);
                point = point + division;
            } while (point <= maxPoint)
            var lastP = scalePoints[scalePoints.length - 1] + division;//внести элемент больше максимума
            scalePoints.push(lastP);

            for ( var i = 1; i < scalePoints.length; i++) { // удалить лишние элементы с начала массива
                if (scalePoints[i] < minPoint) {
                    scalePoints.shift();
                }
            }
            for ( var i = 0; i < scalePoints.length; i++) {
                scalePoints[i] = +Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(scalePoints[i]);
            }
            return {
                axisPoints : scalePoints,
                minPoint : minPoint,
                maxPoint : maxPoint
            }
        }
           //var rates = [];
           console.log('2=' + $scope.Data);
          /* for (i = 0; i < $scope.Data.length; i++) {
               rates[i] = $scope.Data[i].rate;
           }
          /* this.arrRate = this.Data.map(function(obj) {
               var el;
               el[i] = obj.rate;
               return el;
           }*/
           console.log('rates' + rates);
           /*$scope.axispoints = checkInterval($scope.Date.rate);
           console.log($scope.axispoints);*/
       } else {
           alert('Введите все параметры');
       }
    }
    this.del = function() {
        console.log('3 = ' + $scope.selectData);
    }
}]).factory('nbrbDataSource', ['$http', function ($http) { //сервис - в зависимостях- название запроса- и ф
    return function (currencyCode, startDate, endDate) {
        var url = 'http://www.nbrb.by/API/ExRates/Rates/Dynamics/';
        function appendTransform(defaults, transform) { //преобразователь- добавляет дом трансформацию к ответу

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];

            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }
        return $http({
            url: url + currencyCode,
            params: {
                startDate: startDate.toUTCString(),//преобраз даты в строку без учета часового пояса
                endDate: endDate.toUTCString()
            },
            responseType: 'json',
            method: 'GET',
            transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
                return value.map(function(el) {
                    return {
                        Date: new Date(el.Date),
                        rate: el.Cur_OfficialRate
                    }
                });
            })
        });
    }
}]).directive('grafBuild', [function() {
    return {
        templateUrl : '/line-chart.html',
        scope: {
            data: '=',
            xField: '@?',
            yField: '@?'
        },
        controller: ['$scope', function($scope){
            var self = this;
            var xField = this.xField = this.xField || 'x';
            var yField = this.yField = this.yField || 'y';
            function extractData(data){
               /* return data.map(e => ({
                        x: e[xField] * MULTIPLIER,
                        y: e[yField] * MULTIPLIER
                    }));*/
            }
            }
        ]
    }
    }
]
    );


