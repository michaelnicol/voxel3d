import { Point } from "./Point.js";
import { ValidObject } from "./ValidObject.js";

export class HashStorageNode<E extends Point> implements ValidObject {
   hashMap = new Map<number, HashStorageNode<E>>;
   private value!: number;
   amount: number = 1;
   constructor(value: number) {
      this.value = value;
   };
   preHash() {
       return this;
   }
   getValue() {
      return this.value;
   }
   toPrint(): string {
      let str = "";
      for (let i in this.hashMap) {
         str+=`<${i}, ${this.hashMap.get(Number(i))}>`
      }
      return str;
   }
   increaseAmount(): void {
      this.amount+=1;
   }
   decreaseAmount(): void {
      this.amount-=1;
      if (this.amount < 0) {
         throw new Error("Negative Amount")
      }
   }
   getAmount(): number {
      return this.amount;
   }
   getHashMap(): Map<number, HashStorageNode<E>> {
      return this.hashMap;
   }
}