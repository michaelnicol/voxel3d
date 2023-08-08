import { AVLTree } from "../AVLTree.js";
import { TreeStorageNodeComparator } from "./TreeStorageNodeComparator.js";
export class TreeStorageNode {
    coordinateDate = 0;
    binarySubtree = new AVLTree(undefined, new TreeStorageNodeComparator());
    constructor(coordinateDate) {
        this.coordinateDate = coordinateDate;
    }
    getBinarySubTreeRoot() {
        return this.binarySubtree.getRoot();
    }
    removeItem(coordinateDate) {
        return this.binarySubtree.removeItem(new TreeStorageNode(coordinateDate));
    }
    addItem(coordinateDate) {
        return this.binarySubtree.addItem(new TreeStorageNode(coordinateDate));
    }
    getItem(coordinateDate) {
        return this.binarySubtree.getItem(new TreeStorageNode(coordinateDate));
    }
    hasItem(coordinateDate) {
        return this.binarySubtree.hasItem(new TreeStorageNode(coordinateDate));
    }
    getBinarySubTree() {
        return this.binarySubtree;
    }
    getData() {
        return this.coordinateDate;
    }
    preHash() {
        return this.coordinateDate;
    }
    toPrint() {
        return `Data: ${this.toPrint()}, SubNodes: ${this.binarySubtree.size(true)}`;
    }
}
