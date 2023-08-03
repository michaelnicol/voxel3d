import { AVLTreeNode } from "./AVLTreeNode.js";
/**
 * Defines a new AVL Tree for any Valid Objects
 *
 * Constraints: Maximum amount of unique objects (nodes): 2^24 ~= 16,777,216 due to hash map size limitations. Duplicated objects are combined into a single node.
 *
 */
export class AVLTree {
    comparator;
    root = undefined;
    uniqueCoordinateCount = 0;
    allCoordinateCount = 0;
    constructor(rootData, comparator) {
        if (rootData != undefined) {
            this.root = new AVLTreeNode(undefined, undefined, undefined, rootData);
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
     * @returns Node that contains the lowest value in the tree.
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
     * @returns Node contains the highest value in the tree.
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
    /**
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * @param value Value of the node to remove
     * @returns Returns the removed node from the tree.
     */
    removeItem(value) {
        // If the item does not exist, return nothing
        if (this.getItem(value) == undefined) {
            return undefined;
        }
        else {
            // Find the node to remove in o(1)
            const nodeToRemove = this.getItem(value);
            nodeToRemove.decreaseAmount();
            // Decrease the storage amount at this node
            if (nodeToRemove.getAmount() != 0) {
                // If it is not zero, do not remove this node from the tree.
                return nodeToRemove;
            }
            else {
                /**
                 * Deal with the nodes above nodeToRemove
                 */
                // // console.log("Has Node: "+nodeToRemove.toPrint())
                this.decreaseBalanceAbove(nodeToRemove);
                // If the node needs to be removed, pick from conditations based upon its sub-nodes
                // "On your Left" - Captain America: The Winter Soldier, 2014
                if (nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
                    // // console.log("nodeToRemove.hasRight() && nodeToRemove.hasLeft()")
                    // Sub tree reference is the node that connects nodeToRemove to the tree. 
                    let subTreeParentReference = nodeToRemove === this.root ? this.root : nodeToRemove.getParent();
                    // Grab the right node of the tree.
                    let rightNode = nodeToRemove.getRight();
                    // Grab the lowest value on the right sub tree of node to remove in a while loop.
                    // "On your Left" - Captain America: The Winter Soldier, 2014
                    let leftMostNode = rightNode.getLeft();
                    while (leftMostNode != undefined && leftMostNode.hasLeft()) {
                        // "On your Left" - Captain America: The Winter Soldier, 2014
                        leftMostNode = leftMostNode.getLeft();
                    }
                    let newParentOfLeftBranch = leftMostNode === undefined ? rightNode : leftMostNode;
                    // Since this branch is shifting up, this makes the left subtree one taller. Only happens when NodeToRemove has two children.
                    newParentOfLeftBranch.setBalance(nodeToRemove.getBalance() - 1);
                    nodeToRemove.getLeft().setParent(newParentOfLeftBranch);
                    if (nodeToRemove === this.root) {
                        this.root = newParentOfLeftBranch;
                    }
                    else {
                        if (subTreeParentReference.getLeft() === nodeToRemove) {
                            // "On your Left" - Captain America: The Winter Soldier, 2014
                            subTreeParentReference.setLeft(newParentOfLeftBranch);
                        }
                        else {
                            subTreeParentReference.setRight(newParentOfLeftBranch);
                        }
                    }
                }
                else if (nodeToRemove.hasRight() && !nodeToRemove.hasLeft()) {
                    // // console.log("nodeToRemove.hasRight() && !nodeToRemove.hasLeft()")
                    // The parent of the node to remove.
                    let subTreeParentReference = nodeToRemove === this.root ? this.root : nodeToRemove.getParent();
                    if (nodeToRemove === this.root) {
                        this.root = nodeToRemove.getRight();
                    }
                    else {
                        // Shift the right most not up to the position of node to remove.
                        if (subTreeParentReference.getLeft() === nodeToRemove) {
                            // "On your Left" - Captain America: The Winter Soldier, 2014
                            subTreeParentReference.setLeft(nodeToRemove.getRight());
                        }
                        else {
                            subTreeParentReference.setRight(nodeToRemove.getRight());
                        }
                    }
                }
                else if (!nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
                    // // console.log("!nodeToRemove.hasRight() && nodeToRemove.hasLeft()")
                    let subTreeParentReference = nodeToRemove === this.root ? this.root : nodeToRemove.getParent();
                    if (nodeToRemove === this.root) {
                        this.root = nodeToRemove.getLeft();
                    }
                    else {
                        if (subTreeParentReference.getLeft() === nodeToRemove) {
                            // "On your Left" - Captain America: The Winter Soldier, 2014
                            subTreeParentReference.setLeft(nodeToRemove.getLeft());
                        }
                        else {
                            subTreeParentReference.setRight(nodeToRemove.getLeft());
                        }
                    }
                }
                else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove === this.root) {
                    // // console.log("!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove === this.root")
                    this.root = undefined;
                    // If this node has no right or left to move up to its position, but t has a parent
                }
                else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined) {
                    // // console.log("!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined")
                    const subTreeParentReference = nodeToRemove.getParent();
                    if (subTreeParentReference.getLeft() === nodeToRemove) {
                        // "On your Left" - Captain America: The Winter Soldier, 2014
                        subTreeParentReference.setLeft(undefined);
                    }
                    else {
                        subTreeParentReference.setRight(undefined);
                    }
                }
            }
            // // console.log("Node After Removal")
            // // console.log(this.toPrint())
            if (nodeToRemove.getParent() !== undefined) {
                this.rebalance(nodeToRemove.getParent());
            }
            // // console.log("Node After rebalance")
            // // console.log(this.toPrint())
            return nodeToRemove;
        }
    }
    /**
     * Time complexity: O(log2(N))
     *
     * @param value
     * @returns Node containing the value
     */
    getItem(value) {
        if (this.root === undefined) {
            return undefined;
        }
        let current = this.root;
        while (true) {
            let result = this.comparator.compare(current.getValue(), value);
            if (result === 0) {
                return current;
            }
            else if (result < 0) {
                if (current.hasRight()) {
                    current = current.getRight();
                }
                else {
                    return undefined;
                }
            }
            else if (result > 0) {
                if (current.hasLeft()) {
                    current = current.getLeft();
                }
                else {
                    return undefined;
                }
            }
        }
    }
    /**
     * Time complexity: O(log2(n))
     *
     * @param value
     * @returns True is the tree has the value in any node, false if it does not.
     */
    hasItem(value) {
        return this.getItem(value) !== undefined;
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
            return this.root;
        }
        const hasItem = this.getItem(value);
        if (hasItem !== undefined) {
            this.allCoordinateCount += 1;
            hasItem.increaseAmount();
            return newNode;
        }
        else {
            this.uniqueCoordinateCount += 1;
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
                    // "On your Left" - Captain America: The Winter Soldier, 2014
                    current.setLeft(newNode);
                    this.increaseBalanceAbove(newNode);
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
                    this.increaseBalanceAbove(newNode);
                    this.rebalance(newNode);
                    return newNode;
                }
            }
            else {
                throw new Error("Internal Hash Map Error");
            }
        }
    }
    increaseBalanceAbove(node) {
        let current = node;
        while (current.getParent() != undefined) {
            let parent = current.getParent();
            if (parent.getLeft() === current) {
                parent.decreaseBalance();
            }
            else {
                parent.increaseBalance();
            }
            current = parent;
        }
    }
    decreaseBalanceAbove(node) {
        let current = node;
        while (current.getParent() != undefined) {
            let parent = current.getParent();
            let prevBalance = parent.getBalance();
            if (parent.getLeft() === current) {
                parent.increaseBalance();
                if (prevBalance >= 0) {
                    return;
                }
            }
            else {
                parent.decreaseBalance();
                if (prevBalance = 0) {
                    return;
                }
            }
            current = parent;
        }
    }
    /**
     * @private
     *
     * Time complexity: O(Log2(n)) where n is the number of nodes.
     *
     * rebalances a node accounting for double and single rotations.
     *
     * @param currentNode Node to be rebalanced.
     */
    rebalance(pivotNode) {
        // // console.log("rebalance at: " + pivotNode.toPrint())
        if (pivotNode.getBalance() === 2) {
            if (pivotNode.getRight()?.getBalance() === -1) {
                pivotNode.getRight()?.setBalance(0);
                pivotNode.getRight()?.getLeft()?.setBalance(1);
            }
            if (pivotNode.getRight()?.getBalance() === 0) {
                pivotNode.setBalance(1);
                pivotNode.getRight()?.setBalance(-1);
            }
            else {
                pivotNode.setBalance(0);
                pivotNode.getRight()?.setBalance(0);
                this.decreaseBalanceAbove(pivotNode);
            }
            this.rotateLeft(pivotNode);
        }
        else if (pivotNode.getBalance() === -2) {
            if (pivotNode.getLeft()?.getBalance() === 1) {
                pivotNode.getLeft()?.setBalance(0);
                pivotNode.getLeft()?.getRight()?.setBalance(-1);
            }
            if (pivotNode.getLeft()?.getBalance() === 0) {
                pivotNode.setBalance(-1);
                pivotNode.getLeft()?.setBalance(1);
            }
            else {
                pivotNode.setBalance(0);
                pivotNode.getLeft()?.setBalance(0);
                this.decreaseBalanceAbove(pivotNode);
            }
            this.rotateRight(pivotNode);
        }
        if (pivotNode.getParent() != undefined) {
            this.rebalance(pivotNode.getParent());
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
    rotateLeft(currentParent) {
        let rightChild = currentParent.getRight();
        if (currentParent === this.root) {
            this.root = rightChild;
            rightChild.setParent(undefined);
        }
        else if (currentParent.getParent().getLeft() === currentParent) {
            // "On your Left" - Captain America: The Winter Soldier, 2014
            currentParent.getParent()?.setLeft(rightChild);
        }
        else if (currentParent.getParent().getRight() === currentParent) {
            currentParent.getParent()?.setRight(rightChild);
        }
        let transferChild = rightChild.getLeft();
        currentParent.setRight(transferChild);
        // "On your Left" - Captain America: The Winter Soldier, 2014
        rightChild.setLeft(currentParent);
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
    rotateRight(currentParent) {
        let leftChild = currentParent.getLeft();
        if (currentParent === this.root) {
            this.root = leftChild;
            leftChild.setParent(undefined);
        }
        else if (currentParent.getParent().getLeft() === currentParent) {
            // "On your Left" - Captain America: The Winter Soldier, 2014
            currentParent.getParent()?.setLeft(leftChild);
        }
        else if (currentParent.getParent().getRight() === currentParent) {
            currentParent.getParent()?.setRight(leftChild);
        }
        let transferChild = leftChild.getRight();
        // "On your Left" - Captain America: The Winter Soldier, 2014
        currentParent.setLeft(transferChild);
        leftChild.setRight(currentParent);
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
    size(uniqueCoordinates) {
        return uniqueCoordinates ? this.uniqueCoordinateCount : this.allCoordinateCount;
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
    getDeepestNode(node, deepest, current) {
        if (node.hasLeft()) {
            let newCurrent = [...current];
            newCurrent[0] += 1;
            if (newCurrent[0] > deepest[0]) {
                deepest[0] = newCurrent[0];
            }
            this.getDeepestNode(node.getLeft(), deepest, [...newCurrent]);
        }
        if (node.hasRight()) {
            let newCurrent = [...current];
            newCurrent[0] += 1;
            if (newCurrent[0] > deepest[0]) {
                deepest[0] = newCurrent[0];
            }
            this.getDeepestNode(node.getRight(), deepest, [...newCurrent]);
        }
    }
    #confirmRotationsRecursive(node) {
        let leftDeepestRef = [1];
        let rightDeepestRef = [1];
        if (node.hasLeft()) {
            this.getDeepestNode(node.getLeft(), leftDeepestRef, [1]);
        }
        else {
            leftDeepestRef = [0];
        }
        if (node.hasRight()) {
            this.getDeepestNode(node.getRight(), rightDeepestRef, [1]);
        }
        else {
            rightDeepestRef = [0];
        }
        let left = leftDeepestRef[0];
        let right = rightDeepestRef[0];
        if (right - left != node.getBalance()) {
            throw new Error();
            return node;
        }
        if (node.hasLeft()) {
            this.#confirmRotationsRecursive(node.getLeft());
        }
        if (node.hasRight()) {
            this.#confirmRotationsRecursive(node.getRight());
        }
        return undefined;
    }
    confirmRotations() {
        if (this.root === undefined) {
            return undefined;
        }
        else {
            return this.#confirmRotationsRecursive(this.root);
        }
    }
}
