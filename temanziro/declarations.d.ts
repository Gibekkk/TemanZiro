declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

declare module "*.jpeg" {
  const value: any;
  export default value;
}

declare module "*.gif" {
  const value: any;
  export default value;
}

// declare module "*.svg" {
//   const value: any;
//   export default value;
// }

declare module "@ptomasroos/react-native-multi-slider" {
  import { Component } from "react";
  export default class MultiSlider extends Component<any> {}
}
