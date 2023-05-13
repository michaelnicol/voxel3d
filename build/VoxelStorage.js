import { VoxelStorageNode } from "./VoxelStorageNode";
export class VoxelStorage {
    root;
    constructor() { }
    hasNumber(coordinate) {
        if (this.root === undefined) {
            return false;
        }
        const { arr } = coordinate;
        let currentDem = this.root;
        for (let i = 0; i < arr.length; i++) {
            const value = arr[i];
            if (currentDem.getItem(value) === undefined) {
                return false;
            }
        }
        return true;
    }
    addNumber(coordinate) {
        const { arr } = coordinate;
        let currentDem = this.root;
        for (let i = 0; i < arr.length; i++) {
            const value = arr[i];
            if (i == 0 && currentDem === undefined) {
                this.root = new VoxelStorageNode(value);
            }
            let assertedCurrentDem = currentDem;
            currentDem = assertedCurrentDem.addItem(value).getValue();
        }
    }
    removeNumber(coordinate) {
        const { arr } = coordinate;
        let currentDem = this.root;
        for (let i = 0; i < arr.length; i++) {
            const value = arr[i];
            let assertedCurrentDem = currentDem;
            currentDem = assertedCurrentDem.removeItem(value).getValue();
        }
    }
    preHash() {
        return this;
    }
    toPrint() {
        return "";
    }
}
