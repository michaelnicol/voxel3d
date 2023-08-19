import { Comparator } from "../../Interfaces/Comparator.js";
import { Point } from "../../Points/Point.js";
import { ValidObject } from "../../Meshes/ValidObject.js";
import { cloneable } from "../../Interfaces/cloneable.js";

export type DimensionalRanges = Map<number, number[]>

/**
 * To qualify a data structure as a storage mechanisim for points and their values, it must implement the PointStorage interface.
 */
export interface PointStorage<E extends Point> extends cloneable<PointStorage<E>>, ValidObject {
  allCoordinateCount: number
  uniqueCoordinateCount: number
  /**
  * This object holds a hashmap of the dimension as the key, and the value is the extremes for that dimension. Dimensions start at zero for x.
  * 
  * dimensionNumber: [minValue, minAmount, maxValue, maxAmount]
  * 
  * The amount of numbers in the data set that are the min and max are also stored. This prevents re-calculation of the range for a dimension if a,
  * number is removed from the dataset that is not an extreme or it is not the only instance.
  * 
  * If no coordinates are in the tree and findRange is called, the min and max of each dimension will become the min and max integer limits. This is because all future coordinates could exist in that range.
  * This is why the minAmount and maxAmount should be checked.
  * 
  */
  dimensionalRanges: DimensionalRanges
  outdatedDimensionRanges: Map<number, boolean>
  dimensionCount: number
  pointFactoryMethod: Function
  findRangeInclusive(inclusiveRange: number[]): DimensionalRanges
  findRangeExclusive(maxDimensions: number): DimensionalRanges
  addCoordinate(coordinate: E , allowDuplicates: boolean): void
  addCoordinates(coordinates: E[], allowDuplicates: boolean): void
  removeCoordinates(coordinates: E[], calculateRange: boolean): void
  removeCoordinate(coordinate: E, calculateRange: boolean): void
  getCoordinates(duplicates: boolean, instances: boolean): E[] | number[][]
  getSortedRange(): number[][]
  correctOutdatedRanges(): void
  hasOutdatedRanges(): boolean
  reset(): void
}