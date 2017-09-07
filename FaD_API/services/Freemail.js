/**
 * Freemail validation service
 * @module Freemail
 *
 * cli usage: node Freemail.js <command>
 * 'node Freemail.js help' for more
 */

//enable debug if called from commandline
if (require.main === module) require('debug').enable('*');
var debug = require('debug')('email:validator');

/**
 * collection of free domains that provide email
 * from: http://wiki.apache.org/spamassassin/Plugin/FreeMail
 * http://svn.apache.org/repos/asf/spamassassin/trunk/rules/20_freemail_domains.cf
 * proccessed to tree of form:
 *  {
 *      "com": {
 *          "google": {
 *              "$": 1
 *          },
 *          "devils": {
 *              "$": 1,
 *              "blue": {
 *                  "$": 1,
 *                  "go": {
 *                      "$": 1
 *                  }
 *              }
 *          }
 *      },
 *      "net": {
 *          "yahoo": {
 *              "$": 1
 *          }
 *      }
 *  }
 *  '{"$": 1}' is used as a marker to signal end of a branch
 *  see: cli usage to list / modify freemails.json
 */
var freemailDictionary = require('./freemails.json');

/**
 * extract domain from an email id
 * @param {String} emailId
 * @returns {String[]} - components of domain as array
 */
function extractDomain (emailId) {
    if (!emailId || (typeof emailId !== 'string')) return undefined;

    emailId = emailId.toLowerCase();

    if (emailId.indexOf('@') > -1)
        emailId = emailId.split('@')[1];
    if (emailId.indexOf('.') > -1)
        emailId = emailId.split('.');

    if (!Array.isArray(emailId) || (emailId.length < 2)) return undefined;
    return emailId;
}

/**
 * check if email/domain is known Free email service provider
 * @param {(String|String[])} domainname - string or array of domain name components
 * @returns {Boolean}
 */
function isFreeMailProvider (domainname) {
    domainname = extractDomain(domainname);
    if (domainname === undefined) return false;
    var dictLevel = freemailDictionary;
    var cur;

    while (cur = domainname.pop()) {
        if (cur in dictLevel) {
            dictLevel = dictLevel[cur];
        } else {
            return false;
        }
    }

    if (dictLevel['$'] === 1)
        return true;
    else
        return false;
}
var isFreemail = exports.isFreemail = isFreeMailProvider;

/**
 * check if emailId is not from Freemail service provider
 * @param {String} emailId
 * @returns {Boolean}
 */
function notFreemail (emailId) {
    return !isFreemail(emailId);
}
exports.notFreemail = notFreemail;

/**
 * recursively update a dictionary with array elements
 * @param {Object} trie - trie to add domain to
 * @param {String[]} domainname - array of domain components
 * @param {String} original - original domain name for debugging
 */
function updateDictionary (trie, domainname, original) {
    if (domainname.length === 0) {
        debug('FreemailDictionary:updated', original);
        trie['$'] = 1;
        return;
    }

    var t = domainname.pop();
    if (trie[t] === undefined)
        trie[t] = {};

    updateDictionary(trie[t], domainname, original);
}
exports._updateDictionary = updateDictionary;

function updateFreemailsJson (dict) {
    require('fs').writeFileSync('./freemails.json', JSON.stringify(dict));
}

/**
 * add an email domain to the Freemails dictionary
 * and update file freemails.json
 * @param {String} domain - or email address
 */
function addFreemailDomain (domainname) {
    var domainnameExists = isFreemail(domainname);
    if (domainnameExists) {
        debug('exists', domainname);
        return;
    }

    domainname = extractDomain(domainname);
    if (domainname === undefined) return debug('invalid domain name');

    var _domainname = domainname.slice().join('.');
    updateDictionary(freemailDictionary, domainname, _domainname);
    updateFreemailsJson(freemailDictionary);
}
exports._addFreemailDomain = addFreemailDomain;

/**
 * remove a domain from the freemailDictionary
 * @param {String[]} domainname
 * @param {String} original - copy of original for debugging
 */
function removeDomain (trie, domainname, original) {
    if (domainname.length === 0) {
        if (trie['$'] === 1) {
            delete trie['$'];
            debug('removed', original);
            if (Object.keys(trie).length === 0)
                return true;
        }
        return false;
    }
    var cur = domainname.pop();
    if (trie[cur] === undefined)
        return true;
    if (removeDomain(trie[cur], domainname, original)) {
        delete trie[cur];
        if (Object.keys(trie).length === 0) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

/**
 * remove a domain from the Freemail dictionary
 * and update file freemails.json
 * @param {String} emailId
 */
function removeFreemailDomain (emailId) {
    var domainname = extractDomain(emailId);
    if (domainname === undefined) return debug('rm', 'invalid domain name');
    removeDomain(freemailDictionary, domainname, domainname.slice().join('.'));
    updateFreemailsJson(freemailDictionary);
}
exports._removeFreemailDomain = removeFreemailDomain;

/**
 * recursively travel trie and construct domains to print
 * @param {Object} trie - tree or sub-tree of freemailDictionary
 */
function printDomains (trie, prev) {
    var keys = Object.keys(trie);
    if (trie['$'] === 1)
        console.log(prev);

    if (prev !== "") prev = '.' + prev;
    keys.forEach(function (key) {
        if (key === '$') return;
        printDomains(trie[key], key + prev);
    });
}

/**
 * print list of all domains
 */
function printFreemailDomains () {
    printDomains(freemailDictionary, '');
}
exports._printFreemailDomains = printFreemailDomains;

function printHelp () {
    var helpstr = "usage: node Freemail.js <command>\n\n" +
        "commands:\n" +
        "\tshow\t\t\tprint list of known free email service providers\n" +
        "\t<email|domain>\t\ttest if emailid/domain is from free service\n" +
        "\tadd <email|domain>\tadd given provider to freemails.json\n" +
        "\trm <email|domain>\tremove given provider from freemails.json";
    console.log(helpstr);
}

if (require.main === module) {
    var len = process.argv.length;
    if (len < 3) return printHelp();
    switch (process.argv[2]) {
        case 'help':
            printHelp();
            break;
        case 'show':
            printFreemailDomains();
            break;
        case "add":
            addFreemailDomain(process.argv[3]);
            break;
        case "rm":
            removeFreemailDomain(process.argv[3]);
            break;
        case 't':
        case 'test':
            debug(process.argv[3], isFreemail(process.argv[3]));
            break;
        default:
            printHelp();
            break;
    }
}
