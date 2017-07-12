define(['../../libs/lodash.min'], function (_) {

    'use strict';

    let dummyData = [
        {
            topLabel: 'Label1',
            blockSize: 2,
            blockPosition: 1,
            yPosition: 10,
            innerLabel: 'Inner LBL 1'
        },
        {
            topLabel: 'Label1',
            blockSize: 1,
            blockPosition: 1,
            yPosition: 0,
            innerLabel: 'Inner LBL 2'
        },
        {
            topLabel: 'Label2',
            blockSize: 3,
            blockPosition: 2,
            yPosition: 5,
            innerLabel: 'Inner LBL 3'
        },
        {
            topLabel: 'Label2',
            blockSize: 1,
            blockPosition: 2,
            yPosition: 0,
            innerLabel: 'Inner LBL 4'
        },
        {
            topLabel: 'Label2',
            blockSize: 1,
            blockPosition: 2,
            yPosition: 0,
            innerLabel: 'Inner LBL 5'
        },
        {
            topLabel: 'Label2',
            blockSize: 10,
            blockPosition: 2,
            yPosition: 0,
            innerLabel: 'Inner LBL 6'
        },
        {
            topLabel: 'Label3',
            blockSize: 3,
            blockPosition: 3,
            yPosition: 0,
            innerLabel: 'Inner LBL 7'
        },
        {
            topLabel: 'Label4',
            blockSize: 3,
            blockPosition: 4,
            yPosition: 0,
            innerLabel: 'Inner LBL 8'
        },
        {
            topLabel: 'Label4',
            blockSize: 2,
            blockPosition: 4,
            yPosition: 0,
            innerLabel: 'Inner LBL 9'
        }
    ];

    class DataService {
        constructor(argz = {}) {

        }

        manipulateData(qHyperCube, svgParams) {
            console.log(`manipulateData`, qHyperCube);
            console.log(`hyperCubeData`, _.keys(qHyperCube))

            let i, groupIndex;
            const height = svgParams.height - svgParams.margin.top - svgParams.margin.bottom;
            const width = svgParams.width - svgParams.margin.left - svgParams.margin.right;

            let groupedData = _.groupBy(dummyData, `blockPosition`);

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

            let resultData = dummyData;

            return resultData;
        }

        calculateBlockSizeByRation(blockSize, ratio) {
            return _.round(blockSize * ratio);
        }

        calculateYRatio(elements, height, svgParams) {
            let availableHeight = height - elements.length * svgParams.verticalSpaceBetweenTheBlocks;
            let sum = _.sumBy(elements, `blockSize`);
            return availableHeight / sum;
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

        static create(argz) {
            return new DataService(argz);
        }
    }

    return DataService;
})