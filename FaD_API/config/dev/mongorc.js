//helper functions for the mongo shell
//
//either copy whole file to ~/.mongorc.js
//or add a line in ~/.mongorc.js: load('/path/to/clientServer/config/dev/mongorc.js');

mdb = connect('clientdbm001');
tdb = connect('clientdbt001');
db = tdb;
print('using clientdbt001');

//namespace all functions with k
//to prevent any conflicts with default mongo stuff
//just in case
function _kgetId (rec) {
    return { '_id': rec._id };
}

function _kmapgetid (rec) {
    if (Array.isArray(rec)) return rec.map(_kgetId);
    return _kgetId(rec);
}

function _karr (res) {
    return res.toArray();
}

function _kre (str) {
    return new RegExp(str);
}

function __kfind (_db, collection, q) {
    return _db[collection].find( q + ".test(tojsononeline(obj))" );
}

function _kfind (_db, collections, q, onlyids) {
    q = _kre(q).toString();
    var result = {};
    if (!Array.isArray(collections)) collections = [collections];

    collections.forEach(function (cn) {
        if (/^system/.test(cn)) return;
        var _res = __kfind(_db, cn, q).toArray();
        if (onlyids) _res = _res.map(_kmapgetid);
        if (_res.length > 0) result[cn] = _res;
    });

    return result;
}

function ksearchdb (q, full) {
    return _kfind(db, db.getCollectionNames(), q, full);
}

function ksearchalldbs (q, full) {
    return {
        'clientdbt001': _kfind(tdb, tdb.getCollectionNames(), full),
        'clientdbm001': _kfind(mdb, mdb.getCollectionNames(), full)
    }
}

(function () {
    /**
     * like findone but pick a random document
     */
    function findrandom (_db, collection, q, proj) {
        var cnt, rnd;
        cnt = _db[collection].find(q, proj).count();
        rnd = Math.round(Math.random() * cnt);
        return _db[collection].find(q,proj).skip(rnd).limit(1);
    }

    function findanotherone (_db, collection, q, proj) {
        return findrandom(_db, collection, q, proj).pretty();
    }

    function _extendCollection (_db, collection, prop, desc) {
        Object.defineProperty(_db[collection], prop, desc);
    }

    function _extendCollectionWithMethod (_db, collection, prop, fn) {
        _extendCollection(_db, collection, prop, {
            value: fn,
            enumerable: true
        });
    }

    function _extendCollectionWithGetter (_db, collection, prop, fn) {
        _extendCollection(_db, collection, prop, {
            get: fn,
            enumerable: true
        });
    }

    function _extendWithFindAnother (_db, collection) {
        _extendCollectionWithGetter(_db,
            collection,
            'krandom',
            findanotherone.bind(this, _db, collection)
        );
    }

    tdb.getCollectionNames()
        .forEach(function (cn) {
            if (/^system/.test(cn)) return;
            _extendWithFindAnother(tdb, cn)

            _extendCollectionWithMethod(tdb, cn, 'ksearch',
                _kfind.bind(this, tdb, cn));
        });

    mdb.getCollectionNames()
        .forEach(function (cn) {
            if (/^system/.test(cn)) return;
            _extendWithFindAnother(mdb, cn)

            _extendCollectionWithMethod(mdb, cn, 'ksearch',
                _kfind.bind(this, mdb, cn));
        });
})();

function kuser (q) {
    var res1 = mdb.idtoaccounts.search(q).idtoaccounts;

    printjson (res1);
    return res1.map(function (idrec) {
        return tdb.users.findOne({_id: idrec.clientId}).valueOf();
    });
}

//clear a user from client
function clearUser(emailId){     
    mdb.usercredentials.remove({'emailId':emailId});
    mdb.idverificationtokens.remove({'iD.eId':emailId});     
    tdb.users.remove({'accountInfo.emailId':emailId});
}

function _kdropdbs () {
    tdb.dropDatabase();
    mdb.dropDatabase();
}
