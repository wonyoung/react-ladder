import React from 'react';
import ReactDOM from 'react-dom';
import Ladder from './Ladder';
import _ from 'lodash';

const container = document.getElementById('app');

/*
0   |  |  |  |
1   |--|  |  |
2   |  |--|  |
3   |  |  |--|
4   |  |--|  |
5   |--|  |  |
6   |  |--|  |
7   |  |  |--|
8   |  |  |  |
9   |  |  |  |
10  |--|  |  |
 */

const ladderMap = [
  [1, 5, 10],
  [2, 4, 6],
  [3, 7],
  []
];

function ladderSolver(ladderMap, start) {
  const xs = ladderMap.length;
  var solved = [];
  var y = 0;
  var x = start;
  var nextX, nextY;

  var toRight = (x < ladderMap.length - 1) ? _.dropWhile(ladderMap[x], y1 => y1 <= y):[];
  var toLeft = (x > 0) ? _.dropWhile(ladderMap[x-1], y1 => y1 <= y):[];
  while (toRight.length > 0 || toLeft.length > 0) {
    if (toRight.length === 0) {
      nextY = _.head(toLeft);
      nextX = x - 1;
    }
    else if (toLeft.length === 0) {
      nextY = _.head(toRight);
      nextX = x + 1;
    }
    else {
      const rightY = _.head(toRight);
      const leftY = _.head(toLeft);
      if (rightY > leftY) {
        nextY = leftY;
        nextX = x - 1;
      }
      else {
        nextY = rightY;
        nextX = x + 1;
      }
    }

    x = nextX;
    y = nextY;
    solved.push({ y, to: x});

    toRight = (x < ladderMap.length - 1) ? _.dropWhile(ladderMap[x], y1 => y1 <= y):[];
    toLeft = (x > 0) ? _.dropWhile(ladderMap[x-1], y1 => y1 <= y):[];
  }
  return solved;
}

ReactDOM.render(
  <Ladder
    ladders={ladderMap}
    ladderSolver={ladderSolver}
    x={10}
    y={10}
    top={10}
    n={6}
    bottom={10}
    height={300}
    width={300}/>
  , container);
