import { ValidObject} from "./ValidObject.js"

export class NumberWrapper implements ValidObject {
   data: number;
   constructor(data: number) {
      this.data = data;
   }
   preHash() {
       return this.data;
   }
   toPrint(): string {
      return `${this.data}`
   }
}