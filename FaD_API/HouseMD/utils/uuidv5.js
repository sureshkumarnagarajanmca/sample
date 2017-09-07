/* jshint bitwise: false */

/*
 * @module uuid
 */

var crypto = require('crypto');

var bth = [];
for (var i = 0 ; i < 256; i++) {
    bth[i] = (i + 0x100).toString(16).substr(1);
}

function uuid_toString (buf) {
    var i = 0;

    return  bth[buf[i++]] + bth[buf[i++]] + 
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]];
}

function UUID(uuid) {
    if (!(this instanceof UUID))
            return new UUID(uuid);
    if (uuid instanceof UUID)
        uuid = uuid.toString();

    if (typeof uuid === 'string') {
        uuid = uuid.replace(/-/g,'');
    } else if (uuid instanceof Buffer) {
        uuid = uuid.toString('hex');
    } else {
        throw new Error ('Invalid Datatype');
    }

    if (uuid.length !== 32)
        throw new Error ('Invalid UUID');

    this.buf = new Buffer(uuid, 'hex');
    this.str = uuid_toString(this.buf);
}

UUID.prototype.toString = function () {
    return this.str;
};

UUID.toString = function (buf) {
    return new UUID(buf).toString();
};

var versions = {
    'md5': 0x30,
    'sha1': 0x50
};

function generateHash(algorithm, ns, n) {
    if (!(ns instanceof UUID)) throw new Error ('Invalid Namespace');

    var hashAlgorithm = crypto.createHash(algorithm);

    return hashAlgorithm.update(Buffer.concat([ns.buf, new Buffer(n)])).digest();
}

function generateUUIDBuffer(hash, hashed) {
    var uuid = new Buffer(16);
    var v_modifier = versions[hash];

    uuid = hashed.slice(0, 16);

    //version and reserved bits
    uuid[6] = ((uuid[6] & 0x0f) | v_modifier);
    uuid[8] = ((uuid[8] & 0x3f) | 0x80);

    return uuid;
}

function uuid(hash, namespace, name) {
    if (!hash || !namespace || !name) throw new Error ('Missing Required Parameters');
    if (!(hash in versions)) throw new Error('Unknown hash');

    return UUID.toString(
            generateUUIDBuffer(hash,
                generateHash(hash, new UUID(namespace), name)));
}

module.exports = uuid;

uuid.UUID = UUID;

uuid.v3 = function (namespace, name) {
    return uuid('md5', namespace, name);
};

uuid.v5 = function (namespace, name) {
    return uuid('sha1', namespace, name);
};

// http://tools.ietf.org/html/rfc4122.html#appendix-C
uuid["NAMESPACE_DNS"]  = new UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8");
uuid["NAMESPACE_URL"]  = new UUID("6ba7b811-9dad-11d1-80b4-00c04fd430c8");
uuid["NAMESPACE_OID"]  = new UUID("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
uuid["NAMESPACE_X500"] = new UUID("6ba7b814-9dad-11d1-80b4-00c04fd430c8");
uuid['NIL_UUID']       = new UUID('00000000-0000-0000-0000-000000000000');

if (require.main === module) {
// http://tools.ietf.org/html/rfc4122.html#appendix-B
    var generatedId = uuid.v3(uuid["NAMESPACE_DNS"], "www.widgets.com");
    var testuuid = "e902893a-9d22-3c7e-a7b8-d6e313b71d9f";
    console.log('comparing:\ngeneratedId: %s\ntestuuid: %s\n%s',generatedId, testuuid, generatedId === testuuid);
}
