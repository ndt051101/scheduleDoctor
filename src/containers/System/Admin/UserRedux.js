import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TableManagerUser from "./TableManagerUser";
import { toast } from "react-toastify";

import "./UserRedux.scss";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpen: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      image: "",

      action: "",
      userEditId: "",
    };
  }
  async componentDidMount() {
    this.props.fetchGenderStart();
    this.props.fetchPositionStart();
    this.props.fetchRoleStart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      const arrGender = this.props.genderRedux;
      this.setState({
        genderArr: arrGender,
        gender: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : "",
      });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      const arrPosition = this.props.positionRedux;
      this.setState({
        positionArr: this.props.positionRedux,
        position:
          arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : "",
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      const arrRole = this.props.positionRedux;
      this.setState({
        roleArr: this.props.roleRedux,
        role: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : "",
      });
    }

    if (prevProps.users !== this.props.users) {
      const arrGender = this.props.genderRedux;
      const arrPosition = this.props.positionRedux;
      const arrRole = this.props.positionRedux;
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        gender: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : "",
        position:
          arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : "",
        role: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : "",
        image: "",
        action: CRUD_ACTIONS.CREATE,
        previewImgURL: "",
      });
    }
  }

  handleOnchangeImage = async (event) => {
    const data = event.target.files;
    const file = data[0];
    if (file) {
      const base64 = await CommonUtils.getBase64(file);
      const objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        image: base64,
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  handleOnchangeInput = (event, id) => {
    const copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState(
      {
        ...copyState,
      },
      () => {
        console.log("Check Data: ", this.state);
      }
    );
  };

  checkValidateInput = () => {
    let isValid = true;
    const arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];

    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("Missing input: " + arrCheck[i]);
        break;
      }
    }

    return isValid;
  };

  handleSubmit = () => {
    const isValid = this.checkValidateInput();
    if (!isValid) return;

    let { action } = this.state;

    if (action === CRUD_ACTIONS.CREATE) {
      this.props.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        image: this.state.image,
      });

      setTimeout(() => {
        this.props.fetchAllUsersStart();
        toast.success("CREATE NEW A USER SUCCESS!");
      }, 1000);
    }
    if (action === CRUD_ACTIONS.EDIT) {
      this.props.editAUser({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        image: this.state.image,
      });
    }
  };

  handleEditUser = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = Buffer.from(user.image, "base64").toString("binary");
    }
    this.setState({
      email: user.email,
      password: "HARDCODE",
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      position: user.positionId,
      role: user.roleId,
      image: "",
      previewImgURL: imageBase64,
      action: CRUD_ACTIONS.EDIT,
      userEditId: user.id,
    });
  };

  render() {
    const {
      genderArr,
      positionArr,
      roleArr,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      previewImgURL,
    } = this.state;
    const { language, isLoading } = this.props;
    return (
      <div className="user-redux-container">
        <div className="title">Learn React-Redux</div>
        <div className="title">{isLoading === true ? "Loading" : ""}</div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12 my-3">
                <FormattedMessage id="manager-user.add" />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.email" />
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => this.handleOnchangeInput(event, "email")}
                  disabled={
                    this.state.action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.password" />
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "password")
                  }
                  disabled={
                    this.state.action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.first-name" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "firstName")
                  }
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.last-name" />
                </label>
                <input
                  type="text "
                  className="form-control"
                  value={lastName}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "lastName")
                  }
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.phone-number" />
                </label>
                <input
                  type="text "
                  className="form-control"
                  value={phoneNumber}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "phoneNumber")
                  }
                />
              </div>
              <div className="col-9">
                <label>
                  <FormattedMessage id="manager-user.address" />
                </label>
                <input
                  type="text "
                  className="form-control"
                  value={address}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "address")
                  }
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.gender" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "gender")
                  }
                  value={gender}
                >
                  {genderArr &&
                    genderArr.length > 0 &&
                    genderArr.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.position" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "position")
                  }
                  value={position}
                >
                  {positionArr &&
                    positionArr.length > 0 &&
                    positionArr.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.role" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => this.handleOnchangeInput(event, "role")}
                  value={role}
                >
                  {roleArr &&
                    roleArr.length > 0 &&
                    roleArr.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manager-user.image" />
                </label>
                <div className="preview-image-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(event) => this.handleOnchangeImage(event)}
                  />
                  <label className="label-upload" htmlFor="previewImg">
                    <FormattedMessage id="manager-user.upload" />{" "}
                    <i className="fas fa-upload"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{
                      backgroundImage: `url(${this.state.previewImgURL})`,
                    }}
                    onClick={() => this.openPreviewImage()}
                  ></div>
                </div>
              </div>
              <div className="col-12 my-3">
                <button
                  className={
                    this.state.action === CRUD_ACTIONS.EDIT
                      ? "btn btn-warning"
                      : "btn btn-primary"
                  }
                  onClick={() => {
                    this.handleSubmit();
                  }}
                >
                  {this.state.action === CRUD_ACTIONS.EDIT ? (
                    <FormattedMessage id="manager-user.edit" />
                  ) : (
                    <FormattedMessage id="manager-user.submit" />
                  )}
                </button>
              </div>

              <div className="col-12">
                <TableManagerUser
                  handleEditUser={this.handleEditUser}
                  action={this.state.action}
                />
              </div>
            </div>
          </div>
        </div>

        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
    isLoading: state.admin.isLoading,
    users: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGenderStart: () => {
      dispatch(actions.fetchGenderStart());
    },
    fetchPositionStart: () => {
      dispatch(actions.fetchPositionStart());
    },
    fetchRoleStart: () => {
      dispatch(actions.fetchRoleStart());
    },
    createNewUser: (data) => {
      dispatch(actions.createNewUser(data));
    },
    fetchAllUsersStart: () => dispatch(actions.fetchAllUsersStart()),
    editAUser: (data) => {
      dispatch(actions.editAUser(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
