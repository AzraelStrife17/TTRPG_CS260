import './charactersheet.css';
import { useState } from 'react';

function  getAbilityModifier(score){
    return Math.floor((score - 10)/2)
}

function getProficiency(proficiency, lvl){
    if (proficiency <= 0) {
        return 0;
    }

    if (lvl <= 4) return 2;
    if (lvl <= 8) return 3;
    if (lvl <= 12) return 4;
    if (lvl <= 16) return 5;
    return 6;
}

function rollD20(ability, score, setRecentRolls, proficiency, lvl){
    const modifier = getAbilityModifier(score)
    const dieRoll = Math.floor(Math.random() * 20) + 1;
    const proBonus = getProficiency(proficiency, lvl);
    let total = 0

    if (proficiency > 0){
        total = dieRoll + modifier + proBonus;
    }

    else{
        total = dieRoll + modifier;
    }

    setRecentRolls((currentRolls) => [
            {
        id: crypto.randomUUID(),
        ability,
        dieRoll,
        modifier,
        proBonus,
        total,
        },
        ... currentRolls
    ].slice(0, 5));

    return total
};

function mockAttack(setRecentRolls, strengthScore) {
  const dieRoll = Math.floor(Math.random() * 20) + 1;
  const modifier = Math.floor((strengthScore - 10) / 2);
  const total = dieRoll + modifier;

  setRecentRolls((currentRolls) => [
    {
      id: crypto.randomUUID(),
      ability: 'mock greatsword',
      dieRoll,
      modifier,
      proBonus: 0,
      total,
    },
    ...currentRolls,
  ].slice(0, 5));
}

function mockSpell(setRecentRolls, intelligenceScore){
    const dieRoll = Math.floor(Math.random() * 20) + 1;
    const modifier = Math.floor((intelligenceScore - 10) / 2);
    const total = dieRoll + modifier;

    setRecentRolls((currentRolls) => [
    {
      id: crypto.randomUUID(),
      ability: 'mock spell',
      dieRoll,
      modifier,
      proBonus: 0,
      total,
    },
    ...currentRolls,
    ].slice(0, 5));

}

function mockBonus(setRecentRolls, intelligenceScore){
    const dieRoll = Math.floor(Math.random() * 20) + 1;
    const modifier = Math.floor((intelligenceScore - 10) / 2);
    const total = dieRoll + modifier;

    setRecentRolls((currentRolls) => [
    {
      id: crypto.randomUUID(),
      ability: 'mock bonus action',
      dieRoll,
      modifier,
      proBonus: 0,
      total,
    },
    ...currentRolls,
    ].slice(0, 5));

}

export default function Charactersheet() {
    const [hp, setHp] = useState(24);
    const [lvl, setLvl] = useState(1)

    const [abilities, setAbilities] = useState({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8,
    });

    const [savePro, setSavePro] = useState({
        strength: 1,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 1,

    });

    const [skillPro, setSkillPro] = useState({
        acrobatics: 0,
        animalHandling: 0,
        arcana: 0,
        athletics: 0,
        deception: 0,
        history: 0,
        insight: 0,
        intimidation: 0,
        investigation: 0,
        medicine: 0,
        nature: 0,
        perception: 0,
        performance: 1,
        persuasion: 1,
        religion: 0,
        sleightHands: 0,
        stealth: 0,
        survival: 0,
    });

    const [recentRolls, setRecentRolls] = useState([])

    return (
        <main>
            <h1>Character Sheet</h1>
            <div className="portrait_hp">
                <section id="hp_ac">
                    <div className='lvl'>
                        <label htmlFor="lvl">LVL:</label>
                        <input
                            id="lvl"
                            type="number"
                            value={lvl}
                            min="1"
                            max="20"
                            onChange={(event) => setLvl(Number(event.target.value))}
                        />
                    </div>
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
                        onClick={() => rollD20('strength', abilities.strength, setRecentRolls, 0, lvl)}
                    >Strength
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('dexterity', abilities.dexterity, setRecentRolls, 0, lvl)}
                        >Dexterity
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('constitution', abilities.constitution, setRecentRolls, 0, lvl)}
                        >Constitution
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('intelligence', abilities.intelligence, setRecentRolls, 0, lvl)}
                        >Intelligence
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('wisdom', abilities.wisdom, setRecentRolls, 0, lvl)}
                        >Wisdom
                    </button>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => rollD20('charisma', abilities.charisma, setRecentRolls, 0, lvl)}
                        >Charisma
                    </button>
                </div>
            </div>

            <div className="sections">
                <section className="actions">
                    <h2>Actions</h2>
                    <div className="action_buttons">
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => mockAttack(setRecentRolls, abilities.strength)}
                            >Attack Roll
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => mockSpell(setRecentRolls, abilities.intelligence)}
                            >Spell Roll
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => mockBonus(setRecentRolls, abilities.intelligence)}
                            >Bonus Action
                        </button>
                    </div>
                </section>

                <section className="saving_throws">
                    <h2>Saving Throws</h2>
                    <div className="saving_buttons">
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('str saving throw', abilities.strength, setRecentRolls, savePro.strength, lvl)}
                            >STR
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('dex savaing throw', abilities.dexterity, setRecentRolls, savePro.dexterity, lvl)}
                            >DEX
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('con saving throw', abilities.constitution, setRecentRolls, savePro.constitution, lvl)}
                            >CON
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('int saving throw', abilities.intelligence, setRecentRolls, savePro.intelligence, lvl)}
                            >INT
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('wis saving throw', abilities.wisdom, setRecentRolls, savePro.wisdom, lvl)}
                            >WIS
                        </button>
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={() => rollD20('cha saving throw', abilities.charisma, setRecentRolls, savePro.charisma, lvl)}
                            >CHA
                        </button>
                    </div>
                </section>

                <section className="skill_check">
                    <h2>Skill Checks</h2>
                    <div className="skill_buttons">
                        <div className="skill_buttons1">
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('acrobatics', abilities.dexterity, setRecentRolls, skillPro.acrobatics, lvl)}
                                >Acrobatics
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('animal handling', abilities.wisdom, setRecentRolls, skillPro.animalHandling, lvl)}
                                >Animal Handling
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('arcana', abilities.intelligence, setRecentRolls, skillPro.arcana, lvl)}
                                >Arcana
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('athletics', abilities.strength, setRecentRolls, skillPro.athletics, lvl)}
                                >Athletics
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('deception', abilities.charisma, setRecentRolls, skillPro.deception, lvl)}
                                >Deception
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('history', abilities.intelligence, setRecentRolls, skillPro.history, lvl)}
                                >History
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('insight', abilities.wisdom, setRecentRolls, skillPro.insight, lvl)}
                                >Insight
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('intimidation', abilities.charisma, setRecentRolls, skillPro.intimidation, lvl)}
                                >Intimidation
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('investigation', abilities.intelligence, setRecentRolls, skillPro.investigation, lvl)}
                                >Investigation
                            </button>
                        </div>
                        <div className="skill_buttons2">
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('medicine', abilities.wisdom, setRecentRolls, skillPro.medicine, lvl)}
                                >Medicine
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('nature', abilities.intelligence, setRecentRolls, skillPro.nature, lvl)}
                                >Nature
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('perception', abilities.wisdom, setRecentRolls, skillPro.perception, lvl)}
                                >Perception
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('performance', abilities.charisma, setRecentRolls, skillPro.performance, lvl)}
                                >Performance
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('persuasion', abilities.charisma, setRecentRolls, skillPro.persuasion, lvl)}
                                >Persuasion
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('religion', abilities.intelligence, setRecentRolls, skillPro.religion, lvl)}
                                >Religion
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('sleight of hands', abilities.dexterity, setRecentRolls, skillPro.sleightHands, lvl)}
                                >Sleight of Hands
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('stealth', abilities.dexterity, setRecentRolls, skillPro.stealth, lvl)}
                                >Stealth
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button"
                                onClick={() => rollD20('survival', abilities.wisdom, setRecentRolls, skillPro.survival, lvl)}
                                >Survival
                            </button>
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
                                    {roll.modifier >= 0 ? '+' : '-'}{' '}
                                    {roll.proBonus > 0 && <>{roll.proBonus} {' '} +</>}{' '}
                                    {Math.abs(roll.modifier) + ' = '}
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