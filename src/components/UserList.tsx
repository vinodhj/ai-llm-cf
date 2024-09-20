import React from "react";

interface UserListProps {
  userList: string[];
}

const UserList: React.FC<UserListProps> = ({ userList }) => {
  return (
    <div className="user-list">
      {userList.map((message, index) => (
        <div key={index} className="user-item">
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
};

export default UserList;
