import { Comparable } from "../../Comparable.js";

export class TestStorageValue implements Comparable<TestStorageValue> {
    value!: number;
    constructor(value: number) {
        this.value = value
    }
    compareTo(other: TestStorageValue): number {
        return this.value === other.value ? 0 : this.value < other.value ? -1 : 1
    }
}