module.exports = class Message {
    constructor(id, author, body) {
        this.id = id;
        this.author = author;
        this.body = body;
    }

    static fromJSON(json) {
        const { id, author, body } = JSON.parse(json);
        return new Message(id, author, body); 
    }

    get JSON() {
        return JSON.stringify({
            id: this.id,
            author: this.author,
            body: this.body
        })
    }
}