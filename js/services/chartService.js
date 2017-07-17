define(['../../libs/d3.min', '../../libs/lodash.min'], function (d3, _) {

    class ChartService {
        constructor(argz = {}) { }

        drawChart(elementsId, data, svgParams = {}) {

            _.defaults(svgParams, { width: 600, height: 400 });
            let svg, width, height, g;
            this.checkIfSvgExistsAndCreateIfNeed.call(this, elementsId, svgParams);

            svg = d3.select(`#${elementsId} svg`);

            width = svgParams.width - svgParams.margin.left - svgParams.margin.right;
            height = svgParams.height - svgParams.margin.top - svgParams.margin.bottom;

            g = svg.append(`g`)
                .attr(`transform`,
                `translate(` + svgParams.margin.left + `,` + svgParams.margin.top + `)`);

            // bars
            g.selectAll(`.bar`)
                .data(data)
                .enter().append(`rect`)
                .attr(`class`, `bar`)
                .attr(`x`, function (d) { return d.xPosition; })
                .attr(`y`, function (d) { return d.yPosition; })
                .attr(`width`, function (d) { return d.blockWidth; })
                .attr(`height`, function (d) { return d.chartBlockSize; });

            // inner label
            g.selectAll(`.innerLabel`)
                .data(data)
                .enter().append(`text`)
                .attr(`class`, `innerLabel`)
                .attr(`x`, function (d) { return d.xLabelPosition; })
                .attr(`y`, function (d) { return d.yLabelPosition; })
                .attr(`alignment-baseline`, `middle`)
                .attr(`text-anchor`, `middle`)
                .text(d => (d.innerLabel));

            // upper label
            g.selectAll(`.upperLabel`)
                .data(_.uniqBy(data, 'topLabel'))
                .enter()
                .append(`text`)
                .attr(`class`, `upperLabel`)
                .attr(`x`, function (d) { return d.xLabelPosition; })
                .attr(`y`, function (d) { return -20 })
                .attr(`text-anchor`, `middle`)
                .text(function (d) { return d.topLabel; });
        }

        checkIfSvgExistsAndCreateIfNeed(containersId, svgParams) {
            let container = document.body.querySelector(`#${containersId}`);
            let svg = container.querySelector(`svg`);

            if (_.isNil(svg)) {
                container.innerHTML = `<svg class="bar-chart" width="${svgParams.width}" height="${svgParams.height}"></svg>`;
            } else {
                svg.setAttribute(`width`, `${svgParams.width}`);
                svg.setAttribute(`height`, `${svgParams.height}`);
                svg.setAttribute(`class`, `bar-chart`);
            }
        }

        static create(argz) {
            return new ChartService(argz);
        }
    }

    return ChartService;

});