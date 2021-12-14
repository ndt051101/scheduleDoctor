import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils/constant";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManagerDoctor.scss";
import Select from "react-select";
import { getDetailInforDoctor } from "../../../services/userService";

const mdParser = new MarkdownIt();

class ManagerDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //save to Markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedDoctor: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      //save to doctor_infor table2
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
      clinicId: "",
      specialtyId: "",
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.fetchRequiredDoctorInfor();
  }

  handleDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          const object = {};
          const valueVi = `${item.lastName} ${item.firstName}`;
          const valueEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? valueVi : valueEn;
          object.value = item.id;

          result.push(object);
        });
      }

      if (type === "PRICE") {
        inputData.map((item, index) => {
          const object = {};
          const valueVi = `${item.valueVi} VND`;
          const valueEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? valueVi : valueEn;
          object.value = item.keyMap;

          result.push(object);
        });
      }

      if (type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          const object = {};
          const valueVi = `${item.valueVi} `;
          const valueEn = `${item.valueEn} `;
          object.label = language === LANGUAGES.VI ? valueVi : valueEn;
          object.value = item.keyMap;

          result.push(object);
        });
      }
      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          const object = {};
          object.label = item.name;
          object.value = item.id;

          result.push(object);
        });
      }

      if (type === "CLINIC") {
        inputData.map((item, index) => {
          const object = {};
          object.label = item.name;
          object.value = item.id;

          result.push(object);
        });
      }

      return result;
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const dataSelect = this.handleDataInputSelect(
      this.props.allDoctors,
      "USERS"
    );
    if (prevProps.allDoctors !== this.props.allDoctors) {
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      const { resPayment, resPrice, resProvince, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;

      const dataSelectPrice = this.handleDataInputSelect(resPrice, "PRICE");
      const dataSelectPayment = this.handleDataInputSelect(
        resPayment,
        "PAYMENT"
      );
      const dataSelectProvince = this.handleDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      const dataSelectSpecialty = this.handleDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      const dataSelectClinic = this.handleDataInputSelect(
        resClinic,
        "CLINIC"
      );

      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
      });
    }

    if (prevProps.language !== this.props.language) {
      const { resPayment, resPrice, resProvince } =
        this.props.allRequiredDoctorInfor;

      const dataSelectPrice = this.handleDataInputSelect(resPrice, "PRICE");
      const dataSelectPayment = this.handleDataInputSelect(
        resPayment,
        "PAYMENT"
      );
      const dataSelectProvince = this.handleDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };

  handleOnChangeText = (event, id) => {
    const stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleChange = async (selectedDoctor) => {
    this.setState({ selectedDoctor });
    const { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state;
    const res = await getDetailInforDoctor(selectedDoctor.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      const markdown = res.data.Markdown;
      let addressClinic = "";
      let nameClinic = "";
      let note = "";
      let paymentId = "";
      let priceId = "";
      let provinceId = "";
      let specialtyId = "";
      let clinicId = "";
      let selectedPrice = "";
      let selectedPayment = "";
      let selectedProvince = "";
      let selectedSpecialty = "";
      let selectedClinic = "";

      if (res.data.Doctor_Infor) {
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;

        selectedPrice = listPrice.find(
          (item) => item && item.value === priceId
        );
        selectedPayment = listPayment.find(
          (item) => item && item.value === paymentId
        );
        selectedProvince = listProvince.find(
          (item) => item && item.value === provinceId
        );
        selectedSpecialty = listSpecialty.find(
          (item) => item && item.value === specialtyId
        );
        selectedClinic = listClinic.find(
          (item) => item && item.value === clinicId
        );
      }

      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPrice: selectedPrice,
        selectedPayment: selectedPayment,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        selectedClinic: selectedClinic,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        addressClinic: "",
        nameClinic: "",
        note: "",
        selectedPrice: "",
        selectedPayment: "",
        selectedProvince: "",
        selectedSpecialty: "",
        selectedClinic: "",
      });
    }
  };

  handleChangeDoctorInfor = (selectedOption, name) => {
    const stateName = name.name;
    const stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };

  handleSubmitDoctor = () => {
    const { hasOldData } = this.state;
    this.props.saveInforDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedDoctor.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId:
        this.state.selectedClinic && this.state.selectedClinic.value
          ? this.state.selectedClinic.value
          : "",
      specialtyId: this.state.selectedSpecialty.value,
    });
  };

  render() {
    const { hasOldData } = this.state;
    return (
      <div className="manager-doctor-container">
        <div className="title">
          <FormattedMessage id="admin.manager-doctor.title" />
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>
              <FormattedMessage id="admin.manager-doctor.select-doctor" />
            </label>
            <Select
              value={this.state.selectedDoctor}
              onChange={this.handleChange}
              options={this.state.listDoctors}
              placeholder={
                <FormattedMessage id="admin.manager-doctor.select-doctor" />
              }
            />
          </div>
          <div className="content-right form-group">
            <label>
              <FormattedMessage id="admin.manager-doctor.intro" />
            </label>
            <textarea
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}
            ></textarea>
          </div>
        </div>

        <div className="more-infor-extra row">
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manager-doctor.price" />
            </label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeDoctorInfor}
              options={this.state.listPrice}
              placeholder={<FormattedMessage id="admin.manager-doctor.price" />}
              name="selectedPrice"
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manager-doctor.payment" />
            </label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeDoctorInfor}
              options={this.state.listPayment}
              placeholder={
                <FormattedMessage id="admin.manager-doctor.payment" />
              }
              name="selectedPayment"
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manager-doctor.province" />
            </label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeDoctorInfor}
              options={this.state.listProvince}
              placeholder={
                <FormattedMessage id="admin.manager-doctor.province" />
              }
              name="selectedProvince"
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manager-doctor.nameClinic" />
            </label>
            <input
              type="text"
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "nameClinic")}
              value={this.state.nameClinic}
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manager-doctor.addressClinic" />
            </label>
            <input
              type="text"
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "addressClinic")
              }
              value={this.state.addressClinic}
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manager-doctor.note" />
            </label>
            <input
              type="text"
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manager-doctor.specialty" />
            </label>
            <Select
              value={this.state.selectedSpecialty}
              options={this.state.listSpecialty}
              placeholder={
                <FormattedMessage id="admin.manager-doctor.specialty" />
              }
              onChange={this.handleChangeDoctorInfor}
              name="selectedSpecialty"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manager-doctor.clinic" />
            </label>
            <Select
              value={this.state.selectedClinic}
              options={this.state.listClinic}
              placeholder={
                <FormattedMessage id="admin.manager-doctor.clinic" />
              }
              onChange={this.handleChangeDoctorInfor}
              name="selectedClinic"
            />
          </div>
        </div>

        <div className="manager-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>

        <button
          onClick={() => this.handleSubmitDoctor()}
          className={
            hasOldData === true ? "manager-doctor-button" : "manager-doctor-btn"
          }
        >
          {hasOldData === true ? (
            <span>
              <FormattedMessage id="admin.manager-doctor.save" />
            </span>
          ) : (
            <span>
              <FormattedMessage id="admin.manager-doctor.add" />
            </span>
          )}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    saveInforDoctor: (data) => dispatch(actions.saveInforDoctor(data)),
    fetchRequiredDoctorInfor: () => {
      dispatch(actions.fetchRequiredDoctorInfor());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerDoctor);
