export interface Comparable<E> {
    /**
     * 
     * @param other 
     * @return 0 if the values are the same, 1 if this value is greater than other (param), -1 if this value is less than other (param)
     */
    compareTo(other: E): number
}