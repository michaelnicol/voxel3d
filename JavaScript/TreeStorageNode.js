import { AVLTree } from "./AVLTree.js";
import { TreeStorageComparator } from "./TreeStorageComparator.js";
export class TreeStorageNode {
    data;
    binarySubtree = new AVLTree(undefined, new TreeStorageComparator());
    constructor(data) {
        this.data = data;
    }
    getBinarySubTreeRoot() {
        return this.binarySubtree.getRoot();
    }
    removeItem(numberToRemove) {
        return this.binarySubtree.removeItem(new TreeStorageNode(numberToRemove));
    }
    addItem(numberToAdd) {
        return this.binarySubtree.addItem(new TreeStorageNode(numberToAdd));
    }
    getItem(numberToCheck) {
        return this.binarySubtree.getItem(new TreeStorageNode(numberToCheck));
    }
    hasItem(numberToCheck) {
        return this.binarySubtree.hasItem(new TreeStorageNode(numberToCheck));
    }
    getBinarySubTree() {
        return this.binarySubtree;
    }
    getData() {
        return this.data;
    }
    preHash() {
        return this.data;
    }
    toPrint() {
        return `Data: ${this.data}, SubNodes: ${this.binarySubtree.size(true)}`;
    }
}
