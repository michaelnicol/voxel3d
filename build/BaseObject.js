import { VoxelStorage } from "./VoxelStorage.js";
export class BaseObject {
    voxelStorage;
    pointFactoryMethod;
    constructor(dimensionCount, pointFactoryMethod) {
        this.pointFactoryMethod = pointFactoryMethod;
        this.voxelStorage = new VoxelStorage(dimensionCount, pointFactoryMethod);
    }
    setVoxelStorage(newVoxelStorage) {
        if (newVoxelStorage.getDepth() != this.voxelStorage.getDepth()) {
            throw new Error("Can not set voxel storage to a different depth");
        }
        else {
            this.voxelStorage = newVoxelStorage;
            this.pointFactoryMethod = newVoxelStorage.pointFactoryMethod;
        }
    }
    hasVoxel(p) {
        return this.voxelStorage.hasCoordinate(p);
    }
    getFactoryMethod() {
        return this.pointFactoryMethod;
    }
    getMaxDimensions() {
        return this.voxelStorage.getMaxDimensions();
    }
    getCoordinateCount() {
        return this.voxelStorage.getCoordinateCount();
    }
    getCoordinateList(duplicates) {
        return this.voxelStorage.getCoordinateList(duplicates);
    }
    addVoxels(coordinatesToAdd, allowDuplicates) {
        for (const p of coordinatesToAdd) {
            this.voxelStorage.addCoordinate(p, allowDuplicates);
        }
        return this;
    }
    removeVoxels(coordinatesToRemove) {
        const rangesToUpdate = [];
        for (const p of coordinatesToRemove) {
            rangesToUpdate.push(...this.voxelStorage.removeCoordinate(p));
        }
        this.voxelStorage.findRangeInclusive(rangesToUpdate, this.voxelStorage.dimensionRange);
        return this;
    }
    preHash() {
        return this;
    }
    toPrint() {
        return JSON.stringify(this.voxelStorage.getCoordinateList(true));
    }
    static brensenham(p1, p2) {
        if (p1.dimensionCount() != p2.dimensionCount() || p1.dimensionCount() === 0 || p2.dimensionCount() === 0) {
            throw new Error(`Dimensions are not the same or dimension count are zero: p1 ${p1.dimensionCount()} verse p2 ${p2.dimensionCount()}`);
        }
        const startPoint = p1.arr;
        const endPoint = p2.arr;
        const currentPoint = [...startPoint];
        const differences = [];
        const increments = [];
        let indexOfGreatest = 0;
        const dimensions = p1.dimensionCount();
        for (let i = 0; i < dimensions; i++) {
            differences.push(Math.abs(endPoint[i] - startPoint[i]));
            if (endPoint[i] - startPoint[i] < 0) {
                increments.push(-1);
            }
            else {
                increments.push(1);
            }
            if (differences[i] > differences[indexOfGreatest]) {
                indexOfGreatest = i;
            }
        }
        let steppingValues = [];
        let coordinates = [];
        for (let i = 0; i < dimensions; i++) {
            steppingValues.push(2 * differences[i] - differences[indexOfGreatest]);
        }
        while (true) {
            if (!(startPoint[indexOfGreatest] < endPoint[indexOfGreatest] ? (currentPoint[indexOfGreatest] <= endPoint[indexOfGreatest]) : (currentPoint[indexOfGreatest] >= endPoint[indexOfGreatest]))) {
                return coordinates;
            }
            coordinates.push(p1.factoryMethod([...currentPoint]));
            for (let i = 0; i < dimensions; i++) {
                if (i === indexOfGreatest) {
                    continue;
                }
                else if (steppingValues[i] < 0) {
                    steppingValues[i] += (2 * differences[i]);
                }
                else {
                    currentPoint[i] += increments[i];
                    steppingValues[i] += ((2 * differences[i]) - (2 * differences[indexOfGreatest]));
                }
            }
            currentPoint[indexOfGreatest] += increments[indexOfGreatest];
        }
    }
}
