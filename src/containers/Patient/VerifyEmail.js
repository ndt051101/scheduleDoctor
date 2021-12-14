import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './VerifyEmail.scss';
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: 0,
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      const urlParams = new URLSearchParams(this.props.location.search);
      const token = urlParams.get("token");
      const doctorId = urlParams.get("doctorId");

      const res = await postVerifyBookAppointment({
        token: token,
        doctorId: doctorId,
      });

      if (res && res.errCode === 0) {
        this.setState({
          statusVerify: true,
          errCode: res.errCode,
        });
      } else {
        this.setState({
          statusVerify: true,
          errCode: res && res.errCode ? res.errCode : 2,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {}

  render() {
    const { statusVerify, errCode } = this.state;
    return (
      <>
        <HomeHeader />
        {statusVerify === false ? (
          <div>Loading...</div>
        ) : (
          <div>
            {errCode === 0 ? (
              <div className="intro-booking">Xác nhận lịch hẹn thành công!</div>
            ) : (
              <div className="intro-booking">Xác nhận lịch hẹn thất bại!</div>
            )}
          </div>
        )}
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
