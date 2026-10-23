import './charactersheet.css';
import { useState } from 'react';

function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2)
}

function getProficiency(proficiency, lvl) {
    if (proficiency <= 0) {
        return 0;
    }

    if (lvl <= 4) return 2;
    if (lvl <= 8) return 3;
    if (lvl <= 12) return 4;
    if (lvl <= 16) return 5;
    return 6;
}

function rollD20(ability, score, setRecentRolls, proficiency, lvl) {
    const modifier = getAbilityModifier(score)
    const dieRoll = Math.floor(Math.random() * 20) + 1;
    const proBonus = getProficiency(proficiency, lvl);
    let total = 0

    if (proficiency > 0) {
        total = dieRoll + modifier + proBonus;
    }

    else {
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
        ...currentRolls
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

function mockSpell(setRecentRolls, intelligenceScore) {
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

function mockBonus(setRecentRolls, intelligenceScore) {
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

function healthChange(hp, setRecentRolls) {
    setRecentRolls((currentRolls) => [
        {
            id: crypto.randomUUID(),
            type: 'health',
            hp,
        },
        ...currentRolls,
    ].slice(0, 5));
}

export default function Charactersheet() {
    const [hp, setHp] = useState(24);
    const [lvl, setLvl] = useState(1)

    const [abilities, setAbilities] = useState({
        strength: 1,
        dexterity: 1,
        constitution: 1,
        intelligence: 1,
        wisdom: 1,
        charisma: 1,
    });

    const [savePro, setSavePro] = useState({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,

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
        performance: 0,
        persuasion: 0,
        religion: 0,
        sleightHands: 0,
        stealth: 0,
        survival: 0,
    });

    const [recentRolls, setRecentRolls] = useState([])

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(null);

    const [portrait, setPortrait] = useState('/dr.tofu.png');
    const [portraitError, setPortraitError] = useState('');

    function startEditing() {
        setDraft({
            lvl,
            abilities: { ...abilities },
            skillPro: { ...skillPro },
            savePro: { ...savePro },
            portrait,
        });
        setIsEditing(true)
    }

    function saveEdits() {
        if (!draft) return;

        setLvl(draft.lvl);
        setAbilities(draft.abilities);
        setSkillPro(draft.skillPro);
        setSavePro(draft.savePro);
        setPortrait(draft.portrait);


        setIsEditing(false);
        setDraft(null);
    }

    function cancelEditing() {
        setIsEditing(false);
        setDraft(null);
    }

    function handlePortraitChange(event) {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setPortraitError('Choose an image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setPortraitError('Choose an image smaller than 5 MB.')
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                setPortraitError('Could not load that image.');
                return;
            }

            setDraft((currentDraft) => ({
                ...currentDraft,
                portrait: reader.result,
            }));
            setPortraitError('');
        };

        reader.onerror = () => {
            setPortraitError('Could not read that image file.');
        };

        reader.readAsDataURL(file);
    }

    return (
        <main>
            <h1>Character Sheet</h1>
            <div className="portrait_hp">
                <section id="hp_ac">
                    <div className='lvl'>
                        <label htmlFor="lvl">LVL:</label>
                        {isEditing ? (
                            <input
                                id="lvl"
                                type="number"
                                value={draft.lvl}
                                min="1"
                                max="20"
                                onChange={(event) =>
                                    setDraft({ ...draft, lvl: Number(event.target.value) })
                                }
                            />
                        ) : (
                            <span className='lvl_value'>{lvl}</span>
                        )}

                    </div>
                    <div className="hp_row">
                        <label htmlFor="hp">HP: </label>
                        <input
                            id="hp"
                            type="number"
                            value={hp}
                            min={0}
                            onChange={(event) => setHp(Number(event.target.value))}
                            onBlur={() => healthChange(hp, setRecentRolls)}
                            
                        />
                    </div>

                    <strong id="ac">AC: 17</strong>
                </section>

                <section className="portrait_section">
                    <img className="portrait"
                        src={isEditing && draft ? draft.portrait : portrait}
                        alt="Character Portrait"
                        width="100"
                        height="200"
                    />
                    {isEditing && (
                        <div className="portrait_upload">
                            <label htmlFor="portrait-upload">Change Portrait</label>
                            <input
                                id="portrait-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePortraitChange}
                            />
                            {portraitError && <p role="alert">{portraitError}</p>}
                        </div>
                    )}
                </section>
            </div>

            <div className="edit_button">
                {isEditing ? (
                    <>
                        <button
                            className='btn btn-danger'
                            type="button"
                            onClick={saveEdits}
                        >
                            Save
                        </button>
                        <button
                            className='btn btn-danger'
                            type="button"
                            onClick={cancelEditing}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={startEditing}
                    >
                        Edit
                    </button>
                )}
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

                    <label className="ability_score">
                        {isEditing ? (
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={draft.abilities.strength}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        abilities: {
                                            ...draft.abilities,
                                            strength: Number(event.target.value)
                                        },
                                    })
                                }
                            />
                        ) : (
                            <span>{abilities.strength}</span>
                        )}
                    </label>

                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => rollD20('dexterity', abilities.dexterity, setRecentRolls, 0, lvl)}
                    >Dexterity
                    </button>

                    <label className='ability_score'>
                        {isEditing ? (
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={draft.abilities.dexterity}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        abilities: {
                                            ...draft.abilities,
                                            dexterity: Number(event.target.value)
                                        },
                                    })
                                }
                            />
                        ) : (
                            <span>{abilities.dexterity}</span>
                        )}

                    </label>

                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => rollD20('constitution', abilities.constitution, setRecentRolls, 0, lvl)}
                    >Constitution
                    </button>

                    <label className='ability_score'>
                        {isEditing ? (
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={draft.abilities.constitution}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        abilities: {
                                            ...draft.abilities,
                                            constitution: Number(event.target.value)
                                        },
                                    })
                                }
                            />
                        ) : (
                            <span>{abilities.constitution}</span>
                        )}

                    </label>


                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => rollD20('intelligence', abilities.intelligence, setRecentRolls, 0, lvl)}
                    >Intelligence
                    </button>

                    <label className='ability_score'>
                        {isEditing ? (
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={draft.abilities.intelligence}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        abilities: {
                                            ...draft.abilities,
                                            intelligence: Number(event.target.value)
                                        },
                                    })
                                }
                            />
                        ) : (
                            <span>{abilities.intelligence}</span>
                        )}

                    </label>

                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => rollD20('wisdom', abilities.wisdom, setRecentRolls, 0, lvl)}
                    >Wisdom
                    </button>

                    <label className='ability_score'>
                        {isEditing ? (
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={draft.abilities.wisdom}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        abilities: {
                                            ...draft.abilities,
                                            wisdom: Number(event.target.value)
                                        },
                                    })
                                }
                            />
                        ) : (
                            <span>{abilities.wisdom}</span>
                        )}

                    </label>

                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => rollD20('charisma', abilities.charisma, setRecentRolls, 0, lvl)}
                    >Charisma
                    </button>

                    <label className='ability_score'>
                        {isEditing ? (
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={draft.abilities.charisma}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        abilities: {
                                            ...draft.abilities,
                                            charisma: Number(event.target.value)
                                        },
                                    })
                                }
                            />
                        ) : (
                            <span>{abilities.charisma}</span>
                        )}

                    </label>
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
                        {isEditing ? (
                            <label className="proficiency_control">
                                <input
                                    type="checkbox"
                                    checked={draft.savePro.strength === 1}
                                    onChange={(event) =>
                                        setDraft((currentDraft) => ({
                                            ...currentDraft,
                                            savePro: {
                                                ...currentDraft.savePro,
                                                strength: event.target.checked ? 1 : 0,
                                            },
                                        }))
                                    }
                                />
                                Proficient
                            </label>
                        ) : (
                            <span
                                className='proficiency_marker'
                                aria-label={
                                    savePro.strength === 1 ? 'Proficient' : 'Not proficient'
                                }
                                title={savePro.strength === 1 ? 'Proficient' : 'Not proficient'}
                            >
                                {savePro.strength == 1 ? '✓' : '—'}
                            </span>
                        )}

                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => rollD20('dex savaing throw', abilities.dexterity, setRecentRolls, savePro.dexterity, lvl)}
                        >DEX
                        </button>
                        {isEditing ? (
                            <label className="proficiency_control">
                                <input
                                    type="checkbox"
                                    checked={draft.savePro.dexterity === 1}
                                    onChange={(event) =>
                                        setDraft((currentDraft) => ({
                                            ...currentDraft,
                                            savePro: {
                                                ...currentDraft.savePro,
                                                dexterity: event.target.checked ? 1 : 0,
                                            },
                                        }))
                                    }
                                />
                                Proficient
                            </label>
                        ) : (
                            <span
                                className='proficiency_marker'
                                aria-label={
                                    savePro.dexterity === 1 ? 'Proficient' : 'Not proficient'
                                }
                                title={savePro.dexterity === 1 ? 'Proficient' : 'Not proficient'}
                            >
                                {savePro.dexterity == 1 ? '✓' : '—'}
                            </span>
                        )}


                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => rollD20('con saving throw', abilities.constitution, setRecentRolls, savePro.constitution, lvl)}
                        >CON
                        </button>
                        {isEditing ? (
                            <label className="proficiency_control">
                                <input
                                    type="checkbox"
                                    checked={draft.savePro.constitution === 1}
                                    onChange={(event) =>
                                        setDraft((currentDraft) => ({
                                            ...currentDraft,
                                            savePro: {
                                                ...currentDraft.savePro,
                                                constitution: event.target.checked ? 1 : 0,
                                            },
                                        }))
                                    }
                                />
                                Proficient
                            </label>
                        ) : (
                            <span
                                className='proficiency_marker'
                                aria-label={
                                    savePro.constitution === 1 ? 'Proficient' : 'Not proficient'
                                }
                                title={savePro.constitution === 1 ? 'Proficient' : 'Not proficient'}
                            >
                                {savePro.constitution == 1 ? '✓' : '—'}
                            </span>
                        )}

                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => rollD20('int saving throw', abilities.intelligence, setRecentRolls, savePro.intelligence, lvl)}
                        >INT
                        </button>
                        {isEditing ? (
                            <label className="proficiency_control">
                                <input
                                    type="checkbox"
                                    checked={draft.savePro.intelligence === 1}
                                    onChange={(event) =>
                                        setDraft((currentDraft) => ({
                                            ...currentDraft,
                                            savePro: {
                                                ...currentDraft.savePro,
                                                intelligence: event.target.checked ? 1 : 0,
                                            },
                                        }))
                                    }
                                />
                                Proficient
                            </label>
                        ) : (
                            <span
                                className='proficiency_marker'
                                aria-label={
                                    savePro.intelligence === 1 ? 'Proficient' : 'Not proficient'
                                }
                                title={savePro.intelligence === 1 ? 'Proficient' : 'Not proficient'}
                            >
                                {savePro.intelligence == 1 ? '✓' : '—'}
                            </span>
                        )}


                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => rollD20('wis saving throw', abilities.wisdom, setRecentRolls, savePro.wisdom, lvl)}
                        >WIS
                        </button>
                        {isEditing ? (
                            <label className="proficiency_control">
                                <input
                                    type="checkbox"
                                    checked={draft.savePro.wisdom === 1}
                                    onChange={(event) =>
                                        setDraft((currentDraft) => ({
                                            ...currentDraft,
                                            savePro: {
                                                ...currentDraft.savePro,
                                                wisdom: event.target.checked ? 1 : 0,
                                            },
                                        }))
                                    }
                                />
                                Proficient
                            </label>
                        ) : (
                            <span
                                className='proficiency_marker'
                                aria-label={
                                    savePro.wisdom === 1 ? 'Proficient' : 'Not proficient'
                                }
                                title={savePro.wisdom === 1 ? 'Proficient' : 'Not proficient'}
                            >
                                {savePro.wisdom == 1 ? '✓' : '—'}
                            </span>
                        )}


                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => rollD20('cha saving throw', abilities.charisma, setRecentRolls, savePro.charisma, lvl)}
                        >CHA
                        </button>
                        {isEditing ? (
                            <label className="proficiency_control">
                                <input
                                    type="checkbox"
                                    checked={draft.savePro.charisma === 1}
                                    onChange={(event) =>
                                        setDraft((currentDraft) => ({
                                            ...currentDraft,
                                            savePro: {
                                                ...currentDraft.savePro,
                                                charisma: event.target.checked ? 1 : 0,
                                            },
                                        }))
                                    }
                                />
                                Proficient
                            </label>
                        ) : (
                            <span
                                className='proficiency_marker'
                                aria-label={
                                    savePro.charisma === 1 ? 'Proficient' : 'Not proficient'
                                }
                                title={savePro.charisma === 1 ? 'Proficient' : 'Not proficient'}
                            >
                                {savePro.charisma == 1 ? '✓' : '—'}
                            </span>
                        )}


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
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.acrobatics === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    acrobatics: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.acrobatics === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.acrobatics === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.acrobatics == 1 ? '✓' : '—'}
                                </span>
                            )}



                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('animal handling', abilities.wisdom, setRecentRolls, skillPro.animalHandling, lvl)}
                            >Animal Handling
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.animalHandling === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    animalHandling: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.animalHandling === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.animalHandling === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.animalHandling == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('arcana', abilities.intelligence, setRecentRolls, skillPro.arcana, lvl)}
                            >Arcana
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.arcana === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    arcana: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.arcana === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.arcana === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.arcana == 1 ? '✓' : '—'}
                                </span>
                            )}


                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('athletics', abilities.strength, setRecentRolls, skillPro.athletics, lvl)}
                            >Athletics
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.athletics === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    athletics: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.athletics === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.athletics === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.athletics == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('deception', abilities.charisma, setRecentRolls, skillPro.deception, lvl)}
                            >Deception
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.deception === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    deception: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.deception === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.deception === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.deception == 1 ? '✓' : '—'}
                                </span>
                            )}


                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('history', abilities.intelligence, setRecentRolls, skillPro.history, lvl)}
                            >History
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.history === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    history: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.history === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.history === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.history == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('insight', abilities.wisdom, setRecentRolls, skillPro.insight, lvl)}
                            >Insight
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.insight === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    insight: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.insight === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.insight === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.insight == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('intimidation', abilities.charisma, setRecentRolls, skillPro.intimidation, lvl)}
                            >Intimidation
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.intimidation === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    intimidation: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.intimidation === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.intimidation === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.intimidation == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('investigation', abilities.intelligence, setRecentRolls, skillPro.investigation, lvl)}
                            >Investigation
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.investigation === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    investigation: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.investigation === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.investigation === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.investigation == 1 ? '✓' : '—'}
                                </span>
                            )}


                        </div>
                        <div className="skill_buttons2">
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('medicine', abilities.wisdom, setRecentRolls, skillPro.medicine, lvl)}
                            >Medicine
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.medicine === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    medicine: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.medicine === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.medicine === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.medicine == 1 ? '✓' : '—'}
                                </span>
                            )}


                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('nature', abilities.intelligence, setRecentRolls, skillPro.nature, lvl)}
                            >Nature
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.nature === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    nature: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.nature === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.nature === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.nature == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('perception', abilities.wisdom, setRecentRolls, skillPro.perception, lvl)}
                            >Perception
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.perception === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    perception: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.perception === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.perception === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.perception == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('performance', abilities.charisma, setRecentRolls, skillPro.performance, lvl)}
                            >Performance
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.performance === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    performance: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.performance === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.performance === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.performance == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('persuasion', abilities.charisma, setRecentRolls, skillPro.persuasion, lvl)}
                            >Persuasion
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.persuasion === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    persuasion: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.persuasion === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.persuasion === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.persuasion == 1 ? '✓' : '—'}
                                </span>
                            )}


                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('religion', abilities.intelligence, setRecentRolls, skillPro.religion, lvl)}
                            >Religion
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.religion === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    religion: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.religion === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.religion === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.religion == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('sleight of hands', abilities.dexterity, setRecentRolls, skillPro.sleightHands, lvl)}
                            >Sleight of Hands
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.sleightHands === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    sleightHands: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.sleightHands === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.sleightHands === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.sleightHands == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('stealth', abilities.dexterity, setRecentRolls, skillPro.stealth, lvl)}
                            >Stealth
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.stealth === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    stealth: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.stealth === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.stealth === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.stealth == 1 ? '✓' : '—'}
                                </span>
                            )}

                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => rollD20('survival', abilities.wisdom, setRecentRolls, skillPro.survival, lvl)}
                            >Survival
                            </button>
                            {isEditing ? (
                                <label className="proficiency_control">
                                    <input
                                        type="checkbox"
                                        checked={draft.skillPro.survival === 1}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                skillPro: {
                                                    ...currentDraft.skillPro,
                                                    survival: event.target.checked ? 1 : 0,
                                                },
                                            }))
                                        }
                                    />
                                    Proficient
                                </label>
                            ) : (
                                <span
                                    className='proficiency_marker'
                                    aria-label={
                                        skillPro.survival === 1 ? 'Proficient' : 'Not proficient'
                                    }
                                    title={skillPro.survival === 1 ? 'Proficient' : 'Not proficient'}
                                >
                                    {skillPro.survival == 1 ? '✓' : '—'}
                                </span>
                            )}


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
                            {recentRolls.map((entry) => (
                                <li key={entry.id}>
                                    {entry.type === 'health' ? (
                                        <>HP changed to {entry.hp}</>
                                    ) : (
                                        <>
                                            {entry.ability}: d20 ({entry.dieRoll}){' '}
                                            {entry.modifier >= 0 ? '+' : '-'}{' '}
                                            {Math.abs(entry.modifier)}
                                            {entry.proBonus > 0 && <> {' + '}{entry.proBonus}</>}
                                            {' = '}
                                            {entry.total}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    );
}