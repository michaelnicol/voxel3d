import { DoublyLinkedList } from "./DoublyLinkedList";
export class Queue {
    list = new DoublyLinkedList();
    dequeue() {
        const value = this.list.removeStart();
        return value;
    }
    enqeue(value) {
        this.list.addLast(value);
        return this;
    }
    isEmpty() {
        return this.list.hasElements();
    }
    toPrint() {
        return this.list.toPrint();
    }
    preHash() {
        return this;
    }
}
