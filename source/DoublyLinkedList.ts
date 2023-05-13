import { ValidObject } from "./ValidObject";

export class DoublyLinkedListNode<E extends ValidObject> implements ValidObject {
   private value?: ValidObject;
   private left?: DoublyLinkedListNode<E>;
   private right?: DoublyLinkedListNode<E>;
   constructor(left: DoublyLinkedListNode<E> | undefined, right: DoublyLinkedListNode<E> | undefined, value: ValidObject | undefined) {
      this.value = value;
      this.left = left;
      this.right = right;
   }
   preHash() {
      return this;
   }
   getValue(): ValidObject | undefined {
      return this.value;
   }
   getRight(): DoublyLinkedListNode<E> | undefined {
      return this.right;
   }
   getLeft(): DoublyLinkedListNode<E> | undefined {
      return this.left;
   }
   setValue(value: ValidObject | undefined): DoublyLinkedListNode<E> {
      this.value = value;
      return this;
   }
   setRight(right: DoublyLinkedListNode<E> | undefined): DoublyLinkedListNode<E> {
      this.right = right;
      return this;
   }
   setLeft(left: DoublyLinkedListNode<E> | undefined): DoublyLinkedListNode<E> {
      this.left = left;
      return this;
   }
   hasLeft(): boolean {
      return this.left != undefined;
   }
   hasRight(): boolean {
      return this.right != undefined;
   }
   toPrint(): string {
      let leftstring: string = "undefined";
      let rightstring: string = "undefined";
      if (this.hasLeft()) {
         let leftNode = this.getLeft() as DoublyLinkedListNode<E>;
         leftstring = leftNode.getValue() === undefined ? "undefined" : (leftNode.getValue() as ValidObject).toPrint()
      }
      if (this.hasRight()) {
         let rightNode = this.getRight() as DoublyLinkedListNode<E>;
         rightstring = rightNode.getValue() === undefined ? "undefined" : (rightNode.getValue() as ValidObject).toPrint()
      }
      return `<L: ${leftstring}, V: ${this.value == undefined ? "undefined" : this.value.toPrint()}, R: ${rightstring}>`
   }
}

export class DoublyLinkedList<E extends ValidObject> implements ValidObject {
   private head: DoublyLinkedListNode<E>;
   private tail: DoublyLinkedListNode<E>;
   constructor() {
      this.head = new DoublyLinkedListNode<E>(undefined, undefined, undefined);
      this.tail = new DoublyLinkedListNode<E>(this.head, undefined, undefined);
      this.head.setRight(this.tail);
   }
   preHash() {
      return this;
   }
   addStart(value: ValidObject): DoublyLinkedList<E> {
      const node: DoublyLinkedListNode<E> = new DoublyLinkedListNode<E>(undefined, undefined, value);
      node.setLeft(this.head);
      node.setRight(this.head.getRight());
      this.head.setRight(node);
      node.getRight()?.setLeft(node);
      return this;
   }
   removeStart(): ValidObject | undefined {
      if (this.head.getRight() == this.tail) {
         return undefined;
      }
      const nodeToRemove: DoublyLinkedListNode<E> = this.head.getRight() as DoublyLinkedListNode<E>;
      this.head.setRight(nodeToRemove.getRight());
      nodeToRemove.getRight()?.setLeft(this.head);
      nodeToRemove.setLeft(undefined);
      nodeToRemove.setRight(undefined);
      return nodeToRemove.getValue();
   }
   addLast(value: ValidObject): DoublyLinkedList<E> {
      const node: DoublyLinkedListNode<E> = new DoublyLinkedListNode<E>(undefined, undefined, value);
      node.setLeft(this.tail.getLeft());
      node.setRight(this.tail);
      this.tail.getLeft()?.setRight(node);
      this.tail.setLeft(node);
      return this;
   }
   removeLast(): ValidObject | undefined {
      if (this.tail.getLeft() == this.head) {
         return undefined;
      }
      const nodeToRemove: DoublyLinkedListNode<E> = this.tail.getLeft() as DoublyLinkedListNode<E>;
      nodeToRemove.getLeft()?.setRight(this.tail);
      this.tail.setLeft(nodeToRemove.getLeft());
      nodeToRemove.setLeft(undefined);
      nodeToRemove.setRight(undefined);
      return nodeToRemove.getValue();
   }

   hasElements(): boolean {
      return this.head.getRight() != this.tail;
   }
   toPrint(): string {
      let str = "[";
      let current: DoublyLinkedListNode<E> = this.head as DoublyLinkedListNode<E>;
      while (true) {
         str += current.toPrint();
         if (current.getRight() != this.tail) {
            str += ","
         }
         if (current.getRight() === undefined) {
            return str + "]";
         } else {
            current = current.getRight() as DoublyLinkedListNode<E>;
         }
      }
   }
}