import { Link } from 'react-router-dom';
import './dashboard.css';
import { useEffect, useState } from 'react';

function loadStoredList(key) {
  try {
    const storedValue = window.localStorage.getItem(key);

    if (storedValue === null) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      throw new Error('Saved value for ${key} is not a list.');
    }

    return parsedValue
  }
  catch(error){
    console.error('Could not load ${key} from localStorage.', error);
    return [];
  }
}

export default function Dashboard() {
  const [characters, setCharacters] = useState(() => loadStoredList('dndbuddy.characters'));
  const [campaigns, setCampaigns] = useState(() => loadStoredList('dndbuddy.campaigns'))

  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState(1);
  const [newClass, setNewClass] = useState('');
  const [createError, setCreateError] = useState('');

  const [newCode, setNewCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const [joinCode, setJoinCode] = useState('');
  const [joinCharacterId, setJoinCharacterId] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'dndbuddy.characters',
        JSON.stringify(characters)
      );
    }
    catch (error) {
      console.error('Could not save characters to localStorage', error);
    }
  }, [characters]);

  useEffect(() => {
    try{
      window.localStorage.setItem(
        'dndbuddy.campaigns',
        JSON.stringify(campaigns)
      );
    }
    catch (error) {
      console.error('Could not save campaigns to localStorage', error);
    }
  }, [campaigns]);

  function handleCreateCharacter(event) {
    event.preventDefault();

    const name = newName.trim();
    const className = newClass.trim();

    if (!name || !className) {
      setCreateError('Enter a name and a class');
      return;
    }

    if (characters.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setCreateError('Already have a character with that name.');
      return;
    }

    if (name.length > 12) {
      setCreateError('Name only 12 characters max')
      return;
    }

    setCharacters((currentCharacters) => [
      ...currentCharacters,
      {
        id: crypto.randomUUID(),
        name,
        level: newLevel,
        className,
      },
    ]);

    setNewName('');
    setNewLevel(1);
    setNewClass('');
    setCreateError('');
  }

  function handleCreateCode(event) {
    event.preventDefault();

    const code = newCode.trim();

    if (!code) {
      setCodeError('Enter Campaign Code')
      return;
    }

    if (campaigns.some((c) => c.code.toLowerCase() === code.toLowerCase())) {
      setCodeError('Code already exists');
      return;
    }

    setCampaigns((currentCampaigns) => [
      ...currentCampaigns,
      {
        id: crypto.randomUUID(),
        code,
        character: '',
        otherPlayers: 0,
      },
    ]);

    setNewCode('');
    setCodeError('');

  }

  function handleJoin() {
    const campaign = campaigns.find(
      (c) => c.code.toLowerCase() === joinCode.trim().toLowerCase()
    );
    const character = characters.find((c) => c.id === joinCharacterId);

    if (!campaign || !character) return;

    setCampaigns((currentCampaigns) =>
      currentCampaigns.map((c) =>
        c.id === campaign.id ? { ...c, character: character.name } : c
      )
    );
  }

  function handleLeave(campaignId) {
    setCampaigns((currentCampaigns) =>
      currentCampaigns.flatMap((campaign) => {

        if (campaign.id !== campaignId) {
          return [campaign];
        }
        if (campaign.otherPlayers > 0) {
          return [{ ...campaign, character: '' }];
        }

        return [];
      })
    );
  }

  return (
    <main>
      <div className="dashboard_sections">
        <section className="saved_characters">
          <h2>My Characters</h2>
          <div className="character_table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Class</th>
                </tr>
              </thead>

              <tbody>
                {characters.length === 0 ? (
                  <tr>
                    <td colSpan="3">No Characters</td>
                  </tr>
                ) : (
                  characters.map((character) => (
                    <tr key={character.id}>
                      <td><Link to="/charactersheet">{character.name}</Link></td>
                      <td>{character.level}</td>
                      <td>{character.className}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <form className="create_character_form" onSubmit={handleCreateCharacter}>
            <label htmlFor="new_name">Name:</label>
            <input
              id="new_name"
              type="text"
              maxLength={12}
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />

            <label htmlFor="new_class">Class:</label>
            <input
              id="new_class"
              type="text"
              maxLength={9}
              value={newClass}
              onChange={(event) => setNewClass(event.target.value)}
            />

            <label htmlFor="new_level">Level:</label>
            <input
              id="new_level"
              type="number"
              min="1"
              max="20"
              value={newLevel}
              onChange={(event) => setNewLevel(Number(event.target.value))}
            />

            <button className="btn btn-danger" type="submit">Create Character</button>
            {createError && <p role="alert">{createError}</p>}
          </form>
        </section>

        <section className="campaign_join_create">
          <h2>Join Campaign</h2>
          <form>
            <label htmlFor="campaign_code">Campaign Code:</label>
            <input
              id="campaign_code"
              type="text"
              placeholder="Enter Campaign Code Here"
              maxLength={10}
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
            />
            <select
              className="select_character"
              id="character_select"
              value={joinCharacterId}
              onChange={(event) => setJoinCharacterId(event.target.value)}
              disabled={characters.length === 0}
            >
              <option value="">Select a Character</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
            <button className="btn btn-danger" type="button" onClick={handleJoin}>Join</button>
          </form>

          <h2>Create Campaign Code</h2>
          <form onSubmit={handleCreateCode}>
            <label htmlFor="create_campaign_code">Create Code:</label>
            <input
              id="create_campaign_code"
              type="text"
              placeholder="Enter Campaign Code Here"
              maxLength={10}
              value={newCode}
              onChange={(event) => setNewCode(event.target.value)}
            />
            <button className="btn btn-danger" type="submit">Create</button>
            {codeError && <p role="alert">{codeError}</p>}
          </form>
        </section>

        <section className="campaign_active">
          <h2>Active Campaigns</h2>
          <div className="campaign_table_wrapper">
            <table className="campaign_table">
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Code</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="3">No Campaigns</td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>{campaign.character || 'Not assigned'}</td>
                      <td>{campaign.code}</td>
                      <td><button type="button" onClick={() => handleLeave(campaign.id)}>Leave</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}