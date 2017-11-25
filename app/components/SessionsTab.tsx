import * as React from "react";
import { SessionList } from "./SessionList";
import { Session, ISessionSelection } from "../model/Session";
import { SingleSessionPane } from "./SingleSessionPane";
import { observer } from "mobx-react";
const styles = require("./Sessions.scss");

interface IProps {
  sessions: Session[];
  selectedSession: ISessionSelection;
}

@observer
export class SessionsTab extends React.Component<IProps> {
  public render() {
    return (
      <div className={styles.sessionsTab}>
        <SessionList
          sessions={this.props.sessions}
          selectedSession={this.props.selectedSession}
        />
        <SingleSessionPane
          session={this.props.sessions[this.props.selectedSession.index]}
        />
      </div>
    );
  }
}