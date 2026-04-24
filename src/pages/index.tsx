import { Navigate, useLocation } from "react-router-dom";

export default function Index() {
  const location = useLocation();
  return <Navigate to={`/login${location.search}`} replace />
}
