import React from "react";
import HomeLayout from "./MyLayout";

const subNav = [
    {title: 'dashboard'}
];

const Dashboard = ()=>{

    
    return (
        <HomeLayout subItems={subNav}>    
            <div>Developing...</div>
        </HomeLayout>
    );

}

export default Dashboard;