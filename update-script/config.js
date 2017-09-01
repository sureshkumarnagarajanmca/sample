var convict = require('convict');
 
// Define a schema 
var config = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT"
  },
  database: {
    host: {
      doc: "Database host name/IP",
      format: '*',
      default: 'server1.dev.test'
    },
    name: {
      doc: "Database name",
      format: String,
      default: 'users'
    }
  }
});