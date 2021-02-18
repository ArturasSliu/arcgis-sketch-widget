/** @jsx jsx */
import { AllWidgetProps, BaseWidget, jsx, React } from "jimu-core";
import { IMConfig } from "../config";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { Icon } from 'jimu-ui';

import Sketch = require("esri/widgets/Sketch");
import GraphicsLayer = require("esri/layers/GraphicsLayer");

interface IState {
  jimuMapView: JimuMapView;
  currentWidget: Sketch;

}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, any> {
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    this.state = {
      jimuMapView: null,
      currentWidget: null
    };
  }

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (this.state.jimuMapView) {
      // we have a "previous" map where we added the widget
      // (ex: case where two Maps in single Experience page and user is switching
      // between them in the dropdown) - we must destroy the old widget in this case.
      if (this.state.currentWidget) {
        this.state.currentWidget.destroy();
      }
    }

    if (jmv) {
      this.setState({
        jimuMapView: jmv
      });

      if(this.myRef.current) {
        // since the widget replaces the container, we must create a new DOM node
        // so when we destroy we will not remove the "ref" DOM node
        const container = document.createElement("div");
        this.myRef.current.appendChild(container);
        
        const addIcon = require('jimu-ui/lib/icons/add.svg');
        <Icon icon={addIcon} size="36" color="red" />
        
        const layer = new GraphicsLayer();
        jmv.view.map.add(layer);

        const sketch = new Sketch({
          view: jmv.view,
          container: container,
          creationMode: "update",
          layer: layer
        });
        
        // Save reference to the "Current widget" in State so we can destroy later if necessary.
        this.setState({
          currentWidget: sketch
        });
      } else {
        console.error('could not find this.myRef.current');
      }
    }
  };

  // activeViewChangeHandler is not called in the builder when "None" is selected
  // for the map, so we must cleanup here:
  componentDidUpdate = evt => {
    if (this.props.useMapWidgetIds.length === 0) {
      // "None" was selected in the "Select map widget" dropdown:
      if (this.state.currentWidget) {
        this.state.currentWidget.destroy();
      }
    }
  };

  render() {
    // If the user has selected a map, include JimuMapViewComponent.
    // If not, show a message asking for the Experience Author to select it.
    let jmc = <p>Please select a map.</p>;
    if(
      this.props.hasOwnProperty("useMapWidgetIds") &&
      this.props.useMapWidgetIds &&
      this.props.useMapWidgetIds.length === 1
    ){
      jmc = (
        <JimuMapViewComponent
          useMapWidgetIds={this.props.useMapWidgetIds}
          onActiveViewChange={this.activeViewChangeHandler}
        />
      );
    }

    return (
      <div
        className="widget-Sketch jimu-widget"
        style={{ overflow: "auto" }}
      >
        <div className="here" ref={this.myRef}></div>
        {jmc}
      </div>
    );
  }
}
