import { Comparator } from "./Comparator.js";
import { ValidObject } from "./ValidObject.js";
import { AVLTreeNode } from "./AVLTreeNode.js";
/**
 * Defines a new AVL Tree for any Valid Objects
 * 
 * Constraints: Maximum amount of unique objects (nodes): 2^24 ~= 16,777,216 due to hash map size limitations. Duplicated objects are combined into a single node.
 * 
 *  
 */
export class AVLTree<E extends ValidObject> implements ValidObject {
  private comparator: Comparator<E>;
  private root: AVLTreeNode<E> | undefined = undefined;
  private hashMap: Map<E, AVLTreeNode<E>> = new Map();
  constructor(rootData: E | undefined, comparator: Comparator<E>) {
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
  preHash(): AVLTree<E> {
    return this;
  }
  /**
   * Time complexity:  O(Log2(n)) where n is the number of nodes.
   * 
   * @returns Node containg the lowest value in the tree.
   */
  public getLowestValue(): AVLTreeNode<E> | undefined {
    if (this.root === undefined) {
      throw new Error("Can not find lowest value with undefined root");
    }
    let current: AVLTreeNode<E> = this.root as AVLTreeNode<E>;
    while (current.hasLeft()) {
      current = current.getLeft() as AVLTreeNode<E>;
    }
    return current;
  }
  /**
   * Time complexity: O(Log2(n)) where n is the number of nodes.
   * 
   * @returns Node containg the highest value in the tree.
   */
  public getHighestValue(): AVLTreeNode<E> | undefined {
    if (this.root === undefined) {
      throw new Error("Can not find highest value with undefined root");
    }
    let current: AVLTreeNode<E> = this.root as AVLTreeNode<E>;
    while (current.hasRight()) {
      current = current.getRight() as AVLTreeNode<E>;
    }
    return current;
  }
  /**
   * Time complexity: O(1)
   * 
   * @returns The root node of the tree
   */
  public getRoot(): AVLTreeNode<E> | undefined {
    return this.root;
  }
  public sameHeightSubNode(parentNode: AVLTreeNode<E>): boolean {
    return (!parentNode.hasLeft() && !parentNode.hasRight()) || (parentNode.hasLeft() && parentNode.hasRight() && parentNode.getLeft()?.getHeight() === parentNode.getRight()?.getHeight())
  }
  /**
   * Time complexity: O(Log2(n)) where n is the number of nodes.
   * 
   * @param value Value of the node to remove
   * @returns Returns the removed node from the tree.
   */
  public removeItem(value: E): AVLTreeNode<E> | undefined {
    // console.log("Deleting Value: " + value.toPrint())
    // console.log("Tree before delete: \n" + this.toPrint())
    if (this.getItem(value) == undefined) {
      return undefined;
    } else {
      const nodeToRemove: AVLTreeNode<E> = this.getItem(value) as AVLTreeNode<E>;
      nodeToRemove.decreaseAmount();
      if (nodeToRemove.getAmount() != 0) {
        return nodeToRemove;
      } else {
        let currentNode: AVLTreeNode<E> | undefined = nodeToRemove
        // console.log("Current Node: "+currentNode.toPrint())
        while (currentNode != undefined
          && (currentNode === this.root || (
            currentNode.hasParent()
            && currentNode.getHeight() === (currentNode.getParent() as AVLTreeNode<E>).getHeight() - 1)
            && (!this.sameHeightSubNode(currentNode.getParent() as AVLTreeNode<E>)))) {

          if (currentNode.getHeight() != 0) {
            currentNode.decreaseHeight();
          }
          currentNode = currentNode.getParent();
        }
        if (nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
          let subTreeParentReference = nodeToRemove === this.root ? this.root as AVLTreeNode<E> : nodeToRemove.getParent() as AVLTreeNode<E>;
          let rightNode = nodeToRemove.getRight();
          let leftMostNode: AVLTreeNode<E> | undefined = rightNode?.getLeft();
          while (leftMostNode != undefined && leftMostNode.hasLeft()) {
            leftMostNode = leftMostNode.getLeft() as AVLTreeNode<E>;
          }
          let newParentOfLeftBranch = leftMostNode === undefined ? rightNode : leftMostNode;
          nodeToRemove.getLeft()?.setParent(newParentOfLeftBranch as AVLTreeNode<E>);
          if (nodeToRemove === this.root) {
            this.root = rightNode;
          } else {
            if (subTreeParentReference.getLeft() === nodeToRemove) {
              subTreeParentReference.setLeft(rightNode);
            } else {
              subTreeParentReference.setRight(rightNode);
            }
          }
        } else if (nodeToRemove.hasRight() && !nodeToRemove.hasLeft()) {
          let subTreeParentReference = nodeToRemove === this.root ? this.root as AVLTreeNode<E> : nodeToRemove.getParent() as AVLTreeNode<E>;
          if (nodeToRemove === this.root) {
            this.root = nodeToRemove.getRight();
          } else {
            if (subTreeParentReference.getLeft() === nodeToRemove) {
              subTreeParentReference.setLeft(nodeToRemove.getRight());
            } else {
              subTreeParentReference.setRight(nodeToRemove.getRight());
            }
          }
        } else if (!nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
          let subTreeParentReference = nodeToRemove === this.root ? this.root as AVLTreeNode<E> : nodeToRemove.getParent() as AVLTreeNode<E>;
          if (nodeToRemove === this.root) {
            this.root = nodeToRemove.getLeft();
          } else {
            if (subTreeParentReference.getLeft() === nodeToRemove) {
              subTreeParentReference.setLeft(nodeToRemove.getLeft());
            } else {
              subTreeParentReference.setRight(nodeToRemove.getLeft());
            }
          }
        } else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove === this.root) {
          this.root = undefined;
        } else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined) {
          const subTreeParentReference = (nodeToRemove.getParent() as AVLTreeNode<E>);
          if (subTreeParentReference.getLeft() === nodeToRemove) {
            subTreeParentReference.setLeft(undefined);
          } else if (subTreeParentReference.getRight() === nodeToRemove) {
            subTreeParentReference.setRight(undefined);
          }
        }
      }
      this.rebalance(nodeToRemove.getParent() as AVLTreeNode<E>)
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
  public getItem(value: E): AVLTreeNode<E> | undefined {
    return this.hashMap.get(value.preHash());
  }
  /**
   * Time complexity: O(1)
   * 
   * @param value
   * @returns True is the tree has the value in any node, false if it does not.
   */
  public hasItem(value: E): boolean {
    return this.hashMap.has(value.preHash());
  }
  /**
   * Time complexity: O(Log2(n)) where n is the number of nodes.
   * 
   * @param value 
   * @returns The node where the value has been added.
   */
  public addItem(value: E): AVLTreeNode<E> {
    if (value === undefined) {
      throw new Error("Undefined Value to Add");
    }
    const newNode: AVLTreeNode<E> = new AVLTreeNode<E>(undefined, undefined, undefined, value);
    if (this.root === undefined) {
      this.root = newNode;
      this.hashMap.set(value.preHash(), newNode);
      return this.root;
    }
    if (!this.hashMap.has(value.preHash())) {
      this.hashMap.set(value.preHash(), newNode);
    } else {
      this.hashMap.get(value.preHash())?.increaseAmount();
      return newNode;
    }
    let current: AVLTreeNode<E> = this.root;
    while (true) {
      let value1 = newNode.getValue() as E;
      let value2 = current.getValue() as E;
      let result: number = this.comparator.compare(value1, value2);
      if (result < 0) {
        if (current.hasLeft()) {
          current = current.getLeft() as AVLTreeNode<E>;
        } else {
          current.setLeft(newNode);
          this.increaseHeightAbove(newNode);
          console.log("Before rebalance: \n"+this.toPrint())
          this.rebalance(newNode)
          return newNode;
        }
      } else if (result > 0) {
        if (current.hasRight()) {
          current = current.getRight() as AVLTreeNode<E>;
        } else {
          current.setRight(newNode);
          this.increaseHeightAbove(newNode)
          console.log("Before rebalance: \n"+this.toPrint())
          this.rebalance(newNode)
          return newNode;
        }
      } else {
        throw new Error("Internal Hash Map Error")
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
  private increaseHeightAbove(node: AVLTreeNode<E>): void {
    let current: AVLTreeNode<E> = node;
    while (current.getParent() != undefined) {
      let parent: AVLTreeNode<E> = current.getParent() as AVLTreeNode<E>;
      parent.increaseHeight()
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
  private decreaseHeightAbove(node: AVLTreeNode<E>): void {
    let current: AVLTreeNode<E> = node;
    while (current.getParent() != undefined) {
      let parent: AVLTreeNode<E> = current.getParent() as AVLTreeNode<E>;
      parent.decreaseHeight()
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
  private balanceFactor(currentNode: AVLTreeNode<E> | undefined): number {
    if (currentNode === undefined) {
      return -1;
    }
    let leftHeight = currentNode.hasLeft() ? currentNode.getLeft()?.getHeight() as number : -1;
    let rightHeight = currentNode.getRight() ? currentNode.getRight()?.getHeight() as number : -1;
    const BF = leftHeight - rightHeight
    return BF
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
  private rebalance(currentNode: AVLTreeNode<E>) {
    // console.log("-------REBALANCE----------")
    // console.log("Current Node")
    // console.log(currentNode.toPrint())
    if (currentNode === undefined) {
      return;
    }
    const BF = this.balanceFactor(currentNode)
    // console.log("Is Root: " + (currentNode === this.root))
    // console.log("BF: " + BF)
    if (BF > 1) {
      // console.log("Balance Factor of Right: " + this.balanceFactor(currentNode.getRight()))
      if (this.balanceFactor(currentNode.getRight()) < 0) {
        // left zig zag 
        // console.log("Double RL")
        this.rotateLeft(currentNode.getLeft() as AVLTreeNode<E>, true);
        // console.log(this.toPrint())
      }
      // console.log("RR")
      this.rotateRight(currentNode)
      // console.log(this.toPrint())
    } else if (BF < -1) {
      // console.log("Balance Factor of left: " + this.balanceFactor(currentNode.getLeft()))
      if (this.balanceFactor(currentNode.getLeft()) > 0) {
        // right zig-zag
        // console.log("Double RR")
        this.rotateRight(currentNode.getRight() as AVLTreeNode<E>, true);
        // console.log(this.toPrint())
      }
      // console.log("RL")
      this.rotateLeft(currentNode)
      // console.log(this.toPrint())
    }
    // console.log("After: \n" + this.toPrint())
    if (currentNode.hasParent()) {
      // console.log("^ Calling on parent\n----\n")
      this.rebalance(currentNode.getParent() as AVLTreeNode<E>)
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
  private rotateLeft(currentParent: AVLTreeNode<E>, zigZag: boolean = false) {
    const newParent: AVLTreeNode<E> = currentParent.getRight() as AVLTreeNode<E>;
    if (newParent.hasLeft() && (newParent.getLeft() as AVLTreeNode<E>).getHeight() === newParent.getHeight()-1) {
      zigZag = true;
    }
    if (currentParent.hasParent()) {
      let parentOfCurrent = currentParent.getParent() as AVLTreeNode<E>;
      const isLeft: boolean = parentOfCurrent.getLeft() === currentParent;
      if (isLeft) {
        parentOfCurrent.setLeft(newParent)
      } else {
        parentOfCurrent.setRight(newParent)
      }
    }
    currentParent.setRight(newParent.getLeft());
    if (currentParent === this.root) {
      this.root = newParent
      newParent.setParent(undefined)
    } else {
      newParent.setParent(currentParent.getParent())
    }
    let tempNumber = currentParent.getHeight() - (zigZag ? 0 : 1);
    currentParent.setHeight(newParent.getHeight() - (zigZag ? 0 : 1))
    newParent.setHeight(tempNumber)
    newParent.setLeft(currentParent);
    // this.updateHeight(newParent as AVLTreeNode<E>)
    // console.log("IsZigZag: "+zigZag)
    if (!zigZag) {
      this.decreaseHeightAbove(newParent)
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
  private rotateRight(currentParent: AVLTreeNode<E>, zigZag: boolean = false) {
    const newParent: AVLTreeNode<E> = currentParent.getLeft() as AVLTreeNode<E>;
    if (newParent.hasRight() && (newParent.getRight() as AVLTreeNode<E>).getHeight() === newParent.getHeight()-1) {
      zigZag = true;
    }
    if (currentParent.hasParent()) {
      let parentOfCurrent = currentParent.getParent() as AVLTreeNode<E>;
      const isLeft: boolean = parentOfCurrent.getLeft() === currentParent;
      if (isLeft) {
        parentOfCurrent.setLeft(newParent)
      } else {
        parentOfCurrent.setRight(newParent)
      }
    }
    currentParent.setLeft(newParent.getRight())
    if (currentParent === this.root) {
      this.root = newParent
      newParent.setParent(undefined)
    } else {
      newParent.setParent(currentParent.getParent())
    }
    let tempNumber = currentParent.getHeight() - (zigZag ? 0 : 1);
    currentParent.setHeight(newParent.getHeight() - (zigZag ? 0 : 1));
    newParent.setHeight(tempNumber)
    newParent.setRight(currentParent);
    // this.updateHeight(newParent as AVLTreeNode<E>)
    if (!zigZag) {
      this.decreaseHeightAbove(newParent)
    }
  }
  /**
   * Time Complexity: O(n) where n is the number of nodes. However, this function is only called on the rotated section of the tree, preventing O(n) behavior on large data sets. 
   * 
   * @param parentNode 
   * @returns Current height of this node.
   */
  private updateHeight(parentNode: AVLTreeNode<E>): number {
    var leftHeight = parentNode.hasLeft() ? this.updateHeight(parentNode.getLeft() as AVLTreeNode<E>) : 0
    var rightHeight = parentNode.hasRight() ? this.updateHeight(parentNode.getRight() as AVLTreeNode<E>) : 0
    var newHeight = rightHeight > leftHeight ? rightHeight : leftHeight
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
  private toPrintDPS(node: AVLTreeNode<E>, str: string, depth: number, repeat: boolean): string {
    str += (repeat ? "-".repeat(depth) : "") + " " + depth + " | " + node.toPrint() + "\n";
    if (node.hasLeft()) {
      str = this.toPrintDPS(node.getLeft() as AVLTreeNode<E>, str, depth + 1, repeat);
    }
    if (node.hasRight()) {
      str = this.toPrintDPS(node.getRight() as AVLTreeNode<E>, str, depth + 1, repeat);
    }
    return str;
  }
  size(): number {
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
  toPrint(repeat: boolean = true): string {
    return this.root === undefined ? "undefined" : this.toPrintDPS(this.root as AVLTreeNode<E>, "", 0, repeat);
  }
  getHashMap(): Map<E, AVLTreeNode<E>> {
    return this.hashMap;
  }
}
