import { AVLTreeNode } from "./AVLTreeNode.js";
/**
 * Defines a new AVL Tree for any Valid Objects
 *
 * Constraints: Maximum amount of unique objects (nodes): 2^24 ~= 16,777,216 due to hash map size limitations. Duplicated objects are combined into a single node.
 *
 *
 */
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
    /**
     * @implements
     *
     * @returns The value to be hashed if this object is used as the key in a hash map.
     */
    preHash() {
        return this;
    }
    /**
     * Time complexity:  O(Log2(n)) where n is the number of nodes.
     *
     * @returns Node containg the lowest value in the tree.
     */
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
    /**
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * @returns Node containg the highest value in the tree.
     */
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
    /**
     * Time complexity: O(1)
     *
     * @returns The root node of the tree
     */
    getRoot() {
        return this.root;
    }
    sameHeightSubNode(parentNode) {
        return (!parentNode.hasLeft() && !parentNode.hasRight()) || (parentNode.hasLeft() && parentNode.hasRight() && parentNode.getLeft()?.getHeight() === parentNode.getRight()?.getHeight());
    }
    /**
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * @param value Value of the node to remove
     * @returns Returns the removed node from the tree.
     */
    removeItem(value) {
        // console.log("Deleting Value: " + value.toPrint())
        // console.log("Tree before delete: \n" + this.toPrint())
        if (this.getItem(value) == undefined) {
            return undefined;
        }
        else {
            const nodeToRemove = this.getItem(value);
            nodeToRemove.decreaseAmount();
            if (nodeToRemove.getAmount() != 0) {
                return nodeToRemove;
            }
            else {
                let currentNode = nodeToRemove;
                // console.log("Current Node: "+currentNode.toPrint())
                while (currentNode != undefined
                    && (currentNode === this.root || (currentNode.hasParent()
                        && currentNode.getHeight() === currentNode.getParent().getHeight() - 1)
                        && (!this.sameHeightSubNode(currentNode.getParent())))) {
                    if (currentNode.getHeight() != 0) {
                        currentNode.decreaseHeight();
                    }
                    currentNode = currentNode.getParent();
                }
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
            this.rebalance(nodeToRemove.getParent());
            this.hashMap.delete(value.preHash());
            return nodeToRemove;
        }
    }
    /**
     * Time complexity: O(1)
     *
     * @param value
     * @returns Node containing the value
     */
    getItem(value) {
        return this.hashMap.get(value.preHash());
    }
    /**
     * Time complexity: O(1)
     *
     * @param value
     * @returns True is the tree has the value in any node, false if it does not.
     */
    hasItem(value) {
        return this.hashMap.has(value.preHash());
    }
    /**
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * @param value
     * @returns The node where the value has been added.
     */
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
                    console.log("Before rebalance: \n" + this.toPrint());
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
                    console.log("Before rebalance: \n" + this.toPrint());
                    this.rebalance(newNode);
                    return newNode;
                }
            }
            else {
                throw new Error("Internal Hash Map Error");
            }
        }
    }
    /**
     * @private
     *
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * Increases the longest sub tree height of every node above the current node, excluding the current node.
     *
     * @param node
     */
    increaseHeightAbove(node) {
        let current = node;
        while (current.getParent() != undefined) {
            let parent = current.getParent();
            parent.increaseHeight();
            current = parent;
        }
    }
    /**
     * @private
     *
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * Decreases the longest sub tree height of every node above the current node, excluding the current node.
     *
     * @param node
     */
    decreaseHeightAbove(node) {
        let current = node;
        while (current.getParent() != undefined) {
            let parent = current.getParent();
            parent.decreaseHeight();
            current = parent;
        }
    }
    /**
     * @private
     *
     * Time complexity: O(1)
     *
     * Calculates the balance factor of the node via left - right height.
     *
     * @param currentNode
     * @returns A value of -2 means the right branch is too deep (rotate left), and a value of 2 means left branch is too deep (rotate right).
     */
    balanceFactor(currentNode) {
        if (currentNode === undefined) {
            return -1;
        }
        let leftHeight = currentNode.hasLeft() ? currentNode.getLeft()?.getHeight() : -1;
        let rightHeight = currentNode.getRight() ? currentNode.getRight()?.getHeight() : -1;
        const BF = leftHeight - rightHeight;
        return BF;
    }
    /**
     * @private
     *
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * Rebalances a node accounting for double and single rotations.
     *
     * @param currentNode Node to be rebalanced.
     */
    rebalance(currentNode) {
        // console.log("-------REBALANCE----------")
        // console.log("Current Node")
        // console.log(currentNode.toPrint())
        if (currentNode === undefined) {
            return;
        }
        const BF = this.balanceFactor(currentNode);
        // console.log("Is Root: " + (currentNode === this.root))
        // console.log("BF: " + BF)
        if (BF > 1) {
            // console.log("Balance Factor of Right: " + this.balanceFactor(currentNode.getRight()))
            if (this.balanceFactor(currentNode.getRight()) < 0) {
                // left zig zag 
                // console.log("Double RL")
                this.rotateLeft(currentNode.getLeft(), true);
                // console.log(this.toPrint())
            }
            // console.log("RR")
            this.rotateRight(currentNode);
            // console.log(this.toPrint())
        }
        else if (BF < -1) {
            // console.log("Balance Factor of left: " + this.balanceFactor(currentNode.getLeft()))
            if (this.balanceFactor(currentNode.getLeft()) > 0) {
                // right zig-zag
                // console.log("Double RR")
                this.rotateRight(currentNode.getRight(), true);
                // console.log(this.toPrint())
            }
            // console.log("RL")
            this.rotateLeft(currentNode);
            // console.log(this.toPrint())
        }
        // console.log("After: \n" + this.toPrint())
        if (currentNode.hasParent()) {
            // console.log("^ Calling on parent\n----\n")
            this.rebalance(currentNode.getParent());
        }
    }
    /**
     * @private
     *
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * Rotates the current node left, pivoting around the input node. Log complexity from tree height calculations.
     *
     * @param currentParent
     */
    rotateLeft(currentParent, zigZag = false) {
        const newParent = currentParent.getRight();
        if (newParent.hasLeft() && newParent.getLeft().getHeight() === newParent.getHeight() - 1) {
            zigZag = true;
        }
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
        let tempNumber = currentParent.getHeight() - (zigZag ? 0 : 1);
        currentParent.setHeight(newParent.getHeight() - (zigZag ? 0 : 1));
        newParent.setHeight(tempNumber);
        newParent.setLeft(currentParent);
        // this.updateHeight(newParent as AVLTreeNode<E>)
        // console.log("IsZigZag: "+zigZag)
        if (!zigZag) {
            this.decreaseHeightAbove(newParent);
        }
    }
    /**
     * @private
     *
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * Rotates the current node right, pivoting around the input node. Log complexity from tree height calculations.
     *
     * @param currentParent
     */
    rotateRight(currentParent, zigZag = false) {
        const newParent = currentParent.getLeft();
        if (newParent.hasRight() && newParent.getRight().getHeight() === newParent.getHeight() - 1) {
            zigZag = true;
        }
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
        let tempNumber = currentParent.getHeight() - (zigZag ? 0 : 1);
        currentParent.setHeight(newParent.getHeight() - (zigZag ? 0 : 1));
        newParent.setHeight(tempNumber);
        newParent.setRight(currentParent);
        // this.updateHeight(newParent as AVLTreeNode<E>)
        if (!zigZag) {
            this.decreaseHeightAbove(newParent);
        }
    }
    /**
     * Time Complexity: O(n) where n is the number of nodes. However, this function is only called on the rotated section of the tree, preventing O(n) behavior on large data sets.
     *
     * @param parentNode
     * @returns Current height of this node.
     */
    updateHeight(parentNode) {
        var leftHeight = parentNode.hasLeft() ? this.updateHeight(parentNode.getLeft()) : 0;
        var rightHeight = parentNode.hasRight() ? this.updateHeight(parentNode.getRight()) : 0;
        var newHeight = rightHeight > leftHeight ? rightHeight : leftHeight;
        parentNode.setHeight(newHeight);
        return 1 + (rightHeight > leftHeight ? rightHeight : leftHeight);
    }
    /**
     * @private
     *
     * Preforms DPS on the tree to print all nodes into a singular string.
     *
     * @param node
     * @param str
     * @param depth
     * @param repeat
     * @returns
     */
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
    /**
     * @implements
     *
     * Time Complexity: O(n) where n is the number of nodes in the tree.
     *
     * @param repeat Boolean true if dashes should be appended to signify height, false for no iindentation.
     * @returns A printable string
     */
    toPrint(repeat = true) {
        return this.root === undefined ? "undefined" : this.toPrintDPS(this.root, "", 0, repeat);
    }
    getHashMap() {
        return this.hashMap;
    }
}
