// import { AVLObject } from "./AVLObject.js";
// import { Point } from "./Point.js";
// import { Utilities } from "./Utilities.js";
// import { TreeStorage } from "./TreeStorage.js";
// import { BaseObject } from "./PointStorageManager.js";
// import { Point3D } from "./Point3D.js";
// import { Point2D } from "./Point2D.js";
// import { Polygon } from "./Polygon.js";
// import { DimensionalAnalyzer } from "./DimensionalAnalyzer.js";
// import { Point1D } from "./Point1D.js";
// import { PointFactoryMethods } from "./PointFactoryMethods.js";
export {};
// export interface ExtrudeOptions {
//    maxSlices: number,
//    passes: number,
//    shell: boolean
//    fillSegmentEndCaps: boolean
// }
// export class ConvexExtrude3D extends AVLObject<Point3D> {
//    segmentsEdges: TreeStorage<Point3D>[] = []
//    segmentAnalyzers: DimensionalAnalyzer<Point3D, Point2D>[] = []
//    extrudeObjects: Polygon<Point3D, Point2D>[] = []
//    pointLowerFactoryMethod: Function = PointFactoryMethods.getFactoryMethod(2);
//    pointFactoryMethod: Function = PointFactoryMethods.getFactoryMethod(3)
//    options: ExtrudeOptions[] = []
//    fillEndCaps: boolean = false;
//    constructor(extrudeObjects: Polygon<Point3D, Point2D>[]) {
//       super(3)
//       this.extrudeObjects = [...extrudeObjects];
//       this.extrudeObjects.forEach(v => {
//          if (!v.hasEdges) {
//             v.createEdges()
//          }
//          return v;
//       })
//    }
//    generateEdges() {
//       this.options = []
//       this.fillEndCaps = false
//       this.segmentAnalyzers = []
//       this.segmentsEdges = []
//       for (let i = 0; i < this.extrudeObjects.length - 1; i++) {
//          let startingVertices = this.extrudeObjects[i].vertices
//          let endingVertices = this.extrudeObjects[i + 1].vertices
//          this.segmentsEdges.push(new TreeStorage<Point3D>(3))
//          this.segmentAnalyzers.push(new DimensionalAnalyzer<Point3D, Point2D>(this.segmentsEdges[i]))
//          for (let sv of startingVertices) {
//             for (let ev of endingVertices) {
//                let coordinates: Point3D[] = Utilities.bresenham(sv, ev, 0) as Point3D[];
//                this.internalStorage.addCoordinates(coordinates, false)
//                this.segmentsEdges[i].addCoordinates(coordinates, false)
//             }
//          }
//          if (!this.extrudeObjects[i].hasEdges) {
//             this.extrudeObjects[i].createEdges()
//          }
//          if (!this.extrudeObjects[i + 1].hasEdges) {
//             this.extrudeObjects[i + 1].createEdges()
//          }
//          this.internalStorage.addCoordinates(this.extrudeObjects[i].getCoordinateList(false, true) as Point3D[], false)
//          this.segmentsEdges[i].addCoordinates(this.extrudeObjects[i].getCoordinateList(false, true) as Point3D[], false)
//          this.internalStorage.addCoordinates(this.extrudeObjects[i + 1].getCoordinateList(false, true) as Point3D[], false)
//          this.segmentsEdges[i].addCoordinates(this.extrudeObjects[i + 1].getCoordinateList(false, true) as Point3D[], false)
//       }
//    }
//    extrude(options: ExtrudeOptions[], fillEndCaps: boolean) {
//       this.options = [...options]
//       this.fillEndCaps = fillEndCaps;
//       this.internalStorage.reset()
//       let tempPolygon = new Polygon<Point2D, Point1D>([], 2)
//       for (let i = 0; i < this.segmentsEdges.length; i++) {
//          let sortedSpans = this.segmentsEdges[i].getSortedRange();
//          const { passes, maxSlices, shell, fillSegmentEndCaps } = options[i]
//          for (let j = 0; j < passes; j++) {
//             this.segmentAnalyzers[j].generateStorageMap(sortedSpans[j][0])
//             let sliceAmount = 0;
//             this.segmentAnalyzers[j].storageMap.forEach((value: Point2D[], key: number) => {
//                sliceAmount += 1;
//                if (sliceAmount <= maxSlices) {
//                   tempPolygon.changeVertices(Utilities.convexHull(value)).createEdges()
//                   if (!shell) {
//                      tempPolygon.fillPolygon(1, true)
//                   }
//                   var coordinatesSlice: Point2D[] = tempPolygon.getCoordinateList(false, true) as Point2D[];
//                   var unProjectedCoordinates: Point3D[] = coordinatesSlice.reduce((accumulator, value) => {
//                      return accumulator.push(Utilities.convertDimensionHigher(value, sortedSpans[j][0], key, 2)), accumulator
//                   }, [] as Point3D[])
//                   this.internalStorage.addCoordinates(unProjectedCoordinates, false)
//                }
//             })
//          }
//          if (fillSegmentEndCaps) {
//             if (!this.extrudeObjects[i].hasFill) {
//                this.extrudeObjects[i].fillPolygon(passes, true)
//             }
//             if (!this.extrudeObjects[i + 1].hasFill) {
//                this.extrudeObjects[i + 1].fillPolygon(passes, true)
//             }
//          }
//       }
//       if (this.extrudeObjects.length > 0 && fillEndCaps) {
//          const startCap: Polygon<Point3D, Point2D> = this.extrudeObjects[0].clone()
//          const endCap: Polygon<Point3D, Point2D> = this.extrudeObjects[this.extrudeObjects.length - 1].clone()
//          if (!startCap.hasFill) {
//             startCap.fillPolygon(this.options[0].passes, true)
//          }
//          if (!endCap.hasFill) {
//             startCap.fillPolygon(this.options[this.options.length - 1].passes, true)
//          }
//          this.internalStorage.addCoordinates(startCap.getCoordinateList(false, true) as Point3D[], false)
//          this.internalStorage.addCoordinates(endCap.getCoordinateList(false, true) as Point3D[], false)
//       }
//       // Create the end caps for the shell.
//    }
// }
