import { ValidObject } from "./ValidObject";
export class BinaryTreeNode<E extends ValidObject> implements ValidObject {
  private left?: BinaryTreeNode<E>;
  private right?: BinaryTreeNode<E>;
  private parent?: BinaryTreeNode<E>;
  private value?: E;
  private amount = 1;
  constructor(left: BinaryTreeNode<E> | undefined, parent: BinaryTreeNode<E> | undefined, right: BinaryTreeNode<E> | undefined, value: E) {
    this.left = left;
    this.right = right;
    this.parent = parent;
    this.value = value;
  }

  toPrint(): string {
    let leftPrint: string = "undefined";
    let rightPrint: string = "undefined";
    let parentPrint: string = "undefined";
    if (this.hasLeft()) {
      leftPrint = this.getLeft()?.getValue() === undefined ? leftPrint : (this.getLeft()?.getValue()?.toPrint() as string);
    }
    if (this.hasRight()) {
      rightPrint = this.getRight()?.getValue() === undefined ? rightPrint : (this.getRight()?.getValue()?.toPrint() as string);
    }
    if (this.hasParent()) {
      parentPrint = this.getParent()?.getValue() === undefined ? parentPrint : (this.getParent()?.getValue()?.toPrint() as string);
    }
    return `<L: ${leftPrint}, P: ${parentPrint}, V: ${this.getValue() === undefined ? "undefined" : this.getValue()?.toPrint()}, A: ${this.amount}, R: ${rightPrint}>`
  }

  // Interface

  preHash() {
    return this;
  }

  public setLeft(newLeft: BinaryTreeNode<E> | undefined): void {
    this.left = newLeft;
    if (newLeft != undefined) {
      newLeft.setParent(this)
    }
  }

  public setRight(newRight: BinaryTreeNode<E> | undefined): void {
    this.right = newRight;
    if (newRight != undefined) {
      newRight.setParent(this)
    }
  }

  public setParent(newParent: BinaryTreeNode<E>): BinaryTreeNode<E> {
    this.parent = newParent;
    return this;
  }
  public setValue(value: E): BinaryTreeNode<E> {
    this.value = value;
    return this;
  }
  public increaseAmount(): BinaryTreeNode<E> {
    this.amount += 1;
    return this;
  }
  public decreaseAmount(): BinaryTreeNode<E> {
    this.amount -= 1;
    if (this.amount < 0) {
      throw new Error("Binary Tree Node amount can not be less than zero")
    }
    return this;
  }
  public resetAmount(): BinaryTreeNode<E> {
    this.amount = 0;
    return this;
  }
  public hasParent(): boolean {
    return this.parent != null;
  }
  // GETTERS
  public hasLeft(): boolean {
    return this.left != null;
  }
  public hasRight(): boolean {
    return this.right != null;
  }
  public getLeft(): BinaryTreeNode<E> | undefined {
    return this.left;
  }
  public getRight(): BinaryTreeNode<E> | undefined {
    return this.right;
  }
  public getValue(): E | undefined {
    return this.value;
  }
  public getAmount(): number {
    return this.amount;
  }
  public getParent(): BinaryTreeNode<E> | undefined {
    return this.parent;
  }
}