import { useNavigate, Navigate } from "react-router-dom";

type propsType = {
  route: null | String;
  children: JSX.Element;
};

export default function ProtectedRoute(props: propsType) {
  console.log("PROTECTED" + props.route);
  switch (props.route) {
    case null:
      return <Navigate to="/" replace />;
    case "signIn":
      return <Navigate to="/signIn" replace />;
    default:
      return props.children;
  }
}
