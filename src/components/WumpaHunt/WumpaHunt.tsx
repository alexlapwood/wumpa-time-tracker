import React from "react";
import cn from "classnames";

import StoreContext, { IStoreContext } from "../../contexts/StoreContext";

import wumpaImage from "../../images/wumpa.png";

import "./WumpaHunt.css";

interface IProps {
  className?: string;
}

export default class WumpaHunt extends React.PureComponent<IProps> {
  static contextType = StoreContext;

  public render() {
    const { store, setStore } = this.context as IStoreContext;

    const previousWumpaTimeRace = store.wumpaHuntRace || 0;
    const racesRemaining =
      (6 - ((store.times.length - previousWumpaTimeRace) % 6)) % 6;

    return (
      <div className={cn("WumpaHunt", this.props.className)}>
        <img
          alt=""
          className={cn(
            "WumpaHunt-icon",
            racesRemaining === 0 && "WumpaHunt-icon--active"
          )}
          onClick={() =>
            setStore({
              wumpaHuntRace: store.times.length
            })
          }
          onMouseDown={event => event.preventDefault()} // Prevent the focus event from firing
          src={wumpaImage}
        />
        <span>
          {racesRemaining === 0
            ? "Wumpa hunt race"
            : `${racesRemaining} races remaining`}
        </span>
      </div>
    );
  }
}
