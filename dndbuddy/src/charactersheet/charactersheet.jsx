import './charactersheet.css';
import { useState } from 'react';

function  getAbilityModifier(score){
    return Math.floor((score - 10)/2)
}

function rollD20(ability, score, setRecentRolls){
    const modifier = getAbilityModifier(score)
    const dieRoll = Math.floor(Math.random() * 20) + 1;
    const total = dieRoll + modifier;

    setRecentRolls((currentRolls) => [
            {
        id: crypto.randomUUID(),
        ability,
        dieRoll,
        modifier,
        total,
        },
        ... currentRolls
    ].slice(0, 5));

    return total
};

export default function Charactersheet() {
    const [hp, setHp] = useState(24);

    const [abilities, setAbilities] = useState({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8,
    });

    const [recentRolls, setRecentRolls] = useState([])

    return (
        <main>
            <h1>Character Sheet</h1>
            <div className="portrait_hp">
                <section id="hp_ac">
                    <div className="hp_row">
                        <label htmlFor="hp">HP: </label>
                        <input
                            id="hp"
                            type="number"
                            value={hp}
                            min="0"
                            max="30"
                            onChange={(event) => setHp(Number(event.target.value))}
                        />
                    </div>
                    <strong id="ac">AC: 17</strong>
                </section>

                <section className="portrait_section">
                    <img className="portrait" src="/dr.tofu.png" alt="Dr. Tofu" width="100" height="200" />
                </section>
            </div>

            <div className="edit_button">
                <button className="btn btn-danger" type="button">Edit</button>
            </div>

            <div className="ability_checks">
                <h2>Ability Checks</h2>
                <div className="ability_buttons">
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('strength', abilities.strength, setRecentRolls)}
                    >Strength
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('dexterity', abilities.dexterity, setRecentRolls)}
                        >Dexterity
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('constitution', abilities.constitution, setRecentRolls)}
                        >Constitution
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('intelligence', abilities.intelligence, setRecentRolls)}
                        >Intelligence
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('wisdom', abilities.wisdom, setRecentRolls)}
                        >Wisdom
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('charisma', abilities.charisma, setRecentRolls)}
                        >Charisma
                    </button>
                </div>
            </div>

            <div className="sections">
                <section className="actions">
                    <h2>Actions</h2>
                    <div className="action_buttons">
                        <button className="btn btn-danger" type="button">Attack Roll</button>
                        <button className="btn btn-danger" type="button">Spell Roll</button>
                        <button className="btn btn-danger" type="button">Bonus Action</button>
                    </div>
                </section>

                <section className="saving_throws">
                    <h2>Saving Throws</h2>
                    <div className="saving_buttons">
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('str saving throw', abilities.strength, setRecentRolls)}
                            >STR
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('dex savaing throw', abilities.dexterity, setRecentRolls)}
                            >DEX
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('con saving throw', abilities.constitution, setRecentRolls)}
                            >CON
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('int saving throw', abilities.intelligence, setRecentRolls)}
                            >INT
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('wis saving throw', abilities.wisdom, setRecentRolls)}
                            >WIS
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('cha saving throw', abilities.charisma, setRecentRolls)}
                            >CHA
                        </button>
                    </div>
                </section>

                <section className="skill_check">
                    <h2>Skill Checks</h2>
                    <div className="skill_buttons">
                        <div className="skill_buttons1">
                            <button className="btn btn-danger" type="button">Acrobatics</button>
                            <button className="btn btn-danger" type="button">Animal Handling</button>
                            <button className="btn btn-danger" type="button">Arcana</button>
                            <button className="btn btn-danger" type="button">Athletics</button>
                            <button className="btn btn-danger" type="button">Deception</button>
                            <button className="btn btn-danger" type="button">History</button>
                            <button className="btn btn-danger" type="button">Insight</button>
                            <button className="btn btn-danger" type="button">Intimidation</button>
                            <button className="btn btn-danger" type="button">Investigation</button>
                        </div>
                        <div className="skill_buttons2">
                            <button className="btn btn-danger" type="button">Medicine</button>
                            <button className="btn btn-danger" type="button">Nature</button>
                            <button className="btn btn-danger" type="button">Perception</button>
                            <button className="btn btn-danger" type="button">Performance</button>
                            <button className="btn btn-danger" type="button">Persuasion</button>
                            <button className="btn btn-danger" type="button">Religion</button>
                            <button className="btn btn-danger" type="button">Sleight of Hands</button>
                            <button className="btn btn-danger" type="button">Stealth</button>
                            <button className="btn btn-danger" type="button">Survival</button>
                        </div>
                    </div>
                </section>

                <section className="api_placeholder">
                    <h2>Open5e API Data</h2>
                    <div className="api_placeholder_text">
                        <p>This will display Character info, spell data, class and ect.</p>
                        <h3>Class Info</h3>
                        <p>Paladin</p>
                        <p>Hit die: d10</p>
                    </div>
                </section>


                <section className="real_time_actions">
                    <h2>Recent Actions</h2>
                    <div className="real_time_actions_text">
                        <p>Live Rolls displayed here (Websocket Placeholder)</p>
                        <ul>
                            {recentRolls.map((roll) => (
                                <li key={roll.id}>
                                    {roll.ability}: d20 ({roll.dieRoll}){' '}
                                    {roll.modifier >= 0 ? '+' : '-'} {Math.abs(roll.modifier) + ' = '}
                                    {roll.total}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    );
}