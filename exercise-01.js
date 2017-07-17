define([
    './js/config/properties',
    './js/config/initialproperties',
    'text!./tpl/exercise-01.tpl.html',
    'd3',
    'text!./style/main.css',
    'angular',
    './libs/lodash.min',
    './js/services/dataService',
    './js/services/chartService',
    'jquery'
],
    function (
        props,
        initProps,
        template,
        d3,
        style,
        angular,
        _,
        DataService,
        ChartService,
        $
    ) {

        'use strict';

        appendStyleToHead(style);

        var self = this;

        console.log('THIS THIS THIS', this);

        return {
            definition: props,
            initialProperties: initProps,
            support: { snapshot: true },
            template: template,
            controller: createController()
        };

        function createController() {
            let controller = ['$scope', '$element', function ($scope, $element) {
                let svgParams = {
                    width: _.round($element.width()),
                    height: _.round($element.height()) - 50,
                    margin: {
                        left: 30,
                        right: 20,
                        top: 50,
                        bottom: 50
                    },
                    verticalSpaceBetweenTheBlocks: 10,
                    horizontalSpaceBetweenTheBlocks: 10
                };

                let dataSvc = DataService.create();
                let chartSvc = ChartService.create();

                $scope.msg = 'Hello Arczik';

                $scope.drawChart = function () {
                    let qHyperCube = $scope.layout.qHyperCube;
                    let chartData = dataSvc.manipulateData(qHyperCube, svgParams);
                    chartSvc.drawChart(`chart-container`, chartData, svgParams);
                };

                $scope.component.model.Validated.bind(function () {
                    console.info('Validated');
                    $scope.drawChart();
                });

                $scope.selectApiTest = function () {
                    let backendApi = $scope.component.getBackendApi;
                    console.log(`select API test`)
                    console.log(self.backendApi)
                    this.backendApi.selectValues(dim, [10], true);
                }.bind(this);

                $scope.drawChart();

            }];

            return controller;
        }

        function appendStyleToHead(styleHtml) {
            let styleElement = document.createElement(`style`);
            styleElement.innerHTML = styleHtml;
            document.head.appendChild(styleElement);
        }

    }
);