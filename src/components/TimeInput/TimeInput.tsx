import React from "react";

import "./TimeInput.css";
import TimeDisplay from "../TimeDisplay/TimeDisplay";

interface IProps {
  inputRef?: React.RefObject<HTMLInputElement>;
  setTime: (newTime?: string) => void;
  submitTime: () => void;
  time: string | undefined;
}

interface IState {
  windowHeight?: number;
}

export default class TimeInput extends React.PureComponent<IProps, IState> {
  private inputRef = React.createRef<HTMLInputElement>();

  public state: IState = {};

  public componentDidMount() {
    window.addEventListener("resize", this.onResize);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  public render() {
    const { time } = this.props;

    const inputRef = this.props.inputRef || this.inputRef;

    return (
      <div className="TimeInput">
        <label className="TimeInput-input">
          Time to add
          <input
            inputMode="decimal"
            onChange={this.onChange}
            onFocus={this.onFocus}
            onKeyPress={this.onKeyPress}
            ref={inputRef}
            value={time === undefined ? "" : time}
          />
        </label>
        <TimeDisplay time={time} />
      </div>
    );
  }

  /**
   * Blur the input if the keyboard is hidden
   */
  private toggleFocus = () => {
    const inputRef = this.props.inputRef || this.inputRef;

    if (
      this.state.windowHeight &&
      window.outerHeight > this.state.windowHeight
    ) {
      inputRef.current && inputRef.current.blur();
    }

    this.setState({
      windowHeight: window.outerHeight
    });
  };

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitisedInput = `${event.target.value}`.replace(/\D/g, "");
    const newTime = sanitisedInput ? sanitisedInput : undefined;
    if (sanitisedInput.length <= 6) {
      this.props.setTime(newTime);
    }
  };

  /**
   * Safari < 13 does not support window.visualViewport.
   *
   * Scroll the document to the bottom to show the input when it receives focus.
   */
  private onFocus = () => {
    setTimeout(() => {
      const scrollingElement =
        document.scrollingElement || document.documentElement;
      scrollingElement.scrollTop = scrollingElement.scrollHeight;
    });
  };

  private onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      this.props.submitTime();
    }
  };

  private onResize = () => setTimeout(this.toggleFocus, 100);
}
