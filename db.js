const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_reservation_planner');
const uuid = require('uuid')
const createTables = async() =>{
    const SQL = `
        DROP TABLE IF EXISTS Customer CASCADE;
        DROP TABLE IF EXISTS Restaurant CASCADE;
        DROP TABLE IF EXISTS Reservation;
        CREATE TABLE Customer (
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );
        
        CREATE TABLE Restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );
        
        CREATE TABLE Reservation(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES Restaurant(id) NOT NULL,
            customer_id UUID REFERENCES Customer(id) NOT NULL
        );
    `;
    await client.query(SQL);

};

const createCustomer = async(name)=>{
    const SQL = `
    INSERT INTO Customer(id, name)
    VALUES ($1, $2) 
    RETURNING *
    `;

    const response = await client.query(SQL, [uuid.v4(),name]);
    return response.rows[0];

}

const createRestaurant = async(name)=>{
    const SQL = `
    INSERT INTO Restaurant(id, name)
    VALUES ($1, $2) 
    RETURNING *
    `;

    const response = await client.query(SQL, [uuid.v4(),name]);
    return response.rows[0];

}

const createReservation = async({date, party_count, restaurant_id, customer_id}) =>{
    const SQL = `
    INSERT INTO Reservation (id, date, party_count, restaurant_id, customer_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(),date, party_count, restaurant_id, customer_id]);
    return response.rows[0]
}

const fetchCustomers = async() =>{
    const SQL = `
    SELECT * 
    FROM Customer
    `;
    const response = await client.query(SQL);
    return response.rows;
}

const fetchRestaurants = async() =>{
    const SQL = `
    SELECT *
    FROM Restaurant
    `;
    const response = await client.query(SQL);
    return response.rows;
}

const fetchReservations = async() =>{
    const SQL = `
    SELECT * 
    FROM Reservation
    `;
    const response = await client.query(SQL);
    return response.rows;
}

const deleteReservation = async(id) =>{
const SQL = `
    DELETE FROM Reservation
    where id = $1
`;
await client.query(SQL,[id]);

}
module.exports = {
client,
createTables,
createCustomer,
createRestaurant,
createReservation,
fetchCustomers,
fetchRestaurants,
fetchReservations,
deleteReservation
};