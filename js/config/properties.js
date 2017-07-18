define([], function () {
    'use strict';

    var dimensions = {
        uses: "dimensions",
        min: 2,
        max: 2
    };
    var measures = {
        uses: "measures",
        min: 1,
        max: 1
    };
    var sorting = { uses: "sorting" };
    var addons = { uses: "addons" };
    var appearancePanel = { uses: "settings" };
    var customTitle = {
        ref: "title",
        label: "Custom Title",
        type: "string",
        defaultValue: "Custom Title"
    };

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

    var colorPicker = {
        label: "My color-picker",
        component: "color-picker",
        ref: "barsColor",
        type: "integer",
        defaultValue: 3,
        change: function (layout) {
            layout.hexColorPicker = palette[layout.barsColor];
        }
    };

    var hexColorPicker = {
        ref: "hexColorPicker",
        type: "string"
    };

    var colorGroup = {
        type: 'items',
        label: 'Colors',
        grouped: true,
        items: {
            // colorPicker: colorPicker,
            // hexColorPicker: hexColorPicker
            gColor: {
                type: 'items',
                items: {
                    colorPicker: colorPicker,
                    hexColorPicker: hexColorPicker
                }
            }
        }
    };


    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            measures: measures,
            sorting: sorting,
            appearance: appearancePanel,
            customTitle: customTitle,
            // colorPicker: colorPicker,
            // hexColorPicker: hexColorPicker
            colorGroup: colorGroup
        }
    };
});