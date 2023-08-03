export class TreeStorageNodeComparator {
    compare(o1, o2) {
        if (o1.coordinateDate < o2.coordinateDate) {
            return -1;
        }
        if (o1.coordinateDate > o2.coordinateDate) {
            return 1;
        }
        return 0;
    }
}
