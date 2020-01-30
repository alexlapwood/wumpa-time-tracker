import React from "react";

import TimeInput from "../TimeInput/TimeInput";

import StoreContext, { IStoreContext } from "../../contexts/StoreContext";

import { timeFromString, isValidTimeString } from "../../helpers";

import "./TimeEntry.css";

interface IProps {
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default class TimeEntry extends React.PureComponent<IProps> {
  static contextType = StoreContext;

  render() {
    const { store, setStore } = this.context as IStoreContext;

    return (
      <React.Fragment>
        <TimeInput
          inputRef={this.props.inputRef}
          setTime={newTime => setStore({ timeEntry: newTime })}
          submitTime={this.submitTime}
          time={store.timeEntry}
        />
        <div className="TimeEntry-buttonWrapper">
          <button
            disabled={isValidTimeString(store.timeEntry) === false}
            onClick={this.submitTime}
            onMouseDown={event => event.preventDefault()} // Prevent the focus event from firing
          >
            <span>Add time</span>
          </button>
        </div>
      </React.Fragment>
    );
  }

  private submitTime = () => {
    const { store, setStore } = this.context as IStoreContext;

    if (isValidTimeString(store.timeEntry)) {
      setStore({
        timeEntry: undefined,
        times: [...store.times, timeFromString(store.timeEntry)]
      });
    }
  };
}
