/** @module usePermissions */

import { useSelector } from "react-redux";

const usePermissions = permission => {
  const { user } = useSelector(state => state.userState) ?? {};

  return (user.permissions ?? []).includes(permission);
};

export default usePermissions;
