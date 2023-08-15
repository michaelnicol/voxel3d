export class TestStorageValue {
    value;
    constructor(value) {
        this.value = value;
    }
    compareTo(other) {
        return this.value === other.value ? 0 : this.value < other.value ? -1 : 1;
    }
}
