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

  function handleCreateCharacter(event){
  event.preventDefault();

  const name = newName.trim();
  const className = newClass.trim();

  if (!name || ! className){
    setCreateError('Enter a name and a class');
    return;
  }

  if (characters.some((c) => c.name.toLowerCase() === name.toLowerCase())){
    setCreateError('Already have a character with that name.');
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
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />

            <label htmlFor="new_class">Class:</label>
            <input
              id="new_class"
              type="text"
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
            <input id="campaign_code" type="text" placeholder="Enter Campaign Code Here"/>
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
          <form>
            <label htmlFor="create_campaign_code">Create Code:</label>
            <input id="create_campaign_code" type="text" placeholder="Enter Campaign Code Here"/>
            <button className="btn btn-danger" type="submit">Create</button>
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
                  <tr key={character.id}>
                    <td>{character.name}</td>
                    <td>{campaign.id}</td>
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