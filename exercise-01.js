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
            controller: createController(),
            resize: function (el, layout) {
                layout.drawChart()
            }
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
                    horizontalSpaceBetweenTheBlocks: 10,
                    clickUpperLabelCallback: clickUpperLabelCallback,
                    barsColor: $scope.layout.hexColorPicker
                };

                let dataSvc = DataService.create();
                let chartSvc = ChartService.create();

                $scope.msg = 'Hello Arczik';

                $scope.drawChart = function () {
                    let targetSvgParams = _.assign({},
                        svgParams,
                        { width: _.round($element.width()), height: _.round($element.height()) - 50 });

                    let qHyperCube = $scope.layout.qHyperCube;
                    let chartData = dataSvc.manipulateData(qHyperCube, targetSvgParams);
                    chartSvc.drawChart(`chart-container`, chartData, targetSvgParams);
                };

                $scope.component.model.Validated.bind(function () {
                    $scope.drawChart();
                });

                $scope.$watch(function () { return $scope.layout.hexColorPicker; }, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        svgParams.barsColor = newVal;
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

                // ugly hook to send drawChart into resize event - rlu ugly
                $scope.layout.drawChart = $scope.drawChart;

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