import React, { useContext } from "react";
import cn from "classnames";

import TimeDisplay from "../TimeDisplay/TimeDisplay";

import StoreContext, { IStoreContext } from "../../contexts/StoreContext";

import { timeToString, waitForFonts, TWindow } from "../../helpers";

import wumpaImage from "../../images/wumpa.png";

import "./TimeEntries.css";

interface IProps {
  className?: string;
  style?: React.CSSProperties;
}

interface IPropsFromStore {
  removeTime: (index: number) => void;
  setWumpaHuntRace: (index: number) => void;
  times: string[];
  wumpaHuntRace: number;
}

type TProps = IProps & IPropsFromStore;

class TimeEntries extends React.PureComponent<TProps> {
  private scrollRef = React.createRef<HTMLDivElement>();

  public async componentDidMount() {
    window.addEventListener("resize", this.onResize);

    if (navigator.userAgent.indexOf("Safari") > -1) {
      const visualViewport = (window as TWindow).visualViewport;
      if (visualViewport) {
        visualViewport.addEventListener("resize", this.onResize);
      }
    }

    await waitForFonts();
    setTimeout(this.scrollToBottom);
  }

  public componentDidUpdate(previousProps: TProps) {
    if (this.props.times.length > previousProps.times.length) {
      this.scrollToBottom();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);

    if (navigator.userAgent.indexOf("Safari") > -1) {
      const visualViewport = (window as TWindow).visualViewport;
      if (visualViewport) {
        visualViewport.removeEventListener("resize", this.onResize);
      }
    }
  }

  public render() {
    return (
      <div
        className={cn("TimeEntries", this.props.className)}
        ref={this.scrollRef}
        style={{ ...this.props.style }}
      >
        <div style={{ alignSelf: "end" }}>
          {this.props.times.map((timeEntry, i) => {
            const isSelected = i % 6 === this.props.wumpaHuntRace % 6;
            return (
              <div className="TimeEntries-entry" key={`${i}${timeEntry}`}>
                <img
                  alt=""
                  className={cn(
                    "TimeEntries-wumpaHunt",
                    isSelected && "TimeEntries-wumpaHunt--selected"
                  )}
                  onClick={() => this.props.setWumpaHuntRace(i)}
                  onMouseDown={event => event.preventDefault()} // Prevent the focus event from firing
                  src={wumpaImage}
                />
                <TimeDisplay time={timeEntry} />
                <button
                  className="TimeEntries-removeEntry"
                  onClick={() => this.props.removeTime(i)}
                  onMouseDown={event => event.preventDefault()} // Prevent the focus event from firing
                >
                  <span>Remove</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private scrollToBottom = () => {
    const scrollElement = this.scrollRef.current;
    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  };

  private onResize = () => setTimeout(this.scrollToBottom);
}

function select({ setStore, store }: IStoreContext) {
  const selectors: IPropsFromStore = {
    removeTime: (index: number) => {
      setStore({
        times: [...store.times.filter((_, i) => i !== index)]
      });
    },
    setWumpaHuntRace: (index: number) => {
      setStore({
        wumpaHuntRace: index
      });
    },
    times: store.times.map(time => timeToString(time)),
    wumpaHuntRace: store.wumpaHuntRace || 0
  };

  return selectors;
}

export default React.memo((props: React.PropsWithChildren<IProps>) => {
  const context = useContext(StoreContext);
  const selectors = select(context);
  return <TimeEntries {...selectors} {...props} />;
});
