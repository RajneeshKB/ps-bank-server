const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect('mongodb+srv://rajneesh:Ba5rbozw4kUhx6OG@cluster0.fr2arb9.mongodb.net/psbank?retryWrites=true&w=majority')
	.then(client=>{
		console.log('connected')
		_db = client.db()
		callback()
	}).catch(err=>{
		console.log(err);
		throw err;
	})
}

const getDb = () => {
	if(_db) {
		return _db
	}
	throw 'No db found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// module.exports = mongoConnect