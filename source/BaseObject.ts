import { Point } from "./Point.js";
import { ValidObject } from "./ValidObject.js";
import { VoxelStorage } from "./VoxelStorage.js";

export class BaseObject<E extends Point> implements ValidObject {
    private voxelStorage!: VoxelStorage<E>;
    private pointFactoryMethod: Function;
    constructor(dimensionCount: number, pointFactoryMethod: Function) {
        this.pointFactoryMethod = pointFactoryMethod;
        this.voxelStorage = new VoxelStorage<E>(dimensionCount, pointFactoryMethod)
    }

    setVoxelStorage(newVoxelStorage: VoxelStorage<E>): void {
        if (newVoxelStorage.getDepth() != this.voxelStorage.getDepth()) {
            throw new Error("Can not set voxel storage to a different depth")
        }
        else {
            this.voxelStorage = newVoxelStorage;
            this.pointFactoryMethod = newVoxelStorage.pointFactoryMethod;
        }
    }

    hasVoxel(p: E): boolean {
        return this.voxelStorage.hasCoordinate(p);
    }

    getFactoryMethod(): Function {
        return this.pointFactoryMethod;
    }

    getMaxDimensions(): number {
        return this.voxelStorage.getMaxDimensions();
    }

    getCoordinateCount(): number {
        return this.voxelStorage.getCoordinateCount();
    }

    getCoordinateList(duplicates: boolean): E[] {
        return this.voxelStorage.getCoordinateList(duplicates);
    }

    addVoxels(coordinatesToAdd: E[], allowDuplicates: boolean): BaseObject<E> {
        for (const p of coordinatesToAdd) {
            this.voxelStorage.addCoordinate(p, allowDuplicates);
        }
        return this;
    }

    removeVoxels(coordinatesToRemove: E[]): BaseObject<E> {
        const rangesToUpdate: number[] = [];
        for (const p of coordinatesToRemove) {
            rangesToUpdate.push(...this.voxelStorage.removeCoordinate(p))
        }
        this.voxelStorage.findRangeInclusive(rangesToUpdate, this.voxelStorage.dimensionRange);
        return this;
    }

    preHash() {
        return this;
    }
    toPrint(): string {
        return JSON.stringify(this.voxelStorage.getCoordinateList(true));
    }
    static brensenham(p1: Point, p2: Point, returnList: boolean): Point[] | VoxelStorage<Point> {
        if (p1.dimensionCount() != p2.dimensionCount() || p1.dimensionCount() === 0 || p2.dimensionCount() === 0) {
            throw new Error(`Dimensions are not the same or dimension count is zero: p1 ${p1.dimensionCount()} verse p2 ${p2.dimensionCount()}`)
        }
        let coordinates: Point[] = []
        let voxelStorage: VoxelStorage<Point> = new VoxelStorage<Point>(p1.dimensionCount(), p1.factoryMethod)
        let flag: boolean = true;
        for (let i = 0; i < p1.dimensionCount(); i++) {
            if (p1.arr[i] != p2.arr[i]) {
                flag = false;
            }
        }
        if (flag) {
            if (returnList) {
                return [p1];
            } else {
                voxelStorage.addCoordinate(p1, false);
                return voxelStorage;
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
                return returnList ? coordinates : voxelStorage
            }
            returnList ? coordinates.push(p1.factoryMethod([...currentPoint])) : voxelStorage.addCoordinate(p1.factoryMethod([...currentPoint]), false)
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
}