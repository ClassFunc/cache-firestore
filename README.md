## Cache FireStore with Proxy;

### Install:

```bash
npm install cache-firestore valtio
```

### Usage:

```js
import {cacheFirestore} from 'cache-firestore';

let unsub;
unsub = cacheFirestore({
    query,
    proxy,
    unsub,
});
```

### API:

```
query: Firestore Query,
store: Object or Proxy,
proxy: Object or Proxy,
listKey = 'list',
idKey = 'id',
idKeyOnData = false: `true` if `idKey` is on doc.data(),
loadingKey = 'loading',
errorKey = 'error',
unsub: unsubscribe function,
autoUnsub = true: `false` if you want to unsubscribe manually,
devMode = false: `true` if you want to log the changes,
```

### Example:

```js

import {collection, query, where} from 'firebase/firestore';
import {cacheFirestore} from 'cache-firestore';
import {proxy} from 'valtio';
import {subscribeKey} from 'valtio/utils';

const projectListProxy = proxy({list: [], loading: false, error: null});

let unsub;
subscribeKey(stateProxy, 'user', (user) => {
    unsub = cacheFirestore({
        query: query(
            collection(db, 'projects'),
            where('uid', '==', uid),
        ),
        proxy: projectListProxy,
        unsub: unsub, //pass for autoUnsub
    }, [user?.uid]);
});

// use `unsub?.()` somewhere to unsubscribe manually
// `projectListProxy` will be updated automatically.
```

### License:
MIT

### Author:
[ClassFunc Softwares JSC](https://classfunc.com)
    

