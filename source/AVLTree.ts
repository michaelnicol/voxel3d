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
   * @returns Node that contains the lowest value in the tree.
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
  /**
   * Time complexity: O(Log2(n)) where n is the number of nodes.
   * 
   * @param value Value of the node to remove
   * @returns Returns the removed node from the tree.
   */
  public removeItem(value: E): AVLTreeNode<E> | undefined {
    // If the item does not exist, return nothing
    if (this.getItem(value) == undefined) {
      return undefined;
    } else {
      // Find the node to remove in o(1)
      const nodeToRemove: AVLTreeNode<E> = this.getItem(value) as AVLTreeNode<E>;
      nodeToRemove.decreaseAmount()
      // Decrease the storage amount at this node
      if (nodeToRemove.getAmount() != 0) {
        // If it is not zero, do not remove this node from the tree.
        return nodeToRemove;
      } else {

        /**
         * Deal with the nodes above nodeToRemove
         */
        // // console.log("Has Node: "+nodeToRemove.toPrint())
        this.decreaseBalanceAbove(nodeToRemove)

        // If the node needs to be removed, pick from conditations based upon its sub-nodes
        // "On your Left" - Captain America: The Winter Soldier, 2014
        if (nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
          // // console.log("nodeToRemove.hasRight() && nodeToRemove.hasLeft()")
          // Sub tree reference is the node that connects nodeToRemove to the tree. 
          let subTreeParentReference = nodeToRemove === this.root ? this.root as AVLTreeNode<E> : nodeToRemove.getParent() as AVLTreeNode<E>;
          // Grab the right node of the tree.
          let rightNode = nodeToRemove.getRight() as AVLTreeNode<E>;
          // Grab the lowest value on the right sub tree of node to remove in a while loop.
          // "On your Left" - Captain America: The Winter Soldier, 2014
          let leftMostNode: AVLTreeNode<E> | undefined = rightNode.getLeft();
          while (leftMostNode != undefined && leftMostNode.hasLeft()) {
            // "On your Left" - Captain America: The Winter Soldier, 2014
            leftMostNode = leftMostNode.getLeft() as AVLTreeNode<E>;
          }
          let newParentOfLeftBranch = leftMostNode === undefined ? rightNode : leftMostNode;
          // Since this branch is shifting up, this makes the left subtree one taller. Only happens when NodeToRemove has two children.
          newParentOfLeftBranch.setBalance(nodeToRemove.getBalance() - 1);
          (nodeToRemove.getLeft() as AVLTreeNode<E>).setParent(newParentOfLeftBranch as AVLTreeNode<E>);
          if (nodeToRemove === this.root) {
            this.root = newParentOfLeftBranch;
          } else {
            if (subTreeParentReference.getLeft() === nodeToRemove) {
              // "On your Left" - Captain America: The Winter Soldier, 2014
              subTreeParentReference.setLeft(newParentOfLeftBranch);
            } else {
              subTreeParentReference.setRight(newParentOfLeftBranch);
            }
          }
        } else if (nodeToRemove.hasRight() && !nodeToRemove.hasLeft()) {
            // // console.log("nodeToRemove.hasRight() && !nodeToRemove.hasLeft()")
          // The parent of the node to remove.
          let subTreeParentReference = nodeToRemove === this.root ? this.root as AVLTreeNode<E> : nodeToRemove.getParent() as AVLTreeNode<E>;
          if (nodeToRemove === this.root) {
            this.root = nodeToRemove.getRight();
          } else {
            // Shift the right most not up to the position of node to remove.
            if (subTreeParentReference.getLeft() === nodeToRemove) {
              // "On your Left" - Captain America: The Winter Soldier, 2014
              subTreeParentReference.setLeft(nodeToRemove.getRight());
            } else {
              subTreeParentReference.setRight(nodeToRemove.getRight());
            }
          }
        } else if (!nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
          // // console.log("!nodeToRemove.hasRight() && nodeToRemove.hasLeft()")
          let subTreeParentReference = nodeToRemove === this.root ? this.root as AVLTreeNode<E> : nodeToRemove.getParent() as AVLTreeNode<E>;
          if (nodeToRemove === this.root) {
            this.root = nodeToRemove.getLeft();
          } else {
            if (subTreeParentReference.getLeft() === nodeToRemove) {
              // "On your Left" - Captain America: The Winter Soldier, 2014
              subTreeParentReference.setLeft(nodeToRemove.getLeft());
            } else {
              subTreeParentReference.setRight(nodeToRemove.getLeft());
            }
          }
        } else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove === this.root) {
          // // console.log("!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove === this.root")
          this.root = undefined;
          // If this node has no right or left to move up to its position, but t has a parent
        } else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined) {
          // // console.log("!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined")
          const subTreeParentReference = (nodeToRemove.getParent() as AVLTreeNode<E>);
          if (subTreeParentReference.getLeft() === nodeToRemove) {
            // "On your Left" - Captain America: The Winter Soldier, 2014
            subTreeParentReference.setLeft(undefined);
          } else {
            subTreeParentReference.setRight(undefined);
          }
        }
      }
      // // console.log("Node After Removal")
      // // console.log(this.toPrint())
      if (nodeToRemove.getParent() !== undefined) {
        this.rebalance(nodeToRemove.getParent() as AVLTreeNode<E>)
      }
      this.hashMap.delete(value.preHash());
      // // console.log("Node After rebalance")
      // // console.log(this.toPrint())
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
    // // // // console.log("ADDING VALUE: " + value.toPrint())
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
          // "On your Left" - Captain America: The Winter Soldier, 2014
          current.setLeft(newNode);
          // // // // console.log("Increasing Height Above")
          this.increaseBalanceAbove(newNode);
          // // // // console.log("Left, Before rebalance: \n" + this.toPrint())
          this.rebalance(newNode)
          return newNode;
        }
      } else if (result > 0) {
        if (current.hasRight()) {
          current = current.getRight() as AVLTreeNode<E>;
        } else {
          current.setRight(newNode);
          // // // // console.log("Decreasing Height Above")
          this.increaseBalanceAbove(newNode)
          // // // // console.log("Right, Before rebalance: \n" + this.toPrint())
          this.rebalance(newNode)
          return newNode;
        }
      } else {
        throw new Error("Internal Hash Map Error")
      }
    }
  }


  increaseBalanceAbove(node: AVLTreeNode<E>) {
    // // // console.log("Called Increase Height above")
    // // // console.log(node.toPrint())
    let current: AVLTreeNode<E> = node;
    while (current.getParent() != undefined) {
      let parent: AVLTreeNode<E> = current.getParent() as AVLTreeNode<E>;
      if (parent.getLeft() === current) {
        // // // console.log("Decreased Balance")
        parent.decreaseBalance()
      } else {
        // // // console.log("Increased Balance")
        parent.increaseBalance()
      }
      current = parent
    }
  }



  decreaseBalanceAbove(node: AVLTreeNode<E>) {
    // // // console.log("Called Decrease Above")
    // // // console.log("Node: " + node.toPrint())
    let current: AVLTreeNode<E> = node;
    while (current.getParent() != undefined) {
      let parent: AVLTreeNode<E> = current.getParent() as AVLTreeNode<E>;
      let prevBalance = parent.getBalance()
      if (parent.getLeft() === current) {
        // // // console.log("parent.increaseBalance")
        parent.increaseBalance()
        if (prevBalance >= 0) {
          return;
        }
      } else {
        // // // console.log("parent.decreaseBalance")
        parent.decreaseBalance()
        if (prevBalance = 0) {
          return;
        }
      }
      current = parent
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
  private rebalance(pivotNode: AVLTreeNode<E>) {
    // // console.log("rebalance at: " + pivotNode.toPrint())
    if (pivotNode.getBalance() === 2) {
      if (pivotNode.getRight()?.getBalance() === -1) {
        pivotNode.getRight()?.setBalance(0)
        pivotNode.getRight()?.getLeft()?.setBalance(1)
      }
      if (pivotNode.getRight()?.getBalance() === 0) {
        pivotNode.setBalance(1)
        pivotNode.getRight()?.setBalance(-1)
      } else {
        pivotNode.setBalance(0)
        pivotNode.getRight()?.setBalance(0)
        this.decreaseBalanceAbove(pivotNode)
      }
      this.rotateLeft(pivotNode)
    } else if (pivotNode.getBalance() === -2) {
      if (pivotNode.getLeft()?.getBalance() === 1) {
        pivotNode.getLeft()?.setBalance(0)
        pivotNode.getLeft()?.getRight()?.setBalance(-1)
      }
      if (pivotNode.getLeft()?.getBalance() === 0) {
        pivotNode.setBalance(-1)
        pivotNode.getLeft()?.setBalance(1)
      } else {
        pivotNode.setBalance(0)
        pivotNode.getLeft()?.setBalance(0)
        this.decreaseBalanceAbove(pivotNode)
      }
      this.rotateRight(pivotNode)
    }
    if (pivotNode.getParent() != undefined) {
      this.rebalance(pivotNode.getParent() as AVLTreeNode<E>)
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
  rotateLeft(currentParent: AVLTreeNode<E>) {
    let rightChild = currentParent.getRight() as AVLTreeNode<E>;
    if (currentParent === this.root) {
      this.root = rightChild
      rightChild.setParent(undefined)
    } else if ((currentParent.getParent() as AVLTreeNode<E>).getLeft() as AVLTreeNode<E> === currentParent) {
      // "On your Left" - Captain America: The Winter Soldier, 2014
      currentParent.getParent()?.setLeft(rightChild)
    } else if ((currentParent.getParent() as AVLTreeNode<E>).getRight() as AVLTreeNode<E> === currentParent) {
      currentParent.getParent()?.setRight(rightChild)
    }
    let transferChild = rightChild.getLeft() as AVLTreeNode<E> | undefined;
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
  rotateRight(currentParent: AVLTreeNode<E>) {
    let leftChild = currentParent.getLeft() as AVLTreeNode<E>;
    if (currentParent === this.root) {
      this.root = leftChild
      leftChild.setParent(undefined)
    } else if ((currentParent.getParent() as AVLTreeNode<E>).getLeft() as AVLTreeNode<E> === currentParent) {
      // "On your Left" - Captain America: The Winter Soldier, 2014
      currentParent.getParent()?.setLeft(leftChild)
    } else if ((currentParent.getParent() as AVLTreeNode<E>).getRight() as AVLTreeNode<E> === currentParent) {
      currentParent.getParent()?.setRight(leftChild)
    }
    let transferChild = leftChild.getRight() as AVLTreeNode<E> | undefined;
    // "On your Left" - Captain America: The Winter Soldier, 2014
    currentParent.setLeft(transferChild);
    leftChild.setRight(currentParent)
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
  getDeepestNode(node: AVLTreeNode<E>, deepest: number[], current: number[]): void {
    // // // // console.log(node.toPrint())
    // // // // console.log(deepest, current)
    if (node.hasLeft()) {
      // // // // console.log("Node Has Left")
      let newCurrent = [...current]
      newCurrent[0] += 1;
      if (newCurrent[0] > deepest[0]) {
        deepest[0] = newCurrent[0]
      }
      // // // // console.log('Going Left')
      this.getDeepestNode(node.getLeft() as AVLTreeNode<E>, deepest, [...newCurrent])
    }
    if (node.hasRight()) {
      // // // // console.log("Node Has Left")
      let newCurrent = [...current]
      newCurrent[0] += 1;
      if (newCurrent[0] > deepest[0]) {
        deepest[0] = newCurrent[0]
      }
      // // // // console.log('Going Right')
      this.getDeepestNode(node.getRight() as AVLTreeNode<E>, deepest, [...newCurrent])
    }
  }
  #confirmRotationsRecursive(node: AVLTreeNode<E>): AVLTreeNode<E> | undefined {
    let leftDeepestRef = [1]
    let rightDeepestRef = [1]
    if (node.hasLeft()) {
      this.getDeepestNode(node.getLeft() as AVLTreeNode<E>, leftDeepestRef, [1])
    } else {
      leftDeepestRef = [0]
    }
    // // // // console.log("---------")
    if (node.hasRight()) {
      this.getDeepestNode(node.getRight() as AVLTreeNode<E>, rightDeepestRef, [1])
    } else {
      rightDeepestRef = [0]
    }
    let left = leftDeepestRef[0]
    let right = rightDeepestRef[0]
    if (right - left != node.getBalance()) {
      // // // // console.log("Left, Right")
      // // // // console.log(left, right)
      // // // // console.log("At Node")
      // // // // console.log(node.toPrint())
      throw new Error()
      return node;
    }
    if (node.hasLeft()) {
      this.#confirmRotationsRecursive(node.getLeft() as AVLTreeNode<E>)
    }
    if (node.hasRight()) {
      this.#confirmRotationsRecursive(node.getRight() as AVLTreeNode<E>)
    }
    return undefined
  }
  confirmRotations(): AVLTreeNode<E> | undefined {
    if (this.root === undefined) {
      return undefined
    } else {
      return this.#confirmRotationsRecursive(this.root as AVLTreeNode<E>)
    }
  }
}
