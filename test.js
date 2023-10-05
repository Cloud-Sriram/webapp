const request = require('supertest')
const apps = require('./server');
const chai = require('chai')
const expect = chai.expect

// We defined 3 test cases


// Test case 1
    describe('Successes', function() {
        it('healthCheck to database ', function(done) {
            request(apps).get('/healthz').send({ }).end(function(err, res) {
                expect(res.statusCode).to.be.equal(200)
                done()
            })
        })
    })

 

 
// Testcase 2
const username = 'flashallen@gmail.com';
const password = 'def456';

const credentials = `${username}:${password}`; 
const base64Credentials = Buffer.from(credentials).toString('base64');



    describe('Successes', function() {
        it('Post data to database', function(done) {
            const authHeaders = {
                Authorization: `Basic ${base64Credentials}`,
            };
            const jsonData = {
                "name": "Assignment 10",
                "points": 8,
                "num_of_attempts": 2,
                "deadline": "2016-08-29T09:12:33.001Z"
              };


            request(apps)
            .post('/v1/assignments')
            .set(authHeaders)
            .send(jsonData)
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(201)
                done()
            })
        })
    })

 
    // Test case 3
    describe('Successes', function() {
        it('Fetch Assignment Data', function(done) {
            const authHeaders = {
                Authorization: `Basic ${base64Credentials}`,
            };
            request(apps)
            .get('/v1/assignments')
            .set(authHeaders)
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200)
                done()
            })

        })

    })

 