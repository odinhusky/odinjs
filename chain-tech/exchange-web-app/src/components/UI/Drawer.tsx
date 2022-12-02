import { Drawer } from "antd";

const DrawerComponent: React.FC<{
  isVisible: boolean;
  selectVisible: () => void;
  height: number;
}> = ({ isVisible, selectVisible, height, children }) => {
  return (
    <Drawer
      placement={"bottom"}
      onClose={selectVisible}
      visible={isVisible}
      closable={false}
      drawerStyle={{ background: "rgba(0, 0, 0, 0.45)" }}
      height={height}
      bodyStyle={{
        background: "#fff",
        borderRadius: "16px 16px 0 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {children}
    </Drawer>
  );
};

export default DrawerComponent;
