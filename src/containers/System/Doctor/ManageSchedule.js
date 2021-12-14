import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, dateFormat } from "../../../utils/constant";
import * as actions from "../../../store/actions";
import Select from "react-select";
import "./ManageSchedule.scss";
import DatePicker from "./../../../components/Input/DatePicker";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManagerSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: new Date(),
      rangeTime: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.fetchAllScheduleTime();
  }

  componentDidUpdate = (prevProps, prevState) => {
    const dataSelect = this.handleDataInputSelect(this.props.allDoctors);
    if (prevProps.allDoctors !== this.props.allDoctors) {
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }

      this.setState({
        rangeTime: data,
      });
    }
  };

  handleDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item) => {
        const object = {};
        const valueVi = `${item.lastName} ${item.firstName}`;
        const valueEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? valueVi : valueEn;
        object.value = item.id;

        result.push(object);
      });

      return result;
    }
  };

  handleChange = async (selectedDoctor) => {
    this.setState({ selectedDoctor });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  handleSaveSchedule = async () => {
    const { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("INVALID DOCTOR!");
      return;
    }
    if (!currentDate) {
      toast.error("INVALID DATE!");
      return;
    }

    // const formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);

    // const formatedDate = moment(currentDate).unix();

    const formatedDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      const selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if(selectedTime && selectedTime.length > 0) {
        selectedTime.map(time => {
        let object = {};
        object.doctorId = selectedDoctor.value;
        object.date = formatedDate;
        object.timeType = time.keyMap;
        result.push(object);
        })
      }else {
        toast.error("INVALID SELECTED TIME!");
        return;
      }
    }

    const res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      date: formatedDate,
    });

    console.log("Response: ", res);
    console.log("Result: ", result);

    if(res && res.errCode === 0) {
      toast.success("SUCCESSED");
    }else {
      toast.error("FAILED");
    }
  };
  render() {
    const { rangeTime } = this.state;
    const { language } = this.props;
    return (
      <div className="manage-schedule-container">
        <div className="ms-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>Chọn bác sĩ</label>
              <Select
                value={this.state.selectedDoctor}
                onChange={this.handleChange}
                options={this.state.listDoctors}
              />
            </div>
            <div className="col-6 form-group">
              <label>Chọn ngày</label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={new Date()}
              />
            </div>
          </div>
          <div className="col-12 pick-hour">
            {rangeTime &&
              rangeTime.length > 0 &&
              rangeTime.map((item, index) => {
                return (
                  <button
                    className={item.isSelected === true ? "active" : ""}
                    key={index}
                    onClick={() => this.handleClickBtnTime(item)}
                  >
                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                  </button>
                );
              })}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => this.handleSaveSchedule()}
          >
            Lưu thông tin
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerSchedule);
