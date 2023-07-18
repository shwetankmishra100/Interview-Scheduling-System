import config from 'config';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { serviceStamp } from '../../utils/logger.js';

const getServiceStamp = (color) => {
	return serviceStamp('[Mongo]:', 'yellow', color);
};

const MONGO_CONNECTION_URL = config.mongo.connectionUrl;
const CLIENT = new MongoClient(MONGO_CONNECTION_URL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
		useUnifiedTopology: true,
	},
});
let DB = null;

export const initializeMongo = async () => {
	try {
		console.log(getServiceStamp(), `Connecting to ${MONGO_CONNECTION_URL}`);

		await CLIENT.connect();
		await CLIENT.db('admin').command({ ping: 1 });

		console.log(getServiceStamp(), `Established mongo connection. You successfully connected to MongoDB!`);

		DB = CLIENT.db();
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
};

const transformIdToObjectId = (criteria) => {
	if (criteria._id) {
		if (typeof criteria._id === 'string') {
			criteria._id = new ObjectId(criteria._id);
		} else if (criteria._id.$in) {
			let inArr = criteria._id.$in;
			criteria._id.$in = inArr.map((val) => new ObjectId(val));
		} else if (criteria._id.$ne) {
			criteria._id.$ne = new ObjectId(criteria._id.$ne);
		}
	}
};

const logArguments = (action = '', collectionName = '', ...args) => {
	console.log(getServiceStamp(), action, collectionName);
	args.map((arg) => console.log(arg));
};

export const findCountByCriteria = (collectionName, criteria) => {
	logArguments('> FindCountByCriteria', collectionName, criteria);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.count(criteria)
			.then((count) => {
				resolve(count);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const findOneByCriteria = (collectionName, criteria) => {
	logArguments('> FindOneByCriteria', collectionName, criteria);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.findOne(criteria)
			.then((result) => {
				resolve(result ? result : null);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const findByCriteria = (collectionName, criteria) => {
	logArguments('> FindByCriteria', collectionName, criteria);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.find(criteria)
			.toArray()
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const findByCriteriaSorted = (collectionName, criteria, sortObj) => {
	logArguments('> FindByCriteriaWithSort', collectionName, criteria, sortObj);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.find(criteria)
			.sort(sortObj)
			.toArray()
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const findByCriteriaPaginated = (collectionName, criteria, sortObj, pageNo = 1, pageSize = 10) => {
	logArguments(criteria);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.find(criteria)
			.sort(sortObj)
			.skip((pageNo - 1) * pageSize)
			.limit(pageSize)
			.toArray()
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const findAndProject = (collectionName, criteria, projectionFields) => {
	logArguments('> FindAndProject', collectionName, criteria, projectionFields);
	transformIdToObjectId(criteria);

	let projectionObj = { _id: 0 };
	for (let field of projectionFields) {
		projectionObj[field] = 1;
	}

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.find(criteria)
			.project(projectionObj)
			.toArray()
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const distinct = (collectionName, distinctFieldName, criteria) => {
	logArguments('> Distinct', collectionName, distinctFieldName, criteria);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.distinct(distinctFieldName, criteria)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const createOne = (collectionName, data) => {
	logArguments('> CreateOne', collectionName, data);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.insertOne(data)
			.then((result) => {
				resolve(result.insertedId);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const create = (collectionName, data) => {
	logArguments('> Create', collectionName, data);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.insertMany(data)
			.then((result) => {
				resolve(result.insertedIds);
			})
			.catch((err) => {
				console.log('error', err);
				return Promise.reject(err);
			});
	});
};

export const deleteOneByCriteria = (collectionName, criteria) => {
	logArguments('> DeleteOneByCriteria', collectionName, criteria);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.deleteOne(criteria)
			.then((result) => {
				resolve(result.deletedCount);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const deleteByCriteria = (collectionName, criteria) => {
	logArguments('> DeleteByCriteria', collectionName, criteria);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.deleteMany(criteria)
			.then((result) => {
				resolve(result.deletedCount);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateOneByCriteria = (collectionName, criteria, dataToUpdate, upsert = false) => {
	logArguments('> UpdateOneByCriteria', collectionName, criteria, dataToUpdate, upsert);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.updateOne(criteria, { $set: dataToUpdate }, { upsert: upsert })
			.then((result) => {
				resolve(result.matchedCount);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const updateByCriteria = (collectionName, criteria, dataToUpdate, upsert = false) => {
	logArguments('> UpdateByCriteria', collectionName, criteria, dataToUpdate, upsert);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.update(criteria, { $set: dataToUpdate }, { multi: true, upsert: upsert })
			.then((result) => {
				resolve(result.matchedCount);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const rawUpdateOneByCriteria = (collectionName, criteria, dataToUpdate, upsert = false) => {
	logArguments('> RawUpdateOneByCriteria', collectionName, criteria, dataToUpdate, upsert);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.updateOne(criteria, dataToUpdate, { upsert: upsert })
			.then((result) => {
				resolve(result.matchedCount);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const rawUpdateByCriteria = (collectionName, criteria, dataToUpdate, upsert = false) => {
	logArguments('> RawUpdateByCriteria', collectionName, criteria, dataToUpdate, upsert);
	transformIdToObjectId(criteria);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.update(criteria, dataToUpdate, { multi: true, upsert: upsert })
			.then((result) => {
				resolve(result.matchedCount);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const aggregate = (collectionName, aggregateClauses) => {
	logArguments('> Aggregate', collectionName, aggregateClauses);

	return new Promise((resolve, reject) => {
		DB.collection(collectionName)
			.aggregate(aggregateClauses)
			.toArray()
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
