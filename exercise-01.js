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


        return {
            definition: props,
            initialProperties: initProps,
            support: { snapshot: true },
            template: template,
            controller: createController()
        };

        function createController() {
            let controller = ['$scope', '$element', function ($scope, $element) {

                var palette = [
                    "#b0afae",
                    "#7b7a78",
                    "#545352",
                    "#4477aa",
                    "#7db8da",
                    "#b6d7ea",
                    "#46c646",
                    "#f93f17",
                    "#ffcf02",
                    "#276e27",
                    "#ffffff",
                    "#000000"
                ];

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
                    horizontalSpaceBetweenTheBlocks: 10,
                    clickUpperLabelCallback: clickUpperLabelCallback,
                    barsColor: palette[$scope.layout.barsColor]
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
                    $scope.drawChart();
                });

                $scope.$watch(function () { return $scope.layout.barsColor; }, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        svgParams.barsColor = palette[newVal];
                        $scope.drawChart();
                    }
                });
                $scope.clickUpperLabelCallback = clickUpperLabelCallback.bind(this);

                $scope.drawChart();

                function clickUpperLabelCallback(d) {
                    let dim = 0;
                    let value = d.qElemNumber;
                    // $scope.backendApi.selectValues(dim, [value], true);
                    $scope.selectValues(dim, [value], true);
                }



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