import { AVLObject } from "./AVLObject.js";
import { Point } from "./Point.js";
import { Utilities } from "./Utilities.js";
import { VoxelStorage } from "./VoxelStorage.js";
import { BaseObject } from "./BaseObject.js";
import { Point3D } from "./Point3D.js";
import { Point2D } from "./Point2D.js";
import { AVLPolygon } from "./AVLPolygon.js";
import { DimensionalAnalyzer } from "./DimensionalAnalyzer.js";
import { Point1D } from "./Point1D.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";

class AVLConvexExtrude3D extends AVLObject<Point3D> {
   segmentsEdges: VoxelStorage<Point3D>[] = []
   segmentAnalyzers: DimensionalAnalyzer<Point3D, Point2D>[] = []
   extrudeObjects: AVLPolygon<Point3D, Point2D>[] = []
   passes: number = 1;
   pointLowerFactoryMethod: Function = PointFactoryMethods.getFactoryMethod(2);
   pointFactoryMethod: Function = PointFactoryMethods.getFactoryMethod(3)
   useSort: boolean = false;
   constructor(extrudeObjects: AVLPolygon<Point3D, Point2D>[]) {
      super(3)
      this.extrudeObjects = extrudeObjects;
   }
   generateEdges() {
      this.passes = -1;
      this.useSort = false
      this.segmentAnalyzers = []
      this.segmentsEdges = []
      for (let i = 0; i < this.extrudeObjects.length - 1; i++) {
         let startingVertices = this.extrudeObjects[i].vertices
         let endingVertices = this.extrudeObjects[i + 1].vertices
         this.segmentsEdges.push(new VoxelStorage<Point3D>(3))
         this.segmentAnalyzers.push(new DimensionalAnalyzer<Point3D, Point2D>(this.segmentsEdges[i]))
         for (let sv of startingVertices) {
            for (let ev of endingVertices) {
               let coordinates: Point3D[] = Utilities.bresenham(sv, ev, 0) as Point3D[];
               this.internalStorage.addCoordinates(coordinates, false)
               this.segmentsEdges[i].addCoordinates(coordinates, false)
            }
         }
      }
   }
   extrude(shell: boolean, passes: number, useSort: boolean) {
      this.passes = passes;
      this.internalStorage.reset()
      let referencePoint = new Point2D(0, 0)
      let tempPolygon = new AVLPolygon<Point2D, Point1D>([], 2)
      for (let i = 0; i < this.segmentsEdges.length; i++) {
         let sortedSpans = this.segmentsEdges[i].getSortedRange();
         for (let j = 0; j < passes; j++) {
            this.segmentAnalyzers[j].generateStorageMap(sortedSpans[j][0], true, 1, referencePoint)
            this.segmentAnalyzers[j].storageMap.forEach((value: Point2D[], key: number) => {
               tempPolygon.changeVertices(value).createEdges()
               if (shell) {
                  tempPolygon.fillPolygon(1, true)
               }
               this.internalStorage.addCoordinates(((tempPolygon.getCoordinateList(false, true) as Point2D[]).map((value: Point2D) => tempPolygon.convertDimensionHigher(value, sortedSpans[j][0], key)) as Point3D[]), false)
            })
         }
      }
   }
}