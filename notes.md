# In-progress Notes

## Game Design
- [ ] Individualize each stage: name, instructions, initial settings

## Interface
- [ ] Instructions for stage/game
- [ ] Key/legend for color types
- [ ] Stage accomplished notification

## Creatures
- [x] Goombas: moveable blocks
- [x] Randos: moving (random) creature blocks
  * Not moving is an option for randomized movement. Keep or delete?
- [ ] UpDowns: moving (either up/down) blocks that change direction when button is pressed

## Objects/Obstacles
- [ ] Reset Stage button
  * Only have specific number of resets (5? run out => game over)
- [ ] Holes that the player can pass only when you move a block over it
- [x] BlackHoles: infinite holes that make a block disappear
* Finish tiles
  - [x] Player can land on finish tile
  - [x] Brings you to next stage in game

## Puzzles
- [x] escape the grid/perimeter (or to a finish tile)
  - [ ] locations for finish? randomize, or fixed
- [ ] trap Randos in specific area/zone (by moving Goombas)
  * might be too difficult
- [ ] trap UpDowns in specific area/zone/square (by moving into direction-change toggle squares)
- [ ] push colored Goombas to color zone
- [x] push Goombas into BlackHoles to clear board (similar to above, but Goomba will disappear)
  - [ ] track Goomba counts for winning situation

## Stages & Properties
- [ ] Start Game?
  * Press button
- [x] Escape to Finish
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * ~~NO Randos~~
    * Finish
  * Win: when player reaches Finish
- [ ] Push Goombas into BlackHoles
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * ~~NO Randos~~
    * ~~NO Finish~~
  - [ ] Win: when BlackHole reaches specific count
- [ ] Trap Randos
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * Randos
    * ~~NO Finish~~
  * Win: when Rando is trapped in specific location range and has an unmoving object (wall or trapped Rando) on all sides

## Styles
- [ ] blocks: rounded corners
- [ ] blocks: padding

## Other ideas
* start with one square, increase size of grid as game progresses
* have different game stages with different tasks
