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

    var colorPicker = {
        label: "My color-picker",
        component: "color-picker",
        ref: "barsColor",
        type: "integer",
        defaultValue: 3
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
            colorPicker: colorPicker
        }
    };
});