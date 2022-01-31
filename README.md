# bitmosys-crypto

Project for the backend application development.

Language: Node.js, Express.js
Database: Nosql (mongoDB)

Steps to run project:
1) Download the project to local machine
2) Create database in local device i.e. in mongoDB Compass (db name: bitmosys)
3) run npm install
4) Seed data to database: npm run data:insert
5) Start server: npm run dev

APIs:
- GET /user             : get all users
- GET /user/:id         : get user by id
- GET /cryptocoins      : get all cryptocoins
- GET /cryptocoins/:id      : get cryptocoin by id
- POST /user/:userId/cryptocoins/:coinId/buy  : buy cryptocoin (body-urlencoded => quantity)
- POST /user/:userId/cryptocoins/:coinId/exchange : exchange cryptocoin (body-urlencoded => newCoinId - id of the coin to be exchanged
                                                                                            quantity - quantity of coins to be exchanged)
                                                                                            
                                                                                            
If needed, I will present this project.

Thanks and Regards,
Shiva Kumar Shrestha
