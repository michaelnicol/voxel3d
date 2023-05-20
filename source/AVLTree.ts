import { Comparator } from "./Comparator.js";
import { ValidObject } from "./ValidObject.js";
import { AVLTreeNode } from "./AVLTreeNode.js";
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

  // Interfaces

  preHash(): AVLTree<E> {
    return this;
  }

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

  public getRoot(): AVLTreeNode<E> | undefined {
    return this.root;
  }

  public removeItem(value: E): AVLTreeNode<E> | undefined {
    if (this.getItem(value) == undefined) {
      throw new Error("Removing value not in tree");
    } else {
      const nodeToRemove: AVLTreeNode<E> = this.getItem(value) as AVLTreeNode<E>;
      nodeToRemove.decreaseAmount();
      if (nodeToRemove.getAmount() != 0) {
        return nodeToRemove;
      } else {
        this.decreaseHeightAbove(nodeToRemove)
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
      this.hashMap.delete(value.preHash());
      return nodeToRemove;
    }
  }
  public getItem(value: E): AVLTreeNode<E> | undefined {
    return this.hashMap.get(value.preHash());
  }
  public hasItem(value: E): boolean {
    return this.hashMap.has(value.preHash());
  }
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
          this.rebalance(newNode)
          return newNode;
        }
      } else if (result > 0) {
        if (current.hasRight()) {
          current = current.getRight() as AVLTreeNode<E>;
        } else {
          current.setRight(newNode);
          this.increaseHeightAbove(newNode)
          this.rebalance(newNode)
          return newNode;
        }
      } else {
        throw new Error("Internal Hash Map Error")
      }
    }
  }

  private increaseHeightAbove(node: AVLTreeNode<E>): void {
    let current: AVLTreeNode<E> = node;
    while (current.getParent() != undefined) {
      let parent: AVLTreeNode<E> = current.getParent() as AVLTreeNode<E>;
      parent.increaseHeight()
      current = parent;
    }
  }

  private decreaseHeightAbove(node: AVLTreeNode<E>): void {
    let current: AVLTreeNode<E> = node;
    while (current.getParent() != undefined) {
      let parent: AVLTreeNode<E> = current.getParent() as AVLTreeNode<E>;
      parent.decreaseHeight()
      current = parent;
    }
  }

  private balanceFactor(currentNode: AVLTreeNode<E> | undefined) {
    if (currentNode === undefined) {
      return 0;
    }
    const leftBalance = currentNode.hasLeft() ? (currentNode.getLeft() as AVLTreeNode<E>).getHeight() : 0;
    const rightBalance = currentNode.hasRight() ? (currentNode.getRight() as AVLTreeNode<E>).getHeight() : 0;
    return leftBalance - rightBalance;
  }

  private rebalance(currentNode: AVLTreeNode<E>) {
    const BF = this.balanceFactor(currentNode)
    if (BF === 2) {
      if (this.balanceFactor(currentNode.getRight()) < 0) {
        // left zig zag 
        this.rotateLeft(currentNode.getLeft() as AVLTreeNode<E>);
      }
      this.rotateRight(currentNode)
    } else if (BF === -2) {
      if (this.balanceFactor(currentNode.getLeft()) > 0) {
        // right zig-zag
        this.rotateRight(currentNode.getRight() as AVLTreeNode<E>);
      }
      this.rotateLeft(currentNode)
    }
    if (currentNode.hasParent()) {
      this.rebalance(currentNode.getParent() as AVLTreeNode<E>)
    }
  }

  rotateLeft(currentParent: AVLTreeNode<E>) {
    const newParent: AVLTreeNode<E> = currentParent.getRight() as AVLTreeNode<E>;
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
    let tempNumber = currentParent.getHeight() - 1;
    currentParent.setHeight(newParent.getHeight() - 1)
    newParent.setHeight(tempNumber)
    newParent.setLeft(currentParent);
    // console.log("Tree before height: \n" + this.toPrint())
    this.updateHeight(newParent as AVLTreeNode<E>)
    this.decreaseHeightAbove(newParent)
    // console.log("Tree after height: \n" + this.toPrint())

  }

  rotateRight(currentParent: AVLTreeNode<E>) {
    const newParent: AVLTreeNode<E> = currentParent.getLeft() as AVLTreeNode<E>;
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
    let tempNumber = currentParent.getHeight() - 1;
    currentParent.setHeight(newParent.getHeight() - 1)
    newParent.setHeight(tempNumber)
    newParent.setRight(currentParent);
    // console.log("Tree before height: \n" + this.toPrint())
    this.updateHeight(newParent as AVLTreeNode<E>)
    this.decreaseHeightAbove(newParent)
    // console.log("Tree after height: \n" + this.toPrint())
  }

  private updateHeight(parentNode: AVLTreeNode<E>): number {
    var leftHeight = parentNode.hasLeft() ? this.updateHeight(parentNode.getLeft() as AVLTreeNode<E>) : 0
    var rightHeight = parentNode.hasRight() ? this.updateHeight(parentNode.getRight() as AVLTreeNode<E>) : 0
    var newHeight = rightHeight > leftHeight ? rightHeight : leftHeight
    parentNode.setHeight(newHeight);
    return 1 + (rightHeight > leftHeight ? rightHeight : leftHeight);
  }

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
  toPrint(repeat: boolean = true): string {
    return this.root === undefined ? "undefined" : this.toPrintDPS(this.root as AVLTreeNode<E>, "", 0, repeat);
  }
  getHashMap(): Map<E, AVLTreeNode<E>> {
    return this.hashMap;
  }
}
