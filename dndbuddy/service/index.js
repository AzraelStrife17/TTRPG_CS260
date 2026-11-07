const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs');
const express = require('express')
const uuid = require('uuid');
const app = express();

const authCookieName = 'token'

let users = [];
let characters = [];
let campaigns = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'))

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/characters', verifyAuth, (req, res) => {
    const userCharacters = characters.filter(
        (character) => character.ownerId === req.user.id
    );

    res.send(userCharacters)
})

apiRouter.post('/characters', verifyAuth, (req, res) => {
    const character = req.body;

    if (!character || typeof character.id !== 'string' || !character.id){
        return res.status(400).send({msg: 'Character must include id'});
    }
    res.send(updateCharacters(req.body, req.user.id));
});

apiRouter.delete('/characters/:id', verifyAuth, (req, res) => {
    const deleted = deleteCharacters(req.params.id, req.user.id);

    if (!deleted) {
        return res.status(404).send({msg: 'Character not found'})
    }
    
    res.status(204).end();
}
)

apiRouter.get('/campaigns', verifyAuth, (req, res) => {
  const userCampaigns = campaigns.filter(
    (campaign) => campaign.memberIds.includes(req.user.id)
  );
  res.send(userCampaigns)
})


apiRouter.post('/campaigns', verifyAuth, (req, res) => {
  const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';

  if (!code){
    return res.status(400).send({msg: 'Campaign code is required'});
  }

  if (campaigns.some(
    (campaign) => campaign.code.toLowerCase() === code.toLowerCase()
  )){
    return res.status(409).send({msg: 'campaign code already exists'});
  }

  const campaign = createCampaign(code, req.user.id);
  res.status(201).send(campaign);
});

apiRouter.post('/campaigns/join', verifyAuth, (req, res) => {
  const code = typeof req.body.code === 'string' ? req.body.code.trim(): '';

  if (!code){
    return res.status(400).send({msg: 'Campaign code is required'});
  }

  const campaign = joinCampaign(code, req.user.id);

  if (!campaign){
    return res.status(404).send({msg: 'Campaign not found'});
  }

  res.send(campaign);
})

apiRouter.delete('/campaigns/:id', verifyAuth, (req, res) => {
  const campaign = campaigns.find(
    (campaign) => campaign.id === req.params.id
  );

  if (!campaign || !campaign.memberIds.includes(req.user.id)) {
    return res.status(404).send({msg: 'Campaign not found'});
  }

  campaign.memberIds = campaign.memberIds.filter(
    (memberId) => memberId !== req.user.id
  );

  res.status(204).end();
});


function createCampaign(code, ownerId){
  const campaign = {
    id: uuid.v4(),
    code,
    ownerId,
    memberIds: [ownerId],
  };

  campaigns.push(campaign);
  return campaign;
}

function joinCampaign(code, memberId){
  const campaign = campaigns.find(
    (campaign) =>
      campaign.code.toLowerCase() === code.toLowerCase()
  );

  if (!campaign){
    return null;
  }
  if (!campaign.memberIds.includes(memberId)){
    campaign.memberIds.push(memberId)
  }

  return campaign;

}

function updateCharacters(newCharacter, ownerId) {
    const index = characters.findIndex(
        (character) => 
            character.id === newCharacter.id &&
            character.ownerId === ownerId
    );

    if (index === -1){
        characters.push({... newCharacter, ownerId});
    }
    else{
        characters[index] = {
            ...characters[index],
            ...newCharacter,
            ownerId,
        };
    }

    return characters.filter((character) => character.ownerId === ownerId);
}

function deleteCharacters(characterId, ownerId){
    const index = characters.findIndex(
        (character) => 
            character.id === characterId &&
            character.ownerId === ownerId
    );

    if (index === -1){
        return false;
    }

    characters.splice(index, 1);
    return true;
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: uuid.v4(),
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})