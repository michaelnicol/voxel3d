import { AVLTreeNode } from "./AVLTreeNode.js";
export class AVLTree {
    comparator;
    root = undefined;
    hashMap = new Map();
    constructor(rootData, comparator) {
        if (rootData != undefined) {
            this.root = new AVLTreeNode(undefined, undefined, undefined, rootData);
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
            else {
                this.decreaseHeightAbove(nodeToRemove);
                if (nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
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
        const newNode = new AVLTreeNode(undefined, undefined, undefined, value);
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
                    this.increaseHeightAbove(newNode);
                    this.rebalance(newNode);
                    return newNode;
                }
            }
            else if (result > 0) {
                if (current.hasRight()) {
                    current = current.getRight();
                }
                else {
                    current.setRight(newNode);
                    this.increaseHeightAbove(newNode);
                    this.rebalance(newNode);
                    return newNode;
                }
            }
            else {
                throw new Error("Internal Hash Map Error");
            }
        }
    }
    increaseHeightAbove(node) {
        let current = node;
        while (current.getParent() != undefined) {
            let parent = current.getParent();
            parent.increaseHeight();
            current = parent;
        }
    }
    decreaseHeightAbove(node) {
        let current = node;
        while (current.getParent() != undefined) {
            let parent = current.getParent();
            parent.decreaseHeight();
            current = parent;
        }
    }
    balanceFactor(currentNode) {
        if (currentNode === undefined) {
            return 0;
        }
        const leftBalance = currentNode.hasLeft() ? currentNode.getLeft().getHeight() : 0;
        const rightBalance = currentNode.hasRight() ? currentNode.getRight().getHeight() : 0;
        return leftBalance - rightBalance;
    }
    rebalance(currentNode) {
        const BF = this.balanceFactor(currentNode);
        if (BF === 2) {
            if (this.balanceFactor(currentNode.getRight()) < 0) {
                // left zig zag 
                this.rotateLeft(currentNode.getLeft());
            }
            this.rotateRight(currentNode);
        }
        else if (BF === -2) {
            if (this.balanceFactor(currentNode.getLeft()) > 0) {
                // right zig-zag
                this.rotateRight(currentNode.getRight());
            }
            this.rotateLeft(currentNode);
        }
        if (currentNode.hasParent()) {
            this.rebalance(currentNode.getParent());
        }
    }
    rotateLeft(currentParent) {
        const newParent = currentParent.getRight();
        if (currentParent.hasParent()) {
            let parentOfCurrent = currentParent.getParent();
            const isLeft = parentOfCurrent.getLeft() === currentParent;
            if (isLeft) {
                parentOfCurrent.setLeft(newParent);
            }
            else {
                parentOfCurrent.setRight(newParent);
            }
        }
        currentParent.setRight(newParent.getLeft());
        if (currentParent === this.root) {
            this.root = newParent;
            newParent.setParent(undefined);
        }
        else {
            newParent.setParent(currentParent.getParent());
        }
        let tempNumber = currentParent.getHeight() - 1;
        currentParent.setHeight(newParent.getHeight() - 1);
        newParent.setHeight(tempNumber);
        newParent.setLeft(currentParent);
        console.log("Tree before height: \n" + this.toPrint());
        this.updateHeight(newParent);
        this.decreaseHeightAbove(newParent);
        console.log("Tree after height: \n" + this.toPrint());
    }
    rotateRight(currentParent) {
        const newParent = currentParent.getLeft();
        if (currentParent.hasParent()) {
            let parentOfCurrent = currentParent.getParent();
            const isLeft = parentOfCurrent.getLeft() === currentParent;
            if (isLeft) {
                parentOfCurrent.setLeft(newParent);
            }
            else {
                parentOfCurrent.setRight(newParent);
            }
        }
        currentParent.setLeft(newParent.getRight());
        if (currentParent === this.root) {
            this.root = newParent;
            newParent.setParent(undefined);
        }
        else {
            newParent.setParent(currentParent.getParent());
        }
        let tempNumber = currentParent.getHeight() - 1;
        currentParent.setHeight(newParent.getHeight() - 1);
        newParent.setHeight(tempNumber);
        newParent.setRight(currentParent);
        console.log("Tree before height: \n" + this.toPrint());
        this.updateHeight(newParent);
        this.decreaseHeightAbove(newParent);
        console.log("Tree after height: \n" + this.toPrint());
    }
    updateHeight(parentNode) {
        var leftHeight = parentNode.hasLeft() ? this.updateHeight(parentNode.getLeft()) : 0;
        var rightHeight = parentNode.hasRight() ? this.updateHeight(parentNode.getRight()) : 0;
        var newHeight = rightHeight > leftHeight ? rightHeight : leftHeight;
        parentNode.setHeight(newHeight);
        return 1 + (rightHeight > leftHeight ? rightHeight : leftHeight);
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
