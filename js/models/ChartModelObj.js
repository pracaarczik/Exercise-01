define([], function () {

    class ChartModelObject {
        constructor(argz = {}) {
            this.label1 = argz.dim1;
        }

        static create(argz) {
            return new ChartModelObject(argz);
        }
    }

    return ChartModelObject;

});