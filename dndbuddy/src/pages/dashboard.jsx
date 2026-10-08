import { Link } from 'react-router-dom';
import './dashboard.css';

export default function Dashboard() {
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
                  <th>className</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><Link to ="/charactersheet">Anby</Link></td>
                  <td>7</td>
                  <td>Fighter</td>
                </tr>

                <tr>
                  <td><Link to ="/charactersheet">Pyrois</Link></td>
                  <td>19</td>
                  <td>Warlock</td>
                </tr>

                <tr>
                  <td><Link to ="/charactersheet">Dr.Tofu</Link></td>
                  <td>20</td>
                  <td>Paladin</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Link classNameName="btn btn-danger" to="/charactersheet">
            Create Character
          </Link>
        </section>

        <section className="campaign_join_create">
          <h2>Join Campaign</h2>
          <form>
            <label htmlFor="campaign_code">Campaign Code:</label>
            <input id="campaign_code" type="text" placeholder="Enter Campaign Code Here"/>
            <select className="select_character" id="character_select">
              <option value="">Select a Character</option>
              <option value="anby">Anby</option>
              <option value="dr_tofu">Dr. Tofu</option>
              <option value="pyrois">Pyrois</option>
            </select>
            <button classNameName="btn btn-danger" type="button">Join</button>
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
                <tr>
                  <td>Anby</td>
                  <td>SecretCode</td>
                  <td><button type="button">Leave</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}