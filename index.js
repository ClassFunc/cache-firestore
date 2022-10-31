import {onSnapshot} from 'firebase/firestore';

const firestoreQueryString = (query) => {
    return query._query.path.segments.join('/').replace(/\/[^/]+$/, '');
};

class memoryStorage {
    constructor() {
        this.storage = {};
    }

    getItem(key) {
        return this.storage[key];
    }

    setItem(key, value) {
        this.storage[key] = value;
    }

    removeItem(key) {
        delete this.storage[key];
    }
}

let mStorage = new memoryStorage();

const beUpdated = (query, dependencies) => {
    if (!dependencies)
        return true;

    let update = true;
    const qstring = firestoreQueryString(query);
    dependencies.forEach((val, idx) => {
        if (Object.is(mStorage.getItem(`${qstring}.${idx}`), val)) {
            update = false;
        } else {
            mStorage.setItem(`${qstring}.${idx}`, val);
        }
    });
    return update;
};

const cacheFirestore = (
    {
        query,
        store = {},
        listKey = 'list',
        idKey = 'id',
        idKeyOnData = false,
        loadingKey = 'loading',
        errorKey = 'error',
        unsub,
        autoUnsub = true,
        devMode = false,
    },
    dependencies = null,
) => {

    if (!query)
        return;

    if (!beUpdated(query, dependencies))
        return;

    if (unsub && autoUnsub) {
        if (devMode) {
            console.log('unsub', firestoreQueryString(query), store);
        }
        unsub?.();
    }

    store[loadingKey] = true;
    unsub = onSnapshot(
        query,
        (snapshot) => {
            store[listKey] = snapshot.docs.map(doc => {
                const id = idKeyOnData ? doc.data()[idKey] : doc.id;
                return {
                    id: id,
                    ...doc.data(),
                };
            });
            store[loadingKey] = false;
        },
        (error) => {
            store[errorKey] = error;
        });
    return unsub;
};

export {
    cacheFirestore,
};
