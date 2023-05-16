import { BinaryTreeNode } from "./BinaryTreeNode.js";
export class BinaryTree {
    comparator;
    root = undefined;
    hashMap = new Map();
    constructor(rootData, comparator) {
        if (rootData != undefined) {
            this.root = new BinaryTreeNode(undefined, undefined, undefined, rootData);
            this.hashMap.set(rootData.preHash(), this.root);
        }
        this.comparator = comparator;
    }
    // Interfaces
    preHash() {
        return this;
    }
    getLowestValue() {
        if (this.root === undefined) {
            throw new Error("Can not find lowest value with undefined root");
        }
        let current = this.root;
        while (current.hasLeft()) {
            current = current.getLeft();
        }
        return current;
    }
    getHighestValue() {
        if (this.root === undefined) {
            throw new Error("Can not find highest value with undefined root");
        }
        let current = this.root;
        while (current.hasRight()) {
            current = current.getRight();
        }
        return current;
    }
    getRoot() {
        return this.root;
    }
    removeItem(value) {
        if (this.getItem(value) == undefined) {
            throw new Error("Removing value not in tree");
        }
        else {
            const nodeToRemove = this.getItem(value);
            nodeToRemove.decreaseAmount();
            if (nodeToRemove.getAmount() != 0) {
                return nodeToRemove;
            }
            else if (nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
                let subTreeParentReference = nodeToRemove === this.root ? this.root : nodeToRemove.getParent();
                let rightNode = nodeToRemove.getRight();
                let leftMostNode = rightNode?.getLeft();
                while (leftMostNode != undefined && leftMostNode.hasLeft()) {
                    leftMostNode = leftMostNode.getLeft();
                }
                let newParentOfLeftBranch = leftMostNode === undefined ? rightNode : leftMostNode;
                nodeToRemove.getLeft()?.setParent(newParentOfLeftBranch);
                if (nodeToRemove === this.root) {
                    this.root = rightNode;
                }
                else {
                    if (subTreeParentReference.getLeft() === nodeToRemove) {
                        subTreeParentReference.setLeft(rightNode);
                    }
                    else {
                        subTreeParentReference.setRight(rightNode);
                    }
                }
            }
            else if (nodeToRemove.hasRight() && !nodeToRemove.hasLeft()) {
                let subTreeParentReference = nodeToRemove === this.root ? this.root : nodeToRemove.getParent();
                if (nodeToRemove === this.root) {
                    this.root = nodeToRemove.getRight();
                }
                else {
                    if (subTreeParentReference.getLeft() === nodeToRemove) {
                        subTreeParentReference.setLeft(nodeToRemove.getRight());
                    }
                    else {
                        subTreeParentReference.setRight(nodeToRemove.getRight());
                    }
                }
            }
            else if (!nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
                let subTreeParentReference = nodeToRemove === this.root ? this.root : nodeToRemove.getParent();
                if (nodeToRemove === this.root) {
                    this.root = nodeToRemove.getLeft();
                }
                else {
                    if (subTreeParentReference.getLeft() === nodeToRemove) {
                        subTreeParentReference.setLeft(nodeToRemove.getLeft());
                    }
                    else {
                        subTreeParentReference.setRight(nodeToRemove.getLeft());
                    }
                }
            }
            else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove === this.root) {
                this.root = undefined;
            }
            else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined) {
                const subTreeParentReference = nodeToRemove.getParent();
                if (subTreeParentReference.getLeft() === nodeToRemove) {
                    subTreeParentReference.setLeft(undefined);
                }
                else if (subTreeParentReference.getRight() === nodeToRemove) {
                    subTreeParentReference.setRight(undefined);
                }
            }
            this.hashMap.delete(value.preHash());
            return nodeToRemove;
        }
    }
    getItem(value) {
        return this.hashMap.get(value.preHash());
    }
    hasItem(value) {
        return this.hashMap.has(value.preHash());
    }
    addItem(value) {
        if (value === undefined) {
            throw new Error("Undefined Value to Add");
        }
        const newNode = new BinaryTreeNode(undefined, undefined, undefined, value);
        if (this.root === undefined) {
            this.root = newNode;
            this.hashMap.set(value.preHash(), newNode);
            return this.root;
        }
        if (!this.hashMap.has(value.preHash())) {
            this.hashMap.set(value.preHash(), newNode);
        }
        else {
            this.hashMap.get(value.preHash())?.increaseAmount();
            return newNode;
        }
        let current = this.root;
        while (true) {
            let value1 = newNode.getValue();
            let value2 = current.getValue();
            let result = this.comparator.compare(value1, value2);
            if (result < 0) {
                if (current.hasLeft()) {
                    current = current.getLeft();
                }
                else {
                    current.setLeft(newNode);
                    return newNode;
                }
            }
            else if (result > 0) {
                if (current.hasRight()) {
                    current = current.getRight();
                }
                else {
                    current.setRight(newNode);
                    return newNode;
                }
            }
            else {
                throw new Error("Internal Hash Map Error");
            }
        }
    }
    toPrintDPS(node, str, depth, repeat) {
        str += (repeat ? "-".repeat(depth) : "") + " " + depth + " | " + node.toPrint() + "\n";
        if (node.hasLeft()) {
            str = this.toPrintDPS(node.getLeft(), str, depth + 1, repeat);
        }
        if (node.hasRight()) {
            str = this.toPrintDPS(node.getRight(), str, depth + 1, repeat);
        }
        return str;
    }
    size() {
        return this.hashMap.size;
    }
    toPrint(repeat = true) {
        return this.root === undefined ? "undefined" : this.toPrintDPS(this.root, "", 0, repeat);
    }
    getHashMap() {
        return this.hashMap;
    }
}
