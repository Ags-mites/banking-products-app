const React = require('react');
const { View } = require('react-native');
const Svg = ({ children, ...props }) => React.createElement(View, props, children);
const Path = (props) => null;
const G = (props) => null;
const Circle = (props) => null;
module.exports = { default: Svg, Svg, Path, G, Circle };
