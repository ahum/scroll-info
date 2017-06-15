import * as React from 'react';

import { CSSProperties, Component, ComponentClass } from 'react';

import { scroll } from './scroll';

/* higher-order component */
export interface InfoProps {
  onInfoChange: (info: object) => void;
  downTriggerDistance: number;
}

export interface InfoState {
  visited: boolean;
  scrolling: boolean;
  /** Is the element completely in the viewport */
  inViewPort: boolean;
  /** Is the element completely outside the viewport */
  outsideViewPort: boolean;
}

export function ScrollInfo<T>(Comp: ComponentClass<T>): ComponentClass<T & InfoProps> {
  return class extends Component<T & InfoProps, InfoState> {

    private el: Element;

    // tslint:disable-next-line:no-any
    constructor(props: any) {
      super(props);
      this.state = {
        visited: false,
        scrolling: false,
        inViewPort: false,
        outsideViewPort: false
      };

      this.onScroll = this.onScroll.bind(this);
    }

    private get wh() {
      return (window.innerHeight || document.documentElement.clientHeight);
    }

    private get ww() {
      return (window.innerWidth || document.documentElement.clientWidth);
    }

    isElementInViewport() {
      const rect = this.el.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= this.wh &&
        rect.right <= this.ww
      );
    }

    isElementOutsideViewPort() {
      const rect = this.el.getBoundingClientRect();
      return rect.bottom <= 0 || rect.top >= this.wh;
    }

    isPastDownTrigger() {
      const rect = this.el.getBoundingClientRect();
      const wh = (window.innerHeight || document.documentElement.clientHeight);
      const td: number = this.props.downTriggerDistance;
      return rect.top < (wh - td);
    }

    onScroll(e: Event) {
      // tslint:disable-next-line:no-console
      // console.log('onScroll');
      // tslint:disable-next-line:no-any
      // const rect = (this.el as any).getBoundingClientRect();
      // tslint:disable-next-line:no-console
      // console.log(this.el, rect);
      //this.updateInfo();
      this.updateInfo();
      // this.setState({ rect });
    }

    componentDidMount() {
      this.addScrollListeners();
      this.updateInfo();
    }

    removeScrollListeners() {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('wheel', this.onScroll);
    }

    addScrollListeners() {
      window.addEventListener('scroll', this.onScroll);
      window.addEventListener('wheel', this.onScroll);
    }
    updateInfo() {

      const inViewPort = this.isElementInViewport();
      // const outsideViewPort = this.isElementOutsideViewPort();
      const pastDownTrigger = this.isPastDownTrigger();
      const visited = this.state.visited || inViewPort;
      this.props.onInfoChange({
        inViewPort,
        pastDownTrigger,
        visited
      });
      const canScrollTo = !visited && pastDownTrigger;

      if (canScrollTo) {
        this.removeScrollListeners();
        scroll(this.el, (e) => {
          if (e) {
            console.log(e);
          }
          this.addScrollListeners();
        });
      }

    }

    /*updateInfo() {

      const inViewPort = this.isElementInViewport();
      const outsideViewPort = this.isElementOutsideViewPort();
      const pastDownTrigger = this.isPastDownTrigger();
      const state: InfoState = {
        inViewPort,
        outsideViewPort,
        visited: this.state.visited || inViewPort,
        scrolling: false
      };

      console.log('isPastDownTrigger', pastDownTrigger, this.el);

      if (!state.visited && pastDownTrigger && !inViewPort && !this.state.scrolling) {
        state.scrolling = true;
        this.setState(state, () => {

          console.log('remove >  scroll listener');
          window.removeEventListener('scroll', this.onScroll);
          scroll(this.el, () => {

            console.log('re-add > scroll listener');
            setTimeout(() => {

              window.addEventListener('scroll', this.onScroll);
            }, 1000);

            this.setState({ scrolling: false }, () => {
              this.props.onInfoChange(this.state);
            });
          });
        });
      } else {
        this.setState(state, () => {
          this.props.onInfoChange(this.state);
        });
      }
    // tslint:disable-next-line:no-any
    // const rect = (this.el as any).getBoundingClientRect();

    // const inViewPort = this.isElementInViewport();

    // if (inViewPort) {
    //   this.setState({ visited: true });
    // }

    // const pastDownTrigger = this.isPastDownTrigger();

    // const info = {
    //   top: rect.top,
    //   inViewPort: inViewPort,
    //   visited: this.state.visited || inViewPort,
    //   pastDownTrigger
    // };

    // //this.props.onInfoChange(info);

    // if (!info.visited && pastDownTrigger && !this.state.scrolling) {
    //   this.setState({ scrolling: true }, () => {
    //     console.log('call scroll...');
    //     scroll(this.el, () => {
    //       console.log('scroll completed');
    //       this.setState({ scrolling: false });
    //     });
    //   });
    // }
  } */

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('wheel', this.onScroll);
    }

    render() {
      const s: CSSProperties = { position: 'relative', width: '100%', height: '100%', boxSizing: 'border-box' };
      return (
        <div
          style={s}
          ref={r => this.el = r}
        >
          <Comp {...this.props} {...this.state} />
        </div>);
    }
  };
}