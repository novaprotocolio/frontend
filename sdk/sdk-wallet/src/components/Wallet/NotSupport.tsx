import * as React from "react";
import Svg from "../Svg";

interface Props {
  iconName: string;
  title: string;
  desc: string;
}

interface State {}

class NotSupport extends React.PureComponent<Props, State> {
  public render() {
    const { iconName, title, desc } = this.props;
    return (
      <div className="NovaSDK-notSupport">
        <Svg name={iconName} size="80" />
        <div className="NovaSDK-notSupportTitle">{title}</div>
        <div className="NovaSDK-notSupportDesc" dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
    );
  }
}

export default NotSupport;
