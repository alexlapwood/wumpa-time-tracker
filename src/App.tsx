import React from "react";
import { cloneDeep } from "lodash";

import TimeEntries from "./components/TimeEntries/TimeEntries";
import TimeEntry from "./components/TimeEntry/TimeEntry";
import TimeRemaining from "./components/TimeRemaining/TimeRemaining";
import Toast from "./components/Toast/Toast";

import StoreContext, { IStore, defaultStore } from "./contexts/StoreContext";

import { waitForFonts, TWindow } from "./helpers";

import * as serviceWorker from "./serviceWorker";

import "./App.css";

class App extends React.Component<{}, IStore> {
  private appRef = React.createRef<HTMLDivElement>();
  private timeInputRef = React.createRef<HTMLInputElement>();
  private scrollLockInterval: number | undefined;

  public state = cloneDeep(defaultStore);

  public componentDidMount() {
    serviceWorker.register({
      onSuccess: () => this.notify("This app works offline"),
      onUpdate: () => this.notify("Update installed")
    });

    if (navigator.userAgent.indexOf("Safari") > -1) {
      const visualViewport = (window as TWindow).visualViewport;
      if (visualViewport) {
        this.scrollLockInterval = setInterval(this.lockScrolling);
        visualViewport.addEventListener("resize", this.onResizeSafari);
      }
    }

    const localStore = localStorage.getItem("wumpa-store");

    if (localStore !== null) {
      this.setState(JSON.parse(localStore));
    }
  }

  public componentWillUnmount() {
    if (navigator.userAgent.indexOf("Safari") > -1) {
      const visualViewport = (window as TWindow).visualViewport;
      if (visualViewport) {
        clearInterval(this.scrollLockInterval);
        visualViewport.removeEventListener("resize", this.onResizeSafari);
      }
    }
  }

  public render() {
    return (
      <StoreContext.Provider
        value={{
          store: this.state,
          setStore: this.setStore
        }}
      >
        <div
          className="App"
          onFocus={event => {
            // Click anywhere to focus on the input
            event.target === this.appRef.current &&
              this.timeInputRef.current &&
              this.timeInputRef.current.focus();
          }}
          ref={this.appRef}
          tabIndex={0}
        >
          <div className="Grid">
            <TimeRemaining className="Grid-timeRemaining" />
            <TimeEntries className="Grid-timeEntries" />
            <div className="Grid-toasts">
              {this.state.notifications.map((notification, i) => (
                <Toast key={`${notification.time}-${i}`} {...notification} />
              ))}
            </div>
            <TimeEntry inputRef={this.timeInputRef} />
          </div>
        </div>
      </StoreContext.Provider>
    );
  }

  private notify = async (message: string) => {
    await waitForFonts();
    setTimeout(() => {
      this.setState({
        notifications: [
          ...this.state.notifications,
          {
            message,
            time: Date.now()
          }
        ]
      });
    }, 100);
  };

  /**
   * Safari adds extra space to the bottom of the document when the keyboard is open.
   *
   * This method prevents scrolling downwards.
   */
  private lockScrolling = () => {
    const scrollingElement =
      document.scrollingElement || document.documentElement;
    if (scrollingElement.scrollTop > 0) {
      scrollingElement.scrollTop = 0;
    }
  };

  /**
   * Safari does not resize the window when toggling the keyboard, however Safari 13 does support window.viewport
   */
  private onResizeSafari = (event: Event) => {
    const viewport = event.target as (EventTarget & { height: number }) | null;
    if (viewport) {
      const scrollingElement = (document.scrollingElement ||
        document.documentElement) as HTMLElement;
      scrollingElement.style.height = `${viewport.height}px`;
    }
  };

  private setStore = (newStore: Partial<IStore>) => {
    this.setState({ ...this.state, ...newStore }, () =>
      localStorage.setItem(
        "wumpa-store",
        JSON.stringify({ ...this.state, notifications: undefined })
      )
    );
  };
}

export default App;
