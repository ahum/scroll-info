import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CSSProperties } from 'react';
import { ScrollInfo } from '../src/index';

const cloneDeep = require('lodash/cloneDeep');

// import * as first from 'lodash/first';


require('./demo.css');

interface Props {
  name: String;
}
interface State {
  info: { [id: string]: object };
}

class Section extends React.Component<Props, object> {
  constructor(props: Props, context: object) {
    super(props, context);
  }

  render() {
    return <div className={'section'}>{this.props.name}</div>;
  }
}

const SectionWithScrollInfo = ScrollInfo(Section);

const InfoPanel = (props: { info: object }) => {
  const style: CSSProperties = {
    margin: '0 auto',
    left: '400px',
    width: '300px',
    height: '300px',
    position: 'fixed',
    backgroundColor: 'orange',
    zIndex: 1001
  };

  return (
    <div style={style}>
      <pre>{JSON.stringify(props.info, null, ' ')}</pre></div>
  );
};

class Demo extends React.Component<object, State> {

  constructor(props: object) {
    super(props);
    this.state = {
      info: {}
    };
  }

  onInfoChange(id: string, elInfo: object) {
    // tslint:disable-next-line:no-string-literal
    const info = cloneDeep(this.state.info);
    info[id] = elInfo;
    console.log('info: id:', id, elInfo);
    this.setState({ info });
  }

  render() {
    return (
      <div className={'demo'}>
        <InfoPanel info={this.state.info} />
        <SectionWithScrollInfo
          name="one"
          downTriggerDistance={100}
          onInfoChange={this.onInfoChange.bind(this, 'one')}
        />
        <SectionWithScrollInfo
          downTriggerDistance={100}
          onInfoChange={this.onInfoChange.bind(this, 'two')}
          name="two"
        />
        <SectionWithScrollInfo
          downTriggerDistance={100}
          onInfoChange={this.onInfoChange.bind(this, 'three')}
          name="three"
        />
      </div>
    );
  }
}

const el = React.createElement(Demo);

ReactDOM.render(el, document.querySelector('#root'));

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
