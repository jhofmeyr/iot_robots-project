var sphero = require("sphero");
var spheroId = process.argv[2];
var orb = sphero(spheroId);

orb.connection(function () {

  orb.color("green");

})