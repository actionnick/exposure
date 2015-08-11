var React = require('react');
var Modal = require('react-modal');

Modal.setAppElement(document.getElementById('main'));
Modal.injectCSS();

class About extends React.Component {
  followMe(event) {
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = "https://twitter.com/intent/follow?screen_name=action_nick&tw_p=followbutton",
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
    
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        className="about_modal"
      >
        <img id="close" onClick={this.props.closeModal} src="../assets/x.svg"/>
        <img id="title" src="../assets/color_logo.svg"/>

        <p>This is a demo for a javascript library called exposure. Exposure is an image processing library backed by webGL which means it's fast and powerful. You can use this demo to mess around with the different effects and filters you can create. Right now there are only brightness, contrast, and levels controls but there will be more coming soon.</p>
        <p>Upload your <strong>image</strong>, mess around and <strong>edit</strong> it, then <strong>save</strong> the image or the filter.</p>

        <h3>Saving Your Filter</h3>
        <p>If you've designed a filter that you want to re-use in your app, click the toJSON button at the top to get a json representation of the current filter. You can then <a target="_blank" href="https://github.com/actionnick/exposure#usage">use that json to initialize an exposure object</a> in your own application.</p>

        <h3>Saving Your Image</h3>
        <p>Saving your image is simple, just right click on the image and click "Save image as." Note Safari doesn't actually support saving a canvas as an image.</p>

        <h3>Browser Support</h3>
        <p>The exposure library will work in any browser that supports webGL and this demo has been tested to work in the latest versions of Firefox, Safari, and Chrome.</p>

        <h3>Feature Requests</h3>
        <p>If you have any specific features you would want out of a client side image processing library, <a target="_blank" href="https://github.com/actionnick/exposure/issues">file an issue</a> for it and I'll take a look.</p>

        <img className="twitter-follow-button popup" src="../assets/twitter_follow_icon.svg" onClick={this.followMe.bind(this)}/>
        <img className="close_button" src="../assets/close.svg" onClick={this.props.closeModal}/>
      </Modal>
    )
  }
}

About.propTypes = {
  closeModal: React.PropTypes.func,
  isOpen: React.PropTypes.bool
};

module.exports = About;
