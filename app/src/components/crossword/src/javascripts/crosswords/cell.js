import React, { Component } from 'react';
import { gridSize } from './helpers';
import { constants } from './constants';
import { classNames } from './classNames';

class Cell extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.value !== nextProps.value
            || this.props.isFocussed !== nextProps.isFocussed
            || this.props.isHighlighted !== nextProps.isHighlighted
            || this.props.isError !== nextProps.isError
            || this.props.isCorrect !== nextProps.isCorrect
    );
  }

  onClick(event) {
    event.preventDefault();
    this.props.handleSelect(this.props.x, this.props.y);
  }

  render() {
    const top = gridSize(this.props.y);
    const left = gridSize(this.props.x);

    let cellNumber = null;
    if (this.props.number !== undefined) {
      cellNumber = (
        <text
          x={left + 1}
          y={top + constants.numberSize}
          key="number"
          className="crossword__cell-number"
        >
          {this.props.number}
        </text>
      );
    }
    
    let cellValue = null;
    if (this.props.value !== undefined) {
      cellValue = (
        <text
          x={left + constants.cellSize * 0.5}
          y={top + constants.cellSize * 0.675}
          key="entry"
          className={classNames({
            'crossword__cell-text': true,
            'crossword__cell-text--focussed': this.props.isFocussed,
            'crossword__cell-text--error': this.props.isError,
          })}
          textAnchor="middle"
        >
          {this.props.value}
        </text>
      );
    }
    
    return (
      <g onClick={this.onClick.bind(this)}>
        <rect
          x={left}
          y={top}
          width={constants.cellSize}
          height={constants.cellSize}
          className={classNames({
            crossword__cell: true,
            'crossword__cell--correct-p1': this.props.isCorrect && this.props.answeredBy == 1,
            'crossword__cell--correct-p2': this.props.isCorrect && this.props.answeredBy == 2,
            'crossword__cell--correct-p3': this.props.isCorrect && this.props.answeredBy == 3,
            'crossword__cell--correct-p4': this.props.isCorrect && this.props.answeredBy == 4,
            //highlifeColor: this.props.isCorrect,
            // 'crossword__cell--focussed': this.props.isFocussed,
            'crossword__cell--highlighted': this.props.isHighlighted && !this.props.isCorrect,
            //'crossword__cell--correct-and-highlighted': this.props.isHighlighted && this.props.isCorrect,
          })}
        />
        {cellNumber}
        {cellValue}
      </g>
    );
  }
}

export default Cell;
