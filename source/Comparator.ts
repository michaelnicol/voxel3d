export interface Comparator<E> {
   compare(o1: E, o2: E): number;
 }