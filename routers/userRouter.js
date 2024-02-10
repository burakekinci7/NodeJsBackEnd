import express from 'express'
import pgClient from '../config/db.js'
const router = express.Router()

// Create User 
router.post('/', async (req, res) => {
    try {
        const text = "INSERT INTO users (email, password, fullname) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING *"
        const values = [req.body.email, req.body.password, req.body.fullname]
        const { rows } = await pgClient.query(text, values)
        return res.status(201).json({ createdUser: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message);
        return res.status(400).json({ message: error.message })
    }
})

// Authentication
router.post('/login', async (req, res) => {
    try {
        const queryLogin = "SELECT * FROM users WHERE email = $1 AND password = crypt($2, password)"
        const values = [req.body.email, req.body.password]
        const { rows } = await pgClient.query(queryLogin, values)

        if (!rows.length)
            res.status(404).json({ message: 'User Not Fount!!!' })

        return res.status(200).json({ message: 'User Authentication Successful :)' })
    } catch (error) {
        console.log('Error :', error.message);
        return res.status(400).json({ message: error.message })
    }
})

// Update 
router.put('/update/:userID', async (req, res) => {
    try {
        const { userId } = req.params

        const text = "UPDATE users SET email = $1, fullname = $2 WHERE id = $3 RETURNING *"

        const values = [req.body.email, req.body.fullname, userId]

        const { rows } = await pgClient.query(text, values)
        if (!rows.length)
            return res.status(404).json({ message: "User Not Found" })

        return res.status(200).json({ updateUser: rows[0] })
    } catch (error) {
        console.log('Error not update:'), error.message;
        return res.status(400).json({ message: error.message })
    }
})

//Delete
router.delete('/delete/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        const text = "DELETE FROM users WHERE id = $1 RETURNING *"

        const values = [userId]

        const { rows } = await pgClient.query(text, values)
        if (!rows.length)
            return res.status(404).json({ message: "User Not Found" })

        return res.status(200).json({ deleteUser: rows[0] })
    } catch (error) {
        console.log('Error not delete:'), error.message;
        return res.status(400).json({ message: error.message })
    }
})

//Get All Users
router.get('/get', async (req, res) => {
    try {
        const text = "SELECT * FROM users ORDER BY id ASC"
        const { rows } = await pgClient.query(text)
        return res.status(200).json(rows)
    } catch (error) {
        console.log('Error not get all:', error.message);
        return res.status(400).json({ message: error.message })
    }
})


export default router