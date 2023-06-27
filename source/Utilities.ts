import { Point } from "./Point.js";
import { HashStorage } from "./HashStorage.js";
import { VoxelStorage } from "./VoxelStorage.js";
import { Point2D } from "./Point2D.js";
import { Point3D } from "./Point3D.js";
import { DimensionalAnalyzer } from "./DimensionalAnalyzer.js";

export class Utilities {
   static pythagorean(p1: Point, p2: Point): number {
      if (p1.dimensionCount() != p2.dimensionCount() || p1.dimensionCount() === 0 || p2.dimensionCount() === 0) {
         throw new Error(`Dimensions are not the same or dimension count is zero: p1 ${p1.dimensionCount()} verse p2 ${p2.dimensionCount()}`)
      }
      let d = 0;
      for (let i = 0; i < p1.dimensionCount(); i++) {
         d += Math.pow(Math.abs(p1.arr[i] - p2.arr[i]), 2)
      }
      return Math.sqrt(d);
   }
   static bresenham(p1: Point, p2: Point, returnType: number): Point[] | VoxelStorage<Point> | HashStorage<Point> {
      if (p1.dimensionCount() != p2.dimensionCount() || p1.dimensionCount() === 0 || p2.dimensionCount() === 0) {
         throw new Error(`Dimensions are not the same or dimension count is zero: p1 ${p1.dimensionCount()} verse p2 ${p2.dimensionCount()}`)
      }
      let coordinates: Point[] = []
      let voxelStorage: VoxelStorage<Point> = new VoxelStorage<Point>(p1.dimensionCount())
      let hashStorage: HashStorage<Point> = new HashStorage<Point>(p1.dimensionCount())
      let flag: boolean = true;
      for (let i = 0; i < p1.dimensionCount(); i++) {
         if (p1.arr[i] != p2.arr[i]) {
            flag = false;
         }
      }
      if (flag) {
         if (returnType === 0) {
            return [p1];
         } else if (returnType === 1) {
            voxelStorage.addCoordinate(p1, false);
            return voxelStorage;
         } else {
            hashStorage.addCoordinate(p1, false);
            return hashStorage;
         }
      }
      const startPoint: number[] = p1.arr;
      const endPoint: number[] = p2.arr;
      const currentPoint: number[] = [...startPoint];
      const differences: number[] = []
      const increments: number[] = []
      let indexOfGreatest: number = 0;
      const dimensions = p1.dimensionCount();
      for (let i = 0; i < dimensions; i++) {
         differences.push(Math.abs(endPoint[i] - startPoint[i]));
         if (endPoint[i] - startPoint[i] < 0) {
            increments.push(-1);
         } else {
            increments.push(1);
         }
         if (differences[i] > differences[indexOfGreatest]) {
            indexOfGreatest = i;
         }
      }
      let steppingValues: number[] = [];
      for (let i = 0; i < dimensions; i++) {
         steppingValues.push(2 * differences[i] - differences[indexOfGreatest]);
      }
      while (true) {
         if (!(startPoint[indexOfGreatest] < endPoint[indexOfGreatest] ? (currentPoint[indexOfGreatest] <= endPoint[indexOfGreatest]) : (currentPoint[indexOfGreatest] >= endPoint[indexOfGreatest]))) {
            if (returnType === 0) {
               return coordinates
            } else if (returnType === 1) {
               return voxelStorage;
            } else {
               return hashStorage;
            }
         }
         if (returnType === 0) {
            coordinates.push(p1.factoryMethod([...currentPoint]))
         } else if (returnType === 1) {
            voxelStorage.addCoordinate(p1.factoryMethod([...currentPoint]), false)
         } else {
            hashStorage.addCoordinate(p1.factoryMethod([...currentPoint]), false)
         }
         for (let i = 0; i < dimensions; i++) {
            if (i === indexOfGreatest) {
               continue;
            }
            else if (steppingValues[i] < 0) {
               steppingValues[i] += (2 * differences[i]);
            } else {
               currentPoint[i] += increments[i];
               steppingValues[i] += ((2 * differences[i]) - (2 * differences[indexOfGreatest]));
            }
         }
         currentPoint[indexOfGreatest] += increments[indexOfGreatest];
      }
   }

   static pointOrientation = (p1: Point2D, p2: Point2D, p3: Point2D) => {
      // returns slope from p1 to p2 minus p2 to p3
      return (p2.arr[0] - p1.arr[0]) * (p3.arr[1] - p1.arr[1]) - (p2.arr[1] - p1.arr[1]) * (p3.arr[0] - p1.arr[0])
   }

   static convexHull(inputPoints: Point2D[]) {
      let stack: Point2D[] = [];
      // Sort the data set from lowest x value to highest
      let sortedPoints: Point2D[] = inputPoints.reduce((accumulator: Point2D[], cv: Point2D) => {
         return accumulator.push(cv.clone()), accumulator
      }, []).sort((a: Point2D, b: Point2D) => a.arr[0] - b.arr[0])
      let center: Point2D = sortedPoints[0];
      sortedPoints = [center, ...sortedPoints.splice(1, sortedPoints.length).sort((a, b) => DimensionalAnalyzer.polarSort(a, b, center))];
      for (let i = 0; i < sortedPoints.length; i++) {
         let point: Point2D = sortedPoints[i];
         if (stack.length > 1) {
            while (stack.length > 1 && Utilities.pointOrientation(stack[1], stack[0], point) <= 0) {
               stack.shift();
            }
         }
         stack.unshift(point);
      }
      return stack;
   }

}