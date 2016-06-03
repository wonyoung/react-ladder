import React, { Component } from 'react';
import _ from 'lodash';

const PADDING = 50;
const WIDTH = 50;
const V_STEP = 20;

const XPADDING = 20;
const YPADDING = 40;
const LINE_WIDTH = 4;

const lineProp = {
  stroke: "gray",
  strokeWidth: LINE_WIDTH
};

function X(x, e) {
  return XPADDING + e.XSTEP * x;
}
function Y(y, e) {
  return YPADDING + e.YSTEP * y;
}

const LadderHead = (props) => {
  const x = XPADDING + props.e.XSTEP * props.x;
  const y = YPADDING - 10;
  return (
    <g>
      <circle
        onClick={e => props.onChange && props.onChange(props.x)}
        cx={x} cy={y} r={10}
        strokeWidth={0} fill='gray'
        />
    </g>
  );
};
const LadderVLine = (props)=>{

  const x = XPADDING + props.e.XSTEP * props.x;
  const y1 = YPADDING + props.e.YSTEP * props.top;
  const y2 = YPADDING + props.e.YSTEP * props.bottom;
  return (
    <g>
      <line {...lineProp} x1={x} x2={x} y1={y1} y2={y2} {...props} />
        {
          props.steps && props.steps.map(y => (
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
// widthTotal = n*LINE_WIDTH + (n-1)*XSTEP;
// widthTotal = props.width - XPADDING*2;
// XSTEP = (props.width - XPADDING*2 - n*LINE_WIDTH) / (n-1);
// YSTEP = (props.height - YPADDING*2 - ys*LINE_WIDTH) / (ys-1);
// ys = maxY + 1

class InputPlayerNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input:''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    const input = e.nativeEvent.target.value;
    this.setState({input});
  }

  handleSubmit(e) {
    this.props.onChange && this.props.onChange(parseInt(this.state.input));
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type='number'
            min={2}
            max={20}
            value={this.state.input}
            onChange={this.handleInputChange}/>
        </form>
      </div>
    );
  }
}

export default class Ladder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      ladder: [],
      start: -1
    };
  }

  componentDidMount() {
    this.init(3);
  }

  init(n) {
    const { width, height } = this.props;

    const ladder = this.props.ladderGenerator(n);

    const ys = _.max(_.flatten(ladder)) + 1;
    const xs = n;
    const XSTEP = Math.floor((width  - XPADDING*2 - xs*LINE_WIDTH) / (xs-1));
    const YSTEP = Math.floor((height - YPADDING*2 - ys*LINE_WIDTH) / (ys-1));

    this.top = YPADDING;
    this.bottom = height - YPADDING*2;
    this.ys = ys;
    this.xs = xs;

    this.e = {
      XSTEP,
      YSTEP
    };

    this.setState({ready:true, ladder, start: -1});
  }

  renderPath(start) {
    if (start < 0) return <g></g>;
    const solved = this.props.ladderSolver(this.state.ladder, start);

    var x = start;
    var y = 0;
    var path = 'M'+X(start, this.e)+' '+Y(0, this.e);
    solved.forEach((n, i) => {
      path += ' V'+Y(n.y, this.e);
      path += ' H'+X(n.to, this.e);
      y = n.y;
      x = n.to;
    });
    path += ' V'+Y(this.ys, this.e);

    return (
      <g>
        <path d={path} {...lineProp} fill='none' stroke='red' key={start}/>
      </g>
    );
  }

  renderLadder() {
    return (
      this.state.ladder.map((steps, i) => (
        <g key={i}>
          <LadderHead
            onChange={n => this.setState({start:n})}
            x={i}
            e={this.e}/>
          <LadderVLine
            onChange={n => this.setState({start:n})}
            top={0}
            bottom={this.ys}
            x={i}
            steps={steps}
            e={this.e}/>
        </g>
      ))
    );
  }

  render() {
    return (
      <div>
        <InputPlayerNumber onChange={n => this.init(n)}/>
      {
        this.state.ready ?
          <svg width={this.props.width} height={this.props.height}>
            {this.renderLadder()}
            {this.renderPath(this.state.start)}
          </svg>:'ready'
      }
      </div>
    );
  }
}
