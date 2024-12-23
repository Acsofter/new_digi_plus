import { useAuthentication } from "../contexts/AuthContext";

import { UserInfo } from "../Profile/components/UserInfo";

export const Profile = () => {
  const { user } = useAuthentication();

  return (
    <div className="p-4 w-full flex flex-col items-center">
      {(user && <UserInfo user={user} />) || <div>Loading...</div>}
    </div>
  );
};
