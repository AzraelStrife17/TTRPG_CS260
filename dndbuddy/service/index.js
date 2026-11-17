const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs');
const express = require('express')
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const e = require('express');

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
      await DB.updateUser(user);
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
    await DB.updateUserRemoveAuth(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/characters', verifyAuth, async (req, res, next) => {
    try{
      const userCharacters = await DB
        .collection('characters')
        .find({ownerId: req.user.id})
        .toArray();

        res.send(userCharacters)
    }
    catch (error){
      next(error)
    }
})

apiRouter.post('/characters', verifyAuth, async (req, res, next) => {
    const character = req.body;

    if (!character || typeof character.id !== 'string' || !character.id){
        return res.status(400).send({msg: 'Character must include id'});
    }
    
    try{
      res.send( await updateCharacters(req.body, req.user.id));
    }
    catch (error){
      next(error);
    }
});

apiRouter.delete('/characters/:id', verifyAuth, async (req, res, next) => {
  try{
    const deleted = await deleteCharacters(req.params.id, req.user.id);

    if (!deleted) {
        return res.status(404).send({msg: 'Character not found'})
    }
    
    res.status(204).end();
  }
  catch (error) {
    next(error)
  }
}
)

apiRouter.get('/campaigns', verifyAuth, async (req, res, next) => {
  try{
    const userCampaigns = await DB
      .collection('campaigns')
      .find({'members.userId': req.user.id})
      .toArray()

    res.send(userCampaigns.map((campaign) =>
      campaignForMember(campaign, req.user.id)
    ))
  }
  catch (error){
    next(error)
  }
}
)


apiRouter.post('/campaigns', verifyAuth, async (req, res, next) => {
  const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';

  try{
    if (!code){
      return res.status(400).send({msg: 'Campaign code is required'});
    }

    const existingCampaign = await DB.collection('campaigns').findOne(
      { code },
      { collation: { locale: 'en', strength: 2 } }
    );

    if (existingCampaign) {
      return res.status(409).send({ msg: 'Campaign code already exists' });
    }

    const campaign = await createCampaign(code, req.user.id);
    res.status(201).send(campaignForMember(campaign, req.user.id));
  }
  catch(error){
    next(error)
  }
});

apiRouter.post('/campaigns/join', verifyAuth, async (req, res, next) => {
  try{
    const code = typeof req.body.code === 'string' ? req.body.code.trim(): '';
    const characterId =
      typeof req.body.characterId === 'string' ? req.body.characterId.trim() : '';

    if (!code || !characterId){
      return res.status(400).send({msg: 'Campaign code and character are required'});
    }

    const character = await DB.collection('characters').findOne({
      id: characterId,
      ownerId: req.user.id,
    });

    if (!character) {
      return res.status(404).send({msg: 'Character not found'});
    }

    const campaign = await joinCampaign(code, req.user.id, characterId);

    if (!campaign){
      return res.status(404).send({msg: 'Campaign not found'});
    }

    res.send(campaignForMember(campaign, req.user.id));
  }
  catch (error){
    next(error)
  }
})

apiRouter.delete('/campaigns/:id', verifyAuth, async (req, res, next) => {
  try{
    const result = await DB.collection('campaigns').updateOne(
      {
        id: req.params.id,
        'members.userId': req.user.id,
      },
      {
        $pull: {members: {userId: req.user.id}},
      }
    );

    if (result.matchedCount === 0){
      return res.status(404).send({msg: 'Campaign not found'});
    }

    res.status(204).end();
  }
  catch (error){
    next(error)
  }
});


async function createCampaign(code, ownerId){
  const campaign = {
    id: uuid.v4(),
    code,
    ownerId,
    members: [{ userId: ownerId, characterId: null }],
  };

  await DB.collection('campaigns').insertOne(campaign)
  return campaign;
}

function campaignForMember(campaign, userId){
  const { members, ...campaignData } = campaign;
  const membership = members.find((member) => member.userId === userId);

  return {
    ...campaignData,
    characterId: membership?.characterId ?? null,
  };
}

async function joinCampaign(code, userId, characterId){
  const campaign = await DB.collection('campaigns').findOne(
    { code },
    { collation: { locale: 'en', strength: 2 } }
  );

  if (!campaign){
    return null;
  }

  const membership = campaign.members.find(
    (member) => member.userId === userId
  );

  if (membership) {
    membership.characterId = characterId;
  } else {
    campaign.members.push({ userId, characterId });
  }

  await DB.collection('campaigns').updateOne(
    {id: campaign.id},
    {$set: { members: campaign.members}}
  )

  return campaign

}

async function updateCharacters(newCharacter, ownerId) {
  const characterData = { ...newCharacter}
  delete characterData._id;

  await DB.collection('characters').updateOne(
    {id: characterData.id, ownerId},
    {$set: { ...characterData, ownerId}},
    {upsert: true}
  );

  return DB.collection('characters')
    .find({ownerId})
    .toArray();
}

async function deleteCharacters(characterId, ownerId){
    const result = await DB.collection('characters').deleteOne({
      id: characterId,
      ownerId,
    });

    return result.deletedCount === 1;
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