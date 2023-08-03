import { AVLObject } from "./AVLObject.js";
import { Utilities } from "./Utilities.js";
import { TreeStorage } from "./TreeStorage.js";
import { Polygon } from "./Polygon.js";
import { DimensionalAnalyzer } from "./DimensionalAnalyzer.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";
export class ConvexExtrude3D extends AVLObject {
    segmentsEdges = [];
    segmentAnalyzers = [];
    extrudeObjects = [];
    pointLowerFactoryMethod = PointFactoryMethods.getFactoryMethod(2);
    pointFactoryMethod = PointFactoryMethods.getFactoryMethod(3);
    options = [];
    fillEndCaps = false;
    constructor(extrudeObjects) {
        super(3);
        this.extrudeObjects = [...extrudeObjects];
        this.extrudeObjects.forEach(v => {
            if (!v.hasEdges) {
                v.createEdges();
            }
            return v;
        });
    }
    generateEdges() {
        this.options = [];
        this.fillEndCaps = false;
        this.segmentAnalyzers = [];
        this.segmentsEdges = [];
        for (let i = 0; i < this.extrudeObjects.length - 1; i++) {
            let startingVertices = this.extrudeObjects[i].vertices;
            let endingVertices = this.extrudeObjects[i + 1].vertices;
            this.segmentsEdges.push(new TreeStorage(3));
            this.segmentAnalyzers.push(new DimensionalAnalyzer(this.segmentsEdges[i]));
            for (let sv of startingVertices) {
                for (let ev of endingVertices) {
                    let coordinates = Utilities.bresenham(sv, ev, 0);
                    this.internalStorage.addCoordinates(coordinates, false);
                    this.segmentsEdges[i].addCoordinates(coordinates, false);
                }
            }
            if (!this.extrudeObjects[i].hasEdges) {
                this.extrudeObjects[i].createEdges();
            }
            if (!this.extrudeObjects[i + 1].hasEdges) {
                this.extrudeObjects[i + 1].createEdges();
            }
            this.internalStorage.addCoordinates(this.extrudeObjects[i].getCoordinateList(false, true), false);
            this.segmentsEdges[i].addCoordinates(this.extrudeObjects[i].getCoordinateList(false, true), false);
            this.internalStorage.addCoordinates(this.extrudeObjects[i + 1].getCoordinateList(false, true), false);
            this.segmentsEdges[i].addCoordinates(this.extrudeObjects[i + 1].getCoordinateList(false, true), false);
        }
    }
    extrude(options, fillEndCaps) {
        this.options = [...options];
        this.fillEndCaps = fillEndCaps;
        this.internalStorage.reset();
        let tempPolygon = new Polygon([], 2);
        for (let i = 0; i < this.segmentsEdges.length; i++) {
            let sortedSpans = this.segmentsEdges[i].getSortedRange();
            const { passes, maxSlices, shell, fillSegmentEndCaps } = options[i];
            for (let j = 0; j < passes; j++) {
                this.segmentAnalyzers[j].generateStorageMap(sortedSpans[j][0]);
                let sliceAmount = 0;
                this.segmentAnalyzers[j].storageMap.forEach((value, key) => {
                    sliceAmount += 1;
                    if (sliceAmount <= maxSlices) {
                        tempPolygon.changeVertices(Utilities.convexHull(value)).createEdges();
                        if (!shell) {
                            tempPolygon.fillPolygon(1, true);
                        }
                        var coordinatesSlice = tempPolygon.getCoordinateList(false, true);
                        var unProjectedCoordinates = coordinatesSlice.reduce((accumulator, value) => {
                            return accumulator.push(Utilities.convertDimensionHigher(value, sortedSpans[j][0], key, 2)), accumulator;
                        }, []);
                        this.internalStorage.addCoordinates(unProjectedCoordinates, false);
                    }
                });
            }
            if (fillSegmentEndCaps) {
                if (!this.extrudeObjects[i].hasFill) {
                    this.extrudeObjects[i].fillPolygon(passes, true);
                }
                if (!this.extrudeObjects[i + 1].hasFill) {
                    this.extrudeObjects[i + 1].fillPolygon(passes, true);
                }
            }
        }
        if (this.extrudeObjects.length > 0 && fillEndCaps) {
            const startCap = this.extrudeObjects[0].clone();
            const endCap = this.extrudeObjects[this.extrudeObjects.length - 1].clone();
            if (!startCap.hasFill) {
                startCap.fillPolygon(this.options[0].passes, true);
            }
            if (!endCap.hasFill) {
                startCap.fillPolygon(this.options[this.options.length - 1].passes, true);
            }
            this.internalStorage.addCoordinates(startCap.getCoordinateList(false, true), false);
            this.internalStorage.addCoordinates(endCap.getCoordinateList(false, true), false);
        }
        // Create the end caps for the shell.
    }
}
