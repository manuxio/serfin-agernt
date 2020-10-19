import React from 'react';
import ReactDOM from 'react-dom';
import emoji from 'node-emoji';

if (typeof document !== 'undefined') {
  var MediumEditor = require('medium-editor');
  var { TCMention } = require("medium-editor-tc-mention");
  var MeMarkdown = require('./markdown.js');
}

export default class ReactMediumEditor extends React.Component {
  // static defaultProps = {
  //   tag: 'div'
  // };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text,
      markDown: ''
    };
  }

  componentDidMount() {
    // const dom = ReactDOM.findDOMNode(this);
    // console.log('MeMarkdown', MeMarkdown.default);
    this.medium = new MediumEditor(this.refs.editable, {
      ...this.props.options,
      extensions: {
        markdown: new MeMarkdown.default({
          subscribeToMeEditableInput: true
        }, (md) => {
              // console.log('MD', md);
              this.setState({
                markDown: md
              });
          }),
        "mention": new TCMention({
          extraPanelClassName: "abc123",
          extraActivePanelClassName: "xyz",
          extraTriggerClassNameMap: {
            ":": "IUHGYJH",
          },
          extraActiveTriggerClassNameMap: {
            "@": "gabdsf",
          },
          tagName: "something",
          renderPanelContent: (panelEl, currentMentionText, selectMentionCallback) => {
            // console.log('Got trigged!', currentMentionText, selectMentionCallback);
            if (currentMentionText === ':-D') {
              currentMentionText = ':smile:';
            }
            if (currentMentionText === ':D') {
              currentMentionText = ':smile:';
            }
            if (currentMentionText === ':-(') {
              currentMentionText = ':disappointed:';
            }
            if (currentMentionText === ':(') {
              currentMentionText = ':disappointed:';
            }
            if (currentMentionText === ':-)') {
              currentMentionText = ':slightly_smiling_face:';
            }
            if (currentMentionText === ':)') {
              currentMentionText = ':slightly_smiling_face:';
            }
            if (currentMentionText.charAt(currentMentionText.length - 1) === ':') {
              if (emoji.get(currentMentionText) !== currentMentionText) {
                selectMentionCallback(emoji.get(currentMentionText).trim());
              }
            }
          },
          destroyPanelContent: function (panelEl) {
            // ReactDOM.unmountComponentAtNode(panelEl);
          },
          activeTriggerList: [":"]
        })
      }
    });
    this.medium.subscribe('editableInput', e => {
      // this._updated = true;
      // this.change(dom.innerHTML);
      // console.log('FULL EVENT', e);
    });
    this.medium.subscribe('editableKeydownEnter', e => {
      if (e.code === 'Enter') {
        this.onEnter(this.refs.editable.innerHTML);
        console.log('Key Up', e);
        e.preventDefault();
        e.stopPropagation();
        this.refs.editable.innerHTML = '';
      }
    });
  }

  componentDidUpdate() {
    this.medium.restoreSelection();
  }

  componentWillUnmount() {
    this.medium.destroy();
  }

  USAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.state.text && !this._updated) {
      this.setState({ text: nextProps.text });
    }

    if (this._updated) this._updated = false;
  }

  render() {
    // const {
    //   options,
    //   text,
    //   tag,
    //   contentEditable,
    //   dangerouslySetInnerHTML,
    //   ...props
    // } = this.props;
    // // props.dangerouslySetInnerHTML = { __html: this.state.text };
    //
    // if (this.medium) {
    //   this.medium.saveSelection();
    // }
    //
    // return React.createElement(tag, props);
    return (
      <div className={`${this.props.className} editable`} style={this.props.style} ref="editable"></div>
    );
  }

  change(text) {
    if (this.props.onChange) this.props.onChange(text, this.medium);
  }
  onEnter(text) {
    if (this.props.onEnter) this.props.onEnter(this.state.markDown);
  }
}

ReactMediumEditor.defaultProps = {
  tag: 'div'
};