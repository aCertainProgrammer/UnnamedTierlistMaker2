# Unnamed Tierlist Maker 2

## Webpage

Go to https://acertainprogrammer.github.io/UnnamedTierlistMaker2/ and start working!

## Local installation

```
git clone https://github.com/aCertainProgrammer/UnnamedTierlistMaker2.git
cd UnnamedTierlistMaker2
npm ci
npm run dev
```

## Putting champions in the tierlist

1. Drag and drop champions into tiers
2. Start typing to search a champion, then press 1-9 to put the first champion in the list into the corresponding tier

## Filtering roles

1. Press on the role buttons to select filters
2. Use the keybinds: `Shift` + `1` (resulting in `!`) by default to toggle the toplane filter, then `2/3/4/5` for the rest of the roles

## Customisation

### Stop delete from clearing the tierlist

If enabled, stops delete from clearing the tierlist - made for people who press delete without intention, it helps avoid frustrating situations

### Clear search bars on focus

If enabled, clears the search bars on reentry. It allows you to do somethings like this:

1. Type `camille`
2. Press `1` to pick Camille into the first tier
3. Type `irelia`

without having to clear the search bar at any point

### Use legacy search

- `Legacy search` is pure substring matching - if a word contains the exact string of the search query, it will be matched - for example, "ji" will match "JInx".
- `Modern search` uses both substring matching and checks for letter order ("ji" matches "seJuanI") to deliver an experience more similar to league client search

### Append to snapshots on import

If enabled, appends to snapshots when you import them instead of replacing them entirely  

### Looks

These settings change how the program looks, just play around with them for a bit

### Binds

You can customize your binds here, just remember that you need to use `Shift` to trigger them, so something like `Shift` + `1` would actually be `!` in the bind menu (at least for my keyboard)

## The top bar buttons

### Settings cog

Opens the settings menu

### Question mark

Opens the manual

### Image icon

Takes a screenshot of the tierlist

### Reset tierlist

Resets the tierlist to the default state with tiers S to F and no champions in them

### Import/export tierlist

Allows you to save a tierlist as a file and import it later, useful for sharing tierlists with others for quick edits

### Use draft pool template

Sets five tiers for roles top to support, this is a purely a visual thing - the draft pool exports in the next sections work on tiers 1 to 5, without checking their names

### Import draft pool

Allows you to either import a draft pool from file (you export the file with the Export draft pool button), or from https://acertainprogrammer.github.io/UnnamedDraftingTool/ , from the custom data in that program


### Export draft pool

Allows you to either export a draft pool as a file, or to directly put it into https://acertainprogrammer.github.io/UnnamedDraftingTool/ 

Remember to turn on custom data in UnnamedDraftingTool or you won't see the changes!

### Save snapshot

Saves a snapshot of the tierlist for later viewing and usage

### Show snapshots

Opens the snapshot selection, you can name them, screenshot them and delete. 

The export and import works the same as the tierlist one. Click on a snapshot to load it.

Start typing to search, you can search by the snapshot name or by the champions in it

## Other keybinds

- `Shift` + `V` to save a snapshot
- `Shift` + `G` to open the snapshot menu
- `Shift` + `L` to take a screenshot
- `Shift` + `A` to take a screenshot + export tierlist + open draft pool export modal


<hr>
UnnamedTierlistMaker2 isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
UnnamedTierlistMaker2 was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.
