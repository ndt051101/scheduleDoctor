import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils/constant";
import { changeLanguage } from "../../store/actions";
import { withRouter } from "react-router";


class HomeHeader extends Component {
  changeLanguage = (language) => {
    this.props.changeLanguage(language);
  };

  handleFromHome = () => {
    this.props.history.push('/home');
  }
  render() {
    let language = this.props.language;
    return (
      <>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <div
                className="header-logo"
                onClick={() => this.handleFromHome()}
              ></div>
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <FormattedMessage id="homeheader.specialty" />
                </div>
                <span>
                  <FormattedMessage id="homeheader.searchdoctor" />
                </span>
              </div>
              <div className="child-content">
                <div>Cơ sở y tế</div>
                <span>Chọn bệnh viện phòng khám</span>
              </div>
              <div className="child-content">
                <div>Bác sĩ</div>
                <span>Chọn bác sĩ giỏi</span>
              </div>
              <div className="child-content">
                <div>Gói khám</div>
                <span>Khám sức khỏe tổng quát</span>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="far fa-question-circle"></i>
                <span>Hỗ trợ</span>
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                  VN
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">NỀN TẢNG Y TẾ</div>
              <div className="title2">CHĂM SÓC SỨC KHỎE TOÀN DIỆN</div>
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Nhập cụm từ tìm kiếm" />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-home"></i>
                  </div>
                  <div className="text-child">Khám Chuyên khoa</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div className="text-child"> Khám từ xa</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="far fa-hospital"></i>
                  </div>
                  <div className="text-child">Khám tổng quát</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-magic"></i>
                  </div>
                  <div className="text-child">Xét nghiệm y học</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-brain"></i>
                  </div>
                  <div className="text-child">Sức khỏe tinh thần</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-tooth"></i>
                  </div>
                  <div className="text-child">Khám nha khoa</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguage: (data) => dispatch(changeLanguage(data)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
