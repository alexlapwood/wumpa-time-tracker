import React from "react";
import cn from "classnames";

import TimeDisplay from "../TimeDisplay/TimeDisplay";

import StoreContext, { IStoreContext } from "../../contexts/StoreContext";

import { timeToString } from "../../helpers";

import "./TimeRemaining.css";

interface IProps {
  className?: string;
}

export default class TimeRemaining extends React.PureComponent<IProps> {
  static contextType = StoreContext;

  public render() {
    const { store } = this.context as IStoreContext;

    return (
      <div className={cn("TimeRemaining", this.props.className)}>
        <span>Time remaining</span>
        <TimeDisplay
          time={timeToString(
            Math.max(0, store.times.reduce((a, b) => a - b, 30000 * 60))
          )}
        />
      </div>
    );
  }
}
