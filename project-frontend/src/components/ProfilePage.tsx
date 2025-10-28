import React, {  type FC } from 'react';


interface IUserProfileProps {
    user: {
        id: number;
        email: string;
        userName: string;
        age: Date;
        weight: number;
        height: number;
        activityCoefId: number;
        dietId: number;
        caloriesStandard: number;
    };
   
}

const ProfilePage: FC<IUserProfileProps> = ({user}) => {
    return (
        <div>
           {user.userName}
        </div>
    );
}

export default ProfilePage;
