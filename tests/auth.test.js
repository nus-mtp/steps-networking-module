var should = require("should");
var mongoose = require('mongoose');
var Account = require("../server/models/account.js");
var db;

describe('Account', function() {

    before(function(done) {
        db = mongoose.connect('mongodb://localhost/test');
            done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done) {
        var account = new Account({
            username: 'saitama',
            password: 'onepunch',
            email: 'onepunchman@hero.association.com',
            description: 'strongest man alive',
            will_notify: 'genos',
            is_deleted: false,
        });

        account.save(function(error) {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', function(done) {
        Account.findOne({ username: 'saitama' }, function(err, account) {
            account.username.should.eql('saitama');
            console.log("   username: ", account.username);
            console.log("   password: ", account.password);
            console.log("   email: ", account.email);
            console.log("   description: ", account.description);
            console.log("   will_notify: ", account.will_notify);
            console.log("   is_deleted: ", account.is_deleted);
            done();
        });
    });

    afterEach(function(done) {
        Account.remove({}, function() {
            done();
        });
     });

});
