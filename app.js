import React from 'react';
import ReactDOM from 'react-dom';
import Ladder from './Ladder';
import _ from 'lodash';

const container = document.getElementById('app');

function ladderGenerator(n) {
  const shuffledSteps = _.shuffle(_.flatMap(_.range(0, n-1), line =>
    _.map(_.range(1, 11), step => [line, step])));

  var ladder = _.map(_.fill(Array(n), 0), () => []);

  _.take(shuffledSteps, 3*n).forEach(a => {
    const line = a[0];
    const step = a[1];
    if ((line == 0 || !_.includes(ladder[line - 1], step))
       && (line >= n-2 || !_.includes(ladder[line + 1], step))) {
      ladder[line].push(step);
    }
  });
  return _.map(ladder, line => _.sortBy(line));
}

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

var ladder = ladderGenerator(4);

ReactDOM.render(
  <Ladder
    ladders={ladder}
    ladderSolver={ladderSolver}
    height={500}
    width={400}/>
  , container);
