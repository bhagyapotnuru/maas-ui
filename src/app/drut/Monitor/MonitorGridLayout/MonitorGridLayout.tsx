import { useState } from "react";

import { Responsive, WidthProvider } from "react-grid-layout";
import type RGL from "react-grid-layout";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import MonitorGridItem from "./MonitorGridItem";

import { postData } from "app/drut/config";

const ResponsiveGridLayout = WidthProvider(Responsive);

type Props = {
  configData: MonitorConfiguration | MonitorConfiguration[];
  onRemoveWidget: (value: number) => void;
  onMinimizeWidget: (value: number) => void;
  onPinWidgetHandler: (value: number) => void;
};

const MonitorGridLayout = ({
  configData,
  onRemoveWidget,
  onMinimizeWidget,
  onPinWidgetHandler,
}: Props): JSX.Element => {
  const [gridlayoutKey, setGridlayoutKey] = useState("Grid_layout_body");
  const [resizedWidget, setReSizedWidget] = useState(
    {} as MonitorConfiguration
  );

  const onLayoutChangeHandler = async (
    currentLayouts: RGL.Layout[],
    allLayouts: RGL.Layouts
  ) => {
    const resizedWidget: MonitorConfiguration | undefined = (
      configData as MonitorConfiguration[]
    )
      .filter((config: MonitorConfiguration) => config.display)
      .find((prevConfig: MonitorConfiguration) => {
        const currLayout: RGL.Layout | undefined = currentLayouts.find(
          (currConfig) => +currConfig.i === +prevConfig.id
        );
        return (
          currLayout?.h !== prevConfig.gridlayout.h ||
          currLayout?.w !== prevConfig.gridlayout.w
        );
      });

    const monitorLayoutConfig: any[] = currentLayouts.map(
      (layout: ReactGridLayout.Layout) => {
        const defaultLayout = getDefaultLayoutValues(
          configData as MonitorConfiguration[],
          layout
        );
        layout.minH = defaultLayout.minH;
        layout.minW = defaultLayout.minW;
        layout.h = defaultLayout.h;
        return {
          id: +layout.i,
          gridlayout: layout,
        };
      }
    );
    try {
      await postData("dfab/clusters/?op=set_gridlayout", {
        Clusters: monitorLayoutConfig,
      });
      if (resizedWidget) {
        setReSizedWidget({ ...resizedWidget });
      }
    } catch (e) {
    } finally {
    }
  };

  const getDefaultLayoutValues = (
    configData: MonitorConfiguration[],
    layout: ReactGridLayout.Layout
  ) => {
    const monitorConfig = configData.find((config) => config.id === +layout.i);

    switch (monitorConfig?.cluster_type) {
      case "Maas":
        return {
          minH: 9,
          minW: 6,
          h: 9,
        };
      case "Ceph":
      case "Kubernetes":
      case "OpenStack":
        return {
          minH: 11,
          minW: 12,
          h: layout.h,
        };
      default:
        return {
          minH: 9,
          minW: 6,
          h: layout.h,
        };
    }
  };

  const onPinHandler = (value: number) => {
    setGridlayoutKey(`Grid_layout_body_${Math.random()}`);
    onPinWidgetHandler(value);
  };

  const generateLayout = () => {
    return (configData as MonitorConfiguration[]).map(
      (config) => config.gridlayout
    ) as any[];
  };

  return (
    <div className="grid-layout-body" key={gridlayoutKey}>
      {configData && (configData as MonitorConfiguration[]).length > 0 && (
        <ResponsiveGridLayout
          key={`Grid_Layout_${Math.random}`}
          className="layout"
          rowHeight={30}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          allowOverlap={false}
          onLayoutChange={onLayoutChangeHandler}
          layouts={{ lg: generateLayout() }}
        >
          {(configData as MonitorConfiguration[])
            .filter((config: MonitorConfiguration) => config.display)
            .map((config: MonitorConfiguration) => (
              <div
                key={config.id}
                data-grid={config.gridlayout}
                className={
                  config.cluster_type === "Maas"
                    ? `grid-item machine-summary-pie`
                    : `grid-item`
                }
              >
                <MonitorGridItem
                  resizedWidget={resizedWidget}
                  configData={config}
                  onRemoveWidget={onRemoveWidget}
                  onMinimizeWidget={onMinimizeWidget}
                  onPinWidgetHandler={onPinHandler}
                />
              </div>
            ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
};

export default MonitorGridLayout;
