# D&D Buddy Reactivity Study Guide

This guide explains the React behavior implemented for the React reactivity
deliverable. It is intended as a study aid: try to explain each pattern in your
own words, then use the code links at the end to find the implementation.

## 1. The main idea: state drives the interface

In React, the interface is a description of what should be shown for the current
data. When state changes, React renders the component again using the new data.
You normally do not find an element and change its text manually.

```jsx
const [hp, setHp] = useState(1);
```

- `hp` is the current value.
- `setHp` is the function that asks React to update that value.
- `useState(1)` gives the value its initial value.
- When `setHp` changes the value, React renders the component again.

For example, the HP input uses `value={hp}` to show the state and an `onChange`
handler to update it. The state is the source of truth; the input displays it.

## 2. React hooks used in the project

Hooks are React functions that add capabilities to function components. Hooks
must be called at the top level of a component or a custom hook, not inside an
`if`, loop, or event handler.

### `useState`

`useState` holds information that can change while the user interacts with the
page. Examples include:

- Dashboard character and campaign lists
- Form text such as a new character name or campaign code
- The selected character's HP, level, abilities, and proficiencies
- Whether the character sheet is in edit mode
- The mock logged-in user

Each state value has a setter. Call the setter rather than assigning directly
to the state variable:

```jsx
setHp(Number(event.target.value));
```

Direct assignment such as `hp = 10` does not tell React to render the new value.

### `useEffect`

`useEffect` runs after React renders. A dependency array tells React when to run
the effect again:

```jsx
useEffect(() => {
  window.localStorage.setItem(
    'dndbuddy.characters',
    JSON.stringify(characters)
  );
}, [characters]);
```

This saves the character list after it changes. The `[characters]` dependency
means the effect runs after the initial render and after later renders where
`characters` has changed.

The dashboard has effects for the character and campaign lists. The character
sheet has an effect that merges its current sheet values into the matching
character record and saves the array.

## 3. Arrow functions and event handlers

An arrow function is a shorter way to write a function:

```jsx
const double = (number) => number * 2;
```

This is similar to:

```jsx
function double(number) {
  return number * 2;
}
```

Arrow functions are common in event handlers and array methods.

### Passing a function versus calling it

This passes a function for React to call when the event happens:

```jsx
onClick={saveEdits}
```

This creates a small function that calls a handler with an argument when the
button is clicked:

```jsx
onClick={() => handleLeave(campaign.id)}
```

Do not write `onClick={handleLeave(campaign.id)}` when you mean to wait for a
click. That form calls the function during rendering.

### Event parameters

React passes an event object to handlers such as `onChange` and `onSubmit`:

```jsx
onChange={(event) => setNewName(event.target.value)}
```

`event.target` is the input that changed; `event.target.value` is its current
text. A checkbox uses `event.target.checked`, which is a boolean.

## 4. Controlled inputs and forms

A controlled input gets its value from React state and sends changes back to
that state:

```jsx
<input
  value={newName}
  onChange={(event) => setNewName(event.target.value)}
/>
```

This keeps the displayed value and React state synchronized. It also makes it
straightforward to clear a form after a successful submission:

```jsx
setNewName('');
```

Forms use `onSubmit`, which works for clicking the submit button and pressing
Enter. The handler calls `event.preventDefault()` to stop the browser's normal
page reload:

```jsx
function handleCreateCharacter(event) {
  event.preventDefault();
  // Validate input and update React state.
}
```

Number inputs still provide their value as text, so `Number(...)` converts it
before saving it as numeric state:

```jsx
setNewLevel(Number(event.target.value));
```

Other useful string operations in the form handlers:

- `.trim()` removes spaces from the start and end.
- `.toLowerCase()` makes a case-insensitive comparison.
- `.length` checks the number of characters.

HTML attributes such as `required`, `maxLength`, `min`, and `max` help guide
input, but important rules should also be validated in JavaScript.

## 5. Updating arrays and objects without mutation

React state should be treated as read-only. Instead of changing an existing
array or object, create a new one and pass it to the setter.

### Spread syntax (`...`)

The spread syntax copies values from an array or object:

```jsx
const nextAbilities = {
  ...abilities,
  strength: 12,
};
```

This copies all existing ability properties, then replaces only `strength`.
Without `...abilities`, the new object would contain only `strength` and would
lose the other scores.

For nested state, make a new copy at each changed level:

```jsx
setDraft({
  ...draft,
  abilities: {
    ...draft.abilities,
    strength: Number(event.target.value),
  },
});
```

The outer spread preserves fields such as `lvl`, `skillPro`, and `savePro`. The
inner spread preserves all the other ability scores.

For arrays, spread preserves existing items:

```jsx
setCharacters((currentCharacters) => [
  ...currentCharacters,
  newCharacter,
]);
```

This creates a new array with the old characters followed by the new character.

### Functional state updates

When a new value depends on the previous state, use the updater form:

```jsx
setCampaigns((currentCampaigns) => [
  ...currentCampaigns,
  newCampaign,
]);
```

React supplies the latest state as `currentCampaigns`. This avoids using an
older value captured by a previous render. The parameter name is local to that
function; it could be called `previousCampaigns` instead.

## 6. Array methods used by the dashboard

These methods do not mutate the original array; they return a result that can
be used to update state.

- `.map()` transforms each item, often into JSX or a changed object.
- `.filter()` keeps only items that pass a condition.
- `.flatMap()` can keep, replace, or remove an item by returning an array from
  each callback.
- `.find()` returns the first matching item, or `undefined`.
- `.some()` returns `true` if any item passes a condition.

### Rendering a list with `.map()`

```jsx
characters.map((character) => (
  <tr key={character.id}>
    <td>{character.name}</td>
    <td>{character.level}</td>
  </tr>
))
```

React renders one row for each character. The stable `key` helps React identify
which row changed when the list is updated. Character IDs are generated with
`crypto.randomUUID()`.

### Removing a campaign with `.flatMap()`

The Leave handler returns `[campaign]` to keep an unrelated campaign, returns
an updated campaign when other players remain, or returns `[]` to remove the
selected campaign. `flatMap` combines those per-campaign arrays into one list.

## 7. Conditional rendering and the ternary operator

The ternary operator is a compact if/else expression:

```jsx
condition ? valueWhenTrue : valueWhenFalse
```

The character sheet uses it to show inputs while editing and read-only values
otherwise:

```jsx
{isEditing ? (
  <input value={draft.lvl} />
) : (
  <span>{lvl}</span>
)}
```

A conditional can also use `&&` when something should appear only when a
condition is true:

```jsx
{createError && <p role="alert">{createError}</p>}
```

If `createError` is an empty string, React shows nothing. If it contains text,
React shows the error paragraph.

## 8. Creating characters and campaigns

### Character creation

The dashboard's `handleCreateCharacter`:

1. Prevents the browser's normal form submission.
2. Trims the name and class.
3. Checks for missing values, duplicate names, and the name-length rule.
4. Creates a unique ID.
5. Calls `createCharacterRecord` to make a complete character object with
   default sheet fields.
6. Appends that object to the character state using the functional updater.
7. Clears the form after success.

The record is an object with dashboard values (`id`, `name`, `level`,
`className`) and sheet values (`hp`, `abilities`, `savePro`, `skillPro`, and
`portrait`). Keeping these in one record lets a sheet be found by its ID.

### Campaign creation and joining

`handleCreateCode` trims the code, checks it is present and unique, then adds
an object to campaign state. The campaign begins with an empty `character` and
an `otherPlayers` placeholder.

`handleJoin` uses `.find()` to locate the campaign by code and the character by
ID. If both exist, `.map()` creates a new campaign list where the matching
campaign has its `character` updated.

This is a local, single-browser mock. It cannot find a code created by another
user or track real players on a server.

### Campaign leaving

`handleLeave(campaignId)` uses `.flatMap()` to update only the clicked
campaign. It keeps the code and clears the character if the placeholder says
other players remain. Otherwise, it removes the campaign. Since the mock
starts `otherPlayers` at zero, leaving currently removes the campaign.

## 9. Editing with a draft

The character sheet keeps saved state separate from temporary edit state:

```jsx
const [isEditing, setIsEditing] = useState(false);
const [draft, setDraft] = useState(null);
```

- `startEditing` copies current saved values into a draft and turns editing on.
- Inputs update the draft, not the saved values.
- `saveEdits` copies draft values into saved state, then clears the draft.
- `cancelEditing` clears the draft without changing saved values.

This pattern is useful when Cancel must discard changes. Nested values such as
ability scores and proficiency objects need nested copies with spread syntax.
For a proficiency checkbox, `event.target.checked ? 1 : 0` converts the
checkbox's boolean into the existing numeric representation.

The HP field is intentionally different: it is updated immediately during
play, outside the edit draft. Its `onBlur` handler adds the final displayed HP
value to the recent-actions list when the field loses focus.

## 10. Dice rolls and the recent-actions list

`getAbilityModifier(score)` calculates the usual modifier with:

```jsx
Math.floor((score - 10) / 2)
```

`getProficiency(proficiency, lvl)` returns zero for an unproficient roll, or
the level-based proficiency bonus for a proficient roll.

`rollD20`:

1. Calculates the ability modifier.
2. Generates a random number from 1 through 20.
3. Calculates the proficiency bonus.
4. Adds the applicable values to get the total.
5. Prepends a record to `recentRolls`, keeping only five entries.

The attack, spell, and bonus-action functions are simplified mock rolls. They
create records with the same fields as a d20 roll, which lets the recent-roll
list display them consistently. They currently omit proficiency.

The recent-actions list uses `.map()` to display each entry. A ternary checks
whether the entry is a health update or a die roll because those record types
have different fields.

## 11. Portrait uploads

`handlePortraitChange` handles the file input's change event:

1. Reads the first selected file.
2. Checks that its MIME type starts with `image/` and that it is no larger
   than 5 MB.
3. Uses `FileReader` to read the file as a data URL.
4. Stores that data URL in the draft portrait for the preview.
5. Stores an error message if validation or file reading fails.

The image uses the draft portrait while editing and the saved portrait
otherwise. Save commits the draft portrait; Cancel discards it. The image is
stored in browser storage with the character, so large uploads may reach
`localStorage` limits.

## 12. Multiple character sheets and routes

Each character has a unique ID. The dashboard link includes it in the URL:

```jsx
<Link to={`/charactersheet/${character.id}`}>{character.name}</Link>
```

Backticks create a template literal, allowing `${character.id}` to be replaced
with the current character's ID.

The route in `app.jsx` uses `:characterId` as a route parameter. The
`CharacterSheetRoute` component reads it with `useParams()` and passes it as a
prop to the sheet. The `key={characterId}` causes React to create fresh sheet
component state when navigating to a different character ID.

The sheet finds its initial character in the stored array. Its save effect
maps over the array, replaces only the matching record, and leaves all other
characters unchanged.

## 13. Local storage and shared helpers

`localStorage` persists strings for the current browser origin. It is not a
server database and does not sync between devices.

The helpers in `src/data/characterStorage.js` have separate jobs:

- `loadCharacters()` reads and parses the saved JSON array.
- `saveCharacters(characters)` serializes and writes the array.
- `createCharacterRecord(...)` builds a character with default sheet values.

`JSON.stringify` converts JavaScript data to text; `JSON.parse` converts it
back. `try`/`catch` handles storage and parsing errors so the application can
report a problem instead of silently assuming the operation succeeded.

The mock login stores only an email in `dndbuddy.user`. It does not store the
password or verify credentials. Login and Create currently share the same
mock submit behavior; real authentication belongs in a future service.

## 14. How to study and explain the code

For each interaction, trace this path:

1. **What event starts it?** For example, a form submit or input change.
2. **Which handler runs?**
3. **Which state setter is called?**
4. **What new value or object is produced?**
5. **Which JSX reads that state and changes what is displayed?**
6. **Does an effect persist the change to localStorage?**

Practice explaining one example in each group: create a character, update an
ability in a draft, roll a skill, save a portrait, join a campaign, and load a
character by route ID. If you can trace those without copying the explanation,
you understand the main patterns behind the implementation.

## 15. Function-by-function reference

This section explains what each named function contributes and how data moves
through it. Most handlers do not return a value; they update React state, which
causes the relevant UI to render again.

### Character storage helpers

#### `loadCharacters()`

This function in `src/data/characterStorage.js` loads the character array:

1. It asks `localStorage` for the `dndbuddy.characters` string.
2. If there is no saved string, it returns an empty array.
3. Otherwise, `JSON.parse` converts the string into JavaScript data.
4. It checks that the parsed data is an array.
5. If reading or parsing fails, `catch` logs the error and returns an empty
   array.

The dashboard and character sheet call this so each can find the latest saved
records. The password/login session uses a separate key and is not part of this
character array.

#### `saveCharacters(characters)`

This function converts the supplied character array to JSON text and writes it
to `localStorage` under the same key. It uses `try`/`catch` because browser
storage can fail, for example if the storage quota is full.

The parameter is the complete updated array, not just one character. To save
one sheet without losing the others, the character-sheet effect first maps
over the complete array and changes only the matching record.

#### `createCharacterRecord({ id, name, level, className })`

This is a factory function: it accepts the character's identity fields and
returns a complete new character object. The parameter uses object
destructuring, which is equivalent to receiving one object and reading those
four properties from it.

It supplies default values for HP, the six ability scores, saving-throw
proficiencies, skill proficiencies, and portrait. Centralizing these defaults
means every character starts with the same data structure. The current defaults
are in the helper and can be changed there if the desired starting sheet values
change.

### Dashboard functions

#### `loadStoredList(key)`

This is the dashboard's generic loader for campaign data:

1. `key` tells it which localStorage item to read.
2. It returns `[]` when no item exists.
3. It parses the stored JSON and checks that it is an array.
4. If there is a storage or parsing error, it logs the error and returns `[]`.

The dashboard uses this for `dndbuddy.campaigns`. Characters use the shared
`loadCharacters()` helper instead.

#### `Dashboard()`

`Dashboard` is the page component, not just a data function. It:

- Creates React state for character records, campaigns, and form inputs.
- Loads the saved character/campaign lists for their initial values.
- Uses effects to write changed lists to localStorage.
- Defines event handlers used by its forms and buttons.
- Renders the tables and forms from the current state.

The character list is initialized with `useState(loadCharacters)`. Passing the
loader function (without calling it) lets React use it to get the initial
state. Form input states start with empty strings, and their `value` and
`onChange` keep React synchronized with what the user types.

#### Character and campaign save effects

The dashboard has one effect watching `characters` and another watching
`campaigns`. Each runs after the component renders and writes its current list.
They are separate because each effect is responsible for a different storage
key and has its own dependency.

The character effect writes directly through `window.localStorage`; the sheet
uses `saveCharacters()`. Both serialize the same character array structure.

#### `handleCreateCharacter(event)`

This function runs when the Create Character form is submitted:

1. `preventDefault()` stops a browser reload.
2. It trims the name and class form values.
3. It rejects a missing name/class, a case-insensitive duplicate name, or a
   name that exceeds the configured limit. `return` stops processing after an
   error.
4. It makes a unique ID with `crypto.randomUUID()`.
5. `createCharacterRecord(...)` builds a complete record using the form fields
   plus sheet defaults.
6. A functional `setCharacters` update appends the record to the latest list.
7. It clears the fields and error message after success.

The state update triggers a render, the table and dropdown read the new list,
and the characters effect then saves it.

#### `handleCreateCode(event)`

This form handler also prevents a page reload. It trims the typed code, rejects
an empty or duplicate code, then appends a new campaign object to the latest
campaign list. The object has a unique ID, the code, an empty character
assignment, and the `otherPlayers` placeholder.

After success, it clears the code field and error. The campaigns effect
persists the new campaign. The table renders the new row because it maps over
the updated campaign state.

#### `handleJoin()`

This button handler looks for two records:

1. `.find()` locates a campaign whose code matches the trimmed input,
   ignoring letter case.
2. A second `.find()` locates the selected character by ID.
3. If either is missing, the function returns without changing state.
4. Otherwise, `setCampaigns` maps over the campaign list and returns a copy of
   the matching campaign with its `character` field set to the selected
   character's name.

Other campaign objects are returned unchanged. The state change updates the
table and causes the campaigns effect to persist it. This mock currently gives
no visible error when the code or character does not match.

#### `handleLeave(campaignId)`

The Leave button passes its row's ID into this function. `flatMap` processes
each campaign:

- A nonmatching campaign returns as `[campaign]`, preserving it.
- If the matching campaign has `otherPlayers > 0`, it returns a copied
  campaign with an empty character assignment.
- Otherwise it returns `[]`, removing that campaign.

The resulting array replaces campaign state. In the current single-user mock,
new campaigns set `otherPlayers` to zero, so Leave removes the selected row and
code.

### Login and app functions

#### `loadMockUser()`

This app-level helper reads the `dndbuddy.user` item and parses it as JSON. If
the key is absent it returns `null`; if reading or parsing fails it logs the
error and also returns `null`. The app uses this function to initialize user
state, so a mock login survives a refresh.

#### `handleLogin(email)`

This function receives the normalized email from the login page. It creates a
mock user object, saves that object to localStorage, and updates the app's user
state. It returns `true` when the save succeeds or `false` when it catches a
storage error. The return value lets the login page decide whether to navigate
or show an error.

It does not validate credentials against a server. The password is neither
stored nor checked by this mock.

#### `handleLogout()`

This removes the mock user key and sets the React user state to `null`. The
header then stops showing the logged-in email and stops rendering the
conditional Log out link.

#### `handleSubmit(event)` in `Login`

The login form submit handler:

1. Prevents a full-page form submission.
2. Clears an old error.
3. Trims and lowercases the email.
4. Checks that email and password values were provided.
5. Calls the `onLogin` prop supplied by `App`.
6. If saving fails, it shows an error and stays on the login page.
7. If saving succeeds, `useNavigate()` moves the browser to `/dashboard`.

The email is a prop callback boundary: Login collects input, while App owns
the session state and persistence. Both Login and Create buttons currently
submit this same mock handler.

### Character-sheet calculations and actions

#### `getAbilityModifier(score)`

This calculation converts an ability score into its modifier:

```jsx
Math.floor((score - 10) / 2)
```

For example, a score of 15 gives `Math.floor(2.5)`, which is `2`. `Math.floor`
rounds downward, including for negative numbers.

#### `getProficiency(proficiency, lvl)`

The `proficiency` parameter is the 0/1 flag from the selected skill or saving
throw. If it is zero or less, the function returns zero. Otherwise, the level
checks choose the proficiency bonus: +2 for levels 1-4, +3 for 5-8, +4 for
9-12, +5 for 13-16, and +6 above that.

This separates the proficiency flag from the amount of the bonus. The flag
answers "is this character proficient?" and `lvl` determines "how large is
the proficiency bonus?"

#### `rollD20(ability, score, setRecentRolls, proficiency, lvl)`

This reusable function is used by ability checks, saving throws, and skill
checks:

1. It calculates the ability modifier from `score`.
2. It generates an integer from 1 through 20. `Math.random()` is between 0
   and 1; multiplying by 20, flooring, and adding 1 gives that range.
3. It gets the level-based proficiency bonus.
4. It calculates the total, adding proficiency only if the flag is positive.
5. It creates a roll object with a unique ID, label, die, modifiers, and total.
6. It prepends that object to the latest roll list and slices the list to its
   first five entries.

The setter is passed as a parameter so the helper can update the component's
state without being declared inside the component. The function returns the
total too, although the current click handlers use the state update to show
the result.

#### `mockAttack(...)`, `mockSpell(...)`, and `mockBonus(...)`

These three functions follow the same simple mock-roll pattern: generate a
d20, calculate an ability modifier, calculate a total without proficiency,
and add a consistently shaped entry to recent actions. The attack mock uses
Strength; the spell and bonus-action mocks use Intelligence. These are
placeholders rather than complete game rules.

They repeat some logic from `rollD20` because their behavior is intentionally
simplified. Later, they can be replaced or adapted when weapon, spell, or
bonus-action rules are implemented.

#### `healthChange(hp, setRecentRolls)`

Despite its name, this function does not change the HP state. The input's own
`onChange` calls `setHp(...)` immediately. `healthChange` is called on blur and
only adds an `{ type: 'health', hp }` record to the recent-actions list.

This lets the interface display a health update differently from a d20 roll.
Because it runs on blur, focusing and leaving the field without changing it
can still add an entry.

#### `CharacterSheetRoute()` and `Charactersheet({ characterId })`

`CharacterSheetRoute` reads `characterId` from the URL with `useParams()` and
passes it to the sheet component. Its `key={characterId}` tells React to reset
the inner component state if the route changes to a different character.

`Charactersheet` uses a lazy `useState` initializer to load the matching
character from `localStorage` once. It initializes each editable state value
from that record, with defaults as a fallback. This is how two IDs can show
different HP, scores, proficiencies, and portraits.

#### Character-sheet save effect

The sheet's `useEffect` runs when the selected character or any persisted sheet
value changes. It:

1. Skips saving if no matching character was loaded.
2. Reloads the current full character list.
3. Maps over the list and returns unrelated characters unchanged.
4. Replaces the matching character with a copy containing the current HP,
   level, abilities, proficiencies, and portrait.
5. Calls `saveCharacters` with the whole updated list.

The object spread (`...character`) preserves dashboard fields such as name and
class while the following fields replace only the sheet values.

#### `startEditing()`, `saveEdits()`, and `cancelEditing()`

- `startEditing()` creates a draft copy from the saved level, abilities,
  proficiencies, and portrait, then enables edit mode. Nested objects are
  copied too, so editing their properties does not mutate saved objects.
- `saveEdits()` first checks that a draft exists. It copies the draft values
  into the individual saved state variables, disables edit mode, and clears
  the draft. Those state changes trigger the sheet save effect.
- `cancelEditing()` disables edit mode and clears the draft without copying it
  into saved state. Therefore the changed input values are discarded.

#### `handlePortraitChange(event)`

The portrait upload handler gets the first selected file from the file input.
It returns immediately if the selection is empty, reports an error if the file
is not an image or is above 5 MB, then asks `FileReader` to read it as a data
URL.

File reading is asynchronous. `reader.onload` runs after reading completes;
the handler checks that the result is a string, then updates only
`draft.portrait` using the latest draft value. This immediately changes the
preview. `reader.onerror` reports a read failure. Save later copies the
preview value into saved portrait state.

### `NotFound()`

This small app component renders a fallback page when no route matches. Its
`NavLink` gives the user a way back to the home route.

### Reading note for template strings

JavaScript only interpolates `${value}` inside backticks:

```jsx
`Could not load ${key}`
```

Using single or double quotes keeps `${key}` as literal text. The current
dashboard and character-sheet error messages that contain `${key}` or
`${characterId}` use ordinary quotes, so those particular messages will not
substitute the value until changed to backticks.

## Source files

- `src/app.jsx`: routing and mock login session.
- `src/login/login.jsx`: controlled login form and submit handler.
- `src/dashboard/dashboard.jsx`: character/campaign forms, tables, state, and
  persistence effects.
- `src/charactersheet/charactersheet.jsx`: character loading, editing, rolls,
  portrait upload, HP, and sheet persistence.
- `src/data/characterStorage.js`: character storage and default-record helpers.
