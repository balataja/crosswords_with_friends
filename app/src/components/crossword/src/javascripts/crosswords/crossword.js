import '../../stylesheets/main.scss';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import fastdom from 'fastdom';
import $ from '../lib/$';
import mediator from '../lib/mediator';
import { isBreakpoint } from '../lib/detect';
import { scrollTo } from '../lib/scroller';
import { addEventListener } from '../lib/events';
import { AnagramHelper } from './anagram-helper/main';
import debounce from 'lodash/debounce';
import zip from 'lodash/zip';
import { Clues } from './clues';
import { Controls } from './controls';
import { HiddenInput } from './hidden-input';
import { Grid } from './grid';
import {
  buildClueMap,
  buildGrid,
  buildNewGrid,
  otherDirection,
  entryHasCell,
  cluesFor,
  mapGrid,
  getClearableCellsForClue,
  getLastCellInClue,
  getPreviousClueInGroup,
  isFirstCellInClue,
  getNextClueInGroup,
  isLastCellInClue,
  gridSize,
  checkClueHasBeenAnswered,
  buildSeparatorMap,
  cellsForEntry,
} from './helpers';
import { keycodes } from './keycodes';
//import { saveGridState, loadGridState } from './persistence';
import { getGridState, updateIfCurrentGridState } from '../../../../../redux/modules/gridState';
import { classNames } from './classNames';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {NotificationContainer, NotificationManager} from 'react-notifications';
//import '../../../../../../node_modules/react-notifications/lib/notifications.css';
import '../../stylesheets/notifications.scss';

const socket = io('http://localhost:3000');

class Crossword extends Component {
  static propTypes = {
    getGridState: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const dimensions = this.props.data.dimensions;
    this.columns = dimensions.cols;
    this.rows = dimensions.rows;
    this.clueMap = buildClueMap(this.props.data.entries);
    
    const defaultGridState = buildNewGrid(
      dimensions.rows,
      dimensions.cols,
      this.props.data.entries
    );
      // ToDo: need to get preserve ObjectId("gridstate") somehow.
    this.state = {
      gridId: this.props.gridId,//gridState._id,
      grid: defaultGridState,
      cellInFocus: null,
      directionOfEntry: null,
      showAnagramHelper: false,
      playerNumber: this.props.playerNumber,
    };

    //socket.on('connect', function() {
      console.log('client connecting to game..' + this.props.gameId)
      socket.emit('room', this.props.gameId)
    //}.bind(this));
  }

  async componentDidMount() {
    var grid = await this.props.getGridState(this.props.gridId);
    this.setState({
      grid: grid.entries
    });

    // Update all other users upon correct clue
    socket.on('update_other_users', async function (msg) { 
      console.log('from crossword component: ' + msg); 
      var grid = await this.props.getGridState(this.props.gridId);
      this.setState({
        grid: grid.entries
      });
    }.bind(this));

    socket.on('player_disconnected', function (msg) {
      console.log( 'disconnected from server' );
      NotificationManager.error('Player Disconnected', msg);
      //window.setTimeout( 'app.connect()', 2000 );
    });

    socket.emit('player_joined_game', { roomNumber: this.props.gameId, playerNumber: this.state.playerNumber });
    socket.on('other_player_joined_game', function(msg) {
      console.log('player joined game: ' + msg);
      NotificationManager.success('Player Joined', msg);
    }.bind(this));

    const $stickyClueWrapper = $(findDOMNode(this.stickyClueWrapper));
    const $game = $(findDOMNode(this.game));

    mediator.on(
      'window:resize',
      debounce(this.setGridHeight.bind(this), 200),
    );
    mediator.on(
      'window:orientationchange',
      debounce(this.setGridHeight.bind(this), 200),
    );
    this.setGridHeight();

    addEventListener(window, 'scroll', () => {
      const gameOffset = $game.offset();
      const stickyClueWrapperOffset = $stickyClueWrapper.offset();
      const scrollY = window.scrollY;

      const scrollYPastGame = scrollY - gameOffset.top;

      if (scrollYPastGame >= 0) {
        const gameOffsetBottom = gameOffset.top + gameOffset.height;

        if (
          scrollY
                    > gameOffsetBottom - stickyClueWrapperOffset.height
        ) {
          $stickyClueWrapper.css({ top: 'auto', bottom: 0 });
        } else {
          $stickyClueWrapper.css({
            top: scrollYPastGame,
            bottom: '',
          });
        }
      } else {
        $stickyClueWrapper.css({ top: '', bottom: '' });
      }
    });

    const entryId = window.location.hash.replace('#', '');
    this.focusFirstCellInClueById(entryId);
  }

  componentWillUnmount() {
    socket.emit('player_left_game', { roomNumber: this.props.gameId, playerNumber: this.state.playerNumber });
    socket.off('update_other_users');
    socket.off('player_disconnected');
    socket.close();
  }

  componentDidUpdate(prevProps, prevState) {
    // return focus to active cell after exiting anagram helper
    if (
      !this.state.showAnagramHelper
            && this.state.showAnagramHelper !== prevState.showAnagramHelper
    ) {
      this.focusCurrentCell();
    }
  }

  onKeyDown(event) {
    const cell = this.state.cellInFocus;

    if (!event.metaKey && !event.ctrlKey && !event.altKey) {
      if (
        event.keyCode === keycodes.backspace
                || event.keyCode === keycodes.delete
      ) {
        event.preventDefault();
        if (cell) {
          if (this.cellIsEmpty(cell.x, cell.y)) {
            this.focusPrevious();
          } else {
            this.setCellValue(cell.x, cell.y, '');
            //this.saveGrid();
          }
        }
      } else if (event.keyCode === keycodes.left) {
        event.preventDefault();
        this.moveFocus(-1, 0);
      } else if (event.keyCode === keycodes.up) {
        event.preventDefault();
        this.moveFocus(0, -1);
      } else if (event.keyCode === keycodes.right) {
        event.preventDefault();
        this.moveFocus(1, 0);
      } else if (event.keyCode === keycodes.down) {
        event.preventDefault();
        this.moveFocus(0, 1);
      }
    }
  }

  // called when cell is selected (by click or programtically focussed)
  onSelect(x, y) {
    const cellInFocus = this.state.cellInFocus;
    const clue = cluesFor(this.clueMap, x, y);
    const focussedClue = this.clueInFocus();
    let newDirection;
    
    const isInsideFocussedClue = () => (focussedClue ? entryHasCell(focussedClue, x, y) : false);

    if (
      cellInFocus
            && cellInFocus.x === x
            && cellInFocus.y === y
            && this.state.directionOfEntry
    ) {
      /** User has clicked again on the highlighted cell, meaning we ought to swap direction */
      newDirection = otherDirection(this.state.directionOfEntry);

      if (clue[newDirection]) {
        this.focusClue(x, y, newDirection);
      }
    } else if (isInsideFocussedClue() && this.state.directionOfEntry) {
      /**
             * If we've clicked inside the currently highlighted clue, then we ought to just shift the cursor
             * to the new cell, not change direction or anything funny.
             */

      this.focusClue(x, y, this.state.directionOfEntry);
    } else {
      this.state.cellInFocus = {
        x,
        y,
      };

      const isStartOfClue = sourceClue => !!sourceClue
                && sourceClue.position.x === x
                && sourceClue.position.y === y;

      /**
             * If the user clicks on the start of a down clue midway through an across clue, we should
             * prefer to highlight the down clue.
             */
      if (!isStartOfClue(clue.across) && isStartOfClue(clue.down)) {
        newDirection = 'down';
      } else if (clue.across) {
        /** Across is the default focus otherwise */
        newDirection = 'across';
      } else {
        newDirection = 'down';
      }
      this.focusClue(x, y, newDirection);
    }
  }

  onCheat() {
    this.allHighlightedClues().forEach(clue => this.cheat(clue));
    this.saveGrid();
    //socket.emit('checking_clue', 'checking...');
  }

  onCheck() {
    // 'Check this' checks single and grouped clues
    this.allHighlightedClues().forEach(clue => this.check(clue));
    this.saveGrid();
    //socket.emit('checking_clue', 'checking...');
  }

  onSolution() {
    this.props.data.entries.forEach(clue => this.cheat(clue));
    //this.saveGrid();
  }

  onCheckAll() {
    this.props.data.entries.forEach(clue => this.check(clue));
    //this.saveGrid();
  }

  onClearAll() {
    this.setState({
      grid: mapGrid(this.state.grid, (cell, gridX, gridY) => {
        const previousValue = cell.value;
        cell.value = '';
        cell.answeredBy = 0;
        this.props.onMove({
          x: gridX, y: gridY, value: '', previousValue,
        });
        return cell;
      }),
    });

    //this.saveGrid();
  }

  onClearSingle() {
    const clueInFocus = this.clueInFocus();

    if (clueInFocus) {
      // Merge arrays of cells from all highlighted clues
      // const cellsInFocus = _.flatten(_.map(this.allHighlightedClues(), helpers.cellsForEntry, this));
      const cellsInFocus = getClearableCellsForClue(
        this.state.grid,
        this.clueMap,
        this.props.data.entries,
        clueInFocus,
      );

      this.setState({
        grid: mapGrid(this.state.grid, (cell, gridX, gridY) => {
          if (
            cellsInFocus.some(c => c.x === gridX && c.y === gridY)
          ) {
            const previousValue = cell.value;
            cell.value = '';
            cell.answeredBy = 0;
            this.props.onMove({
              x: gridX, y: gridY, value: '', previousValue,
            });
          }
          return cell;
        }),
      });

      //this.saveGrid();
    }
  }

  onToggleAnagramHelper() {
    // only show anagram helper if a clue is active
    if (!this.state.showAnagramHelper) {
      if (this.clueInFocus()) {
        this.setState({
          showAnagramHelper: true,
        });
      }
    } else {
      this.setState({
        showAnagramHelper: false,
      });
    }
  }

  onClickHiddenInput(event) {
    const focussed = this.state.cellInFocus;

    if (focussed) {
      this.onSelect(focussed.x, focussed.y);
    }

    /* We need to handle touch seperately as touching an input on iPhone does not fire the
         click event - listen for a touchStart and preventDefault to avoid calling onSelect twice on
         devices that fire click AND touch events. The click event doesn't fire only when the input is already focused */
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
  }

  setGridHeight() {
    if (!this.$gridWrapper) {
      this.$gridWrapper = $(findDOMNode(this.gridWrapper));
    }

    if (
      isBreakpoint({
        max: 'tablet',
      })
    ) {
      fastdom.read(() => {
        // Our grid is a square, set the height of the grid wrapper
        // to the width of the grid wrapper
        fastdom.write(() => {
          this.$gridWrapper.css(
            'height',
            `${this.$gridWrapper.offset().width}px`,
          );
        });
        this.gridHeightIsSet = true;
      });
    } else if (this.gridHeightIsSet) {
      // Remove inline style if tablet and wider
      this.$gridWrapper.attr('style', '');
    }
  }

  setCellValue(x, y, value, triggerOnMoveCallback = true) {
    this.setState({
      grid: mapGrid(this.state.grid, (cell, gridX, gridY) => {
        if (gridX === x && gridY === y) {
          const previousValue = cell.value;
          cell.value = value;
          cell.isError = false;
          cell.answeredBy = this.state.playerNumber;
          if (triggerOnMoveCallback) {
            this.props.onMove({
              x, y, value, previousValue,
            });
          }
        }

        return cell;
      }),
    });
  }

  getCellValue(x, y) {
    return this.state.grid[x][y].value;
  }

  setReturnPosition(position) {
    this.returnPosition = position;
  }

  updateGrid(gridState) {
    this.setState({
      grid: buildGrid(
        this.rows,
        this.columns,
        this.props.data.entries,
        gridState,
      ),
    });
  }

  insertCharacter(character) {
    const characterUppercase = character.toUpperCase();
    const cell = this.state.cellInFocus;
    if (
      /[A-Za-zÀ-ÿ0-9]/.test(characterUppercase)
            && characterUppercase.length === 1
            && cell
    ) {
      this.setCellValue(cell.x, cell.y, characterUppercase);
      //this.saveGrid();
      this.focusNext();
    }
  }

  cellIsEmpty(x, y) {
    return !this.getCellValue(x, y);
  }

  goToReturnPosition() {
    if (
      isBreakpoint({
        max: 'mobile',
      })
    ) {
      if (this.returnPosition) {
        scrollTo(this.returnPosition, 250, 'easeOutQuad');
      }
      this.returnPosition = null;
    }
  }

  indexOfClueInFocus() {
    return this.props.data.entries.indexOf(this.clueInFocus());
  }

  focusPreviousClue() {
    const i = this.indexOfClueInFocus();
    const entries = this.props.data.entries;

    if (i !== -1) {
      const newClue = entries[i === 0 ? entries.length - 1 : i - 1];
      this.focusClue(
        newClue.position.x,
        newClue.position.y,
        newClue.direction,
      );
    }
  }

  focusNextClue() {
    const i = this.indexOfClueInFocus();
    const entries = this.props.data.entries;

    if (i !== -1) {
      const newClue = entries[i === entries.length - 1 ? 0 : i + 1];
      this.focusClue(
        newClue.position.x,
        newClue.position.y,
        newClue.direction,
      );
    }
  }

  moveFocus(deltaX, deltaY) {
    const cell = this.state.cellInFocus;

    if (!cell) {
      return;
    }

    const x = cell.x + deltaX;
    const y = cell.y + deltaY;
    let direction = this.state.directionOfEntry;

    if (
      this.state.grid[x]
            && this.state.grid[x][y]
            && this.state.grid[x][y].isEditable
    ) {
      if (deltaY !== 0) {
        if (direction !== 'down') {

        }
        direction = 'down';
      } else if (deltaX !== 0) {
        if (direction !== 'across') {
          
        }
        direction = 'across';
      }
      this.focusClue(x, y, direction);
    }
  }

  isAcross() {
    return this.state.directionOfEntry === 'across';
  }

  focusPrevious() {
    const cell = this.state.cellInFocus;
    const clue = this.clueInFocus();

    if (cell && clue) {
      if (isFirstCellInClue(cell, clue)) {
        const newClue = getPreviousClueInGroup(
          this.props.data.entries,
          clue,
        );
        if (newClue) {
          const newCell = getLastCellInClue(newClue);
          this.focusClue(newCell.x, newCell.y, newClue.direction);
        }
      } else if (this.isAcross()) {
        // ToDo: skip cells that are correct --> should work
        const nextCell = this.state.grid[cell.x - 1][cell.y];
        if (nextCell.isCorrect) {
          let x = cell.x - 1;
          let y = cell.y;
          this.setState({
            grid: this.state.grid,
            cellInFocus: {
              x,
              y,
            },
            directionOfEntry: 'across',
          }, this.focusPrevious);
        } else {
          this.moveFocus(-1, 0);
        }
      } else {
        const nextCell = this.state.grid[cell.x][cell.y - 1];
        if (nextCell.isCorrect) {
          let x = cell.x;
          let y = cell.y - 1;
          this.setState({
            grid: this.state.grid,
            cellInFocus: {
              x,
              y,
            },
            directionOfEntry: 'down',
          }, this.focusPrevious);
        } else {
          this.moveFocus(0, -1);
        }
      }
    }
  }

  focusNext() {
    const cell = this.state.cellInFocus;
    const clue = this.clueInFocus();

    if (cell && clue) {
      if (isLastCellInClue(cell, clue)) {
        this.check(clue);
        const newClue = getNextClueInGroup(
          this.props.data.entries,
          clue,
        );
        if (newClue) {
          // const nextCell = this.state.grid[newClue.position.x][newClue.position.y];
          // if (nextCell.isCorrect) {
          //   let x = newClue.position.x;
          //   let y = newClue.position.y;
          //   this.setState({
          //     grid: this.state.grid,
          //     cellInFocus: {
          //       x,
          //       y,
          //     },
          //     directionOfEntry: newClue.direction,
          //   }, this.focusNext);
          // } else {
            this.focusClue(
              newClue.position.x,
              newClue.position.y,
              newClue.direction,
            );
          //}
        }
      } else if (this.isAcross()) {
        // ToDo: skip cells that are correct --> should work
        const nextCell = this.state.grid[cell.x + 1][cell.y];
        if (nextCell.isCorrect) {
          let x = cell.x + 1;
          let y = cell.y;
          this.setState({
            grid: this.state.grid,
            cellInFocus: {
              x,
              y,
            },
            directionOfEntry: 'across',
          }, this.focusNext);
        } else {
          this.moveFocus(1, 0);
        }
      } else {
        const nextCell = this.state.grid[cell.x][cell.y + 1];
        if (nextCell.isCorrect) {
          let x = cell.x;
          let y = cell.y + 1;
          this.setState({
            grid: this.state.grid,
            cellInFocus: {
              x,
              y,
            },
            directionOfEntry: 'down',
          }, this.focusNext);
        } else {
          this.moveFocus(0, 1);
        }
      }
    }
  }

  asPercentage(x, y) {
    const width = gridSize(this.columns);
    const height = gridSize(this.rows);

    return {
      x: (100 * x) / width,
      y: (100 * y) / height,
    };
  }

  focusHiddenInput(x, y) {
    const wrapper = findDOMNode(this.hiddenInputComponent.wrapper);
    const left = gridSize(x);
    const top = gridSize(y);
    const position = this.asPercentage(left, top);

    /** This has to be done before focus to move viewport accordingly */
    wrapper.style.left = `${position.x}%`;
    wrapper.style.top = `${position.y}%`;

    const hiddenInputNode = findDOMNode(this.hiddenInputComponent.input);

    if (document.activeElement !== hiddenInputNode) {
      hiddenInputNode.focus();
    }
  }

  // Focus corresponding clue for a given cell
  focusClue(x, y, direction) {
    const clues = cluesFor(this.clueMap, x, y);
    const clue = clues[direction];

    if (clues && clue) {
      this.focusHiddenInput(x, y);

      // const cell = this.state.grid[x][y];
      // if (cell.isCorrect) {
      //   this.setState({
      //     grid: this.state.grid,
      //     cellInFocus: {
      //       x,
      //       y,
      //     },
      //     directionOfEntry: direction,
      //   }, this.focusNext);
      // } else {
        this.setState({
          grid: this.state.grid,
          cellInFocus: {
            x,
            y,
          },
          directionOfEntry: direction,
        });
      //}

      // Side effect
      window.history.replaceState(
        undefined,
        document.title,
        `#${clue.id}`,
      );

      const cell = this.state.grid[x][y];
      if (cell.isCorrect) {
        this.focusNext();
      }
    }
  }

  // Focus first cell in given clue
  focusFirstCellInClue(entry) {
    this.focusClue(entry.position.x, entry.position.y, entry.direction);
  }

  focusFirstCellInClueById(clueId) {
    const newEntry = this.props.data.entries.find(val => val.id === clueId);
    if (newEntry) {
      this.focusFirstCellInClue(newEntry);
    }
  }

  focusCurrentCell() {
    if (this.state.cellInFocus) {
      this.focusHiddenInput(
        this.state.cellInFocus.x,
        this.state.cellInFocus.y,
      );
    }
  }

  clueInFocus() {
    if (this.state.cellInFocus) {
      const cluesForCell = cluesFor(
        this.clueMap,
        this.state.cellInFocus.x,
        this.state.cellInFocus.y,
      );

      if (this.state.directionOfEntry) {
        return cluesForCell[this.state.directionOfEntry];
      }
    }
    return null;
  }

  allHighlightedClues() {
    return this.props.data.entries.filter(clue => this.clueIsInFocusGroup(clue));
  }

  clueIsInFocusGroup(clue) {
    if (this.state.cellInFocus) {
      const cluesForCell = cluesFor(
        this.clueMap,
        this.state.cellInFocus.x,
        this.state.cellInFocus.y,
      );

      if (
        this.state.directionOfEntry
                && cluesForCell[this.state.directionOfEntry]
      ) {
        return cluesForCell[this.state.directionOfEntry].group.includes(
          clue.id,
        );
      }
    }
    return false;
  }

  cluesData() {
    return this.props.data.entries.map((entry) => {
      const hasAnswered = checkClueHasBeenAnswered(
        this.state.grid,
        entry,
      );
      return {
        entry,
        hasAnswered,
        isSelected: this.clueIsInFocusGroup(entry),
      };
    });
  }

  cheat(entry) {
    const cells = cellsForEntry(entry);

    if (entry.solution) {
      this.setState({
        grid: mapGrid(this.state.grid, (cell, x, y) => {
          if (cells.some(c => c.x === x && c.y === y)) {
            const n = entry.direction === 'across'
              ? x - entry.position.x
              : y - entry.position.y;
            const previousValue = cell.value;
            cell.value = entry.solution[n];
            this.props.onMove({
              x, y, value: cell.value, previousValue,
            });
          }

          return cell;
        }),
      });
    }
  }

  check(entry) {
    const cells = cellsForEntry(entry);

    if (entry.solution) {
      let badCells = zip(cells, entry.solution.split(''))
        .filter((cellAndSolution) => {
          const coords = cellAndSolution[0];
          const cell = this.state.grid[coords.x][coords.y];
          const solution = cellAndSolution[1];
          return (
            /^.$/.test(cell.value) && cell.value !== solution
          );
        })
        .map(cellAndSolution => cellAndSolution[0]);
      
      if (badCells.length === 0) {
        console.log('no bad cells!')
        this.setState({
          grid: mapGrid(this.state.grid, (cell, gridX, gridY) => {
            if (
              cells.some(c => c.x === gridX && c.y === gridY)
            ) {
              const previousValue = cell.isCorrect;
              cell.isCorrect = true;
              this.props.onMove({
                x: gridX, y: gridY, isCorrect: true, previousValue,
              });
            }
  
            return cell;
          }),
        });

        this.saveGrid();
        socket.emit('clue_answered', {roomNumber: this.props.gameId, playerNumber: this.state.playerNumber});
      } else {      
        this.setState({
          grid: mapGrid(this.state.grid, (cell, gridX, gridY) => {
            if (
              badCells.some(bad => bad.x === gridX && bad.y === gridY)
              && cell.answeredBy === this.state.playerNumber
            ) {
              const previousValue = cell.value;
              cell.value = '';
              cell.answeredBy = 0;
              this.props.onMove({
                x: gridX, y: gridY, value: '', previousValue,
              });
            }

            return cell;
          }),
        });
      }
    }
  }

  hiddenInputValue() {
    const cell = this.state.cellInFocus;

    let currentValue;

    if (cell) {
      currentValue = this.state.grid[cell.x][cell.y].value;
    }

    return currentValue || '';
  }

  hasSolutions() {
    return 'solution' in this.props.data.entries[0];
  }

  isHighlighted(x, y) {
    const focused = this.clueInFocus();
    return focused
      ? focused.group.some((id) => {
        const entry = this.props.data.entries.find(e => e.id === id);
        return entryHasCell(entry, x, y);
      })
      : false;
  }

  async saveGrid() {
    await this.props.updateIfCurrentGridState({id:this.state.gridId, grid:this.state.grid});
  }

  render() {
    const focused = this.clueInFocus();

    const anagramHelper = this.state.showAnagramHelper && (
    <AnagramHelper
      key={focused.id}
      crossword={this}
      focussedEntry={focused}
      entries={this.props.data.entries}
      grid={this.state.grid}
      close={this.onToggleAnagramHelper}
    />
    );

    const gridProps = {
      rows: this.rows,
      columns: this.columns,
      cells: this.state.grid,
      separators: buildSeparatorMap(this.props.data.entries),
      crossword: this,
      focussedCell: this.state.cellInFocus,
      ref: (grid) => {
        this.grid = grid;
      },
    };
    
    return (
      <div
        className={`crossword__container crossword__container--${
          this.props.data.crosswordType
        } crossword__container--react`}
        data-link-name="Crosswords"
      >
        <div
          className="crossword__container__game"
          //style={{width:"417px", height:"417px"}}
          ref={(game) => {
            this.game = game;
          }}
        >
          <div
            className="crossword__sticky-clue-wrapper"
            ref={(stickyClueWrapper) => {
              this.stickyClueWrapper = stickyClueWrapper;
            }}
          >
            <div
              className={classNames({
                'crossword__sticky-clue': true,
                'is-hidden': !focused,
              })}
            >
              {focused && (
              <div className="crossword__sticky-clue__inner">
                <div className="crossword__sticky-clue__inner__inner">
                  <strong>
                    {focused.number}
                    {' '}
                    <span className="crossword__sticky-clue__direction">
                      {focused.direction}
                    </span>
                  </strong>
                  {' '}
                  {focused.clue}
                </div>
              </div>
              )}
            </div>
          </div>
          <div
            className="crossword__container__grid-wrapper"
            ref={(gridWrapper) => {
              this.gridWrapper = gridWrapper;
            }}
          >
            {Grid(gridProps)}
            <HiddenInput
              crossword={this}
              value={this.hiddenInputValue()}
              ref={(hiddenInputComponent) => {
                this.hiddenInputComponent = hiddenInputComponent;
              }}
            />
            {anagramHelper}
          </div>
        </div>
        <Controls
          hasSolutions={this.hasSolutions()}
          clueInFocus={focused}
          crossword={this}
        />
        <Clues
          clues={this.cluesData()}
          focussed={focused}
          focusFirstCellInClueById={this.focusFirstCellInClueById.bind(
            this,
          )}
          setReturnPosition={this.setReturnPosition.bind(this)}
        />
        <NotificationContainer/>
      </div>
    );
  }
}

Crossword.defaultProps = {
  onMove: () => {},
  //loadGrid: id => loadGridState(id),
  // saveGriddy: (stuff) => updateIfCurrentGridState(stuff),//saveGridState(id, grid),
  // getGrid: (id) => getGridState(id),
};

// const mapStateToProps = ({ authentication }) => ({
//   errors: authentication.errors[RESET_PASSWORD],
//   message: authentication.messages[RESET_PASSWORD],
//   loading: authentication.loading[RESET_PASSWORD],
// });
//export default Crossword;

export default connect(null, { getGridState, updateIfCurrentGridState })(Crossword);
