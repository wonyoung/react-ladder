import React, { Component } from 'react';

const PADDING = 50;
const WIDTH = 50;
const V_STEP = 20;

const XPADDING = 20;
const YPADDING = 20;
const LINE_WIDTH = 4;

const lineProp = {
  stroke: "gray",
  strokeWidth: LINE_WIDTH
};

const LadderVLine = (props)=>{

  const x = XPADDING + props.e.XSTEP * props.x;
  const y1 = YPADDING + props.e.YSTEP * props.top;
  const y2 = YPADDING + props.e.YSTEP * props.bottom;
  return (
    <g>
      <line onClick={e => props.onChange && props.onChange(props.x)} {...lineProp} x1={x} x2={x} y1={y1} y2={y2} {...props} />
        {
          props.line && props.line.map(y => (
            <LadderHLine top={props.top} x={props.x} y={y} key={y} e={props.e}/>
        ))
      }
    </g>
  );
};
const LadderHLine = (props)=>{
  const y = YPADDING + props.e.YSTEP * props.y;
  const x = XPADDING + props.e.XSTEP * props.x;
  return (
    <g>
      <line {...lineProp} x1={x} x2={x+props.e.XSTEP} y1={y} y2={y} {...props} />
    </g>
  );
};

/*


props.height / props.width
+----------------------------+
|xpadding / ypadding         |
|  |                         |
|  |                         |
|  |                         |
|  |                         |
|  |                         |
|  |                         |
|  |                         |
|  |XSTEP|   |    |    |     |
|                            |
+----------------------------+
 */
// const XPADDING = 20;
// const YPADDING = 20;
// this.n = props.ladders.length;
// widthTotal = n*LINE_WIDTH + (n-1)*XSTEP;
// widthTotal = props.width - XPADDING*2;
// XSTEP = (props.width - XPADDING*2 - n*LINE_WIDTH) / (n-1);
// YSTEP = (props.height - YPADDING*2 - ys*LINE_WIDTH) / (ys-1);
// ys = maxY + 1

function arrayMax(arr) {
  return Math.max.apply(null, arr);
}

export default class Ladder extends Component {
  constructor(props) {
    super(props);
    this.init(props);
    this.state = {
      start: -1
    };
  }

  init(props) {
    if (props.ladders
      && props.ladders.length > 1
      && props.ladders[props.ladders.length - 1].length === 0) {

      const ys = arrayMax(props.ladders.map(arrayMax)) + 1;
      const xs = props.ladders.length;
      const XSTEP = Math.floor((props.width  - XPADDING*2 - xs*LINE_WIDTH) / (xs-1));
      const YSTEP = Math.floor((props.height - YPADDING*2 - ys*LINE_WIDTH) / (ys-1));

      this.top = YPADDING;
      this.bottom = props.height - YPADDING*2;
      this.ys = ys;
      this.xs = xs;

      this.e = {
        XSTEP,
        YSTEP
      };
      console.log('e: ', this.e);

      this.enabled = true;
    }
    else {
      this.enabled = false;
    }
  }

  renderPath(start) {
    if (start < 0) return <g></g>;
    const solved = this.props.ladderSolver(this.props.ladders, start);
    var x = start;
    var y = 0;
    var path = [];
    solved.forEach((n, i) => {
      path.push(<LadderVLine top={y} bottom={n.y} x={x} stroke="red" key={i} e={this.e} />);
      path.push(<LadderHLine top={y} x={Math.min(x, n.to)} y={n.y} stroke="red" key={'h'+i} e={this.e} />);
      y = n.y;
      x = n.to;
    });
    path.push(<LadderVLine top={y} bottom={this.ys} x={x} stroke="red" key={'end'} e={this.e} />);

    return (
      <g>
        { path }
      </g>
    );
  }

  renderLadder() {
    return (
      this.props.ladders.map((line, i) => (
        <LadderVLine
          onChange={n => this.setState({start:n})}
          top={0}
          bottom={this.ys}
          x={i}
          line={line}
          key={i}
          e={this.e}/>
      ))
    );
  }

  render() {
    console.log(this.state);
    return (
      <div>
      {
        this.enabled ?
          <svg width={this.props.width} height={this.props.height}>
            {this.renderLadder()}
            {this.renderPath(this.state.start)}
          </svg>:'ready'
      }
      </div>
    );
  }
}
