"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const NoDataIcon = () => {
  return /*#__PURE__*/_react.default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 100 100",
    width: "104",
    height: "74",
    fill: "gray"
  }, /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement("circle", {
    cx: "50",
    cy: "30",
    r: "28",
    stroke: "gray",
    strokeWidth: "4",
    fill: "none"
  }), /*#__PURE__*/_react.default.createElement("circle", {
    cx: "40",
    cy: "26",
    r: "2",
    fill: "gray"
  }), /*#__PURE__*/_react.default.createElement("circle", {
    cx: "60",
    cy: "26",
    r: "2",
    fill: "gray"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M38 38 Q50 48 62 38",
    stroke: "gray",
    strokeWidth: "3",
    fill: "none"
  }), /*#__PURE__*/_react.default.createElement("line", {
    x1: "41",
    y1: "64",
    x2: "57",
    y2: "80",
    stroke: "gray",
    strokeWidth: "3"
  }), /*#__PURE__*/_react.default.createElement("line", {
    x1: "41",
    y1: "80",
    x2: "57",
    y2: "64",
    stroke: "gray",
    strokeWidth: "3"
  }), /*#__PURE__*/_react.default.createElement("text", {
    x: "50",
    y: "95",
    textAnchor: "middle",
    fill: "gray",
    fontSize: "15"
  }, "Nothing To Show")));
};
var _default = exports.default = NoDataIcon;