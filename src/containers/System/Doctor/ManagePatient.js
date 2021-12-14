import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, dateFormat } from "../../../utils/constant";
import * as actions from "../../../store/actions";
import "./ManagePatient.scss";
import DatePicker from "./../../../components/Input/DatePicker";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import {
  getAllPatientForDoctor,
  postSendRemedy,
} from "../../../services/userService";
import RemedyModal from "./RemedyModal";
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.getDataPatient();
  }

  getDataPatient = async () => {
    const { user } = this.props;
    const { currentDate } = this.state;
    const formatDate = new Date(currentDate).getTime();
    const res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formatDate,
    });

    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.allDoctors !== this.props.allDoctors) {
    }
    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleBtnConfirm = (item) => {
    const data = {
      doctorId: item.doctorId,
      email: item.patientData.email,
      patientId: item.patientId,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (data) => {
    const { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });
    const res = await postSendRemedy({
      ...data,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });

    if (res && res.errCode === 0) {
      toast.success("SUCCESS!");
      this.setState({
        isShowLoading: false,
      });
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      toast.error("ERROR!");
      this.setState({
        isShowLoading: false,
      });
    }
  };

  render() {
    const { language } = this.props;
    const { dataPatient, isOpenRemedyModal, dataModal, isShowLoading } =
      this.state;
    return (
      <>
        <LoadingOverlay active={isShowLoading} spinner text="Loading...">
          <div className="manage-patient-container">
            <div className="ms-title">
              <FormattedMessage id="manage-schedule.title" />
            </div>
            <div className="container">
              <div className="row">
                <div className="col-6 form-group mb-3">
                  <label>Chọn ngày</label>
                  <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className="form-control"
                    value={this.state.currentDate}
                  />
                </div>
              </div>
              <div className="col-12 table-manage-patient">
                <table className="table table-striped table-bordered table-hover table-dark">
                  <thead>
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Thời gian</th>
                      <th scope="col">Họ và tên</th>
                      <th scope="col">Địa chỉ</th>
                      <th scope="col">Giới tính</th>
                      <th scope="col">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPatient &&
                      dataPatient.length > 0 &&
                      dataPatient.map((item, index) => {
                        const time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient.valueEn;
                        const gender =
                          language === LANGUAGES.VI
                            ? item.patientData.genderData.valueVi
                            : item.patientData.genderData.valueEn;
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{time}</td>
                            <td>{item.patientData.firstName}</td>
                            <td>{item.patientData.address}</td>
                            <td>{gender}</td>
                            <td>
                              <button
                                className="btn btn-primary mx-3"
                                onClick={() => this.handleBtnConfirm(item)}
                              >
                                Xác nhận
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpenRemedyModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
