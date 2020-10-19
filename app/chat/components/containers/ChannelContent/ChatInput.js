import React, { useState } from 'react';
import { Button, Input, Row, Col, UncontrolledTooltip, ButtonDropdown, DropdownToggle, DropdownMenu, Label, Form } from "reactstrap";
// import { Picker } from 'emoji-mart';
import { Picker, emojiIndex } from 'emoji-mart';
import emoji from 'node-emoji';
import 'emoji-mart/css/emoji-mart.css';
import TextareaAutosize from 'react-autosize-textarea';
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import ContentEditable from 'react-contenteditable';
import Editor from './editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

function ChatInput(props) {
  const [textMessage, settextMessage] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [file, setfile] = useState({
    name : "",
    size : ""
  });
  const [fileImage, setfileImage] = useState("")

  const toggle = () => setisOpen(!isOpen);

  //function for text input value change
  const handleChangeOld = e => {
    console.log(emoji.emojify(e.target.value));
    settextMessage(emoji.emojify(e.target.value))
  }
  const handleChange = t => {
    console.log(emoji.emojify(t));
    settextMessage(emoji.emojify(t))
  }

  //function for add emojis
  const addEmoji = e => {
    let emoji = e.native;
    console.log('emoji', emoji);
    settextMessage(textMessage+emoji)
  };

  //function for file input change
  const handleFileChange = e => {
    if(e.target.files.length !==0 )
    setfile({
      name : e.target.files[0].name,
      size : e.target.files[0].size
    })
  }

  //function for image input change
  const handleImageChange = e => {
    if(e.target.files.length !==0 )
    setfileImage(URL.createObjectURL(e.target.files[0]))
  }

  //function for send data to onaddMessage function(in userChat/index.js component)
  const onaddMessage = (e, textMessage) => {
    e.preventDefault();
    //if text value is not emptry then call onaddMessage function
    if(textMessage !== "") {
      props.onaddMessage(textMessage, "textMessage");
      settextMessage("");
    }

    //if file input value is not empty then call onaddMessage function
    if(file.name !== "") {
      props.onaddMessage(file, "fileMessage");
      setfile({
        name : "",
        size : ""
      })
    }

    //if image input value is not empty then call onaddMessage function
    if(fileImage !== "") {
      props.onaddMessage(fileImage, "imageMessage");
      setfileImage("")
    }
  }

  return (
    <React.Fragment>
      <div className="p-2 p-lg-2 border-top mb-0 chatInputWrapper">
        <Form onSubmit={(e) => onaddMessage(e, textMessage)} >
          <Row noGutters>
            <Col>
              <div>
                <Editor
                  text={textMessage}
                  onEnter={(text) => {
                    if (props.onAddMessage) {
                      props.onAddMessage(text);
                    }
                  }}
                  onChange={handleChange}
                  options={{ toolbar: { buttons: ['bold', 'italic', 'underline'] } }}
                  row={1}
                  className="form-control form-control-lg bg-light border-light"
                  placeholder="Enter message..."
                  loadingComponent={() => <span>Loading</span>}
                  style={{ height: "56px", overflow: "auto" }}
                  dropdownStyle={{
                    // top: '40px',
                    // backgroundColor: 'red'
                  }}
                  trigger={{
                    ':': {
                      dataProvider: token =>
                        emojiIndex.search(token).map(o => ({
                          colons: o.colons,
                          native: o.native,
                        })),
                      component: ({ entity: { native, colons } }) => (
                        <div>{`${colons} ${native}`}</div>
                      ),
                      output: item => `${item.native}`,
                    },
                  }}
                />
              </div>
            </Col>
            <Col xs="auto">
              <div className="chat-input-links ml-md-2">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <ButtonDropdown className="emoji-dropdown" direction="up" isOpen={isOpen} toggle={toggle}>
                      <DropdownToggle id="emoji" color="link" className="text-decoration-none font-size-16 btn-lg waves-effect">
                        <i className="ri-emotion-happy-line"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-lg-right">
                        <Picker onSelect={addEmoji} />
                      </DropdownMenu>
                    </ButtonDropdown>
                    <UncontrolledTooltip target="emoji" placement="top">
                      Emoji
                    </UncontrolledTooltip>
                  </li>
                  <li className="list-inline-item">
                    <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                      <i className="ri-send-plane-2-fill"></i>
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </React.Fragment>
  );
}

export default ChatInput;