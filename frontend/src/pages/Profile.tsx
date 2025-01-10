import { useAuthentication } from "../contexts/AuthContext";
import { UserInfoCard } from "../Profile/components/UserInfoCard";

export const Profile = () => {
  const { user } = useAuthentication();

  return (
    <div className="p-4 w-full flex flex-col items-center ">
      {(user && <UserInfoCard user={user} />) || <div>Loading...</div>}
    </div>
  );
};
