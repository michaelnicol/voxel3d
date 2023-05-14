import { Comparator } from "./Comparator.js";
import { ValidObject } from "./ValidObject.js";
import { BinaryTreeNode } from "./BinaryTreeNode.js";
export class BinaryTree<E extends ValidObject> implements ValidObject {
  private comparator: Comparator<E>;
  private root: BinaryTreeNode<E> | undefined = undefined;
  private hashMap: Map<E, BinaryTreeNode<E>> = new Map();
  constructor(rootData: E | undefined, comparator: Comparator<E>) {
    if (rootData != undefined) {
      this.root = new BinaryTreeNode(undefined, undefined, undefined, rootData);
      this.hashMap.set(rootData.preHash(), this.root);
    }
    this.comparator = comparator;
  }

  // Interfaces

  preHash(): BinaryTree<E> {
    return this;
  }

  public getRoot(): BinaryTreeNode<E> | undefined {
    return this.root;
  }

  public removeItem(value: E): BinaryTreeNode<E> | undefined {
    console.log("Removing value: " + value.toPrint())
    if (this.getItem(value) == undefined) {
      throw new Error("Removing value not in tree");
    } else {
      const nodeToRemove: BinaryTreeNode<E> = this.getItem(value) as BinaryTreeNode<E>;
      nodeToRemove.decreaseAmount();
      if (nodeToRemove.getAmount() != 0) {
        return nodeToRemove;
      } else if (nodeToRemove.hasRight() && nodeToRemove.hasLeft()) {
        console.log("nodeToRemove.hasRight() && nodeToRemove.hasLeft()")
        let subTreeParentReference = nodeToRemove === this.root ? this.root as BinaryTreeNode<E> : nodeToRemove.getParent() as BinaryTreeNode<E>;
        let rightNode = nodeToRemove.getRight();
        let leftMostNode: BinaryTreeNode<E> | undefined = rightNode?.getLeft();
        while (leftMostNode != undefined && leftMostNode.hasLeft()) {
          leftMostNode = leftMostNode.getLeft() as BinaryTreeNode<E>;
        }
        let newParentOfLeftBranch = leftMostNode === undefined ? rightNode : leftMostNode;
        nodeToRemove.getLeft()?.setParent(newParentOfLeftBranch as BinaryTreeNode<E>);
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
        console.log("nodeToRemove.hasRight() && !nodeToRemove.hasLeft()")
        let subTreeParentReference = nodeToRemove === this.root ? this.root as BinaryTreeNode<E> : nodeToRemove.getParent() as BinaryTreeNode<E>;
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
        console.log("!nodeToRemove.hasRight() && nodeToRemove.hasLeft()")
        let subTreeParentReference = nodeToRemove === this.root ? this.root as BinaryTreeNode<E> : nodeToRemove.getParent() as BinaryTreeNode<E>;
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
        console.log("!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove === this.root")
        this.root = undefined;
      } else if (!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined) {
        console.log("!nodeToRemove.hasRight() && !nodeToRemove.hasLeft() && nodeToRemove.getParent() != undefined")
        const subTreeParentReference = (nodeToRemove.getParent() as BinaryTreeNode<E>);
        if (subTreeParentReference.getLeft() === nodeToRemove) {
          subTreeParentReference.setLeft(undefined);
        } else if (subTreeParentReference.getRight() === nodeToRemove) {
          subTreeParentReference.setRight(undefined);
        }
      }
      this.hashMap.delete(value.preHash());
      return nodeToRemove;
    }
  }
  public getItem(value: E): BinaryTreeNode<E> | undefined {
    return this.hashMap.get(value.preHash());
  }
  public hasItem(value: E): boolean {
    return this.hashMap.has(value.preHash());
  }
  public addItem(value: E): BinaryTreeNode<E> {
    if (value === undefined) {
      throw new Error("Undefined Value to Add");
    }
    const newNode: BinaryTreeNode<E> = new BinaryTreeNode<E>(undefined, undefined, undefined, value);
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
    let current: BinaryTreeNode<E> = this.root;
    while (true) {
      let value1 = newNode.getValue() as E;
      let value2 = current.getValue() as E;
      let result: number = this.comparator.compare(value1, value2);
      if (result < 0) {
        if (current.hasLeft()) {
          current = current.getLeft() as BinaryTreeNode<E>;
        } else {
          current.setLeft(newNode);
          return newNode;
        }
      } else if (result > 0) {
        if (current.hasRight()) {
          current = current.getRight() as BinaryTreeNode<E>;
        } else {
          current.setRight(newNode);
          return newNode;
        }
      } else {
        throw new Error("Internal Hash Map Error")
      }
    }
  }
  private toPrintDPS(node: BinaryTreeNode<E>, str: string, depth: number, repeat: boolean): string {
    str += (repeat ? "-".repeat(depth) : "") + " " + depth + " | " + node.toPrint() + "\n";
    if (node.hasLeft()) {
      str = this.toPrintDPS(node.getLeft() as BinaryTreeNode<E>, str, depth + 1, repeat);
    }
    if (node.hasRight()) {
      str = this.toPrintDPS(node.getRight() as BinaryTreeNode<E>, str, depth + 1, repeat);
    }
    return str;
  }
  size(): number {
    return this.hashMap.size;
  }
  toPrint(repeat: boolean = true): string {
    return this.root === undefined ? "undefined" : this.toPrintDPS(this.root as BinaryTreeNode<E>, "", 0, repeat);
  }
  getHashMap(): Map<E, BinaryTreeNode<E>> { 
    return this.hashMap;
  }
}
