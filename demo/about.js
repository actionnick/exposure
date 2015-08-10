var React = require('react');
var Modal = require('react-modal');

Modal.setAppElement(document.getElementById('main'));
Modal.injectCSS();

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  closeModal {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.state.open}
        closeTimeoutMS={1000}
        className="about_modal"
      >
        <h1>Modal Content</h1>
        <p>SOME LONG RUNNING STUFF UP IN HERE</p>
        <button type="button" onClick={this.closeModal.bind(this)}>Close</button>
      </Modal>
    )
  }
}

module.exports = About;
