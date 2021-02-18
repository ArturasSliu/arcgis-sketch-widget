import { React, FormattedMessage } from "jimu-core";
import { BaseWidgetSetting, AllWidgetSettingProps } from "jimu-for-builder";
import { Icon } from 'jimu-ui';

import defaultMessages from "./translations/default";
import {
  JimuMapViewSelector,
  SettingSection,
  SettingRow
} from "jimu-ui/advanced/setting-components";

export default class Setting extends BaseWidgetSetting<
  AllWidgetSettingProps<IMConfig>,
  any
> {
  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    });
    const addIcon = require('jimu-ui/lib/icons/add.svg');
    <Icon icon={addIcon} size="36" color="red" />
  };
  
  //<Icon icon={addIcon} size="36" color="red" />

  render() {
    return (
      <div className="widget-setting-Sketch">
        <SettingSection
          className="map-selector-section"
          title={this.props.intl.formatMessage({
            id: "selectMapWidget",
            defaultMessage: defaultMessages.selectMapWidget
          })}
        >
          <JimuMapViewSelector
            onSelect={this.onMapWidgetSelected}
            useMapWidgetIds={this.props.useMapWidgetIds}
          />
        </SettingSection>
      </div>
    );
  }
}
