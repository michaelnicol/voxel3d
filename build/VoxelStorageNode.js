import { BinaryTree } from "./BinaryTree";
import { VoxelStorageComparator } from "./VoxelStorageComparator";
export class VoxelStorageNode {
    data;
    binarySubtree = new BinaryTree(undefined, new VoxelStorageComparator());
    constructor(data) {
        this.data = data;
    }
    removeItem(numberToRemove) {
        return this.binarySubtree.removeItem(new VoxelStorageNode(numberToRemove));
    }
    addItem(numberToAdd) {
        return this.binarySubtree.addItem(new VoxelStorageNode(numberToAdd));
    }
    getItem(numberToCheck) {
        return this.binarySubtree.getItem(new VoxelStorageNode(numberToCheck));
    }
    preHash() {
        this.data;
    }
    toPrint() {
        return `${this.data}, SubNodes: ${this.binarySubtree.size()}`;
    }
}
