import { Link } from 'react-router-dom';
import './dashboard.css';
import { useState } from 'react';

export default function Dashboard() {
  const [characters, setCharacters] = useState([])
  const [campaigns, setCampaigns] = useState([])

  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState(1);
  const [newClass, setNewClass] = useState('');
  const [createError, setCreateError] = useState('');

  const [newCode, setNewCode] = useState('');
  const [codeError, setCodeError] = useState('');

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

    if (!code){
      setCodeError('Enter Campaign Code')
      return;
    }

    if (campaigns.some((c) => c.code.toLowerCase() === code.toLowerCase())){
      setCodeError('Code already exists');
      return;
    }

    setCampaigns((currentCampaigns) => [
      ...currentCampaigns,
      {
        id: crypto.randomUUID,
        code,
        character: '',
      },
    ]);

    setNewCode('');
    setCodeError('');

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

          <form onSubmit={handleCreateCharacter}>
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
            <input id="campaign_code" type="text" placeholder="Enter Campaign Code Here" />
            <select className="select_character" id="character_select" disabled={characters.length === 0}>
              <option value="">Select a Character</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
            <button className="btn btn-danger" type="button">Join</button>
          </form>

          <h2>Create Campaign Code</h2>
          <form onSubmit={handleCreateCode}>
            <label htmlFor="create_campaign_code">Create Code:</label>
            <input 
              id="create_campaign_code" 
              type="text" 
              placeholder="Enter Campaign Code Here" 
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
                      <td><button type="button">Leave</button></td>
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