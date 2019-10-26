import React from "react";
import cn from "classnames";

import wumpaImage from "./wumpa.png";

import "./Toast.scss";

interface IProps {
  time: number;
  message: string;
}

export default class Toast extends React.PureComponent<IProps> {
  public state = {
    hasExpired: this.props.time + 5000 < Date.now()
  };

  public componentDidMount() {
    setTimeout(() => {
      this.setState({
        hasExpired: true
      });
    }, Math.max(0, Date.now() - this.props.time + 5000));
  }

  public render() {
    return (
      <div
        className={cn(
          "Toast-wrapper",
          this.state.hasExpired && "Toast-wrapper--expired"
        )}
      >
        <div className="Toast">
          <img alt="" className="Toast-icon" src={wumpaImage} />
          <div className="Toast-message">{this.props.message}</div>
        </div>
      </div>
    );
  }
}
