import { useAuth } from "../../contexts/AuthContext";

/**
 * Component hiển thị nội dung dựa trên role của user
 * @param {Array} allowedRoles - Danh sách các role được phép xem
 * @param {ReactNode} children - Nội dung cần hiển thị
 * @param {ReactNode} fallback - Nội dung hiển thị khi không có quyền
 */
const RoleBasedComponent = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return fallback;
};

export default RoleBasedComponent;

