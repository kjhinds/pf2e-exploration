Adds an exploration activities tracker for the Pathfinder 2e system to Foundry.

When players assign an active exploration activity via the Party Sheet or their Character sheet, a chat message will display with the chosen activity.
If the activity is one that involves a roll (Avoid Notice, Investigate, Search, Track), the player will be prompted for an appropriate roll. Per Pathfinder 2e default rules, Avoid Notice, Investigate, and Search will be Secret while Track is open rolled. For Investigate, the system rolls a d20, adds the character's proficiency for each Recall Knowledge and Lore skill, then prints a private message to the GM with the totals and a check result compared to their level-based DC.
If the PF2e Exploration Effects module, https://github.com/silvative/pf2e-exploration-effects, is installed, it will also apply the appropriate activity effect.

If the GM hovers their mouse over the Actor tab icon in the sidebar, a popup will display a summary of the entire party's current exploration activities and their roll, if applicable.

The module also includes a macro that both GMs and Players can use.

If a player uses the macro, a dialog will pop up allowing the players to choose from all of the "standard" exploration activities (e.g., Search, Cover Tracks, Guard, etc), plus any extra exploration activities they may have added to their character sheet. Submitting the dialog functions as if the player had assigned the exploration activity via their character sheet, so all the same automation described above executes.

IF a GM users the macro while having a character token selected, the same dialog will pop up for the GM, allowing them to assign the character token's exploration activity. If the GM does not have a character token selected, they will get a dialog showing a summary of the entire party's current exploration activities, rolls, and buttons to clear the activity or request that they choose a new activity/reroll. Clicking the button to request a new activity/reroll will pop up the exploration chooser dialog for the player(s).
