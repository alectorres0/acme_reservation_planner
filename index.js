const {client, createTables, createCustomer, createRestaurant, createReservation, fetchCustomers, fetchRestaurants, fetchReservations, deleteReservation} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('morgan')('dev'));
app.get('/api/customers',async(req,res,next)=>{
    try{

        res.send(await fetchCustomers());
    }

    catch(err){
        next(err);

    }

})


app.get('/api/restaurants',async(req,res,next)=>{
    try{

        res.send(await fetchRestaurants());
    }

    catch(err){
        next(err);

    }

})

app.get('/api/reservations',async(req,res,next)=>{
    try{

        res.send(await fetchReservations());
    }

    catch(err){
        next(err);

    }

})

app.delete('/api/reservations/:id', async(req,res,next)=>{
    try{
        await deleteReservation(req.params.id);
        res.sendStatus(204);
    }

    catch(err){

        next(err);
    }
})

app.post('/api/reservations', async(req,res,next)=>{

    try{
        res.send(await createReservation(req.body));
    }

    catch(err){
        next(err);
    }
})


const init = async()=>{
    await client.connect();
    console.log("connected to database");
    await createTables();
    console.log("tables created");
    const [julie, alec, chilis] = await Promise.all([
        createCustomer('julie'),
        createCustomer('alec'),
        createRestaurant('chilis')
    ])
    console.log(`julie id: ${julie.id}`)
    console.log(`alec id: ${alec.id}`)
    console.log(`chilis id: ${chilis.id}`)
    await Promise.all([
        createReservation({date: '12/12/2024', party_count: 2, restaurant_id: chilis.id, customer_id: julie.id}),
        createReservation({date: '12/12/2025', party_count: 3, restaurant_id: chilis.id, customer_id: alec.id})

    ])
    const reservations = await fetchReservations()
    console.log(reservations);
    

    const port = 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();