import { Comparator } from "./Comparator.js";
import {NumberWrapper } from "./NumberWrapper.js";

export class NumberComparator implements Comparator<NumberWrapper> {
  compare(o1: NumberWrapper, o2: NumberWrapper): number {
      if (o1.data < o2.data) {
        return -1;
      }
      if (o1.data > o2.data) {
        return 1;
      }
      return 0;
  }
}
