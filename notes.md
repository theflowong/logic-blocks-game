# In-progress Notes

## Game Design
- [x] Individualize each stage: name, instructions, initial settings

## Interface
- [x] Instructions for stage/game
- [ ] Different color palette for each stage? possibly
- [ ] Key/legend for color types
- [ ] Stage accomplished notification

## Objects/Obstacles
- [x] Reset Stage button
  - [ ] Only have specific number of resets (5? run out => game over)
- [ ] Holes that the player can pass only when you move a block over it
- [x] BlackHoles: infinite holes that make a block disappear
- [x] Finish tiles
  - [x] Player can land on finish tile
  - [x] Brings you to next stage in game

  ## Creatures
  - [x] Goombas: moveable blocks
  - [x] Randos: moving (random) creature blocks
    * Not moving is an option for randomized movement. Keep or delete?
  - [ ] UpDowns: moving (either up/down) blocks that change direction when button is pressed

## Puzzles
- [x] escape the grid/perimeter (or to a finish tile)
  - [ ] locations for finish? randomize, or fixed
- [ ] trap Randos in specific area/zone (by moving Goombas)
  * might be too difficult
- [ ] trap UpDowns in specific area/zone/square (by moving into direction-change toggle squares)
- [ ] push colored Goombas to color zone
- [x] push Goombas into BlackHoles to clear board (similar to above, but Goomba will disappear)
  - [x] track Goomba counts for winning situation
  - [x] make BlackHoles gradually disappear (more transparent) with more Goombas

## Stages & Properties
- [ ] Start Game button? first stage is wonky, things not initialized?
- [x] Escape to Finish
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * ~~NO Randos~~
    * Finish
  - [x] Stage Complete: when player reaches Finish
- [ ] Push Goombas into BlackHoles
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * ~~NO Randos~~
    * ~~NO Finish~~
  - [ ] Stage Complete: when BlackHole reaches specific count
- [ ] Trap Randos
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * Randos
    * ~~NO Finish~~
  - [ ] Stage Complete: when Rando is trapped in specific location range and has an unmoving object (wall or trapped Rando) on all sides

## Styles
- [ ] blocks: rounded corners
- [ ] blocks: padding

## Other ideas
* start with one square, increase size of grid as game progresses
* have different game stages with different tasks
