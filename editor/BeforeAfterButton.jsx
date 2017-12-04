const React = require("react");

class BeforeAfterButton extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    showBefore: React.PropTypes.bool.isRequired,
    selectedFrame: React.PropTypes.object,
  };

  handleClick() {
    if (this.props.showBefore) {
      this.props.actions.showAfter();
    } else {
      this.props.actions.showBefore();
    }
  }

  render() {
    const { showBefore, selectedFrame } = this.props;

    if (!selectedFrame) return null;

    const className = showBefore ? "fa fa-eye-slash" : "fa fa-eye";

    return (
      <div className="before-after-button">
        <i
          onClick={() => this.handleClick()}
          className={`clickable ${className}`}
          aria-hidden="true"
        />
      </div>
    );
  }
}

module.exports = BeforeAfterButton;
