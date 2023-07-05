const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const keyBuilder = "AHDAHDOASHDAOSDHAOSDHOASHD213";

const users = [
    {
        id: 1,
        username: 'raihan',
        password: 'admin123'
    },
    {
        id: 2,
        username: 'moderator',
        password: 'moderator'
    }
];

app.use(express.json())
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username)

    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }


    const accessToken = generateAccessToken(username, keyBuilder);

    const refreshToken = jwt.sign({ id: user.id }, keyBuilder);


    user.refreshToken = refreshToken;

    res.json({ accessToken, refreshToken });
});

app.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;


    jwt.verify(refreshToken, keyBuilder, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }


        const user = users.find((u) => u.id === decoded.id && u.refreshToken === refreshToken);
        if (!user) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }


        const accessToken = generateAccessToken(user);

        res.json({ accessToken });
    });
});

function generateAccessToken(user, keyBuilder) {
    const payload = {
        id: user.id,
        username: user.username,
    };

    const options = {
        expiresIn: '15m',
    };

    return jwt.sign(payload, keyBuilder, options);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    // console.log(token)

    if (!authHeader) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(authHeader, keyBuilder, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid access token' });
        }

        req.user = decoded;
        next();
    });
}

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected endpoint' });
  });

app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
})