import { VoxelStorageNode } from "./VoxelStorageNode.js";
import { BinaryTree } from "./BinaryTree.js";
import { VoxelStorageComparator } from "./VoxelStorageComparator.js";
export class VoxelStorage {
    root = new BinaryTree(undefined, new VoxelStorageComparator());
    maxDepth = -1;
    constructor(maxDepth) {
        if (maxDepth < 1) {
            throw new Error("Invalid Depth: Can not be less than 1");
        }
        this.maxDepth = maxDepth;
    }
    getMaxDepth() {
        return this.maxDepth;
    }
    hasCoordinate(coordinate) {
        const { arr } = coordinate;
        let nodeToFind = new VoxelStorageNode(arr[0]);
        if (!this.root.hasItem(nodeToFind)) {
            return false;
        }
        let currentTree = this.root.getItem(nodeToFind).getValue();
        for (let i = 1; i < arr.length; i++) {
            if (currentTree.hasItem(arr[i])) {
                currentTree = currentTree.getItem(arr[i]).getValue();
            }
            else {
                return false;
            }
        }
        return true;
    }
    addCoordinate(coordinate) {
        const { arr } = coordinate;
        var currentNode;
        for (let i = 0; i < arr.length; i++) {
            const nodeToAdd = new VoxelStorageNode(arr[i]);
            if (i == 0) {
                this.root.addItem(nodeToAdd);
                currentNode = this.root.getItem(nodeToAdd).getValue();
            }
            else {
                currentNode.addItem(arr[i]);
                currentNode = currentNode.getItem(arr[i]).getValue();
            }
        }
        if (!this.root.hasItem(new VoxelStorageNode(arr[0]))) {
            throw new Error("Internal Error");
        }
    }
    removeCoordinate(coordinate) {
        if (!this.hasCoordinate(coordinate)) {
            throw new Error("Coordinate does not exist");
        }
        const { arr } = coordinate;
        let nodeToFind = new VoxelStorageNode(arr[0]);
        let currentTree = this.root.removeItem(nodeToFind).getValue();
        for (let i = 1; i < arr.length; i++) {
            currentTree = currentTree.removeItem(arr[i]).getValue();
        }
    }
    getCoordinatesRecursiveCall(currentNode, currentCoordinate, allCoordinates, depth) {
        console.log("On Current Node: " + currentNode.toPrint() + " | " + depth);
        console.log("Current Coordinate: " + JSON.stringify(currentCoordinate) + " | " + depth);
        if (currentNode.hasRight()) {
            let rightSubTree = currentNode.getRight();
            console.log("-Going Rightwards" + " | " + depth);
            this.getCoordinatesRecursiveCall(rightSubTree, [...currentCoordinate], allCoordinates, depth);
        }
        if (currentNode.hasLeft()) {
            let leftSubTree = currentNode.getLeft();
            console.log("-Going leftwards" + " | " + depth);
            this.getCoordinatesRecursiveCall(leftSubTree, [...currentCoordinate], allCoordinates, depth);
        }
        if (depth >= this.maxDepth) {
            currentCoordinate.push(currentNode.getValue().getData());
            for (let i = currentNode.getAmount(); i > 0; i--) {
                allCoordinates.push([...currentCoordinate]);
            }
            console.log("-Depth is greater, returning: " + (JSON.stringify(currentCoordinate)) + " | " + depth);
            return;
        }
        else {
            currentCoordinate.push(currentNode.getValue().getData());
            let downwardSubTree = currentNode.getValue().getBinarySubTreeRoot();
            console.log("-Going Downwards | " + depth);
            this.getCoordinatesRecursiveCall(downwardSubTree, [...currentCoordinate], allCoordinates, ++depth);
        }
    }
    getCoordinateList() {
        if (this.root.getRoot() === undefined) {
            return [];
        }
        let allCoordinates = [];
        this.getCoordinatesRecursiveCall(this.root.getRoot(), [], allCoordinates, 1);
        return allCoordinates;
    }
    preHash() {
        return this;
    }
    toPrint() {
        return "";
    }
}
