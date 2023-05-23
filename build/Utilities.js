import { HashStorage } from "./HashStorage.js";
import { VoxelStorage } from "./VoxelStorage.js";
class Utilities {
    static brensenham(p1, p2, returnType) {
        if (p1.dimensionCount() != p2.dimensionCount() || p1.dimensionCount() === 0 || p2.dimensionCount() === 0) {
            throw new Error(`Dimensions are not the same or dimension count is zero: p1 ${p1.dimensionCount()} verse p2 ${p2.dimensionCount()}`);
        }
        let coordinates = [];
        let voxelStorage = new VoxelStorage(p1.dimensionCount(), p1.factoryMethod);
        let hashStorage = new HashStorage(p1.dimensionCount(), p1.factoryMethod);
        let flag = true;
        for (let i = 0; i < p1.dimensionCount(); i++) {
            if (p1.arr[i] != p2.arr[i]) {
                flag = false;
            }
        }
        if (flag) {
            if (returnType === 0) {
                return [p1];
            }
            else if (returnType === 1) {
                voxelStorage.addCoordinate(p1, false);
                return voxelStorage;
            }
            else {
                hashStorage.addCoordinate(p1, false);
                return hashStorage;
            }
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
        for (let i = 0; i < dimensions; i++) {
            steppingValues.push(2 * differences[i] - differences[indexOfGreatest]);
        }
        while (true) {
            if (!(startPoint[indexOfGreatest] < endPoint[indexOfGreatest] ? (currentPoint[indexOfGreatest] <= endPoint[indexOfGreatest]) : (currentPoint[indexOfGreatest] >= endPoint[indexOfGreatest]))) {
                if (returnType === 0) {
                    return coordinates;
                }
                else if (returnType === 1) {
                    return voxelStorage;
                }
                else {
                    return hashStorage;
                }
            }
            if (returnType === 0) {
                coordinates.push(p1.factoryMethod([...currentPoint]));
            }
            else if (returnType === 1) {
                voxelStorage.addCoordinate(p1.factoryMethod([...currentPoint]), false);
            }
            else {
                hashStorage.addCoordinate(p1.factoryMethod([...currentPoint]), false);
            }
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
