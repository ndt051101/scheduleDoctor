import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils } from "../../../utils";
import "./ManageSpecialty.scss";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { createNewSpecialty } from "../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
    };
  }

  componentDidMount() {}

  async componentDidUpdate(prevProps, prevState) {}

  handleOnChangeInput = (event, id) => {
    const copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({ ...copyState });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnchangeImage = async (event) => {
    const data = event.target.files;
    console.log("Data: ", data);
    const file = data[0];
    console.log('File: ', file);
    if (file) {
      const base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveSpecialty = async () => {
    const res = await createNewSpecialty(this.state);
    if (res && res.errCode === 0) {
      toast.success("SUCCESS!");
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    } else {
      toast.error("FAILED!");
      console.log("Create New Specialty: ", res);
    }
  }

  render() {
    const { name, descriptionMarkdown } = this.state;
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lí chuyên khoa</div>
        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên chuyên khoa</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh chuyên khoa</label>
            <input
              type="file"
              className="form-control"
              onChange={(event) => this.handleOnchangeImage(event)}
            />
          </div>
          <div className="col-12 form-group my-4">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={descriptionMarkdown}
            />
          </div>
          <div className="col-12 my-4">
            <button
              className="btn btn-primary"
              onClick={() => this.handleSaveSpecialty()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
