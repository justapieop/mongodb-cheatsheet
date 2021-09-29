const { MongoClient } = require("mongodb");

require("dotenv").config();

class MongoDBCheatSheet {
    #connectionString = process.env.CONN_STRING;
    #client;
    #database;
    #collection;

    constructor() {
        this.#client = new MongoClient(this.#connectionString, {
            retryWrites: true,
            retryReads: true
        });
        new Promise(async (resolve, reject) => {
            try {
                resolve(await this.#client.connect());
                console.log("Connected to MongoDB server");
            } catch (e) {
                console.error("Cannot connect to MongoDB server");
                process.exit(1);
            }
        });
        this.#database = this.#client.db(process.env.DB_NAME);
    }

    async chooseCollection(collection) {
        if (typeof collection !== "string" || !this.#database) return;
        this.#collection = this.#database.collection(collection ? collection : "default");
    }

    async createData(...data) {
        await this.#collection.insertOne(...data);
    }

    async getSingleData(filter) {
        return (await this.#collection.findOne(filter));
    }

    async getBulkData(filter, sort = () => { }) {
        const arr = (await this.#collection.find(filter).toArray()).sort(sort());
        return arr;
    }

    async modifySingleData(filter, updatedValue) {
        await this.#collection.updateOne(filter, { $set: data });
    }

    async modifyBulkData(filter, updatedValue) {
        await this.#collection.updateMany(filter, { $set: data });
    }

    async deleteSingleData(filter) {
        await this.#collection.deleteOne(filter);
    }

    async deleteBulkData(filter) {
        await this.#collection.deleteMany(filter);
    }

    async exist(filter) {
        return (await this.#collection.find(filter).toArray()).length !== 0;
    }
}