define([], function () {
    'use strict';

    var dimensions = { uses: "dimensions" };
    var measures = { uses: "measures" };
    var sorting = { uses: "sorting" };
    var addons = { uses: "addons" };
    var appearancePanel = { uses: "settings" };
    var customTitle = {
        ref: "title",
        label: "Custom Title",
        type: "string",
        defaultValue: "Custom Title"
    }; 

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            measures: measures,
            sorting: sorting,
            appearance: appearancePanel,
            customTitle: customTitle
        }
    };
});