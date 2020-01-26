import React from "react";
import cn from "classnames";

import "./TimeDisplay.css";

interface IProps {
  time?: string;
}

export default class TimeDisplay extends React.PureComponent<IProps> {
  public render() {
    const { time = "" } = this.props;
    const padCharacter = time === "" ? "-" : undefined;
    const minutes = time.padStart(6, padCharacter).slice(0, -4);
    const seconds = time.padStart(4, padCharacter).substr(-4, 2);
    const split = time.padStart(2, padCharacter).substr(-2);
    const timeString = `${minutes}:${seconds}:${split}`;
    return (
      <div className={cn("TimeDisplay", time === "" && "TimeDisplay--empty")}>
        {Array.prototype.map.call(
          timeString,
          (character: string, i: number) => (
            <span
              className={
                character === ":" ? "TimeDisplay-colon" : "TimeDisplay-digit"
              }
              key={`${character}${i}`}
            >
              {character}
            </span>
          )
        )}
      </div>
    );
  }
}
