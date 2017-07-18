define(['../../libs/lodash.min'], function (_) {

    'use strict';

    let dummyData = [
        {
            topLabel: 'Label1',
            blockSize: 2,
            blockPosition: 1,
            innerLabel: 'Inner LBL 1'
        },
        {
            topLabel: 'Label1',
            blockSize: 1,
            blockPosition: 1,
            innerLabel: 'Inner LBL 2'
        },
        {
            topLabel: 'Label2',
            blockSize: 3,
            blockPosition: 2,
            innerLabel: 'Inner LBL 3'
        },
        {
            topLabel: 'Label2',
            blockSize: 1,
            blockPosition: 2,
            innerLabel: 'Inner LBL 4'
        },
        {
            topLabel: 'Label2',
            blockSize: 1,
            blockPosition: 2,
            innerLabel: 'Inner LBL 5'
        },
        {
            topLabel: 'Label2',
            blockSize: 10,
            blockPosition: 2,
            innerLabel: 'Inner LBL 6'
        },
        {
            topLabel: 'Label3',
            blockSize: 3,
            blockPosition: 3,
            innerLabel: 'Inner LBL 7'
        },
        {
            topLabel: 'Label4',
            blockSize: 3,
            blockPosition: 4,
            innerLabel: 'Inner LBL 8'
        },
        {
            topLabel: 'Label4',
            blockSize: 2,
            blockPosition: 4,
            innerLabel: 'Inner LBL 9'
        }
    ];

    class DataService {
        constructor(argz = {}) { }

        manipulateData(qHyperCube, svgParams) {

            let i, groupIndex;
            const height = svgParams.height - svgParams.margin.top - svgParams.margin.bottom;
            const width = svgParams.width - svgParams.margin.left - svgParams.margin.right;

            let processedData = this.processQHyperCubeData.call(this, qHyperCube);

            let groupedData = _.groupBy(processedData, `blockPosition`);

            let blockWidth = _.round((width -
                _.keys(groupedData).length * svgParams.horizontalSpaceBetweenTheBlocks) /
                _.keys(groupedData).length);

            groupIndex = 0;
            _.forOwn(groupedData, function (value, key) {
                let yRatio = this.calculateYRatio(value, height, svgParams);
                for (i = 0; i < value.length; ++i) {
                    value[i].chartBlockSize = this.calculateBlockSizeByRation.call(this, value[i].blockSize, yRatio);
                    value[i].yPosition = this.calculateYPosition.call(
                        this,
                        i,
                        _.get(value, `[${i - 1}].chartBlockSize`, 0),
                        _.get(value, `[${i - 1}].yPosition`, 0),
                        svgParams.verticalSpaceBetweenTheBlocks
                    );
                    value[i].yLabelPosition = this.calculateLabelYPosition.call(
                        this,
                        i,
                        _.get(value, `[${i - 1}].chartBlockSize`, 0),
                        _.get(value, `[${i - 1}].yPosition`, 0),
                        svgParams.verticalSpaceBetweenTheBlocks,
                        value[i].chartBlockSize
                    );
                    value[i].blockWidth = blockWidth;
                    value[i].xPosition = this.calculateXPosition.call(
                        this, groupIndex, blockWidth, svgParams.horizontalSpaceBetweenTheBlocks
                    );
                    value[i].xLabelPosition = this.calculateLabelXPosition.call(
                        this,
                        value[i].xPosition,
                        blockWidth
                    );
                }
                ++groupIndex;
            }.bind(this));            

            return processedData;
        }

        calculateBlockSizeByRation(blockSize, ratio) {
            return _.round(blockSize * ratio);
        }

        calculateYRatio(elements, height, svgParams) {
            let availableHeight = height - elements.length * svgParams.verticalSpaceBetweenTheBlocks;
            let sum = _.sumBy(elements, `blockSize`);
            return 0 === sum ? 0 : availableHeight / sum;
        }

        calculateYPosition(index, previousBlockSize, previousY, verticalSpace) {
            return 0 === index ? 0 : previousBlockSize + previousY + verticalSpace;
        }

        calculateLabelYPosition(index, previousBlockSize, previousY, verticalSpace, blockSize) {
            return 0 === index ? _.round(blockSize / 2) : previousBlockSize + previousY + verticalSpace + _.round(blockSize / 2);
        }

        calculateXPosition(index, blockWidth, horizontalSpaceBetweenTheBlocks) {
            return index * (blockWidth + horizontalSpaceBetweenTheBlocks);
        }

        calculateLabelXPosition(currentXPosition, blockWidth) {
            return currentXPosition + _.round(blockWidth / 2);
        }

        processQHyperCubeData(qHyperCube) {
            let dataToProcess = _.cloneDeep(qHyperCube);
            let pages = _.get(dataToProcess, `qDataPages`, []);
            let resultArray = _.map(pages, function (page) {
                let matrix = _.get(page, `qMatrix`, []);
                let matrixResult = _.map(matrix, matrixItem => {
                    return {
                        blockSize: _.round(_.toInteger(_.get(matrixItem, `[2].qText`, 0))),
                        topLabel: _.get(matrixItem, `[0].qText`, ``),
                        innerLabel: _.get(matrixItem, `[1].qText`, ``),
                        qElemNumber: _.get(matrixItem, `[0].qElemNumber`, -1)
                    };
                });

                return matrixResult;
            });

            resultArray = _.flatten(resultArray);

            this.processLabelsForProcessedQHyperCubeData.call(this, resultArray);

            return resultArray;
        }

        processLabelsForProcessedQHyperCubeData(processedData) {
            let uniqueLabels = _.uniq(_.map(processedData, 'topLabel'));

            _.forEach(processedData, item => {
                item.blockPosition = _.indexOf(uniqueLabels, item.topLabel);
            });
        }

        static create(argz) {
            return new DataService(argz);
        }
    }

    return DataService;
})