const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
let users = [];

app.get("/hello", (req, res) => {
    res.send('Hello World!');
}); 

app.get("/users", (req, res) => {
    res.json({
        message: "Aa jaao bhai!",
        users: users
    });
});

app.post("/users", (req, res) => {
    const {name, email} = req.body;

    // backend will receive:

    // req.body = {
    //     name: "Prakhar Agrawal"
    //     email: "abc@gmail.com"
    // }
    
    // so this can be written in 2 ways:

    // const name = req.body.name;
    // const email = req.body.email;

    // OR 

    // By destructuring:

    // const {name, email} = req.body;

    if(!name || !email) {
        return res.status(400).json({
            message: "email and name can't be empty!"
        });
    }

    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        balance: 0
    }
    
    users.push(newUser);

    // 201 - resource created successfully at server side
    res.status(201).json({
        message: "User stored successfully",
        user: newUser
    });
});

// add-balance API:
// :id --> dynamic param, that's why ":"

app.post("/users/:id/add-balance", (req, res) => {

    // need to do parseint as id comes as string, so convert to int
    const userId = parseInt(req.params.id);
    const {amount} = req.body;

    if(!amount || amount < 0) {
        return res.status(400).json({
            message: "Amount to add to the balance can't be negative or zero."
        });
    }

    // check if user exists:
    const user = users.find(u => u.id === userId);

    if(!user) {
        return res.status(404).json({
            message: "User not found!"
        });
    }

    //update balance:
    user.balance += amount;

    //send success response:
    res.json({
        message: "Balance updated successfully!",
        user: user
    });
});

// tranfer API:

app.post("/users/:senderId/:receiverId/transfer", (req, res) => {

    const {amount} = req.body;
    const senderId = parseInt(req.params.senderId);
    const receiverId = parseInt(req.params.receiverId);

    // checking if sender and receiver exists or not and that they are not the same:

    const sender = users.find(u => u.id === senderId);
    const receiver = users.find(u => u.id === receiverId);

    if(!sender || !receiver) {
        return res.status(404).json({
            message: "Either Sender or receiver does not exist"
        })
    }

    if (senderId === receiverId) {
        return res.status(400).json({
            message: "Sender and receiver cannot be same"
        });
    }

    // confirm if amount is not neg:

    if(!amount || amount <= 0) {
        return res.status(400).json({
            message: "Amount must be greater than zero!"
        })
    }

    // check if the sender has enough balance:

    if(sender.balance < amount) {
        return res.status(400).json({
            message: "Sender doesn't have enough balance!"
        })
    }

    // Deduct from sender and add money to receiver:

    sender.balance -= amount;
    receiver.balance += amount;

    // Success Message:

    res.status(200).json({
        message: "Transaction successful!"
    })

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});