const CHARACTERS_KEY = 'dndbuddy.characters';

export function loadCharacters() {
    try {
        const storedValue = window.localStorage.getItem(CHARACTERS_KEY);
        if (storedValue === null) return [];

        const characters = JSON.parse(storedValue);

        if (!Array.isArray(characters)) {
            throw new Error('Saved characters must be a list.');
        }

        return characters;
    }

    catch (error) {
        console.error('Could not load characters from localStorage', error);
        return [];
    }
}

export function saveCharacters(characters) {
    try {
        window.localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
    }

    catch (error) {
        console.error('Could not save characters to localStorage', error);
    }
}

export function createCharacterRecord({ id, name, level, className }) {
    return {
        id,
        name,
        level,
        className,
        hp: 1,
        abilities: {
            strength: 1,
            dexterity: 1,
            constitution: 1,
            intelligence: 1,
            wisdom: 1,
            charisma: 1,
        },

        savePro: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
        },

        skillPro: {
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
        },
        portrait: '/dr.tofu.png',
    };
}