export class DoublyLinkedListNode {
    value;
    left;
    right;
    constructor(left, right, value) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
    preHash() {
        return this;
    }
    getValue() {
        return this.value;
    }
    getRight() {
        return this.right;
    }
    getLeft() {
        return this.left;
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    setRight(right) {
        this.right = right;
        return this;
    }
    setLeft(left) {
        this.left = left;
        return this;
    }
    hasLeft() {
        return this.left != undefined;
    }
    hasRight() {
        return this.right != undefined;
    }
    toPrint() {
        let leftstring = "undefined";
        let rightstring = "undefined";
        if (this.hasLeft()) {
            let leftNode = this.getLeft();
            leftstring = leftNode.getValue() === undefined ? "undefined" : leftNode.getValue().toPrint();
        }
        if (this.hasRight()) {
            let rightNode = this.getRight();
            rightstring = rightNode.getValue() === undefined ? "undefined" : rightNode.getValue().toPrint();
        }
        return `<L: ${leftstring}, V: ${this.value == undefined ? "undefined" : this.value.toPrint()}, R: ${rightstring}>`;
    }
}
export class DoublyLinkedList {
    head;
    tail;
    constructor() {
        this.head = new DoublyLinkedListNode(undefined, undefined, undefined);
        this.tail = new DoublyLinkedListNode(this.head, undefined, undefined);
        this.head.setRight(this.tail);
    }
    preHash() {
        return this;
    }
    addStart(value) {
        const node = new DoublyLinkedListNode(undefined, undefined, value);
        node.setLeft(this.head);
        node.setRight(this.head.getRight());
        this.head.setRight(node);
        node.getRight()?.setLeft(node);
        return this;
    }
    removeStart() {
        if (this.head.getRight() == this.tail) {
            return undefined;
        }
        const nodeToRemove = this.head.getRight();
        this.head.setRight(nodeToRemove.getRight());
        nodeToRemove.getRight()?.setLeft(this.head);
        nodeToRemove.setLeft(undefined);
        nodeToRemove.setRight(undefined);
        return nodeToRemove.getValue();
    }
    addLast(value) {
        const node = new DoublyLinkedListNode(undefined, undefined, value);
        node.setLeft(this.tail.getLeft());
        node.setRight(this.tail);
        this.tail.getLeft()?.setRight(node);
        this.tail.setLeft(node);
        return this;
    }
    removeLast() {
        if (this.tail.getLeft() == this.head) {
            return undefined;
        }
        const nodeToRemove = this.tail.getLeft();
        nodeToRemove.getLeft()?.setRight(this.tail);
        this.tail.setLeft(nodeToRemove.getLeft());
        nodeToRemove.setLeft(undefined);
        nodeToRemove.setRight(undefined);
        return nodeToRemove.getValue();
    }
    hasElements() {
        return this.head.getRight() != this.tail;
    }
    toPrint() {
        let str = "[";
        let current = this.head;
        while (true) {
            str += current.toPrint();
            if (current.getRight() != this.tail) {
                str += ",";
            }
            if (current.getRight() === undefined) {
                return str + "]";
            }
            else {
                current = current.getRight();
            }
        }
    }
}
