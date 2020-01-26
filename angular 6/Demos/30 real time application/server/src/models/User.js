module.exports = class Author {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static fromJSON(json) {
        const { id, name } = JSON.parse(json);
        return new Author(id, name);
    }

    get JSON() {
        return JSON.stringify({
            id: this.id,
            name: this.name
        })
    }
}