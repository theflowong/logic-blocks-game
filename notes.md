# In-progress Notes

======

## Meeting Notes: January 19

### To do
- [x] separate javascript files
- [x] change "Goombas" to "blocks"
- [ ] make mobile friendly
- [ ] stage 3: trap blocks (or experiment with trapping to area)
- [ ] finish stage: add alert to canvas (instead of window.alert)
- [ ] scores? (experiment with moves / time)
======


## Game Design
- [x] Individualize each stage: name, instructions, initial settings

## Interface & Styles
- [x] Instructions for stage/game
- [ ] Vertically align game to be centered
- [ ] Make accessible for mobile: swiping (Javascript library)
- [ ] Different color palette for each stage? possibly
- [ ] Key/legend for color types
- [ ] Stage accomplished notification
  - [ ] Animate stage accomplished and moving on to next stage?
- [ ] blocks: rounded corners (must modify in Javascript)
- [ ] blocks: padding

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
  - [x] different locations for finish? **randomize**, or fixed
- [ ] trap Randos in specific area/zone (by moving Goombas)
  * might be too difficult
  * specific area/zone vs. just trapping them so they can't move
- [ ] trap UpDowns in specific area/zone/square (by moving into direction-change toggle squares)
- [ ] push colored Goombas to color zone
- [x] push Goombas into BlackHoles to clear board (similar to above, but Goomba will disappear)
  - [x] track Goomba counts for winning situation
  - [x] make BlackHoles gradually disappear (more transparent) with more Goombas

## Stages & Properties
- [ ] Start Game button?
- [x] Escape to Finish
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * ~~NO Randos~~
    * Finish
  - [x] Stage Complete: when player reaches Finish
- [x] Push Goombas into BlackHoles
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * ~~NO Randos~~
    * ~~NO Finish~~
  - [x] Stage Complete: when BlackHole reaches specific count
- [ ] Trap Randos
  - [x] Arguments
    * Player: location?
    * Wall
    * BlackHole
    * Randos
    * ~~NO Finish~~
  - [ ] Stage Complete: when Rando is trapped in specific location range and has an unmoving object (wall or trapped Rando) on all sides
    - [ ] if Rando.isTrapped, then make Rando disappear
    - [ ] animate disappearance of Rando

## Other ideas
* start with one square, increase size of grid as game progresses
* have different game stages with different tasks
