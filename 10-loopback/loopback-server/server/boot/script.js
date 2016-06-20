module.exports = function (app) {
  var MongoDB = app.dataSources.MongoDB;

  MongoDB.automigrate('Customer', function (err) {
    if (err) throw (err);
    var Customer = app.models.Customer;

    Customer.create([
      {username: 'admin', email: 'admin@conFusion.com', password: '123'},
      {username: 'cezar', email: 'cezar@conFusion.com', password: '123'}
    ], function (err, users) {
      if (err) {
        console.log("Customer.create", err);
        return cb(err);
      }
      var Role = app.models.Role;
      var RoleMapping = app.models.RoleMapping;

      console.log("Created customers", users[0]);

      var assignAdmin = function(role) {
        "use strict";
        //make admin
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function (err, principal) {
          if (err) {
            console.log("role.principals.create error", err);
            throw (err);
          }
        });
      };

      Role.find({}, function(err, roles) {
        if (err) {
          return cb(err);
        }
        else {
          var role = (roles.filter(function (item) {return (item.name == 'admin');}))[0];
          if (role) {
            assignAdmin(role);
          }
          else {
            //-- create a new role
            Role.create({name: 'admin'}, function (err, role) {
              if (err) {
                console.log("Role.create error", err);
                return cb(err);
              }
              else {
                assignAdmin(role);
              }
            });
          }
        }
      });

    });
  });

};
