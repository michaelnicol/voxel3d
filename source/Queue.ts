import { DoublyLinkedList } from "./DoublyLinkedList";
import { ValidObject } from "./ValidObject";

export class Queue<E extends ValidObject> implements ValidObject {
   private list: DoublyLinkedList<E> = new DoublyLinkedList<E>();
   public dequeue(): E {
      const value: E = this.list.removeStart() as E;
      return value;
   }
   public enqeue(value: E): Queue<E> {
      this.list.addLast(value);
      return this;
   }
   public isEmpty(): boolean {
      return this.list.hasElements();
   }
   toPrint(): string {
      return this.list.toPrint();
   }
   preHash() {
      return this;
   }
}