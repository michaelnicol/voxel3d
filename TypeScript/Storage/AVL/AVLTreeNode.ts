import { ValidObject } from "../../Meshes/ValidObject.js";

// import { ValidObject } from "../../"
export class AVLTreeNode<E extends ValidObject> implements ValidObject {
  private left?: AVLTreeNode<E>;
  private right?: AVLTreeNode<E>;
  private parent?: AVLTreeNode<E>;
  private value?: E;
  private amount = 1;
  private balance: number = 0;
  constructor(left: AVLTreeNode<E> | undefined, parent: AVLTreeNode<E> | undefined, right: AVLTreeNode<E> | undefined, value: E) {
    this.left = left;
    this.right = right;
    this.parent = parent;
    this.value = value;
  }

  setBalance(h : number) {
    this.balance = h;
  }

  getBalance(): number {
    return this.balance;
  }

  increaseBalance() {
    this.balance += 1;
  }

  decreaseBalance() {
    this.balance -= 1;
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
    return `<L: ${leftPrint}, P: ${parentPrint}, V: {${this.getValue() === undefined ? "undefined" : this.getValue()?.toPrint()}}, A: ${this.amount}, R: ${rightPrint}, B: ${this.balance}>`
  }

  // Interface

  preHash() {
    return this;
  }

  public setLeft(newLeft: AVLTreeNode<E> | undefined): void {
    this.left = newLeft;
    if (newLeft != undefined) {
      newLeft.setParent(this)
    }
  }

  public setRight(newRight: AVLTreeNode<E> | undefined): void {
    this.right = newRight;
    if (newRight != undefined) {
      newRight.setParent(this)
    }
  }

  public setParent(newParent: AVLTreeNode<E> | undefined): AVLTreeNode<E> {
    this.parent = newParent;
    return this;
  }
  public setValue(value: E | undefined): AVLTreeNode<E> {
    this.value = value;
    return this;
  }
  public increaseAmount(): AVLTreeNode<E> {
    this.amount += 1;
    return this;
  }
  public decreaseAmount(): AVLTreeNode<E> {
    this.amount -= 1;
    if (this.amount < 0) {
      throw new Error("Binary Tree Node amount can not be less than zero")
    }
    return this;
  }
  public resetAmount(): AVLTreeNode<E> {
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
  public getLeft(): AVLTreeNode<E> | undefined {
    return this.left;
  }
  public getRight(): AVLTreeNode<E> | undefined {
    return this.right;
  }
  public getValue(): E | undefined {
    return this.value;
  }
  public getAmount(): number {
    return this.amount;
  }
  public getParent(): AVLTreeNode<E> | undefined {
    return this.parent;
  }
}