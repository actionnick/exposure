const React = require("react");
const Modal = require("react-modal");

class JsonEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      text: "",
    };
  }

  static propTypes = {
    selectedFrame: React.PropTypes.object,
    actions: React.PropTypes.object.isRequired,
  };

  handleClick() {
    const text = this.state.text;
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      alert(`Invalid Json: ${e.message}`);
    }

    this.props.actions.setSettings(json);
    this.setState({ modalOpen: false, text: "" });
  }

  render() {
    if (!this.props.selectedFrame) return null;

    return (
      <div className="top-button">
        <Modal isOpen={this.state.modalOpen} className="modal" contentLabel="JSON">
          <img id="close" onClick={() => this.setState({ modalOpen: false })} src="assets/x.svg" />
          <div className="flex flex-v-centered">
            <h3>Set JSON</h3>
            <div className="top-button">
              <i
                onClick={() => this.handleClick()}
                className="clickable fa fa-magic"
                aria-hidden="true"
              />
            </div>
          </div>

          <pre className="json-output">
            <textarea
              value={this.state.text}
              onChange={event => this.setState({ text: event.target.value })}
            />
          </pre>
        </Modal>

        <i
          onClick={() => this.setState({ modalOpen: true })}
          className="fa fa-code"
          aria-hidden="true"
        />
      </div>
    );
  }
}

module.exports = JsonEditor;
