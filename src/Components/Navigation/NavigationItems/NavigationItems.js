import React from 'react';
import classes from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";



const navigationItems = (props)=>{
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact>VIEW INTERVIEWS</NavigationItem>
            <NavigationItem link="/create">CREATE INTERVIEW</NavigationItem>
        </ul>
    )
}


export default navigationItems;