import { TreeStorageNode } from "./TreeStorageNode.js";
import { AVLTree } from "./AVLTree.js";
import { TreeStorageComparator } from "./TreeStorageComparator.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";
export class TreeStorage {
    allCoordinateCount = 0;
    uniqueCoordinateCount = 0;
    dimensionalRanges = new Map();
    outdatedDimensionRanges = new Map();
    dimensionCount;
    root = new AVLTree(undefined, new TreeStorageComparator());
    pointFactoryMethod;
    constructor(dimensionCount) {
        this.dimensionCount = dimensionCount;
        for (let i = 0; i < this.dimensionCount; i++) {
            this.dimensionalRanges.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
            this.outdatedDimensionRanges.set(i, false);
        }
        this.pointFactoryMethod = PointFactoryMethods.getFactoryMethod(dimensionCount);
    }
    /**
    * Private recursive method for calculating the range of dimensions within the tree.
    *
    * @param currentNode The current Node the call stack is checking
    * @param depth The current depth of the tree. Zero is for the x (or first) dimension.
    * @param limitingDepth If the parameter specifies useInclusiveRanges, then stop after this depth
    * @param useInclusiveRanges  If the program should use a list of target dimensions to calculate the range for verse calculating ranges up to a depth
    * @param inclusiveRanges Otherwise, without a limiting depth, only re-calculate ranges for this depth.
    */
    #findRangeRecursiveCall(currentNode, depth, limitingDepth, useInclusiveRanges, inclusiveRanges) {
        if (!useInclusiveRanges || depth === inclusiveRanges[inclusiveRanges.length - 1]) {
            if (useInclusiveRanges) {
                // n is the length of the initial inclusiveRanges array
                // Removing from end of array is o(1), so o(n) for all range values;
                // Instead of shift that will be o(n^2).
                inclusiveRanges?.pop();
            }
            const amount = currentNode.getAmount();
            const currentValue = this.dimensionalRanges.get(depth);
            // [minValue, minAmount, maxValue, maxAmount]
            if (amount < currentValue[0]) {
                currentValue[0] = amount;
                currentValue[1] = 1;
            }
            if (amount === currentValue[0]) {
                currentValue[1] += amount;
            }
            if (amount > currentValue[2]) {
                currentValue[2] = amount;
                currentValue[3] = 1;
            }
            if (amount === currentValue[2]) {
                currentValue[3] += amount;
            }
        }
        if (currentNode.hasRight()) {
            let rightSubTree = currentNode.getRight();
            this.#findRangeRecursiveCall(rightSubTree, depth, limitingDepth, useInclusiveRanges, inclusiveRanges);
        }
        if (currentNode.hasLeft()) {
            let leftSubTree = currentNode.getLeft();
            this.#findRangeRecursiveCall(leftSubTree, depth, limitingDepth, useInclusiveRanges, inclusiveRanges);
        }
        if (depth < (!useInclusiveRanges ? limitingDepth : this.dimensionCount - 1)) {
            let downwardSubTree = currentNode.getValue().getBinarySubTreeRoot();
            this.#findRangeRecursiveCall(downwardSubTree, ++depth, limitingDepth, useInclusiveRanges, inclusiveRanges);
        }
    }
    /**
     * Re-calculates the internal range hash map.
     *
     * @param useInclusive If the program should use a list of target dimensions to calculate the range for verse calculating ranges up to a depth
     * @param inclusiveRange Only calculate the ranges for these dimensions
     * @param exclusiveDepth Otherwise, only calculate up to this depth
     * @returns The dimension range object
     */
    #findRange(useInclusive, inclusiveRange, exclusiveDepth) {
        if (exclusiveDepth > this.dimensionCount) {
            throw new Error(`Invalid tree height for range call: ${exclusiveDepth} greater than this.dimensionCount ${this.dimensionCount}`);
        }
        const range = this.dimensionalRanges === undefined ? new Map() : this.dimensionalRanges;
        if (!useInclusive) {
            for (let i = 0; i < exclusiveDepth; i++) {
                this.outdatedDimensionRanges.set(i, false);
                range.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
            }
        }
        else {
            inclusiveRange = inclusiveRange?.sort((a, b) => b - a);
            if (inclusiveRange[0] > this.dimensionCount) {
                throw new Error(`Inclusive Ranges depth too large: ${JSON.stringify(range)}`);
            }
            for (let i = 0; i < inclusiveRange.length; i++) {
                let rangeNumber = inclusiveRange[i];
                this.outdatedDimensionRanges.set(rangeNumber, false);
                range.set(rangeNumber, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
            }
        }
        if (this.uniqueCoordinateCount === 0) {
            return range;
        }
        this.#findRangeRecursiveCall(this.root.getRoot(), 0, exclusiveDepth, useInclusive, inclusiveRange);
        return range;
    }
    /**
     * @param inclusiveRange Re-calculate the range at only these dimensions
     * @returns The current dimension range hashmap
     */
    findRangeInclusive(inclusiveRange) {
        return this.#findRange(true, inclusiveRange, -1);
    }
    /**
     * @param maxDimensions  Re-calculate the range up to these dimensions
     * @returns
     */
    findRangeExclusive(maxDimensions) {
        return this.#findRange(true, [], maxDimensions);
    }
    hasCoordinate(coordinate) {
        const { arr } = coordinate;
        var amount = 0;
        let nodeToFind = new TreeStorageNode(arr[0]);
        if (!this.root.hasItem(nodeToFind)) {
            return [false, 0];
        }
        let currentTree = this.root.getItem(nodeToFind).getValue();
        for (let i = 1; i < arr.length; i++) {
            let currentTreeItem = currentTree.getItem(arr[i]);
            if (currentTreeItem !== undefined) {
                amount = currentTreeItem.getAmount();
                currentTree = currentTree.getItem(arr[i]).getValue();
            }
            else {
                return [false, 0];
            }
        }
        return [true, amount];
    }
    /**
     * Adds a coordinate to the tree.
     *
     * @param coordinate The coordinate instance to add.
     * @param allowDuplicates If this coordinate already exists in this tree, specify true to ignore it or false to increase the amount of that coordinate.
     * @returns
     */
    addCoordinate(coordinate, allowDuplicates) {
        const { arr } = coordinate;
        var currentNode;
        const hasItem = this.hasCoordinate(coordinate)[0];
        if (!allowDuplicates && hasItem) {
            return;
        }
        else if (allowDuplicates && hasItem) {
            this.allCoordinateCount += 1;
        }
        else {
            this.uniqueCoordinateCount += 1;
        }
        for (let i = 0; i < arr.length; i++) {
            const range = this.dimensionalRanges.get(i);
            // Calculates the range as each dimension is traversed to prevent needing to call findRange
            if (arr[i] < range[0]) {
                range[0] = arr[i];
                range[1] = 1;
            }
            else if (arr[i] === range[0]) {
                range[1] += 1;
            }
            if (arr[i] > range[2]) {
                range[2] = arr[i];
                range[3] = 1;
            }
            else if (arr[i] === range[2]) {
                range[3] += 1;
            }
            const nodeToAdd = new TreeStorageNode(arr[i]);
            if (i == 0) {
                this.root.addItem(nodeToAdd);
                currentNode = this.root.getItem(nodeToAdd).getValue();
            }
            else {
                currentNode.addItem(arr[i]);
                currentNode = currentNode.getItem(arr[i]).getValue();
            }
        }
        if (!this.root.hasItem(new TreeStorageNode(arr[0]))) {
            throw new Error("Internal Error");
        }
    }
    addCoordinates(coordinates, allowDuplicates) {
        for (let coord of coordinates) {
            this.addCoordinate(coord, allowDuplicates);
        }
    }
    removeCoordinates(coordinates, calculateRange) {
        let rangeList = [];
        for (let coord of coordinates) {
            let ranges = this.removeCoordinate(coord, false);
            for (let v of ranges) {
                if (rangeList.indexOf(v) === -1) {
                    rangeList.push(v);
                }
            }
        }
        if (calculateRange && rangeList.length > 0) {
            this.findRangeInclusive(rangeList);
        }
        return rangeList;
    }
    /**
     * Removes a coordinate of type E from the tree.
     *
     * @param coordinate Coordinate instance to remove
     * @param calculateRange If the dimension ranges should be re-calculated.
     * @returns
     */
    removeCoordinate(coordinate, calculateRange) {
        const hasItem = this.hasCoordinate(coordinate);
        if (!hasItem[0]) {
            return [];
        }
        else if (hasItem[1] > 1) {
            this.allCoordinateCount -= 1;
        }
        else if (hasItem[1] === 1) {
            this.allCoordinateCount -= 1;
            this.uniqueCoordinateCount -= 1;
        }
        else {
            throw new Error("Invalid coordinate count for removing coordinate: " + coordinate.toPrint());
        }
        // Grab the list of dimension values from the coordinate
        const { arr } = coordinate;
        /**
        * The range list contains the dimension numbers that ranges needs to be re-calculated. This is because, if a y coordinate is removed
        * and it was the min or the max of that y-coordinate range, then a new one must be found.
        */
        const rangeList = [];
        let nodeToFind = new TreeStorageNode(arr[0]);
        // Find the node that needs to be reduced
        let nodeToReduce = this.root.getItem(nodeToFind);
        let nodeToReduceValue = nodeToReduce.getValue().getData();
        let dimensionEntry = this.dimensionalRanges.get(0);
        // If the node to reduce amount is equal to one, this node and its sub-branch is removed from the tree.
        if (nodeToReduce.getAmount() === 1) {
            // If the reduced value is the min of the entire range for that dimension
            if (nodeToReduceValue === dimensionEntry[0]) {
                // And it is the only number that is that min
                if (dimensionEntry[1] === 1) {
                    // That range needs to be re-calculated.
                    rangeList.push(0);
                }
                else {
                    // Otherwise, just reduce the amount of numbers that are the min of that dimension
                    dimensionEntry[1] -= 1;
                }
                // Same applies with the max
            }
            else if (nodeToReduceValue === dimensionEntry[1]) {
                if (dimensionEntry[3] === 1) {
                    rangeList.push(0);
                }
                else {
                    dimensionEntry[3] -= 1;
                }
            }
            // Otherwise, this number is inbetween the min and the max, and the range does not need to be recalculated.
        }
        // The value of each TreeStorageNode is another tree, and grab that tree.
        let currentTree = this.root.removeItem(nodeToFind).getValue();
        // Start at the second dimension, work your way into all subsequente dimensions.
        for (let i = 1; i < arr.length; i++) {
            nodeToReduce = currentTree.getItem(arr[i]);
            nodeToReduceValue = nodeToReduce.getValue().getData();
            dimensionEntry = this.dimensionalRanges.get(i);
            // If the node to reduce amount is equal to one, this node and its sub-branch is removed from the tree.
            if (nodeToReduce.getAmount() === 1) {
                // If the reduced value is the min of the entire range for that dimension
                if (nodeToReduceValue === dimensionEntry[0]) {
                    // And it is the only number that is that min
                    if (dimensionEntry[1] === 1) {
                        // That range needs to be re-calculated.
                        this.outdatedDimensionRanges.set(i, true);
                        rangeList.push(i);
                    }
                    else {
                        // Otherwise, just reduce the amount of numbers that are the min of that dimension
                        dimensionEntry[1] -= 1;
                    }
                    // Same applies with the max
                }
                else if (nodeToReduceValue === dimensionEntry[1]) {
                    if (dimensionEntry[3] === 1) {
                        this.outdatedDimensionRanges.set(i, true);
                        rangeList.push(i);
                    }
                    else {
                        dimensionEntry[3] -= 1;
                    }
                }
                // Otherwise, this number is between the min and the max, and the range does not need to be recalculated.
            }
            currentTree = currentTree.removeItem(arr[i]).getValue();
        }
        if (calculateRange && rangeList.length > 0) {
            this.findRangeInclusive(rangeList);
        }
        else {
        }
        return rangeList;
    }
    /**
     * Private recursive call for collecting the coordinates in the tree.
     *
     * @param currentNode
     * @param currentCoordinate
     * @param allCoordinates Uses a reference to an external list rather than returning that list
     * @param depth
     * @returns
     */
    #getCoordinatesRecursiveCall(currentNode, currentCoordinate, allCoordinates, depth, duplicates, instances) {
        if (currentNode.hasRight()) {
            let rightSubTree = currentNode.getRight();
            this.#getCoordinatesRecursiveCall(rightSubTree, [...currentCoordinate], allCoordinates, depth, duplicates, instances);
        }
        if (currentNode.hasLeft()) {
            let leftSubTree = currentNode.getLeft();
            this.#getCoordinatesRecursiveCall(leftSubTree, [...currentCoordinate], allCoordinates, depth, duplicates, instances);
        }
        if (depth >= this.dimensionCount) {
            currentCoordinate.push(currentNode.getValue().getData());
            if (duplicates) {
                for (let i = currentNode.getAmount(); i > 0; i--) {
                    if (instances) {
                        allCoordinates.push(this.pointFactoryMethod(currentCoordinate));
                    }
                    else {
                        allCoordinates.push([...currentCoordinate]);
                    }
                }
            }
            else {
                if (instances) {
                    allCoordinates.push(this.pointFactoryMethod(currentCoordinate));
                }
                else {
                    allCoordinates.push([...currentCoordinate]);
                }
            }
            return;
        }
        else {
            currentCoordinate.push(currentNode.getValue().getData());
            let downwardSubTree = currentNode.getValue().getBinarySubTreeRoot();
            this.#getCoordinatesRecursiveCall(downwardSubTree, [...currentCoordinate], allCoordinates, depth + 1, duplicates, instances);
        }
    }
    getCoordinates(duplicates, instances) {
        if (this.root.getRoot() === undefined) {
            return [];
        }
        let allCoordinates = [];
        this.#getCoordinatesRecursiveCall(this.root.getRoot(), [], allCoordinates, 1, duplicates, instances);
        return allCoordinates;
    }
    /**
      * @returns Within the dimensionRange, dimensions are stored zero through n (key) and the min and maxes are stored (value). The span is the difference between the min and the max of each dimension.
      * This function will return a list of [dimensionNumber, dimensionSpan] elements sorted by span.
    */
    getSortedRange() {
        // Each element is a [dimensionNumber, dimensionSpan]
        let list = [];
        // For each range in the hashmap
        for (let [key, value] of this.dimensionalRanges) {
            // Calculate the span of that dimension. Difference between min and max. 
            let r = Math.abs(value[0] - value[2]);
            // Add the [dimensionNumber: span] to the list.
            list.push([key, r]);
        }
        // Sort from highest to lowest dimension.
        list.sort((a, b) => b[1] - a[1]);
        // Then return that.
        return list;
    }
    correctOutdatedRanges() {
        let ranges = [];
        for (let [key, value] of this.outdatedDimensionRanges) {
            if (value) {
                ranges.push(key);
            }
        }
        return this.findRangeInclusive(ranges);
    }
    hasOutdatedRanges() {
        for (let [key, value] of this.outdatedDimensionRanges) {
            if (value) {
                return true;
            }
        }
        return false;
    }
    reset() {
        this.root = new AVLTree(undefined, new TreeStorageComparator());
        for (let i = 0; i < this.dimensionCount; i++) {
            this.dimensionalRanges.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
            this.outdatedDimensionRanges.set(i, false);
        }
        this.allCoordinateCount = 0;
        this.uniqueCoordinateCount = 0;
        return this;
    }
    clone() {
        const newStorage = new TreeStorage(this.dimensionCount);
        const coordinates = this.getCoordinates(true, true);
        coordinates.forEach(value => newStorage.addCoordinate(value.clone(), true));
        return newStorage;
    }
    preHash() {
        return this;
    }
    toPrint() {
        return JSON.stringify(this.getCoordinates(true, false));
    }
}
